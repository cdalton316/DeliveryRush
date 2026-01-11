// src/scenes/GameScene.js
import Player from "../objects/Player.js";
import OrbitBox from "../objects/OrbitBox.js";
import Enemy, { getRandomEnemyType } from "../objects/Enemy.js";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  preload() {
    // Only create the player-sheet texture if it doesn't exist
    if (!this.textures.exists("player-sheet")) {
      const canvas = this.textures.createCanvas(
        "player-sheet",
        48,
        64,
        undefined,
        true
      );
      // Idle frames (blue)
      canvas.context.fillStyle = "#3399ff";
      canvas.context.fillRect(0, 0, 16, 32);
      canvas.context.fillRect(16, 0, 16, 32);
      canvas.context.fillRect(32, 0, 16, 32);
      // Walk frames (green)
      canvas.context.fillStyle = "#33ff99";
      canvas.context.fillRect(0, 32, 16, 32);
      canvas.context.fillRect(16, 32, 16, 32);
      canvas.context.fillRect(32, 32, 16, 32);
      canvas.refresh();
      this.textures.addSpriteSheet("player", canvas.getCanvas(), {
        frameWidth: 16,
        frameHeight: 32,
      });
    }
  }

  create(data) {
    // --- Difficulty Multiplier UI ---
    // Level cap for scaling
    const cappedLevel = Math.min(data && data.level ? data.level : 1, 10);
    this.difficultyMultiplier = 1 + 0.1 * (cappedLevel - 1);
    this.difficultyText = this.add
      .text(400, 30, `Difficulty: x${this.difficultyMultiplier.toFixed(1)}`, {
        font: "22px Arial",
        fill: this.difficultyMultiplier > 1 ? "#ff4444" : "#fff",
        align: "center",
        backgroundColor: this.difficultyMultiplier > 1 ? "#222" : "#0000",
      })
      .setOrigin(0.5)
      .setScrollFactor(0);

    // Show a visual indicator at level start if difficulty > 1
    if (this.difficultyMultiplier > 1) {
      const indicator = this.add
        .text(
          400,
          200,
          `Enemies are FASTER! (x${this.difficultyMultiplier.toFixed(1)})`,
          {
            font: "bold 32px Arial",
            fill: "#ff4444",
            align: "center",
            backgroundColor: "#222",
          }
        )
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(100);
      this.tweens.add({
        targets: indicator,
        alpha: 0,
        duration: 1800,
        delay: 1200,
        onComplete: () => indicator.destroy(),
      });
    }
    // --- Camera and World Bounds ---
    // Extend world width to allow camera scrolling
    // Start with world size 1600px wide (2x screen width)
    this.worldWidth = 1600;
    this.physics.world.setBounds(0, 0, this.worldWidth, 600);
    this.cameras.main.setBounds(0, 0, this.worldWidth, 600);

    // --- Parallax Background Layers (placeholder graphics) ---
    this.bgFar = this.add.tileSprite(400, 300, 800, 600, null);
    this.bgNear = this.add.tileSprite(400, 300, 800, 600, null);
    this.bgGround = this.add.tileSprite(400, 300, 800, 600, null);

    // Draw far houses (blue rectangles)
    if (!this.textures.exists("bg-far")) {
      const farGfx = this.make.graphics({ x: 0, y: 0, add: false });
      for (let i = 0; i < 8; i++) {
        farGfx.fillStyle(0x99bbff, 1);
        farGfx.fillRect(i * 100 + 10, 120, 80, 60);
      }
      farGfx.generateTexture("bg-far", 800, 600);
    }
    this.bgFar.setTexture("bg-far");

    // Draw near houses (yellow rectangles, some with fences/cars)
    if (!this.textures.exists("bg-near")) {
      const nearGfx = this.make.graphics({ x: 0, y: 0, add: false });
      for (let i = 0; i < 8; i++) {
        nearGfx.fillStyle(0xffe066, 1);
        nearGfx.fillRect(i * 100 + 20, 220, 60, 60);
        // Fence
        if (i % 2 === 0) {
          nearGfx.fillStyle(0xcccccc, 1);
          nearGfx.fillRect(i * 100 + 20, 280, 60, 8);
        }
        // Driveway & car
        if (i % 3 === 0) {
          nearGfx.fillStyle(0x888888, 1);
          nearGfx.fillRect(i * 100 + 60, 280, 20, 20);
          nearGfx.fillStyle(0x3366cc, 1);
          nearGfx.fillRect(i * 100 + 65, 285, 10, 10);
        }
      }
      nearGfx.generateTexture("bg-near", 800, 600);
    }
    this.bgNear.setTexture("bg-near");

    // Draw ground (sidewalk, grass)
    if (!this.textures.exists("bg-ground")) {
      const groundGfx = this.make.graphics({ x: 0, y: 0, add: false });
      groundGfx.fillStyle(0x77cc77, 1); // grass
      groundGfx.fillRect(0, 340, 800, 60);
      groundGfx.fillStyle(0xdddddd, 1); // sidewalk
      groundGfx.fillRect(0, 400, 800, 40);
      groundGfx.generateTexture("bg-ground", 800, 600);
    }
    this.bgGround.setTexture("bg-ground");

    // Send backgrounds to back
    this.children.sendToBack(this.bgGround);
    this.children.sendToBack(this.bgNear);
    this.children.sendToBack(this.bgFar);

    // --- Player and Game Setup ---
    // Level/house system
    this.level = data && data.level ? data.level : 1;
    this.house = null;
    this.houseIndicator = null;
    this.levelCompleteTriggered = false;
    // Distance and score system
    this.distance = 0;
    this.totalScore =
      data && typeof data.totalScore === "number" ? data.totalScore : 0;
    this.highScore = parseInt(localStorage.getItem("highScore") || "0", 10);
    this.distanceText = this.add
      .text(400, 100, `Distance: 0m`, {
        font: "24px Arial",
        fill: "#fff",
        align: "center",
      })
      .setOrigin(0.5)
      .setScrollFactor(0);
    this.scoreText = this.add
      .text(400, 130, `Score: ${this.totalScore}`, {
        font: "20px Arial",
        fill: "#ff0",
        align: "center",
      })
      .setOrigin(0.5)
      .setScrollFactor(0);
    this.highScoreText = this.add
      .text(400, 160, `High Score: ${this.highScore}m`, {
        font: "18px Arial",
        fill: "#ff0",
        align: "center",
      })
      .setOrigin(0.5)
      .setScrollFactor(0);
    // Enemy group and spawn timer setup
    this.enemies = this.physics.add.group();
    this.enemySpawnTimer = 0;
    // Difficulty scaling: base interval, will decrease after level 3
    this.enemySpawnInterval = 1500;

    // Wave system
    this.wave = 1;
    this.maxWaves = 12;
    this.waveEnemies = [];
    this.waveActive = false;
    this.waveText = this.add
      .text(400, 60, `Wave: ${this.wave}/${this.maxWaves}`, {
        font: "28px Arial",
        fill: "#fff",
        align: "center",
      })
      .setOrigin(0.5)
      .setScrollFactor(0);

    // Difficulty scaling logic for waves
    this.startWave = () => {
      this.waveActive = true;
      this.waveEnemies = [];
      // --- Difficulty scaling ---
      const cappedLevel = Math.min(this.level, 10);
      let minEnemies = 2;
      let maxEnemies = 3;
      if (cappedLevel > 3) {
        minEnemies = 3;
        maxEnemies = 5;
      }
      const numEnemies = Phaser.Math.Between(minEnemies, maxEnemies);
      this.enemySpawnInterval = 1500;
      if (cappedLevel > 3) {
        this.enemySpawnInterval = Math.max(700, 1500 - (cappedLevel - 3) * 100);
      }
      const speedMultiplier = 1 + 0.1 * (cappedLevel - 1);
      this.difficultyMultiplier = speedMultiplier;
      this.difficultyText.setText(`Difficulty: x${speedMultiplier.toFixed(1)}`);
      this.difficultyText.setFill(speedMultiplier > 1 ? "#ff4444" : "#fff");
      this.difficultyText.setBackgroundColor(
        speedMultiplier > 1 ? "#222" : "#0000"
      );
      const minSpawnX = Math.max(
        this.cameras.main.worldView.right,
        this.player.x + 100
      );
      for (let i = 0; i < numEnemies; i++) {
        const y = this.player ? this.player.y : 300;
        const type = getRandomEnemyType();
        const x = minSpawnX + i * 30;
        if (x > this.player.x) {
          // Clone type and scale speed
          const scaledType = {
            ...type,
            speed: Math.round(type.speed * speedMultiplier),
          };
          const enemy = new Enemy(this, x, y, scaledType);
          enemy.spawnX = x;
          enemy.hasPassed = false; // Track if enemy has passed player
          // --- Visual indicator for fast enemies ---
          if (speedMultiplier > 1) {
            enemy.setStrokeStyle(3, 0xff4444);
            this.tweens.add({
              targets: enemy,
              alpha: 0.5,
              yoyo: true,
              repeat: 2,
              duration: 120,
              onComplete: () => enemy.setAlpha(1),
            });
          }
          this.enemies.add(enemy);
          this.waveEnemies.push(enemy);
        }
      }
      this.waveText.setText(`Wave: ${this.wave}/${this.maxWaves}`);
    };

    // Helper to add more environment when world extends
    this.addEnvironment = (startX, endX) => {
      // Add more far houses
      for (let i = Math.floor(startX / 100); i < Math.floor(endX / 100); i++) {
        this.add.rectangle(i * 100 + 10, 120, 80, 60, 0x99bbff).setDepth(-3);
      }
      // Add more near houses, fences, cars
      for (let i = Math.floor(startX / 100); i < Math.floor(endX / 100); i++) {
        this.add.rectangle(i * 100 + 20, 220, 60, 60, 0xffe066).setDepth(-2);
        if (i % 2 === 0) {
          this.add.rectangle(i * 100 + 20, 280, 60, 8, 0xcccccc).setDepth(-2);
        }
        if (i % 3 === 0) {
          this.add.rectangle(i * 100 + 60, 280, 20, 20, 0x888888).setDepth(-2);
          this.add.rectangle(i * 100 + 65, 285, 10, 10, 0x3366cc).setDepth(-2);
        }
      }
      // Add more ground (sidewalk, grass)
      this.add
        .rectangle(startX, 370, endX - startX, 60, 0x77cc77)
        .setOrigin(0, 0.5)
        .setDepth(-1);
      this.add
        .rectangle(startX, 420, endX - startX, 40, 0xdddddd)
        .setOrigin(0, 0.5)
        .setDepth(-1);
    };

    // Add player character (left side, vertically centered)
    this.player = new Player(this, 60, 300);

    // Add a longer delay before the first wave spawns
    this.time.delayedCall(2500, () => this.startWave());
    this.anims.create({
      key: "player-idle",
      frames: this.anims.generateFrameNumbers("player", { start: 0, end: 2 }),
      frameRate: 3,
      repeat: -1,
    });
    this.anims.create({
      key: "player-walk",
      frames: this.anims.generateFrameNumbers("player", { start: 3, end: 5 }),
      frameRate: 6,
      repeat: -1,
    });

    // Add orbiting box
    this.orbitBox = new OrbitBox(this, this.player, 40, 2);

    // Enable Arcade Physics for orbitBox
    this.physics.add.existing(this.orbitBox);
    this.orbitBox.body.setAllowGravity(false);
    this.orbitBox.body.setImmovable(true);

    // Player lives and invincibility
    this.lives = 7;
    this.invincible = false;
    this.invincibleTimer = null;

    // Display lives (top left)
    this.livesText = this.add
      .text(16, 16, `Lives: ${this.lives}`, {
        font: "20px Arial",
        fill: "#fff",
      })
      .setScrollFactor(0);

    // Collisions: enemy with orbitBox (lose life), enemy with player (pass through)
    this.physics.add.overlap(this.orbitBox, this.enemies, (box, enemy) => {
      if (this.invincible) return;
      enemy.destroy();
      this.lives--;
      this.livesText.setText(`Lives: ${this.lives}`);
      // Show damage effect (tint box, shake camera)
      this.orbitBox.setFillStyle(0xff4444);
      this.cameras.main.shake(150, 0.01);
      // Play sound if available
      if (this.sound.get("loseLife")) this.sound.play("loseLife");
      this.invincible = true;
      // End invincibility after 1.5s
      this.time.delayedCall(1500, () => {
        this.invincible = false;
        this.orbitBox.setFillStyle(0xffcc00);
      });
      // Game over if lives <= 0
      if (this.lives <= 0) {
        const bonus = 0;
        const levelScore = Math.floor(this.distance) + bonus;
        // Add this level's score to the running total
        this.totalScore += levelScore;
        const highScore = parseInt(
          localStorage.getItem("highScore") || "0",
          10
        );
        if (this.totalScore > highScore) {
          localStorage.setItem("highScore", this.totalScore);
        }
        this.scene.start("GameOverScene", {
          stats: {
            score: this.totalScore,
            levelScore,
            distance: Math.floor(this.distance),
            lives: 0,
            bonus,
            level: this.level,
            highScore: Math.max(this.totalScore, highScore),
          },
        });
      }
      console.log("Box hit by enemy!");
    });
    this.physics.add.overlap(this.player, this.enemies, (player, enemy) => {
      // Enemy passes through player (no penalty)
      console.log("Enemy passed through player.");
    });

    // Pause functionality
    this.input.keyboard.on("keydown-ESC", () => {
      if (!this.scene.isPaused("GameScene")) {
        this.scene.launch("PauseScene");
        this.scene.pause();
      }
    });
    this.input.keyboard.on("keydown-P", () => {
      if (!this.scene.isPaused("GameScene")) {
        this.scene.launch("PauseScene");
        this.scene.pause();
      }
    });

    // Remove nextExtensionX logic, use fixed distance from right edge for extension
  }

  update(time, delta) {
    // Dynamically extend world as player approaches right edge
    // Extend earlier (1200px from edge) for smoother transition
    const distanceFromEdge = 1200;
    if (this.player.x > this.worldWidth - distanceFromEdge) {
      const oldWorldWidth = this.worldWidth;
      this.worldWidth += 1600; // Extend more at once for smoother experience
      this.physics.world.setBounds(0, 0, this.worldWidth, 600);
      this.cameras.main.setBounds(0, 0, this.worldWidth, 600);
      this.bgFar.width = this.worldWidth;
      this.bgNear.width = this.worldWidth;
      this.bgGround.width = this.worldWidth;
      if (this.addEnvironment)
        this.addEnvironment(oldWorldWidth, this.worldWidth);
    }
    // Prevent player from moving past left edge
    if (this.player.x <= 0) this.player.x = 0;
    // Scroll environmental details with ground layer
    if (this.bgDetails) {
      this.bgDetails.x = -this.bgGround.tilePositionX % 800;
    }
    // --- Parallax background scrolling ---
    let scrollSpeed = 0;
    if (this.player && this.player.body.velocity.x !== 0) {
      scrollSpeed = this.player.body.velocity.x / 200; // 1 for full speed
    }
    // Far moves slowest, ground fastest
    this.bgFar.tilePositionX += scrollSpeed * 0.2;
    this.bgNear.tilePositionX += scrollSpeed * 0.5;
    this.bgGround.tilePositionX += scrollSpeed * 1.0;
    // Distance scoring: always increases, faster if player moves right
    let speed = 1;
    if (this.player && this.player.body.velocity.x > 0) {
      speed = 3;
    }
    this.distance += speed * (delta / 16.67); // ~60fps base
    this.distanceText.setText(`Distance: ${Math.floor(this.distance)}m`);
    this.scoreText.setText(`Score: ${this.totalScore}`);
    // Update high score if needed
    if (this.totalScore > this.highScore) {
      this.highScore = this.totalScore;
      this.highScoreText.setText(`High Score: ${this.highScore}m`);
      localStorage.setItem("highScore", this.highScore);
    }
    if (this.player && this.player.update) {
      this.player.update();
    }
    if (this.orbitBox && this.orbitBox.update) {
      this.orbitBox.update(time, delta);
    }

    // Robust waveEnemies management - enemy must cross left of the PLAYER to be considered passed
    const playerX = this.player.x;
    const newWaveEnemies = [];
    for (const enemy of this.waveEnemies) {
      let remove = false;
      if (!enemy.active) {
        console.log("Enemy removed: destroyed", {
          spawnX: enemy.spawnX,
          x: enemy.x,
          playerX,
          hasPassed: enemy.hasPassed,
        });
        remove = true;
      } else if (!enemy.hasPassed && enemy.x < playerX) {
        // Enemy has crossed left of the player - mark as passed
        enemy.hasPassed = true;
        console.log("Enemy removed: passed player", {
          spawnX: enemy.spawnX,
          x: enemy.x,
          playerX,
          hasPassed: enemy.hasPassed,
        });
        remove = true;
      }
      if (!remove) {
        newWaveEnemies.push(enemy);
      }
    }
    this.waveEnemies = newWaveEnemies;

    // Only increment wave when waveActive is true and ALL enemies have passed or been destroyed
    if (this.waveActive && this.waveEnemies.length === 0) {
      this.waveActive = false;
      console.log("Wave complete! Starting next wave after delay...");
      this.time.delayedCall(2000, () => {
        if (this.wave < this.maxWaves) {
          this.wave++;
          this.waveText.setText(`Wave: ${this.wave}/${this.maxWaves}`);
          this.startWave();
        } else if (!this.house) {
          // Spawn delivery house on right side
          this.house = this.add
            .rectangle(this.worldWidth - 20, 300, 40, 80, 0xffaa00)
            .setStrokeStyle(4, 0x333300);
          this.physics.add.existing(this.house, true);
          // Visual indicator (arrow)
          this.houseIndicator = this.add
            .triangle(this.worldWidth - 40, 220, 0, 32, 16, 0, 32, 32, 0xffee00)
            .setOrigin(0.5);
          this.waveText.setText("Deliver to the house!");
        }
      });
    }

    // Check for player reaching house
    if (this.house && !this.levelCompleteTriggered) {
      if (
        Phaser.Geom.Intersects.RectangleToRectangle(
          this.player.getBounds(),
          this.house.getBounds()
        )
      ) {
        this.levelCompleteTriggered = true;
        // Calculate bonus points (e.g., lives * 100)
        const bonus = this.lives * 100;
        const levelScore = Math.floor(this.distance) + bonus;
        this.totalScore += levelScore;
        // Save high score if needed
        if (
          this.totalScore >
          parseInt(localStorage.getItem("highScore") || "0", 10)
        ) {
          localStorage.setItem("highScore", this.totalScore);
        }
        this.scene.start("LevelCompleteScene", {
          stats: {
            score: this.totalScore,
            levelScore,
            distance: Math.floor(this.distance),
            lives: this.lives,
            bonus,
            level: this.level,
          },
        });
      }
    }

    // Update enemies
    this.enemies.getChildren().forEach((enemy) => {
      if (enemy.update) enemy.update();
    });
  }
}
