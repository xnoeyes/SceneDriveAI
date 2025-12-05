// src/FadeInSection.jsx
import React, { useEffect, useRef, useState } from "react";

function FadeInSection({ children, className = "" }) {
  const domRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);       
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15, // 요소의 15% 정도 보이면 트리거
      }
    );

    if (domRef.current) {
      observer.observe(domRef.current);
    }

    return () => {
      if (domRef.current) observer.unobserve(domRef.current);
    };
  }, []);

  return (
    <div
      ref={domRef}
      className={`fade-in-section ${isVisible ? "is-visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

export default FadeInSection;
