import os
import subprocess
import os
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"
os.environ["OMP_NUM_THREADS"] = "1"

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
    "verbose=True",
    "workers=0"

]

subprocess.run(cmd)
