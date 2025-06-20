import React, { useState } from "react";
import "./App.css";

/*
  PUBLIC_INTERFACE
  FairyWeatherCard: Shows magical fairy-tale themed weather for a user-specified city.
  - Uses https://wttr.in?format=3 (public endpoint, CORS supported for .txt)
  - Produces a friendly, magical weather display with fairy icons and enchanted colors.
  - Handles loading and error states, and integrates with the app's whimsical theme.

  Usage: <FairyWeatherCard /> — Place towards the bottom of main page.
*/

// Fairy-style weather emojis for some conditions
const WEATHER_ICONS = [
  // some mapping for main keywords in wttr.in text format
  { match: /sun|clear/i, icon: "🌞🧚‍♀️", label: "Fairy Sunbeams" },
  { match: /cloud/i, icon: "⛅️🧚‍♂️", label: "Cloud Puff" },
  { match: /rain|drizzle|shower/i, icon: "🌦️🧚‍♀️", label: "Pixie Rain" },
  { match: /thunder/i, icon: "⛈️✨", label: "Thunder Sparkles" },
  { match: /snow|sleet|flurr/i, icon: "❄️🧚‍♀️", label: "Crystal Flurries" },
  { match: /fog|mist/i, icon: "🌫️✨", label: "Fairy Mist" },
  { match: /breeze|wind/i, icon: "🌬️🧚‍♂️", label: "Windy Whirls" },
];

const CARD_STYLES = {
  background: "linear-gradient(120deg, #fcddfa 70%, #b2f8fd 110%, #ffeeb9 140%)",
  border: "2.7px double #cf6aff",
  borderRadius: "33px 12px 43px 19px/24px 28px 19px 29px",
  boxShadow: "0 0 28px 9px #efdeff33, 0 3px 14px 8px #ffd70022",
  maxWidth: 420,
  margin: "0 auto 2.4rem auto",
  padding: "1.34em 1.75em 1.7em 1.3em",
  minHeight: 152,
  position: "relative",
  zIndex: 1,
  fontFamily: "'Snell Roundhand',cursive,sans-serif"
};

function mapWeatherToIcon(text) {
  for (const entry of WEATHER_ICONS) {
    if (entry.match.test(text)) {
      return { icon: entry.icon, label: entry.label };
    }
  }
  // fallback
  return { icon: "🧚‍♀️✨", label: "Fairy Weather" };
}

// PUBLIC_INTERFACE
export default function FairyWeatherCard() {
  const [city, setCity] = useState("");
  const [weatherLine, setWeatherLine] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastSearchedCity, setLastSearchedCity] = useState("");

  function handleInput(e) {
    setCity(e.target.value);
  }

  // Fetches really simple weather info (public, CORS ok for text)
  async function fetchWeather(c) {
    setError("");
    setWeatherLine("");
    setLoading(true);
    setLastSearchedCity(c);
    try {
      // city is optional, empty shows user's IP location
      const url =
        "https://wttr.in/" +
        (c ? encodeURIComponent(c) : "") +
        "?format=3"; // e.g. "London: 🌦 +13°C"
      const resp = await fetch(url, {
        method: "GET",
        headers: {
          "Accept": "text/plain"
        }
      });
      if (!resp.ok) throw new Error("No fairy response.");
      const txt = await resp.text();
      // Sometimes response can be empty/unknown if nonsense entered
      if (!txt || txt.match(/Unknown location|Sorry|error/i)) {
        setError("A magical storm hides that city! Try another...");
        setWeatherLine("");
      } else {
        setWeatherLine(txt);
      }
    } catch (e) {
      setError("No magic weather at the moment: " + (e?.message || ""));
      setWeatherLine("");
    }
    setLoading(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const trimmedCity = city.trim();
    if (!trimmedCity) {
      // allow blank: gets current location from IP
      fetchWeather("");
      return;
    }
    fetchWeather(trimmedCity);
  }

  // Pick icon based on the latest weather line
  const weatherVisual =
    weatherLine && mapWeatherToIcon(weatherLine);

  return (
    <div
      aria-label="Magical Fairy Weather for City"
      className="magical-bg"
      style={CARD_STYLES}
    >
      <div
        style={{
          fontSize: "1.15em",
          fontWeight: 800,
          color: "#8a2be2",
          textShadow: "0 0 10px #ffe7fc99, 0 2px 12px #ffd70033",
          marginBottom: 6,
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontFamily: "'Snell Roundhand', cursive, sans-serif",
          letterSpacing: ".01em"
        }}
      >
        <span role="img" aria-label="Magic weather">🧚‍♀️☁️</span>
        Fairy Weather
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 6, alignItems: "flex-end", marginBottom: 10, marginTop: 2 }}>
        <div style={{ flex: 1 }}>
          <label htmlFor="fairy-weather-city" style={{
            fontWeight: 550,
            color: "#ad46bc",
            fontFamily: "'Snell Roundhand', cursive",
            display: "block",
            marginBottom: 2,
            fontSize: "1em"
          }}>
            City or fairyland:
          </label>
          <input
            id="fairy-weather-city"
            type="text"
            value={city}
            onChange={handleInput}
            placeholder="e.g. London, Fairy Valley..."
            style={{
              borderRadius: "12px",
              border: "1.6px solid #cf6aff",
              padding: "7px 11px",
              fontFamily: "'Snell Roundhand', cursive",
              fontSize: "1.01em",
              background: "#fffaee",
              minWidth: 105
            }}
            autoComplete="off"
          />
        </div>
        <button
          className="btn"
          type="submit"
          disabled={loading}
          style={{
            marginLeft: 8,
            fontWeight: 600,
            fontFamily: "'Snell Roundhand', cursive",
            fontSize: "1.04em",
            background: "linear-gradient(99deg, #fffbe0 58%, #cf6aff 120%)",
            color: "#cf6aff"
          }}
        >
          {loading ? "Conjuring..." : "Forecast"}
        </button>
      </form>

      {loading ? (
        <div style={{ textAlign: "center", marginTop: 18, fontSize: "1.2em", color: "#ad46bc" }}>
          <span role="img" aria-label="wand">🧚‍♂️✨</span> Summoning magical weather...
        </div>
      ) : error ? (
        <div style={{
          color: "#c72090",
          fontWeight: 600,
          fontStyle: "italic",
          margin: "16px 0 11px 0"
        }}>
          {error}
        </div>
      ) : weatherLine ? (
        <div style={{
          textAlign: "center",
          fontSize: "1.21em",
          color: "#7d46a2",
          fontWeight: 700,
          marginTop: 14,
          textShadow: "0 0 6px #ffeeb940",
          minHeight: 32,
          lineHeight: 1.4,
          position: "relative"
        }}>
          {weatherVisual && (
            <span
              aria-label={weatherVisual.label}
              style={{
                fontSize: "1.45em",
                filter: "drop-shadow(0 0 7px #ffd70055)",
                marginRight: 6,
                verticalAlign: "middle"
              }}>
              {weatherVisual.icon}
            </span>
          )}
          <span style={{
            background: "linear-gradient(97deg, #fffbe0 83%, #f3dbff74 100%)",
            borderRadius: "9px",
            boxShadow: "0 0 12px #ffd70015",
            padding: "1px 12px"
          }}>{weatherLine}</span>
        </div>
      ) : lastSearchedCity ? (
        <div style={{
          textAlign: "center",
          color: "#ba5bdd",
          fontWeight: 600,
          fontSize: "1.07em",
          marginTop: 15,
        }}>
          No magic found for "{lastSearchedCity}"!
        </div>
      ) : (
        <div style={{
          textAlign: "center",
          color: "#dac4e5",
          fontSize: "0.94em",
          padding: "8px 0"
        }}>
          Enter a city for magical weather!
        </div>
      )}

      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: "10px",
          right: "21px",
          fontSize: "1.25em",
          color: "#8a2be2",
          opacity: 0.19,
          pointerEvents: "none"
        }}
      >
        ✨
      </div>
    </div>
  );
}
