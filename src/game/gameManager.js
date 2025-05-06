import * as PIXI from "pixi.js";
import { createPixiApp } from "../core/application.js";
import { loadSpritesAndAnimations } from "../core/loader.js";
import { generateMap } from "./arena.js";
import { Unit } from "./unit.js";

export class GameManager {
  constructor() {
    this.app = null;
    this.mapContainer = null;
    this.animations = {};
    this.units = new Map(); // Use a Map to store units by ID
    this.tileSize = 0;
  }

  async initialize(config) {
    console.log("Initializing GameManager...");
    this.app = await createPixiApp(config.appOptions);
    this.tileSize = this.app.screen.width / 20; // Or get from config

    this.animations = await loadSpritesAndAnimations();
    this.mapContainer = generateMap(this.app);
    this.app.stage.addChild(this.mapContainer);

    // Optionally create a separate layer for units
    this.unitLayer = new PIXI.Container();
    this.app.stage.addChild(this.unitLayer);

    console.log("GameManager initialized.");
  }

  createUnits(unitDataList) {
    console.log("Creating units:", unitDataList);
    for (const unitData of unitDataList) {
      if (unitData.type === "soldier") {
        // Example: check unit type
        const unit = new Unit({
          id: unitData.unitID,
          type: unitData.type,
          animations: this.animations, // Pass all loaded animations
          tileSize: this.tileSize,
          container: this.unitLayer, // Add units to the unit layer
          initialPosition: unitData.position,
        });
        this.units.set(unit.id, unit);
      } else {
        console.warn(`Unit type \"${unitData.type}\" not recognized.`);
      }
    }
  }

  async processActions(actionsLog) {
    console.log("Processing actions:", actionsLog);
    // Small delay before starting actions
    await new Promise((resolve) => setTimeout(resolve, 500));

    for (const action of actionsLog) {
      if (action.action === "init") continue; // Skip init

      const unit = this.units.get(action.unitID);
      if (!unit) {
        console.warn(`Action for unknown unit ID: ${action.unitID}`, action);
        continue;
      }

      console.log(`Processing action: ${action.action} for unit ${unit.id}`);

      try {
        if (action.action === "move") {
          await unit.moveTo(action.position[0], action.position[1]);
        } else if (action.action === "attack") {
          // In a real game, you'd need target info here
          await unit.attack();
        } else {
          console.warn(`Unknown action type: \"${action.action}\".`);
        }
      } catch (error) {
        console.error(
          `Error processing action for unit ${unit.id}:`,
          action,
          error,
        );
        // Decide if you want to stop processing or continue with the next action
      }

      // Optional pause between actions for clarity
      // await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // Ensure units are idle at the end (might be handled within actions already)
    this.units.forEach((unit) => {
      if (
        unit.sprite.textures !== unit.animations.idle ||
        !unit.sprite.loop ||
        !unit.sprite.playing
      ) {
        unit.sprite.textures = unit.animations.idle;
        unit.sprite.loop = true;
        unit.sprite.play();
      }
    });

    console.log("Finished processing actions.");
  }

  // Add cleanup method if needed
  destroy() {
    console.log("Destroying GameManager...");
    // Destroy units
    this.units.forEach((unit) => unit.destroy());
    this.units.clear();

    // Destroy Pixi app instance
    if (this.app) {
      this.app.destroy(true, {
        children: true,
        texture: true,
        baseTexture: true,
      });
      this.app = null;
    }
    // Any other cleanup
  }
}
