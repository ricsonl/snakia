class Snake {
    #game = undefined;
    #body = undefined;
    #dir = undefined;

    #nn = undefined;

    #color = undefined;

    constructor(x, y, g){
        this.#game = g;
        this.#body = [
                        { x: x*g.getPixel(), y: y*g.getPixel() }, 
                        { x: (x-1)*g.getPixel(), y: y*g.getPixel() }, 
                        { x: (x-2)*g.getPixel(), y: y*g.getPixel() }
                    ];
        this.#dir = ['U', 'R', 'D', 'L'][Math.floor(Math.random()*4)];

        this.#nn = new NeuralNetwork(24, [18,18], 4);            

        this.#color = color(255, 255, 255);
    }

    getGame() {
        return this.#game;
    }
    getBody() { 
        return this.#body.slice();
    }
    getDir() {
        return this.#dir.valueOf();
    }
    getColor() {
        return color(this.#color);
    }

    setDir(d) {
        switch(d){
            case 'U':
                if(this.#dir != 'D')
                    this.#dir = d;
                break;
            case 'R':
                if(this.#dir != 'L')
                    this.#dir = d;
                break;
            case 'D':
                if(this.#dir != 'U')
                    this.#dir = d;
                break;
            case 'L':
                if(this.#dir != 'R')
                    this.#dir = d;
                break;
        }
    }
    setColor(c) {
        this.#color = c;
    }
    
    display(){
        stroke(this.getColor());
        strokeWeight(this.#game.getPixel());
        let body = this.getBody();

        let prev = body[0];
        for(let i=1; i<body.length; i++){
            let curr = body[i];
            if ((curr.x != prev.x && curr.y != prev.y)){
                line(prev.x, prev.y, body[i-1].x, body[i-1].y);
                prev = body[i - 1];
            }
            if (i == body.length-1){
                line(prev.x, prev.y, curr.x, curr.y);
            }
        }
    }

    walk(x, y) {
        this.#body.pop();
        this.#body.unshift({ x: x, y: y });
    }

    grow() {
        this.#body.push(this.#body[this.#body.length - 1]);
    }

    updatePos(){
        let _x = this.#body[0].x;
        let _y = this.#body[0].y;
        
        switch(this.#dir){
            case 'U':
                this.walk(_x, _y-this.#game.getPixel());
                break;
            case 'R':
                this.walk(_x+this.#game.getPixel(), _y);
                break;
            case 'D':
                this.walk(_x, _y+this.#game.getPixel());
                break;
            case 'L':
                this.walk(_x-this.#game.getPixel(), _y);
                break; 
        }
    }

    checkCollision() {
        let body = this.getBody();

        let _x = body[0].x;
        let _y = body[0].y;

        for (let i = 1; i < body.length - 1; i++) {
            let segm = body[i];
            if (segm.x == _x && segm.y == _y ||
                this.getBody()[0].x > (this.#game.getWidth() * this.#game.getPixel()) ||
                this.getBody()[0].x < 0 ||
                this.getBody()[0].y > (this.#game.getHeight() * this.#game.getPixel()) ||
                this.getBody()[0].y < 0
                ) {
                this.setColor(color(255, 0, 0));
                return true;
            }
        }
    }

    humanControl(key) {
        switch (key) {
            case 38:
                this.setDir('U');
                break;
            case 39:
                this.setDir('R');
                break;
            case 40:
                this.setDir('D');
                break;
            case 37:
                this.setDir('L');
                break;
        }
    }

    think(){
        /*let inputs = [  1.0, 0.5, 0.2, 0.3,
                        1.0, 0.5, 0.2, 0.3,
                        1.0, 0.5, 0.2, 0.3,
                        1.0, 0.5, 0.2, 0.3,
                        1.0, 0.5, 0.2, 0.3,
                        1.0, 0.5, 0.2, 0.3
                    ]*/

        let inputs = [];

        inputs[0] = ;
        inputs[1] = ;
        inputs[2] = ;
        inputs[3] = ;
        inputs[4] = ;
        inputs[5] = ;
        inputs[6] = ;
        inputs[7] = ;
        inputs[8] = ;
        inputs[9] = ;
        inputs[10] = ;
        inputs[11] = ;
        inputs[12] = ;
        inputs[13] = ;
        inputs[14] = ;
        inputs[15] = ;
        inputs[16] = ;
        inputs[17] = ;
        inputs[18] = ;
        inputs[19] = ;
        inputs[20] = ;
        inputs[21] = ;
        inputs[22] = ;
        inputs[23] = ;

        let output = this.#nn.predict(inputs);
        switch (output.indexOf(Math.max(...output))){
            case 0:
                this.setDir('U');
                break;
            case 1:
                this.setDir('R');
                break;
            case 2:
                this.setDir('D');
                break;
            case 3:
                this.setDir('L');
                break;
        }
    }
}