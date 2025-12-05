// src/YOLODetails.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import FadeInSection from "./FadeInSection"; 

// AI Hub 생활도로 소분류 11개 클래스 비율
const CLASS_DISTRIBUTION = [
  { name: "Two-wheel Vehicle", value: 2.88 },
  { name: "Car", value: 50.31 },
  { name: "TruckBus", value: 6.87 },
  { name: "Traffic Light", value: 1.12 },
  { name: "Traffic Sign", value: 5.04 },
  { name: "Parking space", value: 0.71 },
  { name: "Speed bump", value: 3.04 },
  { name: "kid student", value: 0.21 },
  { name: "Adult", value: 19.81 },
  { name: "Personal Mobility", value: 5.40 },
  { name: "Crosswalk", value: 4.59 },
];

function YOLODetails() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 text-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-10 md:py-16">
        {/* Top Nav / Back */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-extrabold text-gray-900">
            SceneDrive <span className="text-primary">AI</span>
          </h1>
          <Link
            to="/"
            className="text-sm md:text-base text-primary hover:text-secondary font-medium transition-colors"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Intro Section */}
        <section className="mb-12">
          <FadeInSection>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                YOLO-based Object Perception
              </h2>
              <p className="text-gray-600 leading-relaxed text-sm">
                본 페이지는 YOLO11s 모델을 기반으로 한 자율주행 객체 인식 파이프라인을 소개합니다.<br />
                실제 디텍션 데모는 제외하고 데이터셋 구성, 학습 방법, 성능 개선 흐름 등 <br />
                기술적 요소만을 직관적으로 설명합니다.
              </p>
            </div>
            <div className="flex-1">
              {/* Architecture diagram */}
              <div className="flex-1 flex items-center justify-center">
                <img
                  src="images/yolo_ar.png" // 네가 저장한 파일 이름/경로로 수정
                  alt="SceneDrive AI YOLO11s Architecture"
                  className="w-full max-w-[1200px] md:max-w-[1200px] object-contain"
                />
              </div>
            </div>
          </div>
        </FadeInSection>
      </section>

        {/* Dataset Overview */}
        <section className="mb-12">
          <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-4">
            Datasets Overview
          </h3>
          <FadeInSection>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-6 md:p-8">
            <p className="text-gray-600 mb-4">
              본 모델은{" "}
              <span className="font-semibold text-gray-900">
                40만장 이상의 실제 도로 주행 이미지
              </span>
              로 학습되었습니다. 데이터는{" "}
              <span className="font-semibold text-gray-900">
                AI Hub 생활도로 객체인식 데이터셋
              </span>
              이며, 보행자, 차량, 교통시설물을 포함합니다.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Size
                </p>
                <p className="text-m font-medium text-gray-900">400K+</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Major Category
                </p>
                <p className="text-m font-medium text-gray-900">
                  보행자, 차량, 교통시설물
                </p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                   Source
                </p>
                <a
                  href="https://www.aihub.or.kr/aihubdata/data/view.do?srchOptnCnd=OPTNCND001&currMenu=115&topMenu=100&searchKeyword=%EC%A3%BC%ED%96%89&aihubDataSe=data&dataSetSn=71784"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-m font-medium text-gray-900 hover:text-primary hover:underline"
                >
                  AI Hub 생활도로 객체인식
                </a>
              </div>
            </div>

            {/* 소분류 11개 클래스 바 차트 */}
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-1">
                Class Distribution
              </p>
              <p className="text-[11px] text-slate-500 mb-3">
                AI Hub 생활도로 객체인식 데이터셋 기준, 각 객체 클래스별 라벨 비율입니다.
              </p>
              <div className="w-full h-80 rounded-xl bg-slate-50 border border-slate-100 px-3 py-3">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={CLASS_DISTRIBUTION}
                    layout="vertical"
                    margin={{ top: 5, right: 20, left: 80, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      type="number"
                      tickFormatter={(v) => `${v}%`}
                      tick={{ fontSize: 11 }}
                    />
                    <YAxis
                      dataKey="name"
                      type="category"
                      tick={{ fontSize: 11 }}
                      width={110}
                    />
                    <Tooltip
                      formatter={(value) => `${value.toFixed(2)} %`}
                      labelStyle={{ fontSize: 12 }}
                    />
                    <Bar
                      dataKey="value"
                      radius={[4, 4, 4, 4]}
                      fill="#3b82f6"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </FadeInSection>
      </section>


        {/* Model Performance */}
        <section className="mb-12">
          <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-4">
            Model Performance
          </h3>
          <FadeInSection>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-6 md:p-8">
            <p className="text-gray-600 mb-6">
              가벼운 모델임에도 불구하고
              <span className="font-semibold text-gray-900"> 높은 정확도와 실시간 처리 성능</span>
              을 달성했습니다.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                <p className="text-xs uppercase text-slate-500 mb-1">Precision</p>
                <p className="text-lg font-semibold text-gray-900 mb-1">0.707 → 0.768</p>
                <p className="text-[11px] text-emerald-600 font-medium">오탐 감소</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                <p className="text-xs uppercase text-slate-500 mb-1">Recall</p>
                <p className="text-lg font-semibold text-gray-900 mb-1">0.496 → 0.694</p>
                <p className="text-[11px] text-emerald-600 font-medium">누락 감소</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                <p className="text-xs uppercase text-slate-500 mb-1">mAP50</p>
                <p className="text-lg font-semibold text-gray-900 mb-1">0.539 → 0.743</p>
                <p className="text-[11px] text-emerald-600 font-medium">정확한 박스 예측</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                <p className="text-xs uppercase text-slate-500 mb-1">mAP50-95</p>
                <p className="text-lg font-semibold text-gray-900 mb-1">0.362 → 0.550</p>
                <p className="text-[11px] text-emerald-600 font-medium">다양한 IoU 기준에서 안정적 성능</p>
              </div>
            </div>
            <div className="w-full rounded-xl bg-white border border-slate-200 p-2 flex flex-col items-center justify-center gap-4">
              <img
                src="/images/precision_recall.png"
                alt="Precision Recall Curve"
                className="w-full max-w-[800px] object-contain rounded-lg"
              />
              <img
                src="/images/map.png"
                alt="mAP Trend Curve"
                className="w-full max-w-[800px] object-contain rounded-lg"
              />
            </div>
          </div>
        </FadeInSection>
      </section>

        {/* Training Stability */}
        <section className="mb-12">
          <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-4">
            Learning Stability
          </h3>
          <FadeInSection>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-6 md:p-8">
            <p className="text-gray-600 mb-4">
              학습 과정에서 박스 및 분류 손실이 지속적으로 감소하였고,
              과적합 없이 안정적으로 학습되었습니다.
            </p>
            <div className="w-full rounded-xl bg-white border border-slate-200 p-2 flex items-center justify-center">
              <img 
                src="/images/train_val_loss_combined.png"
                alt="Train-Val Loss Curve"
                className="w-full max-w-[800px] object-contain rounded-lg"
              />
            </div>
          </div>
        </FadeInSection>
      </section>

        {/* Technical Strengths */}
        <section className="mb-12">
          <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-4">
            Technical Strengths
          </h3>
          <FadeInSection>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Card 1 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-4
                            transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
                            border border-transparent hover:border-primary/40 hover:bg-white">
              <div className="text-2xl mb-2 icon-animate">⚡</div>
              <p className="text-sm font-semibold text-gray-900 mb-1">
                실시간 처리
              </p>
              <p className="text-xs text-gray-600">
                엣지 디바이스에서도 빠른 객체 인식 가능
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-4
                            transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
                            border border-transparent hover:border-primary/40 hover:bg-white">
              <div className="text-2xl mb-2 icon-animate">🛣️</div>
              <p className="text-sm font-semibold text-gray-900 mb-1">
                도로환경 최적화
              </p>
              <p className="text-xs text-gray-600">
                복잡한 도시/생활도로에서도 높은 성능
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-4
                            transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
                            border border-transparent hover:border-primary/40 hover:bg-white">
              <div className="text-2xl mb-2 icon-animate">🚨</div>
              <p className="text-sm font-semibold text-gray-900 mb-1">
                위험도 확장 가능
              </p>
              <p className="text-xs text-gray-600">
                객체별 사고 위험도 판단 기능 연동 가능
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-4
                            transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
                            border border-transparent hover:border-primary/40 hover:bg-white">
              <div className="text-2xl mb-2 icon-animate">🧠</div>
              <p className="text-sm font-semibold text-gray-900 mb-1">
                시스템 통합 용이
              </p>
              <p className="text-xs text-gray-600">
                자율주행 인지 시스템과 쉽게 연동 가능
              </p>
            </div>
          </div>
        </FadeInSection>
      </section>

        {/* Future Vision */}
        <section className="mb-4 md:mb-8">
          <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-4">
            Future Research
          </h3>
          <FadeInSection>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-6 md:p-8">
            <p className="text-gray-600 mb-4">
              단순 객체 인식을 넘어{" "}
              <span className="font-semibold text-gray-900">
                전체 도로 상황 이해
              </span>
              로 확장할 예정입니다.
            </p>

            <ul className="list-disc list-inside text-sm text-gray-700 space-y-2">
              <li>LiDAR + 카메라 멀티모달 융합</li>
              <li>원거리/소형 객체 인식 성능 강화</li>
              <li>주행 위험도 추론 및 대응</li>
            </ul>
          </div>
          </FadeInSection>
        </section>
      </div>
    </div>
  );
}

export default YOLODetails;
