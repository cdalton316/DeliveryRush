# Copilot Instructions for Delivery Rush

## Project Overview

## Architecture & Patterns

## Game Logic & Design

- **Theme:** 2D platformer about a delivery person walking down a sidewalk in a neighborhood.
- **Player:** Moves left/right; a box orbits/circles around the player’s body.
- **Enemies:** Random people/animals approach the player in waves (4 types: kid on skateboard, man/woman walking, kid on bicycle, dog chasing cat).
  - Each enemy type has a unique speed (dog+cat fastest, then bicycle, skateboard, walking slowest).
  - If an enemy hits the box, the player loses a life (starts with 3 lives).
  - If an enemy hits the player (not the box), it passes through with no penalty.
- **Waves:** After a set number of enemy waves, the player reaches a house and completes the level.
  - Next level increases difficulty (e.g., more/faster enemies).
- **Background:** Side-scrolling neighborhood with houses, fences, driveways, cars, etc., to create a sense of movement.
- **Scene Structure:** Start with a single scene; expand to more scenes later.

- Asset folders (`assets/audio/`, `assets/images/`) are currently empty but reserved for future use.

## Developer Workflow

- **Run/Debug:** Open `index.html` in a browser. No build step is required; all scripts are loaded directly.
- **Add new scenes:** Create a new class in `src/scenes/`, import and add it to the `scene` array in the Phaser config in `main.js`.
- **Add new game objects:** Place reusable object classes in `src/objects/` and import them into scenes as needed.
- **Assets:** Place images and audio in the appropriate `assets/` subfolders and load them in the `preload()` method of a scene.

## Project Conventions

- Use ES6 modules for all new code (import/export syntax).
- Scene classes should extend `Phaser.Scene` and follow the `preload/create/update` lifecycle.
- Keep all hardcoded values (positions, colors, etc.) in the scene or config for easy adjustment.
- Use descriptive names for scenes and objects.

## Key Files

- `index.html`: Loads Phaser and the main script.
- `src/main.js`: Game configuration and entry point.
- `src/scenes/GameScene.js`: Main gameplay logic.
- `assets/`: Reserved for images and audio.

## Example: Adding a New Scene

```js
// src/scenes/MyNewScene.js
export default class MyNewScene extends Phaser.Scene {
  constructor() {
    super({ key: "MyNewScene" });
  }
  preload() {
    /* load assets */
  }
  create() {
    /* set up objects */
  }
  update() {
    /* game loop */
  }
}
```

Then import and add to the config in `main.js`:

```js
import MyNewScene from './scenes/MyNewScene.js';
const config = { ... scene: [GameScene, MyNewScene] };
```

---

If you add new conventions or workflows, update this file to help future AI agents and developers.
