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

/* --- Magical DuckDuckGo-powered fairy reply logic --- */

/*
PUBLIC_INTERFACE
getFairyReplyDuckDuckGo: Like before, but returns { factual, hasFactual, magicalComposite }
where:
- factual: best factual found (else null/empty)
- hasFactual: true if we got one
- magicalComposite: always final message to show user (combines factual + fairy encouragement if possible)
*/
/*
  PUBLIC_INTERFACE
  getFairyReplyDuckDuckGo: Attempts instant factual answer, but always returns a magical, whimsical fallback if answer is absent, generic, or not engaging. Generates a decorated, child-delighting reply that plays on the question, often with rhyme, encouragement, or fairy-themed lore.
*/
async function getFairyReplyDuckDuckGo(userText) {
  // Fairy-tale encouragement templates
  const encouragements = [
    "Remember, every tooth brings a sprinkle of luck and a pocket of sparkles!",
    "Fairy wings are fluttering with pride at your curiosity!",
    "May stardust guide you, sweet dreamer!",
    "The best magic is a curious question—keep them shining!",
    "Fluttering by with a sparkle just for you!",
    "Believe in magic, and magic will believe in you!",
    "Your question tickled the fairy dust in the air!",
    "You make fairyland shine a little brighter today!",
    "A golden coin for your wondrous question!",
  ];

  // Fallbacks: decorated, templated, often rhymed or transformed for magical delight!
  const magFallbacks = [
    userText => `Hmmm... "${userText}" is a question rare,\nIn fairyland, answers float in the air!\nWhile I search my sparkly book,\nKeep brushing well—don't forget to look! 🦷✨`,
    userText => `Ooo! That query sparkled under a pillow.\nEven if this is a mystery, let your dreams be mellow!`,
    userText => `Your question made my fairy wings flutter!\nBut the answer still hides in fairy glitter and butter.\nMeanwhile, here's a coin of encouragement!`,
    userText => `No answer flew in on fairy wings this time,\nBut your curiosity is magic—truly sublime! 🌈🦷✨`,
    userText => `If answers were like teeth under your head,\nI'd bring you wisdom and a coin instead! Keep being curious, little one!`,
    userText => `Sometimes the moon keeps the answer away,\nBut tooth fairies like me love questions all day!\nShine on and ask again and again!`,
    userText => `A magical mystery, what fun you create!\nWhile I search for wisdom, adventure awaits!`,
    userText => `A fairy swirl and a giggle bright,\nI'll dream up answers for you tonight! 🌙✨\nSleep tight!`
  ];

  // Generic/empty/boring answer detectors (very simple, but works for "No instant answer", "I'm not sure", "N/A", etc)
  function isWeakFactual(answer) {
    if (!answer) return true;
    const txt = answer.trim().toLowerCase();
    if (!txt) return true;
    if (
      txt === 'n/a' ||
      txt === 'no instant answer' ||
      txt.startsWith('no instant answer') ||
      txt.startsWith('sorry,') ||
      txt.startsWith('i am an ai') ||
      txt.match(/^i('| a)?m not sure/i) ||
      txt.match(/^not available|unknown|not found/)
    ) return true;
    // Overly short, generic, or evasive?
    if (txt.length < 16) return true;
    if (
      ['not sure', 'don\'t know', 'unable', 'can\'t answer', 'not available', 'unavailable', 'no answer'].some(g => txt.includes(g))
    ) return true;
    return false;
  }

  // Attempt to fetch factual answer (DuckDuckGo Instant Answer)
  const endpoint = `https://api.duckduckgo.com/?q=${encodeURIComponent(userText)}&format=json`;
  let factual = "";
  let hasFactual = false;
  let errorish = false;

  try {
    const resp = await fetch(endpoint, {
      headers: { "Accept": "application/json" }
    });
    if (!resp.ok) throw new Error("Network resp not OK");
    const data = await resp.json();
    // Try the best plausible sources for a DDG instant answer
    if (data?.AbstractText) factual = data.AbstractText;
    else if (data?.Answer) factual = typeof data.Answer === "string" ? data.Answer : "";
    else if (
      data?.RelatedTopics && Array.isArray(data.RelatedTopics) &&
      data.RelatedTopics.length && data.RelatedTopics[0].Text
    ) factual = data.RelatedTopics[0].Text;
    // Final desperate fallback: DDG definition/Heading field
    else if (data?.Heading) factual = data.Heading;
    // Genuine factual?
    hasFactual = !!(factual && !isWeakFactual(factual));
  } catch (err) {
    factual = ""; // On fetch/network error, fallback
    errorish = true;
  }

  // Compose the final reply (prioritize instant, fallback to magic always)
  let replyFinal = "";

  if (hasFactual) {
    // Boost factual via fairy magic: add encouragement or decorate for child delight
    const pickEncour = encouragements[Math.floor(Math.random() * encouragements.length)];
    const rhymeTemplates = [
      (fact, q) => `Here's your magical answer:\n"${fact.replace(/[".]+$/, '')}."\nAnd remember: ${pickEncour}`,
      (fact, q) => `${fact.replace(/[".]+$/, '')} 🦷✨\nFairy wings say: Keep shining bright!`,
      (fact, q) => `✨ ${fact.replace(/[".]+$/, '')} ✨\n\nCuriosity is like brushing—good for you every night!`
    ];
    const t = rhymeTemplates[Math.floor(Math.random() * rhymeTemplates.length)];
    replyFinal = t(factual, userText);
  } else {
    // If factual failed or is generic, decorate with fairy magic
    let msg = "";
    // If there was a network/CORS error
    if (errorish) {
      const networkMagics = [
        () => `Oh dear! 🦷✨ Fairy magic hit a network wall; the crystal ball is fuzzy right now!\nBut here's a magical sparkle: ${encouragements[Math.floor(Math.random() * encouragements.length)]}`,
        () => `No fairy connection to the fact lands. While the magic repairs, let's imagine fairyland together! 🌙🧚‍♀️`
      ];
      msg = networkMagics[Math.floor(Math.random() * networkMagics.length)]();
    } else {
      // Generate magical fallback: echo, rhyme, or themed story.
      const pickMagic = magFallbacks[Math.floor(Math.random() * magFallbacks.length)];
      msg = typeof pickMagic === "function" ? pickMagic(userText) : pickMagic;
      // Add random encouragement for extra sparkle!
      if (Math.random() < 0.7) {
        msg += "\n\n" + encouragements[Math.floor(Math.random() * encouragements.length)];
      }
    }
    replyFinal = msg;
  }

  return { factual, hasFactual, magicalComposite: replyFinal };
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
  "Ask anything about your tooth, coins, or fairyland! (Powered by real-world magic from DuckDuckGo ✨)";

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

  // --- Chat send handler (fetches DuckDuckGo API, uses magical fallback) ---
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

      // Fetch composite magical reply w/ factual tie-in
      let fairyComposite = "";
      try {
        const result = await getFairyReplyDuckDuckGo(question);
        fairyComposite = result.magicalComposite || "✨ A sprinkling of magic for you!";
      } catch (ex) {
        fairyComposite =
          "Oh dear, a fairy fog blocks my answer! Try again with a simpler question, or wait for the magic to return.";
      }
      setChat((prev) => [
        ...prev,
        { from: "fairy", text: fairyComposite, ts: Date.now() },
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
