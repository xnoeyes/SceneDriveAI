from typing import List, Dict, Any, Optional

def format_objects_text(objects: List[Dict[str, Any]], topk: int = 3) -> str:
    objs = sorted(objects, key=lambda o: float(o.get("conf", 0.0)), reverse=True)[:topk]
    lines = []
    for i, o in enumerate(objs, 1):
        cls = o.get("cls", "object")
        bbox = o.get("bbox", [])
        conf = o.get("conf", None)
        if len(bbox) == 4:
            xc, yc, w, h = bbox
            lines.append(f"{i}) {cls} @ (xc={xc:.3f}, yc={yc:.3f}, w={w:.3f}, h={h:.3f}, conf={conf:.2f})")
        else:
            lines.append(f"{i}) {cls} @ {bbox} conf={conf}")
    return "Objects:\n" + ("\n".join(lines) if lines else "None")

def build_prompt(objects_text: str, caption: Optional[str], question: str) -> str:
    sys = (
    "You are an assistant that answers questions about road-driving scenes. " 
    "Rely only on the provided object annotations and, if available, the caption. "
    "Do not imagine or infer anything that is not visible in the current scene; "
    "describe only what can be observed."   
    )
    cap = f'\n[Caption]\n{caption}' if caption and caption.strip() else ''
    usr = f"{objects_text}{cap}\n\n[Question]\n{question}\n"
    return f"<system>\n{sys}\n</system>\n<user>\n{usr}</user>\n<assistant>\n"
