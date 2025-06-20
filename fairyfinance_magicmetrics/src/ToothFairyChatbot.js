import React, { useState, useRef, useEffect } from "react";
import "./App.css";

/*
  PUBLIC_INTERFACE
  ToothFairyChatbot: Now powered by Google Gemini Pro/1.5 conversational AI!

  - User input is sent directly to the Google Gemini API using the provided API key.
  - Replies are streamed (if available) or shown when complete.
  - Error cases (quota exceeded, invalid key, network error) show a magical AI fallback message.
  - All chat context is maintained per session for natural, context-aware replies.
  - Loading/typing indication is displayed during Gemini's inference.
  - Code includes warnings: NEVER commit API keys to public repos or client-exposed code in production!
  -------------------------------------------------------------------------------------------
  SECURITY WARNING FOR DEVELOPERS:
    - The API key below is provided for testing/integration ONLY.
    - Never expose real Google Gemini/AI API keys in client-side code unless in an approved/secured demo.
    - For production, always route requests through a secure backend.
    - Do not commit secrets or API keys to public repositories.
  -------------------------------------------------------------------------------------------
*/

const GEMINI_API_KEY = "AIzaSyAvVImtCON6M1yMkb6CFQkS6wWBom0c_a0";
/*
  SECURITY WARNING: In production, API keys must NEVER appear in client-side code nor be pushed to public repositories.
  Instead, use a secure backend or secret store.
*/

/**
 * Makes a call to the Google Gemini API with current chat history and current user message.
 * Returns a Promise resolving { success: bool, reply: string, errorType: string }
 * On error, errorType is one of "quota", "invalid_api_key", "network", "parse", "unknown"
 */
async function callGeminiAPI(messages) {
  // Gemini API Reference: https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=API_KEY
  // Format as: [{role: "user" or "model", parts: [{text: ...}]}]
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`;
  const headers = {
    "Content-Type": "application/json",
    "x-goog-api-client": "magicmetrics-fairyledger-demo/1.0"
  };
  // Prepare as Gemini-pro format: last 8 messages max for context
  const payload = {
    contents: messages.slice(-8).map((m) => ({
      role: m.from === "user" ? "user" : "model",
      parts: [{ text: m.text }]
    })),
    generationConfig: {
      temperature: 0.95,
      maxOutputTokens: 256,
      // extra config as needed
    }
  };
  try {
    const resp = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(payload)
    });
    if (!resp.ok) {
      let errorType = "unknown";
      try {
        const err = await resp.json();
        // Example error JSON:
        // {
        //   "error": {
        //     "code": 429,
        //     "message": "Quota exceeded",
        //     ...
        //   }
        // }
        if (err.error) {
          const msg = String(err.error.message || "").toLowerCase();
          if (resp.status === 429 || msg.includes("quota") || msg.includes("exceeded")) errorType = "quota";
          else if (resp.status === 401 || resp.status === 403 || msg.includes("api key") || msg.includes("key invalid")) errorType = "invalid_api_key";
          else if (msg.includes("permission") || msg.includes("forbidden")) errorType = "invalid_api_key";
          else errorType = "unknown";
        }
      } catch {
        errorType = "parse";
      }
      return { success: false, reply: "", errorType };
    }
    const data = await resp.json();
    // Successful Gemini format: {candidates:[{content:{parts:[{text:"..." }]}}]}
    if (data && data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return { success: true, reply: data.candidates[0].content.parts[0].text, errorType: null };
    }
    return { success: false, reply: "", errorType: "parse" };
  } catch (err) {
    return { success: false, reply: "", errorType: "network" };
  }
}

// Chat state utilities (persist for user session, never sent externally)
function getSessionChat() {
  try {
    let raw = sessionStorage.getItem("tfairy-chatbot-v2");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
function saveSessionChat(chat) {
  try {
    sessionStorage.setItem("tfairy-chatbot-v2", JSON.stringify({ chat }));
  } catch {
    // ignore
  }
}

// Whimsical bubble color theme (works with app palette)
const chatBubbleColors = {
  fairyPink: "var(--magic-pink, #f2d1fa)",
  fairyBlue: "var(--magic-blue, #a1fdff)",
  fairyAccent: "var(--magic-accent, #bb5dfe)",
  fairyYellow: "var(--magic-gold, #ffe9a8)",
  fairyViolet: "var(--magic-violet, #d7b5fd)",
};

const defaultPromptMsg =
  "Ask anything about your tooth, coins, or fairyland! (Powered by Google Gemini ✨)";

// Magical fallback used when Gemini can't respond
function magicalFallbackMsg(errorType) {
  if (errorType === "quota") {
    return (
      "Oh no! The fairy magic for answers is temporarily out of sparkle (quota exceeded). Try again later or check your fairy's AI quota!\n\n" +
      "Meanwhile, remember: Every question is a magical adventure! ✨🦷"
    );
  }
  if (errorType === "invalid_api_key") {
    return (
      "Hmm, the fairy wand failed... The secret fairy key isn't working! (API key invalid or expired)\n" +
      "Contact your magical admin to refresh it.\n\nAlways keep API keys secret and safe for true fairy-tale security!"
    );
  }
  if (errorType === "network") {
    return (
      "A fairy dust storm blocks the connection to AI magic right now. Please check your internet and try again soon!\n\n" +
      "Fairy wings will flutter to reconnect! ✨"
    );
  }
  if (errorType === "parse") {
    return (
      "Oops! Fairyland sent a mysterious message and I couldn't quite read it.\n" +
      "Try asking another question, or refresh the page for more sparkle."
    );
  }
  // Default unknown
  return (
    "The AI fairy seems a bit lost in the stars tonight—no answer is appearing! Try again with a different question soon, or let your imagination fly! ✨🦷"
  );
}

/*
  PUBLIC_INTERFACE
  ToothFairyChatbot: React component for magical Gemini-powered chatbot UI.
*/
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

  // Maintain context up to N turns for Gemini
  const maxTurnsForContext = 8;

  // Persist chat on update
  useEffect(() => {
    saveSessionChat(chat);
  }, [chat]);
  // Scroll on chat/expand/loading
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chat, isOpen, loading]);
  // ESC closes chat
  useEffect(() => {
    function escClose(e) {
      if (isOpen && e.key === "Escape") setIsOpen(false);
    }
    window.addEventListener("keydown", escClose);
    return () => window.removeEventListener("keydown", escClose);
  }, [isOpen]);

  // Collapsed chat bubble UI
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

  // --- Send Handler: Uses Gemini API ---
  async function handleSend(e) {
    e && e.preventDefault();
    setError("");
    if (!input.trim()) {
      setError("Type your question before sending!");
      return;
    }
    try {
      const question = input.trim();
      setChat((prev) => [
        ...prev,
        { from: "user", text: question, ts: Date.now() },
      ]);
      setInput("");
      setLoading(true);

      // Prepare context
      const chatContext = [
        // ...last N messages alternating 'user'/'fairy'
        ...chat.slice(-maxTurnsForContext),
        { from: "user", text: question, ts: Date.now() }
      ];

      // Call Gemini API
      const { success, reply, errorType } = await callGeminiAPI(chatContext);

      setChat((prev) => [
        ...prev,
        {
          from: "fairy",
          text: success
            ? reply
            : magicalFallbackMsg(errorType),
          ts: Date.now(),
        },
      ]);
      setLoading(false);
    } catch (ex) {
      setError("Oops! Fairy lost her train of thought...");
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
      {/* API Key Security Warning (visible for dev only) */}
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
        {/* 
          Dev note: 
          This demo includes an API key only for local/integration testing.
          NEVER commit or expose production AI keys in client code!
        */}
        <span role="img" aria-label="Caution" style={{ marginRight: 4 }}>
          ⚠️
        </span>
        Powered by Google Gemini AI. DO NOT COMMIT API KEYS TO PUBLIC REPOS!
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
