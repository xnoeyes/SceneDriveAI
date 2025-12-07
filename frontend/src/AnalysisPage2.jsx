// src/AnalysisPage2.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const VLM_BACKEND_URL = "http://localhost:8000/vlm-analyze";
const DETECT_BACKEND_URL = "http://localhost:8000/detect";

// dataURL -> File 변환
function dataURLtoFile(dataUrl, filename) {
  const arr = dataUrl.split(",");
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : "image/png";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

// 네비게이션용 프리셋 질문
const PRESET_QUESTIONS = [
  {
    id: "overview",
    label: "Road Overview",
    text: "What is the current road situation?",
  },
  {
    id: "right-turn",
    label: "Right Turn",
    text: "Can I safely turn right here?",
  },
  {
    id: "left-turn",
    label: "Left Turn",
    text: "Can I safely turn left here?",
  },
  {
    id: "risks",
    label: "Risk Factors",
    text: "What are the main risk factors in this scene for a driver?",
  },
];

const COLOR_PALETTE = [
  "#3b82f6", // Blue
  "#10b981", // Green
  "#f59e0b", // Yellow
  "#ef4444", // Red
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#14b8a6", // Teal
  "#f97316", // Orange
];

function hexToRgba(hex, alpha) {
  let h = hex.replace("#", "");
  if (h.length === 3) {
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const BOX_COLOR_PALETTE = COLOR_PALETTE.map((hex) => ({
  border: hex,
  fill: hexToRgba(hex, 0.12),
}));

function getBoxColors(label) {
  if (!label) return BOX_COLOR_PALETTE[0];
  const sum = Array.from(label).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return BOX_COLOR_PALETTE[sum % BOX_COLOR_PALETTE.length];
}

function AnalysisPage2() {
  const location = useLocation();
  const navigate = useNavigate();

  const initialImageSrc = location.state?.imageSrc || null;

  const [imageSrc, setImageSrc] = useState(initialImageSrc);
  const [boxes, setBoxes] = useState([]); // 항상 이 페이지에서 /detect로 생성
  const [question, setQuestion] = useState(
    "What is the current road situation?",
  );
  const [selectedPreset, setSelectedPreset] = useState("overview");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false); // VLM
  const [isDetecting, setIsDetecting] = useState(false); // YOLO

  // 최초 진입 시, 이전 페이지에서 가져온 이미지에 대해 YOLO 한 번 돌리기
  useEffect(() => {
    const runInitialDetect = async () => {
      if (!initialImageSrc) return;
      try {
        setIsDetecting(true);
        const file = dataURLtoFile(initialImageSrc, "initial.png");
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch(DETECT_BACKEND_URL, {
          method: "POST",
          body: formData,
        });
        if (!res.ok) {
          throw new Error("Detect API error");
        }
        const data = await res.json();
        setBoxes(data.boxes || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsDetecting(false);
      }
    };

    runInitialDetect();
  }, [initialImageSrc]);

  const handleRunVLM = async () => {
    if (!imageSrc) {
      alert("No image found. Please upload an image or go back to Detection.");
      navigate("/analysis1");
      return;
    }

    if (!question.trim()) {
      alert("Please enter a question.");
      return;
    }

    setIsLoading(true);
    setAnswer("");

    try {
      const file = dataURLtoFile(imageSrc, "input.png");
      const formData = new FormData();
      formData.append("file", file);
      formData.append("question", question);

      const res = await fetch(VLM_BACKEND_URL, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("VLM API error");
      }

      const data = await res.json();
      setAnswer(data.answer || "(no answer)");
    } catch (err) {
      console.error(err);
      alert("VLM analysis failed. Please check the backend.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageSrc(reader.result);
      setAnswer("");
    };
    reader.readAsDataURL(file);

    // YOLO 재추론
    setIsDetecting(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(DETECT_BACKEND_URL, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Detect API error");
      }

      const data = await res.json();
      setBoxes(data.boxes || []);
    } catch (err) {
      console.error(err);
      alert("Object detection failed for the uploaded image.");
      setBoxes([]);
    } finally {
      setIsDetecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img src="images/logo2.png" alt="logo" className="w-9 h-9 -mt-1" />
              <Link
                to="/"
                className="text-xl font-extrabold text-gray-800 hover:text-primary transition-colors"
              >
                SceneDrive <span className="text-primary">AI</span>
              </Link>
            </div>
            <div className="flex space-x-4 text-sm">
              <Link
                to="/analysis1"
                className="text-gray-600 hover:text-primary transition-colors"
              >
                Object Detection
              </Link>
              <span className="text-primary font-semibold">VLM Analysis</span>
            </div>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Title */}
        <section className="mb-10 text-center">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-4">
            VLM Analysis
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            동일한 이미지에 대해 Vision-Language Model을 사용하여
            도로 상황을 설명하고, 질의응답을 수행합니다.
          </p>
        </section>
        <section className="mb-10">
          <div className="bg-white rounded-3xl shadow-md p-6 md:p-8">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-gray-800">
                Input Image with Detections
              </h3>
              <span className="text-xs text-gray-500">
                {isDetecting ? "Running detection..." : `Detections: ${boxes.length}`}
              </span>
            </div>
            <div className="mb-4 flex items-center justify-between gap-4">
              <div className="text-xs text-gray-600">
                초기 이미지는 Detection 페이지에서 가져오며,
                필요하면 여기서 다른 이미지를 업로드할 수 있습니다.
              </div>
              <label className="inline-flex items-center px-3 py-2 rounded-lg text-xs font-medium bg-white border border-gray-300 text-gray-700 cursor-pointer hover:bg-gray-50">
                <span>Upload Image</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </div>

            {/* 네비게이션 프레임 */}
            <div className="w-full flex items-center justify-center">
              {imageSrc ? (
                <div className="w-full bg-gray-900 rounded-3xl shadow-2xl p-4 pb-6">
                  {/* Navigation top bar */}
                  <div className="flex items-center justify-between px-4 py-2 mb-3 bg-gray-800 rounded-2xl">
                    <div className="text-gray-300 text-sm font-medium">
                      SceneDrive Navigation
                    </div>
                    <div className="text-gray-400 text-xs">
                      Objects: {boxes.length}
                    </div>
                  </div>

                  {/* Screen area */}
                  <div className="relative bg-black rounded-2xl overflow-hidden">
                    <div className="relative w-full h-full">                     
                      <img
                        src={imageSrc}
                        alt="Input"
                        className="w-full h-auto block opacity-95"
                      />

                      {/* YOLO bounding boxes overlay */}
                      {boxes.map((b, idx) => {
                        const [x1, y1, x2, y2] = b.bbox; // 0~1 normalized
                        const left = x1 * 100;
                        const top = y1 * 100;
                        const width = (x2 - x1) * 100;
                        const height = (y2 - y1) * 100;

                        const { border, fill } = getBoxColors(b.class_);

                        return (
                          <div
                            key={idx}
                            className="absolute z-10 rounded-sm pointer-events-none"
                            style={{
                              left: `${left}%`,
                              top: `${top}%`,
                              width: `${width}%`,
                              height: `${height}%`,
                              borderWidth: "2px",
                              borderStyle: "solid",
                              borderColor: border,
                              backgroundColor: fill,
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* VLM Answer */}
                  {answer && (
                    <div className="mt-4 mx-2 px-4 py-3 bg-gray-800/90 rounded-2xl text-gray-100 text-lg">
                      <p className="whitespace-pre-wrap">{answer}</p>
                    </div>
                  )}

                  {/* Bottom nav bar like car UI */}
                  <div className="flex justify-around text-gray-100 text-m mt-6 font-semibold">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                      <span>8 min</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                      <span>16:00</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                      <span>1.8 km</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full aspect-video flex items-center justify-center text-gray-400 text-sm">
                  No image. Upload an image or go back to Object Detection page.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Ask the VLM */}
        <section>
          <div className="bg-white rounded-3xl shadow-md p-6 md:p-8 flex flex-col">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Ask the SceneDrive Navigation
            </h3>

            {/* Nav-like preset buttons */}
            <div className="flex flex-wrap gap-2 mb-4">
              {PRESET_QUESTIONS.map((q) => (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => {
                    setQuestion(q.text);
                    setSelectedPreset(q.id);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs md:text-sm border transition-colors ${
                    selectedPreset === q.id
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {q.label}
                </button>
              ))}
            </div>

            <label className="text-sm font-medium text-gray-700 mb-2">
              Question
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-3 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
              rows={4}
              value={question}
              onChange={(e) => {
                setQuestion(e.target.value);
                setSelectedPreset(""); // 사용자가 직접 수정하면 프리셋 선택 해제
              }}
              placeholder="Ask something about the road scene..."
            />

            <button
              type="button"
              onClick={handleRunVLM}
              disabled={isLoading || isDetecting || !imageSrc}
              className="mb-4 px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Analyzing..." : "Run VLM Analysis"}
            </button>

            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-800 mb-2">
                Model Response
              </h4>
              <div className="w-full h-48 border border-gray-200 rounded-lg p-3 bg-gray-50 text-sm text-gray-800 overflow-auto whitespace-pre-wrap">
                {answer
                  ? answer
                  : "Run VLM analysis to see the model's response here."}
              </div>
            </div>
          </div>
        </section>

        <div className="mt-10 flex justify-between">
          <Link
            to="/analysis1"
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm hover:bg-gray-300 transition-colors"
          >
            ← Back to Detection
          </Link>
        </div>
      </main>

      <footer className="bg-white border-t mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center">
            <p className="text-gray-600">&copy; 2025 SceneDrive AI.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AnalysisPage2;
