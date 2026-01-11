// src/scenes/MenuScene.js
export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "MenuScene" });
  }

  create() {
    // Centered title
    this.add
      .text(400, 180, "Delivery Rush", {
        font: "48px Arial",
        fill: "#fff",
        align: "center",
      })
      .setOrigin(0.5);

    // Centered Start Game button
    const startText = this.add
      .text(400, 320, "Start Game", {
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
        startText.setStyle({ fill: "#fff", backgroundColor: "#555" })
      )
      .on("pointerout", () =>
        startText.setStyle({ fill: "#ff0", backgroundColor: "#333" })
      );
  }
}
