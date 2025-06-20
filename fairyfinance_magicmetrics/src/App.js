import React, { useEffect, useState } from "react";
import "./App.css";

// Color palette for theme
const COLORS = {
  primary: "#ffd700", // Fairy Gold
  secondary: "#ff69b4", // Pixie Pink
  accent: "#8a2be2", // Sorcery Purple
};

// PUBLIC_INTERFACE
function App() {
  // User profile info
  const [name, setName] = useState("");
  const [avatarSeed, setAvatarSeed] = useState("tooth-fairy");
  const [age, setAge] = useState("");
  // Teeth ledger
  const [teethEntries, setTeethEntries] = useState([]);
  const [toothDate, setToothDate] = useState("");
  const [toothCoin, setToothCoin] = useState("");
  // UI/flair extras
  const [randomQuote, setRandomQuote] = useState({ content: "", author: "" });
  const [catImgUrl, setCatImgUrl] = useState("");
  const [auditNote, setAuditNote] = useState("");
  // Bonus stats
  const [bonusStats, setBonusStats] = useState({});
  // Giphy Placeholder (no actual content)
  const [showGifPlaceholder, setShowGifPlaceholder] = useState(false);

  // Pull random quote (Quotable API)
  useEffect(() => {
    fetch("https://api.quotable.io/random").then((r) =>
      r.json().then((q) => {
        setRandomQuote({ content: q.content, author: q.author });
      })
    );
  }, []);

  // Pull random cat (Cataas)
  useEffect(() => {
    fetch("https://cataas.com/cat?json=true")
      .then((r) => r.json())
      .then((data) => setCatImgUrl(`https://cataas.com/${data.url}`))
      .catch(() => setCatImgUrl(""));
  }, [teethEntries.length]);

  // Bonus: fairy audit note generator
  useEffect(() => {
    if (teethEntries.length > 0) {
      let sum = teethEntries.reduce((a, t) => a + Number(t.coins), 0);
      let avg = sum / teethEntries.length || 0;
      let max = Math.max(...teethEntries.map((t) => Number(t.coins)));
      let magicalPhrases = [
        `Audit complete! ${teethEntries.length} shiny teeth; average reward: ${avg.toFixed(2)} Sparkle Coins.`,
        `A trail of ${teethEntries.length} lost teeth glimmers, top reward: ${max} Sparkle Coins.`,
        `Your Sparkle Ledger is growing! Keep up the fairy-tale savings.`,
        `Magical trends analyzed: steady sparkles ahead!`,
        `Pixie Note: Wonderful progress this season, little dreamer!`,
      ];
      const phrase = magicalPhrases[Math.floor(Math.random() * magicalPhrases.length)];
      setAuditNote(phrase);
      setBonusStats({ sum, avg, max });
    } else {
      setAuditNote("Ledger awaiting sparkly additions...");
      setBonusStats({});
    }
  }, [teethEntries]);

  // Handle tooth entry add
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

  // Generate DiceBear avatar url
  function getAvatarUrl(seed) {
    return `https://api.dicebear.com/7.x/lorelei/svg?seed=${encodeURIComponent(
      seed
    )}&radius=50&backgroundColor=ffd700,ff69b4,8a2be2&backgroundType=gradientLinear`;
  }

  // Generate chart image URL for trends (QuickChart)
  function getTrendChartUrl() {
    if (!teethEntries.length) return "";
    // Sort by date
    const sorted = [...teethEntries].sort((a, b) => a.date.localeCompare(b.date));
    const labels = sorted.map((t) => t.date);
    const data = sorted.map((t) => Number(t.coins));
    const chartObj = {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Sparkle Coin Value",
            data,
            backgroundColor: COLORS.primary + "66",
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
            text: "Sparkle Coin Trends",
            color: COLORS.primary,
            font: { size: 22, weight: "bold" },
          },
        },
        scales: {
          x: {
            ticks: { color: COLORS.secondary, font: { size: 14 } },
          },
          y: {
            beginAtZero: true,
            ticks: { color: COLORS.secondary, font: { size: 14 } },
          },
        },
      },
    };
    const url =
      "https://quickchart.io/chart?width=500&height=300&c=" +
      encodeURIComponent(JSON.stringify(chartObj));
    return url;
  }

  // Generate "tooth timeline" bar chart (dates vs coins)
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
            label: "Coins per Tooth Visit",
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
            font: { size: 20, weight: "bold" },
          },
        },
        scales: {
          x: { ticks: { color: COLORS.accent } },
          y: { ticks: { color: COLORS.primary } },
        },
      },
    };
    const url =
      "https://quickchart.io/chart?width=350&height=300&c=" +
      encodeURIComponent(JSON.stringify(chartObj));
    return url;
  }

  // Styling helper: magical background/flair
  function FairyBackground() {
    return (
      <div
        aria-hidden="true"
        style={{
          pointerEvents: "none",
          position: "fixed",
          zIndex: 0,
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background:
            "radial-gradient(circle at 60% 10%, #ffd70066 0%, transparent 60%),radial-gradient(circle at 30% 80%, #ff69b477 0%, transparent 70%),radial-gradient(circle at 90% 60%, #8a2be255 0%, transparent 55%)",
        }}
      />
    );
  }

  // Tooth ledger view
  function LedgerTable() {
    if (!teethEntries.length)
      return (
        <div style={{ color: COLORS.accent, fontStyle: "italic", textAlign: "center", padding: 12 }}>
          No Sparkle Ledger entries yet!
        </div>
      );
    return (
      <table
        style={{
          width: "100%",
          borderRadius: 12,
          background: "#fff7fa",
          boxShadow: "0 2px 8px 0 #ffd70033",
          border: `2px solid ${COLORS.primary}`,
          marginBottom: 6,
          overflow: "hidden",
        }}
      >
        <thead>
          <tr style={{ background: COLORS.primary + "18", color: COLORS.accent }}>
            <th style={{ padding: "10px 8px" }}>Date</th>
            <th style={{ padding: "10px 8px" }}>Sparkle Coins</th>
            <th style={{ padding: "10px 8px" }}>Fairy Mark</th>
          </tr>
        </thead>
        <tbody>
          {teethEntries.map((t, idx) => (
            <tr key={t.id}>
              <td style={{ textAlign: "center", fontWeight: 500, color: COLORS.accent }}>
                {t.date}
              </td>
              <td
                style={{
                  textAlign: "center",
                  fontWeight: 700,
                  color: COLORS.primary,
                  letterSpacing: 1.1,
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
                    fontSize: "1.3rem",
                    color: idx % 2 ? COLORS.secondary : COLORS.accent,
                  }}
                  role="img"
                  aria-label="fairy star"
                >
                  {idx % 2 ? "✳️" : "✨"}
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
        background: "#fffaf9",
        color: "#3d165d",
        fontFamily: "'Fredoka', 'Comic Sans MS', cursive, sans-serif",
        position: "relative",
        letterSpacing: "0.01em",
      }}
    >
      <FairyBackground />

      {/* NAVBAR */}
      <nav
        className="navbar"
        style={{
          background: "linear-gradient(90deg,#ffd700AA,#ff69b466,#8a2be230)",
          borderBottom: `3.5px double #8a2be2dd`,
          color: COLORS.accent,
          fontFamily: "Fredoka, cursive",
        }}
      >
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="logo" style={{ fontSize: "2rem", fontWeight: 700, color: COLORS.accent }}>
            <span className="logo-symbol" style={{ color: COLORS.primary, fontWeight: "bold", fontSize: "2.3rem" }}>
              🧚
            </span>{" "}
            FairyFinance & MagicMetrics
          </div>
          <button
            className="btn"
            style={{
              background: COLORS.accent,
              color: "#fff",
              fontWeight: 600,
              borderRadius: 20,
            }}
            onClick={() => setShowGifPlaceholder((b) => !b)}
          >
            {showGifPlaceholder ? "Close" : "✨ Party (GIF)!"}
          </button>
        </div>
      </nav>

      {/* HERO + MAIN */}
      <main style={{ paddingTop: 104 }}>
        <div className="container">
          {/* Profile Setup */}
          <div
            style={{
              marginBottom: 18,
              display: "flex",
              alignItems: "center",
              gap: 18,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <img
              src={getAvatarUrl(avatarSeed || "tooth-fairy")}
              alt="Fairy Avatar"
              style={{
                width: 85,
                height: 85,
                borderRadius: "50%",
                background: COLORS.primary + "11",
                border: `3px solid ${COLORS.primary}`,
                boxShadow: "0 2px 12px 0 #8a2be233",
              }}
            />
            <form
              style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 180 }}
              onSubmit={(e) => e.preventDefault()}
            >
              <label style={{ fontWeight: 500, color: COLORS.accent }}>
                Fairy Name:
                <input
                  type="text"
                  maxLength={18}
                  value={name}
                  style={{
                    width: "100%",
                    padding: 6,
                    marginTop: 3,
                    border: `1.5px solid ${COLORS.accent}`,
                    borderRadius: 10,
                  }}
                  placeholder="Enter magical name"
                  onChange={(e) => {
                    setName(e.target.value.replace(/[^a-zA-Z\s\-]/g, ''));
                    setAvatarSeed(e.target.value || "tooth-fairy");
                  }}
                />
              </label>
              <label style={{ fontWeight: 500, color: COLORS.accent }}>
                Your Age:
                <input
                  type="number"
                  min={3}
                  max={199}
                  value={age}
                  style={{
                    width: "100%",
                    padding: 6,
                    marginTop: 3,
                    border: `1.5px solid ${COLORS.accent}`,
                    borderRadius: 10,
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
                background: "#fff3fc88",
                borderRadius: 12,
                padding: 10,
                textAlign: "center",
                fontWeight: 500,
              }}
            >
              <span style={{ fontWeight: 700, color: COLORS.accent }}>
                Sparkle status:
              </span>
              <br />
              {name
                ? `Welcome, Fairy ${name}!`
                : "Let the magic begin!"}
              <br />
              {age && (
                <span style={{ fontWeight: 500, fontSize: 15 }}>Age: {age}</span>
              )}
            </div>
          </div>

          {/* QUOTE + CAT */}
          <div
            style={{
              margin: "20px auto 8px",
              background: "#fff9e688",
              borderLeft: `7px double ${COLORS.primary}`,
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: 14,
              maxWidth: 640,
              boxShadow: `0 2px 10px 0 #ffd70033`,
              fontStyle: "italic",
            }}
          >
            <span role="img" aria-label="quote" style={{ fontSize: "2rem", color: COLORS.secondary }}>
              ❝
            </span>
            <span style={{ flex: 1 }}>
              {randomQuote.content}
              <div style={{ fontWeight: 600, color: COLORS.accent, marginTop: 2, fontStyle: "normal", fontSize: 14 }}>
                — {randomQuote.author || "Magical Source"}
              </div>
            </span>
            <span>
              <img
                src={catImgUrl}
                alt="Inspirational Cat"
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: 14,
                  border: `2px solid ${COLORS.accent}`,
                  background: "#fff",
                  objectFit: "cover",
                  boxShadow: `0 1px 7px 0 #ff69b433`,
                }}
              />
              <div style={{ fontSize: 11, color: COLORS.secondary, textAlign: "center" }}>
                Cat Cheer
              </div>
            </span>
          </div>

          {/* LEDGER INPUT FORM */}
          <div
            style={{
              margin: "26px auto 10px",
              padding: "18px 20px",
              background: "#fffbf7da",
              border: `2px solid ${COLORS.primary}`,
              borderRadius: 14,
              boxShadow: "0 1px 10px 0 #ffd7002b",
              maxWidth: 480,
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
                  padding: 8,
                  border: `1.5px solid ${COLORS.accent}`,
                  borderRadius: 8,
                  fontSize: 15,
                  background: "#fffbfceb",
                  minWidth: 130,
                }}
                max={new Date().toISOString().slice(0, 10)}
                onChange={(e) => setToothDate(e.target.value)}
              />
              <input
                type="number"
                required
                min={1}
                max={99}
                placeholder="Sparkle Coins"
                value={toothCoin}
                style={{
                  padding: 8,
                  border: `1.5px solid ${COLORS.secondary}`,
                  borderRadius: 8,
                  fontSize: 15,
                  background: "#fffbfceb",
                  minWidth: 110,
                }}
                onChange={(e) => setToothCoin(e.target.value)}
              />
              <button
                className="btn"
                type="submit"
                style={{
                  background: COLORS.secondary,
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 16,
                  borderRadius: 18,
                  boxShadow: `1px 1px 8px 0 #ff69b455`,
                }}
              >
                Add to Ledger
              </button>
            </form>
          </div>

          {/* LEDGER TABLE */}
          <div
            style={{
              margin: "14px 0 30px",
              borderRadius: 16,
              background: "#fff7fa",
              boxShadow: "0 2px 8px 0 #ffd70029",
              border: `1.8px solid ${COLORS.primary}`,
              padding: 18,
              overflowX: "auto",
            }}
          >
            <div
              style={{
                fontWeight: 700,
                color: COLORS.accent,
                fontSize: 22,
                marginBottom: 8,
                textAlign: "center",
                letterSpacing: ".02em",
              }}
            >
              🪙 Sparkle Ledger
            </div>
            <LedgerTable />
          </div>

          {/* FAIRY AUDIT + BONUS STATS */}
          <div
            style={{
              margin: "0 auto 24px",
              padding: 14,
              background: "#f8f2fe",
              border: `2px dashed ${COLORS.accent}`,
              borderRadius: 12,
              minHeight: 90,
              maxWidth: 500,
              boxShadow: "0 1px 9px 0 #8a2be231",
              color: COLORS.accent,
              fontWeight: 500,
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
              💫 Fairy Audit Note
            </div>
            <div>{auditNote}</div>
            {teethEntries.length > 0 && (
              <div
                style={{
                  marginTop: 8,
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 8,
                  fontSize: 15,
                  color: COLORS.secondary,
                }}
              >
                <div>🪙 Total: {bonusStats.sum || 0}</div>
                <div>
                  ✨ Avg/visit: {bonusStats.avg ? bonusStats.avg.toFixed(2) : 0}
                </div>
                <div>🎯 Max: {bonusStats.max || 0}</div>
              </div>
            )}
          </div>

          {/* MAGIC CHARTS SECTION */}
          <div
            style={{
              display: "flex",
              gap: 32,
              justifyContent: "center",
              alignItems: "start",
              flexWrap: "wrap",
              marginBottom: 22,
            }}
          >
            {getTrendChartUrl() && (
              <img
                src={getTrendChartUrl()}
                alt="Sparkle Coin Trends"
                style={{
                  borderRadius: 16,
                  border: `3px solid ${COLORS.primary}`,
                  boxShadow: `0 2px 9px 0 #ffd70044`,
                  background: "#fff",
                  marginTop: 10,
                  maxWidth: 360,
                  width: "100%",
                }}
              />
            )}
            {getTimelineChartUrl() && (
              <img
                src={getTimelineChartUrl()}
                alt="Tooth Timeline"
                style={{
                  borderRadius: 16,
                  border: `3px solid ${COLORS.secondary}`,
                  boxShadow: `0 2px 10px 0 #8a2be244`,
                  background: "#fff",
                  marginTop: 10,
                  maxWidth: 340,
                  width: "100%",
                }}
              />
            )}
          </div>

          {/* GIF & NOTIFICATION PLACEHOLDER */}
          {showGifPlaceholder && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 120,
                background: "#fff4fce8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                animation: "fadeIn .7s",
              }}
              onClick={() => setShowGifPlaceholder(false)}
            >
              <div
                style={{
                  background: "#fff",
                  border: `4px dashed ${COLORS.secondary}`,
                  borderRadius: 22,
                  boxShadow: "0 4px 30px 0 #ffd70052",
                  padding: 38,
                  minWidth: 350,
                  minHeight: 120,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: "3.5rem" }} role="img" aria-label="magic gif">
                  🧚‍♂️
                </span>
                <div style={{ fontWeight: 700, color: COLORS.secondary, fontSize: 22, margin: "8px 0" }}>
                  GIPHY Magic Placeholder
                </div>
                <div style={{ fontSize: 15, color: COLORS.accent, marginBottom: 8 }}>
                  Animation would appear here!
                </div>
                <div
                  style={{
                    background: COLORS.accent,
                    color: "#fff",
                    padding: "7px 14px",
                    borderRadius: 13,
                    fontWeight: 600,
                    fontSize: 15,
                    letterSpacing: ".03em",
                  }}
                >
                  🎉 Tap anywhere to close
                </div>
                <div
                  style={{
                    marginTop: 9,
                    fontSize: 13,
                    color: COLORS.primary,
                    fontWeight: 400,
                  }}
                >
                  Push notifications via OneSignal would also be here
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div
            style={{
              marginTop: 32,
              marginBottom: 6,
              color: COLORS.accent,
              fontWeight: 500,
              textAlign: "center",
            }}
          >
            <span style={{ fontSize: 21 }}>
              ✨
            </span>{" "}
            <span>
              FairyFinance & MagicMetrics • All reports are sparkly and imaginary. Powered by Quotable, Cataas, DiceBear, QuickChart, and fairy dust!
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
