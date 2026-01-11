// src/scenes/BootScene.js
export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: "BootScene" });
  }

  preload() {
    // Preload basic assets here (e.g., logo, loading bar, minimal UI)
    // Example: this.load.image('logo', 'assets/images/logo.png');
  }

  create() {
    this.add.text(320, 280, "Loading...", { font: "24px Arial", fill: "#fff" });
    // For now, immediately start MenuScene (to be implemented next)
    this.scene.start("MenuScene");
  }
}
