class Fruit {
    game = undefined;
    #pos = undefined;

    #color = undefined;

    constructor(c, g) {  
        if(c instanceof Fruit){
            this.game = c.game;
            this.#pos = c.getPos();
            this.#color = c.getColor();
        } 
        this.game = g;

        this.setRandomPos();

        this.#color = c;
    }

    getPos() {
        return JSON.parse(JSON.stringify(this.#pos));
    }
    getColor() {
        return color(this.#color);
    }

    setRandomPos() {
        const margin = 5;
        const x = Math.round(Math.random() * (this.game.getWidth() - margin) + margin / 2);
        const y = Math.round(Math.random() * (this.game.getHeight() - margin) + margin / 2);
        this.#pos = { x: x * this.game.getPixel(), y: y * this.game.getPixel() };
    }
    setColor(c) {
        this.#color = c;
    }

    display() {
        //stroke(this.#color);
        //strokeWeight(this.game.getPixel()); 
        line(this.#pos.x, this.#pos.y, this.#pos.x, this.#pos.y);
    }
}