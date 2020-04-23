class Preloader extends Phaser.Scene{
    constructor(){
        super("preloader");
    }
    preload(){
        // Load Visual assets - ONLY NEEDED ONCE FOR THE ENTIRE GAME. 
        // I.e. THIS FUNCTION ONLY NEEDS TO BE IN ONE SCENE FILE 
        this.load.image('playBtn', 'assets/PlayBtn.png');
        this.load.image('playBtnPressed', 'assets/PlayBtnPressed.png');
        this.load.image('controlsBtn', 'assets/controlsBtn.png');
        this.load.image('controlsBtnPressed', 'assets/controlsBtnPressed.png');
        this.load.image('backBtn', 'assets/backBtn.png');
        this.load.image('backBtnPressed', 'assets/backBtnPressed.png');
        this.load.image('loadingBG', 'assets/LungDefenderLoading.png');
        this.load.image('menuBG', 'assets/Lungs_BG.png');
        this.load.image('controlsBG', 'assets/controlsBG.png');
        this.load.image('gameBG', 'assets/BloodCells_BG_Tiling.png');
        this.load.image('player', 'assets/Macrophage.png');
        this.load.image('projectile', 'assets/Antibody.png');
        this.load.image('enemyGrunt', 'assets/EnemyGrunt.png');
        this.load.image('lungs','assets/Lungs.png');
        this.load.image('bCell','assets/B_Cell.png');
        this.load.image('bCellEmpty','assets/B_Cell_Empty.png');
        this.load.image('titleText','assets/LungDefender.png');
        // Load Audio assets
        this.load.audio('menuMusic', 'assets/menuMusic.mp3');
    }
    create(){
        var bg = this.add.image(0,0, 'loadingBG').setOrigin(0,0);
        this.scene.start("menuGame"); //Start new scene
    }
}