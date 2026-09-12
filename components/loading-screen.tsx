"use client";

import { useEffect, useState } from "react";

export default function LoadingScreen({
  onFinish,
  duration = 2800,
}: {
  onFinish?: () => void;
  duration?: number;
}) {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOut(true), Math.max(0, duration - 600));
    const hideTimer = setTimeout(() => {
      setVisible(false);
      onFinish?.();
    }, duration);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [duration, onFinish]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "radial-gradient(ellipse at center, #050510 0%, #000 70%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transition: "opacity 0.6s ease",
        opacity: fadeOut ? 0 : 1,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;600;700&display=swap');

        @keyframes nexus-rotate3d {
          0% { transform: rotateY(0deg) rotateX(10deg); }
          100% { transform: rotateY(360deg) rotateX(10deg); }
        }
        @keyframes nexus-shimmer {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        @keyframes nexus-bar {
          0% { width: 0%; }
          100% { width: 100%; }
        }

        .nexus-ls-perspective { perspective: 600px; }
        .nexus-ls-hex-wrapper {
          position: relative;
          width: 180px;
          height: 180px;
          transform-style: preserve-3d;
          animation: nexus-rotate3d 8s linear infinite;
        }
        .nexus-ls-face {
          position: absolute;
          width: 180px;
          height: 180px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .nexus-ls-face svg { width: 100%; height: 100%; }
        .nexus-ls-face-front { transform: translateZ(6px); }
        .nexus-ls-edge-1 { transform: rotateY(60deg) translateZ(87px); }
        .nexus-ls-edge-2 { transform: rotateY(120deg) translateZ(87px); }
        .nexus-ls-edge-3 { transform: rotateY(240deg) translateZ(87px); }
        .nexus-ls-wordmark {
          font-family: 'Orbitron', monospace;
          font-size: 32px;
          font-weight: 900;
          letter-spacing: 10px;
          background: linear-gradient(90deg, #4488ff, #aa44ff, #4488ff);
          background-size: 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: nexus-shimmer 3s linear infinite;
        }
        .nexus-ls-progress-bar { animation: nexus-bar linear forwards; }
      `}</style>

      <div className="nexus-ls-perspective">
        <div className="nexus-ls-hex-wrapper">
          <div className="nexus-ls-face nexus-ls-face-front">
            <svg viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <defs>
                <linearGradient id="ls-hexGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#001133" />
                  <stop offset="100%" stopColor="#110033" />
                </linearGradient>
              </defs>
              <polygon points="90,10 160,50 160,130 90,170 20,130 20,50" fill="url(#ls-hexGrad)" stroke="#2244aa" strokeWidth="1.5" />
              <polygon points="90,22 148,56 148,124 90,158 32,124 32,56" fill="none" stroke="#113366" strokeWidth="0.5" />
              <line x1="58" y1="58" x2="58" y2="122" stroke="#4488ff" strokeWidth="6" strokeLinecap="round" style={{ filter: "drop-shadow(0 0 6px #4488ff)" }} />
              <line x1="58" y1="58" x2="122" y2="122" stroke="#6644cc" strokeWidth="4" strokeLinecap="round" style={{ filter: "drop-shadow(0 0 5px #6644cc)" }} />
              <line x1="122" y1="58" x2="122" y2="122" stroke="#4488ff" strokeWidth="6" strokeLinecap="round" style={{ filter: "drop-shadow(0 0 6px #4488ff)" }} />
              <circle cx="58" cy="58" r="4" fill="#88aaff" />
              <circle cx="122" cy="58" r="4" fill="#88aaff" />
              <circle cx="58" cy="122" r="4" fill="#88aaff" />
              <circle cx="122" cy="122" r="4" fill="#88aaff" />
            </svg>
          </div>

          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className={`nexus-ls-face nexus-ls-edge-${index}`}
              style={{
                width: 12,
                height: 160,
                top: 10,
                left: 84,
                background: "linear-gradient(to bottom, #0066ff, #7700ff)",
                borderRadius: 1,
                opacity: 0.6,
              }}
            />
          ))}
        </div>
      </div>

      <div style={{ marginTop: 36, textAlign: "center" }}>
        <div className="nexus-ls-wordmark">NEXUS</div>
        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 11, letterSpacing: 5, color: "#4466aa", marginTop: 6 }}>
          AARVAK · TSJ
        </div>
      </div>

      <div style={{ marginTop: 48, width: 200, height: 2, background: "#0d0d1a", borderRadius: 1, overflow: "hidden" }}>
        <div className="nexus-ls-progress-bar" style={{ height: "100%", background: "linear-gradient(90deg, #4488ff, #aa44ff)", animationDuration: `${Math.max(0, duration - 800)}ms`, width: 0 }} />
      </div>

      <div style={{ marginTop: 16, fontFamily: "'Orbitron', monospace", fontSize: 9, letterSpacing: 4, color: "#333", textTransform: "uppercase" }}>
        Initializing
      </div>
    </div>
  );
}
