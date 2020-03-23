class Population {
    snakes = undefined;

    game = undefined;

    #size = undefined;
    #backup = undefined;

    constructor(s, g) {
        if (s instanceof Population){
            this.game = s.game;
            this.#size = s.getSize();
            this.snakes = s.snakes;
            this.#backup = s.getBackup();
        } else {
            this.game = g;
            this.#size = s;
            this.snakes = [];
            for (let i = 0; i < this.#size; i++) {
                const randColor = color("hsl(" + Math.round(360 * i / this.#size) + ",80%,50%)");
                this.snakes.push(new Snake(randColor, this));
            }
            this.#backup = [];
        }
    }

    getSize(){
        return this.#size.valueOf();
    }
    getBackup(){
        return JSON.parse(JSON.stringify(this.#backup));
    }

    removeSnake(i) {
        const deadSnake = this.snakes.splice(i, 1)[0];
        this.#backup.push({
            'brain': deadSnake.getBrain(),
            'score': deadSnake.getScore(),
            'distScore': deadSnake.calculateDistScore(),
            'fitness': undefined,
            'color': deadSnake.getColor()
        });
    }

    calculateSnakeFinalScore(i) {
        return (this.#backup[i]['score'] + (this.#backup[i]['distScore']) /1+(this.#backup[i]['score']));
    }

    calculateFitness() {
        let sum = 0;
        for (let i = 0; i < this.#backup.length; i++) {
            sum += this.calculateSnakeFinalScore(i);
        }
        //console.log(sum);
        for (let i = 0; i < this.#backup.length; i++) {
            this.#backup[i]['fitness'] = this.calculateSnakeFinalScore(i) / sum;
        }
    }

    pickOne() {
        let index = 0;
        let r = random(1);
        while (r > 0) {
            r = r - this.#backup[index]['fitness'];
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
        let next = new Population(this);
        //console.log(next);
        for (let i = 0; i < this.#size; i++) {
            const randColor = color("hsl(" + Math.round(360 * i / this.#size) + ",80%,50%)");
            next.snakes.push(this.pickOne());
        }
        next.#backup = [];
        return next;
    }
}