class MainMenu extends Phaser.Scene{
    constructor(){
        //super() inherits all the characteristics of the Phaser "scene" class
        super("menuGame");
    }
    preload(){
        // Load Visual assets - ONLY NEEDED ONCE FOR THE ENTIRE GAME. 
        // I.e. THIS FUNCTION ONLY NEEDS TO BE IN ONE SCENE FILE 
        this.load.image('playBtn', 'assets/PlayBtn.png');
        this.load.image('playBtnPressed', 'assets/PlayBtnPressed.png');
        this.load.image('menuBG', 'assets/Lungs_BG.png');
        this.load.image('gameBG', 'assets/BloodCells_BG_Tiling.png');
        this.load.image('player', 'assets/Macrophage.png');
        this.load.image('projectile', 'assets/Antibody.png');
        this.load.image('enemyGrunt', 'assets/EnemyGrunt.png');
        this.load.image('lungs','assets/Lungs.png');
        this.load.image('titleText','assets/LungDefender.png');
        // Load Audio assets
        this.load.audio('menuMusic', 'assets/menuMusic.mp3');
        // this.load.audio('hit', 'assets/catYell.mp3');
        // this.load.audio('win', 'assets/win.mp3');
        // this.load.audio('lose', 'assets/lose.mp3');
        // this.load.audio("gameOver", 'assets/audio/sfx_gameover.mp3');
    }
    create(){
        //Start playing menu music
        this.menuMusic = this.sound.add("menuMusic");
        var musicConfig = {
            mute: 0,
            volume: 0.6,
            seek: 0,
            loop: true,
            delay: 0
        }
        this.menuMusic.play(musicConfig); // Start Playing the menu bg music
        // var gameWidth = this.game.config.width; //Get Game width and height
        // var gameHeight = this.game.config.height;
        var bg = this.add.image(0,0, 'menuBG').setOrigin(0,0);
        var title = this.add.image(config.width/2, config.height/4, 'titleText');
        var startGameBtn = this.add.image(config.width/2, config.height/2.15, 'playBtn').setScale(1,1).setInteractive();
        startGameBtn.on('pointerdown', function(){
            startGameBtn.setTexture('playBtnPressed'); // Change btn to pressed state
        }, this);
        startGameBtn.on('pointerup', function(){
            startGameBtn.setTexture('playBtn'); // Pop btn back up
            this.scene.start("playGame"); // start new scene
        }, this);
    }    
}