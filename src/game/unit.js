import * as PIXI from "pixi.js";
const gsap = window.gsap;

// Helper function (can be kept here or moved to a utils file)
function getPosition(tile, tileSize) {
  return tile * tileSize + tileSize / 2;
}

export class Unit {
  constructor(config) {
    this.id = config.id;
    this.type = config.type;
    this.animations = config.animations; // e.g., { idle: [...], walk: [...], ... }
    this.tileSize = config.tileSize;
    this.container = config.container; // The PIXI stage or a unit layer container

    this.sprite = new PIXI.AnimatedSprite(this.animations.idle);
    this.sprite.anchor.set(0.5);
    this.sprite.scale.set(3); // Consider making this configurable
    this.sprite.animationSpeed = 0.15; // Consider making this configurable
    this.sprite.loop = true;

    this.setTilePosition(config.initialPosition[0], config.initialPosition[1]);
    this.container.addChild(this.sprite);
    this.sprite.play();
  }

  setTilePosition(tileX, tileY) {
    this.tileX = tileX;
    this.tileY = tileY;
    this.sprite.x = getPosition(tileX, this.tileSize);
    this.sprite.y = getPosition(tileY, this.tileSize);
  }

  async moveTo(targetTileX, targetTileY) {
    this.sprite.textures = this.animations.walk;
    this.sprite.loop = true;
    this.sprite.play();

    await gsap.to(this.sprite, {
      x: getPosition(targetTileX, this.tileSize),
      y: getPosition(targetTileY, this.tileSize),
      duration: 1, // Make duration configurable?
    });

    this.tileX = targetTileX;
    this.tileY = targetTileY;

    // Switch back to idle after moving
    this.sprite.textures = this.animations.idle;
    this.sprite.loop = true;
    this.sprite.play();
  }

  async attack() {
    // Return a promise that resolves when the entire attack sequence is done
    return new Promise((resolve) => {
      // Ensure previous handlers are cleared
      this.sprite.onComplete = null;

      this.sprite.textures = this.animations.attack1;
      this.sprite.loop = false;
      this.sprite.gotoAndPlay(0);

      this.sprite.onComplete = () => {
        this.sprite.textures = this.animations.idle;
        this.sprite.loop = true;
        this.sprite.play();
        this.sprite.onComplete = null;
        resolve();
      };
    });
  }

  // Add other methods like die(), takeDamage(), etc. later if needed

  destroy() {
    // Clean up GSAP tweens if any are active
    gsap.killTweensOf(this.sprite);
    // Remove sprite from the stage
    this.container.removeChild(this.sprite);
    // Destroy the sprite and its textures if necessary (Pixi handles some of this)
    this.sprite.destroy({ children: true, texture: false, baseTexture: false });
  }
}
