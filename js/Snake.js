class Snake {
    #pixel = undefined;
    #body = undefined;
    #dir = undefined;

    #color = undefined;

    constructor(x, y, p){
        this.#pixel = p;
        this.#body = [{x: x*p, y: y*p}];
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
        this.#body[0].x = x;
        this.#body[0].y = y;
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
        for(let i=0; i<this.getBody().length; i++){
            let _x = this.getBody()[i].x;
            let _y = this.getBody()[i].y;
            line(_x, _y, _x+1, _y+1);
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
}