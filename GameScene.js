class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.player = null;
        this.cursors = null;
        this.enemies = null;
        this.bullets = null;
        this.score = 0;
        this.health = 100;
    }

    preload() {
        // Load game assets
        this.load.image('player', 'assets/images/characters/player.png');
        this.load.image('enemy', 'assets/images/characters/enemy.png');
        this.load.image('bullet', 'assets/images/weapons/bullet.png');
        this.load.image('map', 'assets/images/maps/level1.png');
        this.load.image('weapon', 'assets/images/weapons/ak47.png');
        this.load.audio('shoot-sound', 'assets/sounds/shoot.mp3');
        this.load.audio('hit-sound', 'assets/sounds/hit.mp3');
    }

    create() {
        // Create map
        this.createMap();
        
        // Create player
        this.createPlayer();
        
        // Create enemies
        this.createEnemies();
        
        // Create UI
        this.createUI();
        
        // Setup controls
        this.setupControls();
        
        // Setup collisions
        this.setupCollisions();
    }

    createMap() {
        this.map = this.add.image(600, 350, 'map').setScale(1.5);
        
        // Add colorful particles
        this.particles = this.add.particles('bullet');
        this.emitter = this.particles.createEmitter({
            speed: 100,
            scale: { start: 0.5, end: 0 },
            blendMode: 'ADD',
            frequency: 500
        });
    }

    createPlayer() {
        this.player = this.physics.add.sprite(600, 350, 'player');
        this.player.setCollideWorldBounds(true);
        this.player.setScale(1.5);
        
        // Add weapon
        this.weapon = this.add.image(this.player.x + 30, this.player.y, 'weapon');
        this.weapon.setScale(0.5);
        
        // Bullet group
        this.bullets = this.physics.add.group();
    }

    createEnemies() {
        this.enemies = this.physics.add.group();
        
        // Create 5 enemies at random positions
        for (let i = 0; i < 5; i++) {
            const enemy = this.enemies.create(
                Phaser.Math.Between(100, 1100),
                Phaser.Math.Between(100, 600),
                'enemy'
            );
            enemy.setScale(1.5);
            enemy.setCollideWorldBounds(true);
            enemy.setBounce(1);
            enemy.setVelocity(
                Phaser.Math.Between(-100, 100),
                Phaser.Math.Between(-100, 100)
            );
        }
    }

    createUI() {
        // Health bar
        this.healthBar = this.add.graphics();
        this.updateHealthBar();
        
        // Score display
        this.scoreText = this.add.text(20, 20, 'Score: 0', {
            fontFamily: 'Poppins',
            fontSize: '24px',
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 4
        });
        
        // Mini map
        this.createMiniMap();
        
        // Back to menu button
        this.createBackButton();
    }

    updateHealthBar() {
        this.healthBar.clear();
        
        // Background
        this.healthBar.fillStyle(0x000000, 0.5);
        this.healthBar.fillRect(20, 50, 200, 20);
        
        // Health
        const healthWidth = (this.health / 100) * 200;
        const healthColor = this.health > 50 ? 0x00ff00 : 
                          this.health > 25 ? 0xffff00 : 0xff0000;
        
        this.healthBar.fillStyle(healthColor, 1);
        this.healthBar.fillRect(20, 50, healthWidth, 20);
        
        // Border
        this.healthBar.lineStyle(2, 0xffffff, 1);
        this.healthBar.strokeRect(20, 50, 200, 20);
    }

    createMiniMap() {
        const miniMap = this.add.graphics();
        miniMap.fillStyle(0x000000, 0.5);
        miniMap.fillRect(1000, 20, 180, 120);
        
        // Add player marker
        this.playerMarker = this.add.circle(1090, 80, 5, 0x00ff00);
    }

    createBackButton() {
        const backBtn = this.add.graphics();
        backBtn.fillStyle(0xff5252, 1);
        backBtn.fillRoundedRect(20, 650, 150, 40, 10);
        
        const backText = this.add.text(95, 670, 'BACK', {
            fontFamily: 'Poppins',
            fontSize: '18px',
            color: '#FFFFFF'
        }).setOrigin(0.5);
        
        backBtn.setInteractive(new Phaser.Geom.Rectangle(20, 650, 150, 40), 
            Phaser.Geom.Rectangle.Contains);
        
        backBtn.on('pointerdown', () => {
            this.scene.start('MainMenu');
        });
    }

    setupControls() {
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // Shooting with mouse
        this.input.on('pointerdown', (pointer) => {
            this.shoot(pointer.x, pointer.y);
        });
        
        // Movement keys
        this.wasd = {
            up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        };
    }

    shoot(targetX, targetY) {
        // Create bullet
        const bullet = this.bullets.create(this.player.x, this.player.y, 'bullet');
        bullet.setScale(0.5);
        
        // Calculate direction
        const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, targetX, targetY);
        const speed = 500;
        
        bullet.setVelocity(
            Math.cos(angle) * speed,
            Math.sin(angle) * speed
        );
        
        // Play sound
        this.sound.play('shoot-sound', { volume: 0.3 });
        
        // Destroy bullet after 2 seconds
        this.time.delayedCall(2000, () => {
            if (bullet.active) bullet.destroy();
        });
    }

    setupCollisions() {
        // Bullet vs Enemy collision
        this.physics.add.overlap(this.bullets, this.enemies, (bullet, enemy) => {
            bullet.destroy();
            enemy.destroy();
            
            this.score += 100;
            this.scoreText.setText(`Score: ${this.score}`);
            
            // Add particle effect
            this.emitter.explode(10, enemy.x, enemy.y);
            
            // Play hit sound
            this.sound.play('hit-sound', { volume: 0.5 });
            
            // Create new enemy
            this.time.delayedCall(1000, () => {
                const newEnemy = this.enemies.create(
                    Phaser.Math.Between(100, 1100),
                    Phaser.Math.Between(100, 600),
                    'enemy'
                );
                newEnemy.setScale(1.5);
            });
        });
        
        // Enemy vs Player collision
        this.physics.add.overlap(this.player, this.enemies, (player, enemy) => {
            this.health -= 10;
            this.updateHealthBar();
            
            if (this.health <= 0) {
                this.gameOver();
            }
        });
    }

    update() {
        // Player movement
        const speed = 200;
        
        if (this.cursors.left.isDown || this.wasd.left.isDown) {
            this.player.setVelocityX(-speed);
            this.player.setFlipX(true);
        } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
            this.player.setVelocityX(speed);
            this.player.setFlipX(false);
        } else {
            this.player.setVelocityX(0);
        }
        
        if (this.cursors.up.isDown || this.wasd.up.isDown) {
            this.player.setVelocityY(-speed);
        } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
            this.player.setVelocityY(speed);
        } else {
            this.player.setVelocityY(0);
        }
        
        // Update weapon position
        this.weapon.setPosition(this.player.x + (this.player.flipX ? -30 : 30), this.player.y);
        this.weapon.setFlipX(this.player.flipX);
        
        // Update minimap marker
        const miniMapX = 1090 + ((this.player.x - 600) / 10);
        const miniMapY = 80 + ((this.player.y - 350) / 10);
        this.playerMarker.setPosition(miniMapX, miniMapY);
    }

    gameOver() {
        // Show game over screen
        const gameOverText = this.add.text(600, 300, 'GAME OVER', {
            fontFamily: 'Poppins',
            fontSize: '80px',
            color: '#ff0000',
            stroke: '#ffffff',
            strokeThickness: 8
        }).setOrigin(0.5);
        
        const finalScore = this.add.text(600, 400, `Final Score: ${this.score}`, {
            fontFamily: 'Poppins',
            fontSize: '40px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // Restart button
        const restartBtn = this.add.graphics();
        restartBtn.fillStyle(0x4fc3f7, 1);
        restartBtn.fillRoundedRect(500, 500, 200, 60, 15);
        
        const restartText = this.add.text(600, 530, 'PLAY AGAIN', {
            fontFamily: 'Poppins',
            fontSize: '24px',
            color: '#FFFFFF'
        }).setOrigin(0.5);
        
        restartBtn.setInteractive(new Phaser.Geom.Rectangle(500, 500, 200, 60), 
            Phaser.Geom.Rectangle.Contains);
        
        restartBtn.on('pointerdown', () => {
            this.scene.restart();
        });
    }
  }
