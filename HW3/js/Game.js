var timeHeld = 0;
var prjctle;
var cats;
var score = 0;
var catAmt = 3;
var gameOver = false;
var ammoText;
var ammo = 4;
class Game extends Phaser.Scene{
  constructor(){
    //super() inherits all the characteristics of the Phaser "scene" class
    super("game"); //Identify the current class with "playGame"
  }

  create(){
    //WORLD BUILDING
    var angle = 0;
    var bg = this.add.image(0,0, 'bg').setOrigin(0,0).setScale(8,8);
    //AUDIO
    this.hitSound = this.sound.add("hit");
    this.winSound = this.sound.add("win");
    this.loseSound = this.sound.add("lose");
    //CONTINUE WORLD BUILDING
    var gnd = this.physics.add.staticGroup();
    gnd.create(0, 376, 'gnd').setOrigin(0,0).setScale(8,8).refreshBody();
    cats = this.physics.add.group();
    for(var i = 0; i < catAmt; ++i){
      cats.create(Phaser.Math.RND.between(300,450), Phaser.Math.RND.between(140,290), 'cat').setOrigin(0,0).setScale(4,4);
    }
    cats.children.iterate(function (child){
      child.body.moves = false; //Make every cat stationary until hit
    })
    var basket = this.physics.add.staticImage(310,354,'catBskt').setOrigin(0,0).setScale(6,6).refreshBody();
    var playerTorso = this.add.image(32,324, 'playerTorso').setScale(8,8);
    var playerArms = this.add.sprite(24,playerTorso.y, 'playerArms').setOrigin(0,0.9).setScale(8,8);
    prjctle = this.physics.add.sprite(playerArms.x, playerArms.y, 'pebble').setScale(8,8);
    prjctle.disableBody(true,true); //So we dont let our first projectile fall down before getting launched
    //ADD COLLISIONS
    this.physics.add.collider(gnd, cats, function(gnd, cat){
      cat.disableBody(true,false);
    }, null, this);
    this.physics.add.collider(basket, cats, function(basket, cat){
      cat.disableBody(true, false)
    }, null, this);
    this.physics.add.collider(gnd, prjctle);
    this.physics.add.collider(basket, prjctle);
    this.physics.add.collider(cats, prjctle, hitCats, null, this);
    
    this.input.on('pointermove', function(pointer){
      angle = Phaser.Math.Angle.BetweenPoints(playerArms, pointer); //Calculate angle b/w playerArms and current mouse
      playerArms.rotation = angle; //Set the rotation of the player arms every time the mouse moves
    },this);

    this.input.on('pointerup', function () {
      prjctle.enableBody(true, playerArms.x+20, playerArms.y, true, true);
      this.physics.velocityFromRotation(angle, timeHeld, prjctle.body.velocity);
      ammo -= 1;
      if((score != catAmt) && ammo < 0){
        ammoText.visible = false;
        this.loseSound.play();
        this.gameOverTextLose.visible = true; //Show loser text
        this.physics.pause(); //Pause the physics
        prjctle.disableBody(true,true); //Disable the last projectile
        gameOver = true; //Allow update to stop
      }
    },this);

    //END GAME TEXT
    var myTextStyle = {align: 'center', font: '32px Roboto', fill: '#E43AA4', stroke: '#000', strokeThickness: 6};
    ammoText = this.add.text(4,4, 'Ammo Left: ' + ammo, myTextStyle);
    this.gameOverTextWin = this.add.text(256,192, 'YOU WIN! :D', myTextStyle).setOrigin(0.5,0.5);
    this.gameOverTextWin.visible = false;
    this.gameOverTextLose = this.add.text(256, 192, 'GAME OVER\nYou ran out of ammo :(', myTextStyle).setOrigin(0.5,0.5);
    this.gameOverTextLose.visible = false;
  }

  update(){
    if (gameOver == true){
      return;
    }
    ammoText.setText('Ammo Left: ' + ammo);
    
    timeHeld = this.input.activePointer.getDuration();
    if(timeHeld > 1100){
      timeHeld = 1100;
    }
    else if(timeHeld < 300){
      timeHeld = 300;
    }
  }
}

function hitCats(prjctle, cat){ //What to do on collision
  cat.setCollideWorldBounds(true);
  this.hitSound.play();
  cat.body.moves = true;
  prjctle.disableBody(true,true);
  score+=1;
  if (score == catAmt){
    ammoText.visible = false;
    this.winSound.play();
    this.gameOverTextWin.visible = true; //Only become visible on win
    this.physics.pause();
    gameOver = true;
  }
}