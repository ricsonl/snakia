function mutateFunc(x) {
    if (random(1) < 0.1) {
        let offset = randomGaussian() * 0.5;
        let newx = x + offset;
        return newx;
    } else {
        return x;
    }
}

class Snake {
    #dir = undefined;
    #lastScores = undefined;
    #lastMoves = undefined;
    #brain = undefined;

    #dead = undefined;
    #score = undefined;

    population = undefined;

    #body = undefined;

    #color = undefined;
    #fruit = undefined;

    constructor(c, p){
        if(c instanceof Snake){
            this.#dir = c.getDir();
            this.#lastScores = c.getLastScores();
            this.#lastMoves = c.getLastMoves();
            this.#brain = new NeuralNetwork(c.getBrain());

            this.#dead = c.isDead();
            this.#score = c.getScore();

            this.population = c.population;

            this.#body = c.getBody();

            this.#color = c.getColor();
            this.#fruit = new Fruit(c, p.game);
        } else {
            this.#dir = 'U';
            this.#lastScores = [0,];
            this.#lastMoves = ['ahead'];
            this.#brain = new NeuralNetwork(6, 5, 3);

            this.#score = 0;
            this.#dead = false;

            this.population = p;

            const x = Math.floor(this.population.game.getWidth() / 2);
            const y = Math.floor(this.population.game.getHeight() * (7 / 8));
            this.#body = [
                { x: x * p.game.getPixel(), y: y * p.game.getPixel() },
                { x: x * p.game.getPixel(), y: (y + 1) * p.game.getPixel() },
                /*{ x: x*p.game.getPixel(), y: (y+2)*p.game.getPixel() },*/
            ];

            this.#color = c;
            this.#fruit = new Fruit(c, this.population.game);

        }
    }

    getDir(){
        return this.#dir.valueOf();
    }
    getLastScores(){
        return this.#lastScores.slice();
    }
    getLastMoves(){
        return this.#lastMoves.slice();
    }
    getBrain(){
        return new NeuralNetwork(this.#brain);
    }
    isDead(){
        return (this.#dead ? true : false);
    }
    getScore(){
        return this.#score.valueOf();
    }
    getBody(){ 
        return this.#body.slice();
    }
    getColor(){
        return color(this.#color);
    }
    getFruit(){
        return new Fruit(this.#fruit);
    }

    setBrain(b){
        this.#brain = b;
    }

    ate(){
        return JSON.stringify(this.#body[0]) == JSON.stringify(this.#fruit.getPos());
    }

    setFruitPos(x, y){
        this.#fruit.setPos(x, y);
    }

    drawLines(){
        const head = this.#body[0];
        const pixel = this.population.game.getPixel();
        const width = this.population.game.getWidth();
        const height = this.population.game.getHeight();

        strokeWeight(0.6);
        stroke(this.#color);
        switch(this.#dir){
            case('U'):
                line(head.x, head.y, head.x, 0);
                line(head.x, head.y, width*pixel, head.y);
                line(head.x, head.y, 0, head.y);
                break;

            case('R'):
                line(head.x, head.y, width*pixel, head.y);
                line(head.x, head.y, head.x, height*pixel);
                line(head.x, head.y, head.x, 0);
                break;

            case('D'):
                line(head.x, head.y, head.x, height*pixel);
                line(head.x, head.y, 0, head.y);
                line(head.x, head.y, width*pixel-1, head.y);
                break;

            case('L'):
                line(head.x, head.y, 0, head.y);
                line(head.x, head.y, head.x, 0);
                line(head.x, head.y, head.x, height*pixel);
                break;
        }
    }

    display(){
        stroke(this.getColor());
        strokeWeight(this.population.game.getPixel());
        const body = this.getBody();

        let prev = body[0];
        for(let i=0; i<body.length; i++){
            const curr = body[i];
            if ((curr.x != prev.x && curr.y != prev.y)){
                line(prev.x, prev.y, body[i-1].x, body[i-1].y);
                prev = body[i - 1];
            }
            if (i == body.length-1){
                line(prev.x, prev.y, curr.x, curr.y);
            }
        }

        this.#fruit.display();
    }

    walk(dir){
        this.#body.pop();

        const x = this.#body[0].x
        const y = this.#body[0].y
        const pixel = this.population.game.getPixel();

        switch(this.#dir){
            case 'U':
                switch(dir){
                    case 'ahead':
                        this.#body.unshift({ x: x, y: y - pixel });
                        break;
                    case 'right':
                        this.#body.unshift({ x: x + pixel, y: y });
                        this.#dir = 'R';
                        break;
                    case 'left':
                        this.#body.unshift({ x: x - pixel, y: y });
                        this.#dir = 'L';
                        break;
                }
                break;

            case 'R':
                switch(dir){
                    case 'ahead':
                        this.#body.unshift({ x: x + pixel, y: y });
                        break;
                    case 'right':
                        this.#body.unshift({ x: x, y: y + pixel });
                        this.#dir = 'D';
                        break;
                    case 'left':
                        this.#body.unshift({ x: x, y: y - pixel});
                        this.#dir = 'U';
                        break;
                }
                break;

            case 'D':
                switch(dir){
                    case 'ahead':
                        this.#body.unshift({ x: x, y: y + pixel });
                        break;
                    case 'right':
                        this.#body.unshift({ x: x - pixel, y: y });
                        this.#dir = 'L';
                        break;
                    case 'left':
                        this.#body.unshift({ x: x + pixel, y: y });
                        this.#dir = 'R';
                        break;
                }
                break;

            case 'L':
                switch(dir){
                    case 'ahead':
                        this.#body.unshift({ x: x - pixel, y: y });
                        break;
                    case 'right':
                        this.#body.unshift({ x: x, y: y - pixel });
                        this.#dir = 'U';
                        break;
                    case 'left':
                        this.#body.unshift({ x: x, y: y + pixel});
                        this.#dir = 'D';
                        break;
                }
                break;
        }

        this.#lastMoves.unshift(dir);
        if (this.#lastMoves[0] != 'ahead' && this.#lastMoves.length >= 30) {
            this.#lastMoves.pop();
            if (this.#lastMoves.every((val, i, arr) => val === arr[0])) {
                this.#dead = true;
            }
        }

        this.#lastScores.unshift(this.#score);
        if (this.#score > this.#lastScores[1])
            this.#lastScores = [];
        else if (this.#lastScores.length >= 350) {
            if (this.#lastScores.every((val, i, arr) => val === arr[0])) {
                this.#dead = true;
            }
        }
    }

    grow() {
        this.#body.push(this.#body[this.#body.length - 1]);
        this.#score++;
    }

    checkCollision() {
        const pixel = this.population.game.getPixel();
        const width = this.population.game.getWidth();
        const height = this.population.game.getHeight();

        if (
            this.#body[0].y <= 0 ||
            this.#body[0].x <= 0 ||
            this.#body[0].x >= width * pixel ||
            this.#body[0].y >= height * pixel
            ){
                this.#dead = true;
            }
            
        const _x = this.#body[0].x;
        const _y = this.#body[0].y;

        for (let i = 1; i < this.#body.length; i++) {
            let segm = this.#body[i];
            if (segm.x == _x && segm.y == _y){
                this.#dead = true;
            }
        }
    }

    think(){
        let inputs = [0, 1, 1, 0, 1, 0];
        let pixel = this.population.game.getPixel();

        //

        let output = this.#brain.predict(inputs);
        console.log(inputs, output);
        switch (output.indexOf(Math.max(...output))){
            case 0:
                this.walk('left');
                break;
            case 1:
                this.walk('ahead');
                break;
            case 2:
                this.walk('right');
                break;
        }
    }

    calculateDistScore() {
        const c1 = this.#body[0].x - this.#fruit.getPos().x;
        const c2 = this.#body[0].y - this.#fruit.getPos().y;
        const diag = Math.sqrt(this.population.game.getHeight() * this.population.game.getHeight() + this.population.game.getWidth() * this.population.game.getWidth());
        
        const distToFood = Math.sqrt(c1 * c1 + c2 * c2) / this.population.game.getPixel();

        return (diag - distToFood);
    }

    mutate() {
        this.#brain.mutate(mutateFunc);
    }
}