from ultralytics import YOLO
import os
import pandas as pd
import shutil

base_dir = r"/home/sen/sen2025/pbl2"
val_txt = os.path.join(base_dir, "datasets", "val.txt")
img_dir = os.path.join(base_dir, "datasets", "images")
model_path = os.path.join(base_dir, "runs", "detect", "bbox11_nocopy2", "weights", "best.pt")

with open(val_txt, "r", encoding="utf-8") as f:
    image_names = [line.strip() for line in f if line.strip()]

image_paths = [
    p if os.path.isabs(p) else os.path.join(img_dir, os.path.basename(p))
    for p in image_names
]

model = YOLO(model_path)

save_root = os.path.join(base_dir, "runs", "detect")
pred_dir = os.path.join(save_root, "val_preds")     
copy_dir = os.path.join(save_root, "val_images")   
csv_path = os.path.join(save_root, "val_predictions.csv")

os.makedirs(pred_dir, exist_ok=True)
os.makedirs(copy_dir, exist_ok=True)

batch_size = 50  
all_data = []

for i in range(0, len(image_paths), batch_size):
    batch = image_paths[i:i+batch_size]
    results = model.predict(
        source=batch,
        save=True,
        conf=0.4,
        imgsz=640,
        project=pred_dir,   
        name="",            
        exist_ok=True
    )

    for r in results:
        image_name = os.path.basename(r.path)

        shutil.copy(r.path, os.path.join(copy_dir, image_name))

        for box in r.boxes:
            cls_id = int(box.cls)
            conf = float(box.conf)
            xyxy = box.xyxy[0].tolist()
            all_data.append({
                "image": image_name,
                "class_id": cls_id,
                "class_name": model.names[cls_id],
                "confidence": round(conf, 3),
                "x1": round(xyxy[0], 2),
                "y1": round(xyxy[1], 2),
                "x2": round(xyxy[2], 2),
                "y2": round(xyxy[3], 2),
            })

df = pd.DataFrame(all_data)
df.to_csv(csv_path, index=False, encoding="utf-8-sig")
