import * as PIXI from "pixi.js";

export async function createPixiApp(options = {}) {
  const defaultOptions = {
    width: 800,
    height: 600,
    backgroundColor: 0x1099bb,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
    antialias: false,
    ...options,
  };

  const app = new PIXI.Application();
  await app.init(defaultOptions);
  document.body.appendChild(app.canvas);
  console.log("PixiJS Application created and added to DOM.");
  return app;
}
