import os
import json
from glob import glob
from tqdm import tqdm
from deep_translator import GoogleTranslator  

input_dir = r"C:\Users\sen\Desktop\pbl_2\datasets\captions"
output_path = os.path.join(input_dir, "captions_english.json")

translator = GoogleTranslator(source='ko', target='en')
all_items = []

for file in tqdm(glob(os.path.join(input_dir, "*.json"))):
    with open(file, "r", encoding="utf-8") as f:
        data = json.load(f)

    images = data.get("images", [])
    props = data.get("image_properties", [])

    for img, prop in zip(images, props):
        if prop.get("name") == "imageCaption" and prop.get("type") == "free response":
            korean_text = prop.get("value", "").strip()

            try:
                english_text = translator.translate(korean_text)
            except Exception as e:
                print(f"[번역 실패] {file}: {e}")
                english_text = korean_text  # 번역 실패 -> 원문 그대로

            item = {
                "id": img["id"],
                "image": img["file_name"].replace("230906_1_modify_caption/", "caption_images/"),
                "question": "What is the current road situation?",
                "answer": english_text
            }
            all_items.append(item)

with open(output_path, "w", encoding="utf-8") as f:
    json.dump(all_items, f, ensure_ascii=False, indent=2)

print(f"Saved {len(all_items)} samples to {output_path}")
