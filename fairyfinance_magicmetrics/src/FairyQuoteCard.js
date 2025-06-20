import React, { useEffect, useState } from "react";
import "./App.css";

/*
  PUBLIC_INTERFACE
  FairyQuoteCard: Displays an inspirational magical quote fetched from quotable.io's public API.
  - Fetches from https://api.quotable.io/random when mounted.
  - Loading and error states use fairy/magical visuals (soft colors, sparkles, magical icon).
  - Themed to harmonize with app's magical/fairy look.
  - No authentication required.
*/

const FAIRY_QUOTE_COLORS = {
  background: "linear-gradient(120deg, #e6ffe9 85%, #b2f8fd 120%, #ffeeb9 100%)",
  border: "#cf6aff",
  accent: "#8a2be2",
  highlight: "#ffd700",
  white: "#fffafd",
  pastel: "#ffe7fc"
};

export default function FairyQuoteCard() {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch magical quote when mounted
  useEffect(() => {
    setLoading(true);
    setError("");
    fetch("https://api.quotable.io/random")
      .then(resp => resp.ok ? resp.json() : Promise.reject("No magic response"))
      .then(data => {
        setQuote(data);
        setLoading(false);
      })
      .catch(() => {
        setError("A magical breeze scattered the quote—try again soon!");
        setLoading(false);
      });
  }, []);

  // Magical fairy card styles
  const cardStyle = {
    background: FAIRY_QUOTE_COLORS.background,
    border: `2.7px double ${FAIRY_QUOTE_COLORS.border}`,
    borderRadius: "35px 14px 44px 27px/25px 31px 15px 29px",
    boxShadow: "0 0 27px 8px #b2f8fd33, 0 3px 14px 6px #ffd70021",
    maxWidth: 420,
    margin: "0 auto 2.3rem auto",
    padding: "1.35em 1.8em 1.44em 1.55em",
    minHeight: 145,
    position: "relative",
    zIndex: 2,
    fontFamily: "'Snell Roundhand',cursive,sans-serif"
  };

  // Fairy sparkle flourish
  const Sparkles = () => (
    <span style={{ fontSize: "1.34em", marginRight: 5, filter: "drop-shadow(0 0 6px #ffd700cc)" }} role="img" aria-label="sparkle">✨</span>
  );

  return (
    <div
      aria-label="Magical Inspirational Quote"
      className="magical-bg"
      style={cardStyle}
    >
      <div
        style={{
          fontSize: "1.19em",
          fontWeight: 800,
          color: FAIRY_QUOTE_COLORS.accent,
          textShadow: "0 0 12px #b2f8fd80, 0 2px 14px #ffd70033",
          marginBottom: 9,
          letterSpacing: ".01em",
          display: "flex",
          alignItems: "center",
          gap: 7,
        }}
      >
        <Sparkles />
        Inspirational Magical Quote
      </div>
      {loading ? (
        <div style={{ textAlign: "center", fontSize: "1.3em", color: "#7d46a2", marginTop: 28 }}>
          <span role="img" aria-label="magic-wand">🪄</span> Whispering a fairy incantation...
        </div>
      ) : error ? (
        <div style={{ color: "#b60e9e", fontWeight: 600, fontStyle: "italic", margin: "23px 0 15px 0" }}>
          {error}
        </div>
      ) : quote ? (
        <div>
          <blockquote
            style={{
              color: "#555488",
              fontWeight: 700,
              fontSize: "1.11em",
              fontFamily: "'Snell Roundhand',cursive",
              margin: "0 0 16px 0",
              paddingLeft: "0.7em",
              borderLeft: `4px solid ${FAIRY_QUOTE_COLORS.accent}22`,
              textShadow: "0 0 7px #ffeeb980",
              lineHeight: 1.62
            }}
          >
            “{quote.content}”
          </blockquote>
          <div style={{
            color: FAIRY_QUOTE_COLORS.highlight,
            fontWeight: 600,
            fontSize: "0.98em",
            marginTop: "2px",
            fontFamily: "'Snell Roundhand', cursive",
            letterSpacing: ".01em",
            textAlign: "right"
          }}>
            — {quote.author}
          </div>
        </div>
      ) : (
        <div style={{ color: "#c72090", fontWeight: 600, margin: "23px 0" }}>
          No magical quote found!
        </div>
      )}
      <div
        style={{
          position: "absolute",
          bottom: "12px",
          right: "18px",
          fontSize: "1.41em",
          color: FAIRY_QUOTE_COLORS.accent,
          opacity: 0.16,
          pointerEvents: "none"
        }}
        aria-hidden
      >
        ✨
      </div>
    </div>
  );
}
