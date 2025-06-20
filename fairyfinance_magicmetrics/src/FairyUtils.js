//
// PUBLIC_INTERFACE
// Utility functions for the ToothFairy Ledger app. More can be added as needed.

/**
 * Example Fairy name generator (stub).
 */
export function getRandomFairyName() {
  const names = [
    "Starlina", "Glitter Belle", "Wisp Willow", "Fae Aura",
    "Twinkle Spark", "Celestia", "Misty Dewdrop", "Aurielle",
    "Sugarplum", "Moonbeam", "Pixiebelle", "Flutterglow"
  ];
  return names[Math.floor(Math.random() * names.length)];
}

export default {};
