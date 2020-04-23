var Projectile = new Phaser.Class({
    Extends: Phaser.GameObjects.Image,
    initialize:
    // Projectile class to handle shooting antibodies
    function Projectile (scene){
        Phaser.GameObjects.Image.call(this, scene, 0, 0, 'projectile');
        this.speed = 1;
        this.born = 0;
        this.direction = 0;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.setSize(12, 12, true);
    },

    // Fires a projectile from the player to the reticle
    fire: function (shooter, target){
        this.setPosition(shooter.x, shooter.y); // Initial position
        this.direction = Math.atan( (target.x-this.x) / (target.y-this.y));

        // Calculate X and y velocity of projectile to moves it from shooter to target
        if (target.y >= this.y){
            this.xSpeed = this.speed*Math.sin(this.direction);
            this.ySpeed = this.speed*Math.cos(this.direction);
        } else{
            this.xSpeed = -this.speed*Math.sin(this.direction);
            this.ySpeed = -this.speed*Math.cos(this.direction);
        }

        this.rotation = shooter.rotation; // angle projectile with shooters rotation
        this.born = 0; // Time since new projectile spawned
    },

    // Updates the position of the projectile each cycle
    update: function (time, delta){
        this.x += this.xSpeed * delta;
        this.y += this.ySpeed * delta;
        this.born += delta;
        if (this.born > 5000){ //Removes bullets from sceen if the time between the current one and last spawned is more than 5 s
            this.setActive(false);
            this.setVisible(false);
        }
    }

});

var currentWave = 1; //Start on the first wave
var maxWave = 3; //The enemy spawn loop terminates after the third wave
var gameOver = false;
var aimer;
var enemyGrunts; //Actual sprite for enemyGrunt group
var gruntMinSpeed = 10;
var gruntMaxSpeed = 40;
var gruntAmount = currentWave * 2; //Amount to spawn
var projectile;
var lungsBG;
var player;
var playerAmmoCnt = 3;
var playerBullets;
var bCellAmmo;
var bCellAmmoCnt = 5;
class Game extends Phaser.Scene{
    constructor(){
        super("playGame");
    }

    create(){
        // WORLD BUILDING
        // Create world bounds
        this.physics.world.setBounds(0, 0, 512, 512);

        this.background = this.add.tileSprite(0,0, config.width, config.height, 'gameBG').setOrigin(0,0);
        lungsBG = this.physics.add.image(config.width/2, config.height*1.05, 'lungs').setScale(2,2).setImmovable();
        //Add ammo wheel to collect antibodies from
        bCellAmmo = this.physics.add.sprite(config.width/4.8, config.height/1.65, 'bCell').setImmovable();
        // Players + Invisible Mouse Pointer (Aimer)
        player = this.physics.add.image(config.width / 2, config.height / 1.6, 'player'); // Spawn the player
        player.setOrigin(0.5, 0.5).setCollideWorldBounds(true).setDrag(500, 500); // Make them collide with the world bounds
        aimer = this.physics.add.sprite(0, 0); //Create an invisible dot to serve as the reference point when calculating aim and trajectory
        aimer.setOrigin(0.5, 0.5).setCollideWorldBounds(true); //Prevent the invisible mouse cursor from going out of the window
        // Add a group that handles the players antibody ammo count
        playerBullets = this.physics.add.group({ classType: Projectile, runChildUpdate: true });
        // Add WASD Input
        var moveKeys = this.input.keyboard.addKeys({
            'up': Phaser.Input.Keyboard.KeyCodes.W,
            'down': Phaser.Input.Keyboard.KeyCodes.S,
            'left': Phaser.Input.Keyboard.KeyCodes.A,
            'right': Phaser.Input.Keyboard.KeyCodes.D
        });
    
        // Move on press
        this.input.keyboard.on('keydown_W', function (event){
            player.setAccelerationY(-500);
        });
        this.input.keyboard.on('keydown_S', function (event){
            player.setAccelerationY(500);
        });
        this.input.keyboard.on('keydown_A', function (event){
            player.setAccelerationX(-500);
        });
        this.input.keyboard.on('keydown_D', function (event){
            player.setAccelerationX(500);
        });
    
        // Stop moving on release. Since it's acceleration, you will slow down gradually
        this.input.keyboard.on('keyup_W', function (event){
            if (moveKeys['down'].isUp)
                player.setAccelerationY(0);
        });
        this.input.keyboard.on('keyup_S', function (event){
            if (moveKeys['up'].isUp)
                player.setAccelerationY(0);
        });
        this.input.keyboard.on('keyup_A', function (event){
            if (moveKeys['right'].isUp)
                player.setAccelerationX(0);
        });
        this.input.keyboard.on('keyup_D', function (event){
            if (moveKeys['left'].isUp)
                player.setAccelerationX(0);
        });
        // Shoot whenever the left mouse button is pressed
        this.input.on('pointerdown', function (pointer, time, lastFired){
            if (playerAmmoCnt > 0){
                    playerAmmoCnt -= 1;
                    // Get projectile from bullets group
                    projectile = playerBullets.get().setActive(true).setVisible(true);
                    // Checks if projectile is actually initialized
                    if (projectile){ 
                        projectile.fire(player, aimer);
                    }  
                }
            }, this);
    
        // Sync up the aimer to the mouse cursor/pointer
        // Pointer lock will only work after mousedown
        game.canvas.addEventListener('mousedown', function () {
            game.input.mouse.requestPointerLock();
        });

        // Exit pointer lock when Q or escape (by default) is pressed.
        this.input.keyboard.on('keydown_Q', function (event){
            if (game.input.mouse.locked){
                game.input.mouse.releasePointerLock();
            }
        }, 0, this);
    
        // Move aimer upon locked pointer move
        this.input.on('pointermove', function (pointer){
            if (this.input.mouse.locked){
                aimer.x += pointer.movementX;
                aimer.y += pointer.movementY;
            }
        }, this);

        
        //Disable the enemy grunts when hit with a antibody
        this.physics.add.collider(enemyGrunts, playerBullets, enemyHitCallback, null, this);
        //Completely kill the grunts if they touch the player after being antibodied
        this.physics.add.overlap(player, enemyGrunts, collectGrunt, null, this);
        //Give the player ammo if they overlap with the B-Cell
        this.physics.add.overlap(player, bCellAmmo, ammoCallback, null, this);
        //Disable the grunts when they touch the lungs, then tint the lungs
        this.physics.add.collider(enemyGrunts, lungsBG, lungsHitCallback, null, this);

        var gameOverTextStyle = {font: "32px Roboto", fill: '#ed1818', stroke: '#000', align:'center', strokeThickness: 10};
        this.gameOverText = this.add.text(config.width / 2,config.height / 2, 'GAME OVER\nYou got Infected\n\nPress F5 to Replay', gameOverTextStyle).setOrigin(0.5,0.5); //GameOver Text
        this.gameOverText.visible = false;
        this.victoryText = this.add.text(config.width / 2,config.height / 2, 'YOU WIN :D\n\nPress F5 to Replay', gameOverTextStyle).setOrigin(0.5,0.5); //GameOver Text
        this.victoryText.visible = false;
    }

    // Function to handle the spawning of baddies -- Should be called inside of the update method
    spawnBaddies(){
        //Baddies Spawn Loop. Spawns r times the wave number, so 5 on the first wave, 10 on the second, etc. 
        enemyGrunts = this.physics.add.group({
            key: 'enemyGrunt',
            repeat: gruntAmount - 1,
            setXY: { x: 60, y: 0, stepX: 60 }
        });
        enemyGrunts.children.iterate(function(child){
            child.setVelocity(0, Phaser.Math.FloatBetween(gruntMinSpeed, gruntMaxSpeed));
        });
    }

    update(time){
        if (gameOver == true){ //Things that need to happen on game over REGARDLESS of win/lose state go here
            this.physics.pause(); //Pause the physics
            this.time.delayedCall(1000 * 1, function(){
                game.sound.stopAll() //Stop all currently playing sounds 1 sec(s) after gameover
            })
            return;
        }

        if (gruntAmount === 0){
            if(currentWave === maxWave){ //If we're on wave 3 (max) and gruntAmount is zero, that means the player has defeated all waves
                this.victoryText.visible = true;
                gameOver = true; 
            }
            else{
                currentWave += 1; //Increment the wave amount to make the spawnBaddies code harder
                gruntAmount = currentWave * 2
                this.spawnBaddies(); //Otherwise, spawn the next wave of enemies (current wave num * 2, e.g. wave 3 spawns 6 grunts)
            }
        }

        this.background.tilePositionY += 0.15; //Scroll the background for a parallax feel
        bCellAmmo.angle += 1; //Rotate the B-Cell's for a nice ammo wheel effect
        // Rotates player to face towards the mouse cursor
        player.rotation = Phaser.Math.Angle.Between(player.x, player.y, aimer.x, aimer.y);
        // Matches the movement of the player to the mouse cursor so that aim stays steady
        aimer.body.velocity.x = player.body.velocity.x;
        aimer.body.velocity.y = player.body.velocity.y;
    } 
}

function enemyHitCallback(enemyHit, bulletHit){
    // If hit is true, disable both the projectile and the enemy
    if (bulletHit.active === true && enemyHit.active === true){
        enemyHit.body.moves = false;
        // Make projectile stick to the enemy
        bulletHit.body.moves = false;
        bulletHit.setActive(false);
    }
}

function collectGrunt(player, enemyHit){
    //console.log(gruntAmount);
    // If the enemy has already been anti-bodied, we can kill them
    if (enemyHit.body.moves === false){
        enemyHit.body.checkCollision.none = true;
        enemyHit.setActive(false).setVisible(false);
        gruntAmount -= 1;
        //console.log(gruntAmount);
    }
}

function ammoCallback(player, bCellAmmo){
    if (playerAmmoCnt < 5){
        playerAmmoCnt = 5; //If the player touches the B-Cell on full ammo, do nothing. Only give player ammo if they have less than max
        bCellAmmo.setTexture('bCellEmpty');
        bCellAmmo.body.checkCollision.none = true;
        this.time.delayedCall(1000 * 3, function(){ //3 sec gap between ammo resupply
            bCellAmmo.body.checkCollision.none = false;
            bCellAmmo.setTexture('bCell');
        });
    }
}

function lungsHitCallback(lungsHit, enemyHit){
    // If hit is true, disable both the projectile and the enemy
    if (lungsHit.active === true && enemyHit.active === true){
        enemyHit.setActive(false).setVisible(false);
        // Show damage to the lungs
        lungsHit.setTint(0xff0000);
        this.gameOverText.visible = true;
        gameOver = true;
    }
}