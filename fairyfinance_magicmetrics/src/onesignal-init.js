//
// onesignal-init.js
// OneSignal browser push notifications initialization for ToothFairy Ledger (magical version)
//

/**
 * PUBLIC_INTERFACE
 * Initialize OneSignal notifications. This will only load on the browser & in production/dev environments.
 * Sensitive details are isolated from UI.
 */

export function initOneSignal() {
  if (typeof window === "undefined" || window.OneSignal) return;

  // Create global OneSignal command queue
  window.OneSignal = window.OneSignal || [];
  window.OneSignal.push(function() {
    window.OneSignal.init({
      appId: "os_v2_app_pqdkob3cfbaanalzlpckap7rrazvzysm2lruw74yuetbglj4rraab4fqvye4w4frtmw36kuwyhwjjdktnnrnxfyfmmzmzjive5cicpi",
      allowLocalhostAsSecureOrigin: true, // For local dev magic
      notifyButton: {
        enable: true,
        size: "large",
        theme: "inverse",
        text: {
          'tip.state.unsubscribed': "✨ Enable Fairy Notifications",
          'tip.state.subscribed': "Magical push is on!",
          'tip.state.blocked': "Push notifications are blocked.",
          'message.prenotify': "✨ Tap for magical fairy updates!",
          'message.action.subscribed': "You’ll get enchanted news.",
          'message.action.resubscribed': "You’re subscribed!",
          'message.action.unsubscribed': "You won’t receive notifications anymore.",
          'dialog.main.title': "Enable Fairy Pushes!",
          'dialog.main.button.subscribe': "Enable",
          'dialog.main.button.unsubscribe': "Disable",
        },
        colors: {
          'circle.background': "#ffe9a8",       // Fairy gold
          'circle.foreground': "#bb5dfe",       // Magic accent
          'badge.background': "#a1fdff",        // Fairy blue
          'badge.foreground': "#673c7e",
          'badge.bordercolor': "#d7b5fd",       // Magic violet
          'pulse.color': "#f2d1fa"              // Magic pink pulse
        },
        position: "bottom-right"
      }
    });
  });

  // Load the OneSignal SDK asynchronously (maintain fairy magic performance!)
  if (!document.getElementById("onesignal-web-sdk")) {
    const script = document.createElement("script");
    script.id = "onesignal-web-sdk";
    script.src = "https://cdn.onesignal.com/sdks/OneSignalSDK.js";
    script.async = true;
    script.onload = function() {
      // Optionally sprinkle fairy dust (visual feedback)
      showFairyToast("✨ Push notifications ready for fairy magic!");
    };
    document.body.appendChild(script);
  } else {
    showFairyToast("✨ Fairy notifications already set up.");
  }
}

// Magical UI feedback for initialization (gentle fairy toast)
let fairyToastTimeout;
function showFairyToast(msg) {
  if (typeof window === "undefined") return;
  let toast = document.getElementById("fairy-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "fairy-toast";
    toast.style.position = "fixed";
    toast.style.bottom = "88px";
    toast.style.right = "44px";
    toast.style.zIndex = "99999";
    toast.style.background = "linear-gradient(98deg,#fffbe0 70%,#f2d1fa 130%)";
    toast.style.color = "#8a2be2";
    toast.style.borderRadius = "17px";
    toast.style.padding = "15px 26px";
    toast.style.boxShadow = "0 4px 32px #bb5dfe44";
    toast.style.fontFamily = "'Snell Roundhand', cursive";
    toast.style.fontSize = "1.19em";
    toast.style.fontWeight = "600";
    toast.style.display = "flex";
    toast.style.alignItems = "center";
    toast.innerHTML = "🧚‍♀️ &nbsp;" + msg;
    document.body.appendChild(toast);
  } else {
    toast.innerHTML = "🧚‍♀️ &nbsp;" + msg;
    toast.style.display = "flex";
  }
  if (fairyToastTimeout) clearTimeout(fairyToastTimeout);
  fairyToastTimeout = setTimeout(() => {
    if (toast) toast.style.display = "none";
  }, 3500);
}
