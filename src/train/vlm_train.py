from config.config import PathConfig
from model.model_utils import load_model_and_processor
from model.collator import VLMCollator
from data.vlm_data import VLMJsonlDataset
from transformers import Trainer, TrainingArguments
import os

def main():
    cfg = PathConfig()

    model, processor = load_model_and_processor("Qwen/Qwen2-VL-7B-Instruct", use_4bit=True)
    train_ds = VLMJsonlDataset(cfg.train_json, cfg)
    val_ds   = VLMJsonlDataset(cfg.val_json, cfg)
    collator = VLMCollator(processor=processor)

    os.makedirs(cfg.output_dir, exist_ok=True)

    args = TrainingArguments(
        output_dir=cfg.output_dir,
        num_train_epochs=3,
        per_device_train_batch_size=2,
        per_device_eval_batch_size=2,
        gradient_accumulation_steps=8,
        learning_rate=2e-4,
        lr_scheduler_type="cosine",
        warmup_ratio=0.03,
        bf16=True,
        logging_steps=20,
        evaluation_strategy="steps",
        eval_steps=200,
        save_steps=200,
        save_total_limit=2,
        gradient_checkpointing=True,
        report_to="none",
    )

    trainer = Trainer(
        model=model,
        args=args,
        train_dataset=train_ds,
        eval_dataset=val_ds,
        data_collator=collator,
    )

    trainer.train()
    model.save_pretrained(f"{cfg.output_dir}/lora_adapter")
    processor.save_pretrained(cfg.output_dir)

    print(f"[INFO] Training complete — saved to {cfg.output_dir}")

if __name__ == "__main__":
    main()
