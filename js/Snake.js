class Snake {
    #pixel = undefined;
    #body = undefined;
    #dir = undefined;

    #color = undefined;

    constructor(x, y, p){
        if(arguments.length == 1){
            this.#pixel = x.getPixel();
            this.#body = x.getBody();
            this.#dir = x.getDir();

            this.#color = x.getColor();
        } else {
            this.#pixel = p;
            this.#body = [
                            { x: x*p, y: y*p }, 
                            { x: (x-1)*p, y: y*p }, 
                            { x: (x-2)*p, y: y*p }
                        ];
            this.#dir = 'R';

            this.#color = color(255, 255, 255);
        }
    }

    getPixel() {
        return this.#pixel.valueOf();
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
        strokeWeight(this.getPixel());
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

    control(key){
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
                this.walk(_x, _y-this.#pixel);
                break;
            case 'R':
                this.walk(_x+this.#pixel, _y);
                break;
            case 'D':
                this.walk(_x, _y+this.#pixel);
                break;
            case 'L':
                this.walk(_x-this.#pixel, _y);
                break; 
        }
    }
}