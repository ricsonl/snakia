class Game {
    #height = undefined;
    #width = undefined;

    #color = undefined;

    #snake = undefined;

    constructor(h, w, color) {
        this.#height = h;
        this.#width = w;

        this.#color = color;

        this.#snake = new Snake();

        this.#snake.setX(w/2);
        this.#snake.setY(h/2);
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

    setHeight(h){
        this.#height = h;
    }
    setWidth(w){
        this.#width = h;
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