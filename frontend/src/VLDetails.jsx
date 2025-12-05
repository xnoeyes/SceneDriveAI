// src/VLDetails.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import FadeInSection from "./FadeInSection";

// ====== 1. 메트릭 비교 데이터 ======
const METRIC_BAR_DATA = [
  { metric: "BLEU", exp1: 0.0832, exp2: 0.1748 },
  { metric: "ROUGE-L", exp1: 0.3969, exp2: 0.4036 },
  { metric: "METEOR", exp1: 0.4196, exp2: 0.4292 },
  { metric: "BERTScore-F1", exp1: 0.9116, exp2: 0.9179 },
];

// 슬라이드 1, 2용 단일 시리즈 데이터
const EXP1_BAR_DATA = METRIC_BAR_DATA.map((d) => ({
  metric: d.metric,
  value: d.exp1,
}));

const EXP2_BAR_DATA = METRIC_BAR_DATA.map((d) => ({
  metric: d.metric,
  value: d.exp2,
}));

const MODEL_CONFIG = [
  {
    label: "Base Vision-Language Model",
    value: "Qwen2-VL-7B-Instruct",
  },
  {
    label: "Model Type",
    value: "Vision-Encoder + LLM Decoder",
  },
  { label: "Fine-tuning Method", value: "QLoRA" },
  { label: "Quantization", value: "BitsAndBytes 4-bit" },
];

const TRAIN_CONFIG = [
  { label: "num_train_epochs", value: "3" },
  { label: "per_device_train_batch_size", value: "2" },
  { label: "gradient_accumulation_steps", value: "16" },
  { label: "learning_rate", value: "2e-4" },
  { label: "lr_scheduler_type", value: "cosine" },
  { label: "warmup_ratio", value: "3%" },
  { label: "bf16", value: "True" },
  { label: "gradient_checkpointing", value: "True" },
  { label: "eval_steps", value: "200" },
  { label: "save_steps", value: "200" },
  { label: "remove_unused_columns", value: "False" },
];

const QUALITATIVE_SAMPLES = [
  {
    id: 1,
    image: "/vl_samples/sample1.png",
    filename: "CK_A01_R01_day_clear_01008476_F.png",
    question: "What is the current road situation?",
    gt: "There is a crosswalk on the road, and a pedestrian is walking on the sidewalk on the left.",
    exp1:
      "There is a road with some vehicles. The scene looks clear but details about pedestrians are missing.",
    exp2:
      "A crosswalk is visible ahead, and a pedestrian is walking near the left side of the road.",
  },
  {
    id: 2,
    image: "/vl_samples/sample2.png",
    filename: "CK_B05_R02_day_clear_00001234_F.png",
    question: "What is the current road situation?",
    gt: "Several cars are waiting at the intersection with a traffic light ahead.",
    exp1: "There are vehicles on the road and buildings around them.",
    exp2:
      "Multiple cars are stopped near an intersection, and a traffic light is visible ahead.",
  },
  {
    id: 3,
    image: "/vl_samples/sample3.png",
    filename: "CK_C03_R01_day_clear_00004567_F.png",
    question: "What is the current road situation?",
    gt: "A motorcycle is approaching the crosswalk while cars are driving in the opposite lane.",
    exp1: "Vehicles are moving on the street, but the description is vague.",
    exp2:
      "A motorcycle is moving toward the crosswalk, and cars are driving in the opposite direction.",
  },
];

function VLDetails() {
  const [infoIndex, setInfoIndex] = useState(0); // 0: 개요, 1: Model Setup
  const [fmtIndex, setFmtIndex] = useState(0);
  const [qualSlide, setQualSlide] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 text-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-10 md:py-12">
        {/* 상단 NAV */}
        <nav className="mb-10 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-gray-900">
            SceneDrive <span className="text-primary">AI</span>
          </h1>

          <Link
            to="/"
            className="text-sm md:text-base text-primary hover:text-secondary font-medium transition-colors"
          >
            ← Back to Home
          </Link>
        </nav>

        {/* Intro Section */}
        <section className="mb-12">
          <FadeInSection>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6">
              {/* 왼쪽: VLM 설명 */}
              <div className="flex-1">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                  Vision-Language Scene Understanding
                </h2>
                <p className="text-gray-600 leading-relaxed text-sm">
                  본 페이지는 YOLO 객체 검출 결과를 입력으로 사용하는
                  Vision-Language Model 기반 <br />
                  도로 상황 설명 파이프라인을 소개합니다. 객체 텍스트 구성 방식에
                  따른
                  <br />
                  학습 설정, 성능 변화, 설계 의도 등 기술적 요소만을 직관적으로
                  설명합니다.
                </p>
              </div>

              {/* 오른쪽: VLM 파이프라인 그림 */}
              <div className="flex-1">
                <div className="flex-1 flex items-center justify-center">
                  <img
                    src="images/vlm_ar.png"
                    alt="Object-aware VLM pipeline"
                    className="w-full max-w-[1200px] md:max-w-[1200px] object-contain"
                  />
                </div>
              </div>
            </div>
          </FadeInSection>
        </section>

        {/* 1. Experiment Setup */}
        <section className="mb-14">
          <FadeInSection>
            {/* 섹션 타이틀 + 화살표 네비 */}
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg md:text-2xl font-semibold text-gray-900">
                  Experiment Setup
                </h2>
              </div>

              {/* 화살표 + 인덱스 표시 */}
              <div className="flex items-center gap-2 text-[11px] md:text-xs text-gray-500">
                <button
                  type="button"
                  onClick={() => setInfoIndex((prev) => (prev - 1 + 2) % 2)}
                  className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-300 bg-white hover:border-primary hover:text-primary transition-colors"
                >
                  ◀
                </button>
                <span className="tabular-nums">{infoIndex + 1} / 2</span>
                <button
                  type="button"
                  onClick={() => setInfoIndex((prev) => (prev + 1) % 2)}
                  className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-300 bg-white hover:border-primary hover:text-primary transition-colors"
                >
                  ▶
                </button>
              </div>
            </div>

            {/* 가운데 큰 카드: 내용만 슬라이드처럼 바뀜 */}
            <div className="mb-6">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-md p-6 md:p-7 text-sm leading-relaxed">
                {infoIndex === 0 && (
                  // --- 슬라이드 1 : Training & Runtime 표 ---
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-3 text-xl">
                      Training &amp; Runtime
                    </h3>
                    <table className="w-full text-xs md:text-sm border border-gray-200 rounded-xl overflow-hidden">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left font-semibold text-gray-700">
                            항목
                          </th>
                          <th className="px-3 py-2 text-left font-semibold text-gray-700">
                            값
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {TRAIN_CONFIG.map((row) => (
                          <tr key={row.label} className="border-t">
                            <td className="px-3 py-2 text-gray-700">
                              {row.label}
                            </td>
                            <td className="px-3 py-2 text-gray-800">
                              {row.value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {infoIndex === 1 && (
                  // --- 슬라이드 2 : Model Setup ---
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-3 text-xl">
                      Model Setup
                    </h3>
                    <table className="w-full text-xs md:text-sm border border-gray-200 rounded-xl overflow-hidden">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left font-semibold text-gray-700">
                            항목
                          </th>
                          <th className="px-3 py-2 text-left font-semibold text-gray-700">
                            값
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {MODEL_CONFIG.map((item) => (
                          <tr key={item.label} className="border-t">
                            <td className="px-3 py-2 text-gray-700">
                              {item.label}
                            </td>
                            <td className="px-3 py-2 text-gray-800">
                              {item.value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* 아래: 하이라이트 카드 3개 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/80 rounded-2xl shadow-md p-4 text-sm">
                <p className="font-bold text-gray-900 mb-1 text-lg">
                  Train Runtime
                </p>
                <p className="text-gray-600 text-xs">
                  약 2시간 56분
                  <br />
                  (519 steps)
                </p>
              </div>
              <div className="bg-white/80 rounded-2xl shadow-md p-4 text-sm">
                <p className="font-bold text-gray-900 mb-1 text-lg">
                  Training Args
                </p>
                <p className="text-gray-600 text-xs">
                  epochs 3 · batch 2
                  <br />
                  lr 2e-4 · cosine
                </p>
              </div>
              <div className="bg-white/80 rounded-2xl shadow-md p-4 text-sm">
                <p className="font-bold text-gray-900 mb-1 text-lg">
                  Quantization
                </p>
                <p className="text-gray-600 text-xs">
                  4-bit QLoRA (bnb)
                  <br />
                  bf16 + grad checkpoint
                </p>
              </div>
            </div>
          </FadeInSection>
        </section>

        {/* ====== 2. Object Text Formatting 슬라이드 ====== */}
        <section className="mb-14">
          <FadeInSection>
            {/* 타이틀 + 화살표 네비 */}
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg md:text-2xl font-semibold text-gray-900">
                Object Text Formatting
              </h2>

              <div className="flex items-center gap-2 text-[11px] md:text-xs text-gray-500">
                <button
                  type="button"
                  onClick={() => setFmtIndex((prev) => (prev - 1 + 3) % 3)}
                  className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-300 bg-white hover:border-primary hover:text-primary transition-colors"
                >
                  ◀
                </button>
                <span className="tabular-nums">{fmtIndex + 1} / 3</span>
                <button
                  type="button"
                  onClick={() => setFmtIndex((prev) => (prev + 1) % 3)}
                  className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-300 bg-white hover:border-primary hover:text-primary transition-colors"
                >
                  ▶
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 왼쪽: 설명 카드들 */}
              <div className="flex flex-col justify-center h-full space-y-4 text-sm leading-relaxed">
                {fmtIndex === 0 && (
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-6">
                    <h3 className="text-base font-semibold text-gray-900 mb-2 text-lg">
                      First Experiment
                    </h3>
                    <ul className="list-disc list-inside text-gray-700 mb-2 space-y-1">
                      <li>YOLO 검출 결과 중 confidence 상위 3개 객체만 사용</li>
                      <li>개별 bounding box 정보를 그대로 나열</li>
                      <li>
                        차량·보행자·신호등 등 다수 객체가 있는 장면에서{" "}
                        <span className="font-semibold text-red-600">
                          중요한 정보가 누락
                        </span>
                        될 수 있음
                      </li>
                    </ul>
                  </div>
                )}

                {fmtIndex === 1 && (
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-6">
                    <h3 className="text-base font-semibold text-gray-900 mb-2 text-lg">
                      Second Experiment 
                    </h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>모든 탐지 객체를 클래스별로 그룹화</li>
                      <li>
                        각 클래스에서 confidence가 가장 높은 bbox를{" "}
                        <span className="font-semibold">대표 bbox</span>로 선택
                      </li>
                      <li>
                        <code>count</code> + 대표 bbox 한 줄로 요약해
                        텍스트 길이는 유지하면서{" "}
                        <span className="font-semibold">
                          장면 요약 정보
                        </span>{" "}
                        제공
                      </li>
                    </ul>
                  </div>
                )}

                {/* 슬라이드 3: 종합 결론 카드 */}
                {fmtIndex === 2 && (
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-6">
                    <h3 className="text-base font-semibold text-gray-900 mb-2 text-lg">
                      Conclusion
                    </h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>
                        두 번째 실험이 첫 번째 실험보다 BLEU, ROUGE-L, METEOR, BERTScore-F1 <br /> 전 지표에서 일관되게 더 높은 성능을 보임
                      </li>
                      <li>
                        객체를{" "}
                        <span className="font-semibold">클래스 단위로 집약</span>
                        하여 장면 요약 정보를 제공하는 편이 <br /> 모델의 도로
                        상황 설명 품질을 높이는 데 효과적
                      </li>
                      <li>
                        동일한 토큰 길이 내에서{" "}
                        <span className="font-semibold">
                          핵심 객체·수량 정보를 함께 제공
                        </span>
                        하는 포맷이 <br /> Vision-Language 모델에 더 유리함
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {/* 오른쪽: 슬라이드별 Quantitative Results */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-3">
                  Quantitative Results
                </h3>

                {/* --- 슬라이드 1: Exp 1만 --- */}
                {fmtIndex === 0 && (
                  <>
                    <div className="overflow-x-auto mb-4">
                      <table className="min-w-full text-xs md:text-sm border border-gray-200 rounded-lg overflow-hidden">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-3 py-2 text-left font-semibold">
                              Metric
                            </th>
                            <th className="px-3 py-2 text-center font-semibold">
                              Score
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {METRIC_BAR_DATA.map((row) => (
                            <tr key={row.metric} className="border-t">
                              <td className="px-3 py-2">{row.metric}</td>
                              <td className="px-3 py-2 text-center">
                                {row.exp1}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={EXP1_BAR_DATA}
                          margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="metric" />
                          <YAxis domain={[0, 1]} />
                          <Tooltip />
                          <Bar dataKey="value" name="Exp 1 (Top-3)" fill="#3b82f6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </>
                )}

                {/* --- 슬라이드 2: Exp 2만 --- */}
                {fmtIndex === 1 && (
                  <>
                    <div className="overflow-x-auto mb-4">
                      <table className="min-w-full text-xs md:text-sm border border-gray-200 rounded-lg overflow-hidden">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-3 py-2 text-left font-semibold">
                              Metric
                            </th>
                            <th className="px-3 py-2 text-center font-semibold">
                              Score
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {METRIC_BAR_DATA.map((row) => (
                            <tr key={row.metric} className="border-t">
                              <td className="px-3 py-2">{row.metric}</td>
                              <td className="px-3 py-2 text-center">
                                {row.exp2}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={EXP2_BAR_DATA}
                          margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="metric" />
                          <YAxis domain={[0, 1]} />
                          <Tooltip />
                          <Bar dataKey="value" name="Exp 2" fill="#facc15" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </>
                )}

                {/* --- 슬라이드 3: Exp 1 vs Exp 2 비교 --- */}
                {fmtIndex === 2 && (
                  <>
                    <div className="overflow-x-auto mb-4">
                      <table className="min-w-full text-xs md:text-sm border border-gray-200 rounded-lg overflow-hidden">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-3 py-2 text-left font-semibold">
                              Metric
                            </th>
                            <th className="px-3 py-2 text-center font-semibold">
                              Exp 1 Score
                            </th>
                            <th className="px-3 py-2 text-center font-semibold">
                              Exp 2 Score
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {METRIC_BAR_DATA.map((row) => (
                            <tr key={row.metric} className="border-t">
                              <td className="px-3 py-2">{row.metric}</td>
                              <td className="px-3 py-2 text-center">
                                {row.exp1}
                              </td>
                              <td className="px-3 py-2 text-center font-semibold">
                                {row.exp2}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={METRIC_BAR_DATA}
                          margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="metric" />
                          <YAxis domain={[0, 1]} />
                          <Tooltip />
                          <Bar dataKey="exp1" name="Exp 1 (Top-3)" fill="#3b82f6" />
                          <Bar dataKey="exp2" name="Exp 2 (Class-wise)" fill="#facc15" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </>
                )}
              </div>
            </div>
          </FadeInSection>
        </section>

        {/* ====== 3. 정성적 결과 샘플 ====== */}
        <section className="mb-10">
          <FadeInSection>
          {/* 제목 + 설명 + 화살표 */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg md:text-2xl font-semibold text-gray-900">
                Qualitative Examples
              </h2>
            </div>

            {/* 왼/오 화살표 + 현재 슬라이드 번호 */}
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setQualSlide(
                    (prev) =>
                      (prev - 1 + QUALITATIVE_SAMPLES.length) %
                      QUALITATIVE_SAMPLES.length
                  )
                }
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition"
              >
                ‹
              </button>
              <span className="text-xs md:text-sm text-gray-500">
                {qualSlide + 1} / {QUALITATIVE_SAMPLES.length}
              </span>
              <button
                onClick={() =>
                  setQualSlide((prev) => (prev + 1) % QUALITATIVE_SAMPLES.length)
                }
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition"
              >
                ›
              </button>
            </div>
          </div>

          {/* 한 장만 보여줌 */}
          {(() => {
            const s = QUALITATIVE_SAMPLES[qualSlide];
            return (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-5 flex flex-col">
                {/* 파일 이름 + 이미지 */}
                <div className="mb-3">
                  <div className="text-xs text-gray-500 mb-1">
                    {s.filename}
                  </div>
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <img
                      src={s.image}
                      alt={`Sample ${s.id}`}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                </div>

                {/* Q / GT / Exp1 / Exp2 텍스트 */}
                <div className="text-xs md:text-sm space-y-2 flex-1">
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-700 mr-1">
                      Q
                    </span>
                    <span className="font-semibold text-gray-800">
                      {s.question}
                    </span>
                  </div>
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 mr-1">
                      GT
                    </span>
                    <span className="text-gray-800">{s.gt}</span>
                  </div>
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-800 mr-1">
                      Exp 1
                    </span>
                    <span className="text-gray-800">{s.exp1}</span>
                  </div>
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-100 text-purple-800 mr-1">
                      Exp 2
                    </span>
                    <span className="text-gray-800">{s.exp2}</span>
                  </div>
                </div>
              </div>
            );
          })()}
          </FadeInSection>
        </section>

        {/* ====== 4. Future Research ====== */}
        <section className="mb-10 md:mb-12">
          <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-4">
            Future Research
          </h3>
          <FadeInSection>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-6 md:p-8">
              <p className="text-gray-600 mb-4">
                <span className="font-semibold text-gray-900">
                  다양한 모델과 도로 상황
                </span>
                을 적용해 학습을 확장할 예정입니다. 
              </p>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-2">
                <li>
                  <span className="font-semibold">대규모 VLM과 경량 VLM</span>을
                  함께 비교하며{" "}
                  <span className="font-semibold">
                    성능–모델 크기 trade-off 관계
                  </span>{" "}
                  분석
                </li>
                <li>
                  <span className="font-semibold">다양한 도로 상황</span>과
                  질문 유형을 반영한 학습 데이터 확장
                </li>
                <li>
                  엣지 디바이스에서도 동작 가능한{" "}
                  <span className="font-semibold">
                    경량 모델 설계 및 지식 증류
                  </span>
                  를 통한 성능 유지
                </li>
              </ul>
            </div>
          </FadeInSection>
        </section>
      </div>
    </div>
  );
}

export default VLDetails;
