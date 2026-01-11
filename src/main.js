// src/main.js

import BootScene from "./scenes/BootScene.js";
import MenuScene from "./scenes/MenuScene.js";
import GameScene from "./scenes/GameScene.js";
import PauseScene from "./scenes/PauseScene.js";
import GameOverScene from "./scenes/GameOverScene.js";
import LevelCompleteScene from "./scenes/LevelCompleteScene.js";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: "#87ceeb", // sky blue
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: [
    BootScene,
    MenuScene,
    GameScene,
    PauseScene,
    GameOverScene,
    LevelCompleteScene,
  ],
};

const game = new Phaser.Game(config);
