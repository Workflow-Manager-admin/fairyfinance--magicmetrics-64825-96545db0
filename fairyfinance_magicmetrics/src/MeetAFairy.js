import React, { useState } from "react";
import "./App.css";

/*
  PUBLIC_INTERFACE
  MeetAFairy: Magical fairy card!
  Displays a randomly selected illustrated fairy portrait and whimsical name.
  Uses a static array of fairies (names + images), no network/API.
  If you want to add your own fairies, add image URLs to fairyImages and names to fairyNames arrays.
*/

// -- Local asset fairy images and magical names --
// For demonstration, 6 fairies are included as royalty-free or creative commons.
// Replace or augment with your own AI-generated or purchased assets for production!
const fairyImages = [
  // Free/CC0, placeholder fairies from unsplash/pexels/stock--replace as desired!
  // Alternatively, use your own assets, e.g. "/assets/fairies/fairy1.png"
  {
    url: "https://cdn.pixabay.com/photo/2016/01/11/18/29/fantasy-1135638_1280.jpg",
    credit: "Pixabay, CC0",
  },
  {
    url: "https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg", // soft-wing fairy in forest
    credit: "Pexels",
  },
  {
    url: "https://cdn.pixabay.com/photo/2016/07/15/15/07/fairy-1516928_1280.jpg", // blue fairy with sparkles
    credit: "Pixabay, CC0",
  },
  {
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=640&q=80",
    credit: "Unsplash",
  },
  {
    url: "https://cdn.pixabay.com/photo/2017/10/02/23/54/fairy-2818139_1280.jpg", // dreamy fairy magic
    credit: "Pixabay, CC0",
  },
  {
    url: "https://cdn.pixabay.com/photo/2014/03/25/15/25/fantasy-297575_1280.png",
    credit: "Pixabay, CC0",
  },
];

const fairyNames = [
  "Twinkle Starbloom",
  "Silverbell Mistywing",
  "Luna Glitterdew",
  "Pip Featherpetal",
  "Wisp Sunbeam",
  "Petal Stardust",
  "Mirabelle Moonwhisper",
  "Elara Dreammist",
  "Dewdrop Thistle",
  "Thistle Cottonglow",
  "Nova Flitterlace",
  "Opal Moonpetal",
  "Fawn Sugarplume",
  "Zinnia Sparklewisp",
  "Bracken Whisperlight",
];

// Optionally, fairy titles
const fairyTitles = [
  "Guardian of Lost Teeth",
  "Queen of Glittering Smiles",
  "Pixie Paymaster",
  "Dreamland Messenger",
  "Keeper of Gold Coins",
  "Enchanter of Pillow Nights",
  "Wish Granter",
  "Spirit of Sparkles",
  "Sleepytime Sprout",
  "Sunbeam Collector"
];

// Utility: Pick random element
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * PUBLIC_INTERFACE
 * The MeetAFairy card now displays a randomly-chosen magical fairy: whimsical name, illustrated image, and themed title. No internet required!
 */
function MeetAFairy() {
  // On mount, pick a random fairy. "Summon new fairy" refreshes the card.
  const summonFairy = () => {
    const image = pickRandom(fairyImages);
    const name = pickRandom(fairyNames);
    const title = pickRandom(fairyTitles);
    return { image, name, title };
  };

  const [fairy, setFairy] = useState(() => summonFairy());
  const [isLoading, setIsLoading] = useState(false);

  function handleSummonAgain() {
    // Add a tiny loading effect for magic
    setIsLoading(true);
    setTimeout(() => {
      setFairy(summonFairy());
      setIsLoading(false);
    }, 600 + Math.random() * 600); // whimsical delay
  }

  return (
    <div
      className="magical-bg"
      style={{
        maxWidth: 340,
        minHeight: 240,
        margin: "0 auto 2.2rem auto",
        textAlign: "center",
        boxShadow: "0 0 20px #ffcdf7bb",
        background: "linear-gradient(115deg,#fff5fd 70%,#f2d1fa 120%)",
        position: "relative",
        zIndex: 1
      }}
      aria-label="Meet a Tooth Fairy"
    >
      <div style={{
        fontFamily: "'Snell Roundhand', cursive",
        fontWeight: 700,
        fontSize: "1.32em",
        color: "#ad46bc",
        letterSpacing: ".03em",
        marginBottom: 8
      }}>
        <span role="img" aria-label="Fairy">🧚‍♂️</span> Meet a Tooth Fairy!
      </div>
      {isLoading ? (
        <div style={{ fontSize: "2.3em", color: "#bb5dfe", marginTop: 34, letterSpacing: "0.02em" }}>
          <span style={{ filter: "drop-shadow(0 0 9px #ffd700b3)" }}>✨</span>
          <span style={{ marginLeft: 8, fontSize: ".64em", color: "#ad46bc" }}>
            Summoning fairy magic...
          </span>
        </div>
      ) : (
        <>
          <div style={{
            margin: "18px 0 0 0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}>
            <img
              src={fairy.image.url}
              alt={`Illustration of ${fairy.name}, fairy`}
              style={{
                borderRadius: "43% 57% 57% 43% / 61% 39% 61% 39%",
                width: 102,
                height: 105,
                objectFit: "cover",
                border: "3.5px solid #ffe9a8",
                boxShadow: "0 4px 22px #bb5dfe22, 0 0 14px #e6ccf4cc",
                marginBottom: 10,
                background: "#fcfafe"
              }}
              draggable={false}
            />
            <div style={{
              color: "#8a2be2",
              fontWeight: 700,
              fontSize: "1.18em",
              fontFamily: "'Snell Roundhand', cursive",
              marginBottom: 2
            }}>
              {fairy.name}
            </div>
            <div style={{
              color: "#ff69b4",
              fontWeight: 500,
              fontSize: "1.01em",
              marginTop: 1,
              fontFamily: "'Snell Roundhand', cursive"
            }}>
              {fairy.title}
            </div>
            <div style={{
              fontSize: "0.97em",
              color: "#b889fc",
              marginTop: 6,
              fontFamily: "'Snell Roundhand', cursive"
            }}>
              “Just fluttering by to check your fairy finances!”&nbsp;<span aria-label="sparkles">✨</span>
            </div>
            <div style={{
              fontSize: ".67em",
              marginTop: 4,
              color: "#bb84dfb3"
            }}>
              {/* Optionally, show image credits if using free/stock images: */}
              {fairy.image.credit ? <>Image: <span>{fairy.image.credit}</span></> : null}
            </div>
          </div>
          <button
            className="btn"
            disabled={isLoading}
            style={{
              fontWeight: "700",
              margin: "18px 0 0 0",
              fontSize: "1em",
              borderRadius: "21px",
              background:
                "linear-gradient(100deg, #a1fdff 60%, #ffe9a8 120%)",
              color: "#ad46bc",
              boxShadow: "0 2px 12px #b983f455",
              letterSpacing: ".01em",
              transition: "background .25s"
            }}
            onClick={handleSummonAgain}
            aria-label="Meet another fairy"
            tabIndex={0}
          >
            <span role="img" aria-label="Fairy dust">🧚‍♀️</span> Summon a New Fairy
          </button>
        </>
      )}
    </div>
  );
}

export default MeetAFairy;
