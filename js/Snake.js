class Snake {
    #pixel = undefined;
    #body = undefined;
    #dir = undefined;

    #color = undefined;

    constructor(x, y, p){
        this.#pixel = p;
        this.#body = [
                        { x: x*p, y: y*p }, 
                        { x: (x-1)*p, y: y*p }, 
                        { x: (x-2)*p, y: y*p },
                        { x: (x-3)*p, y: y*p },
                        { x: (x-4)*p, y: y*p },
                        { x: (x-5)*p, y: y*p },
                        { x: (x-6)*p, y: y*p },
                        { x: (x-7)*p, y: y*p }
                    ];
        this.#dir = 'R';

        this.#color = color(255, 255, 255);
    }

    getPixel() {
        return this.#pixel;
    }
    getBody() {
        return this.#body;
    }
    getDir() {
        return this.#dir;
    }
    getColor() {
        return this.#color;
    }

    setBody(x, y) {
        this.#body.pop();
        this.#body.unshift({x: x, y: y});
    }
    setDir(d) {
        switch(d){
            case 'U':
                if(this.getDir() != 'D')
                    this.#dir = d;
                break;
            case 'R':
                if(this.getDir() != 'L')
                    this.#dir = d;
                break;
            case 'D':
                if(this.getDir() != 'U')
                    this.#dir = d;
                break;
            case 'L':
                if(this.getDir() != 'R')
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
        var prev = this.getBody()[0];
        for(let i=1; i<this.getBody().length; i++){
            let curr = this.getBody()[i];
            if ((curr.x != prev.x && curr.y != prev.y)){
                line(prev.x, prev.y, this.getBody()[i-1].x, this.getBody()[i-1].y);
                prev = this.getBody()[i - 1];
            }
            if (i == this.getBody().length-1){
                line(prev.x, prev.y, curr.x, curr.y);
            }
        }
    }

    updatePos(){
        let _x = this.getBody()[0].x;
        let _y = this.getBody()[0].y;
        
        switch(this.getDir()){
            case 'U':
                this.setBody(_x, _y-this.getPixel());
                break;
            case 'R':
                this.setBody(_x+this.getPixel(), _y);
                break;
            case 'D':
                this.setBody(_x, _y+this.getPixel());
                break;
            case 'L':
                this.setBody(_x-this.getPixel(), _y);
                break; 
        }
    }

    checkCollision(){
        let _x = this.getBody()[0].x;
        let _y = this.getBody()[0].y;

        for (let i = 1; i<this.getBody().length-1; i++) {
            let b = this.getBody()[i];
            if (b.x == _x && b.y == _y) {
                return true;
            }
        }
    }
}