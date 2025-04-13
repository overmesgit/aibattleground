// Import the main PixiJS library
import * as PIXI from 'pixi.js';

// Import the function to create the Pixi Application
import { createPixiApp } from './core/application.js';
// If using the class approach:
// import { PixiApplication } from './core/application.js';

// --- Global Variables (Consider managing state better later) ---
let app;

// --- Initialization Function ---
async function initGame() {
    console.log("Initializing game...");

    // --- Setup PixiJS Application ---
    // Use the imported function
    app = await createPixiApp({
        // Override defaults if needed, e.g.:
        // width: 1024,
        // height: 768,
        // backgroundColor: 0x000000, // Black background
    });

    // If using the class approach:
    /*
    const pixiAppInstance = new PixiApplication({
        // options...
    });
    await pixiAppInstance.init();
    app = pixiAppInstance.app; // Get the raw PIXI.Application instance
    */

    // --- Asset Loading (Placeholder) ---
    // TODO: Import and use the loader module from './core/loader.js'
    console.log("Placeholder for asset loading.");
    // Example (needs loader.js implementation):
    // import { AssetLoader } from './core/loader.js';
    // const loader = new AssetLoader(app);
    // await loader.loadAssets();

    // --- Game Setup (Placeholder) ---
    // TODO: Import and use GameManager from './game/gameManager.js'
    console.log("Placeholder for game setup.");
    // Example (needs gameManager.js implementation):
    // import { GameManager } from './game/gameManager.js';
    // const gameManager = new GameManager(app);
    // gameManager.startGame();

    // --- Simple Test Graphic (Remove later) ---
    const testBunny = PIXI.Sprite.from('https://pixijs.com/assets/bunny.png'); // Uses Pixi's loader implicitly
    testBunny.anchor.set(0.5);
    testBunny.x = app.screen.width / 2;
    testBunny.y = app.screen.height / 2;
    app.stage.addChild(testBunny);
    console.log("Test bunny added to stage.");

    // --- Start Game Loop (PixiJS handles this internally) ---
    console.log("Game initialization complete.");

}

// --- Start the application ---
// Make sure PixiJS is installed (e.g., via npm) for the imports to work
// Run this script after the DOM is ready (script type="module" handles this)

// Add error handling for initialization
try {
    initGame();
} catch (error) {
    console.error("Failed to initialize game:", error);
    // Display error to the user on the page
    const errorDiv = document.createElement('div');
    errorDiv.style.color = 'red';
    errorDiv.style.position = 'absolute';
    errorDiv.style.top = '10px';
    errorDiv.style.left = '10px';
    errorDiv.style.fontFamily = 'sans-serif';
    errorDiv.textContent = `Error initializing game: ${error.message}`;
    document.body.appendChild(errorDiv);
}
