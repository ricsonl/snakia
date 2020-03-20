class Game {
    #pixel = undefined;
    #height = undefined;
    #width = undefined;

    #color = undefined;

    #snakes = undefined;
    #fruits = undefined;

    constructor(h, w, p, s){
        this.#pixel = p;

        this.#height = h;
        this.#width = w;

        this.#color = color(0, 0, 0);

        this.#snakes = [];
        this.#fruits = [];
        for(let i=0; i<s; i++){
            this.#snakes[i] = new Snake(Math.floor(w / 2), Math.floor(h / 2), this);
            this.#fruits[i]= new Fruit(Math.floor(Math.random() * (w-2) +2), Math.floor(Math.random() * (h-2) +2), this);
        }

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
    /*getSnakes(){
        return ;
    }*/
    /*getFruits(){
        return;
    }*/

    setColor(c){
        this.#color = c;
    }

    display() {
        noStroke();

        fill(this.getColor());
        rect(0, 0, this.getWidth()*this.getPixel(), this.getHeight()*this.getPixel());
   
        for(let i=0; i<this.#snakes.length; i++){
            this.#snakes[i].display();
            if(!this.#snakes[i].checkCollision()){
                this.#snakes[i].updatePos();
                this.#fruits[i].display();
                let body = this.#snakes[i].getBody();
                if (JSON.stringify(body[0]) === JSON.stringify(this.#fruits[i].getPos())) {
                    this.#snakes[i].grow();
                    this.#fruits[i].setPos(Math.floor(Math.random() * (this.getWidth() - 2) + 2), Math.floor(Math.random() * (this.getHeight() - 2) + 2));
                }
            }
        }
    }

    humanControlSnake(key){
        this.#snakes[0].humanControl(key);
    }
}