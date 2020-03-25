class Game {
    #pixel = undefined;
    #height = undefined;
    #width = undefined;

    #color = undefined;

    #population = undefined;
    #generation = undefined;

    constructor(s){
        this.#pixel = 20;

        this.#height = Math.floor((windowHeight*98/100) / this.#pixel);
        this.#width = Math.floor((windowWidth*4/5) / this.#pixel);

        this.#color = color(0, 0, 0);

        this.#population = new Population(s, this);
        this.#generation = 1;

        createCanvas(this.#width * this.#pixel, this.#height * this.#pixel);
        frameRate(0.7);
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
        this.display(dists);
        for (let c = 0; c < cycles; c++) {
            for (let i = 0; i < this.#population.snakes.length; i++) {
                if (this.#population.snakes[i].ate()) {
                    this.#population.snakes[i].grow();
                    this.#population.snakes[i].setFruitPos(Math.floor(Math.random() * (this.getWidth() - 2) + 2), Math.floor(Math.random() * (this.getHeight() - 2) + 2));
                }
                //this.#population.snakes[i].follow();
                this.#population.snakes[i].think();
                this.#population.snakes[i].checkCollision();
            }

            for (let i = 0; i < this.#population.snakes.length; i++)
                if (this.#population.snakes[i].isDead()){
                    this.#population.removeSnake(i);
                    i--;
                }

            for (let i = 0; i < this.#population.snakes.length; i++)
                this.#population.checkBest(i);

            if (this.#population.snakes.length == 0) {
                this.#population = this.#population.nextGeneration();
                this.#generation++;
                break;
            }
        }
    }

    display(lines=false) {
        clear();
        background(this.getColor());
        for (let i = 0; i < this.#population.snakes.length; i++){
            this.#population.snakes[i].display();
            if(lines)
                this.#population.snakes[i].drawLines();
        }
    }

    humanControl(key) {
        switch (key) {
            case 38:
                if (this.#population.snakes[0].getDir() != 'D') this.#population.snakes[0].setDir('U');
                break;

            case 39:
                if (this.#population.snakes[0].getDir() != 'L') this.#population.snakes[0].setDir('R');
                break;

            case 40:
                if (this.#population.snakes[0].getDir() != 'U') this.#population.snakes[0].setDir('D');
                break;

            case 37:
                if (this.#population.snakes[0].getDir() != 'R') this.#population.snakes[0].setDir('L');
                break;
        }
    }
}