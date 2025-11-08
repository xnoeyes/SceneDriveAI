import os
import json
import random
from tqdm import tqdm

DATASET_DIR = "datasets"
IMG_DIR = os.path.join(DATASET_DIR, "images")
ANN_DIR = os.path.join(DATASET_DIR, "annotations")
YOLO_LABEL_DIR = os.path.join(DATASET_DIR, "labels")

os.makedirs(YOLO_LABEL_DIR, exist_ok=True)

json_files = [f for f in os.listdir(ANN_DIR) if f.endswith(".json")]
random.seed(42)
random.shuffle(json_files)

split_idx = int(len(json_files) * 0.7)
train_files = json_files[:split_idx]
val_files = json_files[split_idx:]

print(f"[INFO] 전체 {len(json_files)}개 중 Train={len(train_files)}, Val={len(val_files)}")

# category_id → BoundingBox mapping 
CATEGORY_MAP = {
    3: "car-b",                   # Car
    2: "Two-wheel Vehicle-b",     # Two-wheel Vehicle
    97: "Pedestrian-b",           # Kid student
    98: "Pedestrian-b"            # Adult
}

TARGET_CATEGORIES = ["car-b", "Two-wheel Vehicle-b", "Pedestrian-b"]
category_map = {name: i for i, name in enumerate(TARGET_CATEGORIES)}

def convert_bbox(img_w, img_h, bbox):
    x, y, w, h = bbox
    x_center = (x + w / 2) / img_w
    y_center = (y + h / 2) / img_h
    w /= img_w
    h /= img_h
    return x_center, y_center, w, h

def convert_json_to_yolo(json_path, list_file):
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    img_info = data["images"][0]
    img_name = os.path.basename(img_info["file_name"])
    img_path = os.path.join(DATASET_DIR, "images", img_name)
    img_w, img_h = img_info["width"], img_info["height"]

    label_name = os.path.splitext(img_name)[0] + ".txt"
    label_path = os.path.join(YOLO_LABEL_DIR, label_name)

    if os.path.exists(label_path):
        return

    wrote_any = False
    with open(label_path, "w") as out_f:
        for ann in data.get("annotations", []):
            cid = ann["category_id"]
            if cid not in CATEGORY_MAP:
                continue

            cat_name = CATEGORY_MAP[cid]
            cat_id = category_map[cat_name]

            x_c, y_c, w, h = convert_bbox(img_w, img_h, ann["bbox"])
            out_f.write(f"{cat_id} {x_c:.6f} {y_c:.6f} {w:.6f} {h:.6f}\n")
            wrote_any = True

    if os.path.exists(img_path) and wrote_any:
        list_file.write(f"{img_path}\n")

train_list = open(os.path.join(DATASET_DIR, "train.txt"), "w", encoding="utf-8")
val_list = open(os.path.join(DATASET_DIR, "val.txt"), "w", encoding="utf-8")

for js in tqdm(train_files, desc="Train 변환"):
    convert_json_to_yolo(os.path.join(ANN_DIR, js), train_list)
for js in tqdm(val_files, desc="Val 변환"):
    convert_json_to_yolo(os.path.join(ANN_DIR, js), val_list)

train_list.close()
val_list.close()

abs_dir = os.path.abspath(DATASET_DIR)
yaml_path = os.path.join(DATASET_DIR, "data.yaml")
with open(yaml_path, "w", encoding="utf-8") as f:
    f.write(f"""train: {abs_dir}/train.txt
val: {abs_dir}/val.txt

nc: 3
names:
  - car-b
  - Two-wheel Vehicle-b
  - Pedestrian-b
""")

print("[INFO] 라벨 변환 완료 및 data.yaml 생성")
