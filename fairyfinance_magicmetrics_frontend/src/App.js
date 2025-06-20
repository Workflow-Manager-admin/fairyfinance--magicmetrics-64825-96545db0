import React, { useState } from 'react';
import './App.css';
import FairyInputForms from './FairyInputForms';
import './FairyInputForms.css';
import LedgerDashboard from "./LedgerDashboard";
import './LedgerDashboard.css';
import FairyAnimation from "./FairyAnimation";
import FairyWisdomQuote from "./FairyWisdomQuote";
import FairyCatWidget from "./FairyCatWidget";

/**
 * Sparkle animation overlay SVG
 */
function SparkleStars() {
  // Decorative, non-interactive, ARIA-hidden
  return (
    <svg
      className="sparkle-stars"
      aria-hidden="true"
      width="0"
      height="0"
      style={{ position: 'absolute', zIndex: 0 }}
    >
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2" result="b"/>
        <feMerge>
          <feMergeNode in="b"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <symbol id="star" viewBox="0 0 24 24">
        <polygon
          points="12,1 15,10 24,10 17,15 19,24 12,19 5,24 7,15 0,10 9,10"
          fill="#ffd700"
          filter="url(#glow)"
        />
      </symbol>
    </svg>
  );
}

/**
 * PUBLIC_INTERFACE
 * ToothFairy Ledger main component.
 */
function App() {
  // State to track ledger input data and dashboard display
  const [ledgerInput, setLedgerInput] = useState(null);
  const [showDashboard, setShowDashboard] = useState(false);

  const handleFormSubmit = (inputData) => {
    setLedgerInput(inputData);
    setShowDashboard(true);
    // You could trigger magical sprinkles here!
  };

  return (
    <div className="app">
      {/* Magic fairy flying animation across header */}
      <FairyAnimation />
      {/* Magical floating decorative border */}
      <div style={{
        position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
        pointerEvents: "none", zIndex: 0, overflow: "hidden"
      }}>
        {/* Top corner swirl sparkle */}
        <svg width="130" height="84" style={{ position: "absolute", top: 0, left: 0, opacity: .8 }}>
          <ellipse cx="90" cy="44" rx="40" ry="18" fill="#ffd70060">
            <animate attributeName="rx" from="36" to="48" dur="4s" repeatCount="indefinite" direction="alternate"/>
          </ellipse>
          <circle cx="38" cy="36" r="10" fill="url(#grad1)" opacity="0.7"/>
          <g>
            <circle cx="45" cy="18" r="2.5" fill="#ff76e5"/>
            <circle cx="77" cy="7" r="2" fill="#b47cff"/>
            <circle cx="13" cy="66" r="1.5" fill="#7cebff"/>
          </g>
          <defs>
            <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fff7c8"/>
              <stop offset="100%" stopColor="#b47cff"/>
            </linearGradient>
          </defs>
        </svg>
        {/* Floating sparkle stars */}
        <SparkleStars />
      </div>
      <nav className="navbar">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div className="logo" style={{ position: "relative" }}>
              <span className="logo-symbol">*</span> ToothFairy Ledger
            </div>
            <button className="btn sparkle-btn">
              <span role="img" aria-label="wand" style={{ marginRight: 6 }}>🪄</span>
              Magic Entry
            </button>
          </div>
        </div>
      </nav>

      <main style={{ zIndex: 2, position: "relative" }}>
        <div className="container">
          <div className="hero">
            {/* Fairy Cat Widget - Whimsical sparkly Cataas cat! */}
            <FairyCatWidget />
            {/* Magical Fairy Wisdom Quote Widget */}
            <FairyWisdomQuote />
            <div className="subtitle">
              Whimsical Wizardry for Enchanted Accounting & Dreamy Metric Reports
            </div>
            <h1 className="title">ToothFairy Ledger</h1>
            <div className="description">
              Dive into a world of sparkle! Track teeth, coins, dreams, and all things magical—experience Fairyland’s most mystical ledger and enchanted reporting dashboard, straight from the Tooth Fairy’s personal collection.✨
            </div>
            <button className="btn btn-large">
              <span role="img" aria-label="fairy">🧚‍♀️</span> Begin the Magic
            </button>
          </div>
          {/* Magical, sparkling input forms for age, lost teeth, and dates */}
          {!showDashboard && (
            <FairyInputForms onSubmit={handleFormSubmit} />
          )}
          {/* Magical stat dashboard appears after submission */}
          {showDashboard && (
            <LedgerDashboard ledgerInput={ledgerInput} />
          )}
        </div>
      </main>

      {/* Decorative bottom-left swirls */}
      <div style={{
        position:"fixed", bottom:0, left:0, zIndex:1, pointerEvents:"none", width: "260px", height: "140px" }}>
        <svg width="260" height="140">
          <ellipse cx="160" cy="110" rx="85" ry="22" fill="#ffd6fd60" />
          <circle cx="90" cy="85" r="16" fill="#b47cff61" />
          <circle cx="55" cy="123" r="7" fill="#7cebff" />
          <circle cx="225" cy="106" r="5" fill="#ffd700" />
          <circle cx="37" cy="124" r="3.5" fill="#ff76e5" />
        </svg>
      </div>
    </div>
  );
}

export default App;