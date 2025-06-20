import React, { useState } from "react";
import FairyAvatar from "./FairyAvatar";
import "./FairyInputForms.css";

/**
 * PUBLIC_INTERFACE
 * FairyDesigner - Interactive magical form for users to name and customize their fairy,
 * with live DiceBear avatar preview and sparkling, whimsical UI.
 */
function FairyDesigner() {
  // Local state for fairy customization options
  const [fairyName, setFairyName] = useState("");
  const [color, setColor] = useState("b47cff"); // magical purple
  const [wings, setWings] = useState("butterfly"); // wingset
  const [accessory, setAccessory] = useState("magicWand");
  const [bgType, setBgType] = useState("gradientLinear");

  // Store selection for display after submit
  const [savedDesign, setSavedDesign] = useState(null);

  // DiceBear (v7) API supports many avatar styles.
  // We'll use "adventurer" for fairy-like options (wings, accessories, skin color via palette)
  // Available params: seed, hair, accessories, backgroundColor, backgroundType, etc.
  // https://www.dicebear.com/styles/adventurer/

  // Helper to build avatar URL from config
  function getAvatarUrl() {
    const params = [
      `seed=${encodeURIComponent(fairyName || "MyFairy")}`,
      `backgroundColor=${color}`,
      `backgroundType=${bgType}`,
      // Adventurer style: accessories can take array (add magic wand, glasses, etc)
      `accessories[]=${accessory}`,
      // Wings: Not a built-in for adventurer, so we use earrings or glasses as a stand-in for demo.
      // But we can randomize or swap part by seed.
    ].join("&");
    return `https://api.dicebear.com/7.x/adventurer/svg?${params}`;
  }

  // Magical sparkle background for the preview
  function SparkleGlow() {
    return (
      <svg
        width="210"
        height="130"
        style={{
          position: "absolute",
          left: "-46px",
          top: "-26px",
          pointerEvents: "none",
          zIndex: 2,
          opacity: 0.55,
          filter: "drop-shadow(0 0 16px #ffd700bb)"
        }}
      >
        <polygon
          points="70,15 74,46 101,50 78,67 84,115 70,92 56,115 62,67 39,50 66,46"
          fill="#ffd700"
          opacity="0.59"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0 70 67;22 70 67;0 70 67"
            dur="3.7s"
            repeatCount="indefinite"
          />
        </polygon>
        <circle cx="22" cy="37" r="6" fill="#ff76e5" />
        <circle cx="170" cy="32" r="7" fill="#b47cff" />
        <circle cx="135" cy="110" r="5" fill="#7cebff" />
        <circle cx="32" cy="96" r="5.7" fill="#ffd700" />
        <circle cx="192" cy="90" r="4" fill="#b47cff" />
      </svg>
    );
  }

  // Whimsical label sparkle
  function LabelSparkle({ icon }) {
    return (
      <span
        className="fairy-label-sparkle"
        style={{
          fontSize: "1.16em",
          marginLeft: 5,
          animation: "fairy-label-twinkle 1.3s ease-in-out infinite alternate"
        }}
        aria-hidden="true"
      >
        {icon}
      </span>
    );
  }

  // Submission handler: save design in memory
  function handleSave(e) {
    e.preventDefault();
    setSavedDesign({
      fairyName,
      color,
      wings,
      accessory,
      bgType
    });
  }

  // Palette options for magical colors
  const colorChoices = [
    { name: "Sparkle Gold", value: "ffd700" },
    { name: "Magic Pink", value: "ff76e5" },
    { name: "Fairy Purple", value: "b47cff" },
    { name: "Dream Blue", value: "7cebff" },
    { name: "Enchanted Green", value: "9affd1" },
    { name: "Moon White", value: "fff7c8" }
  ];

  // Accessory options (magicWand, flower, sunglasses, glasses, mustache, earring)
  const accessoryChoices = [
    { label: "Magic Wand", value: "magicWand" },
    { label: "Flower", value: "flower" },
    { label: "Glasses (Fairy Specs)", value: "glasses" },
    { label: "Earrings", value: "earring" },
    { label: "Mustache (Disguise!)", value: "mustache" },
    { label: "Sunglasses", value: "sunglasses" }
  ];

  // Simulated wings using seed trick (since wings not in API, so swap look via string)
  const wingChoices = [
    { label: "Butterfly", value: "butterfly" },
    { label: "Dragonfly", value: "dragonfly" },
    { label: "Angel", value: "angel" },
    { label: "Bat", value: "bat" }
  ];

  // Background options
  const bgChoices = [
    { label: "Magical Gradient", value: "gradientLinear" },
    { label: "Solid", value: "solid" }
  ];

  // Whimsical floating star deco
  function FloatingStar() {
    return (
      <svg width="43" height="42" style={{ position: "absolute", right: -18, top: 8 }}>
        <polygon
          points="22,3 25,17 41,17 27,26 31,41 22,33 13,41 17,26 3,17 19,17"
          fill="#fff7c8"
          opacity="0.7"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0 22 20;24 22 20;0 22 20"
            dur="2.5s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.52;1;0.6;1"
            dur="2.3s"
            repeatCount="indefinite"
          />
        </polygon>
      </svg>
    );
  }

  // Compute avatar URL with all selected parameters
  const liveAvatarUrl = getAvatarUrl();

  return (
    <section
      className="fairy-form-section"
      style={{ marginTop: 32, marginBottom: 45, zIndex: 4, position: "relative" }}
      aria-label="Design and Name Your Fairy"
    >
      <form
        className="fairy-form fairy-designer-form"
        style={{
          background: "linear-gradient(128deg,#ffe066bb,#ffd6fd70 70%,#b47cff19 100%)",
          border: "2.4px solid #b47cff75",
          boxShadow: "0 0 41px 4px #ffd70044,0 0 16px #b47cff33",
          maxWidth: 540,
          margin: "0 auto",
          minWidth: 278,
          position: "relative"
        }}
        autoComplete="off"
        spellCheck="false"
        onSubmit={handleSave}
      >
        <h2 className="fairy-form-title" style={{ zIndex: 3, position: "relative" }}>
          <span role="img" aria-label="sparkle">🪄</span> Design Your Fairy
        </h2>
        {FloatingStar()}
        {/* Name */}
        <div className="fairy-field-group">
          <label htmlFor="fairy-name" className="fairy-label">
            Fairy Name {LabelSparkle({ icon: "✨" })}
          </label>
          <input
            id="fairy-name"
            className="fairy-input"
            type="text"
            maxLength={24}
            value={fairyName}
            onChange={e => setFairyName(e.target.value.replace(/[^a-zA-Z0-9 ']/g, ""))}
            placeholder="Whisper your fairy's name…"
            required
            autoFocus
          />
        </div>
        {/* Color */}
        <div className="fairy-field-group">
          <label htmlFor="fairy-color" className="fairy-label">
            Fairy Color/Outfit {LabelSparkle({ icon: "🎨" })}
          </label>
          <select
            id="fairy-color"
            className="fairy-input"
            value={color}
            onChange={e => setColor(e.target.value)}
          >
            {colorChoices.map((opt) => (
              <option value={opt.value} key={opt.value}>{opt.name}</option>
            ))}
          </select>
        </div>
        {/* Wings */}
        <div className="fairy-field-group">
          <label htmlFor="fairy-wings" className="fairy-label">
            Wings {LabelSparkle({ icon: "🦋" })}
          </label>
          <select
            id="fairy-wings"
            className="fairy-input"
            value={wings}
            onChange={e => setWings(e.target.value)}
          >
            {wingChoices.map(opt => (
              <option value={opt.value} key={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        {/* Accessory */}
        <div className="fairy-field-group">
          <label htmlFor="fairy-accessory" className="fairy-label">
            Accessory {LabelSparkle({ icon: "🌸" })}
          </label>
          <select
            id="fairy-accessory"
            className="fairy-input"
            value={accessory}
            onChange={e => setAccessory(e.target.value)}
          >
            {accessoryChoices.map(opt => (
              <option value={opt.value} key={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        {/* Background type */}
        <div className="fairy-field-group">
          <label htmlFor="fairy-bgtype" className="fairy-label">
            Avatar Background {LabelSparkle({ icon: "🌈" })}
          </label>
          <select
            id="fairy-bgtype"
            className="fairy-input"
            value={bgType}
            onChange={e => setBgType(e.target.value)}
          >
            {bgChoices.map(opt => (
              <option value={opt.value} key={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        {/* Live avatar preview */}
        <div
          style={{
            margin: "26px auto 0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            minHeight: 134,
            zIndex: 2
          }}
        >
          <div style={{ position: "relative", zIndex: 2 }}>
            <SparkleGlow />
            <img
              src={liveAvatarUrl}
              alt="Magical Fairy Avatar Preview"
              width={120}
              height={120}
              style={{
                borderRadius: "53%",
                boxShadow: "0 0 29px #ffd70066,0 0 14px #b47cff55",
                background: "#fffbe9",
                border: "3.7px solid #ffd700a7",
                position: "relative",
                zIndex: 4,
                margin: "0 auto",
                minHeight: 84
              }}
              draggable={false}
            />
            <div
              style={{
                position: "absolute",
                left: 20,
                top: 80,
                color: "#b47cff",
                background: "rgba(255,255,255,0.8)",
                fontFamily: "Purple Purse, cursive",
                fontWeight: 500,
                fontSize: "1.0em",
                borderRadius: "16px",
                boxShadow: "0 0 14px #ff76e533",
                padding: wings === "angel" ? "8px 17px 8px 15px" : "5px 11px",
                zIndex: 6,
                minWidth: 65
              }}
              aria-label="Selected Fairy Wings"
            >
              {wings === "butterfly" && "🦋 Butterfly"}
              {wings === "dragonfly" && "🐲 Dragonfly"}
              {wings === "angel" && "👼 Angel"}
              {wings === "bat" && "🦇 Bat"}
            </div>
          </div>
        </div>
        {/* Save Button */}
        <button
          className="btn btn-large fairy-form-btn"
          type="submit"
          style={{ marginTop: 24 }}
        >
          <span role="img" aria-label="wand">🪄</span> Save My Fairy!
        </button>
      </form>
      {/* Show saved fairy after submit */}
      {savedDesign && (
        <div
          style={{
            marginTop: 36,
            textAlign: "center",
            borderRadius: 18,
            background: "linear-gradient(115deg,#fffbe3 77%,#ffd6fd 100%)",
            boxShadow: "0 1.5px 22px #ffd70041,0 0 12px #b47cff21",
            padding: 20,
            maxWidth: 345,
            marginLeft: "auto",
            marginRight: "auto"
          }}
          aria-live="polite"
        >
          <div
            style={{
              fontFamily: "Purple Purse, cursive",
              color: "#b47cff",
              fontWeight: 700,
              fontSize: "1.22em",
              textShadow: "0 2px 10px #ffd700a8,0 0 5px #ff76e588"
            }}
          >
            Meet {savedDesign.fairyName}! <span aria-label="sparkle">✨</span>
          </div>
          <img
            src={getAvatarUrl()}
            alt="Your Designed Fairy"
            width={96}
            height={96}
            style={{
              marginTop: 8,
              borderRadius: "50%",
              background: "#fffbe9",
              border: "3px solid #ffd700a7",
              boxShadow: "0 0 18px #ffd70048,0 0 8px #b47cff33"
            }}
          />
          <div
            style={{
              color: "#7cebff",
              fontWeight: 500,
              fontSize: "1em",
              marginTop: 4,
              textShadow: "0 1.5px 8px #ffd70060,0 0 5px #b47cff45"
            }}
          >
            Outfit: <span style={{ color: "#" + savedDesign.color }}>{colorChoices.find(c=>c.value===savedDesign.color)?.name}</span>{" "}
            | Wings: {wingChoices.find(w=>w.value===savedDesign.wings)?.label}
            <br />
            Accessory: {accessoryChoices.find(a=>a.value===savedDesign.accessory)?.label}
          </div>
        </div>
      )}
      <style>
        {`
        .fairy-designer-form {
          background: linear-gradient(134deg, #fffbe3 57%, #ffd6fd 90%);
        }
        `}
      </style>
    </section>
  );
}

export default FairyDesigner;
