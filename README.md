# Explainable VLA in Auto Driving 

```
이 리포지토리는 지능형 도로 이해 Vision-Language-Driving를 위한 workspace 입니다.
```

## References

The following documents and resources were referred to during this project

| Type | Document | Link |
|------|----------|------|
| Research Paper | OpenDriveVLA | [Blog](https://xnoeyes.tistory.com/27) |
| Research Paper | Multimodal-XAD | [Blog](https://xnoeyes.tistory.com/26) |
| Research Paper | UniAD |  |
| Library | MMCV 1.7.2 | [MMCV Docs](https://mmcv.readthedocs.io/) |
| Library | MMDetection3D 1.0.0rc6 | [GitHub Repo](https://github.com/open-mmlab/mmdetection3d) |

---

## Datasets

The datasets used or referred to in this project are listed below

| Name | Link |
|------|------|
| 생활도로 객체인식 자율주행 데이터 | [AI Hub](https://www.aihub.or.kr/aihubdata/data/view.do?srchOptnCnd=OPTNCND001&currMenu=115&topMenu=100&searchKeyword=%EC%A3%BC%ED%96%89&aihubDataSe=data&dataSetSn=71784) |
| 승용 자율주행차 악천후 데이터 | [AI Hub](https://www.aihub.or.kr/aihubdata/data/view.do?srchOptnCnd=OPTNCND001&currMenu=115&topMenu=100&searchKeyword=%EC%A3%BC%ED%96%89&aihubDataSe=data&dataSetSn=71626) |
---

## Main Datasets Structure

```
datasets/
├── vqa/
│   ├── caption_images
│   ├── captions
│
├── object_detection/
│   ├── images
│   ├── labels
├── train_txt
├── val_txt
├── data.yaml

```

---


