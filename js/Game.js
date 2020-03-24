class Game {
    #pixel = undefined;
    #height = undefined;
    #width = undefined;

    #color = undefined;

    #population = undefined;
    #generation = undefined;

    constructor(s){
        this.#pixel = 15;

        this.#height = (windowHeight - 40) / this.#pixel;
        this.#width = (windowWidth - 250) / this.#pixel;

        this.#color = color(0, 0, 0);

        this.#population = new Population(s, this);
        this.#generation = 1;

        createCanvas(this.#width * this.#pixel, this.#height * this.#pixel);
        frameRate(8);
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
    getGen(){
        return this.#generation.valueOf();
    }

    evolve(cycles, dists){
        for (let c = 0; c < cycles; c++) {
            for (let i = 0; i < this.#population.snakes.length; i++) {
                if (JSON.stringify(this.#population.snakes[i].getBody()[0]) === JSON.stringify(this.#population.snakes[i].fruit.getPos())) {
                    this.#population.snakes[i].grow();
                    this.#population.snakes[i].fruit.setPos(Math.floor(Math.random() * (this.getWidth() - 2) + 2), Math.floor(Math.random() * (this.getHeight() - 2) + 2));
                }
                this.#population.snakes[i].think();
                this.#population.snakes[i].checkCollision();
            }

            for (let i = 0; i < this.#population.snakes.length; i++)
                if (this.#population.snakes[i].isDead())
                    this.#population.removeSnake(i);

            if (this.#population.snakes.length == 0) {
                this.#population = this.#population.nextGeneration();
                this.#generation++;
                break;
            }
        }
        this.display(dists);
    }

    display(dists=false) {
        clear();
        background(this.getColor());
        for (let i = 0; i < this.#population.snakes.length; i++){
            this.#population.snakes[i].display();
            if(dists)
                this.#population.snakes[i].drawDist();
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