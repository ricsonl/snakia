class Game {
    #pixel = undefined;
    #height = undefined;
    #width = undefined;

    #color = undefined;

    #population = undefined;

    #canvas = undefined;
    #title = undefined;
    #generation = undefined;
    #velocitySlider = undefined;
    #bestSoFar = undefined;
    
    #generationTxt = undefined;
    #bestSoFarTxt = undefined;
    #velocityTxt = undefined;

    constructor(s){
        this.#pixel = 14;

        this.#height = Math.floor((windowHeight*90/100) / this.#pixel);
        this.#width = Math.floor((windowWidth*4/5) / this.#pixel);

        this.#color = color(0, 0, 0);

        this.#population = new Population(s, this);

        this.#canvas = createCanvas(this.#width * this.#pixel, this.#height * this.#pixel);
        this.#canvas.style('border-radius', '10px');

        this.#title = createElement('h2', 'Snakia');
        
        this.#generation = 1;
        this.#generationTxt = createP('Generation: ' + this.#generation);

        this.#bestSoFar = 0;
        this.#bestSoFarTxt = createP('Best so far: ' + this.#bestSoFar);

        this.#velocitySlider = createSlider(1, 300, 1);
        this.#velocityTxt = createP(this.#velocitySlider.value() + 'x');
        
        this.#canvas.parent("canvas");
        this.#title.parent("config");
        this.#generationTxt.parent("config");
        this.#bestSoFarTxt.parent("config");
        this.#velocitySlider.parent("config");
        this.#velocityTxt.parent("config");
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

    updateBestSoFar(){
        const best = this.#population.bestEater();
        if(best > this.#bestSoFar)
            this.#bestSoFar = best;
    }

    evolve(dists){
        this.#velocityTxt.html(this.#velocitySlider.value() + 'x');
        this.display(dists);
        for (let c = 0; c < this.#velocitySlider.value(); c++){
            for (let i = 0; i < this.#population.snakes.length; i++){
                if (!this.#population.snakes[i].isDead()){
                    this.#population.snakes[i].update();
                    this.#population.snakes[i].think();
                    this.#population.snakes[i].checkCollision();
                }
            }

            for (let i = 0; i < this.#population.snakes.length; i++){
                if (!this.#population.snakes[i].isDead())
                    break;
                if (i == this.#population.snakes.length - 1) {
                    this.updateBestSoFar();
                    this.#bestSoFarTxt.html('Best so far: ' + this.#bestSoFar);

                    this.#generationTxt.html('Generation: ' + this.#generation);

                    this.#population = this.#population.nextGeneration();
                    this.#generation++;
                    c = this.#velocitySlider.value();
                }
            }
        }
    }

    display(lines=false) {
        clear();
        background(this.getColor());
        for (let i = 0; i < this.#population.snakes.length; i++){
            if (!this.#population.snakes[i].isDead()){
                this.#population.snakes[i].display();
                if (lines)
                    this.#population.snakes[i].drawLines();
            }
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