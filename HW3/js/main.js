"use strict";
window.onload = function(){
  var config = {
    width: 512,
    height: 512,
    pixelArt: true,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 1600 },
        fps:60,
        debug: false
      }
    },
    scene: [MainMenu, Game]
  }
  var game = new Phaser.Game(config);
}