import * as PIXI from "pixi.js";

// Basic asset loading function
export async function loadAssets(assetManifest) {
  console.log("Starting asset loading...");

  // Add assets to the manifest for loading
  for (const asset of assetManifest) {
    PIXI.Assets.add({ alias: asset.alias, src: asset.src });
  }

  // Load all assets specified in the manifest
  try {
    const loadedAssets = await PIXI.Assets.load(
      assetManifest.map((a) => a.alias),
    );
    console.log("Assets loaded successfully:", loadedAssets);
    return loadedAssets;
  } catch (error) {
    console.error("Error loading assets:", error);
    throw error; // Re-throw error to be caught by caller
  }
}

// Example Usage (you would call this from main.js):
/*
const assetsToLoad = [
    { alias: 'solderSprite', src: 'assets/images/Solder.png' },
    // Add other assets here, e.g.:
    // { alias: 'background', src: 'assets/images/arena_bg.png' },
    // { alias: 'uiSkin', src: 'assets/images/ui.json' } // Example spritesheet json
];

loadAssets(assetsToLoad)
    .then(resources => {
        // Assets are ready, proceed with game setup
        console.log("Access loaded solder sprite texture:", resources.solderSprite);
    })
    .catch(err => {
        // Handle loading failure
    });
*/
