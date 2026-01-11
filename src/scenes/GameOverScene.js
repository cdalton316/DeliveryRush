// src/scenes/GameOverScene.js
export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameOverScene" });
  }

  create(data) {
    // Semi-transparent overlay
    this.add.rectangle(400, 300, 800, 600, 0x000000, 0.7);
    this.add
      .text(400, 200, "Game Over", {
        font: "48px Arial",
        fill: "#ff4444",
        align: "center",
      })
      .setOrigin(0.5);

    // Show stats if provided
    const stats = data && data.stats ? data.stats : {};
    this.add
      .text(400, 280, `Score: ${stats.score || 0}`, {
        font: "32px Arial",
        fill: "#fff",
        align: "center",
      })
      .setOrigin(0.5);

    // Restart button
    const restartText = this.add
      .text(400, 380, "Try Again", {
        font: "32px Arial",
        fill: "#ff0",
        backgroundColor: "#333",
        padding: { left: 20, right: 20, top: 10, bottom: 10 },
        align: "center",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        this.scene.stop("GameScene");
        this.scene.start("GameScene");
      })
      .on("pointerover", () =>
        restartText.setStyle({ fill: "#fff", backgroundColor: "#555" })
      )
      .on("pointerout", () =>
        restartText.setStyle({ fill: "#ff0", backgroundColor: "#333" })
      );

    // Main Menu button
    const menuText = this.add
      .text(400, 440, "Main Menu", {
        font: "28px Arial",
        fill: "#fff",
        backgroundColor: "#333",
        padding: { left: 16, right: 16, top: 8, bottom: 8 },
        align: "center",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        this.scene.stop("GameScene");
        this.scene.start("MenuScene");
      })
      .on("pointerover", () =>
        menuText.setStyle({ fill: "#ff0", backgroundColor: "#555" })
      )
      .on("pointerout", () =>
        menuText.setStyle({ fill: "#fff", backgroundColor: "#333" })
      );
  }
}
