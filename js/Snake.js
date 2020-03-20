class Snake {
    #x = undefined;
    #y = undefined;
    #pixel = undefined;

    #color = undefined;

    #body = undefined;

    constructor(x, y, p){
        this.#pixel = p;

        this.#x = x*p;
        this.#y = y*p;

        this.#color = color(0, 150, 50);

        this.#body = [{x: this.#x, y: this.#y}];
    }

    getX() {
        return this.#x;
    }
    getY() {
        return this.#y;
    }
    getPixel() {
        return this.#pixel;
    }
    getColor() {
        return this.#color;
    }
    getBody() {
        return this.#body;
    }

    setX(x) {
        this.#x = x;
    }
    setY(y) {
        this.#y = y;
    }
    setColor(c) {
        this.#color = c;
    }
    setBody(b) {
        this.#body = b;
    }

    display(){
        fill(this.getColor());
        for(let i=0; i<this.getBody().length; i++){
            let _x = this.getBody()[i].x;
            let _y = this.getBody()[i].y;
            rect(_x, _y, this.getPixel(), this.getPixel());
        }
    }
}