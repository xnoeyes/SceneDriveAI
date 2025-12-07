from config.train_config import PathConfig
from torch.utils.data import Dataset
from PIL import Image
import json, os
from data.utils_prompt import format_objects_text, build_prompt


class VLMJsonlDataset(Dataset):
    def __init__(self, json_path: str, config: PathConfig = PathConfig(), use_yolo_cache=True):
        self.samples = json.load(open(json_path, "r", encoding="utf-8"))
        print(f"[INFO] Loaded {len(self.samples)} samples from {json_path}")

        self.image_root = config.image_root

        if use_yolo_cache:
            if "train" in json_path:
                yolo_path = config.train_yolo_json
            else:
                yolo_path = config.val_yolo_json

            if os.path.exists(yolo_path):
                print(f"[INFO] Using YOLO cached detections: {yolo_path}")
                self.yolo_cache = json.load(open(yolo_path, "r", encoding="utf-8"))
            else:
                raise FileNotFoundError(f"[ERROR] YOLO cache not found: {yolo_path}")
        else:
            self.yolo_cache = {}

    def __getitem__(self, idx):
        ex = self.samples[idx]
        img_rel_path = ex["image"]
        if img_rel_path.startswith("caption_images/"):
            img_rel_path = img_rel_path.replace("caption_images/", "")

        img_path = os.path.join(self.image_root, img_rel_path)
        image = Image.open(img_path).convert("RGB")
        objects = self.yolo_cache.get(ex["image"], [])
        objects_text = format_objects_text(objects)

        prompt = build_prompt(objects_text, ex.get("caption", ""), ex.get("question", ""))
        answer = ex.get("answer", "").strip()
        target_text = answer + "</assistant>"

        return {"image": image, "prompt": prompt, "target": target_text}

    def __len__(self):
        return len(self.samples)
