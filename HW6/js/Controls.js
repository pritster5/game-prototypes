class Controls extends Phaser.Scene{
    constructor(){
        super("controlsGame");
    }
    create(){
        var controlsBG = this.add.image(0,0, 'controlsBG').setOrigin(0,0); //BG + Controls

        var backBtn = this.add.image(config.width/1.2, config.height/1.1, 'backBtn').setScale(1,1).setInteractive();
        backBtn.on('pointerdown', function(){
            backBtn.setTexture('backBtnPressed'); // Change btn to pressed state
        }, this);
        backBtn.on('pointerup', function(){
            backBtn.setTexture('backBtn'); // Pop btn back up
            this.scene.start("menuGame"); // start new scene
        }, this);
    }
}