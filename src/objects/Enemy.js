// src/objects/Enemy.js

// Enemy types: robbers and thieves, each with unique color, size, and speed
const ENEMY_TYPES = [
  {
    key: "robber-small",
    label: "Small Robber",
    color: 0x2222cc,
    width: 16,
    height: 28,
    speed: 120,
  },
  {
    key: "robber-large",
    label: "Large Robber",
    color: 0x4444ff,
    width: 20,
    height: 36,
    speed: 80,
  },
  {
    key: "thief-fast",
    label: "Fast Thief",
    color: 0x22cc22,
    width: 16,
    height: 24,
    speed: 160,
  },
  {
    key: "thief-master",
    label: "Master Thief",
    color: 0xcc2222,
    width: 24,
    height: 32,
    speed: 220,
  },
];

export function getRandomEnemyType() {
  return ENEMY_TYPES[Math.floor(Math.random() * ENEMY_TYPES.length)];
}

export default class Enemy extends Phaser.GameObjects.Rectangle {
  constructor(scene, x, y, type) {
    super(scene, x, y, type.width, type.height, type.color);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setAllowGravity(false);
    this.body.setImmovable(true);
    this.type = type;
    this.speed = type.speed;
  }

  update() {
    this.x -= this.speed / 60; // Move left at type speed (approx. per frame)
    if (this.x < -this.width) {
      this.destroy();
    }
  }
}
