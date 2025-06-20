import React, { useEffect, useState } from "react";
import "./App.css";

/**
 * PUBLIC_INTERFACE
 * Simple, robust card that fetches and displays a fairy (random user) from randomuser.me.
 * Shows name, magical title, portrait, and handles loading/error states.
 */
function MeetAFairy() {
  const [fairy, setFairy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch from Random User Generator
  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError("");
    fetch("https://randomuser.me/api/?inc=name,picture,login,gender")
      .then(r => r.json())
      .then(data => {
        if (ignore) return;
        if (data.results && data.results[0]) {
          setFairy(data.results[0]);
          setError("");
        } else {
          setError("No fairies could be summoned!");
        }
        setLoading(false);
      })
      .catch(() => {
        if (!ignore) {
          setError("Fairy magic fizzled! Please try again later.");
          setLoading(false);
        }
      });
    return () => { ignore = true; };
  }, []);

  // Helper for magical title
  function getMagicalTitle(gender) {
    if (gender === "female") return "Starshine Fairy";
    if (gender === "male") return "Dreamweaver Fairy";
    return "Mystic Fairy";
  }

  return (
    <div
      className="magical-bg"
      style={{
        maxWidth: 320,
        minHeight: 222,
        margin: "0 auto 2.2rem auto",
        textAlign: "center",
        boxShadow: "0 0 20px #ffcdf7cc",
        background: "linear-gradient(115deg,#fff5fd 70%,#f2d1fa 120%)"
      }}
      aria-label="Meet a Tooth Fairy"
    >
      <div style={{ fontFamily: "'Snell Roundhand', cursive", fontWeight: 700, fontSize: "1.32em", color: "#ad46bc", letterSpacing: ".03em", marginBottom: 8 }}>
        <span role="img" aria-label="Fairy">🧚‍♂️</span> Meet a Tooth Fairy!
      </div>
      {loading && (
        <div style={{ fontSize: "2.3em", color: "#bb5dfe", marginTop: 28 }}>
          ✨ Summoning...
        </div>
      )}
      {error && (
        <div style={{ color: "#ff69b4", fontWeight: 500, fontSize: "1.09em", marginTop: 28 }}>
          {error}
        </div>
      )}
      {!loading && fairy && (
        <>
          <div style={{ margin: "18px 0 0 0", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <img
              src={fairy.picture.large}
              alt={`The magical fairy, ${fairy.name.first} ${fairy.name.last}`}
              style={{
                borderRadius: "40% 60% 60% 40% / 50% 40% 60% 70%",
                width: 100,
                height: 100,
                objectFit: "cover",
                border: "3.5px solid #ffe9a8",
                boxShadow: "0 4px 22px #bb5dfe33, 0 0 7px #ffe9a899",
                marginBottom: 8
              }}
              draggable={false}
            />
            <div style={{ color: "#8a2be2", fontWeight: 600, fontSize: "1.13em", fontFamily: "'Snell Roundhand', cursive" }}>
              {fairy.name.first} {fairy.name.last}
            </div>
            <div style={{ color: "#ff69b4", fontWeight: 500, fontSize: "0.99em", marginTop: 1 }}>
              {getMagicalTitle(fairy.gender)}
            </div>
            <div style={{fontSize: "0.97em", color: "#b889fc", marginTop: 5, fontFamily: "'Snell Roundhand', cursive"}}>
              "Just fluttering by to check your fairy finances!" <span aria-label="sparkles">✨</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default MeetAFairy;
