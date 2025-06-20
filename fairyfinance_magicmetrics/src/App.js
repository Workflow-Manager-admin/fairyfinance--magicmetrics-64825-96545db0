import React, { useState, useMemo, useEffect } from "react";
import "./App.css";
import { initOneSignal } from "./onesignal-init";
import MeetAFairy from "./MeetAFairy";
import ToothFairyChatbot from "./ToothFairyChatbot";
import FairyJokeOrFact from "./FairyJokeOrFact";
import FairyQuoteCard from "./FairyQuoteCard";

/*
  Sparkle animation overlay with fairy-dust drift & more varied magical flair!
*/
function MagicSparkleOverlay({ num = 42 }) {
  const [sparkles, setSparkles] = useState([]);
  // Animate a set of floating sparkles, and re-randomize on every render for movement variety
  useEffect(() => {
    const randomSparkle = (index) => {
      // randomize: some float up, some drift diagonally, layered durations and delays
      const left = Math.random() * 100;
      const top = 88 + Math.random() * 10;
      const driftX = Math.random() < 0.32 ? (Math.random() - 0.5) * 18 : 0;
      const dur = 2.9 + Math.random() * 3 + (index % 6 ? 0 : 2.1);
      const delay = Math.random() * 7 + (index % 7 ? 0 : 1.2);
      const scale = 0.62 + Math.random() * 1.07;
      const pulse = Math.random() < 0.15;
      return { left, top, dur, delay, scale, driftX, pulse, key: index };
    };
    setSparkles(Array.from({ length: num }).map((_, i) => randomSparkle(i)));
  }, [num]);
  return (
    <div className="sparkle-bg" aria-hidden>
      {sparkles.map(({ left, top, dur, delay, scale, driftX, pulse, key }) => (
        <div
          key={key}
          className="sparkle-dot"
          style={{
            left: `${left}%`,
            bottom: `${top}%`,
            animationDuration: `${dur}s`,
            animationDelay: `${delay}s`,
            transform: `translateX(${driftX}px) scale(${scale})${pulse ? " scale(1.19)" : ""}`,
            filter: pulse
              ? "blur(1.2px) drop-shadow(0 0 7px #ffeeb9) brightness(1.22)"
              : "drop-shadow(0 0 6px #cf6affcc)"
          }}
        />
      ))}
      {/* Layered fairy shimmer overlay dots for extra fairy dust */}
      {Array.from({ length: 11 }).map((_, i) => (
        <div
          key={"s2-" + i}
          className="sparkle-dot"
          style={{
            left: `${Math.random() * 100}%`,
            bottom: `${91 + Math.random() * 9}%`,
            animationDuration: `${2.2 + Math.random() * 2.6}s`,
            animationDelay: `${Math.random() * 9}s`,
            transform: `scale(${0.42 + Math.random() * 0.75})`,
            filter:
              "blur(4px) drop-shadow(0 0 16px #ffd700cc) hue-rotate(11deg) brightness(1.11)",
            opacity: 0.58
          }}
        />
      ))}
    </div>
  );
}

/**
 * Fetch a random fairy gif from the GIPHY API
 */
const GIPHY_API_KEY = "8oCA5PwOu5W3Bam9c5I5UbavJ6XLog2k";
const GIPHY_RANDOM_URL = `https://api.giphy.com/v1/gifs/random?api_key=${GIPHY_API_KEY}&tag=fairy&rating=pg`;

function useFairyGif() {
  const [gifUrl, setGifUrl] = useState(null);
  const [gifAlt, setGifAlt] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let ignore = false;
    setLoading(true);
    fetch(GIPHY_RANDOM_URL)
      .then((resp) => resp.json())
      .then((data) => {
        if (ignore) return;
        if (data?.data?.images?.downsized_large?.url) {
          setGifUrl(data.data.images.downsized_large.url);
          setGifAlt(data.data.title || "Fairy Magic GIF");
          setError("");
        } else {
          setError("Couldn't conjure up fairy magic right now!");
        }
        setLoading(false);
      })
      .catch(() => {
        if (ignore) return;
        setError("Oh no! Fairy dust ran out loading GIF.");
        setGifUrl(null);
        setGifAlt("");
        setLoading(false);
      });
    return () => { ignore = true; };
  }, []);
  return { gifUrl, gifAlt, loading, error };
}

// Magical color theme
const COLORS = {
  primary: "#ffd700",   // Fairy gold
  secondary: "#ff69b4", // Pixie pink
  accent: "#8a2be2",    // Enchanted violet
};

function getNextId(data) {
  return (
    Math.max(0, ...data.map((row) => Number(row.id) || 0)) + 1
  ).toString();
}

/*
  PUBLIC_INTERFACE
  Enhanced App component: Fairy gif banner now explicitly loads and displays above all content, with magical styling, instructions, and friendly error/loading states.
*/
function App() {
  // Initialize push notifications on first render (fairy magic appears after page load)
  useEffect(() => {
    initOneSignal();
  }, []);
  
  // Gif fetching for whimsical magical banner
  const { gifUrl, gifAlt, loading: gifLoading, error: gifError } = useFairyGif();

  // Ledger entry: date, childName, age, toothType, amount, fairyNote
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({
    date: "",
    childName: "",
    age: "",
    toothType: "Baby Tooth",
    amount: "",
    fairyNote: "",
  });

  const [showReport, setShowReport] = useState(false);

  // Helper for handling input changes
  function handleInput(e) {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: value,
    }));
  }

  // Handle entry submission
  function addEntry(e) {
    e.preventDefault();
    if (
      !form.date ||
      !form.childName.trim() ||
      !form.age ||
      !form.toothType.trim() ||
      !form.amount
    ) {
      alert("Please fill in all required fields!");
      return;
    }
    setEntries((rows) => [
      ...rows,
      {
        id: getNextId(rows),
        ...form,
        amount: parseFloat(form.amount),
      },
    ]);
    setForm({
      date: "",
      childName: "",
      age: "",
      toothType: "Baby Tooth",
      amount: "",
      fairyNote: "",
    });
  }

  // Delete entry
  function deleteEntry(id) {
    setEntries((rows) => rows.filter((r) => r.id !== id));
  }

  // Generate stats and trends
  const stats = useMemo(() => {
    if (!entries.length) {
      return {
        total: 0,
        avg: 0,
        lastEntry: null,
        toothStats: {},
        byDate: {},
        magicalBonusCount: 0,
        bestPaidTooth: null,
      };
    }
    let total = 0;
    let toothStats = {};
    let byDate = {};
    let magicalBonusCount = 0;
    let bestPaidTooth = null;
    entries.forEach((r) => {
      total += r.amount;
      toothStats[r.toothType] = (toothStats[r.toothType] || 0) + 1;
      byDate[r.date] = (byDate[r.date] || 0) + r.amount;
      if (r.fairyNote && r.fairyNote.match(/star|glitter|magic/i)) {
        magicalBonusCount += 1;
      }
      if (!bestPaidTooth || r.amount > bestPaidTooth.amount) {
        bestPaidTooth = r;
      }
    });
    return {
      total,
      avg: total / entries.length,
      lastEntry: entries[entries.length - 1],
      toothStats,
      byDate,
      magicalBonusCount,
      bestPaidTooth,
    };
  }, [entries]);

  // Prepare chart data for "economy trends" (date vs total paid)
  const trendData = useMemo(() => {
    // Sorted by date
    const points = Object.entries(stats.byDate)
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .map(([date, v]) => ({ date, total: v }));
    return points;
  }, [stats]);

  // Prepare tooth timeline data (date vs tooth count)
  const toothTimeline = useMemo(() => {
    // For each date, number of teeth lost
    let result = {};
    entries.forEach((r) => {
      result[r.date] = (result[r.date] || 0) + 1;
    });
    return Object.entries(result)
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .map(([date, count]) => ({ date, count }));
  }, [entries]);

  // Magical styles (extra)
  const magicalBackground = {
    background: `linear-gradient(120deg, ${COLORS.primary}11 0%, ${COLORS.secondary}22 55%, white 120%)`,
    borderRadius: "38px 10px 38px 10px/18px 34px 10px 44px",
    boxShadow: `0 0 24px 6px ${COLORS.accent}22`,
    border: `2px dashed ${COLORS.primary}`,
    padding: "1.5rem",
    margin: "2rem 0 2.5rem 0",
    position: "relative",
    zIndex: 1,
  };

  const createMagicalIcon = () => (
    <span
      aria-label="magic-star"
      style={{
        fontSize: "1.3em",
        verticalAlign: "middle",
        color: COLORS.accent,
        textShadow: `0 0 9px ${COLORS.secondary}, 0 0 4px ${COLORS.primary}`,
        margin: "0 0.3em",
      }}
    >
      ✨
    </span>
  );

  // === Magical Fairy Gif Crystal Ball Block ===
  const fairyCrystalBallBlock = (
    <div style={{
      width: "100%",
      display: "flex",
      justifyContent: "center",
      padding: "28px 0 8px 0",
      position: "relative",
      zIndex: 1003,
      // pastel fade for header
      background:
        "linear-gradient(120deg, #f9eaffcc 0%, #fffbe9bb 58%, #f9f5ff88 100%)",
      marginBottom: "-18px",
    }}>
      <div className="crystal-ball" aria-label="Magical crystal ball holding a fairy gif">
        <div className="crystal-sphere">
          {gifLoading && (
            <span style={{
              fontSize: "2em",
              color: COLORS.accent,
              filter: "drop-shadow(0 0 18px #ffd700cc)",
              fontFamily: "'Snell Roundhand', cursive"
            }}>
              🧚‍♀️
            </span>
          )}
          {gifError && (
            <span style={{
              color: COLORS.secondary,
              fontWeight: 700,
              fontFamily: "'Snell Roundhand', cursive",
              textShadow: "0 0 8px #fff,0 0 24px #ff69b470"
            }}>
              🧚‍♀️<br />No magic!<br />
              <span style={{ fontSize: ".92em", color: COLORS.accent }}>{gifError}</span>
            </span>
          )}
          {!gifLoading && !gifError && gifUrl && (
            <img
              src={gifUrl}
              alt={gifAlt}
              draggable={false}
            />
          )}
          <div className="sphere-sparkle" />
          <span className="sphere-star" role="img" aria-label="sparkle">✨</span>
        </div>
        <div className="crystal-bottom"></div>
        <div className="crystal-ball-footer">
          {gifLoading ? "Summoning pixie dust..." : gifError ? "Try again soon!" : "Your fairy companion"}
        </div>
      </div>
    </div>
  );

  // PUBLIC_INTERFACE
  return (
    <div
      className="app"
      style={{
        minHeight: "100vh",
        background: "transparent",
        fontFamily:
          "'Snell Roundhand', 'Inter', 'Roboto', 'Helvetica', 'Arial', cursive, sans-serif"
      }}
    >
      <MagicSparkleOverlay num={26} />
      {/* --- Crystal Ball with Magical Fairy Gif --- */}
      {fairyCrystalBallBlock}
      <ToothFairyChatbot />
      {/* --- Main navigation & rest of app --- */}
      <nav
        className="navbar"
        style={{}}
      >
        <div className="container" style={{ maxWidth: "1024px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
            <div className="logo">
              <span className="logo-symbol">🧚‍♀️</span>
              ToothFairy Ledger
            </div>
            <button
              className="btn"
              onClick={() => setShowReport((v) => !v)}
              aria-label="Show Magical Report"
            >
              {showReport ? "Back to App" : createMagicalIcon()} {showReport ? "Close Report" : "Magical Report"}
            </button>
          </div>
        </div>
      </nav>
      <main>
        {/* --- rest of app with magical overlays --- */}
        <div className="container" style={{ maxWidth: "1024px", paddingTop: "78px" }}>
          <section className="magical-bg">
            <h1 className="title">
              ToothFairy Ledger
              {createMagicalIcon()}
            </h1>
            <p className="subtitle">
              The Magical Ledger for Tooth Fairy Finances & Dreamy Stats
            </p>
            <div className="description">
              Track earnings, bonuses, and the economic adventures of fairyland! Enter every lost tooth and watch stats come alive in your magical ledger.
            </div>
          </section>
          {showReport ? (
            <MagicalReport entries={entries} stats={stats} colors={COLORS} createMagicalIcon={createMagicalIcon} />
          ) : (
            <>
              <section className="magical-bg" style={{
                margin: "0 0 2.2rem 0",
                background: `linear-gradient(117deg, #fffbe0 66%, ${COLORS.secondary}22 130%)`,
              }}>
                <h2 style={{ color: COLORS.accent, fontWeight: "700", fontSize: "2.1rem", marginBottom: "0.9rem", fontFamily: "'Snell Roundhand', cursive" }}>
                  {createMagicalIcon()} Add ToothFairy Ledger Entry
                </h2>
                <form onSubmit={addEntry} id="fairy-form">
                  <MagicalInput label="Date" type="date" name="date" value={form.date} onChange={handleInput} required />
                  <MagicalInput label="Child Name" type="text" name="childName" value={form.childName} onChange={handleInput} required />
                  <MagicalInput label="Age" type="number" name="age" value={form.age} onChange={handleInput} required min={1} />
                  <MagicalSelect label="Tooth Type" name="toothType" value={form.toothType} onChange={handleInput}
                    options={["Baby Tooth", "Molar", "Incisor", "Canine", "Magic Crystal", "Sparkling Premolar"]}
                  />
                  <MagicalInput label="Earning (gold coins)"
                    type="number"
                    step="0.01"
                    name="amount"
                    value={form.amount}
                    onChange={handleInput}
                    required
                    min={0}
                  />
                  <MagicalInput label="Fairy Note"
                    type="text"
                    name="fairyNote"
                    value={form.fairyNote}
                    onChange={handleInput}
                    placeholder="e.g. Left a magic star!"
                  />
                  <div style={{ flex: 1, minWidth: "160px", display: "flex", alignItems: "end" }}>
                    <button type="submit" className="btn" style={{ fontWeight: "700", width: "100%" }}>
                      {createMagicalIcon()} Add to Ledger
                    </button>
                  </div>
                </form>
              </section>

              <section className="magical-bg" style={{ margin: 0 }}>
                <h2 style={{
                  color: COLORS.secondary, fontSize: "2rem", fontWeight: "800", letterSpacing: ".01em", marginBottom: "1.2em",
                  textShadow: `0 0 8px ${COLORS.accent}66`
                }}>
                  {createMagicalIcon()} ToothFairy Ledger
                </h2>
                <LedgerTable
                  entries={entries}
                  deleteEntry={deleteEntry}
                  createMagicalIcon={createMagicalIcon}
                  colors={COLORS}
                />
              </section>

              {/* Meet a Tooth Fairy Card - Simple API Integration */}
              <MeetAFairy />

              {/* Magical Joke Card: prominently show fun API card */}
              <FairyJokeOrFact />

              {/* Magical Inspirational Quote Card: whimsical style, below/near */}
              <FairyQuoteCard />

              <section style={{ display: "flex", gap: "2em", flexWrap: "wrap", margin: "1.5rem 0" }}>
                <div className="magical-bg" style={{ flex: "2 1 320px" }}>
                  <h3 style={{ fontSize: "1.3rem", color: COLORS.secondary, marginBottom: 12 }}>
                    {createMagicalIcon()} Tooth Economy Trends
                  </h3>
                  <MiniLineChart
                    data={trendData}
                    xKey="date"
                    yKey="total"
                    lineColor={COLORS.accent}
                    areaColor={COLORS.primary}
                    label="Gold Coins Paid"
                  />
                </div>

                <div className="magical-bg" style={{ flex: "1 1 245px", minWidth: 200 }}>
                  <h3 style={{ fontSize: "1.16rem", color: COLORS.primary, marginBottom: 8 }}>
                    {createMagicalIcon()} Teeth Lost Timeline
                  </h3>
                  <MiniBarChart
                    data={toothTimeline}
                    xKey="date"
                    yKey="count"
                    barColor={COLORS.secondary}
                    label="Teeth"
                  />
                </div>
              </section>

              <section className="magical-bg">
                <StatsAndNotes stats={stats} colors={COLORS} createMagicalIcon={createMagicalIcon} />
              </section>
            </>
          )}
        </div>
      </main>
      <footer style={{ textAlign: "center", color: COLORS.secondary, padding: "38px 0 28px 0", fontWeight: 500 }}>
        <span style={{ fontSize: "1.3em" }}>🦷</span>
        <span> ToothFairy Ledger — Powered by tooth fairy magic.</span>
      </footer>
    </div>
  );
}

// Magical Input Components
function MagicalInput({ label, ...props }) {
  return (
    <div style={{ flex: 1, minWidth: "138px", display: "flex", flexDirection: "column", gap: 4 }}>
      <label style={{
        fontWeight: "600",
        color: "#ad46bc",
        fontFamily: "'Snell Roundhand', cursive"
      }}>
        {label}
      </label>
      <input
        {...props}
        style={{
          padding: "7px 11px",
          borderRadius: "8px",
          border: "1.5px solid #e0b0ff",
          background: "white",
          color: "#444",
          fontWeight: 500,
        }}
        autoComplete="off"
      />
    </div>
  );
}
function MagicalSelect({ label, options, ...props }) {
  return (
    <div style={{ flex: 1, minWidth: "150px", display: "flex", flexDirection: "column", gap: 4 }}>
      <label style={{
        fontWeight: "600",
        color: "#9950a2",
        fontFamily: "'Snell Roundhand', cursive"
      }}>
        {label}
      </label>
      <select
        {...props}
        style={{
          padding: "7px 11px",
          borderRadius: "8px",
          border: "1.5px solid #e0b0ff",
          background: "white",
          color: "#504063",
          fontWeight: 500,
        }}
      >
        {options.map((op) => (
          <option key={op} value={op}>
            {op}
          </option>
        ))}
      </select>
    </div>
  );
}

// Magical Ledger Table
function LedgerTable({ entries, deleteEntry, createMagicalIcon, colors }) {
  if (!entries.length)
    return (
      <div style={{ textAlign: "center", paddingBottom: 16, color: colors.accent }}>
        No fairy ledger entries yet. Add some sparkling magic above!
      </div>
    );
  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "separate",
          borderSpacing: "0px 7px",
          borderRadius: "14px",
          background: "#faf6ff",
          boxShadow: "0 4px 18px 0 #8a2be22b",
        }}
      >
        <thead>
          <tr style={{ color: colors.primary, background: "#fee4fd", fontWeight: 700 }}>
            <th style={{ borderTopLeftRadius: "7px", padding: "8px 9px" }}>Date</th>
            <th>Child Name</th>
            <th>Age</th>
            <th>Tooth Type</th>
            <th>Earning</th>
            <th>Fairy Note</th>
            <th style={{ borderTopRightRadius: "7px" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((r) => (
            <tr key={r.id} style={{
              color: "#74489b",
              background: "#fffce7",
              fontWeight: "500",
              borderRadius: "8px",
              border: `1.5px solid ${colors.accent}22`,
            }}>
              <td style={{ minWidth: 96, textAlign: "center", padding: "7px 8px" }}>{r.date}</td>
              <td>{r.childName}</td>
              <td>{r.age}</td>
              <td>{r.toothType}</td>
              <td style={{ color: colors.accent, fontWeight: 800 }}>
                {r.amount?.toFixed(2)} <span style={{ fontSize: ".9em", color: colors.primary }}>🪙</span>
              </td>
              <td style={{ fontStyle: r.fairyNote ? "italic" : "normal" }}>
                {r.fairyNote || <span style={{ color: "#c3abc9" }}>—</span>}
              </td>
              <td>
                <button
                  title="Remove"
                  style={{
                    background: colors.secondary,
                    color: "#fff",
                    border: "none",
                    padding: "5px 10px",
                    borderRadius: "30px",
                    fontSize: "1em",
                    fontWeight: "600",
                  }}
                  onClick={() => deleteEntry(r.id)}
                >
                  {createMagicalIcon()}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Minimal Chart Components (SVG-powered, no external library)
/**
 * MiniLineChart: simple SVG chart for financial trends
 */
function MiniLineChart({ data, xKey, yKey, lineColor, areaColor, label }) {
  if (!data.length) return <EmptyChart label={label} />;
  // SVG layout
  const W = 340, H = 132, PAD = 20;
  const points = data.map((d) => d[yKey]);
  const maxY = Math.max(...points, 5);
  const minY = Math.min(...points, 0);
  const getX = (i) => PAD + ((W - 2 * PAD) * i) / Math.max(1, data.length - 1);
  const getY = (y) => H - PAD - ((H - 2 * PAD) * (y - minY)) / Math.max(maxY - minY, 1);

  // Line path
  const path = data
    .map(
      (d, i) =>
        `${i === 0 ? "M" : "L"}${getX(i)},${getY(d[yKey])}`
    )
    .join(" ");

  // Area path
  const areaPath =
    path +
    ` L${getX(data.length - 1)},${H - PAD} L${getX(0)},${H - PAD} Z`;

  return (
    <div style={{ width: W, maxWidth: "100%" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H}>
        {/* Axes */}
        <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="#dddddd" />
        <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="#dddddd" />
        {/* Area */}
        <path d={areaPath} fill={areaColor + "22"} />
        {/* Trend line */}
        <path d={path} stroke={lineColor} fill="none" strokeWidth={3} />
        {/* Dots */}
        {data.map((d, i) => (
          <circle
            key={i}
            cx={getX(i)}
            cy={getY(d[yKey])}
            r={6}
            fill="white"
            stroke={lineColor}
            strokeWidth={2}
          />
        ))}
        {/* Labels */}
        <text x={PAD} y={PAD + 6} fill="#888" fontSize="0.9em">
          {maxY}
        </text>
        <text x={PAD + 3} y={H - PAD - 7} fill="#aaa" fontSize="0.86em">
          {minY}
        </text>
        {data.map((d, i) => (
          <text key={i}
            x={getX(i)}
            y={H - PAD + 16}
            fontSize="0.84em"
            fill="#ac86fa"
            textAnchor="middle"
          >
            {d[xKey].slice(5)} {/* Show MM-DD */}
          </text>
        ))}
      </svg>
      <div style={{ textAlign: "center", color: "#765e94", fontSize: ".93em", marginTop: 3 }}>{label}</div>
    </div>
  );
}
/**
 * MiniBarChart: simple SVG bar chart for counts
 */
function MiniBarChart({ data, xKey, yKey, barColor, label }) {
  if (!data.length) return <EmptyChart label={label} />;
  const W = 220, H = 112, PAD = 22;
  const points = data.map((d) => d[yKey]);
  const maxY = Math.max(...points, 4);
  const barW = Math.max(18, (W - PAD * 2) / Math.max(5, data.length));
  return (
    <div style={{ width: W, maxWidth: "100%" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H}>
        {/* Axis */}
        <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="#cccccc" />
        {/* Bars */}
        {data.map((d, i) => {
          const x = PAD + i * (barW + 5);
          const y = ((d[yKey] / maxY) * (H - 2 * PAD));
          return (
            <rect
              key={i}
              x={x}
              width={barW - 5}
              y={H - PAD - y}
              height={y}
              fill={barColor}
              rx={6}
              opacity="0.6"
            />
          );
        })}
        {/* Labels */}
        {data.map((d, i) => {
          const x = PAD + i * (barW + 5) + (barW - 5) / 2;
          return (
            <text
              x={x}
              y={H - PAD + 15}
              fill="#ac86fa"
              fontSize=".83em"
              key={i}
              textAnchor="middle"
            >
              {d[xKey].slice(5)}
            </text>
          );
        })}
        <text
          x={PAD}
          y={PAD + 5}
          fill="#8a2be2"
          fontSize="0.91em"
        >
          {maxY}
        </text>
        <text
          x={PAD + 3}
          y={H - PAD - 6}
          fill="#aaa"
          fontSize="0.85em"
        >
          0
        </text>
      </svg>
      <div style={{ textAlign: "center", color: "#765e94", fontSize: ".93em", marginTop: 4 }}>{label}</div>
    </div>
  );
}

function EmptyChart({ label }) {
  return (
    <div style={{ textAlign: "center", color: "#dac4e5", fontSize: "0.96em", padding: "18px 0" }}>
      No data for {label}.
    </div>
  );
}

// Stats and Notes
function StatsAndNotes({ stats, colors, createMagicalIcon }) {
  return (
    <div style={{
      display: "flex",
      flexWrap: "wrap",
      gap: "1.5em",
      alignItems: "flex-start",
    }}>
      <div style={{ flex: "1 0 200px", minWidth: "160px" }}>
        <div style={{ fontFamily: "'Snell Roundhand', cursive", color: colors.accent, fontSize: "1.22em", fontWeight: 600, marginBottom: "0.6em" }}>
          Fairy Stats
        </div>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, color: colors.primary, fontWeight: "600" }}>
          <li>
            Gold Coins Earned: <span style={{ color: colors.accent }}>{stats.total?.toFixed(2) ?? 0} 🪙</span>
          </li>
          <li>
            Average per Tooth: <span style={{ color: colors.secondary }}>{(stats.avg || 0).toFixed(2)} 🪙</span>
          </li>
          <li>
            Teeth Lost: <span style={{ color: colors.accent }}>{Object.values(stats.toothStats).reduce((a, b) => a + b, 0)}</span>
          </li>
          <li>
            Magical Bonuses: <span style={{ color: "#b60e9e" }}>{stats.magicalBonusCount}</span>
          </li>
        </ul>
      </div>
      <div style={{ flex: "1 0 240px" }}>
        <div style={{ fontFamily: "'Snell Roundhand', cursive", color: colors.secondary, fontSize: "1.13em", fontWeight: 600, marginBottom: "0.28em" }}>
          {createMagicalIcon()} Fairy Audit Highlights
        </div>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, fontWeight: 500, color: "#8563c9" }}>
          <li>
            Most Collected Tooth:{" "}
            <span style={{ color: colors.accent }}>
              {stats.bestPaidTooth
                ? `"${stats.bestPaidTooth.toothType}" for ${stats.bestPaidTooth.childName} (${stats.bestPaidTooth.amount?.toFixed(2)} 🪙)`
                : "—"}
            </span>
          </li>
          <li>
            Last Ledger Entry:{" "}
            <span style={{ color: "#c72090" }}>
              {stats.lastEntry
                ? `${stats.lastEntry.childName} (${stats.lastEntry.date})`
                : "—"}
            </span>
          </li>
          <li>
            Tooth Type Stats:{" "}
            <span style={{ color: colors.primary }}>
              {Object.keys(stats.toothStats).length === 0
                ? "—"
                : Object.entries(stats.toothStats)
                  .map(([k, v]) => `${k}: ${v}`)
                  .join(" | ")}
            </span>
          </li>
        </ul>
      </div>
      <div style={{ flex: "1 1 260px" }}>
        <div style={{ fontFamily: "'Snell Roundhand', cursive", color: "#c183fa", fontWeight: 600, marginBottom: ".19em" }}>
          Special Fairy Note
        </div>
        <div style={{
          background: "#f8e6fc",
          borderRadius: "12px",
          fontStyle: "italic",
          color: "#ba42da",
          fontWeight: 500,
          fontSize: "1em",
          padding: "8px 17px"
        }}>
          {stats.total > 0
            ? (
              <>
                {stats.avg >= 3
                  ? "✨ It's a season of generous sparkle! Fairyland economy is flourishing."
                  : stats.magicalBonusCount >= 2
                    ? "🌈 Magical bonuses are in abundance! Keep the fairy magic flowing."
                    : "🦷 The tooth tally grows. Don't forget to sprinkle some pixie dust."
                }
              </>
            )
            : "No entries yet — the magic is waiting to begin..."}
        </div>
      </div>
    </div>
  );
}

// Magical Ledger Report
function MagicalReport({ entries, stats, colors, createMagicalIcon }) {
  const now = new Date();
  return (
    <div
      style={{
        background: `linear-gradient(122deg, #fff9ee 75%, ${colors.secondary}22 160%)`,
        borderRadius: "25px 24px 38px 18px/31px 34px 19px 31px",
        border: `2.6px double ${colors.accent}`,
        padding: "2.1em 1.3em",
        margin: "2.3em 0 2.5em 0",
        boxShadow: `0 0 30px 8px ${colors.primary}22`,
        position: "relative",
        minHeight: "350px"
      }}
    >
      <div style={{
        position: "absolute",
        left: "-24px",
        top: "-32px",
        fontSize: "2.8em",
        transform: "rotate(-18deg)",
        zIndex: "0",
        opacity: 0.15,
      }}>
        🪙
      </div>
      <div style={{
        fontFamily: "'Snell Roundhand', cursive",
        textAlign: "center",
        color: colors.primary,
        letterSpacing: ".04em",
        fontWeight: 700,
        fontSize: "2.1em",
        marginBottom: ".3em"
      }}>
        ToothFairy Ledger Report
      </div>

      <div style={{
        textAlign: "center",
        color: "#8946cf",
        fontStyle: "italic",
        marginBottom: "1em",
        fontWeight: 500
      }}>
        Audit Date: {now.toLocaleDateString()} | Entries: {entries.length}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        <div style={{ flex: "1 1 260px", minWidth: "200px", color: colors.accent }}>
          <div style={{ fontWeight: 700, fontSize: "1em", marginBottom: "4px" }}>Highlights</div>
          <div>Total Gold Coins: <b>{stats.total?.toFixed(2) ?? 0} 🪙</b></div>
          <div>Avg Per Tooth: <b>{(stats.avg || 0).toFixed(2)} 🪙</b></div>
          <div>Most Collected Tooth: <b>{stats.bestPaidTooth ? `"${stats.bestPaidTooth.toothType}"` : "—"}</b></div>
          <div>Bonuses: <b>{stats.magicalBonusCount}</b></div>
        </div>
        <div style={{ flex: "2 1 330px", minWidth: "230px" }}>
          <div style={{
            fontWeight: "600",
            fontSize: "1em",
            marginBottom: "7px",
            color: colors.secondary
          }}>Ledger Entries</div>
          <ol style={{ margin: 0, padding: 0, listStylePosition: "inside" }}>
            {entries.length === 0
              ? <li style={{ color: "#adadad" }}>No ledger entries yet.</li>
              : entries.map((r) => (
                <li key={r.id} style={{
                  marginBottom: 3,
                  color: "#a567cf",
                  background: "#fff7ef",
                  borderRadius: "6px",
                  padding: "2px 9px",
                  fontWeight: 500
                }}>
                  <b>{r.childName}</b> ({r.date}) lost a <b>{r.toothType}</b>
                  for {r.amount?.toFixed(2)} 🪙{r.fairyNote ? ` — note: ${r.fairyNote}` : ""}.
                </li>
              ))}
          </ol>
        </div>
        <div style={{ flex: "1 1 180px", minWidth: "135px", color: "#ba5bdd" }}>
          <div style={{ fontWeight: 700, fontSize: "1em", marginBottom: "4px" }}>Tooth Types</div>
          {Object.keys(stats.toothStats).length === 0 ? "—"
            : (
              <ul style={{ margin: 0, padding: 0, listStyle: "circle inside" }}>
                {Object.entries(stats.toothStats).map(([k, v]) => (
                  <li key={k} style={{ color: colors.primary }}>{k}: <span style={{ color: colors.secondary }}>{v}</span></li>
                ))}
              </ul>
            )}
        </div>
      </div>
      <div style={{
        marginTop: "2.2em",
        textAlign: "center",
        color: "#af70e9",
        fontFamily: "'Snell Roundhand', cursive",
        fontSize: "1.05em",
        letterSpacing: ".01em"
      }}>
        {createMagicalIcon()}
        End of Magical Ledger Report. May fairy sparkle bless your night!
        {createMagicalIcon()}
      </div>
    </div>
  );
}

export default App;
