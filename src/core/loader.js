import * as PIXI from "pixi.js";

const assetsToLoad = [
    {
        alias: "solderSheet",
        src: "assets/images/tinyrpg/Characters(100x100)/Soldier/Soldier/Soldier.png",
        data: {scaleMode: PIXI.SCALE_MODES.NEAREST},
    },
    {
        alias: "tileset",
        src: "assets/images/Texture/TX Tileset Grass.png",
    },
];

export async function loadSpritesAndAnimations() {
    const loadedResources = await loadAssets(assetsToLoad);
    const solderBaseTexture = loadedResources.solderSheet;

    const soldierAnimations = parseSpritesheet(
        solderBaseTexture.source,
        ANIMATIONS,
    );
    return soldierAnimations;
}

export async function loadAssets(assetManifest) {
    for (const asset of assetManifest) {
        PIXI.Assets.add({alias: asset.alias, src: asset.src, data: asset.data});
    }


    return await PIXI.Assets.load(
        assetManifest.map((a) => a.alias),
    );
}

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
