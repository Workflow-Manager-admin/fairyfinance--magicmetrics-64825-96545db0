import React, { useEffect, useState } from "react";
import "./App.css";
import FairyAnimation from "./FairyAnimation";
import AnimatedBackground from "./AnimatedBackground";
import FairyUtils from "./FairyUtils";

// Theme color constants
const COLORS = {
  primary: "#ffd700",
  secondary: "#ff69b4",
  accent: "#8a2be2",
  white: "#fff",
  blue: "#e0eaff",
  sparkle: "#f3e6fe"
};

// PUBLIC_INTERFACE
function App() {
  // User info
  const [name, setName] = useState("");
  const [avatarSeed, setAvatarSeed] = useState("toothfairy");
  const [age, setAge] = useState("");
  // Entries for ledger
  const [teethEntries, setTeethEntries] = useState([]);
  const [toothDate, setToothDate] = useState("");
  const [toothCoin, setToothCoin] = useState("");
  // API integrations
  const [randomQuote, setRandomQuote] = useState({ content: "", author: "" });
  const [catImgUrl, setCatImgUrl] = useState("");
  const [catMsg, setCatMsg] = useState("");
  const [randomGif, setRandomGif] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  // UI/Stats
  const [auditNote, setAuditNote] = useState("");
  const [bonusStats, setBonusStats] = useState({});
  const [showGif, setShowGif] = useState(false);

  // Load random quote (Quotable)
  useEffect(() => {
    fetch("https://api.quotable.io/random")
      .then((r) => r.json())
      .then((q) => setRandomQuote({ content: q.content, author: q.author }))
      .catch(() => setRandomQuote({ content: "Let the magic begin!", author: "ToothFairy" }));
  }, []);

  // Load random avatar (DiceBear)
  useEffect(() => {
    setAvatarUrl(
      `https://api.dicebear.com/7.x/lorelei/svg?seed=${encodeURIComponent(
        avatarSeed
      )}&radius=50&backgroundColor=ffd700,ff69b4,8a2be2&backgroundType=gradientLinear`
    );
  }, [avatarSeed]);

  // Load random cat (Cataas)
  useEffect(() => {
    const msg = name ? `${name} is magical!` : "Fairy Cat Power!";
    setCatMsg(msg);
    fetch(`https://cataas.com/cat/says/${encodeURIComponent(msg)}?json=true`)
      .then((r) => r.json())
      .then((data) => setCatImgUrl(`https://cataas.com/${data.url}`))
      .catch(() => setCatImgUrl(""));
  }, [name, teethEntries.length]);

  // Load magic GIF (GIPHY)
  useEffect(() => {
    // Use a public beta Giphy API key
    const giphyKey = "dc6zaTOxFJmzC"; // public demo, replace if necessary
    fetch(
      `https://api.giphy.com/v1/gifs/random?api_key=${giphyKey}&tag=fairy+magic&rating=pg`
    )
      .then((r) => r.json())
      .then((data) => setRandomGif(data.data?.images?.downsized_medium?.url || ""))
      .catch(() => setRandomGif(""));
  }, [showGif]);

  // Magical audit note and stats
  useEffect(() => {
    if (teethEntries.length > 0) {
      let sum = teethEntries.reduce((a, t) => a + Number(t.coins), 0);
      let avg = sum / teethEntries.length || 0;
      let max = Math.max(...teethEntries.map((t) => Number(t.coins)));
      let magicalPhrases = [
        `Audit complete! ${teethEntries.length} sparkly teeth collected; average reward: ${avg.toFixed(2)} coins.`,
        `A trail of ${teethEntries.length} lost teeth glimmers, top reward: ${max} coins.`,
        `Your ToothFairy Ledger is growing! Wishing you magical savings!`,
        `Fairy perfect: Keep collecting those smiles ✨`,
        `Brilliant progress little dreamer! Fairy-grade finances!`
      ];
      setAuditNote(magicalPhrases[Math.floor(Math.random() * magicalPhrases.length)]);
      setBonusStats({ sum, avg, max });
    } else {
      setAuditNote("Ledger is sparkling but empty... Add your first magical visit!");
      setBonusStats({});
    }
  }, [teethEntries]);

  // Handle new ledger entry
  function handleAddEntry(e) {
    e.preventDefault();
    if (!toothDate || !toothCoin) return;
    setTeethEntries([
      ...teethEntries,
      {
        date: toothDate,
        coins: toothCoin,
        id: Date.now() + Math.random(),
      },
    ]);
    setToothDate("");
    setToothCoin("");
  }

  // QuickChart.io: Sparkle trends chart (line graph)
  function getTrendChartUrl() {
    if (!teethEntries.length) return "";
    const sorted = [...teethEntries].sort((a, b) => a.date.localeCompare(b.date));
    const labels = sorted.map((t) => t.date);
    const data = sorted.map((t) => Number(t.coins));
    const chartObj = {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Coins Collected",
            data,
            backgroundColor: COLORS.primary + "99",
            borderColor: COLORS.accent,
            fill: true,
            tension: 0.45,
            pointBackgroundColor: COLORS.secondary,
            borderWidth: 3,
          },
        ],
      },
      options: {
        plugins: {
          legend: { labels: { color: COLORS.accent, font: { size: 16 } } },
          title: {
            display: true,
            text: "Gold Coin Trends",
            color: COLORS.primary,
            font: { size: 20, weight: "bold" },
          },
        },
        scales: {
          x: { ticks: { color: COLORS.secondary, font: { size: 14 } } },
          y: { beginAtZero: true, ticks: { color: COLORS.secondary, font: { size: 14 } } },
        },
      },
    };
    return (
      "https://quickchart.io/chart?width=520&height=300&c=" +
      encodeURIComponent(JSON.stringify(chartObj))
    );
  }

  // Tooth timeline as chart (bar graph)
  function getTimelineChartUrl() {
    if (!teethEntries.length) return "";
    const sorted = [...teethEntries].sort((a, b) => a.date.localeCompare(b.date));
    const labels = sorted.map((t) => t.date);
    const data = sorted.map((t) => Number(t.coins));
    const chartObj = {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Coins per Visit",
            data,
            backgroundColor: COLORS.secondary + "99",
            borderColor: COLORS.accent,
            borderWidth: 2,
          },
        ],
      },
      options: {
        indexAxis: "y",
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: "Tooth Timeline",
            color: COLORS.secondary,
            font: { size: 19, weight: "bold" },
          },
        },
        scales: {
          x: { ticks: { color: COLORS.accent } },
          y: { ticks: { color: COLORS.primary } },
        },
      },
    };
    return (
      "https://quickchart.io/chart?width=350&height=300&c=" +
      encodeURIComponent(JSON.stringify(chartObj))
    );
  }

  // Ledger table
  function LedgerTable() {
    if (!teethEntries.length)
      return (
        <div style={{ color: COLORS.accent, fontStyle: "italic", textAlign: "center", padding: 14, fontSize: 17 }}>
          No ToothFairy Ledger entries yet!
        </div>
      );
    return (
      <table
        style={{
          width: "100%",
          borderRadius: 12,
          background: "#fdf6fe",
          boxShadow: "0 2px 8px 0 #ffd70033",
          border: `2.5px solid ${COLORS.primary}`,
          marginBottom: 8,
          overflow: "hidden",
          animation: "fadeInScale 0.7s",
        }}
      >
        <thead>
          <tr style={{ background: COLORS.primary + "1A", color: COLORS.accent }}>
            <th style={{ padding: "10px 8px" }}>Date</th>
            <th style={{ padding: "10px 8px" }}>Coins</th>
            <th style={{ padding: "10px 8px" }}>Magical Mark</th>
          </tr>
        </thead>
        <tbody>
          {teethEntries.map((t, idx) => (
            <tr key={t.id}>
              <td style={{ textAlign: "center", fontWeight: 500, color: COLORS.accent }}>{t.date}</td>
              <td
                style={{
                  textAlign: "center",
                  fontWeight: 700,
                  color: COLORS.primary,
                  letterSpacing: 1.1,
                  fontFamily: "inherit",
                }}
              >
                <span role="img" aria-label="coin">
                  🪙
                </span>{" "}
                {t.coins}
              </td>
              <td style={{ textAlign: "center" }}>
                <span
                  style={{
                    fontSize: "1.4rem",
                    color: idx % 2 ? COLORS.secondary : COLORS.accent,
                    filter: "drop-shadow(0 1px 10px #ffd70066)",
                  }}
                  role="img"
                  aria-label="fairy star"
                >
                  {idx % 2 ? "🦷" : "✨"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  // Main render
  return (
    <div
      className="app"
      style={{
        minHeight: "100vh",
        color: "#430a66",
        fontFamily: "'Fredoka', 'Comic Sans MS', cursive, sans-serif",
        background: "radial-gradient(circle at 60% 10%, #ffd70022 0%, transparent 60%),radial-gradient(circle at 30% 80%, #ff69b433 0%, transparent 70%),radial-gradient(circle at 90% 60%, #8a2be215 0%, transparent 56%)",
        letterSpacing: "0.01em"
      }}
    >
      {/* Sparkly Animated Background */}
      <AnimatedBackground />

      {/* Fairy flying across the top */}
      <FairyAnimation />

      {/* NAVBAR with new branding */}
      <nav
        className="navbar"
        style={{
          background: "linear-gradient(90deg,#ffd700cc,#ff69b488,#8a2be288)",
          borderBottom: `3.5px double #8a2be2dd`,
          color: COLORS.accent,
          fontFamily: "Fredoka, cursive",
          boxShadow: "0 0px 14px 0 #ffd70044",
        }}
      >
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="logo"
            style={{
              fontSize: "2.06rem",
              fontWeight: 800,
              color: COLORS.accent,
              display: "flex",
              alignItems: "center",
              gap: "0.28em"
            }}>
            <span className="logo-symbol" style={{
              color: COLORS.primary,
              fontWeight: "bolder",
              fontSize: "2.4rem",
              textShadow: "0 2px 16px #fff17699"
            }}>
              🧚
            </span>{" "}
            ToothFairy Ledger
          </div>
          <button
            className="btn"
            style={{
              background: COLORS.secondary,
              color: "#fff",
              fontWeight: 600,
              borderRadius: 20,
              boxShadow: "0 2px 8px 0 #ff69b488",
              transition: "background 0.3s"
            }}
            onClick={() => setShowGif((b) => !b)}
          >
            {showGif ? "Close" : "✨ Magical GIF!"}
          </button>
        </div>
      </nav>

      {/* HERO */}
      <main style={{ paddingTop: 108 }}>
        <div className="container">
          {/* Profile Block */}
          <div
            style={{
              marginBottom: 18,
              display: "flex",
              alignItems: "center",
              gap: 18,
              flexWrap: "wrap",
              justifyContent: "center",
              animation: "fadeInSlide 0.75s",
              borderRadius: 16,
              boxShadow: "0 2px 11px 0 #8a2be233",
              background: "#fffafdad",
              padding: "12px 4px"
            }}
          >
            <img
              src={avatarUrl}
              alt="Fairy Avatar"
              style={{
                width: 90,
                height: 90,
                borderRadius: "50%",
                background: COLORS.primary + "10",
                border: `3px solid ${COLORS.primary}`,
                boxShadow: "0 2px 18px 2px #ff69b438",
                transition: "box-shadow 0.3s"
              }}
            />
            <form
              style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 180 }}
              onSubmit={(e) => e.preventDefault()}
            >
              <label style={{ fontWeight: 700, color: COLORS.accent }}>
                Fairy Name:
                <input
                  type="text"
                  maxLength={18}
                  value={name}
                  style={{
                    width: "100%",
                    padding: 7,
                    marginTop: 3,
                    border: `1.5px solid ${COLORS.accent}`,
                    borderRadius: 10,
                    background: "#fff5fc",
                    fontWeight: 500
                  }}
                  placeholder="Enter magical name"
                  onChange={(e) => {
                    setName(e.target.value.replace(/[^a-zA-Z0-9\s\-]/g, ''));
                    setAvatarSeed(e.target.value || "toothfairy");
                  }}
                />
              </label>
              <label style={{ fontWeight: 700, color: COLORS.accent }}>
                Age:
                <input
                  type="number"
                  min={3}
                  max={199}
                  value={age}
                  style={{
                    width: "100%",
                    padding: 7,
                    marginTop: 3,
                    border: `1.5px solid ${COLORS.accent}`,
                    borderRadius: 10,
                    background: "#fff5fc",
                    fontWeight: 500
                  }}
                  placeholder="Fairy years"
                  onChange={(e) => setAge(e.target.value)}
                />
              </label>
            </form>
            <div
              style={{
                flex: 1,
                minWidth: 160,
                color: COLORS.secondary,
                background: "#fff3fcba",
                borderRadius: 12,
                padding: 12,
                textAlign: "center",
                fontWeight: 600,
                boxShadow: "0 2px 7px 0 #ff69b433",
              }}
            >
              <span style={{ fontWeight: 800, color: COLORS.accent }}>
                Status
              </span>
              <br />
              {name ? `Welcome, Fairy ${name}!` : "Reveal your fairy name!"}
              <br />
              {age && (
                <span style={{ fontWeight: 700, fontSize: 15 }}>Age: {age}</span>
              )}
            </div>
          </div>

          {/* Quote + Cat */}
          <div
            style={{
              margin: "24px auto 14px",
              background: "#fdf9f6cc",
              borderLeft: `7px double ${COLORS.primary}`,
              borderRadius: 13,
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: 16,
              maxWidth: 670,
              boxShadow: `0 2px 13px 0 #ffd70038`,
              fontStyle: "italic",
              fontWeight: 500,
              animation: "fadeInScale 1s"
            }}
          >
            <span role="img" aria-label="quote" style={{ fontSize: "2rem", color: COLORS.secondary }}>
              ❝
            </span>
            <span style={{ flex: 1 }}>
              {randomQuote.content}
              <div style={{
                fontWeight: 800, color: COLORS.accent, marginTop: 2,
                fontStyle: "normal", fontSize: 14
              }}>
                — {randomQuote.author || "ToothFairy"}
              </div>
            </span>
            <span>
              <img
                src={catImgUrl}
                alt="Inspirational Cat"
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: 15,
                  border: `2.5px solid ${COLORS.secondary}`,
                  background: "#fff",
                  objectFit: "cover",
                  boxShadow: `0 1px 7px 0 #ff69b455`,
                  marginBottom: 2,
                  transition: "box-shadow 0.4s"
                }}
              />
              <div style={{ fontSize: 11, color: COLORS.secondary, textAlign: "center", fontWeight: 700 }}>
                Fairy Cat
              </div>
            </span>
          </div>

          {/* Ledger Input */}
          <div
            style={{
              margin: "30px auto 12px",
              padding: "18px 20px",
              background: "#fffafdde",
              border: `2px solid ${COLORS.primary}`,
              borderRadius: 14,
              boxShadow: "0 1px 10px 0 #ffd7002b",
              maxWidth: 480,
              animation: "fadeInScale 0.7s"
            }}
          >
            <form
              style={{
                display: "flex",
                gap: 16,
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "center",
              }}
              onSubmit={handleAddEntry}
            >
              <input
                type="date"
                required
                value={toothDate}
                style={{
                  padding: 9,
                  border: `1.5px solid ${COLORS.accent}`,
                  borderRadius: 10,
                  fontSize: 15,
                  background: "#fffafddb",
                  minWidth: 130,
                  fontWeight: 500,
                  boxShadow: "0 1.5px 6px #ffd70022"
                }}
                max={new Date().toISOString().slice(0, 10)}
                onChange={(e) => setToothDate(e.target.value)}
              />
              <input
                type="number"
                required
                min={1}
                max={99}
                placeholder="Coins"
                value={toothCoin}
                style={{
                  padding: 9,
                  border: `1.5px solid ${COLORS.secondary}`,
                  borderRadius: 10,
                  fontSize: 15,
                  background: "#fffafddb",
                  minWidth: 110,
                  fontWeight: 500,
                  boxShadow: "0 1.5px 6px #ffd70022"
                }}
                onChange={(e) => setToothCoin(e.target.value)}
              />
              <button
                className="btn"
                type="submit"
                style={{
                  background: COLORS.accent,
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: 17,
                  borderRadius: 20,
                  boxShadow: `0 0px 8px 0 #8a2be299`,
                  animation: "sparkleGlow 2.3s infinite alternate"
                }}
              >
                ✨ Add to Ledger
              </button>
            </form>
          </div>

          {/* Ledger Table */}
          <div
            style={{
              margin: "20px 0 33px",
              borderRadius: 18,
              background: "#fcf8ff",
              boxShadow: "0 2px 12px 0 #ffd7001f",
              border: `2.2px solid ${COLORS.primary}`,
              padding: 20,
              overflowX: "auto"
            }}
          >
            <div
              style={{
                fontSize: 23,
                marginBottom: 8,
                fontWeight: 800,
                textAlign: "center",
                letterSpacing: ".02em",
                color: COLORS.accent,
                textShadow: "0 1.5px 6px #ffd7003c"
              }}>
              🪙 ToothFairy Ledger
            </div>
            <LedgerTable />
          </div>

          {/* Audit/bonus stats */}
          <div
            style={{
              margin: "0 auto 26px",
              padding: 18,
              background: "#fbf6ff",
              border: `2px dashed ${COLORS.accent}`,
              borderRadius: 14,
              minHeight: 80,
              maxWidth: 510,
              boxShadow: "0 1px 9px 0 #8a2be23b",
              color: COLORS.accent,
              fontWeight: 600,
              fontSize: 15,
              animation: "fadeInSlide 1.2s"
            }}
          >
            <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 4 }}>
              💫 Fairy Audit Note
            </div>
            <div>{auditNote}</div>
            {teethEntries.length > 0 && (
              <div
                style={{
                  marginTop: 9,
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 8,
                  fontSize: 15,
                  color: COLORS.secondary,
                  fontWeight: 700
                }}
              >
                <div>🪙 Total: {bonusStats.sum || 0}</div>
                <div>
                  ✨ Avg/visit: {bonusStats.avg ? bonusStats.avg.toFixed(2) : 0}
                </div>
                <div>🏅 Max: {bonusStats.max || 0}</div>
              </div>
            )}
          </div>

          {/* MAGIC CHARTS */}
          <div
            style={{
              display: "flex",
              gap: 36,
              justifyContent: "center",
              alignItems: "start",
              flexWrap: "wrap",
              marginBottom: 30,
              animation: "fadeInScale 0.8s"
            }}
          >
            {getTrendChartUrl() && (
              <img
                src={getTrendChartUrl()}
                alt="Coin trends"
                style={{
                  borderRadius: 17,
                  border: `3.6px solid ${COLORS.primary}`,
                  boxShadow: `0 2px 12px 0 #ffd70044`,
                  background: "#fff",
                  marginTop: 10,
                  maxWidth: 375,
                  width: "100%",
                  transition: "box-shadow .4s"
                }}
              />
            )}
            {getTimelineChartUrl() && (
              <img
                src={getTimelineChartUrl()}
                alt="Tooth timeline"
                style={{
                  borderRadius: 17,
                  border: `3.6px solid ${COLORS.secondary}`,
                  boxShadow: `0 2px 12px 0 #8a2be244`,
                  background: "#fff",
                  marginTop: 10,
                  maxWidth: 350,
                  width: "100%",
                  transition: "box-shadow .4s"
                }}
              />
            )}
          </div>

          {/* Magical GIF modal */}
          {showGif && randomGif &&
            <div
              style={{
                position: "fixed", inset: 0, zIndex: 130,
                background: "linear-gradient(140deg, #ffd70080, #ff69b423, #8a2be255 95%)",
                display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column",
                animation: "fadeIn 0.5s"
              }}
              onClick={() => setShowGif(false)}
            >
              <div
                style={{
                  background: "#fff0fae7",
                  border: `8px dashed ${COLORS.secondary}`,
                  borderRadius: 28,
                  boxShadow: "0 6px 40px #8a2be277",
                  padding: 36, minWidth: 320, minHeight: 170,
                  display: "flex", flexDirection: "column", alignItems: "center"
                }}
              >
                <img src={randomGif} alt="Fairy GIF" style={{
                  maxHeight: 170, borderRadius: 20, marginBottom: 16,
                  boxShadow: "0 3px 30px #ffd70066"
                }} />
                <div style={{ fontWeight: 700, color: COLORS.secondary, fontSize: 22, margin: "8px 0" }}>
                  ✨ Fairy & Magic GIF
                </div>
                <div
                  style={{
                    background: COLORS.accent,
                    color: "#fff",
                    padding: "7px 16px",
                    borderRadius: 13,
                    fontWeight: 700,
                    fontSize: 15,
                    marginTop: 10
                  }}
                >
                  🎉 Tap anywhere to close
                </div>
              </div>
            </div>
          }

          {/* Footer */}
          <div
            style={{
              marginTop: 36,
              marginBottom: 8,
              color: COLORS.accent,
              fontWeight: 700,
              textAlign: "center",
              animation: "fadeInScale 1.5s"
            }}
          >
            <span style={{ fontSize: 23, textShadow: "0 1.5px 7px #ffd70047" }}>✨</span>{" "}
            <span>
              ToothFairy Ledger • Powered by Quotable, Cataas, DiceBear, QuickChart, Giphy, and fairy dust!
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
