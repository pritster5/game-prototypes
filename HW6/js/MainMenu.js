class MainMenu extends Phaser.Scene{
    constructor(){
        //super() inherits all the characteristics of the Phaser "scene" class
        super("menuGame");
    }
    create(){
        //Start playing menu music
        this.menuMusic = this.sound.add("menuMusic");
        var musicConfig = {
            mute: 0,
            volume: 0.6,
            seek: 0,
            loop: false, //DEBUG. Change back to true for final build
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