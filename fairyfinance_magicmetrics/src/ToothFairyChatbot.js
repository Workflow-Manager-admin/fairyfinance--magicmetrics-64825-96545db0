import React, { useState, useRef, useEffect } from "react";
import "./App.css";

/*
  PUBLIC_INTERFACE
  ToothFairyChatbot: Magical local fairy chatbot!

  This chat widget is now 100% scripted—no network or AI API is called for user questions.
  - All fairy responses are locally generated from a whimsical, varied response script designed for fun and magical tooth fairy lore.
  - The chat history is saved in sessionStorage for the user's session (never sent to any server).
  - This implementation is guaranteed to be error-free (no Internet required, no rate limits, no failed credentials).
  - This approach ensures children and users always receive reliable, magical answers.

  -------------------------------------------------------------------------------------------
  NOTE ON PUBLIC AI APIS:
    Most public conversational AI APIs (such as OpenAI, Hugging Face, Anthropic, Google) REQUIRE an API key/token for interactive chat.
    Even “public” demo endpoints frequently enforce quotas or authentication via bearer token—
    attempting chat without credentials results in errors or unpredictable availability.

    The current implementation avoids ALL credentials, API keys, or online requests.
    For production apps or parent/admin usage, consult API documentation for authentication options.
  -------------------------------------------------------------------------------------------
*/

/* --- Fairy-themed scripted reply logic --- */
function getFairyReply(userText) {
  // Define rules: match on keywords & fallback to magic
  const rules = [
    {
      test: (t) => /lost|came out|fell out|loose tooth|wiggle/.test(t),
      reply: [
        "✨ Flutter flutter! Well done on losing a tooth! Put it under your pillow for fairy fun tonight!",
        "How magical—a shiny new tooth for the fairy castle! Dream big and sleep well! ✨",
        "Hooray—a tooth for Fairyland! Sleep tight and let the fairy magic begin.",
      ],
    },
    {
      test: (t) => /how much|money|coin|gold|worth/.test(t),
      reply: [
        "The amount of fairy gold depends on your tooth's sparkle! Bravery gets bonus coins. 🪙✨",
        "Sometimes you'll get extra for a super shiny tooth—surprises are fairy magic! 🌈",
        "Gold coins and fairy dust—what a combination! Each tooth is valued for its magic.",
      ],
    },
    {
      test: (t) => /hello|hi|hey|who are you|hi fairy|hello fairy|greetings|good morning|good night/.test(t),
      reply: [
        "Hello, dreamer! I'm your Tooth Fairy friend—what magic teethy question do you have?",
        "Hi there! Fairy wings flutter when you chat with me—ask away!",
        "Magical greetings! 🌟 What wonders can I answer tonight?",
      ],
    },
    {
      test: (t) => /pain|hurt|scared|afraid|nervous|bleed|ouch|cry/.test(t),
      reply: [
        "Oh, brave one! Losing a tooth is magical. Fairy dust makes it easy. You'll get treasure for your bravery! 🦷💜",
        "It's okay to feel a bit scared—fairies watch over you! Soon you'll have a grown-up smile! 🌟",
        "Even when it feels a bit uncomfortable, you're doing something magical! Fairyland is proud of you.",
      ],
    },
    {
      test: (t) => /when|tonight|visit|what time|will you|coming/.test(t),
      reply: [
        "The Tooth Fairy usually visits when dreamy sleep arrives—keep your eyes closed for extra sparkle!",
        "I'll visit as soon as the stars twinkle bright and you drift off into fairy dreams.",
      ],
    },
    {
      test: (t) => /who|your name|are you real|where live|who are you/.test(t),
      reply: [
        "I'm the magical Tooth Fairy! I collect shining teeth to build castles of dreams.",
        "I flutter between pillows and moonbeams—making sure every lost tooth is properly sprinkled with fairy dust.",
        "My name changes with every twinkle, but my magic is always the same!",
      ],
    },
    {
      test: (t) => /tooth fairy|fairy/.test(t),
      reply: [
        "That's me! I love sparkles, gold coins, and kind wishes under pillows.",
        "Fairies are always near, especially when a tooth is ready for a magical adventure.",
      ],
    },
    {
      test: (t) => /can i|may i|is it ok|should i/.test(t),
      reply: [
        "You can always believe in fairy magic! If you have a question, I'm always here to help.",
        "As long as your heart is full of wonder, anything is possible in Fairyland!",
      ],
    },
    {
      test: () => true, // fallback
      reply: [
        "Every question is a sprinkle of curiosity! Fairy wings are always near—ask anything about teeth magic!",
        "That's a sparkly question! Fairyland is full of surprises—just like you!",
        "I may not know everything, but I do know a little fairy dust helps every day!",
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

/* -- Chat state utilities (persist for user session, never sent externally) -- */
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

/* -- Whimsical bubble color theme -- */
const chatBubbleColors = {
  fairyPink: "var(--magic-pink, #f2d1fa)",
  fairyBlue: "var(--magic-blue, #a1fdff)",
  fairyAccent: "var(--magic-accent, #bb5dfe)",
  fairyYellow: "var(--magic-gold, #ffe9a8)",
  fairyViolet: "var(--magic-violet, #d7b5fd)",
};

const defaultPromptMsg =
  "Ask anything about your tooth, coins, or fairyland! (Powered by magical fairy wisdom ✨)";

/* -- MAIN CHATBOT FUNCTION -- */
/*
  PUBLIC_INTERFACE
  ToothFairyChatbot: Local, whimsical, magical fairy chatbot.
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

  // --- Collapsed chat bubble UI ---
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

  // --- Chat send handler ---
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

      // --- 100% local fairy reply logic ---
      // (simulate "thinking" delay for magic effect)
      setTimeout(() => {
        const fairyReply = getFairyReply(question);
        setChat((prev) => [
          ...prev,
          { from: "fairy", text: fairyReply, ts: Date.now() },
        ]);
        setLoading(false);
      }, 460 + Math.random() * 340);
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
      {/* API Credential Warning Documentation */}
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
          Most public AI chat APIs (OpenAI, Hugging Face, Anthropic) require credentials for use.
          The current fairy chat uses only local responses—no API keys or network are required!
        */}
        <span role="img" aria-label="Caution" style={{ marginRight: 4 }}>
          ⚠️
        </span>
        No API keys required! This fairy chat is fully local and error-free.
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
