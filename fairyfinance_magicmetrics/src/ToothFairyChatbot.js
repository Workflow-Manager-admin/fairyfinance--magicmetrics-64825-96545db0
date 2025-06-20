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

// --- Config ---

// Which OpenAI chat model? gpt-3.5-turbo is fast & sufficient, edit below as needed.
const OPENAI_CHAT_COMPLETION_URL = "https://api.openai.com/v1/chat/completions";
const OPENAI_MODEL = "gpt-3.5-turbo";

const chatBubbleColors = {
  fairyPink: "var(--magic-pink, #f2d1fa)",
  fairyBlue: "var(--magic-blue, #a1fdff)",
  fairyAccent: "var(--magic-accent, #bb5dfe)",
  fairyYellow: "var(--magic-gold, #ffe9a8)",
  fairyViolet: "var(--magic-violet, #d7b5fd)",
};

const defaultPromptMsg =
  "Ask anything about your tooth, coins, or fairyland! (Powered by magical AI ✨)";

// Safely persist chat and API key only for the user session (never in file)
function getSessionChat() {
  try {
    let raw = sessionStorage.getItem("tfairy-chatbot");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
function saveSessionChat(chat, apiKeyMasked) {
  try {
    sessionStorage.setItem(
      "tfairy-chatbot",
      JSON.stringify({ chat, apiKeyMasked })
    );
  } catch {
    // ignore
  }
}

function getSessionApiKey() {
  try {
    let raw = sessionStorage.getItem("openai-key");
    return raw || "";
  } catch {
    return "";
  }
}
function saveSessionApiKey(k) {
  try {
    if (k) sessionStorage.setItem("openai-key", k);
    else sessionStorage.removeItem("openai-key");
  } catch {}
}

// Simple mask for API key display
function maskApiKey(key) {
  if (!key) return "";
  return key.slice(0, 3) + "****" + key.slice(-4);
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

  // API KEY: Never committed! Only in user session.
  const [apiKey, setApiKey] = useState(getSessionApiKey()); // actual
  const [apiKeyEntry, setApiKeyEntry] = useState(""); // form value
  const [apiKeyMasked, setApiKeyMasked] = useState(
    maskApiKey(getSessionApiKey())
  );
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // ---- All hooks unconditionally before ANY return ----
  useEffect(() => {
    saveSessionChat(chat, apiKeyMasked);
  }, [chat, apiKeyMasked]);
  useEffect(() => {
    if (apiKey) saveSessionApiKey(apiKey);
  }, [apiKey]);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chat, isOpen, loading]);
  useEffect(() => {
    const k = getSessionApiKey();
    if (k) {
      setApiKey(k);
      setApiKeyMasked(maskApiKey(k));
    }
  }, []);
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

  // --- Helper: Send message to OpenAI ---
  async function sendToOpenAI(question, priorChat, thisApiKey) {
    // Compose ChatGPT-compatible conversation history
    const messages = [
      {
        role: "system",
        content:
          "You are the magical Tooth Fairy. You answer questions as a gentle, delightful, whimsical fairy with a playful and encouraging tone. If the question is about teeth, money, tooth loss, growing up, or fairyland, explain in friendly, kid-safe manner with fairy details. No scary talk, always light, magical, and hopeful. Try to end each message with a fairy emoji or sparkle.",
      },
      ...priorChat
        .map((m) =>
          m.from === "user"
            ? { role: "user", content: m.text }
            : m.from === "fairy"
            ? { role: "assistant", content: m.text }
            : null
        )
        .filter(Boolean),
      { role: "user", content: question },
    ];
    // POST to OpenAI
    const body = {
      model: OPENAI_MODEL,
      messages,
      max_tokens: 128,
      temperature: 0.82,
      n: 1,
      stop: null,
    };
    let controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 18000); // 18s safety
    try {
      const resp = await fetch(OPENAI_CHAT_COMPLETION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${thisApiKey}`,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (!resp.ok) {
        let msg = "OpenAI error";
        if (resp.status === 401 || resp.status === 403) {
          msg = "Invalid API key! Please enter a correct OpenAI API key.";
        } else if (resp.status === 429) {
          msg = "API is rate limited—too many requests or quota reached!";
        } else if (resp.status === 400) {
          msg = "Bad request sent to OpenAI…";
        }
        const errJson = await resp.json().catch(() => null);
        throw new Error(errJson?.error?.message || msg);
      }
      const data = await resp.json();
      let msg =
        data?.choices?.[0]?.message?.content?.trim() ||
        fallbackFairyReply(question);
      return msg;
    } catch (err) {
      clearTimeout(timeout);
      if (err.name === "AbortError")
        throw new Error(
          "Network timeout—OpenAI server is slow or unreachable. Try again!"
        );
      throw err;
    }
  }

  // --- API Key Prompt UI ---
  function ApiKeyPrompt() {
    return (
      <div
        style={{
          padding: 20,
          background: "#fffbe0",
          borderRadius: 18,
          border: `2.6px dashed ${chatBubbleColors.fairyAccent}`,
          margin: 20,
          marginBottom: 3,
        }}
      >
        <div
          style={{
            color: chatBubbleColors.fairyAccent,
            fontWeight: 700,
            marginBottom: 8,
            fontFamily: "'Snell Roundhand', cursive",
            letterSpacing: ".01em",
            fontSize: "1.1em",
          }}
        >
          <span role="img" aria-label="Key" style={{ marginRight: 6 }}>
            🗝️
          </span>
          Enter your OpenAI API Key
        </div>
        <div
          style={{
            color: "#b60e9e",
            fontSize: ".98em",
            marginBottom: 8,
            fontFamily: "inherit",
            fontWeight: 500,
            lineHeight: 1.5,
          }}
        >
          Please paste your <b>OpenAI API key</b> (starting with "sk-...") below.
          <br />
          <span style={{ color: "#b692f9" }}>
            <b>Warning:</b> Your key is never saved to our servers or code!
            Never share it or commit it to Git. Keep it secret and safe.
          </span>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!apiKeyEntry.trim().startsWith("sk-")) {
              setError("Enter a valid OpenAI API key (sk-...)");
              return;
            }
            setApiKey(apiKeyEntry.trim());
            setApiKeyMasked(maskApiKey(apiKeyEntry.trim()));
            setApiKeyEntry("");
            setError(""); // Clear any previous error
          }}
          style={{ display: "flex", flexDirection: "column", gap: 8 }}
        >
          <input
            type="password"
            value={apiKeyEntry}
            onChange={(e) => setApiKeyEntry(e.target.value)}
            placeholder="sk-... your OpenAI key"
            autoComplete="off"
            aria-label="OpenAI API key"
            style={{
              padding: "7px 14px",
              fontSize: "1em",
              borderRadius: "9px",
              border: `1.6px solid ${chatBubbleColors.fairyAccent}`,
              background: "#fff",
              fontFamily: "monospace",
              color: "#6035b7",
              marginBottom: 6,
              letterSpacing: "0.12em",
            }}
            required
          />
          <button
            type="submit"
            style={{
              background: `linear-gradient(120deg, ${chatBubbleColors.fairyBlue} 40%, ${chatBubbleColors.fairyAccent} 100%)`,
              color: "#fff",
              fontWeight: "600",
              border: "none",
              borderRadius: "19px",
              padding: "7px 22px",
              fontSize: "1.02em",
              cursor: "pointer",
            }}
          >
            Use Key
          </button>
        </form>
        <div
          style={{
            marginTop: 12,
            fontSize: ".91em",
            color: chatBubbleColors.fairyAccent,
            background: "#fff9fc",
            borderRadius: "7px",
            padding: "6px 8px",
            lineHeight: 1.5,
          }}
        >
          <b>Don't have a key?</b> Visit&nbsp;
          <a
            href="https://platform.openai.com/api-keys"
            style={{ color: chatBubbleColors.fairyAccent }}
            target="_blank"
            rel="noopener noreferrer"
          >
            OpenAI's API settings
          </a>
          .
        </div>
      </div>
    );
  }

  // --- Actual Chat Send Handler ---
  async function handleSend(e) {
    e && e.preventDefault();
    setError("");
    if (!input.trim()) {
      setError("Type your question before sending!");
      return;
    }
    if (!apiKey) {
      setError("You must enter your OpenAI API key to talk to the fairy!");
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

      // Send to OpenAI
      const prior = [...chat.filter((m) => m.from)];
      let fairyReply = "";
      try {
        fairyReply = await sendToOpenAI(question, prior, apiKey);
      } catch (err) {
        setError(
          "OpenAI error: " +
            (err?.message ||
              "Could not fetch a fairy answer this time. Please check your API key and network.")
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
      {/* API Key Entry (if missing) */}
      {!apiKey ? (
        <ApiKeyPrompt />
      ) : (
        <>
          {/* API key status & reset */}
          <div
            style={{
              fontSize: ".95em",
              color: chatBubbleColors.fairyAccent,
              padding: "3px 13px 0px 13px",
              background: "#f5dbfd",
              textAlign: "right",
            }}
          >
            Using key:{" "}
            <span style={{ background: "#fbeafd", borderRadius: 5, padding: "2px 7px", fontFamily: "monospace" }}>
              {apiKeyMasked}
            </span>
            <button
              aria-label="Change API Key"
              title="Change API Key"
              onClick={() => {
                setApiKey("");
                setApiKeyMasked("");
                setApiKeyEntry("");
                saveSessionApiKey("");
              }}
              style={{
                background: "transparent",
                border: "none",
                color: "#a84fb5",
                marginLeft: 9,
                fontSize: "1em",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Change
            </button>
          </div>
          {/* Chat history */}
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
        </>
      )}
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
