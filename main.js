class AfghaniShooterGame {
    constructor() {
        this.config = {
            type: Phaser.AUTO,
            width: 1200,
            height: 700,
            parent: 'game-container',
            backgroundColor: '#87CEEB',
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0 },
                    debug: false
                }
            },
            scene: [MainMenu, LevelSelect, GameScene, Home],
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH
            }
        };

        this.game = new Phaser.Game(this.config);
    }
}

// Initialize game when window loads
window.onload = () => {
    new AfghaniShooterGame();
};
