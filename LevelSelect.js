class LevelSelect extends Phaser.Scene {
    constructor() {
        super({ key: 'LevelSelect' });
    }

    create() {
        // Colorful background
        this.createColorfulBackground();
        
        // Title
        this.add.text(600, 100, 'SELECT LEVEL', {
            fontFamily: 'Poppins',
            fontSize: '60px',
            color: '#FFD700',
            stroke: '#8B4513',
            strokeThickness: 6
        }).setOrigin(0.5);
        
        // Create level buttons
        this.createLevelButtons();
        
        // Back button
        this.createBackButton();
    }

    createColorfulBackground() {
        const colors = [0xff6b6b, 0x4ecdc4, 0xffd166, 0x06d6a0, 0x118ab2];
        
        for (let i = 0; i < 5; i++) {
            const rect = this.add.graphics();
            rect.fillStyle(colors[i], 0.3);
            rect.fillRect(0, i * 140, 1200, 140);
            
            // Add floating animation
            this.tweens.add({
                targets: rect,
                y: i * 140 + Phaser.Math.Between(-10, 10),
                duration: 2000 + i * 500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
    }

    createLevelButtons() {
        const levels = [
            { number: 1, locked: false, color: 0xff6b6b },
            { number: 2, locked: false, color: 0x4ecdc4 },
            { number: 3, locked: false, color: 0xffd166 },
            { number: 4, locked: true, color: 0x06d6a0 },
            { number: 5, locked: true, color: 0x118ab2 }
        ];
        
        levels.forEach((level, index) => {
            const x = 240 + (index % 5) * 180;
            const y = 250 + Math.floor(index / 5) * 200;
            
            const button = this.add.graphics();
            
            if (level.locked) {
                button.fillStyle(0x666666, 1);
                button.fillCircle(x, y, 60);
                
                // Lock icon
                this.add.text(x, y, '🔒', {
                    fontSize: '40px'
                }).setOrigin(0.5);
            } else {
                button.fillStyle(level.color, 1);
                button.fillCircle(x, y, 60);
                
                // Level number
                this.add.text(x, y, level.number.toString(), {
                    fontFamily: 'Poppins',
                    fontSize: '40px',
                    fontWeight: 'bold',
                    color: '#FFFFFF'
                }).setOrigin(0.5);
                
                // Star rating
                this.add.text(x, y + 70, '⭐⭐⭐', {
                    fontSize: '20px'
                }).setOrigin(0.5);
                
                // Make interactive
                button.setInteractive(new Phaser.Geom.Circle(x, y, 60), 
                    Phaser.Geom.Circle.Contains);
                
                button.on('pointerdown', () => {
                    this.scene.start('GameScene', { level: level.number });
                });
            }
            
            // Add pulse animation for unlocked levels
            if (!level.locked) {
                this.tweens.add({
                    targets: button,
                    scale: { from: 1, to: 1.1 },
                    duration: 1000,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
            }
        });
    }

    createBackButton() {
        const backBtn = this.add.graphics();
        backBtn.fillStyle(0xff5252, 1);
        backBtn.fillRoundedRect(50, 600, 150, 50, 15);
        
        const backText = this.add.text(125, 625, 'BACK', {
            fontFamily: 'Poppins',
            fontSize: '20px',
            color: '#FFFFFF'
        }).setOrigin(0.5);
        
        backBtn.setInteractive(new Phaser.Geom.Rectangle(50, 600, 150, 50), 
            Phaser.Geom.Rectangle.Contains);
        
        backBtn.on('pointerdown', () => {
            this.scene.start('MainMenu');
        });
    }
  }
