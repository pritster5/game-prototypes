class MainMenu extends Phaser.Scene{
    constructor(){
        super("mainMenu"); //Identifier for the scene.
    }
    preload(){
        // Load Visual assets.
        this.load.image('playBtn', 'assets/PlayBtn.png');
        this.load.image('playBtnPressed', 'assets/PlayBtnPressed.png');
        this.load.image('bg', 'assets/Menu64px.png');
        this.load.image('playerTorso', 'assets/PlayerTorso.png');
        this.load.image('playerArms', 'assets/PlayerArms.png');
        this.load.image('gnd', 'assets/Gnd64px.png');
        this.load.image('pebble', 'assets/Pebble.png');
        this.load.image('catBskt', 'assets/CatBasket.png');
        this.load.image('cat', 'assets/Cat32px.png');
        //Load Audio assets
        this.load.audio('menuMusic', 'assets/menuMusic.mp3');
        this.load.audio('hit', 'assets/catYell.mp3');
        this.load.audio('win', 'assets/win.mp3');
        this.load.audio('lose', 'assets/lose.mp3');
        //this.load.audio("gameOver", 'assets/audio/sfx_gameover.mp3');
    }
    create(){
        //Start playing menu music
        this.menuMusic = this.sound.add("menuMusic");
        var musicConfig = {
            mute: 0,
            volume: 1,
            seek: 0,
            loop: true,
            delay: 0
        }
        this.menuMusic.play(musicConfig); //Start Playing the menu bg music
        //var gameWidth = this.game.config.width; //Get Game width and height
        //var gameHeight = this.game.config.height;
        var bg = this.add.image(0,0, 'bg').setOrigin(0,0).setScale(8,8); // 512 / 8 = 64, img is 64px
        var startGameBtn = this.add.image(128,224, 'playBtn').setScale(8,8).setInteractive();
        startGameBtn.on('pointerdown', function(){
            startGameBtn.setTexture('playBtnPressed'); //Change btn to down state
        }, this);
        startGameBtn.on('pointerup', function(){
            startGameBtn.setTexture('playBtn'); //Pop btn back up
            this.scene.start("game"); //Start new scene
        }, this);
    }    
}