import * as PIXI from "pixi.js";

const MAP_HEIGHT = 20;
const MAP_WIDTH = 20;
const TILE_TEXTURE_SIZE = 32;

export function generateMap(app) {
  const tileAtlasTexture = PIXI.Assets.get("tileset");
  const TILESET_COLS = 8;

  const scaledTileSize = app.screen.width / MAP_WIDTH;
  const mapContainer = new PIXI.Container();

  for (let y = 0; y < MAP_HEIGHT; y++) {
    for (let x = 0; x < MAP_WIDTH; x++) {
      const col = Math.floor(Math.random() * TILESET_COLS);
      const row = Math.floor(Math.random() * TILESET_COLS);

      const frameRect = new PIXI.Rectangle(
        col * TILE_TEXTURE_SIZE,
        row * TILE_TEXTURE_SIZE,
        TILE_TEXTURE_SIZE,
        TILE_TEXTURE_SIZE,
      );
      const mapTexture = new PIXI.Texture({
        source: tileAtlasTexture.source,
        frame: frameRect,
      });
      const tileSprite = new PIXI.Sprite(mapTexture);

      tileSprite.x = x * scaledTileSize;
      tileSprite.y = y * scaledTileSize;
      tileSprite.width = scaledTileSize;
      tileSprite.height = scaledTileSize;

      mapContainer.addChild(tileSprite);

      const border = new PIXI.Graphics();
      border.rect(
        tileSprite.x,
        tileSprite.y,
        scaledTileSize,
        scaledTileSize
      );
      border.stroke({width: 1, color: 0x006400});

      // Add border to the container
      mapContainer.addChild(border);
    }
  }
  return mapContainer;
}
