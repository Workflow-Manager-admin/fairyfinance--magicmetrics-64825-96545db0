import React, { useState, useRef, useEffect } from "react";
import "./App.css";

/*
  PUBLIC_INTERFACE
  ToothFairyChatbot: Magical Tooth Fairy chat widget!
  - Whimsical floating chat bubble in fairy shapes/colors.
  - Conversational, maintains chat history in state.
  - User can "Talk to the Tooth Fairy" about teeth, and receives magical, friendly, rule-based responses.
*/

// Core magical fairy responses for common kid questions about teeth.
const fairyResponses = [
  {
    test: input => /lost|came out|fell out/.test(input),
    reply: [
      "✨ Flutter flutter! Congratulations on losing a tooth! Place it safely under your pillow tonight for a visit from me—fairy hugs!",
      "How magical—a new tooth on its way to the fairy castle! Sleep tight and dream of sparkles! ✨"
    ]
  },
  {
    test: input => /how much|money|coin|gold/.test(input),
    reply: [
      "The amount of fairy gold left depends on your tooth's sparkle! Fairy coins are given with extra magic for bravery and smiles. 🪙✨",
      "Some nights are extra magical and some teeth are extra shiny—every visit is a surprise! 🌈"
    ]
  },
  {
    test: input => /pain|hurt|scared|afraid/.test(input),
    reply: [
      "Oh, brave one! Fairy magic makes tooth-losing easier. Be gentle, and remember: you'll get fairy treasure for your courage! 🦷💜",
      "Feeling a little scared is okay, but fairies watch over you! Soon you’ll have a grown-up smile. 🌟"
    ]
  },
  {
    test: input => /where.*tooth|what.*do.*with.*tooth/.test(input),
    reply: [
      "I collect teeth to build sparkling castles in fairyland—your tooth will shine forever in our palace! 🏰✨",
      "Tooth Fairy secret: Each tooth becomes a magic star in fairyland's sky! 🌟"
    ]
  },
  {
    test: input => /hello|hi|hey|who are you|hi fairy|hello fairy/.test(input),
    reply: [
      "Hello, little dreamer! I'm your Tooth Fairy friend—here to answer your sparkling questions!",
      "Hi there! Fairy wings flutter when you chat with me. What magic would you like to know?"
    ]
  },
  {
    test: input => /old.*enough|when.*lose/.test(input),
    reply: [
      "Most children lose their first tooth around age 6, but fairy magic can make it happen sooner or later too! 🌙",
      "Whenever your tooth is ready to wiggle free, I’ll be ready with a sprinkle of fairy dust. ✨"
    ]
  },
  {
    test: () => true, // Catch-all for anything else
    reply: [
      "Every question is a sprinkle of curiosity! Fairy wings are always near. Ask me anything about the magic of teeth!",
      "That's a sparkly question! The fairy world is full of surprises—just like you!"
    ]
  }
];

// Helper to pick a response for the matched rule
function getFairyReply(userText) {
  const cleanInput = (userText || "").toLowerCase().trim();
  const found = fairyResponses.find(rule => rule.test(cleanInput));
  if (found) {
    const msgs = found.reply;
    return msgs[Math.floor(Math.random() * msgs.length)];
  }
  return "The Fairy magic seems confused! Try asking in a different way. 🧚";
}

// Chatbot magic theme constants
const chatBubbleColors = {
  fairyPink: "var(--magic-pink, #f2d1fa)",
  fairyBlue: "var(--magic-blue, #a1fdff)",
  fairyAccent: "var(--magic-accent, #bb5dfe)",
  fairyYellow: "var(--magic-gold, #ffe9a8)",
  fairyViolet: "var(--magic-violet, #d7b5fd)",
};

const defaultPromptMsg =
  "Want to know about your tooth? Ask the Tooth Fairy anything!";

function ToothFairyChatbot() {
  // State: open/closed, chat history, input, error.
  const [isOpen, setIsOpen] = useState(false);
  const [chat, setChat] = useState([
    {
      from: "fairy",
      text: "Welcome, little one! 🧚\u200d♀️\nI'm the Tooth Fairy—ask me anything about teeth, coins, or fairyland!",
      ts: Date.now()
    }
  ]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef(null);
  const scrollRef = useRef(null);

  // Scroll to bottom on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chat, isOpen]);

  // Handle sending a message
  function handleSend(e) {
    e && e.preventDefault();
    setError("");
    const question = input.trim();
    if (!question) {
      setError("Type your question before sending!");
      return;
    }
    // Add user message
    setChat(ch =>
      [...ch, { from: "user", text: question, ts: Date.now() }]
    );
    setInput("");
    // Respond with magical answer (simulate fairy delay)
    setTimeout(() => {
      try {
        const answer = getFairyReply(question);
        setChat(ch =>
          [...ch, { from: "fairy", text: answer, ts: Date.now() }]
        );
      } catch (err) {
        setChat(ch =>
          [...ch, { from: "fairy", text: "Oops! The fairy lost her train of thought. Try again!", ts: Date.now() }]
        );
      }
    }, 900 + Math.random() * 750);
  }

  // Allow Enter to send, Shift+Enter for newline.
  function handleInputKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  // Magic: close on esc key
  useEffect(() => {
    function escClose(e) {
      if (isOpen && e.key === "Escape") setIsOpen(false);
    }
    window.addEventListener("keydown", escClose);
    return () => window.removeEventListener("keydown", escClose);
  }, [isOpen]);

  // --- UI: Collapsed chat bubble ---
  if (!isOpen) {
    return (
      <button
        aria-label="Open Tooth Fairy Chatbot"
        style={{
          position: "fixed",
          bottom: "29px",
          right: "32px",
          zIndex: 1200,
          background: `radial-gradient(circle at 40% 40%, ${chatBubbleColors.fairyPink} 78%, ${chatBubbleColors.fairyBlue} 100%)`,
          border: `3px solid ${chatBubbleColors.fairyAccent}`,
          borderRadius: "50% 44% 54% 49%/47% 58% 47% 54%",
          boxShadow: `0 8px 29px -7px ${chatBubbleColors.fairyViolet}`,
          width: "68px",
          height: "68px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "2.4em",
          transition: "box-shadow 0.23s"
        }}
        title="Talk to the Tooth Fairy!"
        onClick={() => setIsOpen(true)}
      >
        <span role="img" aria-label="Fairy">🧚‍♀️</span>
        <span
          style={{
            position: "absolute",
            bottom: "4px",
            left: "10px",
            fontSize: "0.77em",
            color: chatBubbleColors.fairyAccent,
            fontFamily: "'Snell Roundhand', cursive",
            fontWeight: 600,
            textShadow: "0 0 7px #fffbe0bb"
          }}
        >
          Chat
        </span>
      </button>
    );
  }

  // --- UI: Expanded magical chat window ---
  return (
    <div
      className="toothfairy-chatbot"
      style={{
        position: "fixed",
        bottom: "32px",
        right: "32px",
        width: "330px",
        maxWidth: "96vw",
        zIndex: 2000,
        display: "flex",
        flexDirection: "column",
        boxShadow: `0 8px 39px -7px ${chatBubbleColors.fairyAccent}, 0 0 0 3px #fffbe944`,
        borderRadius: "26px 46px 30px 13px/42px 33px 32px 17px",
        background: `linear-gradient(118deg, ${chatBubbleColors.fairyPink} 73%, ${chatBubbleColors.fairyBlue} 120%)`,
        border: `2px solid ${chatBubbleColors.fairyAccent}`,
        overflow: "hidden",
        fontFamily: "'Snell Roundhand', 'Inter', cursive, sans-serif",
        minHeight: "360px"
      }}
      aria-label="Tooth Fairy Chatbot"
    >
      {/* Header */}
      <div
        style={{
          background: `linear-gradient(121deg,${chatBubbleColors.fairyViolet}55 33%,white 130%)`,
          padding: "16px 19px 11px 19px",
          borderBottom: `2px dashed ${chatBubbleColors.fairyAccent}`,
          fontSize: "1.23em",
          fontWeight: "700",
          color: chatBubbleColors.fairyAccent,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          letterSpacing: ".02em"
        }}
      >
        <span>
          🦷 <span style={{
            color: chatBubbleColors.fairyAccent,
            fontFamily: "'Snell Roundhand', cursive",
            fontWeight: 700
          }}>Talk to the Tooth Fairy!</span>
        </span>
        <button
          aria-label="Close chat"
          onClick={() => setIsOpen(false)}
          style={{
            background: "transparent",
            border: "none",
            color: chatBubbleColors.fairyViolet,
            fontSize: "1.44em",
            cursor: "pointer",
            fontWeight: 700
          }}
          title="Close"
        >✕</button>
      </div>
      {/* Chat history */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          padding: "18px 13px",
          background: `linear-gradient(101deg,#fffbe7 80%,${chatBubbleColors.fairyBlue}22 150%)`,
          overflowY: "auto",
          minHeight: "160px",
          maxHeight: "240px"
        }}
      >
        {chat.map((msg, idx) => (
          <div
            key={idx}
            style={{
              margin: "0.6em 0",
              display: "flex",
              flexDirection: msg.from === "user" ? "row-reverse" : "row",
              alignItems: "flex-end"
            }}
          >
            <div
              style={{
                background:
                  msg.from === "fairy"
                    ? `linear-gradient(123deg, ${chatBubbleColors.fairyViolet}44 90%, #f2d1fa88 100%)`
                    : `linear-gradient(119deg, #fffbe0 70%, #bb5dfe22 100%)`,
                color: msg.from === "fairy" ? chatBubbleColors.fairyAccent : "#6534ae",
                borderRadius:
                  msg.from === "fairy"
                    ? "16px 29px 12px 22px/20px 24px 12px 18px"
                    : "22px 12px 22px 14px/20px 24px 22px 17px",
                maxWidth: "82%",
                padding: "12px 15px 8px 15px",
                marginLeft: msg.from === "fairy" ? 0 : "18%",
                marginRight: msg.from === "user" ? 0 : "18%",
                boxShadow:
                  msg.from === "fairy"
                    ? "0 2px 10px #beecff23"
                    : "0 2px 10px #ffe3fc13",
                fontStyle: msg.from === "fairy" ? "italic" : "normal",
                fontWeight: msg.from === "fairy" ? 500 : 600,
                fontFamily: "'Snell Roundhand', cursive"
              }}
            >
              {msg.from === "fairy" && (
                <span role="img" aria-label="Fairy" style={{ marginRight: 6 }}>
                  🧚‍♀️
                </span>
              )}
              <span style={{ whiteSpace: "pre-wrap" }}>{msg.text}</span>
            </div>
          </div>
        ))}
        {chat.length === 1 && (
          <div style={{
            color: chatBubbleColors.fairyAccent,
            margin: "1.2em 0 0.2em 0",
            textAlign: "center",
            fontSize: "0.97em"
          }}>
            {defaultPromptMsg}
          </div>
        )}
      </div>
      {/* Input bar */}
      <form
        onSubmit={handleSend}
        style={{
          background: "#fff9fc",
          padding: "9px 12px",
          display: "flex",
          borderTop: `1.8px dashed ${chatBubbleColors.fairyAccent}`,
          alignItems: "flex-end",
          gap: "0.7em"
        }}
      >
        <textarea
          ref={inputRef}
          aria-label="Type your message to the Tooth Fairy"
          value={input}
          rows={1}
          onChange={e => { setInput(e.target.value); if (error) setError(""); }}
          onKeyDown={handleInputKey}
          placeholder="Type your magical message..."
          spellCheck={true}
          style={{
            flex: 1,
            minHeight: "28px",
            maxHeight: "58px",
            borderRadius: "12px",
            border: `1.3px solid ${chatBubbleColors.fairyAccent}`,
            resize: "none",
            fontFamily: "'Snell Roundhand', 'Inter', cursive",
            padding: "8px 11px",
            fontSize: "1.01em",
            boxShadow: error ? "0 2px 8px #ffbdda77" : "none",
            background: "#fff",
            color: "#8236c5"
          }}
        />
        <button
          type="submit"
          aria-label="Send"
          title="Send"
          style={{
            background: `linear-gradient(120deg, ${chatBubbleColors.fairyBlue} 40%, ${chatBubbleColors.fairyAccent} 100%)`,
            color: "#fff",
            fontWeight: "600",
            border: "none",
            borderRadius: "29px 12px 19px 29px/14px 17px 29px 13px",
            padding: "10px 18px",
            fontSize: "1.4em",
            cursor: input.trim() ? "pointer" : "not-allowed",
            boxShadow: "0 2px 18px 0 #bb5dfe19, 0 0px 3.5px #ffe7e7"
          }}
          disabled={!input.trim()}
        >
          <span role="img" aria-label="Magic sparkle" style={{ marginRight: 3 }}>✨</span>
          Send
        </button>
      </form>
      {error && (
        <div
          style={{
            color: "#c72090",
            background: "#fff3fc",
            fontWeight: "600",
            textAlign: "center",
            fontSize: "0.99em",
            padding: "4px",
            borderTop: "1px solid #fcc9fd",
            borderBottomLeftRadius: "9px",
            borderBottomRightRadius: "9px"
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}

export default ToothFairyChatbot;
