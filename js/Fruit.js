class Fruit {
    #game = undefined;
    #pos = undefined;

    #color = undefined;

    constructor(x, y, g) {
        if(arguments.length == 1){
            this.#game = x.getGame();
            this.#pos = x.getPos();

            this.#color = x.getColor();
        } else {   
            this.#game = g;
            this.#pos = { x: x*g.getPixel(), y: y*g.getPixel() };

            this.#color = color(240, 10, 30);
        }
    }

    getGame() {
        return this.#game;
    }
    getPos() {
        return JSON.parse(JSON.stringify(this.#pos));
    }
    getColor() {
        return color(this.#color);
    }

    setPos(x, y) {
        this.#pos = { x: x*this.#game.getPixel(), y: y*this.#game.getPixel() };
    }
    setColor(c) {
        this.#color = c;
    }

    display() {
        let coord = this.getPos();
        stroke(this.getColor());
        strokeWeight(this.#game.getPixel()); 
        line(coord.x, coord.y, coord.x, coord.y);
    }
}