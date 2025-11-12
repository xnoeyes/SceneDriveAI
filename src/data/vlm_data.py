from config.config import PathConfig
from ultralytics import YOLO
from torch.utils.data import Dataset
from PIL import Image
import json, os
from data.utils_prompt import format_objects_text, build_prompt

class VLMJsonlDataset(Dataset):
    def __init__(self, json_path: str, config: PathConfig = PathConfig()):
        self.samples = json.load(open(json_path, "r", encoding="utf-8"))
        print(f"[INFO] Loaded {len(self.samples)} samples from {json_path}")

        self.image_root = config.image_root
        self.yolo = YOLO(config.yolo_weight)
        print(f"[INFO] YOLO model loaded: {config.yolo_weight}")

    def __getitem__(self, idx):
        ex = self.samples[idx]
        img_path = os.path.join(self.image_root, ex["image"])
        image = Image.open(img_path).convert("RGB")

        results = self.yolo(img_path, verbose=False)
        objects = [
            {
                "cls": self.yolo.names[int(b.cls)],
                "bbox": b.xywh[0].tolist(),
                "conf": float(b.conf),
            }
            for r in results for b in r.boxes
        ]

        objects_text = format_objects_text(objects)
        prompt = build_prompt(objects_text, ex.get("caption", ""), ex.get("question", ""))
        answer = ex.get("answer", "").strip()
        target_text = answer + "</assistant>"

        return {"image": image, "prompt": prompt, "target": target_text}

    def __len__(self):
        return len(self.samples)
