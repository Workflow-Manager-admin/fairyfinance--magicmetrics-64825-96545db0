import React, { useState, useEffect } from "react";
import "./App.css";

/*
  PUBLIC_INTERFACE
  <FairyJokeOrFact /> displays a magical joke or fun fact fetched from a 3rd-party public API
  - Fetches from https://official-joke-api.appspot.com/random_joke on mount.
  - Shows loading and error states with fairy visuals.
  - No authentication needed.
  - Intended to add fun fairy magic to the app in a prominent but unobtrusive card.
*/

const FAIRY_COLORS = {
  background: "linear-gradient(112deg, #fffbe0 68%, #ebd5fe 140%)",
  border: "#cf6aff",
  accent: "#8a2be2",
  highlight: "#ffd700",
  soft: "#ffe7fc",
};

function FairyJokeOrFact() {
  const [joke, setJoke] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch joke on mount
  useEffect(() => {
    setLoading(true);
    setError("");
    fetch("https://official-joke-api.appspot.com/random_joke")
      .then(resp => resp.ok ? resp.json() : Promise.reject("No magic response"))
      .then(data => {
        setJoke(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Oops! Fairy wings got tangled fetching the joke.");
        setLoading(false);
      });
  }, []);

  // Magical card styles
  const cardStyle = {
    background: FAIRY_COLORS.background,
    border: `2.8px double ${FAIRY_COLORS.border}`,
    borderRadius: "34px 10px 44px 21px/18px 38px 14px 32px",
    boxShadow: "0 0 29px 7px #cf6aff28, 0 4px 18px 9px #ffd7001a",
    maxWidth: 380,
    margin: "0 auto 2.2rem auto",
    padding: "1.35em 1.9em 1.4em 1.5em",
    minHeight: 145,
    position: "relative",
    fontFamily: "'Snell Roundhand', cursive, sans-serif",
    zIndex: 2,
  };

  // Return
  return (
    <div
      aria-label="Magical Joke or Fairy Fact"
      className="magical-bg"
      style={cardStyle}
    >
      <div
        style={{
          fontSize: "1.18em",
          fontWeight: 800,
          color: FAIRY_COLORS.accent,
          textShadow: "0 0 10px #ffe7fc99, 0 1px 8px #ffd70033",
          marginBottom: 5,
          letterSpacing: ".01em",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span aria-label="Fairy sparkle">🦷✨</span>
        Magical Joke of the Day
      </div>
      {loading ? (
        <div style={{ textAlign: "center", fontSize: "1.3em", color: "#cf6aff", marginTop: 24 }}>
          <span role="img" aria-label="sparkle">🧚‍♀️</span> Sprinkling fairy giggles...
        </div>
      ) : error ? (
        <div style={{ color: "#b60e9e", fontWeight: 600, fontStyle: "italic", margin: "25px 0 15px 0" }}>
          {error}
        </div>
      ) : joke ? (
        <div>
          <div
            style={{
              color: "#7d46a2",
              fontWeight: 700,
              fontSize: "1.12em",
              marginBottom: 9,
              textShadow: "0 0 6px #ffe7fc44",
              paddingLeft: "2px",
            }}
          >
            {joke.setup}
          </div>
          <div
            style={{
              color: FAIRY_COLORS.highlight,
              fontWeight: 700,
              fontSize: "1.11em",
              marginTop: 0,
              marginBottom: 4,
              fontFamily: "'Snell Roundhand', cursive",
              textShadow: "0 2px 9px #ffd70060",
              letterSpacing: ".01em"
            }}
          >
            {joke.punchline}
          </div>
        </div>
      ) : (
        <div style={{ color: "#c72090", fontWeight: 600, margin: "23px 0" }}>
          No fairy joke found!
        </div>
      )}
      <div
        style={{
          position: "absolute",
          bottom: "13px",
          right: "24px",
          fontSize: "1.35em",
          color: FAIRY_COLORS.accent,
          opacity: 0.19,
          pointerEvents: "none"
        }}
        aria-hidden
      >
        ✨
      </div>
    </div>
  );
}

export default FairyJokeOrFact;
