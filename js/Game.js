class Game {
    #pixel = undefined;
    #height = undefined;
    #width = undefined;

    #color = undefined;

    #snake = undefined;

    constructor(h, w, p){
        this.#pixel = p;

        this.#height = h*p;
        this.#width = w*p;

        this.#color = color(0, 0, 0);

        this.#snake = new Snake( Math.floor(w / 2), Math.floor(h / 2), p );
    }
    
    getPixel(){
        return this.#pixel;
    }
    getHeight(){
        return this.#height;
    }
    getWidth(){
        return this.#width;
    }
    getColor(){
        return this.#color;
    }
    getSnake(){
        return this.#snake;
    }

    setColor(c){
        this.#color = c;
    }

    display(){
        fill(this.getColor());
        rect(0, 0, this.getWidth(), this.getHeight());
        this.getSnake().display();
        this.getSnake().updatePos();
    }
}