import os
os.environ["CUDA_VISIBLE_DEVICES"] = "1"
os.environ["PYTORCH_CUDA_ALLOC_CONF"] = "expandable_segments:True,max_split_size_mb:128"

from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

from ultralytics import YOLO
from PIL import Image
import io
import torch
from transformers import (
    AutoProcessor,
    AutoModelForVision2Seq,
    BitsAndBytesConfig,
)
from peft import PeftModel


from src.data.utils_prompt import format_objects_text, build_prompt

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = "models/best.pt"  
print(f"[YOLO] Loading model from {MODEL_PATH} (CPU)...")
model = YOLO(MODEL_PATH)
model.to("cpu")  

class Box(BaseModel):
    class_: str
    confidence: float
    bbox: List[float]  # [x_min, y_min, x_max, y_max] (0~1 normalized)


class DetectResponse(BaseModel):
    boxes: List[Box]


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/detect", response_model=DetectResponse)
async def detect_objects(file: UploadFile = File(...)):
    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    width, height = image.size


    results = model(image)
    r = results[0]

    xyxy = r.boxes.xyxy.cpu().numpy()          # (N, 4) [x1,y1,x2,y2] in pixels
    confs = r.boxes.conf.cpu().numpy()        # (N,)
    clses = r.boxes.cls.cpu().numpy().astype(int)
    names = r.names                            # {class_idx: "Car", ...}

    boxes: List[Box] = []

    for (x1, y1, x2, y2), conf, cls_idx in zip(xyxy, confs, clses):
        x_min_norm = float(x1 / width)
        y_min_norm = float(y1 / height)
        x_max_norm = float(x2 / width)
        y_max_norm = float(y2 / height)

        boxes.append(
            Box(
                class_=names[int(cls_idx)],
                confidence=float(conf),
                bbox=[x_min_norm, y_min_norm, x_max_norm, y_max_norm],
            )
        )

    return DetectResponse(boxes=boxes)


BASE_MODEL = "Qwen/Qwen2-VL-7B-Instruct"
PROCESSOR_PATH = "models/qwen2vl_roadscene_lora_yolo_1"
LORA_PATH = "models/qwen2vl_roadscene_lora_yolo_1/lora_adapter"

print("[VLM] Loading processor...")
processor = AutoProcessor.from_pretrained(
    PROCESSOR_PATH,      
    trust_remote_code=True,
)

print("[VLM] Setting up 4bit quantization config...")
bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_compute_dtype=torch.bfloat16,  
    bnb_4bit_use_double_quant=True,
    bnb_4bit_quant_type="nf4",
)

print(f"[VLM] Loading 4bit base model from {BASE_MODEL}...")
base_vlm = AutoModelForVision2Seq.from_pretrained(
    BASE_MODEL,
    quantization_config=bnb_config,
    device_map="auto",     
    trust_remote_code=True,
)

print(f"[VLM] Loading LoRA adapter from {LORA_PATH}...")
vlm = PeftModel.from_pretrained(
    base_vlm,
    LORA_PATH,
)
vlm.eval()

vlm_device = next(vlm.parameters()).device

class VLMResponse(BaseModel):
    answer: str


@app.post("/vlm-analyze", response_model=VLMResponse)
async def vlm_analyze(
    file: UploadFile = File(...),
    question: str = Form(...),
):
    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    width, height = image.size

    yolo_results = model(image)
    r = yolo_results[0]

    xywhn = r.boxes.xywhn.cpu().numpy()        # (N, 4) [xc,yc,w,h] in [0,1]
    confs = r.boxes.conf.cpu().numpy()
    clses = r.boxes.cls.cpu().numpy().astype(int)
    names = r.names

    # {"cls": str, "conf": float, "bbox": [xc, yc, w, h]}
    objects = []
    for (xc, yc, w, h), conf, cls_idx in zip(xywhn, confs, clses):
        objects.append(
            {
                "cls": names[int(cls_idx)],
                "conf": float(conf),
                "bbox": [float(xc), float(yc), float(w), float(h)],
            }
        )

    objects_text = format_objects_text(objects)
    prompt = build_prompt(
        objects_text=objects_text,
        caption=None,
        question=question,
    )

    vlm_image = image.resize((448, 448), Image.BICUBIC)

    inputs = processor(
        text=prompt,
        images=vlm_image,
        return_tensors="pt",
    )
    inputs = {k: v.to(vlm_device) for k, v in inputs.items()}

    torch.cuda.empty_cache()
    with torch.inference_mode():
        output_ids = vlm.generate(
            **inputs,
            max_new_tokens=128,   
            do_sample=False,
        )

    decoded = processor.batch_decode(
        output_ids,
        skip_special_tokens=True,
    )[0]

    if "<assistant>" in decoded:
        answer = decoded.split("<assistant>")[-1].strip()
    else:
        answer = decoded.strip()

    return VLMResponse(answer=answer)
