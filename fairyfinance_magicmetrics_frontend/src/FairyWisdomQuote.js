import React, { useEffect, useState } from "react";

/**
 * PUBLIC_INTERFACE
 * Magical Fairy Wisdom Quote Widget - fetches a quote from Quotable API and displays it with sparkles and glowing magic
 */
function FairyWisdomQuote() {
  const [quote, setQuote] = useState({ text: "", author: "" });
  const [loading, setLoading] = useState(true);

  // Fetch a quote from the quotable API
  useEffect(() => {
    setLoading(true);
    fetch("https://api.quotable.io/random")
      .then((resp) => resp.json())
      .then((data) => {
        setQuote({ text: data.content, author: data.author || "Unknown" });
        setLoading(false);
      })
      .catch(() => {
        setQuote({
          text: "Magic is believing in yourself. If you can do that, you can make anything happen.",
          author: "Goethe",
        });
        setLoading(false);
      });
  }, []);

  // Sparkle SVG for deco
  function SparkleGlyph() {
    return (
      <svg width="28" height="28" fill="none" style={{ verticalAlign: 'middle', marginRight: 6 }}>
        <g filter="url(#sparkle-glow)">
          <polygon
            points="14,3 16,12 26,12 17,18 20,27 14,21 8,27 11,18 2,12 12,12"
            fill="#ffd700"
            opacity="0.71"
          />
        </g>
        <defs>
          <filter id="sparkle-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
    );
  }

  return (
    <div
      className="fairy-wisdom-widget"
      style={{
        margin: "0 auto",
        marginBottom: 24,
        maxWidth: 540,
        background: "linear-gradient(110deg, #fffbe3 70%, #fff0fd 100%)",
        borderRadius: 32,
        boxShadow: "0 0 28px #ffd6fd55, 0 0 48px #b47cff1f",
        border: "2px solid #ffd70055",
        padding: "26px 28px 22px 28px",
        textAlign: "center",
        position: "relative",
        zIndex: 2,
        animation: "fairy-quote-float 1.2s cubic-bezier(.16,1.18,.62,.99)",
        overflow: "visible",
      }}
    >
      {/* Sparkly animated deco swirls */}
      <div style={{
        position: "absolute",
        top: "-28px",
        left: 8,
        zIndex: 1,
        pointerEvents: "none",
        opacity: 0.83
      }}>
        <SparkleGlyph />
      </div>
      <div style={{
        position: "absolute",
        bottom: "-14px",
        right: 18,
        zIndex: 1,
        pointerEvents: "none",
        opacity: 0.77,
        transform: "rotate(41deg)"
      }}>
        <SparkleGlyph />
      </div>
      <div
        className="wisdom-title"
        style={{
          fontFamily: "'Purple Purse', 'Poiret One', 'Mystery Quest', cursive, sans-serif",
          color: "#b47cff",
          letterSpacing: 1.4,
          fontSize: "1.36rem",
          fontWeight: 700,
          textShadow: "0 0 12px #ffd6fd, 0 0 14px #ffd70044",
          marginBottom: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          animation: "shine-glow 2.1s infinite alternate"
        }}
      >
        <span aria-label="sparkle" role="img" style={{ fontSize: "1.7em", verticalAlign: "middle" }}>✨</span>
        Fairy Wisdom
        <span aria-label="sparkle" role="img" style={{ fontSize: "1.19em", marginLeft: 2 }}>🧚‍♀️</span>
      </div>
      <div
        className="wisdom-quote-container"
        style={{
          minHeight: 52,
          margin: "12px 0",
          padding: "0 5px",
        }}
      >
        {loading ? (
          <span className="wisdom-sparkle-shimmer" style={{
            display: "inline-block",
            minHeight: "1em",
            minWidth: "160px",
            borderRadius: 9,
            background: "linear-gradient(90deg, #ffd70033, #ff76e577 45%, #b47cff44 80%)",
            opacity: 0.45
          }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        ) : (
          <span
            className="wisdom-quote-text"
            style={{
              display: "inline-block",
              fontSize: "1.21em",
              fontWeight: 600,
              fontStyle: "italic",
              color: "#8659c7",
              textShadow: "0 0 10px #ffd6fd76, 0 1.5px 8px #ffe06671, 0 0 16px #ff76e566",
              background: "rgba(255,255,255,0.43)",
              padding: "8px 14px 9px 14px",
              borderRadius: "18px 5px 23px 8px",
              position: "relative",
              animation: "fairy-sparkle-pulse 3.2s infinite alternate"
            }}
          >
            <SparkleGlyph />
            {quote.text}
            <SparkleGlyph />
          </span>
        )}
      </div>
      <div
        className="wisdom-quote-author"
        style={{
          color: "#b47cff",
          fontWeight: 400,
          marginTop: 8,
          fontSize: "1em",
          fontStyle: "italic",
          textShadow: "0 0 8px #ffd70088",
        }}
      >
        {!loading && quote.author && <>– {quote.author}</>}
      </div>
      <div
        className="wisdom-desc"
        style={{
          fontSize: "0.97em",
          color: "#b47cffbb",
          marginTop: 4,
          textShadow: "0 0 8px #fffbe977"
        }}
      >
        A magical thought... just for you.
      </div>
      {/* Animations and sparkles */}
      <style>
        {`
          @keyframes fairy-sparkle-pulse {
            0% { box-shadow: 0 0 18px #ffd6fd54, 0 0 28px #ffd70033; }
            50% { box-shadow: 0 0 36px #b47cff36, 0 0 24px #ff76e557; }
            100% { box-shadow: 0 0 18px #ffd6fd54, 0 0 32px #ffe06633; }
          }
          @keyframes shine-glow {
            0% { text-shadow: 0 0 18px #fff7fc44, 0 0 12px #ffd70044; }
            100% { text-shadow: 0 0 28px #b47cff66, 0 0 18px #ffd70099; }
          }
          .wisdom-sparkle-shimmer {
            animation: shimmer-magic 1.3s infinite alternate linear;
          }
          @keyframes shimmer-magic {
            0% { background-position: -100px; opacity: .18;}
            100% { background-position: 155px; opacity: .36;}
          }
        `}
      </style>
    </div>
  );
}

export default FairyWisdomQuote;
