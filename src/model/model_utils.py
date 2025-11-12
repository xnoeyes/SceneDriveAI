import torch
from transformers import Qwen2VLForConditionalGeneration, AutoProcessor, BitsAndBytesConfig
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training

def load_model_and_processor(base_model: str, use_4bit=True):
    quant_cfg = None
    if use_4bit:
        quant_cfg = BitsAndBytesConfig(
            load_in_4bit=True,
            bnb_4bit_use_double_quant=True,
            bnb_4bit_compute_dtype=torch.bfloat16,
            bnb_4bit_quant_type="nf4",
        )

    model = Qwen2VLForConditionalGeneration.from_pretrained(
    base_model,
    torch_dtype=torch.bfloat16,
    trust_remote_code=True,
    quantization_config=quant_cfg,
    device_map="auto",
    )

    processor = AutoProcessor.from_pretrained(base_model, trust_remote_code=True)

    for n, p in model.named_parameters():
        lname = n.lower()
        if any(k in lname for k in ["vision", "visual", "vit", "image", "encoder.visual"]):
            p.requires_grad = False

    if use_4bit:
        model = prepare_model_for_kbit_training(model)

    lora_cfg = LoraConfig(
        r=8,
        lora_alpha=16,
        lora_dropout=0.05,
        target_modules=["q_proj", "k_proj", "v_proj", "o_proj"],
        bias="none",
        task_type="CAUSAL_LM",
    )
    model = get_peft_model(model, lora_cfg)
    model.print_trainable_parameters()
    return model, processor
