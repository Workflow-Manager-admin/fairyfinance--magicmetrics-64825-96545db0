import React, { useState, useEffect } from "react";
import "./LedgerDashboard.css";

/**
 * PUBLIC_INTERFACE
 * Main magical dashboard for Tooth Fairy Ledger stat displays and widgets.
 */
function LedgerDashboard({ ledgerInput }) {
  // Magical state for dashboard stats and live widgets
  const [sparkleEarnings, setSparkleEarnings] = useState(0);
  const [auditNote, setAuditNote] = useState("");
  const [economyTrend, setEconomyTrend] = useState([]);
  const [toothTimeline, setToothTimeline] = useState([]);
  const [bonusStats, setBonusStats] = useState({});

  // Widgets state for external API integrations
  const [magicalQuote, setMagicalQuote] = useState({ text: "", author: "" });
  const [magicalGIF, setMagicalGIF] = useState({ url: "", alt: "" });
  const [funFact, setFunFact] = useState("");
  const [weather, setWeather] = useState({ desc: "", temp: "" });
  const [loading, setLoading] = useState({ quote: true, gif: true, funFact: true, weather: true });

  // Compute stat widgets as before
  useEffect(() => {
    if (!ledgerInput) return;
    const coins = Number(ledgerInput.teethLost || 0) * 10 + (Number(ledgerInput.age || 0) * 1.3);
    setSparkleEarnings(coins);
    setAuditNote(
      coins > 100
        ? "🌟 Exceptional tooth collecting! Fairy Board congratulates your Sparkle initiative."
        : "✨ Keep twinkling! More teeth, more magic. The Fairy Board is watching your progress closely."
    );
    setEconomyTrend(
      Array.from({ length: 12 }).map((_, idx) => Math.round(coins * (0.7 + 0.09 * Math.sin(idx) + Math.random() * 0.15)))
    );
    setToothTimeline(
      (ledgerInput.toothDates || []).map((d, i) => ({
        date: d,
        coins: 10,
        idx: i + 1,
      }))
    );
    setBonusStats({
      fairiness: Math.min(100, Math.round(70 + (ledgerInput.teethLost || 0) * 2 + Math.random() * 18)),
      magicalToothDay:
        (ledgerInput.toothDates && ledgerInput.toothDates.length)
          ? ledgerInput.toothDates[Math.floor(Math.random() * ledgerInput.toothDates.length)]
          : "A magical full moon night 🌕",
      bonusWings: Math.round((ledgerInput.age || 0) / 4) + (ledgerInput.teethLost ? Math.floor(ledgerInput.teethLost / 3) : 0),
    });
  }, [ledgerInput]);

  // ===== API Widgets Logic =====
  // 1. Magical/Fantasy Quote - magicalquote API or fallback to quotable
  useEffect(() => {
    setLoading((l) => ({ ...l, quote: true }));
    // Try magical/fantasy quote API first, else fallback
    fetch("https://api.magicalquote.com/quote/random")
      .then(r => {
        if (r.ok) return r.json();
        throw new Error("Magical Quote API failed");
      })
      .then(data => {
        setMagicalQuote({ text: data.quote, author: data.author });
        setLoading((l) => ({ ...l, quote: false }));
      })
      .catch(() => {
        // Use quotable as fallback, as before
        fetch("https://api.quotable.io/random")
          .then(r => r.json())
          .then(data => {
            setMagicalQuote({ text: data.content, author: data.author || "Unknown" });
            setLoading((l) => ({ ...l, quote: false }));
          })
          .catch(() => {
            setMagicalQuote({ text: "Magic is believing in yourself. If you can do that, you can make anything happen.", author: "Goethe" });
            setLoading((l) => ({ ...l, quote: false }));
          });
      });
  }, []);

  // 2. Trending GIF - Tenor trending endpoint for "fairy" & "magic"
  useEffect(() => {
    setLoading((l) => ({ ...l, gif: true }));
    fetch(`https://g.tenor.com/v1/trending?key=LIVDSRZULELA&limit=12`)
      .then((r) => r.json())
      .then((data) => {
        if (data.results && data.results.length > 0) {
          // Prefer "fairy", "magic", or vibrant-looking gifs
          let selected = data.results[Math.floor(Math.random() * data.results.length)];
          for (const gif of data.results) {
            if (
              gif.title && (
                gif.title.toLowerCase().includes("fairy") ||
                gif.title.toLowerCase().includes("magic")
              )
            ) {
              selected = gif;
              break;
            }
          }
          setMagicalGIF({
            url: selected.media[0]?.gif?.url || selected.media[0]?.tinygif?.url || "",
            alt: selected.title || "Magical animation"
          });
        }
        setLoading((l) => ({ ...l, gif: false }));
      })
      .catch(() => {
        setMagicalGIF({ url: "", alt: "" });
        setLoading((l) => ({ ...l, gif: false }));
      });
  }, []);

  // 3. Fun Fact (useless facts API)
  useEffect(() => {
    setLoading((l) => ({ ...l, funFact: true }));
    fetch("https://uselessfacts.jsph.pl/random.json?language=en")
      .then((r) => r.json())
      .then((data) => {
        setFunFact(data.text);
        setLoading((l) => ({ ...l, funFact: false }));
      })
      .catch(() => {
        setFunFact("Fairies grant invisible wishes every day. ✨");
        setLoading((l) => ({ ...l, funFact: false }));
      });
  }, []);

  // 4. Weather for "Fairyland" - fallback to known weather desc/temp if offline
  useEffect(() => {
    setLoading((l) => ({ ...l, weather: true }));
    fetch("https://wttr.in/Fairyland?format=%C,%t")
      .then(r => r.text())
      .then(t => {
        const [desc, temp] = t.split(",");
        setWeather({ desc: desc || "Magical", temp: temp || "" });
        setLoading((l) => ({ ...l, weather: false }));
      })
      .catch(() => {
        setWeather({ desc: "Sparkling clouds", temp: "+22°C" });
        setLoading((l) => ({ ...l, weather: false }));
      });
  }, []);

  // ===== Dashboard Layout =====
  return (
    <div className="ledger-dashboard-container">
      <div className="ledger-widgets-row">
        <SparkleCoinEarnings amount={sparkleEarnings} />
        <FairyAuditNote note={auditNote} />
        <FairyStatsPieChart
          coins={sparkleEarnings}
          teethLost={ledgerInput?.teethLost || 0}
          age={ledgerInput?.age || 0}
        />
      </div>
      <div className="ledger-widgets-row">
        <EconomyTrendChart data={economyTrend} />
        <ToothTimelineChart timeline={toothTimeline} />
      </div>
      <div className="ledger-widgets-row">
        <BonusStats stats={bonusStats} />
        <MagicalQuoteWidget
          quote={magicalQuote.text}
          author={magicalQuote.author}
          gifUrl={magicalGIF.url}
          gifAlt={magicalGIF.alt}
          loadingQuote={loading.quote}
          loadingGIF={loading.gif}
        />
        <FunFactWidget
          fact={funFact}
          weather={weather}
          loadingFact={loading.funFact}
          loadingWeather={loading.weather}
        />
      </div>
    </div>
  );
}

// Vibrant magical stat components, themed and sparkle-laden
function SparkleCoinEarnings({ amount }) {
  // Coin icon SVG with sparkle animation
  return (
    <div className="stat-widget stat-coin">
      <div className="stat-icon">
        <svg width="58" height="58" aria-hidden="true" className="coin-sparkle-svg">
          <defs>
            <radialGradient id="coin-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fffad1"/>
              <stop offset="65%" stopColor="#ffe066"/>
              <stop offset="100%" stopColor="#ffd700"/>
            </radialGradient>
            <filter id="sparkle-blur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="s"/>
              <feMerge>
                <feMergeNode in="s"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <circle cx="29" cy="29" r="23" fill="url(#coin-grad)" filter="url(#sparkle-blur)" />
          {/* Sparkle */}
          <g>
            <polygon className="coin-sparkle" points="29,7 32,18 42,18 33,25 36,36 29,30 22,36 25,25 16,18 26,18"
                    fill="#fffde9" filter="url(#sparkle-blur)">
              <animateTransform attributeName="transform" type="rotate" values="0 29 22;15 29 22;0 29 22" dur="2.2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.75;1;0.7;1;0.7" dur="2.2s" repeatCount="indefinite" />
            </polygon>
          </g>
        </svg>
      </div>
      <div className="stat-title">Sparkle Coins</div>
      <div className="stat-value">
        <span>{amount ?? "--"}</span>
      </div>
      <div className="stat-desc">Total magical earnings 🌟</div>
    </div>
  );
}

function FairyAuditNote({ note }) {
  return (
    <div className="stat-widget stat-fairy-audit">
      <div className="stat-icon small">
        <span role="img" aria-label="fairy-notebook" className="audit-icon">🧚‍♀️📓</span>
      </div>
      <div className="stat-title">Fairy Audit Note</div>
      <div className="stat-value stat-note">{note}</div>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * EconomyTrendChart - sparkly chart card with QuickChart.io image for earnings over time
 */
function EconomyTrendChart({ data }) {
  // Magical line chart (SVG) plus new QuickChart.io image for lively dashboard!

  // Prepare QuickChart data for external render - keep it magical, sparkly, and on brand!
  const chartLabels = Array.from({length: data.length}, (_, i) => `M${i+1}`);
  const chartUrl = (() => {
    // Our magical palette: #b47cff (purple), #ffd700 (gold), #ff76e5 (pink), #7cebff (blue)
    const config = {
      type: "line",
      data: {
        labels: chartLabels,
        datasets: [
          {
            label: "Sparkle Coin Earnings",
            data,
            fill: true,
            borderColor: "#b47cff",
            backgroundColor: "rgba(255,118,229,0.13)",
            pointBackgroundColor: "#ffd700",
            pointBorderColor: "#ff76e5",
            pointRadius: 5,
            borderWidth: 4,
            tension: 0.43,
          }
        ]
      },
      options: {
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: false
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color: "#b47cff",
              font: { size: 16, family: "Purple Purse, cursive" }
            }
          },
          y: {
            grid: {
              color: "#ffe06644",
              lineWidth: 2,
              borderDash: [6, 8]
            },
            beginAtZero: true,
            ticks: {
              color: "#eab81c",
              font: { size: 15, family: "Purple Purse, cursive" }
            }
          }
        }
      }
    };
    const bg = "bg=rgba(255,251,227,0.97)";
    // width/height and "theme"
    const size = "width=400&height=180&devicePixelRatio=2";
    const sparkle = "format=png&version=3.0.0"; // use v3 for pretty output
    // Compose URL
    return `https://quickchart.io/chart?${size}&${bg}&${sparkle}&c=${encodeURIComponent(JSON.stringify(config))}`;
  })();

  // SVG fallback for accessibility in the magical ledger
  const maxVal = Math.max(...data, 18);
  const minVal = Math.min(...data, 0);
  const norm = val => 82 - ((val - minVal) / (maxVal - minVal || 1)) * 54;

  return (
    <div className="stat-widget stat-economy-chart" style={{ position: "relative", overflow: "visible" }}>
      <div className="stat-title">
        Magical Economy Trends
        <span aria-hidden="true" style={{ marginLeft: 7, fontSize: 21, verticalAlign: "middle", filter: "drop-shadow(0 0 8px #ffd700ee)" }}>✨</span>
      </div>
      {/* QuickChart.io image, visually magical */}
      <div
        style={{
          width: 400,
          maxWidth: "100%",
          margin: "0 auto 8px auto",
          background: "radial-gradient(circle at 63% 59%, #fffbe3 75%, #ffd6fd 100%)",
          borderRadius: 33,
          boxShadow: "0 0 32px 3px #ffd6fd69, 0 0 10px #b47cff99, 0 0 0 6px #ffe06623",
          border: "2.1px solid #b47cff50",
          padding: 7,
          display: "flex", justifyContent: "center", alignItems: "center",
          position: "relative",
          zIndex: 2,
          minHeight: 112
        }}
      >
        <img
          src={chartUrl}
          alt="Sparkle Coin Earnings Chart over Time"
          width={380}
          height={160}
          style={{
            width: "94%",
            maxWidth: 380,
            minHeight: 100,
            display: "block",
            margin: "0 auto",
            borderRadius: 22,
            filter: "drop-shadow(0 0 16px #ffd70036) drop-shadow(0 0 4px #b47cff59)",
            background: "#fff",
            border: "2px solid #ffd70040",
            boxShadow: "0 2px 14px #b47cff27, 0 0 8px #ffd70044"
          }}
        />
        {/* Sparkle SVG deco for the chart */}
        <svg aria-hidden="true" width="34" height="34" style={{ position: "absolute", right: -10, top: -10, opacity: 0.79 }}>
          <polygon points="17,2 20,14 33,15 22,20 25,32 17,26 9,32 12,20 1,15 14,14" fill="#ffd700" />
        </svg>
      </div>
      {/* SVG fallback (keep for accessibility/minimal browser fallback or static render) */}
      <div style={{ display: "none" }}>
        <svg viewBox="0 0 138 90" className="trend-svg">
          <defs>
            <linearGradient id="magictrend" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#b47cff"/>
              <stop offset="60%" stopColor="#ffd700"/>
              <stop offset="100%" stopColor="#ff76e5"/>
            </linearGradient>
            <filter id="trend-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="#ffd6fd"/>
            </filter>
          </defs>
          <polyline
            fill="none"
            stroke="url(#magictrend)"
            strokeWidth="4"
            filter="url(#trend-shadow)"
            points={data.map((d, i) => `${10 + i * 11},${norm(d)}`).join(" ")}
          />
          {data.map((d, i) =>
            <circle
              key={i}
              cx={10 + i * 11}
              cy={norm(d)}
              r="3.8"
              fill="#fff3fd"
              stroke="#ff76e5"
              strokeWidth="2"
              filter="url(#trend-shadow)">
              <animate attributeName="r" values="3.5;5;3.8" dur="1.6s" repeatCount="indefinite" begin={0.15 * i + "s"} />
            </circle>
          )}
        </svg>
      </div>
      <div className="stat-desc">Revenue from dream trading & tooth market</div>
    </div>
  );
}

function ToothTimelineChart({ timeline }) {
  // Tooth events displayed as horizontal timeline
  if (!timeline?.length)
    return (
      <div className="stat-widget stat-tooth-timeline timeline-empty">
        <div className="stat-title">Tooth Timeline</div>
        <div className="stat-value">
          <span role="img" aria-label="tooth">🦷</span> No records yet!
        </div>
      </div>
    );
  return (
    <div className="stat-widget stat-tooth-timeline">
      <div className="stat-title">Tooth Timeline</div>
      <div className="tooth-timeline-track">
        {timeline.map((event, idx) => (
          <div className="tooth-timeline-entry" key={idx}>
            <div className="tooth-ico">
              <span role="img" aria-label="tooth-sparkle">🦷✨</span>
            </div>
            <div className="timeline-label">{event.date ? new Date(event.date).toLocaleDateString() : "Unknown Date"}</div>
            <div className="timeline-coins">{event.coins} ✨</div>
          </div>
        ))}
      </div>
      <div className="stat-desc">Magical record of every lost tooth</div>
    </div>
  );
}

function BonusStats({ stats }) {
  return (
    <div className="stat-widget stat-bonus">
      <div className="stat-title">Fairy Bonus Stats</div>
      <div className="bonus-stats-row">
        <span className="bonus-icon" role="img" aria-label="Fairiness">
          🧚
        </span>
        <span className="bonus-label">Fairiness Index:</span>
        <span className="bonus-value">{stats.fairiness ?? "..."}/100</span>
      </div>
      <div className="bonus-stats-row">
        <span className="bonus-icon" role="img" aria-label="Enchanted day">
          🌙
        </span>
        <span className="bonus-label">Most Magical Tooth Day:</span>
        <span className="bonus-value">{stats.magicalToothDay}</span>
      </div>
      <div className="bonus-stats-row">
        <span className="bonus-icon" role="img" aria-label="Bonus Wings">
          🦋
        </span>
        <span className="bonus-label">Bonus Wings:</span>
        <span className="bonus-value">{stats.bonusWings ?? "..."}</span>
      </div>
    </div>
  );
}

/**
 * Widget: Magical/Fantasy Quote with GIF, with magical styling and shimmer loading indication
 * - quote: quote text
 * - author: quote author (if available)
 * - gifUrl: url to magical gif (Tenor)
 * - gifAlt: accessibility alt text for gif
 * - loadingQuote, loadingGIF: true during data fetching
 */
function MagicalQuoteWidget({ quote, author, gifUrl, gifAlt, loadingQuote, loadingGIF }) {
  // Magical shimmer placeholder for loading state
  return (
    <div className="stat-widget magic-quote" style={{
      boxShadow: "0 0 22px 2px #ffd70022, 0 0 12px 0 #b47cff22, 0 0 0 5px #fffbeeee",
      border: "2.1px solid #b47cff88",
      animation: "magic-pulse-glow 2.6s infinite alternate"
    }}>
      <div className="stat-title" style={{
        letterSpacing: "1.5px",
        color: "#b47cff",
        textShadow: "0 0 10px #fff7c8cc, 0 2px 8px #ffd6fdcc"
      }}>
        <span role="img" aria-label="wand">🪄</span> Magical Inspiration
      </div>
      <div className="quote-text" style={{
        minHeight: 36,
        fontWeight: 600,
        fontSize: "1.09em",
        filter: loadingQuote ? "blur(2px)" : "none",
        color: loadingQuote ? "#d0afee" : "#8b5cbb"
      }}>
        <span role="img" aria-label="sparkle">✨</span>{" "}
        {loadingQuote
          ? <span className="magic-shimmer" style={{
              background: "linear-gradient(89deg, #ff76e5 30%, #ffd700 80%, #7cebff 120%)",
              height: "1.0em", display: "inline-block", borderRadius: 5, minWidth: 120, opacity: 0.45, marginLeft: 8
            }}>{" "}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          : quote
        }
        {(!loadingQuote && author) && (
          <span className="quote-author" style={{ marginLeft: 9, color: "#b47cff", fontWeight: 400, fontStyle: "italic", fontSize: "0.97em" }}>
            – {author}
          </span>
        )}
      </div>
      <div style={{ marginTop: 8, minHeight: 90 }}>
        {(loadingGIF || !gifUrl) ? (
          <div className="magic-shimmer" style={{
            width: 88, height: 68, background: "linear-gradient(90deg, #ffd70033, #ff76e527, #b47cff27)", borderRadius: 18,
            margin: "0 auto", opacity: 0.30
          }}/>
        ) : (
          <img
            className="quote-gif"
            src={gifUrl}
            alt={gifAlt || "Magical fairy animation"}
            style={{
              width: "86px",
              margin: "0 auto",
              display: "block",
              borderRadius: "18px",
              boxShadow: "0 2px 11px #ffd6fd85, 0 0 20px #b47cff22"
            }}
          />
        )}
      </div>
      <div className="stat-desc" style={{ fontWeight: 400, marginTop: 10, color: "#b47cff" }}>
        Direct from Fairyland’s daily motivation board
      </div>
      {/* Sparkle Animation for magic pulse */}
      <style>
        {`
        @keyframes magic-pulse-glow {
          0% { box-shadow: 0 0 18px 2px #ffd70022, 0 0 10px 0 #b47cff19; }
          100% { box-shadow: 0 0 42px 6px #ffe06655, 0 0 19px #7cebff55; }
        }
        .magic-shimmer {
          animation: shimmer-magic 1.5s infinite alternate linear;
        }
        @keyframes shimmer-magic {
          0% { background-position: -140px; opacity: .16;}
          100% { background-position: 190px; opacity: .38;}
        }
        `}
      </style>
    </div>
  );
}

/**
 * Widget: Fun Fact and Weather, magical styling; shimmer for loading, weather with sparkles.
 */
function FunFactWidget({ fact, weather, loadingFact, loadingWeather }) {
  return (
    <div className="stat-widget fun-fact-weather" style={{ border: "2.2px dotted #7cebffbb", boxShadow: "0 0 18px #b47cff26" }}>
      <div className="stat-title" style={{ color: "#7cebff", letterSpacing: 1.2 }}>🎀 Random Fairy Fact & Weather</div>
      <div className="fun-fact-row" style={{ minHeight: 30 }}>
        <span role="img" aria-label="Factbook">📚</span>
        <span className="fun-fact-label" style={{ color: "#47c3df", fontWeight: 700 }}>Fun Fact:</span>
        {loadingFact ? (
          <span className="magic-shimmer" style={{
            background: "linear-gradient(90deg, #b47cff22, #ffd6fd 85%, #ffd70022)",
            width: 80, display: "inline-block", minHeight: "1em", borderRadius: 4, opacity: 0.28
          }}>&nbsp;</span>
        ) : (
          <span className="fun-fact-value" style={{ color: "#502c87", minWidth: 40 }}>{fact}</span>
        )}
      </div>
      <div className="fun-fact-row" style={{ marginTop: 8, alignItems: "center", minHeight: 24 }}>
        <span role="img" aria-label="Weather">⛅</span>
        <span className="fun-fact-label" style={{ color: "#7cebff", fontWeight: 700 }}>Weather in Fairyland:</span>
        {loadingWeather ? (
          <span className="magic-shimmer" style={{
            background: "linear-gradient(90deg, #7cebff22, #ff76e52a, #ffd70022)",
            width: 46, display: "inline-block", minHeight: "1em", borderRadius: 4, opacity: 0.27
          }}>&nbsp;</span>
        ) : (
          <span className="fun-fact-value" style={{ color: "#502c87" }}>
            <span style={{ filter: "drop-shadow(0 0 6px #7cebff77)" }}>
              {weather?.desc ?? "..."}
            </span>{" "}
            <span style={{ color: "#b47cff", fontWeight: 600 }}>{weather?.temp ?? ""}</span>
            <span aria-label="weather-sparkle" style={{ marginLeft: 3, fontSize: "1.22em" }}> ✨</span>
          </span>
        )}
      </div>
      <style>
        {`
        .magic-shimmer {
          animation: shimmer-magic 1.7s infinite alternate linear;
        }
        `}
      </style>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * FairyStatsPieChart - Magical pie/doughnut chart widget using QuickChart.io images
 * @param {object} props
 *   - coins: number (Sparkle Coin earnings)
 *   - teethLost: number
 *   - age: number
 */
function FairyStatsPieChart({ coins = 0, teethLost = 0, age = 0 }) {
  // Use fairy palette colors, magical gradient bg and sparkly border
  const chartConfig = {
    type: "doughnut",
    data: {
      labels: ["Sparkle Coins", "Teeth Lost", "Fairy Age"],
      datasets: [
        {
          data: [coins, teethLost, age],
          backgroundColor: [
            "#ffd700",
            "#b47cff",
            "#ff76e5"
          ],
          borderColor: [
            "#ffe066",
            "#7cebff",
            "#cbb8f8"
          ],
          borderWidth: 4,
          hoverOffset: 11
        }
      ]
    },
    options: {
      plugins: {
        legend: {
          display: true,
          labels: {
            color: "#b47cff",
            font: { size: 15, family: "Purple Purse, cursive" },
            boxWidth: 22,
            padding: 16
          }
        },
        title: {
          display: false
        }
      },
      cutout: "66%",
      layout: { padding: 12 }
    }
  };
  const bg = "bg=rgba(255,251,227,0.96)";
  const size = "width=210&height=210&devicePixelRatio=1.8";
  const sparkle = "format=png&version=3.0.0";
  const chartUrl =
    `https://quickchart.io/chart?${size}&${bg}&${sparkle}&c=${encodeURIComponent(
      JSON.stringify(chartConfig)
    )}`;

  return (
    <div
      className="stat-widget"
      style={{
        background: "linear-gradient(115deg,#fffbe3 64%,#ffd6fd 100%)",
        border: "2px dotted #ffd700cc",
        minWidth: 200,
        maxWidth: 270,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxShadow: "0 0 19px #ffd70069, 0 0 7px #b47cff88",
        marginBottom: 0,
        position: "relative",
        zIndex: 3,
        overflow: "visible"
      }}
    >
      <div className="stat-title" style={{
        fontSize: "1.02em",
        color: "#b47cff",
        marginBottom: 7,
        letterSpacing: 1.1,
        textShadow: "0 2px 8px #ffd70070"
      }}>
        Fairy Stats Breakdown
        <span aria-hidden="true" style={{ marginLeft: 7, fontSize: 21, verticalAlign: "middle", filter: "drop-shadow(0 0 7px #b47cffee)" }}>✨</span>
      </div>
      <img
        src={chartUrl}
        alt="Magical Fairy Stats Pie Chart"
        width={184}
        height={184}
        style={{
          width: "82%",
          maxWidth: 184,
          minHeight: 114,
          margin: "0 auto",
          display: "block",
          borderRadius: "50%",
          boxShadow: "0 3px 21px #ffd70036, 0 0 16px #ff76e590, 0 1px 5px #b47cff39",
          background: "#fffbe9",
          border: "2.1px solid #ff76e5bb",
          filter: "drop-shadow(0 0 15px #ffd6fd57)"
        }}
      />
      <div style={{
        color: "#b47cff",
        marginTop: 6,
        fontSize: "0.97em",
        fontWeight: 500,
        textAlign: "center"
      }}>
        Total Coins, Teeth Lost, and Magical Age
      </div>
      <style>
        {`
        @media (max-width: 420px) {
          .stat-widget img { max-width: 98vw; }
        }
        `}
      </style>
      {/* Decorative SVG sparkle */}
      <svg aria-hidden="true" width="27" height="27" style={{ position: "absolute", left: -12, top: 8, opacity: 0.81 }}>
        <polygon points="14,3 17,12 25,13 17,17 20,24 14,19 8,24 11,17 3,13 11,12" fill="#ff76e5" />
      </svg>
    </div>
  );
}

export default LedgerDashboard;
