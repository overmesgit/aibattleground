import * as PIXI from "pixi.js";
const gsap = window.gsap;

import {createPixiApp} from "./core/application.js";
import {generateMap} from "./game/arena.js";

import {loadSpritesAndAnimations} from "./core/loader.js";

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

  const units = [
    {"unitID": 1, "type": "soldier", "position": [2, 2], "health": 100},
  ]
  const actionsLog = [
    {"action": "init"},
    {"action": "move", "unitID": 1, "position": [6, 6]},
    {"action": "attack", "unitID": 1, "position": [4, 5]},
  ]

  try {
    const soldierAnimations = await loadSpritesAndAnimations();
    const map = generateMap(app);

    app.stage.addChild(map);
    const soldier = new PIXI.AnimatedSprite(soldierAnimations.idle);

    const [tileX, tileY] = units[0].position;
    soldier.anchor.set(0.5);
    soldier.x = getPosition(tileX, TILE_SIZE);
    soldier.y = getPosition(tileY, TILE_SIZE);
    soldier.scale.set(3);
    soldier.animationSpeed = 0.15;
    soldier.loop = true;

    app.stage.addChild(soldier);
    soldier.play();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    for (const action of actionsLog) {
      if (action.action === "move") {
        const [tileX, tileY] = action.position;
        soldier.textures = soldierAnimations.walk;
        soldier.play();
        gsap.to(soldier, {
          x: getPosition(tileX, TILE_SIZE),
          y: getPosition(tileY, TILE_SIZE),
          duration: 1,
        });
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } else if (action.action === "attack") {
        // soldier.textures = soldierAnimations.attack1;
        // soldier.play();
      }
    }
  } catch (error) {
    const errorDiv = document.createElement("div");
    errorDiv.style.color = "red";
    errorDiv.style.position = "absolute";
    errorDiv.style.top = "10px";
    errorDiv.style.left = "10px";
    errorDiv.style.fontFamily = "sans-serif";
    errorDiv.innerHTML = `Error initializing game: ${error.message}`;
    errorDiv.innerHTML += error.stack.split('\n').map((m) => `<br>${m}`).join('');
    document.body.appendChild(errorDiv);
    console.error(error.stack);
  }
}

initGame();
