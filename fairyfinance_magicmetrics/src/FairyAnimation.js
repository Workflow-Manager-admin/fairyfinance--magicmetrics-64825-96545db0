import React from "react";

// PUBLIC_INTERFACE
/**
 * FairyAnimation draws and animates a fairy character SVG moving along a curved path at the top of the app.
 * The animation uses CSS keyframes and a SVG fairy with glowing wings and a sparkling wand.
 */
function FairyAnimation() {
  // Motion uses <animateMotion> for smooth SVG motion
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        width: "100vw",
        top: 0,
        left: 0,
        height: 110,
        zIndex: 100,
        pointerEvents: "none",
        overflow: "visible",
        userSelect: "none"
      }}
    >
      <svg
        width="100vw"
        height="110"
        viewBox="0 0 1200 110"
        style={{ width: "100vw", height: 110, display: "block" }}
      >
        {/* Define a wavy path for the fairy to follow */}
        <path
          id="fairy-path"
          d="M 0 60 Q 200 10 400 70 Q 600 130 800 35 Q 1000 -20 1200 80"
          fill="none"
        />
        <g>
          <animateMotion
            xlinkHref="#"
            dur="8s"
            repeatCount="indefinite"
            keyPoints="0;1"
            keyTimes="0;1"
          >
            <mpath xlinkHref="#fairy-path" />
          </animateMotion>
          {/* Fairy SVG: sparkly wings, wand, trail */}
          <g className="tooth-fairy" style={{ transform: "scale(1.16)" }}>
            {/* Fairy body */}
            <ellipse cx="0" cy="0" rx="11" ry="20" fill="#ffd700" filter="url(#fairy-glow)" />
            {/* Fairy dress */}
            <ellipse cx="0" cy="14" rx="14" ry="16" fill="#ff69b4" opacity="0.88" />
            {/* Head */}
            <circle cx="0" cy="-16" r="8" fill="#fff" stroke="#8a2be2" strokeWidth="1.5" />
            {/* Magic wand */}
            <rect x="8" y="-5" width="21" height="3" fill="#8a2be2" transform="rotate(25)" rx="1.5" />
            {/* Sparkle tip */}
            <circle cx="29" cy="2" r="3.1" fill="#fff" opacity="0.79">
              <animate
                attributeName="r"
                values="3.1;7.3;3.1"
                dur="2.2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.8;1;0.8"
                dur="2.2s"
                repeatCount="indefinite"
              />
            </circle>
            {/* Wings (left/right) */}
            <ellipse
              cx="-7"
              cy="-6"
              rx="19"
              ry="9"
              fill="#acd3ff"
              opacity="0.43"
              style={{ filter: "blur(0.8px)", transform: "rotate(-14deg)" }}
            />
            <ellipse
              cx="7"
              cy="-6"
              rx="19"
              ry="9"
              fill="#d3c6ff"
              opacity="0.38"
              style={{ filter: "blur(0.8px)", transform: "rotate(14deg)" }}
            />
            {/* Wand glow behind */}
            <circle cx="28" cy="2" r="9" fill="#ffd700" opacity="0.22">
              <animate
                attributeName="opacity"
                values="0.2;0.5;0.2"
                dur="2.3s"
                repeatCount="indefinite"
              />
            </circle>
            {/* Sparkle trail - simple dots along path */}
            <g>
              {[...Array(8)].map((_, idx) => (
                <circle
                  key={idx}
                  cx={-12 - idx * 9}
                  cy={7 + (idx % 2 ? -4 : 3)}
                  r={2.4 - 0.2 * idx}
                  fill={idx % 3 ? "#8a2be2" : "#ffd700"}
                  opacity={0.19}
                />
              ))}
            </g>
          </g>
        </g>
        <defs>
          <filter id="fairy-glow" x="-100" y="-100" width="300" height="300">
            <feGaussianBlur stdDeviation="8" />
            <feFlood floodColor="#fff" result="A" />
            <feBlend mode="screen" in="SourceGraphic" in2="A" />
          </filter>
        </defs>
        {/* Animate the position of the group */}
        <g>
          <animateMotion
            dur="11s"
            repeatCount="indefinite"
            rotate="auto"
            keyPoints="0;1"
            keyTimes="0;1"
          >
            <mpath xlinkHref="#fairy-path" />
          </animateMotion>
        </g>
      </svg>
    </div>
  );
}

export default FairyAnimation;
