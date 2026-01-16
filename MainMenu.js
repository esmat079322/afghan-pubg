class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenu' });
    }

    preload() {
        // Load menu assets
        this.load.image('menu-bg', 'assets/images/ui/menu-background.png');
        this.load.image('play-btn', 'assets/images/ui/play-button.png');
        this.load.image('levels-btn', 'assets/images/ui/levels-button.png');
        this.load.image('home-btn', 'assets/images/ui/home-button.png');
        this.load.audio('menu-music', 'assets/sounds/menu-music.mp3');
    }

    create() {
        // Add colorful background
        this.bg = this.add.graphics();
        this.createGradientBackground();
        
        // Add title with Afghani style
        this.add.text(600, 150, 'AFGHANI SHOOTER', {
            fontFamily: 'Poppins',
            fontSize: '70px',
            fontWeight: 'bold',
            color: '#FFD700',
            stroke: '#8B4513',
            strokeThickness: 8,
            shadow: { blur: 10, color: '#000', fill: true }
        }).setOrigin(0.5);

        // Create colorful buttons
        this.createMenuButtons();
        
        // Add decorations
        this.addDecorations();
        
        // Play background music
        this.sound.play('menu-music', { loop: true, volume: 0.5 });
    }

    createGradientBackground() {
        const gradient = this.bg.createGradient(
            0, 0, 1200, 700,
            0xff6b6b, 0, 0.2,
            0x4ecdc4, 1, 0.8
        );
        this.bg.fillGradientStyle(
            0xff6b6b, 0xff6b6b,
            0x4ecdc4, 0x4ecdc4,
            0.2, 0.8, 0.8, 0.2
        );
        this.bg.fillRect(0, 0, 1200, 700);
    }

    createMenuButtons() {
        const buttons = [
            { text: 'PLAY NOW', scene: 'GameScene', color: 0xff5252 },
            { text: 'LEVELS', scene: 'LevelSelect', color: 0x4fc3f7 },
            { text: 'HOME', scene: 'Home', color: 0x69f0ae },
            { text: 'SETTINGS', scene: 'Settings', color: 0xffd740 }
        ];

        buttons.forEach((btn, index) => {
            const button = this.add.graphics();
            button.fillStyle(btn.color, 1);
            button.fillRoundedRect(450, 250 + (index * 100), 300, 70, 20);
            button.setInteractive(new Phaser.Geom.Rectangle(450, 250 + (index * 100), 300, 70), 
                Phaser.Geom.Rectangle.Contains);
            
            // Button text
            const text = this.add.text(600, 285 + (index * 100), btn.text, {
                fontFamily: 'Poppins',
                fontSize: '28px',
                fontWeight: 'bold',
                color: '#FFFFFF'
            }).setOrigin(0.5);

            // Hover effects
            button.on('pointerover', () => {
                button.clear();
                button.fillStyle(0xffffff, 0.2);
                button.fillRoundedRect(450, 250 + (index * 100), 300, 70, 20);
                text.setScale(1.1);
            });

            button.on('pointerout', () => {
                button.clear();
                button.fillStyle(btn.color, 1);
                button.fillRoundedRect(450, 250 + (index * 100), 300, 70, 20);
                text.setScale(1);
            });

            button.on('pointerdown', () => {
                this.scene.start(btn.scene);
            });
        });
    }

    addDecorations() {
        // Add traditional Afghani patterns
        const patterns = [
            { x: 100, y: 100, size: 50, color: 0xff8a00 },
            { x: 1100, y: 100, size: 50, color: 0xff5252 },
            { x: 100, y: 600, size: 50, color: 0x4fc3f7 },
            { x: 1100, y: 600, size: 50, color: 0x69f0ae }
        ];

        patterns.forEach(pattern => {
            const decoration = this.add.graphics();
            decoration.fillStyle(pattern.color, 0.3);
            decoration.fillCircle(pattern.x, pattern.y, pattern.size);
            
            // Add rotating animation
            this.tweens.add({
                targets: decoration,
                scale: { from: 1, to: 1.5 },
                alpha: { from: 0.3, to: 0.1 },
                duration: 2000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });
    }
  }
