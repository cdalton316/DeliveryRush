// src/objects/Player.js
export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "player");
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
    this.play("player-idle");

    // Input
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.keys = scene.input.keyboard.addKeys({
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });
    this.moveSpeed = 200;

    // Camera follow
    scene.cameras.main.startFollow(this, true, 0.08, 0.08);
  }

  update() {
    let moving = false;
    if (this.cursors.left.isDown || this.keys.left.isDown) {
      this.setVelocityX(-this.moveSpeed);
      moving = true;
    } else if (this.cursors.right.isDown || this.keys.right.isDown) {
      this.setVelocityX(this.moveSpeed);
      moving = true;
    } else {
      this.setVelocityX(0);
    }

    // Animation switching
    if (moving) {
      if (
        this.anims.currentAnim &&
        this.anims.currentAnim.key !== "player-walk"
      ) {
        this.play("player-walk", true);
      }
    } else {
      if (
        this.anims.currentAnim &&
        this.anims.currentAnim.key !== "player-idle"
      ) {
        this.play("player-idle", true);
      }
    }
  }
}
