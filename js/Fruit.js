class Fruit {
    game = undefined;
    #pos = undefined;

    #color = undefined;

    constructor(c, g) {   
        this.game = g;

        const margin = 4;
        const x = Math.floor(Math.random() * (this.game.getWidth() - margin) + margin/2);
        const y = Math.floor(Math.random() * (this.game.getHeight() - margin) + margin/2);
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