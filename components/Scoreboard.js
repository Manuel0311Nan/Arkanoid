//Creamos la escena que incluye el conteo de los puntos que se van consiguiendo
export class Scoreboard {
    constructor(scene) {
        this.relatedScene = scene;
        this.score = 0
    }
    create() {
        this.scoreText = this.relatedScene.add.text(16, 16, 'Puntos: 0', {
            fontSize: '20px',
            fill: '#fff',
            fontFamily: 'verdana, arial, sans-serif'
        })
    }
    incrementPoints(points) {
        this.score += points;
        this.scoreText.setText('Puntos: '+ this.score)
    }
}