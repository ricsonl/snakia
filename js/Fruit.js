class Fruit {
    #pixel = undefined;
    #pos = undefined;

    #color = undefined;

    constructor(x, y, p) {
        this.#pixel = p;
        this.#pos = { x: x*p, y: y*p };

        this.#color = color(240, 10, 30);
    }

    getPixel() {
        return this.#pixel;
    }
    getPos() {
        return this.#pos;
    }
    getColor() {
        return this.#color;
    }

    setPos(x, y) {
        this.#pos = { x: x*this.getPixel(), y: y*this.getPixel()};
    }
    setColor(c) {
        this.#color = c;
    }

    display() {
        let coord = this.getPos();
        stroke(this.getColor());
        strokeWeight(this.getPixel()); 
        line(coord.x, coord.y, coord.x, coord.y);
    }
}