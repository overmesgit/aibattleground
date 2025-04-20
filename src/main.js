import * as PIXI from "pixi.js";

import { createPixiApp } from "./core/application.js";
import { generateMap } from "./game/arena.js";

import { loadAssets } from "./core/loader.js";

let app;

const FRAME_WIDTH = 100;
const FRAME_HEIGHT = 100;

const ANIMATIONS = {
  idle: [0, 6],
  walk: [1, 8],
  attack1: [2, 6],
  attack2: [3, 6],
  shoot: [4, 9],
  heal: [5, 4],
  die: [6, 4],
};

function parseSpritesheet(baseTexture, animations) {
  const animationTextures = {};

  for (const [name, [rowIndex, frameCount]] of Object.entries(animations)) {
    const textures = [];
    for (let i = 0; i < frameCount; i++) {
      const frameX = i * FRAME_WIDTH;
      const frameY = rowIndex * FRAME_HEIGHT;
      const frameRect = new PIXI.Rectangle(
        frameX,
        frameY,
        FRAME_WIDTH,
        FRAME_HEIGHT,
      );

      textures.push(
        new PIXI.Texture({
          source: baseTexture,
          frame: frameRect,
        }),
      );
    }
    animationTextures[name] = textures;
  }
  return animationTextures;
}

async function initGame() {
  console.log("Initializing game...");

  app = await createPixiApp({
    width: 960,
    height: 960,
    backgroundColor: "72751b00",
  });

  const assetsToLoad = [
    {
      alias: "solderSheet",
      src: "assets/images/tinyrpg/Characters(100x100)/Soldier/Soldier/Soldier.png",
    },
    {
      alias: "tileset",
      src: "assets/images/Texture/TX Tileset Grass.png",
    },
  ];

  try {
    const loadedResources = await loadAssets(assetsToLoad);

    const solderBaseTexture = loadedResources.solderSheet;
    solderBaseTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

    console.log(
      "Soldier Base Texture dimensions:",
      solderBaseTexture.width,
      solderBaseTexture.height,
    );

    const soldierAnimations = parseSpritesheet(
      solderBaseTexture.baseTexture,
      ANIMATIONS,
    );

    const map = generateMap(app);
    app.stage.addChild(map);

    const soldier = new PIXI.AnimatedSprite(soldierAnimations.idle);

    soldier.anchor.set(0.5);
    soldier.x = app.screen.width / 2;
    soldier.y = app.screen.height / 2;
    soldier.scale.set(3);
    soldier.animationSpeed = 0.15;
    soldier.loop = true;

    app.stage.addChild(soldier);
    soldier.play();
  } catch (error) {
    const errorDiv = document.createElement("div");
    errorDiv.style.color = "red";
    errorDiv.style.position = "absolute";
    errorDiv.style.top = "10px";
    errorDiv.style.left = "10px";
    errorDiv.style.fontFamily = "sans-serif";
    errorDiv.textContent = `Error initializing game: ${error.message}`;
    document.body.appendChild(errorDiv);
  }
}

initGame();
