"use strict";
//Game settings controls all options related to gameplay
var gameSettings = {
  playerSpeed: 200
}
//Config is required 
var config = {
  type: Phaser.AUTO,
  width: 512,
  height: 512,
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      fps:60,
      debug: false
    }
  },
  scene: [MainMenu, Game]
}
var game = new Phaser.Game(config);