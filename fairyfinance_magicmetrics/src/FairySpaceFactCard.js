import React, { useState, useEffect } from "react";
import "./App.css";

/*
  PUBLIC_INTERFACE
  FairySpaceFactCard: Displays the current Astronomy Picture of the Day (APOD) and fact from NASA's public API.
  - Uses NASA's APOD API (https://api.nasa.gov/planetary/apod) with DEMO_KEY, no account required.
  - Shows astronomy image (if available), whimsical fairy-tale card visuals, and fact/explanation.
  - Magical styled loading and error states.
  - Unobtrusive, magical accent; place near page bottom, with FairyWeatherCard.
  - If the API fails, show a themed fallback astronomy fact and magical illustration.
*/

const NASA_APOD_API = "https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY";

// Colors: soft blues, violets, gold/pastels for magical space
const SPACE_COLORS = {
  background: "linear-gradient(120deg, #b2f8fd 75%, #ebd5fe 120%, #ffeeb9 133%)",
  border: "#cf6aff",
  accent: "#8a2be2",
  primary: "#ffd700",
  soft: "#ffe7fc",
  mystic: "#d0ecff"
};

// Fallback space fact and fairy image
const FALLBACK_FACT = {
  title: "The Enchanted Nebula",
  image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=640&q=80", // Creative Commons nebula
  explanation: "Fairy astronomers believe that each star is a drop of wish magic, sparkling in the enchanted Nebula of Dreams. One shooting star can grant a wish if you catch it with fairy wings.",
  credit: "Unsplash"
};

export default function FairySpaceFactCard() {
  const [apod, setApod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch APOD on mount
  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError("");
    fetch(NASA_APOD_API)
      .then(resp => resp.ok ? resp.json() : Promise.reject("No magic from NASA"))
      .then(data => {
        if (!ignore) {
          // Accept only images, not videos
          if (data.media_type === "image") {
            setApod(data);
            setError("");
          } else {
            setApod(null);
            setError("No magical picture from the stars today!");
          }
          setLoading(false);
        }
      })
      .catch(() => {
        if (!ignore) {
          setError("Star portal fizzled—no cosmic fact from NASA. Showing fairy-tale fallback!");
          setApod(null);
          setLoading(false);
        }
      });
    return () => { ignore = true; }
  }, []);

  // Fairy-style magical card visuals
  const cardStyle = {
    background: SPACE_COLORS.background,
    border: `2.9px double ${SPACE_COLORS.border}`,
    borderRadius: "36px 18px 39px 23px/26px 30px 17px 22px",
    boxShadow: "0 0 32px 10px #b2f8fd44, 0 4px 18px 7px #ffd7001a",
    maxWidth: 440,
    margin: "0 auto 2.2rem auto",
    padding: "1.38em 1.7em 1.7em 1.38em",
    minHeight: 170,
    position: "relative",
    zIndex: 1,
    fontFamily: "'Snell Roundhand',cursive,sans-serif"
  };

  // Fairy sparkle and star icons
  const FairySpaceFlair = () => (
    <span style={{
      fontSize: "1.33em",
      marginRight: 5,
      filter: "drop-shadow(0 0 6px #cf6affcc)"
    }} role="img" aria-label="star">✨</span>
  );
  const MagicWand = () => (
    <span style={{
      fontSize: "1.33em",
      marginRight: 7,
      filter: "drop-shadow(0 0 12px #ffd700cc)"
    }} role="img" aria-label="magic">🪄</span>
  );

  // Card render
  return (
    <div
      aria-label="Magical Astronomy Fact or Space Card"
      className="magical-bg"
      style={{
        ...cardStyle,
        marginBottom: "2.8rem"
      }}
    >
      <div style={{
        fontSize: "1.11em",
        fontWeight: 800,
        color: SPACE_COLORS.accent,
        textShadow: "0 0 14px #b2f8fd79, 0 2px 11px #ffd70025",
        marginBottom: 7,
        letterSpacing: ".01em",
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontFamily: "'Snell Roundhand', cursive, sans-serif"
      }}>
        <FairySpaceFlair />
        Magical Astronomy of the Day
      </div>
      {loading ? (
        <div style={{ textAlign: "center", fontSize: "1.23em", color: "#8a2be2", marginTop: 24 }}>
          <MagicWand /> Summoning cosmic fairy dust...
        </div>
      ) : error ? (
        <>
          <div style={{
            textAlign: "center",
            color: "#b60e9e",
            fontWeight: 600,
            fontStyle: "italic",
            margin: "15px 0 11px 0"
          }}>
            {error}
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 9 }}>
            <img
              src={FALLBACK_FACT.image}
              alt={FALLBACK_FACT.title}
              style={{
                borderRadius: "25% 40% 21px 49%/19px 25% 22px 35%",
                width: 170,
                height: 100,
                objectFit: "cover",
                marginBottom: 14,
                boxShadow: "0 0 22px 8px #cf6aff29"
              }}
              draggable={false}
            />
            <div style={{
              color: SPACE_COLORS.primary,
              fontWeight: 700,
              fontSize: "1.05em",
              marginBottom: 9,
              textShadow: "0 0 10px #ffd70099"
            }}>{FALLBACK_FACT.title}</div>
            <div style={{
              color: "#74489b",
              fontWeight: 500,
              fontSize: "1.01em",
              textShadow: "0 0 6px #cf6aff24"
            }}>{FALLBACK_FACT.explanation}</div>
          </div>
        </>
      ) : apod ? (
        <div>
          <div style={{
            textAlign: "center",
            marginBottom: 11
          }}>
            <img
              src={apod.url}
              alt={apod.title}
              style={{
                borderRadius: "29% 41% 13px 27%/21px 24% 21px 39%",
                width: 174,
                height: 104,
                objectFit: "cover",
                boxShadow: "0 0 24px 4px #ffeeb933, 0 0 18px #8a2be222"
              }}
              draggable={false}
            />
            <div style={{
              color: SPACE_COLORS.primary,
              fontWeight: 700,
              fontSize: "1.04em",
              marginTop: 5,
              textShadow: "0 0 12px #ffd70081"
            }}>{apod.title}</div>
            <div style={{
              fontSize: "0.81em",
              color: "#b988d7",
              marginTop: 3
            }}>
              {apod.date}
            </div>
          </div>
          <div style={{
            color: "#555488",
            fontWeight: 500,
            fontSize: "1.02em",
            textShadow: "0 0 6px #ffd70016",
            marginBottom: 3,
            marginTop: 0,
            fontFamily: "inherit"
          }}>
            {apod.explanation?.length > 255
              ? apod.explanation.slice(0, 252) + "..."
              : apod.explanation}
          </div>
          {apod.copyright &&
            <div style={{
              color: "#bab0db",
              fontWeight: 400,
              fontSize: ".92em",
              marginTop: 4,
              textAlign: "right"
            }}>
              Image credit: {apod.copyright}
            </div>
          }
        </div>
      ) : (
        // This covers case where media_type is not "image"
        <div style={{ textAlign: "center", color: "#b988d7" }}>
          No space photo available—try tomorrow for more starlit magic!
        </div>
      )}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: "10px",
          right: "18px",
          fontSize: "1.25em",
          color: SPACE_COLORS.accent,
          opacity: 0.15,
          pointerEvents: "none"
        }}
      >
        ✨
      </div>
    </div>
  );
}
