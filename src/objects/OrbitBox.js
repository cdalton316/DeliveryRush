// src/objects/OrbitBox.js
export default class OrbitBox extends Phaser.GameObjects.Rectangle {
  constructor(scene, player, radius = 40, speed = 2) {
    super(scene, player.x, player.y, 12, 12, 0xffcc00);
    scene.add.existing(this);
    this.player = player;
    this.radius = radius;
    this.speed = speed; // radians per second
    this.angleRad = 0;
  }

  update(time, delta) {
    this.angleRad += this.speed * (delta / 1000);
    // Keep angle in [0, 2π]
    if (this.angleRad > Math.PI * 2) this.angleRad -= Math.PI * 2;
    // Calculate new position
    this.x = this.player.x + this.radius * Math.cos(this.angleRad);
    this.y = this.player.y + this.radius * Math.sin(this.angleRad);
  }
}
