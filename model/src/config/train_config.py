from dataclasses import dataclass

@dataclass
class PathConfig:
    train_json: str = "/home/sen/sen2025/pbl2/datasets/captions/train.json"
    val_json: str   = "/home/sen/sen2025/pbl2/datasets/captions/val.json"
    image_root: str = "/home/sen/sen2025/pbl2/datasets/caption_images"
    yolo_weight: str = "/home/sen/sen2025/pbl2/runs/detect/bbox11_nocopy2/weights/best.pt"
    output_dir: str = "/home/sen/sen2025/pbl2/outputs/qwen2vl_roadscene_lora_yolo"

    @property
    def train_yolo_json(self):
        return self.train_json.replace(".json", "_yolo.json")

    @property
    def val_yolo_json(self):
        return self.val_json.replace(".json", "_yolo.json")
