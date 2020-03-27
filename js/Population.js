function mutateFunc(x) {
    if (random(1) < 0.1) {
        let offset = randomGaussian() * 0.5;
        let newx = x + offset;
        return newx;
    } else {
        return x;
    }
}

class Population {
    snakes = undefined;

    game = undefined;

    #size = undefined;

    #bestEat = undefined;
    #alive = undefined;

    constructor(s, g) {
        if (s instanceof Population){
            this.snakes = s.getSnakes();
            this.game = s.game;
            this.#size = s.getSize();
            this.#bestEat = s.getBestEat();
            this.#alive = s.getAlive();
        } else if (s instanceof Array){
            this.game = g;
            this.#size = s.length;
            this.snakes = [];
            for (let i = 0; i < this.#size; i++) {
                const randColor = color("hsl(" + Math.round(360 * i / this.#size) + ",80%,50%)");
                this.snakes.push(s[i]);
            }
            this.#bestEat = 0;
            this.#alive = this.#size;
            this.updateBestEat();
            this.updateAlive();
        } else {
            this.game = g;
            this.#size = s;
            this.snakes = [];
            for (let i = 0; i < this.#size; i++) {
                const randColor = color("hsl(" + Math.round(360 * i / this.#size) + ",80%,50%)");
                this.snakes.push(new Snake(randColor, this));
            }
            this.#bestEat = 0;
            this.#alive = this.#size;
            this.updateBestEat();
            this.updateAlive();
        }
    }

    getSize(){
        return this.#size.valueOf();
    }
    getBestEat(){
        return this.#bestEat.valueOf();
    }
    getAlive(){
        return this.#alive.valueOf();
    }
     
    updateBestEat(){
        for (let i = 0; i < this.#size; i++){
            if(this.snakes[i].fruitsEaten() > this.#bestEat){
                this.#bestEat = this.snakes[i].fruitsEaten();
            }
        }
    }
    updateAlive(){
        let alive = 0;
        for (let i = 0; i < this.#size; i++){
            if(!this.snakes[i].isDead())
                alive++;
        }
        if(alive < this.#alive) this.#alive = alive;
    }

    replicate(best){
        let childs = [];
        let child;
        let parentBrain;
        let parentColor;
        while(childs.length < this.#size){
            let rand = Math.floor(Math.random() * best.length);
            parentBrain = best[rand].getBrain();
            parentColor = best[rand].getColor();

            child = new Snake(parentColor, this);
            parentBrain.mutate(mutateFunc);
            child.setBrain(parentBrain);

            childs.push(child);
        }

        return childs;
    }

    nextGeneration() {
        const perc = 0.1;
        const best = this.snakes.sort((a, b) => (a.getScore() < b.getScore()) ? 1 : -1).slice(0, Math.floor(perc * this.#size));
        const nextSnakes = this.replicate(best);
        let nextGen = new Population(nextSnakes, this.game);
        return nextGen;
    }
}