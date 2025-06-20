import React from "react";

/**
 * Animated Fairy SVG component that floats from left to right across the top.
 *
 * PUBLIC_INTERFACE
 */
function FairyAnimation() {
  return (
    <div className="fairy-flight-container" aria-hidden="true">
      <svg
        className="fairy-figure"
        width="80"
        height="54"
        viewBox="0 0 80 54"
        fill="none"
        style={{ display: "block" }}
      >
        {/* Wings */}
        <ellipse cx="17" cy="22" rx="13" ry="7" fill="#cbb6ffcc">
          <animate attributeName="rx" values="13;15;13" dur="2.3s" repeatCount="indefinite" />
          <animate attributeName="ry" values="7;9;7" dur="2.3s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="29" cy="17" rx="9.5" ry="5.5" fill="#b6ffdccc" opacity="0.85">
          <animate attributeName="rx" values="9.5;11;9.5" dur="2.1s" repeatCount="indefinite" begin="0.2s"/>
          <animate attributeName="ry" values="5.5;7;5.5" dur="2.1s" repeatCount="indefinite" begin="0.1s"/>
        </ellipse>
        {/* Sparkle Dust */}
        <g>
          <circle cx="12" cy="42" r="1.2" fill="#ffd700" opacity="0.7" >
            <animate attributeName="r" values="1.2;2;1.2" dur="1.2s" repeatCount="indefinite" />
          </circle>
          <circle cx="34" cy="35" r="1" fill="#8fecff" opacity="0.55" />
          <circle cx="17.5" cy="10" r="0.8" fill="#ff76e5" opacity="0.6" />
          <circle cx="65" cy="23" r="1.13" fill="#b47cff" opacity="0.7" />
        </g>
        {/* Dress */}
        <ellipse cx="40" cy="32" rx="11" ry="15" fill="url(#dress-grad)">
          <animateTransform attributeName="transform" type="skewX" values="5;3;5" dur="1.5s" repeatCount="indefinite" />
        </ellipse>
        {/* Head */}
        <circle cx="40" cy="17.5" r="7.2" fill="#ffe66d" stroke="#fff7c8" strokeWidth="1" />
        {/* Bun magic glow */}
        <circle cx="37" cy="11" r="2.5" fill="#ff76e577" filter="url(#glitter-fairy-glow)" />
        {/* Arms */}
        <rect x="32" y="27" width="16" height="4" rx="2.2" fill="#ffe19a" transform="rotate(-24 40 29)">
          <animateTransform attributeName="transform" type="rotate" values="-24 40 29; -40 40 29; -24 40 29" dur="1.3s" repeatCount="indefinite" />
        </rect>
        <rect x="32" y="27" width="16" height="3.3" rx="1.7" fill="#ffe19a" transform="rotate(20 40 29)">
          <animateTransform attributeName="transform" type="rotate" values="20 40 29; 48 40 29; 20 40 29" dur="1.41s" repeatCount="indefinite" />
        </rect>
        {/* Wand */}
        <rect x="64" y="15" width="15" height="1.3" rx="0.85" fill="#ffe066" opacity="0.95"
              transform="rotate(-30 65 15)">
          <animate attributeName="width" values="15;12;15" dur="1.7s" repeatCount="indefinite" />
        </rect>
        <circle cx="78" cy="9.3" r="2.2" fill="#fff7c8" filter="url(#glitter-fairy-glow)">
          <animate attributeName="r" values="2.2;3.7;2.2" dur="1.33s" repeatCount="indefinite" />
        </circle>
        {/* Face details (small eyes + smile) */}
        <ellipse cx="37.8" cy="18" rx=".8" ry=".61" fill="#432b65" />
        <ellipse cx="42.3" cy="18" rx=".7" ry=".58" fill="#432b65" />
        <path d="M38.7 20.2 Q40 21.2 41.6 20.1" stroke="#a872cc" strokeWidth=".5" fill="none" />
        {/* Sparkling magic trail */}
        <g>
          <circle cx="67" cy="12" r="1" fill="#ff76e5bb" >
            <animate attributeName="opacity" values="0.7;1;0.4;1" dur="1.6s" repeatCount="indefinite" />
          </circle>
          <circle cx="74" cy="18" r="0.8" fill="#ffd700bb" >
            <animate attributeName="opacity" values="1;0.4;1;0.7" dur="1.2s" repeatCount="indefinite" />
          </circle>
          <circle cx="70" cy="8" r="1.3" fill="#ffd6fd" >
            <animate attributeName="opacity" values="1;0.2;0.9;1" dur="1.6s" repeatCount="indefinite" />
          </circle>
        </g>
        <defs>
          <radialGradient id="dress-grad" cx="40%" cy="62%" r="78%" fx="60%" fy="40%">
            <stop offset="0%" stopColor="#fff7c8"/>
            <stop offset="68%" stopColor="#ffd6fd"/>
            <stop offset="100%" stopColor="#b47cff" />
          </radialGradient>
          <filter id="glitter-fairy-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="1.7" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
    </div>
  );
}

export default FairyAnimation;
