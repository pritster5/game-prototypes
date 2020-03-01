"use strict";
window.onload = function() {
  // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
  // You will need to change the fourth parameter to "new Phaser.Game()" from
  // 'phaser-example' to 'game', which is the id of the HTML element where we
  // want the game to go.
  // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
  // You will need to change the paths you pass to "game.load.image()" or any other
  // loading functions to reflect where you are putting the assets.
  // All loading functions will typically all be found inside "preload()".
  
  var config = {
    type: Phaser.AUTO,
    width: 512,
    height: 512,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 1000 },
        fps:60,
        debug: false
      }
    },
    scene: {
      preload: preload,
      create: create,
      update: update
    }
  };

  var game = new Phaser.Game(config);

  function preload() {
    // Load Visual assets.
    this.load.image('sky', 'assets/sky.png');
    this.load.image('gnd', 'assets/ground.png');
    this.load.spritesheet('dude', 'assets/dude.png', {frameWidth:32, frameHeight:42})
    this.load.spritesheet('baddie', 'assets/baddude.png', {frameWidth:32, frameHeight:42})

    //Load Audio assets
    this.load.audio("playerJumpSound", 'assets/audio/sfx_movement_jump7.mp3');
    this.load.audio("gameOver", 'assets/audio/sfx_gameover.mp3');
  }
  
  var player; //Make a player in global scope so that their position can be updated
  var baddie; //Make an enemy character and give them the same animations ase the player
  var cursors; //Var to handle keyboard input
  const LEFT = 16; //Make const values for the left and right edges of the screen - (player width / 2)
  const RIGHT = 496;
  const MAXSPEED = 1000;
  var baddiespeed = 100; //Initilize to 0, will slowly speed up
  var baddiespeedstep = 25; //Will be used to incrememnt the baddiespeed
  var timeText;
  var gameOver = false;

  function create() {
    this.add.image(0,0, 'sky').setOrigin(0,0); //Add the background sky

    var ground = this.add.image(0, 368, 'gnd').setOrigin(0,0); //Add the ground and position correctly
    this.physics.add.existing(ground, true); //Give it static phsyics so the player collides with it
    //PLAYER
    player = this.physics.add.sprite(256, 344, 'dude'); //Create a player that falls with gravity
    player.setBounce(0.2); //Give him a lil bounce
    player.setCollideWorldBounds(true); // Don't let him fall or move off screen
    this.physics.add.collider(ground, player); //Check for collision between the player and ground
    this.playerJumpSound = this.sound.add("playerJumpSound"); //Add audio for player jump
    this.anims.create({ //Move left animation
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', {start:0, end:3}),
      frameRate: 12,
      repeat: -1
    });
    this.anims.create({ //Turn to face forward animation
      key: 'turn',
      frames: [ {key: 'dude', frame:4} ],
      frameRate: 12,
    });
    this.anims.create({ //Move right animation
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', {start:5, end:8}),
      frameRate: 12,
      repeat: -1
    });

    //ENEMY
    baddie = this.physics.add.sprite(256, 344, 'baddie'); //Create a baddie that falls with gravity
    baddie.setCollideWorldBounds(true); // Don't let him fall or move off screen
    this.physics.add.collider(ground, baddie); //Check for collision between the baddie and ground
    this.anims.create({ //Move left animation
      key: 'bleft',
      frames: this.anims.generateFrameNumbers('baddie', {start:0, end:3}),
      frameRate: (baddiespeed / 8),
      repeat: -1
    });
    this.anims.create({ //Turn to face forward animation
      key: 'bturn',
      frames: [ {key: 'baddie', frame:4} ],
      frameRate: 10,
    });
    this.anims.create({ //Move right animation
      key: 'bright',
      frames: this.anims.generateFrameNumbers('baddie', {start:5, end:8}),
      frameRate: (baddiespeed / 8),
      repeat: -1
    });

    baddie.setVelocityX(baddiespeed); //Give enemy some initial velocity
    cursors = this.input.keyboard.createCursorKeys(); //Add cursor object for directional player controls

    this.physics.add.collider(player, baddie, touchedEnemy, null, this); //Call touchedEnemy() if player hits enemy
    
    var timeTextStyle = {font: "24px Roboto", fill: '#E43AA4', stroke: '#000', strokeThickness: 4};
    timeText = this.add.text(16,16, "Time Survived: ", timeTextStyle); //Elapsed Time Text

    var gameOverTextStyle = {font: "64px Roboto", fill: '#E43AA4', stroke: '#000', strokeThickness: 10};
    this.gameOverText = this.add.text(56,192, 'GAME OVER :(', gameOverTextStyle); //GameOver Text
    this.gameOverText.visible = false; //Only become visible on loss

    this.gameOverSound = this.sound.add("gameOver"); //Game over audio
  }
  

  function update(time) {
    if (gameOver == true){
      return;
    }

    var gameRuntime = time * 0.001; //Converted to Seconds
    timeText.setText("Time Survived: " + Math.round(gameRuntime) + " seconds");

    //START Movement Logic
    if(cursors.left.isDown){
      player.setVelocityX(-160);
      player.anims.play('left', true);
    }
    else if (cursors.right.isDown){
      player.setVelocityX(160);
      player.anims.play('right', true);
    }
    else{
      player.setVelocityX(0);
      player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down){
      player.setVelocityY(-500); //Jump Velocity
      this.playerJumpSound.play();
    }
    //END Movement Logic
    
    //START ENEMY LOGIC
    if (baddie.x == RIGHT){
      baddie.setVelocityX(-baddiespeed);
      if (baddiespeed < MAXSPEED){
        baddiespeed += baddiespeedstep;
      } 
    }
    else if (baddie.x == LEFT){
      baddie.setVelocityX(baddiespeed);
      if (baddiespeed < MAXSPEED){
        baddiespeed += baddiespeedstep;
      } 
    }

    if (baddie.body.velocity.x > 0){
      baddie.anims.play('bright', true);
    }
    else if(baddie.body.velocity.x < 0){
      baddie.anims.play('bleft', true);
    }
    else{
      baddie.anims.play('bturn')
    }
    //END ENEMY LOGIC
  }

  function touchedEnemy(player, baddie){ //Endgame Function
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('turn');
    baddie.anims.play('bturn');
    gameOver = true;
    this.gameOverSound.play();
    this.gameOverText.visible = true;
  }
};
