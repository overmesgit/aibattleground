import * as PIXI from "pixi.js";
const gsap = window.gsap;

import { createPixiApp } from "./core/application.js";
import { generateMap } from "./game/arena.js";
import { loadSpritesAndAnimations } from "./core/loader.js";

let app;

function getPosition(tile, tileSize) {
  return tile * tileSize + tileSize / 2;
}

async function initGame() {
  console.log("Initializing game...");

  app = await createPixiApp({
    width: 960,
    height: 960,
    backgroundColor: "72751b00",
  });
  const TILE_SIZE = app.screen.width / 20;

  const units = [{ unitID: 1, type: "soldier", position: [2, 2], health: 100 }];
  const actionsLog = [
    { action: "init" }, // Ignored by the loop below
    { action: "move", unitID: 1, position: [6, 6] },
    { action: "attack", unitID: 1, position: [4, 5] }, // Assume target is implicit
  ];

  try {
    const soldierAnimations = await loadSpritesAndAnimations();
    const map = generateMap(app);

    app.stage.addChild(map);
    const soldier = new PIXI.AnimatedSprite(soldierAnimations.idle);

    const [initialTileX, initialTileY] = units[0].position;
    soldier.anchor.set(0.5);
    soldier.x = getPosition(initialTileX, TILE_SIZE);
    soldier.y = getPosition(initialTileY, TILE_SIZE);
    soldier.scale.set(3);
    soldier.animationSpeed = 0.15;
    soldier.loop = true;

    app.stage.addChild(soldier);
    soldier.play(); // Start in idle

    // Small delay before starting actions
    await new Promise((resolve) => setTimeout(resolve, 500));

    for (const action of actionsLog) {
      // Skip the 'init' action if present
      if (action.action === "init") continue;

      if (action.action === "move") {
        const [tileX, tileY] = action.position;
        // Switch to walk animation
        soldier.textures = soldierAnimations.walk;
        soldier.loop = true; // Walk animation should loop
        soldier.play();

        // Animate position using GSAP
        await gsap.to(soldier, {
          x: getPosition(tileX, TILE_SIZE),
          y: getPosition(tileY, TILE_SIZE),
          duration: 1, // Move duration
        });

        // After move completes, switch back to idle
        soldier.textures = soldierAnimations.idle;
        soldier.loop = true;
        soldier.play();

        // Optional short pause after move before next action
        // await new Promise((resolve) => setTimeout(resolve, 200));
      } else if (action.action === "attack") {
        // Create a promise that resolves after attack animation + 1s delay + switch to idle
        let attackSequenceComplete = new Promise((resolveAttackSequence) => {
          // Ensure previous handlers are cleared
          soldier.onComplete = null;

          soldier.textures = soldierAnimations.attack1;
          soldier.loop = false; // Play attack once
          soldier.gotoAndPlay(0);

          // Define what happens when the attack animation finishes
          soldier.onComplete = () => {
            soldier.textures = soldierAnimations.idle;
            soldier.loop = true; // Idle loops
            soldier.play();
            // Clean up handler
            soldier.onComplete = null;
            // Resolve the promise now that the sequence is done
            resolveAttackSequence();
          };
        });

        // Wait for the entire attack sequence (animation + delay + switch) to finish
        await attackSequenceComplete;
      }
      // Optional short pause between actions in general for visual separation
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // Ensure soldier is definitely idle at the very end
    if (
      soldier.textures !== soldierAnimations.idle ||
      !soldier.loop ||
      !soldier.playing
    ) {
      soldier.textures = soldierAnimations.idle;
      soldier.loop = true;
      soldier.play();
    }
  } catch (error) {
    // Error handling remains the same
    const errorDiv = document.createElement("div");
    errorDiv.style.color = "red";
    errorDiv.style.position = "absolute";
    errorDiv.style.top = "10px";
    errorDiv.style.left = "10px";
    errorDiv.style.fontFamily = "sans-serif";
    errorDiv.innerHTML = `Error initializing game: ${error.message}`;
    errorDiv.innerHTML += error.stack
      .split("\n")
      .map((m) => `<br>${m}`)
      .join("");
    document.body.appendChild(errorDiv);
    console.error(error.stack);
  }
}

initGame();
