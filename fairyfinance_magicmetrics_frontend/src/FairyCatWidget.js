import React, { useState, useEffect } from "react";

/**
 * PUBLIC_INTERFACE
 * Fairy Cat Widget - displays a whimsical cat image from Cataas with a magical fairy-themed message.
 * API: https://cataas.com/cat/says/Hello%20Fairy
 */
function FairyCatWidget() {
  const [imgUrl, setImgUrl] = useState("");
  const [loading, setLoading] = useState(true);

  // Get a unique image by appending a timestamp to bust cache for more magic!
  useEffect(() => {
    const fairyMsg = encodeURIComponent("Fairy-Sparkle!");
    // Could randomize this further if needed; for now, keep the whimsical message steady.
    const url = `https://cataas.com/cat/says/Hello%20Fairy?width=340&height=220&fontColor=ff76e5&size=38&json=true&_cb=${Date.now()}`;
    setLoading(true);
    fetch(url)
      .then(res => res.json())
      .then(data => {
        // Compose the direct image URL (Cataas returns "url" path)
        setImgUrl("https://cataas.com" + data.url);
        setLoading(false);
      })
      .catch(() => {
        setImgUrl("");
        setLoading(false);
      });
  }, []); // Load once

  // Magical sparkles (SVG overlay)
  const SparkleFX = () => (
    <svg width="50" height="50" style={{ position: "absolute", top: 7, left: 15, pointerEvents: "none"}}>
      <g>
        <polygon points="25,4 27,16 40,18 29,23 32,36 25,28 18,36 21,23 10,18 23,16"
          fill="#ffd700" opacity="0.61" >
          <animateTransform attributeName="transform" type="rotate" values="0 25 16;35 25 16;0 25 16" dur="2.2s" repeatCount="indefinite" />
        </polygon>
      </g>
    </svg>
  );

  return (
    <div
      className="fairy-cat-widget"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        background: "linear-gradient(100deg,#fffbe3,#ffd6fd 67%,#b47cff1a 100%)",
        borderRadius: 36,
        boxShadow: "0 0 26px #ff76e575, 0 0 13px #ffd70055",
        border: "2.5px solid #ff76e533",
        padding: "24px 16px 18px 16px",
        marginBottom: 21,
        marginTop: 6,
        minHeight: 240,
        overflow: "visible",
        maxWidth: 370,
        zIndex: 4,
        animation: "fairy-cat-float 1.23s cubic-bezier(.32,1.09,.64,0.97)"
      }}
    >
      <div style={{ position: "absolute", top: -32, left: 14, zIndex: 2, opacity: 0.82 }}>
        <SparkleFX />
      </div>
      <div className="cat-title" style={{
        color: "#ff76e5",
        fontWeight: 700,
        fontSize: "1.31rem",
        fontFamily: "'Purple Purse','Poiret One','Mystery Quest',cursive",
        textShadow: "0 2px 10px #ffd70055,0 0 24px #b47cff44",
        letterSpacing: 1.2,
        marginBottom: 7,
        animation: "magic-glow-sparkle 2.7s both infinite alternate"
      }}>
        ✨ Fairy's Whimsical Cat ✨
      </div>
      <div
        className="cat-image-container"
        style={{
          margin: "0 auto",
          borderRadius: 22,
          maxWidth: 345,
          maxHeight: 212,
          background: "linear-gradient(131deg,#fffbe3 60%,#e7d8fd 100%)",
          boxShadow: "0 0 20px #ffd70060, 0 2px 14px #b47cff30",
          padding: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {loading ? (
          <div
            style={{
              width: 300, height: 160,
              borderRadius: 17,
              background: "linear-gradient(87deg,#ffe06677,#ff76e547,#b47cff11)",
              opacity: 0.37,
              animation: "fairy-cat-shimmer 1.2s infinite alternate"
            }}
            aria-label="Loading magical cat"
          ></div>
        ) : (
          imgUrl && (
            <img
              src={imgUrl}
              alt="A fairy-themed whimsical cat from Cataas"
              width={300}
              height={160}
              style={{
                borderRadius: 17,
                boxShadow: "0 3px 21px #ffd70040, 0 0 38px #ff76e526",
                display: "block"
              }}
            />
          )
        )}
      </div>
      <div className="cat-message"
        style={{
          color: "#b47cff",
          fontWeight: 500,
          fontSize: "1.11rem",
          marginTop: 11,
          background: "rgba(255,254,247,0.45)",
          padding: "7px 13px",
          borderRadius: 18,
          textShadow: "0 0 12px #ffe06677,0 1.5px 6px #ffd6fd77",
          letterSpacing: 1.1,
          boxShadow: "0 0 12px #ffd70011"
        }}
      >
        <span role="img" aria-label="Wand">🪄</span> May your day be as enchanted as a fairy's cat! <span role="img" aria-label="cat">🐾</span>
      </div>
      {/* Widget-specific shimmer and float keyframes */}
      <style>
        {`
        @keyframes fairy-cat-float {
          0% { opacity:0; transform: translateY(35px) scale(0.98);}
          70% { opacity:.95;}
          100% { opacity:1; transform: translateY(0) scale(1);}
        }
        @keyframes fairy-cat-shimmer {
          0% { background-position: -90px; opacity: .23;}
          100% { background-position: 140px; opacity: .42;}
        }
        `}
      </style>
    </div>
  );
}

export default FairyCatWidget;
