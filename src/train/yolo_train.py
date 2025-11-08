import os
import subprocess

DATASET_DIR = "datasets"
yaml_path = os.path.join(DATASET_DIR, "data.yaml")

cmd = [
    "yolo", "detect", "train",
    "model=yolov8n.pt",
    f"data={yaml_path}",
    "epochs=100",
    "imgsz=640",
    "batch=16",
    "patience=10",
    "save=True",
    "plots=True",
    "project=runs/detect",
    "name=bbox3_nocopy",
    "verbose=True"
]

subprocess.run(cmd)
