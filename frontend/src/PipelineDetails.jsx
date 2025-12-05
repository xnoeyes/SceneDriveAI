// src/ObjectAwareDetails.jsx
import React from "react";
import { Link } from "react-router-dom";
import FadeInSection from "./FadeInSection";

const PIPELINE_STEPS = [
  {
    id: 1,
    title: "Object Perception",
    icon: "🛰️",
    desc: (
      <>
        차량, 보행자 등의 도로 위
        <br /> 주요 객체를 YOLO 기반 모델로 <br /> 탐지합니다.
      </>
    ),
  },
  {
    id: 2,
    title: "Object Text Formatting",
    icon: "🧩",
    desc: (
      <>
        탐지된 객체들을 바탕으로 위치 정보를 포함한 구조화된
        <br /> 객체 표현으로 재구성합니다.
      </>
    ),
  },
  {
    id: 3,
    title: "Object-Aware VLM Input",
    icon: "🧠",
    desc: (
      <>
        객체 정보와 원본 이미지를 함께 VLM에 입력하여
        도로 상황을
        <br /> 깊이 이해하도록 유도합니다.
      </>
    ),
  },
  {
    id: 4,
    title: "Road Scene Understanding Output",
    icon: "💬",
    desc: (
      <>
        객체 정보를 바탕으로
        <br /> 장면 이해 기반의 자연어 출력을 생성합니다.
      </>
    ),
  },
];

function ObjectAwareDetails() {
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

        {/* 1. 전체 파이프라인 다이어그램 */}
        <FadeInSection>
          <section className="mb-16 relative">
            {/* 바깥 글로우 프레임 */}
            <div className="pointer-events-none absolute -inset-3 rounded-3xl border border-primary/20 opacity-30 blur-lg" />

            <div className="relative z-10">
              <h3 className="text-xl md:text-3xl font-bold text-gray-900 mb-4">
                Road Scene Pipeline
              </h3>
              <p className="text-sm md:text-base text-gray-600 mb-8">
                YOLO 기반 객체 인식과 Vision-Language 모델을 하나의 흐름으로
                통합한 파이프라인입니다. <br />
                왼쪽의 인식 단계에서 시작해 오른쪽의 자연어 출력까지,
                단계별로 정보를 정제하며 흘러갑니다.
              </p>

              <div className="relative mt-10">
                {/* 중앙 흐르는 라인 (PC에서만) */}
                <div
                  className="
                    hidden md:block absolute left-10 right-10 top-24 h-[4px]
                    bg-gradient-to-r from-primary/15 via-blue-400/70 to-primary/15
                    rounded-full opacity-90 animate-pipeline-flow
                  "
                />

                {/* 데스크탑: 가로 + 화살표 */}
                <div className="hidden md:flex items-stretch justify-between gap-4 relative">
                  {PIPELINE_STEPS.map((step, idx) => (
                    <React.Fragment key={step.id}>
                      {/* STEP CARD */}
                      <div
                        className="
                          flex-1 group relative bg-white/90 backdrop-blur-xl 
                          rounded-2xl shadow-lg border border-gray-200 
                          px-6 py-7 transition-all duration-300
                          hover:-translate-y-2 hover:shadow-2xl hover:border-primary/40
                          animate-step-fade
                        "
                        style={{ animationDelay: `${idx * 0.2}s` }}
                      >
                        {/* Step Badge */}
                        <div
                          className="
                            absolute -top-3 left-5 text-[11px] font-bold
                            bg-primary text-white px-3 py-1 
                            rounded-full shadow-lg tracking-wide
                            animate-soft-pop
                          "
                        >
                          STEP {idx + 1}
                        </div>

                        {/* Icon */}
                        <div className="flex items-center justify-center mb-4">
                          <div
                            className="
                              h-14 w-14 rounded-2xl bg-primary/10 
                              flex items-center justify-center text-3xl 
                              shadow-inner transition-all duration-300
                              group-hover:bg-primary/20 group-hover:rotate-6
                              animate-float-soft
                            "
                          >
                            {step.icon}
                          </div>
                        </div>

                        {/* Title / Desc */}
                        <h4 className="text-base md:text-lg font-semibold text-gray-900 text-center mb-2">
                          {step.title}
                        </h4>
                        <p className="text-xs md:text-sm text-gray-600 text-center leading-relaxed">
                          {step.desc}
                        </p>
                      </div>

                      {/* STEP 사이 화살표 (마지막 전까지만) */}
                      {idx < PIPELINE_STEPS.length - 1 && (
                        <div className="flex items-center justify-center">
                          <div className="text-primary/60 text-4xl font-light animate-arrow-move">
                            →
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* 모바일: 세로 스택 */}
                <div className="grid md:hidden grid-cols-1 gap-4 relative">
                  {PIPELINE_STEPS.map((step, idx) => (
                    <div
                      key={step.id}
                      className="
                        group bg-white/90 backdrop-blur-xl rounded-2xl 
                        shadow-md border border-gray-200 px-5 py-5 
                        transition-all duration-300 hover:-translate-y-1.5 
                        hover:shadow-xl hover:border-primary/40 animate-step-fade
                      "
                      style={{ animationDelay: `${idx * 0.15}s` }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="
                              h-10 w-10 rounded-2xl bg-primary/10 flex 
                              items-center justify-center text-2xl 
                              animate-float-soft
                            "
                          >
                            {step.icon}
                          </div>
                          <span className="text-[11px] font-semibold tracking-[0.16em] uppercase text-primary/80">
                            Step {idx + 1}
                          </span>
                        </div>
                      </div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-1.5">
                        {step.title}
                      </h4>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </FadeInSection>

        {/* =============================== */}
        {/* 2. VLA로 확장되는 미래 방향 (밝은 카드 버전) */}
        {/* =============================== */}
        <FadeInSection>
          <section className="mb-14">
            <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-4">
              Next Step
            </h3>

            <div className="relative rounded-3xl bg-white/90 backdrop-blur-xl border border-gray-200 shadow-md md:shadow-lg p-6 md:p-8 overflow-hidden">
              {/* 은은한 그라디언트 포인트 */}
              <div className="pointer-events-none absolute -right-20 -top-10 w-56 h-56 rounded-full bg-gradient-to-l from-primary/15 via-cyan-200/20 to-transparent blur-3xl" />
              <div className="pointer-events-none absolute -left-20 bottom-0 w-64 h-64 rounded-full bg-gradient-to-r from-cyan-100/40 via-blue-100/30 to-transparent blur-3xl" />

              <div className="relative grid md:grid-cols-[1.4fr,1fr] gap-8 items-center">
                {/* 왼쪽 텍스트 영역 */}
                <div>
                  <p className="text-sm md:text-base text-gray-700 mb-4 leading-relaxed">
                    현재 단계의 모델은 도로 위 객체들을 인식하고, 장면을
                    이해·설명하는 데 집중하고 있습니다.<br /> 다음 단계에서는 여기서 한 발
                    더 나아가,&nbsp;
                    <span className="font-semibold text-primary bg-primary/5 px-1.5 py-0.5 rounded-lg">
                      Vision-Language-Action (VLA)
                    </span>
                    로 <br /> 확장하는 것을 목표로 합니다.
                  </p>

                  <ul className="space-y-2.5 text-xs md:text-sm text-gray-700">
                    <li className="flex gap-2">
                      <span className="mt-1 inline-block w-2 h-2 rounded-full bg-amber-400" />
                      <span>
                        차량·보행자의 <span className="font-semibold">향후 궤적</span>과
                        잠재적 위험 상황을 예측하는 모델로 확장
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-1 inline-block w-2 h-2 rounded-full bg-emerald-400" />
                      <span>
                        감속·정지·회피와 같은{" "}
                        <span className="font-semibold">행동 의사결정</span>까지
                        연결되는 시나리오 이해
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-1 inline-block w-2 h-2 rounded-full bg-sky-400" />
                      <span>
                        운전자 교육, 모의 주행 평가 등{" "}
                        <span className="font-semibold">사람 수준의 해석 가능성</span>을
                        제공하는 자율주행 보조 시스템으로 발전
                      </span>
                    </li>
                  </ul>
                </div>

                {/* 오른쪽 작은 다이어그램 카드 */}
                <div className="relative">
                  <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4 md:p-5 shadow-sm">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-blue-500 mb-3">
                      From Perception to Action
                    </p>

                    <div className="space-y-3 text-xs text-gray-700">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-xl bg-blue-100 flex items-center justify-center text-base">
                          👀
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            Scene Perception
                          </div>
                          <div className="text-gray-500 text-[11px]">
                            도로 객체 인지 · 장면 이해
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-center text-[11px] text-blue-300">
                        ──────────────────▶
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-xl bg-indigo-100 flex items-center justify-center text-base">
                          🧠
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            Scenario Reasoning
                          </div>
                          <div className="text-gray-500 text-[11px]">
                            위험 요소 · 우선순위 · 상황 요약
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-center text-[11px] text-blue-300">
                        ──────────────────▶
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-xl bg-emerald-100 flex items-center justify-center text-base">
                          🚗
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            Trajectory &amp; Action
                          </div>
                          <div className="text-gray-500 text-[11px]">
                            향후 궤적·행동 추천까지 확장되는 VLA 지향
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 은은한 아웃라인 글로우 */}
                  <div className="pointer-events-none absolute -inset-1 rounded-3xl border border-primary/20 opacity-60 blur-md" />
                </div>
              </div>
            </div>
          </section>
        </FadeInSection>

        {/* =============================== */}
        {/* 3. Object-aware Navigation Preview */}
        {/* =============================== */}
        <FadeInSection>
          <section className="mb-4 md:mb-6">
            <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-3">
              Navigation Preview
            </h3>

            {/* 네비게이션 디스플레이 프레임 */}
            <div className="flex justify-center">
              <div className="relative w-full max-w-xl rounded-[32px] bg-gray-100 border border-gray-300 overflow-hidden shadow-md">
                {/* 도로 화면이 프레임 안을 꽉 채움 */}
                <div className="road-scene relative w-full h-52 md:h-64 bg-gray-200">
                  {/* 상단 정보 오버레이 (시간/거리 등) */}
                  <div className="absolute top-2 left-3 flex items-center gap-1.5 text-[10px] md:text-xs text-gray-700">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>SceneDrive · NAV</span>
                  </div>

                  {/* 세로 도로 */}
                  <div className="absolute inset-y-3 left-1/2 -translate-x-1/2 w-36 md:w-44 bg-white rounded-[32px] border border-gray-400 shadow-inner overflow-hidden">
                    {/* 중앙 차선 점선 */}
                    <div className="absolute inset-y-3 left-1/2 -translate-x-1/2 w-1 bg-[repeating-linear-gradient(to_bottom,rgba(148,163,184,0.9)_0,rgba(148,163,184,0.9)_8px,transparent_8px,transparent_18px)] opacity-90" />

                    {/* Ego 차량 + 초록 bbox */}
                    <div className="absolute bottom-3 left-1/2 obj-ego">
                      <div className="-translate-x-1/2 transform relative">
                        <div className="w-9 h-12 md:w-10 md:h-14 bg-primary/80 rounded-xl flex items-center justify-center text-lg">
                          🚗
                        </div>
                        <div className="bbox-pulse absolute -1 -1 right-1 bottom-1 border-2 border-emerald-400/90" />
                      </div>
                    </div>

                    {/* 앞차 */}
                    <div className="absolute top-6 left-1/2 obj-front">
                      <div className="-translate-x-1/2 transform relative">
                        <div className="w-8 h-11 bg-blue-400 rounded-xl flex items-center justify-center text-base">
                          🚙
                        </div>
                        <div className="bbox-pulse absolute -1 -1 right-1 bottom-1 border-2 border-emerald-400/80" />
                      </div>
                    </div>

                    {/* 왼쪽 차선 오토바이 */}
                    <div className="absolute bottom-6 left-4 obj-bike">
                      <div className="relative">
                        <div className="w-7 h-10 bg-sky-400 rounded-xl flex items-center justify-center text-base">
                          🏍️
                        </div>
                        <div className="bbox-pulse absolute -1 -1 right-1 bottom-1 border-2 border-emerald-400/70" />
                      </div>
                    </div>

                    {/* 우측 보행자 + 노란 경고 bbox */}
                    <div className="absolute top-10 right-4 obj-ped">
                      <div className="relative">
                        <div className="w-6 h-9 bg-amber-300 rounded-xl flex items-center justify-center text-base">
                          🚶
                        </div>
                        <div className="bbox-warning absolute -1 -1 right-1 bottom-1 border-2 border-amber-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </FadeInSection>
      </div>
    </div>
  );
}

export default ObjectAwareDetails;
