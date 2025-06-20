import React, { useState, useRef, useEffect } from "react";
import "./App.css";

/*
  PUBLIC_INTERFACE
  ToothFairyChatbot: Magical Tooth Fairy chat widget with real OpenAI chat!
  - Whimsical floating chat bubble.
  - Uses OpenAI API (ChatGPT) for live, authentic fairy conversations.
  - Prompts the user for an API Key on first use (never stored in code). 
  - Warn users/devs: **Never commit API keys to version control - keep them private!**
  - Chat and API key are stored in sessionStorage for reload-safe use (not in source files).
  - Handles loading and error states with magical UI. Friendly error if key invalid.
  - Fallbacks to local scripted logic if API fails, so kids never get a blank answer.
  -------------------------------------------------------------------------------
  WARNING: NEVER HARD-CODE OR COMMIT YOUR OPENAI API KEY TO GIT OR VERSION CONTROL!
  -------------------------------------------------------------------------------
     Always prompt users for the key in secure UI, do not embed or save in code.
*/

/*
  --- Config ---

  PUBLIC_INTERFACE

  The chat completion endpoint is now set to Hugging Face's free Inference API.
  We use the conversational model 'microsoft/DialoGPT-medium' as default, which is public (no API key needed for low-rate, non-commercial usage at:
  https://huggingface.co/microsoft/DialoGPT-medium).

  To use your own (other) model, or to add an API key/bearer token:
    1. Change HF_API_URL below to a different Hugging Face Inference endpoint or your own endpoint.
    2. If credentials are ever required, add an 'Authorization' header to the fetch options as:
          headers: {
            ...,
            'Authorization': `Bearer YOUR_HF_API_KEY`
          }
    3. You may also change the model name (e.g., 'facebook/blenderbot-400M-distill') for a different style/personality.

  Note: Free usage is subject to public limits and can sometimes be slow/rate-limited (HTTP 429/503).
        Errors during fetch (rate-limits, service unavailable, other failures) are gracefully handled below.
*/

const HF_API_URL = "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium";
// Optionally change to another public conversational model from HF, e.g.
// const HF_API_URL = "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill";
// Or, for paid/API-key: add Bearer Authorization header (see comments above)

const chatBubbleColors = {
  fairyPink: "var(--magic-pink, #f2d1fa)",
  fairyBlue: "var(--magic-blue, #a1fdff)",
  fairyAccent: "var(--magic-accent, #bb5dfe)",
  fairyYellow: "var(--magic-gold, #ffe9a8)",
  fairyViolet: "var(--magic-violet, #d7b5fd)",
};

const defaultPromptMsg =
  "Ask anything about your tooth, coins, or fairyland! (Powered by magical AI ✨)";

/*
  Safely persist chat for user session (never in file or on server).
*/
function getSessionChat() {
  try {
    let raw = sessionStorage.getItem("tfairy-chatbot");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
function saveSessionChat(chat) {
  try {
    sessionStorage.setItem("tfairy-chatbot", JSON.stringify({ chat }));
  } catch {
    // ignore
  }
}

// Fallback logic: returns a cute scripted answer if AI fails or no key
function fallbackFairyReply(userText) {
  const rules = [
    {
      test: (t) => /lost|came out|fell out/.test(t),
      reply: [
        "✨ Flutter flutter! Well done on losing a tooth! Put it under your pillow for fairy fun tonight!",
        "How magical—a shiny new tooth for the fairy castle! Dream big and sleep well! ✨",
      ],
    },
    {
      test: (t) => /how much|money|coin|gold/.test(t),
      reply: [
        "The amount of fairy gold depends on your tooth's sparkle! Bravery gets bonus coins. 🪙✨",
        "Sometimes you get extra for a super shiny tooth—surprises are fairy magic! 🌈",
      ],
    },
    {
      test: (t) => /hello|hi|hey|who are you|hi fairy|hello fairy/.test(t),
      reply: [
        "Hello, dreamer! I'm your Tooth Fairy friend—what magic teethy question do you have?",
        "Hi there! Fairy wings flutter when you chat with me—ask away!",
      ],
    },
    {
      test: (t) => /pain|hurt|scared|afraid/.test(t),
      reply: [
        "Oh, brave one! Losing a tooth is magical. Fairy dust makes it easy. You'll get treasure for your bravery! 🦷💜",
        "It's okay to feel a bit scared—fairies watch over you! Soon you'll have a grown-up smile! 🌟",
      ],
    },
    {
      test: () => true,
      reply: [
        "Every question is a sprinkle of curiosity! Fairy wings are always near—ask anything about teeth magic!",
        "That's a sparkly question! Fairyland is full of surprises—just like you!",
      ],
    },
  ];
  const clean = (userText || "").toLowerCase().trim();
  const rule = rules.find((r) => r.test(clean));
  if (rule) {
    const msgs = rule.reply;
    return msgs[Math.floor(Math.random() * msgs.length)];
  }
  return "The fairy magic feels confused! Try rewording your question. 🧚";
}

function ToothFairyChatbot() {
  // Chat state & session persistence
  const session = getSessionChat();
  const [isOpen, setIsOpen] = useState(false);
  const [chat, setChat] = useState(
    session?.chat || [
      {
        from: "fairy",
        text: "Welcome, little one! 🧚‍♀️\nI'm the Tooth Fairy—ask me anything about teeth, coins, or fairyland!",
        ts: Date.now(),
      },
    ]
  );
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // ---- All hooks unconditionally before ANY return ----
  useEffect(() => {
    saveSessionChat(chat);
  }, [chat]);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chat, isOpen, loading]);
  useEffect(() => {
    function escClose(e) {
      if (isOpen && e.key === "Escape") setIsOpen(false);
    }
    window.addEventListener("keydown", escClose);
    return () => window.removeEventListener("keydown", escClose);
  }, [isOpen]);
  // ----------------------------------------------------

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
          transition: "box-shadow 0.23s",
        }}
        title="Talk to the Tooth Fairy!"
        onClick={() => setIsOpen(true)}
      >
        <span role="img" aria-label="Fairy">
          🧚‍♀️
        </span>
        <span
          style={{
            position: "absolute",
            bottom: "4px",
            left: "10px",
            fontSize: "0.77em",
            color: chatBubbleColors.fairyAccent,
            fontFamily: "'Snell Roundhand', cursive",
            fontWeight: 600,
            textShadow: "0 0 7px #fffbe0bb",
          }}
        >
          Chat
        </span>
      </button>
    );
  }

  // --- Helper: Send message to Hugging Face Conversational API ---
  // PUBLIC_INTERFACE
  /*
    Sends a user question & conversation history to Hugging Face Inference API (public conversational model).

    Returns the fairy's reply as a string.
    Gracefully handles common errors: rate limited, service down, API failures—fallbacks to fairy logic if needed.

    To change endpoint/model or to use credentials:
      - Edit the HF_API_URL and add 'Authorization' header as shown above if credentials/token needed.
      - For other models, see https://huggingface.co/models?pipeline_tag=conversational
  */
  async function sendToHuggingFace(userText, priorChat) {
    // Hugging Face expects past_user_inputs and generated_responses in order.
    const priorUser = priorChat.filter((m) => m.from === "user").map((m) => m.text);
    const priorFairy = priorChat.filter((m) => m.from === "fairy").map((m) => m.text);
    const payload = {
      inputs: {
        past_user_inputs: priorUser,
        generated_responses: priorFairy,
        text: userText,
      }
    };
    let controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 18000); // 18s safety
    try {
      const resp = await fetch(HF_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // If you use a paid Hugging Face Inference endpoint, add Authorization here.
          // 'Authorization': 'Bearer YOUR_HF_TOKEN'
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (resp.status === 429 || resp.status === 503) {
        throw new Error(
          "Too many requests — the fairy API is resting! Please wait a moment and try again."
        );
      }
      if (!resp.ok) {
        // Try to give user a better message for other HTTP errors
        let msg = "Public AI chat service is currently unavailable.";
        let errJson = null;
        try { errJson = await resp.json(); } catch {}
        if (errJson && errJson.error) msg = errJson.error;
        throw new Error(msg);
      }
      const data = await resp.json();
      // The reply will be in data.generated_text or data[0].generated_text (for batch)
      let fairy =
        data?.generated_text ||
        (Array.isArray(data) && data[0]?.generated_text) ||
        fallbackFairyReply(userText);
      // Sometimes HF models respond too generically or blank
      if (!fairy || fairy.trim().length < 2) {
        fairy = fallbackFairyReply(userText);
      }
      return fairy;
    } catch (err) {
      clearTimeout(timeout);
      if (err.name === "AbortError") {
        throw new Error(
          "Network timeout — the fairy API did not reply in time! Try again."
        );
      }
      throw err;
    }
  }

  // -- (removed: API Key Prompt UI block, not required for Hugging Face free endpoint) --

  // --- Actual Chat Send Handler ---
  async function handleSend(e) {
    e && e.preventDefault();
    setError("");
    if (!input.trim()) {
      setError("Type your question before sending!");
      return;
    }
    try {
      // Show user question immediately
      const question = input.trim();
      setChat((prev) => [
        ...prev,
        { from: "user", text: question, ts: Date.now() },
      ]);
      setInput("");
      setLoading(true);

      // Send to Hugging Face conversational AI
      const prior = [...chat.filter((m) => m.from)];
      let fairyReply = "";
      try {
        fairyReply = await sendToHuggingFace(question, prior);
      } catch (err) {
        setError(
          "Fairy AI error: " +
            (err?.message ||
              "Could not fetch a fairy answer this time. The service might be down or rate-limited.")
        );
        fairyReply = fallbackFairyReply(question);
      }
      setChat((prev) => [
        ...prev,
        { from: "fairy", text: fairyReply, ts: Date.now() },
      ]);
    } catch (ex) {
      setError("Oops! Fairy lost her train of thought...");
    } finally {
      setLoading(false);
    }
  }

  // Allow Enter to send, Shift+Enter for newline.
  function handleInputKey(e) {
    if (e.key === "Enter" && !e.shiftKey && !loading) {
      e.preventDefault();
      handleSend();
    }
  }

  // --- UI: Expanded magical chat window ---
  return (
    <div
      className="toothfairy-chatbot"
      style={{
        position: "fixed",
        bottom: "32px",
        right: "32px",
        width: "340px",
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
        minHeight: "410px",
      }}
      aria-label="Tooth Fairy Chatbot"
    >
      {/* Prominent Dev Warning (never commit key!!) */}
      <div
        style={{
          background: "#fff3ed",
          color: "#ff3366",
          fontWeight: 700,
          fontSize: "0.96em",
          fontFamily: "monospace",
          borderBottom: `1.2px dashed #d9a2f7`,
          padding: "2px 10px",
        }}
      >
        {/* THIS IS A DEV WARNING!! */}
        {/* NEVER COMMIT YOUR API KEY TO GIT OR CODE. */}
        {/* API keys should be private and injected securely. */}
        <span role="img" aria-label="Caution" style={{ marginRight: 4 }}>
          ⚠️
        </span>
        <strong>Never commit API keys to version control!</strong>
      </div>
      {/* Header */}
      <div
        style={{
          background: `linear-gradient(121deg,${chatBubbleColors.fairyViolet}55 33%,white 130%)`,
          padding: "14px 15px 10px 18px",
          borderBottom: `2px dashed ${chatBubbleColors.fairyAccent}`,
          fontSize: "1.18em",
          fontWeight: "700",
          color: chatBubbleColors.fairyAccent,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          letterSpacing: ".02em",
        }}
      >
        <span>
          🦷{" "}
          <span
            style={{
              color: chatBubbleColors.fairyAccent,
              fontFamily: "'Snell Roundhand', cursive",
              fontWeight: 700,
            }}
          >
            Tooth Fairy Chat
          </span>
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
            fontWeight: 700,
          }}
          title="Close"
        >
          ✕
        </button>
      </div>
      {/* Chat history, input bar, and error messages */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          padding: "16px 12px 0 13px",
          background: `linear-gradient(101deg,#fffbe7 80%,${chatBubbleColors.fairyBlue}22 150%)`,
          overflowY: "auto",
          minHeight: "170px",
          maxHeight: "220px",
        }}
      >
        {chat.map((msg, idx) => (
          <div
            key={idx + (msg.from === "user" ? "-user" : "-fairy")}
            style={{
              margin: "0.7em 0",
              display: "flex",
              flexDirection: msg.from === "user" ? "row-reverse" : "row",
              alignItems: "flex-end",
            }}
          >
            <div
              style={{
                background:
                  msg.from === "fairy"
                    ? `linear-gradient(123deg, ${chatBubbleColors.fairyViolet}44 90%, #f2d1fa88 100%)`
                    : `linear-gradient(119deg, #fffbe0 70%, #bb5dfe22 100%)`,
                color:
                  msg.from === "fairy"
                    ? chatBubbleColors.fairyAccent
                    : "#6534ae",
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
                fontFamily: "'Snell Roundhand', cursive",
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
          <div
            style={{
              color: chatBubbleColors.fairyAccent,
              margin: "1.2em 0 0.2em 0",
              textAlign: "center",
              fontSize: "0.97em",
            }}
          >
            {defaultPromptMsg}
          </div>
        )}
        {loading && (
          <div
            style={{
              color: "#b60e9e",
              fontStyle: "italic",
              fontFamily: "'Snell Roundhand', cursive",
              padding: "0.6em 0.5em",
            }}
          >
            The fairy is thinking... <span style={{ fontSize: "1.1em" }}>✨🦷✨</span>
          </div>
        )}
      </div>
      {/* Input bar */}
      <form
        onSubmit={handleSend}
        style={{
          background: "#fff9fc",
          padding: "8px 13px",
          display: "flex",
          borderTop: `1.8px dashed ${chatBubbleColors.fairyAccent}`,
          alignItems: "flex-end",
          gap: "0.66em",
        }}
      >
        <textarea
          ref={inputRef}
          aria-label="Type your message to the Tooth Fairy"
          value={input}
          rows={1}
          onChange={(e) => {
            setInput(e.target.value);
            if (error) setError("");
          }}
          onKeyDown={handleInputKey}
          placeholder="Type your magical message..."
          spellCheck={true}
          disabled={loading}
          style={{
            flex: 1,
            minHeight: "28px",
            maxHeight: "52px",
            borderRadius: "12px",
            border: `1.2px solid ${chatBubbleColors.fairyAccent}`,
            resize: "none",
            fontFamily: "'Snell Roundhand', 'Inter', cursive",
            padding: "7px 10px",
            fontSize: "1.01em",
            boxShadow: error ? "0 2px 8px #ffbdda77" : "none",
            background: "#fff",
            color: "#8236c5",
          }}
          autoFocus={!loading}
        />
        <button
          type="submit"
          aria-label="Send"
          title="Send"
          disabled={!input.trim() || loading}
          style={{
            background: `linear-gradient(120deg, ${chatBubbleColors.fairyBlue} 40%, ${chatBubbleColors.fairyAccent} 100%)`,
            color: "#fff",
            fontWeight: "600",
            border: "none",
            borderRadius: "29px 12px 19px 29px/14px 17px 29px 13px",
            padding: "10px 17px",
            fontSize: "1.3em",
            cursor: input.trim() && !loading ? "pointer" : "not-allowed",
            boxShadow: "0 2px 18px 0 #bb5dfe19, 0 0px 3.5px #ffe7e7",
            opacity: loading ? 0.7 : 1,
          }}
        >
          <span role="img" aria-label="Magic sparkle" style={{ marginRight: 2 }}>
            ✨
          </span>
          {loading ? "Magic..." : "Send"}
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
            padding: "5px",
            borderTop: "1px solid #fcc9fd",
            borderBottomLeftRadius: "9px",
            borderBottomRightRadius: "9px",
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}

export default ToothFairyChatbot;
