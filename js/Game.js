class Game {
    #pixel = undefined;
    #height = undefined;
    #width = undefined;

    #color = undefined;

    #snake = undefined;
    #fruit = undefined;

    constructor(h, w, p){
        this.#pixel = p;

        this.#height = h*p;
        this.#width = w*p;

        this.#color = color(0, 0, 0);

        this.#snake = new Snake(Math.floor(w / 2), Math.floor(h / 2), p);
        this.#fruit = new Fruit(Math.floor(Math.random() * (w-2) +2), Math.floor(Math.random() * (h-2) +2), p);
    }
    
    getPixel(){
        return this.#pixel;
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
    getSnake(){
        return this.#snake;
    }
    getFruit(){
        return this.#fruit;
    }

    setColor(c){
        this.#color = c;
    }

    checkStatus(){
        if (
            this.getSnake().getBody()[0].x > this.getWidth() ||
            this.getSnake().getBody()[0].x < 0 ||
            this.getSnake().getBody()[0].y > this.getHeight() ||
            this.getSnake().getBody()[0].y < 0 ||
            this.getSnake().checkCollision()
        ) {
            noLoop();
            console.log('fodase');
        }
    }

    display(){
        fill(this.getColor());
        rect(0, 0, this.getWidth(), this.getHeight());   

        this.getFruit().display();

        this.getSnake().display();
        this.getSnake().updatePos();

        this.checkStatus();
    }
}