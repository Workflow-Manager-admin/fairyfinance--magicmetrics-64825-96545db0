import React, { useState, useEffect } from "react";
import "./LedgerDashboard.css";

// PUBLIC_INTERFACE
// Main magical dashboard for Tooth Fairy Ledger stat displays and widgets.
function LedgerDashboard({ ledgerInput }) {
  // Simulate computations - in the real app, these would process input/ledger data.
  const [sparkleEarnings, setSparkleEarnings] = useState(0);
  const [auditNote, setAuditNote] = useState("");
  const [economyTrend, setEconomyTrend] = useState([]);
  const [toothTimeline, setToothTimeline] = useState([]);
  const [bonusStats, setBonusStats] = useState({});
  const [magicalQuote, setMagicalQuote] = useState("");
  const [magicalGIF, setMagicalGIF] = useState("");
  const [funFact, setFunFact] = useState("");
  const [weather, setWeather] = useState({});

  // Dummy magic computation for now.
  useEffect(() => {
    if (!ledgerInput) return;

    // Simulated Sparkle Coin value: 10 per lost tooth + minor fairy inflation by age
    const coins = Number(ledgerInput.teethLost || 0) * 10 + (Number(ledgerInput.age || 0) * 1.3);
    setSparkleEarnings(coins);

    // Simple fairy audit note for demo.
    setAuditNote(
      coins > 100
        ? "🌟 Exceptional tooth collecting! Fairy Board congratulates your Sparkle initiative."
        : "✨ Keep twinkling! More teeth, more magic. The Fairy Board is watching your progress closely."
    );

    // Economy trends: random walk chart for demo (should analyze real data)
    setEconomyTrend(
      Array.from({ length: 12 }).map((_, idx) => Math.round(coins * (0.7 + 0.09 * Math.sin(idx) + Math.random() * 0.15)))
    );

    // Tooth timeline: Visualize each tooth, using provided dates if available
    setToothTimeline(
      (ledgerInput.toothDates || []).map((d, i) => ({
        date: d,
        coins: 10,
        idx: i + 1,
      }))
    );

    // Bonus: Fairiness index, Most enchanted day, etc.
    setBonusStats({
      fairiness: Math.min(100, Math.round(70 + (ledgerInput.teethLost || 0) * 2 + Math.random() * 18)),
      magicalToothDay:
        (ledgerInput.toothDates && ledgerInput.toothDates.length)
          ? ledgerInput.toothDates[Math.floor(Math.random() * ledgerInput.toothDates.length)]
          : "A magical full moon night 🌕",
      bonusWings: Math.round((ledgerInput.age || 0) / 4) + (ledgerInput.teethLost ? Math.floor(ledgerInput.teethLost / 3) : 0),
    });
  }, [ledgerInput]);

  // Magical quote (public API)
  useEffect(() => {
    fetch("https://api.quotable.io/random")
      .then((r) => r.json())
      .then((data) => setMagicalQuote(data.content))
      .catch(() => setMagicalQuote("Magic is believing in yourself. If you can do that, you can make anything happen."));
  }, []);

  // Magical GIF (public API)
  useEffect(() => {
    fetch(
      `https://g.tenor.com/v1/search?q=fairy+magic&key=LIVDSRZULELA&limit=10`
    )
      .then((r) => r.json())
      .then((data) => {
        if (data.results && data.results.length > 0) {
          const idx = Math.floor(Math.random() * data.results.length);
          setMagicalGIF(data.results[idx].media[0]?.gif?.url);
        }
      });
  }, []);

  // Fun fact (public API)
  useEffect(() => {
    fetch("https://uselessfacts.jsph.pl/random.json?language=en")
      .then((r) => r.json())
      .then((data) => setFunFact(data.text));
  }, []);

  // Weather widget (public API, set to "Fairyland")
  useEffect(() => {
    fetch(
      "https://wttr.in/Fairyland?format=%C,%t"
    )
      .then(r => r.text())
      .then(t => {
        const [desc, temp] = t.split(",");
        setWeather({ desc, temp });
      });
  }, []);

  return (
    <div className="ledger-dashboard-container">
      <div className="ledger-widgets-row">
        <SparkleCoinEarnings amount={sparkleEarnings} />
        <FairyAuditNote note={auditNote} />
      </div>
      <div className="ledger-widgets-row">
        <EconomyTrendChart data={economyTrend} />
        <ToothTimelineChart timeline={toothTimeline} />
      </div>
      <div className="ledger-widgets-row">
        <BonusStats stats={bonusStats} />
        <MagicalQuoteWidget quote={magicalQuote} gifUrl={magicalGIF} />
        <FunFactWidget fact={funFact} weather={weather} />
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

function EconomyTrendChart({ data }) {
  // Magical line chart (SVG, no external deps)
  const maxVal = Math.max(...data, 18);
  const minVal = Math.min(...data, 0);
  const norm = val => 82 - ((val - minVal) / (maxVal - minVal || 1)) * 54;
  return (
    <div className="stat-widget stat-economy-chart">
      <div className="stat-title">Magical Economy Trends</div>
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

function MagicalQuoteWidget({ quote, gifUrl }) {
  return (
    <div className="stat-widget magic-quote">
      <div className="stat-title">Magical Inspiration</div>
      <div className="quote-text"><span role="img" aria-label="sparkle">✨</span> {quote}</div>
      {gifUrl && (
        <img
          className="quote-gif"
          src={gifUrl}
          alt="Magical fairy animation"
          style={{
            width: "86px",
            margin: "12px auto 0 auto",
            display: "block",
            borderRadius: "18px",
            boxShadow: "0 2px 11px #ffd6fd85"
          }}
        />
      )}
      <div className="stat-desc">Direct from Fairyland’s daily motivation board</div>
    </div>
  );
}

function FunFactWidget({ fact, weather }) {
  return (
    <div className="stat-widget fun-fact-weather">
      <div className="stat-title">Random Fairy Fact & Weather</div>
      <div className="fun-fact-row">
        <span role="img" aria-label="Factbook">📚</span>
        <span className="fun-fact-label">Fun Fact:</span>
        <span className="fun-fact-value">{fact}</span>
      </div>
      <div className="fun-fact-row" style={{ marginTop: 6 }}>
        <span role="img" aria-label="Weather">⛅</span>
        <span className="fun-fact-label">Weather in Fairyland:</span>
        <span className="fun-fact-value">{weather?.desc ?? "..."} {weather?.temp ?? ""}</span>
      </div>
    </div>
  );
}

export default LedgerDashboard;
