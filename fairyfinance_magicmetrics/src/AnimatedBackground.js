import React, { useEffect, useRef } from "react";

// PUBLIC_INTERFACE
/**
 * AnimatedBackground adds a magical, fairy-dust animated background using SVG particles and sparkles.
 */
function AnimatedBackground() {
  const svgRef = useRef(null);

  // Simple random sparkle animation using SVG and CSS keyframes
  useEffect(() => {
    // Animate position and opacity of stars
    if (svgRef.current) {
      const svg = svgRef.current;
      const sparkles = svg.querySelectorAll("circle,ellipse,path");
      sparkles.forEach((el, idx) => {
        const duration = 3.5 + Math.random() * 3.5;
        el.style.animation = `sparkleAnim${idx % 5} ${duration}s ease-in-out infinite`;
        el.style.opacity = 0.55 + Math.random() * 0.35;
      });
    }
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        pointerEvents: "none",
        zIndex: 0,
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        style={{
          position: "absolute",
          top: 0, left: 0,
          width: "100vw",
          height: "100vh"
        }}
      >
        {/* Render multiple random sparkles & stars */}
        {[...Array(19)].map((_, i) => {
          const cx = Math.random() * 1920;
          const cy = Math.random() * 980;
          const r = 2.1 + Math.random() * 4;
          const color = ["#ffd700", "#ff69b4", "#8a2be2", "#f8e7ff", "#fff6ac"][i % 5];
          return (
            <circle
              key={`sparkle-${i}`}
              cx={cx}
              cy={cy}
              r={r}
              fill={color}
              style={{
                filter: `blur(${Math.random() * 2}px) drop-shadow(0 0 4px ${color})`
              }}
              opacity={0.68}
            />
          );
        })}
        {/* Twinkling larger stars */}
        {[...Array(7)].map((_, i) => {
          const cx = Math.random() * 1600 + 150;
          const cy = Math.random() * 900;
          const size = 15 + Math.random() * 12;
          const hue = ["#ff69b4", "#ffd700", "#8a2be2", "#fff", "#9bd0ff"][i % 5];
          return (
            <g key={`bigstar-${i}`}>
              <ellipse
                cx={cx}
                cy={cy}
                rx={size * 0.18}
                ry={size * 0.57}
                fill={hue}
                opacity="0.33"
                style={{
                  filter: `blur(1.6px)`
                }}
              />
              <ellipse
                cx={cx}
                cy={cy}
                rx={size * 0.57}
                ry={size * 0.18}
                fill={hue}
                opacity="0.33"
                style={{
                  filter: `blur(1.8px)`
                }}
              />
            </g>
          );
        })}
        {/* Shooting star */}
        <path
          d="M 40 100 Q 200 50 400 150"
          stroke="#ffd700"
          strokeWidth="2.5"
          fill="none"
          opacity="0.18"
          style={{ filter: "blur(1px)" }}
        />
      </svg>
      {/* Sparkle keyframes injected inline for scope */}
      <style>
        {`
        @keyframes sparkleAnim0 {
          0% { transform: translateY(0px); opacity:0.7; }
          50% { transform: translateY(-20px) scale(1.22); opacity:1;}
          100% { transform: translateY(0px); opacity:0.6;}
        }
        @keyframes sparkleAnim1 {
          0% { transform: scale(1) rotate(0deg);}
          40% { transform: scale(1.16) rotate(7deg);}
          70% { transform: scale(0.9) rotate(-4deg);}
          100% { transform: scale(1) rotate(0deg);}
        }
        @keyframes sparkleAnim2 {
          0% { transform: translateX(0); filter: blur(1px); }
          50% { transform: translateX(18px) scale(1.1); filter: blur(0.4px);}
          100% { transform: translateX(0); filter: blur(1.2px);}
        }
        @keyframes sparkleAnim3 {
          0% { opacity:0.66;}
          56% { opacity:1;}
          70% { opacity:0.82;}
          100% { opacity:0.63;}
        }
        @keyframes sparkleAnim4 {
          0% { transform: scale(1);}
          30% { transform: scale(1.3);}
          100% { transform: scale(1);}
        }
      `}
      </style>
    </div>
  );
}

export default AnimatedBackground;
