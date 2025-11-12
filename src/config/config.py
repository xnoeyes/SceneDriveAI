from dataclasses import dataclass

@dataclass
class PathConfig:
    dataset_root: str = "/home/sen/sen2025/pbl2/datasets"
    image_root: str = f"{dataset_root}/caption_img"
    train_json: str = f"{dataset_root}/captions/train.json"
    val_json: str   = f"{dataset_root}/captions/val.json"
    yolo_weight: str = "/home/sen/sen2025/pbl2/runs/detect/bbox11_nocopy2/weights/best.pt"
    output_dir: str = "outputs/qwen2vl_roadscene_lora_yolo"
