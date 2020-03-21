class Snake {
    #game = undefined;
    #fruit = undefined;
    #body = undefined;
    #dir = undefined;

    #nn = undefined;

    #color = undefined;

    constructor(x, y, g, f){
        this.#game = g;
        this.#fruit = f;
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
    getFruit() {
        return this.#fruit;
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

    setFruit(f) {
        this.#fruit = f;
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
    setColor(c){
        this.#color = c;
    }

    drawDist(){
        let pixel = this.#game.getPixel();
        let width = this.#game.getWidth()*pixel;
        let height = this.#game.getHeight()*pixel;

        let head = this.#body[0];
        let tail = this.#body[this.#body.length -1];
        let food = this.#fruit.getPos();

        strokeWeight(0.5);

        stroke(color(255, 190, 20));
        //N->food
        line(head.x, head.y - pixel, food.x, food.y);
        //E->food
        line(head.x + pixel, head.y, food.x, food.y);
        //S->food
        line(head.x, head.y + pixel, food.x, food.y);
        //W->food
        line(head.x - pixel, head.y, food.x, food.y);

        stroke(color(0, 255, 0));
        //N->tail
        line(head.x, head.y-pixel, tail.x, tail.y);
        //E->tail
        line(head.x + pixel, head.y, tail.x, tail.y);
        //S->tail
        line(head.x, head.y + pixel, tail.x, tail.y);
        //W->tail
        line(head.x - pixel, head.y, tail.x, tail.y);

        stroke(color(50, 120, 255));
        //N->wall
        line(head.x, head.y-pixel, head.x, 0);
        //E->wall
        line(head.x + pixel, head.y, width, head.y);
        //S->wall
        line(head.x, head.y + pixel, head.x, height);
        //W->wall
        line(head.x - pixel, head.y, 0, head.y);
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