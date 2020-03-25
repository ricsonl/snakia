class Population {
    snakes = undefined;

    game = undefined;

    #size = undefined;
    #backup = undefined;

    #fitness = undefined;
    #bestScore = undefined;
    #bestBrain = undefined;

    constructor(s, g) {
        if (s instanceof Population){
            this.game = s.game;
            this.#size = s.getSize();
            this.snakes = s.getSnakes();
            this.#backup = s.getBackup();
            this.#fitness = s.getFitness();
            this.#bestScore = s.getBestScore();
            this.#bestBrain = s.getBestBrain();
        } else {
            this.game = g;
            this.#size = s;
            this.snakes = [];
            for (let i = 0; i < this.#size; i++) {
                const randColor = color("hsl(" + Math.round(360 * i / this.#size) + ",80%,50%)");
                this.snakes.push(new Snake(randColor, this));
            }
            this.#backup = [];
            this.#fitness = 0;
            this.#bestScore = 0;
            this.#bestBrain = this.snakes[0].getBrain();
        }
    }

    getSize(){
        return this.#size.valueOf();
    }
    getBackup(){
        return JSON.parse(JSON.stringify(this.#backup));
    }
    getFitness(){
        return this.#fitness.valueOf();
    }
    getBestScore(){
        return this.#bestScore.valueOf();
    }
    getBestBrain(){
        let bestIndex = 0;
        for (let i = 1; i < this.#backup.length; i++) {
            if (this.#backup[i]['score'] > this.#backup[bestIndex]['score'])
            bestIndex = i;
        }
        return this.#backup[bestIndex]['brain'];
    }

    checkBest(){
        for (let i = 0; i < this.snakes.length; i++)
            if(this.snakes[i].getScore() > this.#bestScore){
                this.#bestScore = this.snakes[i].getScore();
                this.#bestBrain = this.snakes[i].getBrain();
            }
    }

    removeSnake(i) {
        const deadSnake = this.snakes.splice(i, 1)[0];
        this.#backup.push({
            'brain': deadSnake.getBrain(),
            'score': deadSnake.getScore(),
            'fitness': undefined,
            'color': deadSnake.getColor()
        });
    }

    calculateFitness() {
        for (let i = 0; i < this.#backup.length; i++) {
            this.#backup[i]['score'] = Math.pow(this.#backup[i]['score'], 2);
        }

        let sum = 0;
        for (let i = 0; i < this.#backup.length; i++) {
            sum += this.#backup[i]['score'];
        }
        this.#fitness = sum;

        for (let i = 0; i < this.#backup.length; i++) {
            this.#backup[i]['fitness'] = this.calculateSnakeFinalScore(i) / this.#fitness;
        }
    }

    pickOne() {
        let index = 0;
        let r = random(1);
        while (r > 0) {
            r -= this.#backup[index]['fitness'];
            index++;
        }
        index--;

        const childBrain = this.#backup[index]['brain'];
        const childColor = this.#backup[index]['color'];
        let child = new Snake(childColor, this);
        child.setBrain(childBrain);
        child.mutate();
        return child;
    }

    nextGeneration() {
        this.calculateFitness();
        let next = new Population(this.#size, this.game);
        for (let i = 0; i < this.#size; i++) {
            next.snakes[i] = this.pickOne();
        }
        return next;
    }
}