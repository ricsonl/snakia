class Game {
    #pixel = undefined;
    #height = undefined;
    #width = undefined;

    #color = undefined;

    #snake = undefined;
    #fruit = undefined;

    constructor(h, w, p){
        this.#pixel = p;

        this.#height = h;
        this.#width = w;

        this.#color = color(0, 0, 0);

        this.#snake = new Snake(Math.floor(w / 2), Math.floor(h / 2), p);
        this.#fruit = new Fruit(Math.floor(Math.random() * (w-2) +2), Math.floor(Math.random() * (h-2) +2), p);
        
        createCanvas(this.getWidth()*this.getPixel(), this.getHeight()*this.getPixel());
        frameRate(20);
    }
    
    getPixel(){
        return this.#pixel.valueOf();
    }
    getHeight(){
        return this.#height.valueOf();
    }
    getWidth(){
        return this.#width.valueOf();
    }
    getColor(){
        return color(this.#color);
    }
    getSnake(){
        return new Snake(this.#snake);
    }
    getFruit(){
        return new Fruit(this.#fruit);
    }

    setColor(c){
        this.#color = c;
    }

    display() {
        noStroke();

        fill(this.getColor());
        rect(0, 0, this.getWidth()*this.getPixel(), this.getHeight()*this.getPixel());

        this.#fruit.display();

        this.#snake.display();
        this.#snake.updatePos();

        this.checkStatus();
    }

    controlSnake(key){
        this.#snake.control(key);
    }

    checkSnakeCollision() {
        let body = this.getSnake().getBody();

        let _x = body[0].x;
        let _y = body[0].y;

        for (let i = 1; i < body.length - 1; i++) {
            let segm = body[i];
            if (segm.x == _x && segm.y == _y ||
                this.#snake.getBody()[0].x > (this.#width*this.#pixel) ||
                this.#snake.getBody()[0].x < 0 ||
                this.#snake.getBody()[0].y > (this.#height*this.#pixel) ||
                this.#snake.getBody()[0].y < 0
                ) {
                return true;
            }
        }
    }

    checkStatus(){
        if (this.checkSnakeCollision()) {
            noLoop();
            console.log('fodase');
        }

        let body = this.#snake.getBody();
        if (JSON.stringify(body[0]) === JSON.stringify(this.#fruit.getPos())) {
            this.#snake.grow();
            this.#fruit.setPos(Math.floor(Math.random() * (this.getWidth()-2) + 2), Math.floor(Math.random() * (this.getHeight()-2) + 2));
        }
    }
}