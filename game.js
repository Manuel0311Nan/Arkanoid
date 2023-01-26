import { Scoreboard } from "./components/Scoreboard.js";

export class Game extends Phaser.Scene{
    //Phaser.Scene, punto de partida que proporciona Phaser para crear una escena del juego
    //Creamos una serie de métodos que son reclamados en el momento que nosotros queramos

    //--Inicialización de la escena, con una key en este caso game unico para cada escena-----//
    constructor() {
        super ({key: 'game'})
    }
    //--Inicialización de la escena, con una key en este caso game unico para cada escena-----//
    init() {
        this.scoreboard = new Scoreboard(this);
}
    //--preload --> precarga de todos los assets que necesitamos para inicializar el juego (imagenes, sonidos, etc)
    preload() {
        //!El primer parametro ('background') para que phaser sepa cuando llamemos a esos parametros a que archivo hacemos referencia
        this.load.image('background', 'images/background.png')
        this.load.image('gameover', 'images/gameover.png')
        this.load.image('platform', 'images/platform.png')
        this.load.image('ball', 'images/ball.png')
    }
    //--create --> crea la escena, encargado de ir colocando todos los elementos que conforman la escena(personajes, imagenes, etc)
    create() {
        //!-----------this.physics.world.setBoundsCollision(true,true,true,false) activa el rebote en los lados que le digamos (izq,der,arriba,abajo)
        this.physics.world.setBoundsCollision(true, true, true, false)
         //!-----------this.physics.world.setBoundsCollision(true,true,true,false) activa el rebote en los lados que le digamos (izq,der,arriba,abajo)
        
        //? Con this.add.image elegimos las coordenadas y el primer parametro creado en preload, coloca el centro de la imagen en las coordenadas 300-200
        this.add.image(300, 200, 'background');
        this.gameoverImage = this.add.image(400, 100, 'gameover');
        this.gameoverImage.visible = false

        this.scoreboard.create();

        //? Pyhsics --> permite colocar elementos a los que le va afectar el sistema de fisicas, en primer lugar cae porque hemos establecido la gravedad
        //Añadimos al final de la declaración de la imagen de plataforma el método setImmovable que no dejára que se mueva la plataforma cuando la bola rebote
        this.platform = this.physics.add.image(400, 350, 'platform').setImmovable();

        //con el método allowgravity permitimos o no la actuación de la gravedad
        this.platform.body.allowGravity = false;

        //Establecemos que la plataforma colisione con todos los lados de la escena (izquierda y derecha en este caso por que solo se mueve en el eje x)
        this.platform.setCollideWorldBounds(true);

        this.ball = this.physics.add.image(385, 330, 'ball');
        this.ball.setData('glue', true)
        
        //Establecemos que la bola colisione con todos los lados de la escena
        this.ball.setCollideWorldBounds(true);
 //!--------------Modificación de los valores de la velocidad de la bola-------------------\/ ///
        //? Calcula la velocidad (velocityBall) multiplicando 100 por un valor aleatorio entre 1.3 y 2.
        //? Líneas comentadas porque hacían que la bola se moviese desde el principio y queremos que empiece desde la plataforma
        // let velocityBall = 100 * Phaser.Math.Between(1.3, 2)
        // if (Phaser.Math.Between(0, 10) > 5) {
        //     velocityBall = 0 - velocityBall
        // }
        // this.ball.setVelocity(velocityBall, 10);
//!--------------Modificación de los valores de la velocidad de la bola------------------- /\ ///

//!--------------Método que explica las colisiones entre la bola y la plataforma y  como cuenta los puntos-------------------\/ ///
        //Código relacionado con las colisiones entre elementos. en este caso la plataforma y la bola. Método collider(1º, 2º,3º,4º, 5º)
        //Parámetros: 1º: objeto 2º: objeto 3º: comportamiento a ejecutar , 4º: función callback que decide cuando hay colision y cuando no,5º: contexto ; 
        //Si sólo declaramos los objetos que van a colisionar, uno de los objetos desplaza al otro
        //El 5º parámetro se puede cambiar por el método bind de js en el 3er parámetro this.ejecutar.bind(this)
        this.physics.add.collider(this.ball, this.platform, this.platformImpact, null, this)
//!--------------Método que explica las colisiones entre la bola y la plataforma y  como cuenta los puntos-------------------/\ ///

        //Método setBounce (potencia): cuanto más alta sea la potencia más lejos llegará al rebotar
        this.ball.setBounce(1);

//!----------------uso de los cursores para jugar--------------------------------------- \/ //
        //manera de acceder a las pulsaciones de los cursores, se utilizará después en el método update
        this.cursors = this.input.keyboard.createCursorKeys();
//!----------------uso de los cursores para jugar--------------------------------------- /\ //

    }
    // La variable relativeImpact  = punto en eje x de la bola y punto del eje x de la plataforma, siendo numeros más pequeños ( negativos)...
    //... cuanto más a la izquierda de la plataforma choca la bola 
    //Se le aplica a relativeImpact un aumento en función de en que lado choque, para que sea un movimiento más aleatorio,...
    //... sobre todo cuando choca en el centro de la plataforma
    platformImpact(ball, platform){
        this.scoreboard.incrementPoints(1)
        let relativeImpact = ball.x - platform.x
        console.log(relativeImpact)
        if (relativeImpact < 0.1 && relativeImpact > -0.1) {
            ball.setVelocityX(Phaser.Math.Between(-10, 10))
        } else {
            ball.setVelocityX(10 * relativeImpact)
        }
    }
    //--update --> método que se ejecuta en bucle de manera infinita siempre que la escena esté activa
    update() {
        //isDown --> método que sabe si la tecla está siendo pulsada, si la tecla left está siendo pulsada se moverá hacia la izquierda a -500(izquierda)...
        //... si la tecla right está siendo pulsada se moverá hacia la derecha a 500(derecha), si no se pulsa ninguna tecla la plataforma se quedará parada
        if (this.cursors.left.isDown) {
            this.platform.setVelocityX(-500);
            if (this.ball.getData('glue')) {
                this.ball.setVelocityX(-500)
            }
            
        }
        else if  (this.cursors.right.isDown) {
            this.platform.setVelocityX(500)
            if (this.ball.getData('glue')) {
                this.ball.setVelocityX(500)
            }
        }
        else  {
            this.platform.setVelocityX(0)
            if (this.ball.getData('glue')) {
                this.ball.setVelocityX(0)
            }
        }
        if (this.ball.y > 450) {
            console.log('Game Over');
            this.gameoverImage.visible = true;
            this.scene.pause();
        }
        if (this.cursors.up.isDown) {
            this.ball.setVelocity(-75, -300);
            this.ball.setData('glue', false)
        }
    }

    //-- Preload carga elementos y el create escoge aquellos elementos que necesite para crear la escena que toque, mediante:
    //? carga asincrona con Axios desde un servidor web
}