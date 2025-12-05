// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import YOLODetails from "./YOLODetails";
import VLDetails from "./VLDetails";
import PipelineDetails from "./PipelineDetails";
import AnalysisPage1 from "./AnalysisPage1";
import AnalysisPage2 from "./AnalysisPage2";
import ScrollToTop from "./ScrollToTop";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop /> 
      <Routes>
        {/* 메인 랜딩 페이지 */}
        <Route path="/" element={<Home />} />

        {/* Block 1*/}

        <Route path="/yolo-details" element={<YOLODetails />} />

        {/* Block 2*/}

        <Route path="/vl-details" element={<VLDetails />} />

        {/* Block 3*/}
        
        <Route path="/pipeline-details" element={<PipelineDetails />} />
        
        <Route path="/analysis1" element={<AnalysisPage1 />} />
        <Route path="/analysis2" element={<AnalysisPage2 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
