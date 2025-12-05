// src/ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // 페이지 바뀔 때마다 스크롤 맨 위로
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // 또는 "smooth"
    });
  }, [pathname]);

  return null;
}

export default ScrollToTop;
