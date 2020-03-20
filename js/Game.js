class Game {
    #height = undefined;
    #width = undefined;
    #pixel = undefined;

    #color = undefined;

    #snake = undefined;

    constructor(h, w, p){
        this.#pixel = p;

        this.#height = h*p;
        this.#width = w*p;

        this.#color = color(10, 100, 150);

        this.#snake = new Snake( Math.floor(w / 2), Math.floor(h / 2), p );
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
    getPixel(){
        return this.#pixel;
    }

    setColor(c){
        this.#color = c;
    }

    display(){
        fill(this.getColor());
        rect(0, 0, this.getWidth(), this.getHeight());
        this.#snake.display();
    }
}