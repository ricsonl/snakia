class Snake {
    #x = undefined;
    #y = undefined;

    #color = undefined;

    #body = undefined;

   constructor(){
       this.#color = 255;
       this.#body = [];
   }

    getX() {
        return this.#x;
    }
    getY() {
        return this.#y;
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
        for(let i=0; i<this.getBody().length; i++){

        }
    }
}