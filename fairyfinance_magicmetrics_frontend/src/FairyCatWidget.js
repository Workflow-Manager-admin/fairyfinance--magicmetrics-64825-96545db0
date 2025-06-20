import React, { useEffect, useState } from "react";

/**
 * PUBLIC_INTERFACE
 * FairyCatWidget shows a highly visible, randomly adorned, and animated Cataas cat in a magical, sparkly frame on every dashboard visit!
 */
function FairyCatWidget() {
  // Overlay messages for the cats; pick one at random on each render.
  const fairyMessages = [
    "Fairy Says Hi!",
    "✨ Magic Meow! ✨",
    "Wishing You Sparkles",
    "Fairyland Furball",
    "Cuteness Casts a Spell!",
    "Sparkle Kitty Magic",
    "You're Purr-fect!",
    "May Magic Find You",
    "Dreamy Cat Wishes",
    "Glitter & Whiskers",
    "Mystical Cat Nap",
    "Enchanted Paw-sitivity",
  ];
  // Randomize effect, filter and message for max per-load fun
  const fairyEffects = [
    "",                           // no effect
    "mono",                       // grayscale
    "sepia",                      // gentle sepia
    "blur",                       // artistic blur
    "paint",                      // painting style
    "negative",                   // negative
    "comic",                      // comic-style
    "happy",                      // makes cat look happier!
    "color",                      // random colorization
    "ascii",                      // ascii cat (silly)
    "contrast",                   // high contrast
    "edge",                       // edge highlight
    "flowers",                    // sometimes flowers!
  ];

  // Incorporate small random params (font color, size, etc)
  const fairyFontColors = [
    "ff76e5", // magic pink
    "ffd700", // gold
    "b47cff", // purple
    "7cebff", // blue
    "e87a41", // orange
  ];
  const fairySizes = [36, 38, 40, 42, 46];

  const [imgUrl, setImgUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [usedMsg, setUsedMsg] = useState(""); // For overlay message

  // Randomize cat & params every load
  useEffect(() => {
    // Pick a random message, effect, color, and size
    const msg = fairyMessages[Math.floor(Math.random() * fairyMessages.length)];
    const effect = fairyEffects[Math.floor(Math.random() * fairyEffects.length)];
    const fontColor = fairyFontColors[Math.floor(Math.random() * fairyFontColors.length)];
    const size = fairySizes[Math.floor(Math.random() * fairySizes.length)];

    setUsedMsg(msg);

    // Cataas API: /cat/says/{msg}?effect={effect}&fontColor={color}&size={size}&width=368&height=224&json=true
    let url = `https://cataas.com/cat/says/${encodeURIComponent(msg)}?width=368&height=224&size=${size}&fontColor=${fontColor}&json=true&_cb=${Date.now()}&filter=magic-magic`;
    if (effect) {
      // Use either 'filter' or 'effect'
      if (
        ["mono", "sepia", "blur", "negative", "paint", "color", "ascii", "contrast", "edge", "comic", "flowers", "happy"].includes(
          effect
        )
      ) {
        url += `&filter=${effect}`;
      }
    }

    setLoading(true);
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setImgUrl("https://cataas.com" + data.url);
        setLoading(false);
      })
      .catch(() => {
        setImgUrl("");
        setLoading(false);
      });
  }, []); // Runs at each render

  // Shining sparkles in the magical frame
  function WidgetSparkles() {
    // Animate several sparkles that gently float and shimmer around the frame
    return (
      <svg width="75" height="78" style={{ position: "absolute", top: -44, left: 10, pointerEvents: "none", zIndex: 11 }}>
        {/* Big star */}
        <g>
          <polygon points="36,7 41,23 60,24 44,34 50,56 36,43 23,56 28,34 13,24 33,23"
            fill="#ffd700" opacity="0.65">
            <animateTransform attributeName="transform" type="rotate" values="0 36 23;30 36 23;0 36 23" dur="2.7s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;1;0.8;1;0.7" dur="2.6s" repeatCount="indefinite" />
          </polygon>
          {/* Small sparkles */}
          <circle cx="18" cy="16" r="2.5" fill="#b47cff" opacity="0.77">
            <animate attributeName="r" values="2.5;4;2.8;2.5" dur="3.6s" repeatCount="indefinite" />
          </circle>
          <circle cx="61" cy="42" r="1.6" fill="#ff76e5" opacity="0.89">
            <animate attributeName="r" values="1.6;2.3;1.7;1.6" dur="2.9s" repeatCount="indefinite" />
          </circle>
          <circle cx="31" cy="58" r="1.9" fill="#7cebff" opacity="0.66">
            <animateTransform attributeName="transform" type="translate" values="0 0;4 -3;0 0" dur="2.1s" repeatCount="indefinite" />
          </circle>
        </g>
      </svg>
    );
  }

  // Animated sparkles inside the frame (lower right; twinkling)
  function CornerShimmer() {
    return (
      <svg width="46" height="48" style={{ position: "absolute", right: -12, bottom: -11, zIndex: 12, pointerEvents: "none" }}>
        <polygon points="22,3 25,14 43,14 28,22 32,38 22,28 11,38 15,22 1,14 17,14"
          fill="#fff7ce" opacity="0.77">
          <animateTransform attributeName="transform" type="rotate" values="0 22 14;20 22 14;0 22 14" dur="2.0s" repeatCount="indefinite" />
        </polygon>
        <circle cx="16" cy="34" r="1.6" fill="#ff76e5" />
        <circle cx="38" cy="28" r="2.1" fill="#b47cff" />
        <circle cx="8" cy="16" r="1.1" fill="#ffd700" opacity="0.64" />
      </svg>
    );
  }

  // Widget visual & animation
  return (
    <section
      aria-label="Fairy's Cute Whimsical Cat"
      className="fairy-cat-widget-magic"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        background: "linear-gradient(128deg,#fffbe3 60%,#ffd6fd 87%,#b47cff14 100%)",
        borderRadius: 40,
        boxShadow: "0 0 38px 8px #ff76e577, 0 0 23px #ffd70055, 0 0 0 9px #fffbe340",
        border: "3.0px solid #ffd70080",
        padding: "28px 19px 21px 19px",
        marginBottom: 32,
        marginTop: 5,
        minHeight: 272,
        maxWidth: 395,
        width: "100%",
        overflow: "visible",
        zIndex: 7,
        animation: "cat-widget-float-bounce 2.4s cubic-bezier(.32,1.17,.59,.99) both"
      }}
    >
      <div style={{ position: "absolute", top: -46, left: 11 }}>
        <WidgetSparkles />
      </div>
      <div style={{ position: "absolute", right: -14, bottom: -13 }}>
        <CornerShimmer />
      </div>
      <div
        className="cat-magic-frame"
        style={{
          margin: "0 auto",
          borderRadius: 29,
          maxWidth: 362,
          maxHeight: 221,
          background: "linear-gradient(135deg,#fffbe3 60%,#e7d8fd 100%)",
          boxShadow: "0 0 25px #ffd70091, 0 3px 27px #ff76e588",
          border: "2.5px solid #ffd70077",
          padding: "10px 10px 14px 10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "visible",
          animation: "cat-frame-twinkle 2.23s both infinite alternate"
        }}
      >
        {/* Animated floating stars inside */}
        <svg width="34" height="22" style={{ position: "absolute", left: 0, top: -5, opacity: 0.63, zIndex: 2 }}>
          <polygon
            points="16,1 18,10 28,12 19,16 22,21 16,17 10,21 12,16 2,12 12,9"
            fill="#ffd700"
          >
            <animateTransform attributeName="transform" type="rotate" values="0 16 10;23 16 10;0 16 10" dur="2.8s" repeatCount="indefinite" />
          </polygon>
        </svg>
        {/* Cat image or loading shimmer */}
        {loading ? (
          <div
            style={{
              width: 322,
              height: 182,
              borderRadius: 21,
              background: "linear-gradient(100deg,#ffd70033,#ff76e522,#b47cff11 120%)",
              opacity: 0.43,
              animation: "cat-loading-shimmer 1.1s infinite alternate"
            }}
            aria-label="Loading magical cat"
          />
        ) : (
          imgUrl && (
            <img
              src={imgUrl}
              alt="A fairy-themed whimsical cat from Cataas"
              width={322}
              height={182}
              style={{
                borderRadius: 19,
                boxShadow: "0 6px 41px #ffd70036, 0 0 36px #ff76e531",
                display: "block",
                filter: "drop-shadow(0 1.5px 9px #ffd70041) drop-shadow(0 0 15px #b47cff11)",
                margin: "0 auto",
                backgroundColor: "#fffbe9"
              }}
            />
          )
        )}
        {/* Animated stars top/lower right for frame shimmer */}
        <svg width="29" height="20" style={{ position: "absolute", right: 6, bottom: 5, opacity: 0.55, zIndex: 4 }}>
          <polygon
            points="14,3 18,12 27,13 19,16 21,20 14,17 8,20 10,16 1,13 11,12"
            fill="#b47cff"
          >
            <animateTransform attributeName="transform" type="rotate" values="0 14 11;23 14 11;0 14 11" dur="2.4s" repeatCount="indefinite" />
          </polygon>
        </svg>
      </div>
      <div className="cat-title" style={{
        color: "#ff76e5",
        fontWeight: 700,
        fontSize: "1.31rem",
        fontFamily: "'Purple Purse','Poiret One','Mystery Quest',cursive",
        textShadow: "0 2px 12px #ffd70088,0 0 24px #b47cff44",
        letterSpacing: 1.27,
        marginBottom: 9,
        marginTop: 12,
        animation: "magic-glow-sparkle 2.9s both infinite alternate"
      }}>
        🪄 Fairy's Whimsical Cat 🐾
      </div>
      <div className="cat-message"
        style={{
          color: "#b47cff",
          fontWeight: 600,
          fontSize: "1.13rem",
          marginTop: 7,
          marginBottom: 2,
          background: "rgba(255,254,247,0.60)",
          padding: "7px 18px 8px 18px",
          borderRadius: 21,
          textShadow: "0 0 16px #ffe06682,0 1.5px 8px #ffd6fd77",
          letterSpacing: 1.09,
          boxShadow: "0 0 21px #ffd70013",
          filter: "drop-shadow(0 2px 8px #ff76e531)",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          justifyContent: "center",
          animation: "cat-msg-bounce 2.1s both infinite alternate"
        }}
      >
        <span role="img" aria-label="sparkle-wand" style={{ fontSize: '1.35em' }}>✨</span>
        <span>{usedMsg}</span>
        <span role="img" aria-label="cat-paw" style={{ fontSize: '1.35em' }}>🐾</span>
      </div>
      <div className="cat-message-desc"
        style={{
          color: "#ff76e5",
          fontWeight: 500,
          fontSize: "1.01rem",
          marginTop: 6,
          textShadow: "0 0 8px #ffd70066, 0 1px 5px #ff76e5aa",
          background: "rgba(255,251,227,0.33)",
          padding: "3px 15px",
          borderRadius: 12,
          letterSpacing: 1.0,
        }}>
        May your day be as enchanted and magical as a Fairy's Cat!
      </div>
      {/* Embedded whimsical CSS for floating, shimmer, twinkle etc */}
      <style>
        {`
        @keyframes cat-widget-float-bounce {
          0% { opacity:0; transform: translateY(48px) scale(0.91) rotate(-2deg);}
          28% { opacity:.95; }
          48% { transform: translateY(-7px) scale(1.035) rotate(3deg);}
          60% { transform: translateY(2px) scale(1.01) rotate(-1.7deg);}
          100% { opacity:1; transform: translateY(0) scale(1) rotate(0deg);}
        }
        @keyframes cat-frame-twinkle {
          0% { box-shadow: 0 0 15px #ffd70014, 0 0 10px #b47cff17;}
          46% { box-shadow: 0 0 48px #ffd70077, 0 0 28px #ff76e533;}
          64% { box-shadow: 0 0 23px #ffd70051, 0 0 21px #ff76e560;}
          100% { box-shadow: 0 0 15px #ffd70013, 0 0 9px #b47cff11;}
        }
        @keyframes cat-loading-shimmer {
          0% { background-position: -110px; opacity: .22;}
          100% { background-position: 160px; opacity: .41;}
        }
        @keyframes cat-msg-bounce {
          0% { transform: scale(1) translateY(2px); }
          38% { transform: scale(1.046,0.97) translateY(-4px);}
          61% { transform: scale(0.98,1.03) translateY(5px);}
          100% { transform: scale(1) translateY(0); }
        }
        `}
      </style>
    </section>
  );
}

export default FairyCatWidget;
