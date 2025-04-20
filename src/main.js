import * as PIXI from "pixi.js";

import {createPixiApp} from "./core/application.js";
import {generateMap} from "./game/arena.js";

import {loadSpritesAndAnimations} from "./core/loader.js";

let app;

async function initGame() {
    console.log("Initializing game...");

    app = await createPixiApp({
        width: 960,
        height: 960,
        backgroundColor: "72751b00",
    });

    try {
        const soldierAnimations = await loadSpritesAndAnimations();
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
        errorDiv.innerHTML = `Error initializing game: ${error.message}`;
        errorDiv.innerHTML += error.stack.split('\n').map((m) => `<br>${m}`).join('');
        document.body.appendChild(errorDiv);
        console.error(error.stack);
    }
}

initGame();
