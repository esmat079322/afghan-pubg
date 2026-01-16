class Home extends Phaser.Scene {
    constructor() {
        super({ key: 'Home' });
    }

    create() {
        // Create cozy home background
        this.createHomeBackground();
        
        // Title
        this.add.text(600, 100, 'MY HOME', {
            fontFamily: 'Poppins',
            fontSize: '70px',
            color: '#FF8A00',
            stroke: '#5D4037',
            strokeThickness: 8
        }).setOrigin(0.5);
        
        // Create room sections
        this.createRooms();
        
        // Character customization
        this.createCharacterCustomization();
        
        // Back button
        this.createBackButton();
    }

    createHomeBackground() {
        // Wall
        this.add.rectangle(600, 350, 1100, 500, 0xF5E6CA);
        
        // Floor
        this.add.rectangle(600, 600, 1100, 200, 0x8D6E63);
        
        // Windows
        for (let i = 0; i < 3; i++) {
            const window = this.add.graphics();
            window.fillStyle(0x4FC3F7, 0.5);
            window.fillRect(200 + i * 300, 200, 150, 150);
            window.lineStyle(4, 0x5D4037, 1);
            window.strokeRect(200 + i * 300, 200, 150, 150);
            
            // Window frame
            window.lineStyle(2, 0x5D4037, 1);
            window.strokeRect(200 + i * 300 + 75, 200, 0, 150);
            window.strokeRect(200 + i * 300, 200 + 75, 150, 0);
        }
    }

    createRooms() {
        const rooms = [
            { name: 'ARMORY', icon: '🔫', x: 200, y: 400, color: 0xff5252 },
            { name: 'WARDROBE', icon: '👕', x: 450, y: 400, color: 0x4fc3f7 },
            { name: 'TROPHY', icon: '🏆', x: 700, y: 400, color: 0xffd740 },
            { name: 'SETTINGS', icon: '⚙️', x: 950, y: 400, color: 0x69f0ae }
        ];
        
        rooms.forEach(room => {
            const roomBg = this.add.graphics();
            roomBg.fillStyle(room.color, 0.8);
            roomBg.fillRoundedRect(room.x - 100, room.y - 60, 200, 120, 20);
            
            // Room icon
            this.add.text(room.x, room.y - 20, room.icon, {
                fontSize: '50px'
            }).setOrigin(0.5);
            
            // Room name
            this.add.text(room.x, room.y + 30, room.name, {
                fontFamily: 'Poppins',
                fontSize: '18px',
                color: '#FFFFFF',
                fontWeight: 'bold'
            }).setOrigin(0.5);
            
            // Make interactive
            roomBg.setInteractive(new Phaser.Geom.Rectangle(room.x - 100, room.y - 60, 200, 120), 
                Phaser.Geom.Rectangle.Contains);
            
            roomBg.on('pointerover', () => {
                roomBg.clear();
                roomBg.fillStyle(room.color, 1);
                roomBg.fillRoundedRect(room.x - 100, room.y - 60, 200, 120, 20);
            });
            
            roomBg.on('pointerout', () => {
                roomBg.clear();
                roomBg.fillStyle(room.color, 0.8);
                roomBg.fillRoundedRect(room.x - 100, room.y - 60, 200, 120, 20);
            });
        });
    }

    createCharacterCustomization() {
        const character = this.add.graphics();
        character.fillStyle(0x4CAF50, 1);
        character.fillCircle(600, 550, 50);
        
        // Character features
        this.add.circle(580, 530, 8, 0x000000); // Left eye
        this.add.circle(620, 530, 8, 0x000000); // Right eye
        this.add.arc(600, 560, 20, 0, 180, false, 0xFF5722); // Smile
        
        // Customization options
        const options = ['HATS', 'GLASSES', 'SHIRTS', 'PANTS'];
        
        options.forEach((option, index) => {
            const btn = this.add.graphics();
            btn.fillStyle(0x795548, 1);
            btn.fillRoundedRect(400 + index * 150, 650, 120, 40, 10);
            
            this.add.text(460 + index * 150, 670, option, {
                fontFamily: 'Poppins',
                fontSize: '16px',
                color: '#FFFFFF'
            }).setOrigin(0.5);
        });
    }

    createBackButton() {
        const backBtn = this.add.graphics();
        backBtn.fillStyle(0x795548, 1);
        backBtn.fillRoundedRect(50, 50, 120, 50, 15);
        
        const backText = this.add.text(110, 75, 'BACK', {
            fontFamily: 'Poppins',
            fontSize: '20px',
            color: '#FFFFFF'
        }).setOrigin(0.5);
        
        backBtn.setInteractive(new Phaser.Geom.Rectangle(50, 50, 120, 50), 
            Phaser.Geom.Rectangle.Contains);
        
        backBtn.on('pointerdown', () => {
            this.scene.start('MainMenu');
        });
    }
    }
