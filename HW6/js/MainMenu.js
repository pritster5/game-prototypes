class MainMenu extends Phaser.Scene{
    constructor(){
        //super() inherits all the characteristics of the Phaser "scene" class
        super("menuGame");
    }
    create(){
        this.sound.stopAll() //Stop any currently playing music
        //Start playing menu music
        var menuMusic = this.sound.add("menuMusic");
        var musicConfig = {
            mute: 0,
            volume: 0.6,
            seek: 0,
            loop: true,
            delay: 0
        }
        menuMusic.play(musicConfig); // Start Playing the menu bg music
        // var gameWidth = this.game.config.width; //Get Game width and height
        // var gameHeight = this.game.config.height;
        var bg = this.add.image(0,0, 'menuBG').setOrigin(0,0); //BG + Lungs

        var title = this.add.image(config.width/2, config.height/6, 'titleText');
        var startGameBtn = this.add.image(config.width/2, config.height/2.0, 'playBtn').setScale(1,1).setInteractive();        
        startGameBtn.on('pointerdown', ()=>{
            startGameBtn.setTexture('playBtnPressed'); // Change btn to pressed state
        });
        startGameBtn.on('pointerup', ()=>{
            startGameBtn.setTexture('playBtn'); // Pop btn back up
            this.scene.start("playGame"); // start new scene
        });

        var controlsBtn = this.add.image(config.width/2, config.height/2.6, 'controlsBtn').setScale(1,1).setInteractive();
        controlsBtn.on('pointerdown', ()=>{
            controlsBtn.setTexture('controlsBtnPressed'); // Change btn to pressed state
        });
        controlsBtn.on('pointerup', ()=>{
            controlsBtn.setTexture('controlsBtn'); // Pop btn back up
            this.scene.start("controlsGame"); // start new scene
        });
    }    
}