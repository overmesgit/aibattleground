import { GameManager } from "./game/gameManager.js";

// Configuration (could be loaded from JSON later)
const APP_OPTIONS = {
  width: 960,
  height: 960,
  backgroundColor: "72751b00", // Example, maybe 0x72751B
};

const UNITS_DATA = [
  { unitID: 1, type: "soldier", position: [2, 2], health: 100 },
];

const ACTIONS_LOG = [
  { action: "init" },
  { action: "move", unitID: 1, position: [6, 6] },
  { action: "attack", unitID: 1, position: [4, 5] },
  { action: "move", unitID: 1, position: [1, 5] },
  { action: "attack", unitID: 1, position: [1, 5] },
];

async function startGame() {
  console.log("Starting game...");
  const gameManager = new GameManager();

  try {
    // Initialize Pixi, load assets, create map
    await gameManager.initialize({ appOptions: APP_OPTIONS });

    // Create units based on data
    gameManager.createUnits(UNITS_DATA);

    // Process the sequence of actions
    await gameManager.processActions(ACTIONS_LOG);

    console.log("Game simulation finished.");
  } catch (error) {
    // Simplified error display for initialization phase
    const errorDiv = document.createElement("div");
    errorDiv.style.color = "red";
    errorDiv.style.position = "absolute";
    errorDiv.style.top = "10px";
    errorDiv.style.left = "10px";
    errorDiv.style.fontFamily = "sans-serif";
    errorDiv.innerHTML = `Critical Error Initializing Game: ${error.message}<br><pre>${error.stack}</pre>`;
    document.body.appendChild(errorDiv);
    console.error("Critical Initialization Error:", error);

    // Optional: Clean up game manager resources if initialization failed partially
    gameManager.destroy();
  }
}

// --- Start the Game ---
startGame();
