import {Game} from './game.js'

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 450,
    //Sistema de físicas desarrolladas dentro del juego. Por defecto esta en Arcade, 
    //Gravedad en el eje de la Y, cuanto mayor es el valor más rápido caen los objetos
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 },
            debug: false
        }
    },
    //Distintas partes del juego muy diferentes entre ellas
    scene: [Game]
};
//Declaramos la variable del juego con la configuración anteriormente creada
var game = new Phaser.Game(config);

