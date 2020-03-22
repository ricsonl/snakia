class Fruit {
    game = undefined;
    #pos = undefined;

    #color = undefined;

    constructor(x, y, c, g) {   
        this.game = g;
        this.#pos = { x: x*g.getPixel(), y: y*g.getPixel() };

        this.#color = c;
    }

    getPos() {
        return JSON.parse(JSON.stringify(this.#pos));
    }
    getColor() {
        return color(this.#color);
    }

    setPos(x, y) {
        this.#pos = { x: x*this.game.getPixel(), y: y*this.game.getPixel() };
    }
    setColor(c) {
        this.#color = c;
    }

    display() {
        stroke(this.#color);
        strokeWeight(this.game.getPixel()); 
        line(this.#pos.x, this.#pos.y, this.#pos.x, this.#pos.y);
    }
}