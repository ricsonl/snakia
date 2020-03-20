class Snake {
    #game = undefined;
    #body = undefined;
    #dir = undefined;

    #color = undefined;

    constructor(x, y, g){
        if(arguments.length == 1){
            this.#game = x.getGame();
            this.#body = x.getBody();
            this.#dir = x.getDir();

            this.#color = x.getColor();
        } else {
            this.#game = g;
            this.#body = [
                            { x: x*g.getPixel(), y: y*g.getPixel() }, 
                            { x: (x-1)*g.getPixel(), y: y*g.getPixel() }, 
                            { x: (x-2)*g.getPixel(), y: y*g.getPixel() }
                        ];
            this.#dir = 'R';

            this.#color = color(255, 255, 255);
        }
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

    humanControl(key){
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
}