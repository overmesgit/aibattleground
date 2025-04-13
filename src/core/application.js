import * as PIXI from "pixi.js";

// Simple function to create and configure the Pixi Application
export async function createPixiApp(options = {}) {
  const defaultOptions = {
    width: 800, // Default width
    height: 600, // Default height
    backgroundColor: 0x1099bb, // Default background color (Pixi blue)
    resolution: window.devicePixelRatio || 1, // Adjust for device pixel ratio
    autoDensity: true, // Handles high-DPI screens
    antialias: false, // Pixel art often looks better without antialiasing
    // Preference for rendering engine, WebGL is generally preferred
    // powerPreference: 'high-performance',
    // resizeTo: window // Optional: Make the canvas fill the window
    ...options, // Allow overriding defaults
  };

  const app = new PIXI.Application();

  // Initialize the application with the options
  await app.init(defaultOptions);

  // Add the PixiJS canvas to the HTML document
  document.body.appendChild(app.canvas);

  console.log("PixiJS Application created and added to DOM.");

  // Optional: Log PixiJS version and renderer type
  console.log(`PixiJS version: ${PIXI.VERSION}`);

  return app;
}

// If you prefer a class-based approach (alternative):
/*
export class PixiApplication {
    constructor(options = {}) {
        this.defaultOptions = {
            width: 800,
            height: 600,
            backgroundColor: 0x1099bb,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
            antialias: false, // Pixel art friendly
            ...options
        };
        this.app = null;
    }

    async init() {
        this.app = new PIXI.Application();
        await this.app.init(this.defaultOptions);
        document.body.appendChild(this.app.canvas);
        console.log("PixiJS Application created and added to DOM.");
        console.log(`PixiJS version: ${PIXI.VERSION}`);
        console.log(`Renderer: ${this.app.renderer.type === PIXI.RENDERER_TYPE.WEBGL ? 'WebGL' : 'Canvas'}`);
    }

    get stage() {
        return this.app?.stage;
    }

    get renderer() {
        return this.app?.renderer;
    }

    get view() {
        return this.app?.canvas;
    }
}
*/
