// src/AnalysisPage1.jsx
import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";

const colorPalette = [
  "#3b82f6", // Blue
  "#10b981", // Green
  "#f59e0b", // Yellow
  "#ef4444", // Red
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#14b8a6", // Teal
  "#f97316", // Orange
];

function AnalysisPage1() {
  const [imageSrc, setImageSrc] = useState(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [detections, setDetections] = useState([]);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleSelectClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file (PNG, JPG, JPEG)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }
    setImageFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setImageSrc(e.target.result);
      setDetections([]);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  const BACKEND_URL = "http://localhost:8000/detect";

  const handleRunDetection = async () => {
    if (!imageFile) {
      alert("Please upload an image first");
      return;
    }

    setIsDetecting(true);

    try {
      const formData = new FormData();
      formData.append("file", imageFile); 

      const res = await fetch(BACKEND_URL, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Detection API error");
      }

      const data = await res.json();
      // data: { boxes: [ { class_: "person", confidence: 0.95, bbox: [0.1,0.2,0.3,0.4] }, ... ] }

      const mapped = (data.boxes || []).map((b) => ({
        class: b.class_ ?? b.class, // 백엔드가 class_로 줄 수도, class로 줄 수도 있어서 둘 다 대응
        confidence: b.confidence,
        bbox: b.bbox, // [xMin_norm, yMin_norm, xMax_norm, yMax_norm]
      }));

      setDetections(mapped); // 화면에 쓰이는 detections로 들어감
    } catch (err) {
      console.error(err);
      alert("Object detection failed. Please try again.");
    } finally {
      setIsDetecting(false);
    }
  };

  const handleClear = () => {
    setDetections([]);
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const toggleInstructions = () => {
    setShowInstructions((prev) => !prev);
    setTimeout(() => {
      const el = document.getElementById("instructions");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const detectionsCountText =
    detections.length === 0
      ? "No detections yet"
      : `${detections.length} object${detections.length > 1 ? "s" : ""} detected`;

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
              <button
                type="button"
                className="text-gray-600 hover:text-primary transition-colors"
                onClick={() => scrollToSection("upload")}
              >
                Upload
              </button>
              <button
                type="button"
                className="text-gray-600 hover:text-primary transition-colors"
                onClick={() => scrollToSection("results")}
              >
                Results
              </button>
              <button
                type="button"
                className="text-gray-600 hover:text-primary transition-colors"
                onClick={toggleInstructions}
              >
                Instructions
              </button>
            </div>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-4">
            Object Perception
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            도로 상황에 대한 이미지를 업로드하면 시스템이 객체를 자동으로 탐지하고,
            <br />
            각 객체를 바운딩 박스와 신뢰도 점수와 함께 보여줍니다.
          </p>
        </section>

        {/* Upload Section */}
        <section id="upload" className="mb-12">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Upload Image
            </h3>

            <div
              className={`upload-area rounded-lg p-8 text-center cursor-pointer mb-6 ${
                isDragOver ? "dragover" : ""
              }`}
              onClick={handleSelectClick}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                </div>
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Click to upload or drag and drop
                </p>
                <p className="text-gray-500 mb-4">
                  PNG, JPG or JPEG (Max 5MB)
                </p>
                <button
                  type="button"
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
                >
                  Select Image
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            <div className="flex justify-center mb-6">
              <button
                type="button"
                onClick={handleRunDetection}
                disabled={!imageSrc || isDetecting}
                className="px-8 py-3 bg-accent text-white rounded-lg font-medium hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDetecting ? "Detecting..." : "Run Object Detection"}
              </button>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section id="results" className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Preview with Bounding Boxes */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Detection Visualization
              </h3>
              <div className="image-container mx-auto">
                {imageSrc ? (
                  <>
                    <img
                      src={imageSrc}
                      alt="Uploaded preview"
                      className="max-w-full rounded-lg"
                      onLoad={(e) =>
                        setImageSize({
                          width: e.target.naturalWidth,
                          height: e.target.naturalHeight,
                        })
                      }
                    />
                    {/* bbox overlay */}
                    {detections.map((det, index) => {
                      const [xMin, yMin, xMax, yMax] = det.bbox;
                      const color =
                        colorPalette[index % colorPalette.length];

                      const styleBox = {
                        left: `${xMin * 100}%`,
                        top: `${yMin * 100}%`,
                        width: `${(xMax - xMin) * 100}%`,
                        height: `${(yMax - yMin) * 100}%`,
                        borderColor: color,
                      };

                      const labelStyle = {
                        backgroundColor: color,
                      };

                      return (
                        <div
                          key={index}
                          className="bounding-box"
                          style={styleBox}
                        >
                          <div className="box-label" style={labelStyle}>
                            {det.class} {`(${(det.confidence * 100).toFixed(1)}%)`}
                          </div>
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <div className="w-full aspect-video rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-sm" />
                )}
              </div>
            </div>

            {/* Detection Results Table */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Detection Results
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Class
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Confidence
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bounding Box
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {detections.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-4 py-8 text-center text-gray-500"
                        >
                          Upload an image and run detection to see results
                        </td>
                      </tr>
                    ) : (
                      detections.map((det, index) => {
                        const confidencePercent = (
                          det.confidence * 100
                        ).toFixed(1);
                        const bboxFormatted = det.bbox
                          .map((c) => c.toFixed(3))
                          .join(", ");
                        const color =
                          colorPalette[index % colorPalette.length];

                        return (
                          <tr key={index} className="detection-row">
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center">
                                <div
                                  className="w-3 h-3 rounded-full mr-2"
                                  style={{ backgroundColor: color }}
                                />
                                <span className="font-medium text-gray-900">
                                  {det.class}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                                  <div
                                    className="bg-green-500 h-2 rounded-full"
                                    style={{
                                      width: `${confidencePercent}%`,
                                    }}
                                  />
                                </div>
                                <span className="text-gray-700">
                                  {confidencePercent}%
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                              [{bboxFormatted}]
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  {detectionsCountText}
                </div>
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={detections.length === 0}
                  className="px-4 py-2 text-sm text-red-600 hover:text-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Clear Results
                </button>
              </div>
            </div>
          </div>

          {/* 🔹 여기 Link에 state 추가 */}
          <div className="mt-24 flex justify-center">
            <Link
              to="/analysis2"
              state={{ imageSrc }} // ← 이 한 줄이 핵심
              className="px-10 py-4 bg-primary text-white rounded-lg font-medium hover:bg-secondary transition-colors text-xl"
            >
              Next Analysis →
            </Link>
          </div>
        </section>

        {/* Instructions Section */}
        <section
          id="instructions"
          className={`bg-white rounded-xl shadow-md p-6 mb-8 ${
            showInstructions ? "" : "hidden"
          }`}
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            How to Use
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                <span className="text-primary font-bold">1</span>
              </div>
              <h4 className="font-medium text-gray-800 mb-2">Upload Image</h4>
              <p className="text-gray-600 text-sm">
                Click the upload area or drag and drop an image file from your
                device.
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                <span className="text-primary font-bold">2</span>
              </div>
              <h4 className="font-medium text-gray-800 mb-2">
                Run Detection
              </h4>
              <p className="text-gray-600 text-sm">
                Click &quot;Run Object Detection&quot; to analyze the image and
                identify objects.
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                <span className="text-primary font-bold">3</span>
              </div>
              <h4 className="font-medium text-gray-800 mb-2">View Results</h4>
              <p className="text-gray-600 text-sm">
                See bounding boxes on the image and detailed results in the
                table.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-600">&copy; 2025 SceneDrive AI.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AnalysisPage1;
