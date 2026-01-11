// src/scenes/PauseScene.js
export default class PauseScene extends Phaser.Scene {
  constructor() {
    super({ key: "PauseScene" });
  }

  create() {
    // Semi-transparent overlay
    this.add.rectangle(400, 300, 800, 600, 0x000000, 0.7);
    this.add
      .text(400, 220, "Paused", {
        font: "48px Arial",
        fill: "#fff",
        align: "center",
      })
      .setOrigin(0.5);

    // Resume button
    const resumeText = this.add
      .text(400, 320, "Resume", {
        font: "32px Arial",
        fill: "#ff0",
        backgroundColor: "#333",
        padding: { left: 20, right: 20, top: 10, bottom: 10 },
        align: "center",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        this.scene.stop();
        this.scene.resume("GameScene");
      })
      .on("pointerover", () =>
        resumeText.setStyle({ fill: "#fff", backgroundColor: "#555" })
      )
      .on("pointerout", () =>
        resumeText.setStyle({ fill: "#ff0", backgroundColor: "#333" })
      );

    // Restart button
    const restartText = this.add
      .text(400, 380, "Restart", {
        font: "32px Arial",
        fill: "#ffcc00",
        backgroundColor: "#333",
        padding: { left: 20, right: 20, top: 10, bottom: 10 },
        align: "center",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        this.scene.stop("GameScene");
        this.scene.start("GameScene");
        this.scene.stop();
      })
      .on("pointerover", () =>
        restartText.setStyle({ fill: "#fff", backgroundColor: "#555" })
      )
      .on("pointerout", () =>
        restartText.setStyle({ fill: "#ffcc00", backgroundColor: "#333" })
      );

    // Main Menu button
    const menuText = this.add
      .text(400, 440, "Main Menu", {
        font: "32px Arial",
        fill: "#ff6666",
        backgroundColor: "#333",
        padding: { left: 20, right: 20, top: 10, bottom: 10 },
        align: "center",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        this.scene.stop("GameScene");
        this.scene.start("MenuScene");
        this.scene.stop();
      })
      .on("pointerover", () =>
        menuText.setStyle({ fill: "#fff", backgroundColor: "#555" })
      )
      .on("pointerout", () =>
        menuText.setStyle({ fill: "#ff6666", backgroundColor: "#333" })
      );

    // Keyboard shortcuts
    this.input.keyboard.on("keydown-ESC", () => {
      this.scene.resume("GameScene");
      this.scene.stop();
    });
    this.input.keyboard.on("keydown-P", () => {
      this.scene.resume("GameScene");
      this.scene.stop();
    });
  }
}
