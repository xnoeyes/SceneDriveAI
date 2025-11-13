import os
import json
import torch
from PIL import Image
from transformers import AutoProcessor, AutoModelForVision2Seq
from src.data.utils_prompt import format_objects_text, build_prompt

BASE_MODEL = "Qwen/Qwen2-VL-7B-Instruct"
OUT_DIR = "/home/sen/sen2025/pbl2/outputs/qwen2vl_roadscene_lora_yolo"

IMAGE_DIR = "/home/sen/sen2025/pbl2/datasets/caption_images_test"
YOLO_JSON = "/home/sen/sen2025/pbl2/datasets/captions/test_yolo.json"

QUESTION = "What is the current road situation?"

SAVE_JSON = "/home/sen/sen2025/pbl2/outputs/infer_results.json"   # 저장 경로

print("[INFO] Loading processor...")
processor = AutoProcessor.from_pretrained(OUT_DIR)

print("[INFO] Loading model...")
model = AutoModelForVision2Seq.from_pretrained(
    BASE_MODEL,
    torch_dtype=torch.bfloat16,  
    device_map="cuda",
)

print("[INFO] Loading LoRA adapter...")
model.load_adapter(f"{OUT_DIR}/lora_adapter", "lora")
model.to("cuda").eval()

# Load YOLO cache
yolo_cache = json.load(open(YOLO_JSON, "r", encoding="utf-8"))
image_files = sorted(list(yolo_cache.keys()))

results = {}

for img_file in image_files:
    img_path = os.path.join(IMAGE_DIR, img_file)

    image = Image.open(img_path).convert("RGB")
    image = image.resize((448, 448), Image.BICUBIC)

    # Load objects
    objects = yolo_cache[img_file]
    object_text = format_objects_text(objects)

    # Build prompt
    prompt = build_prompt(
        objects_text=object_text,
        caption=None,
        question=QUESTION,
    )

    # Encode inputs
    inputs = processor(
        text=prompt,
        images=image,
        return_tensors="pt"
    ).to("cuda")

    # Model generate
    with torch.no_grad():
        output = model.generate(
            **inputs,
            max_new_tokens=128,
            do_sample=False,
        )

    answer = processor.decode(output[0], skip_special_tokens=True)

    results[img_file] = {
        "objects": objects,
        "answer": answer,
        "prompt": prompt,
    }

with open(SAVE_JSON, "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

