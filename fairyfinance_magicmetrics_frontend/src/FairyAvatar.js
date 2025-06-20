import React from "react";

/**
 * PUBLIC_INTERFACE
 * FairyAvatar - Displays a magical, sparkling fairy/user avatar from DiceBear API, styled with magical effects.
 *
 * Props:
 *   - seed: string (optional), customizes avatar (default: "Fairy123")
 *   - size: number (optional), sets avatar size (default: 52)
 *
 * Uses DiceBear's Fun Emoji style for a unique magical avatar.
 */
function FairyAvatar({ seed = "Fairy123", size = 52 }) {
  const url = `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${encodeURIComponent(
    seed
  )}&backgroundType=gradientLinear&backgroundColor=b47cff,ffd700,ff76e5`;
  return (
    <div
      className="fairy-avatar-magic"
      style={{
        position: "relative",
        width: size,
        height: size,
        borderRadius: "52%",
        boxShadow:
          "0 0 32px 8px #ffd70088, 0 0 18px 6px #b47cff70, 0 0 21px 0 #ff76e580",
        background:
          "radial-gradient(circle at 55% 33%, #fffbe3 50%, #ffe066 80%, #b47cff44 100%)",
        overflow: "visible",
        margin: 0,
        zIndex: 20,
        border: "2.7px solid #ff76e5bb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: "avatar-sparkle-glow 2.4s linear infinite alternate"
      }}
      aria-label="Fairy Avatar"
      tabIndex={0}
    >
      {/* Sparkling SVG on top-left */}
      <svg
        width={size / 2.2}
        height={size / 2.2}
        style={{
          position: "absolute",
          left: -12,
          top: -10,
          pointerEvents: "none",
          opacity: 0.78
        }}
        aria-hidden="true"
      >
        <polygon
          points="15,2 18,11 27,12 19,17 22,25 15,20 8,25 11,17 2,12 11,11"
          fill="#ffd700"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0 15 11;36 15 11;0 15 11"
            dur="2.1s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="1;0.74;1"
            dur="2.1s"
            repeatCount="indefinite"
          />
        </polygon>
      </svg>
      {/* Avatar Image */}
      <img
        src={url}
        alt="Magical Fairy Avatar"
        width={size}
        height={size}
        style={{
          borderRadius: "52%",
          boxShadow: "0 0 19px #ffd70090, 0 1.5px 7px #b47cff7a",
          zIndex: 2,
          background: "#fffbe9"
        }}
        draggable={false}
      />
      {/* Sparkly overlay - bottom-right */}
      <svg
        width={size / 2.7}
        height={size / 2.7}
        style={{
          position: "absolute",
          right: -9,
          bottom: -7,
          pointerEvents: "none",
          opacity: 0.62
        }}
        aria-hidden="true"
      >
        <polygon
          points="13,1 17,7 25,9 18,13 21,21 13,16 5,21 8,13 1,9 9,7"
          fill="#7cebff"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0 13 11;33 13 11;0 13 11"
            dur="1.7s"
            repeatCount="indefinite"
          />
        </polygon>
      </svg>
      {/* Star twinkle effect */}
      <svg
        width={size}
        height={size}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          pointerEvents: "none",
        }}
        aria-hidden="true"
      >
        <circle
          cx={size * 0.66}
          cy={size * 0.33}
          r="2"
          fill="#ffe066"
        >
          <animate
            attributeName="r"
            values="2;4;2"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.72;1;0.82;0.64"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
      {/* Sparkle animation keyframes */}
      <style>
        {`
        @keyframes avatar-sparkle-glow {
          0% { box-shadow: 0 0 32px 8px #ffd70088, 0 0 18px 6px #b47cff70; }
          60% { box-shadow: 0 0 38px 14px #b47cff66, 0 0 28px #ff76e588; }
          100% { box-shadow: 0 0 46px 12px #ffd700bb, 0 0 24px #7cebff86; }
        }
        `}
      </style>
    </div>
  );
}

export default FairyAvatar;
