from PIL import Image
import torch
from dataclasses import dataclass
from typing import Any, Dict, List, Optional

@dataclass
class VLMCollator:
    processor: Any
    pad_to_multiple_of: Optional[int] = 8

    def __call__(self, batch: List[Dict[str, Any]]) -> Dict[str, torch.Tensor]:
        images = []
        for b in batch:
            img = b["image"]
            if isinstance(img, Image.Image):
                img = img.resize((448, 448), Image.BICUBIC)
            images.append(img)

        prompts = [b["prompt"] for b in batch]
        targets = [b["target"] for b in batch]
        texts = [p + t for p, t in zip(prompts, targets)]

        enc = self.processor(images=images, text=texts, return_tensors="pt", padding=True)
        tgt = self.processor(text=targets, return_tensors="pt", padding=True)
        labels = enc["input_ids"].clone()
        labels[:] = -100
        for i in range(labels.size(0)):
            tgt_len = (tgt["input_ids"][i] != self.processor.tokenizer.pad_token_id).sum()
            seq_len = (enc["input_ids"][i] != self.processor.tokenizer.pad_token_id).sum()
            labels[i, seq_len - tgt_len: seq_len] = enc["input_ids"][i, seq_len - tgt_len: seq_len]

        return {
            "input_ids": enc["input_ids"],
            "attention_mask": enc["attention_mask"],
            "pixel_values": enc["pixel_values"],
            "image_grid_thw": enc.get("image_grid_thw"), 
            "labels": labels,
        }
