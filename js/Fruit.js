class Fruit {
    #pixel = undefined;
    #pos = undefined;

    #color = undefined;

    constructor(x, y, p) {
        if(arguments.length == 1){
            this.#pixel = x.getPixel();
            this.#pos = x.getPos();

            this.#color = x.getColor();
        } else {   
            this.#pixel = p;
            this.#pos = { x: x*p, y: y*p };

            this.#color = color(240, 10, 30);
        }
    }

    getPixel() {
        return this.#pixel.valueOf();
    }
    getPos() {
        return JSON.parse(JSON.stringify(this.#pos));
    }
    getColor() {
        return color(this.#color);
    }

    setPos(x, y) {
        this.#pos = { x: x*this.#pixel, y: y*this.#pixel };
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