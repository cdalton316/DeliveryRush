// src/scenes/LevelCompleteScene.js
export default class LevelCompleteScene extends Phaser.Scene {
  constructor() {
    super({ key: "LevelCompleteScene" });
  }

  create(data) {
    // Semi-transparent overlay
    this.add.rectangle(400, 300, 800, 600, 0x000000, 0.7);
    this.add
      .text(400, 180, "Delivery Complete!", {
        font: "48px Arial",
        fill: "#44ff44",
        align: "center",
      })
      .setOrigin(0.5);

    // Show stats if provided
    const stats = data && data.stats ? data.stats : {};
    this.add
      .text(400, 260, `Total Score: ${stats.score || 0}`, {
        font: "32px Arial",
        fill: "#fff",
        align: "center",
      })
      .setOrigin(0.5);
    this.add
      .text(400, 295, `Level Score: ${stats.levelScore || 0}`, {
        font: "24px Arial",
        fill: "#ff0",
        align: "center",
      })
      .setOrigin(0.5);
    this.add
      .text(400, 310, `Level: ${stats.level || 1}`, {
        font: "28px Arial",
        fill: "#fff",
        align: "center",
      })
      .setOrigin(0.5);

    // Next Level button
    const nextText = this.add
      .text(400, 400, "Next Level", {
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
        // Pass next level number and running totalScore to GameScene
        const nextLevel = (stats.level || 1) + 1;
        this.scene.start("GameScene", {
          level: nextLevel,
          totalScore: stats.score,
        });
      })
      .on("pointerover", () =>
        nextText.setStyle({ fill: "#fff", backgroundColor: "#555" })
      )
      .on("pointerout", () =>
        nextText.setStyle({ fill: "#ff0", backgroundColor: "#333" })
      );

    // Main Menu button
    const menuText = this.add
      .text(400, 460, "Main Menu", {
        font: "28px Arial",
        fill: "#fff",
        backgroundColor: "#333",
        padding: { left: 16, right: 16, top: 8, bottom: 8 },
        align: "center",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        this.scene.stop();
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
