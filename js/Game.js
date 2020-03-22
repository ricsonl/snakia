class Game {
    #pixel = undefined;
    #height = undefined;
    #width = undefined;

    #color = undefined;

    #population = undefined;

    constructor(h, w, p, s){
        this.#pixel = p;

        this.#height = h;
        this.#width = w;

        this.#color = color(0, 0, 0);

        this.#population = new Population(s, this);

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

    display() {
        noStroke();

        fill(this.getColor());
        rect(0, 0, this.getWidth()*this.getPixel(), this.getHeight()*this.getPixel());
   
        for(let i=0; i<this.#population.snakes.length; i++){
            if(!this.#population.snakes[i].checkCollision()){
                if (JSON.stringify(this.#population.snakes[i].getBody()[0]) === JSON.stringify(this.#population.snakes[i].fruit.getPos())) {
                    this.#population.snakes[i].grow();
                    this.#population.snakes[i].fruit.setPos(Math.floor(Math.random() * (this.getWidth() - 2) + 2), Math.floor(Math.random() * (this.getHeight() - 2) + 2));
                }
                this.#population.snakes[i].think();
                this.#population.snakes[i].drawDist();
            }
            this.#population.snakes[i].display();
            if (this.#population.snakes[i].isDead()) this.#population.removeSnake(i);
        }

        if(this.#population.snakes.length == 0){
            this.#population = this.#population.nextGeneration();
        }
    }

    humanControl(key) {
        switch (key) {
            case 39:
                this.#population.snakes[0].walk('right');
                break;
            case 37:
                this.#population.snakes[0].walk('left');
                break;
            default:
                this.#population.snakes[0].walk('ahead');
        }
    }
}