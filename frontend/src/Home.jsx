// src/Home.jsx 
import React from "react";
import "./index.css";
import { Link } from "react-router-dom";
import FadeInSection from "./FadeInSection";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 text-gray-800">
      {/* Home Page Only */}
      <div id="homePage" className="relative min-h-screen">
        {/* Flying Drone */}
        <div className="drone">
          <div className="drone-arm" />
          <div className="drone-body-dot" />
          <div className="drone-arm" />
        </div>

        {/* Animated City Background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Sky */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-100 to-white" />

          {/* Buildings */}
          <div className="absolute bottom-0 left-0 right-0 h-2/3 flex items-end justify-between px-8">
            {/* Left Building Cluster */}
            <div className="flex items-end space-x-4">
              <div
                className="city-building w-16 h-48 rounded-t-2xl opacity-80 animate-city-pulse"
                style={{ animationDelay: "0s" }}
              ></div>
              <div className="city-building w-20 h-64 rounded-t-2xl opacity-90"></div>
              <div
                className="city-building w-12 h-36 rounded-t-2xl opacity-70 animate-city-pulse"
                style={{ animationDelay: "0.5s" }}
              ></div>
              <div className="city-building w-24 h-72 rounded-t-2xl opacity-95"></div>
            </div>

            {/* Center Building Cluster */}
            <div className="flex items-end space-x-6 mb-8">
              <div className="city-building w-20 h-72 rounded-t-2xl opacity-85"></div>
              <div className="city-building w-24 h-84 rounded-t-2xl opacity-90"></div>
              <div className="city-building w-32 h-96 rounded-t-3xl opacity-100"></div>
              <div className="city-building w-24 h-80 rounded-t-2xl opacity-90"></div>
            </div>

            {/* Right Building Cluster */}
            <div className="flex items-end space-x-4">
              <div className="city-building w-28 h-80 rounded-t-2xl opacity-85"></div>
              <div className="city-building w-16 h-52 rounded-t-2xl opacity-75"></div>
              <div className="city-building w-20 h-72 rounded-t-2xl opacity-90"></div>
              <div className="city-building w-12 h-40 rounded-t-2xl opacity-65"></div>
            </div>
          </div>

          {/* Roads */}
          <div className="absolute bottom-0 left-0 right-0">
            {/* Main Road */}
            <div className="road-lane h-28 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="h-1 bg-yellow-300 w-full" />
              </div>
              {/* Road Markings */}
              <div className="absolute top-1/2 left-0 right-0 h-2 bg-white opacity-30 animate-pulse" />
            </div>

            {/* Moving Autonomous Vehicles */}
            <div className="absolute bottom-8 left-0 right-0">
              {/* Vehicle 1 */}
              <div
                className="absolute animate-car-move"
                style={{
                  animationDelay: "0s",
                  animationFillMode: "both",
                  bottom: "50px",
                }}
              >
                <div className="relative">
                  {/* Radar Waves */}
                  <div className="pointer-events-none -translate-y-8">
                    <div className="radar-ring w-10 h-10 rounded-full border border-blue-500/80" />
                    <div
                      className="radar-ring w-14 h-14 rounded-full border border-blue-500/60"
                      style={{ animationDelay: "0.4s" }}
                    />
                    <div
                      className="radar-ring w-20 h-20 rounded-full border border-blue-500/40"
                      style={{ animationDelay: "0.8s" }}
                    />
                  </div>

                  {/* Car Body */}
                  <div className="w-16 h-8 bg-primary rounded-xl relative transform -skew-x-6 shadow-lg">
                    <div className="absolute -bottom-2 left-2 w-3 h-3 bg-gray-800 rounded-full opacity-80" />
                    <div className="absolute -bottom-2 right-2 w-3 h-3 bg-gray-800 rounded-full opacity-80" />
                  </div>
                </div>
              </div>

              {/* Vehicle 2 */}
              <div
                className="absolute animate-car-move"
                style={{
                  animationDelay: "1s",
                  animationFillMode: "both",
                  bottom: "60px",
                }}
              >
                <div className="relative">
                  {/* Radar Waves */}
                  <div className="pointer-events-none -translate-y-8">
                    <div className="radar-ring w-10 h-10 rounded-full border border-blue-500/80" />
                    <div
                      className="radar-ring w-14 h-14 rounded-full border border-blue-500/60"
                      style={{ animationDelay: "0.4s" }}
                    />
                    <div
                      className="radar-ring w-20 h-20 rounded-full border border-blue-500/40"
                      style={{ animationDelay: "0.8s" }}
                    />
                  </div>

                  {/* Car Body */}
                  <div className="w-12 h-6 bg-secondary rounded-xl relative transform -skew-x-4 shadow-lg">
                    <div className="absolute -bottom-2 left-1 w-3 h-3 bg-gray-800 rounded-full opacity-80" />
                    <div className="absolute -bottom-2 right-1 w-3 h-3 bg-gray-800 rounded-full opacity-80" />
                  </div>
                </div>
              </div>

              {/* Vehicle 3 */}
              <div
                className="absolute animate-car-move"
                style={{
                  animationDelay: "3s",
                  animationFillMode: "both",
                  bottom: "-20px",
                }}
              >
                <div className="relative">
                  {/* Radar Waves */}
                  <div className="pointer-events-none -translate-y-8">
                    <div className="radar-ring w-10 h-10 rounded-full border border-cyan-200/60" />
                    <div
                      className="radar-ring w-14 h-14 rounded-full border border-cyan-200/40"
                      style={{ animationDelay: "0.4s" }}
                    />
                    <div
                      className="radar-ring w-20 h-20 rounded-full border border-cyan-200/25"
                      style={{ animationDelay: "0.8s" }}
                    />
                  </div>

                  {/* Car Body */}
                  <div className="w-14 h-7 bg-accent rounded-xl relative transform -skew-x-5 shadow-lg">
                    <div className="absolute -bottom-2 left-2 w-3 h-3 bg-gray-800 rounded-full opacity-80" />
                    <div className="absolute -bottom-2 right-2 w-3 h-3 bg-gray-800 rounded-full opacity-80" />
                  </div>
                </div>
              </div>

              {/* Vehicle 4 */}
              <div
                className="absolute animate-car-move"
                style={{
                  animationDelay: "5s",
                  animationFillMode: "both",
                  bottom: "55px",
                }}
              >
                <div className="relative">
                  {/* Radar Waves */}
                  <div className="pointer-events-none -translate-y-8">
                    <div className="radar-ring w-12 h-12 rounded-full border border-blue-500/80" />
                    <div
                      className="radar-ring w-16 h-16 rounded-full border border-blue-500/60"
                      style={{ animationDelay: "0.4s" }}
                    />
                    <div
                      className="radar-ring w-20 h-20 rounded-full border border-blue-500/40"
                      style={{ animationDelay: "0.8s" }}
                    />
                  </div>

                  {/* Truck Body */}
                  <div className="w-28 h-10 bg-gray-800 rounded-xl relative transform -skew-x-3 shadow-xl">
                    <div className="absolute -bottom-2 left-4 w-3 h-3 bg-black rounded-full opacity-90" />
                    <div className="absolute -bottom-2 right-4 w-3 h-3 bg-black rounded-full opacity-90" />
                  </div>
                </div>
              </div>

              {/* Vehicle 5 */}
              <div
                className="absolute animate-car-move"
                style={{
                  animationDelay: "8s",
                  animationFillMode: "both",
                  bottom: "-10px",
                }}
              >
                <div className="relative">
                  {/* Radar Waves */}
                  <div className="pointer-events-none -translate-y-8">
                    <div className="radar-ring w-12 h-12 rounded-full border border-cyan-200/60" />
                    <div
                      className="radar-ring w-16 h-16 rounded-full border border-cyan-200/40"
                      style={{ animationDelay: "0.4s" }}
                    />
                    <div
                      className="radar-ring w-20 h-20 rounded-full border border-cyan-200/25"
                      style={{ animationDelay: "0.8s" }}
                    />
                  </div>

                  {/* Car Body */}
                  <div className="w-20 h-8 bg-white rounded-xl relative transform -skew-x-4 shadow-lg">
                    <div className="absolute -bottom-2 left-1 w-3 h-3 bg-gray-800 rounded-full opacity-80" />
                    <div className="absolute -bottom-2 right-1 w-3 h-3 bg-gray-800 rounded-full opacity-80" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center overflow-visible">
            <img
              src="images/logo.png"
              alt="SceneDrive logo"
              className="w-40 h-40 object-contain animate-float"
            />
          </div>
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-6xl mx-auto">
              <div className="mt-32 mb-16 animate-float font-pretendard">
                <h1 className="text-6xl md:text-7xl  font-extrabold mb-6 text-gray-900">
                  SceneDrive <span className="text-primary">AI</span>
                </h1>

                <p className="text-xl md:text-3xl text-gray-600 mb-8 leading-relaxed">
                  The Future of Autonomous Mobility is Here
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* === Tech / Pipeline Section === */}
      <section className="bg-white py-20 mt-5">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
            Technology
          </h2>

          <p className="text-gray-600 leading-relaxed font-suit text-center">
            객체 인식 기반 지능형 도로 이해를 목표로 하는
            <br />
            <span className="font-medium">Vision-Language-Driving 모델</span>
            을 개발하고 있습니다.
          </p>

          <div className="mt-12">
            {/* Block 1: YOLO 기반 객체 인식 */}
            <FadeInSection className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  YOLO-based Object Perception
                </h3>
                <p className="text-gray-600 leading-relaxed font-medium">
                  차량, 보행자, 신호등 등 도로 위 주요 객체를{" "}
                  <span className="font-medium">YOLO 기반 검출 모델</span>로 인식하고
                  클래스와 위치 정보를 추출합니다.
                </p>
                <Link
                  to="/yolo-details"
                  className="group inline-flex items-center gap-2 mt-4 text-gray-800 font-medium hover:underline"
                >
                  Learn more
                  <span className="text-xl transform transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </div>
              <div className="flex justify-center">
                <img
                  src="images/1.png"
                  alt="YOLO object detection example"
                  className="w-90 h-90 object-contain"
                />
              </div>
            </FadeInSection>

            {/* Block 2: Vision-Language Reasoning */}
            <FadeInSection className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Vision-Language Scene Understanding
                </h3>
                <p className="text-gray-600 leading-relaxed font-medium">
                  인식된 객체 정보를 이미지와 함께 Vision-Language Model에 입력하여{" "}
                  <span className="font-medium inline-block">
                    “어디에 무엇이 있는지”를 반영한 자연어 기반 상황 설명
                  </span>
                  을 생성합니다.
                </p>
                <Link
                  to="/vl-details"
                  className="group inline-flex items-center gap-2 mt-4 text-gray-800 font-medium hover:underline"
                >
                  Learn more
                  <span className="text-xl transform transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </div>
              <div className="flex justify-center">
                <img
                  src="images/2.png"
                  alt="Vision-Language reasoning example"
                  className="w-90 h-90 object-contain"
                />
              </div>
            </FadeInSection>

            {/* Block 3: Object-Aware Fine-Tuning */}
            <FadeInSection className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Road Scene Pipeline
                </h3>
                <p className="text-gray-600 leading-relaxed font-medium">
                  객체 인식 정보와 언어적 추론 능력을 결합함으로써,
                  단순 캡션 생성 수준을 넘어 <br /> 자율주행 장면을 심층적으로 이해하는 모델
                  을 구축하는 것이 목표입니다.
                </p>
                <Link
                  to="/pipeline-details"
                  className="group inline-flex items-center gap-2 mt-4 text-gray-800 font-medium hover:underline"
                >
                  Learn more
                  <span className="text-xl transform transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </div>
              <div className="flex justify-center">
                <img
                  src="images/3.png"
                  alt="Object-Aware Fine-Tuning example"
                  className="w-90 h-90 object-contain"
                />
              </div>
            </FadeInSection>
            <div className="mt-18 flex justify-center">
              <Link to="/analysis1">
                <button className="px-14 py-6 bg-primary text-white font-bold text-xl rounded-2xl flex items-center justify-center transition transform hover:scale-105">
                  <i className="fas fa-play-circle mr-4 text-2xl" />
                  START ANALYSIS
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src="images/logo2.png"
                  alt="SceneDrive logo"
                  className="w-12 h-12 rounded-xl object-contain"
                />
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    SceneDrive AI
                  </h3>
                  <p className="text-gray-600">
                    Road Scene Understanding with Vision-Language Models
                  </p>
                </div>
              </div>
            </div>
            <div className="flex space-x-8">
              <a
                href="https://github.com/xnoeyes?tab=repositories"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary transition-colors duration-300"
              >
                <i className="fab fa-github text-2xl" />
              </a>
            </div>
          </div>
          <div className="mt-4 text-xs text-gray-400 text-center md:text-right">
              <p>
                <span className="font-medium text-gray-500">
                  Se-Yeon, Lee   
                </span>
                &nbsp; 2023014356@gnu.ac.kr
            </p>
            <p>
                <span className="font-medium text-gray-500">
                  Sin-ho, Cho  
                </span>
                &nbsp; chosh@gnu.ac.kr
            </p>
            <p>
                <span className="font-medium text-gray-500">
                  Ggyeong-je, Min  
                </span>
                &nbsp;rnralsrudwp7@gnu.ac.kr
            </p>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500 text-sm">
            <p>&copy; 2025 SceneDrive AI.</p>
          </div>
        </div>
      </footer>
      
    </div>
    
  );
}

export default App;
 
