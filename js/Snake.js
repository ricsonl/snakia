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

    #obstacles = undefined;

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

            c.updateObstacles();
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
                { x: x * p.game.getPixel(), y: (y + 1) * p.game.getPixel() }
            ];

            this.#color = c;
            this.#fruit = new Fruit(c, this.population.game);

            this.updateObstacles();
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
    getObstacles(){
        return this.#obstacles.slice();
    }

    setBrain(b){
        this.#brain = b;
    }
    setDir(d){
        this.#dir = d;
    }
    setScore(s){
        this.#score = s;
    }
    setFruitPos(x, y){
        this.#fruit.setPos(x, y);
    }

    drawLines(){
        const head = this.#body[0];

        const pointA = this.lookAhead()[2];
        const pointR = this.lookRight()[2];
        const pointL = this.lookLeft()[2];
        
        strokeWeight(0.6);
        stroke(this.#color);
        line(head.x, head.y, pointA.x, pointA.y);
        line(head.x, head.y, pointR.x, pointR.y);
        line(head.x, head.y, pointL.x, pointL.y);

        strokeWeight(7);
        stroke(color(190, 190, 190));
        line(pointA.x, pointA.y, pointA.x, pointA.y);
        line(pointR.x, pointR.y, pointR.x, pointR.y);
        line(pointL.x, pointL.y, pointL.x, pointL.y);
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

    updateObstacles(){
        const head = this.#body[0];
        const food = this.#fruit.getPos();
        const pixel = this.population.game.getPixel();
        const width = this.population.game.getWidth();
        const height = this.population.game.getHeight();

        this.#obstacles = [];
        
        var dist;
        var max = Math.max(height*pixel, width*pixel);

        if(head.x == food.x){
            dist = Math.abs(head.y - food.y) / max;
            this.#obstacles.push([1, dist, food]);
        } else if (head.y == food.y){
            dist = Math.abs(head.x - food.x) / max;
            this.#obstacles.push([1, dist, food]);
        }

        for(let h = 1; h < height; h++){
            if (head.y == h * pixel){
                dist = head.x / max;
                this.#obstacles.push([0, dist, { x: 0, y: h * pixel}]);
                dist = Math.abs(head.x - width * pixel) / max;
                this.#obstacles.push([0, dist, { x: width * pixel, y: h*pixel}]);
            }
        }
        for(let w = 1; w < width; w++){
            if (head.x == w * pixel) {
                dist = head.y / max;
                this.#obstacles.push([0, dist, { x: w * pixel, y: 0 }]);
                dist = Math.abs(head.y - height * pixel) / max;
                this.#obstacles.push([0, dist, { x: w * pixel, y: height * pixel }]);
            }
        }

        var segm;

        for(let s = 1; s < this.#body.length; s++){
            segm = this.#body[s];
            if (head.x == segm.x) {
                dist = Math.abs(head.y - segm.y) / max;
                this.#obstacles.push([0, dist, segm]);
            } else if (head.y == segm.y) {
                dist = Math.abs(head.x - segm.x) / max;
                this.#obstacles.push([0, dist, segm]);
            }
        }

        this.#obstacles.sort((a, b) => (a[1] > b[1]) ? 1 : -1);
    }

    lookAhead(){
        const head = this.#body[0];
        for(let o = 0; o < this.#obstacles.length; o++){
            if (
                this.#dir == 'U' && head.x == this.#obstacles[o][2].x && head.y > this.#obstacles[o][2].y ||
                this.#dir == 'R' && head.y == this.#obstacles[o][2].y && head.x < this.#obstacles[o][2].x ||
                this.#dir == 'D' && head.x == this.#obstacles[o][2].x && head.y < this.#obstacles[o][2].y ||
                this.#dir == 'L' && head.y == this.#obstacles[o][2].y && head.x > this.#obstacles[o][2].x
            ) { return this.#obstacles[o]; }   
        }
    }
    lookRight(){
        const head = this.#body[0];
        for(let o = 0; o < this.#obstacles.length; o++){
            if (
                this.#dir == 'U' && head.y == this.#obstacles[o][2].y && head.x < this.#obstacles[o][2].x ||
                this.#dir == 'R' && head.x == this.#obstacles[o][2].x && head.y < this.#obstacles[o][2].y ||
                this.#dir == 'D' && head.y == this.#obstacles[o][2].y && head.x > this.#obstacles[o][2].x ||
                this.#dir == 'L' && head.x == this.#obstacles[o][2].x && head.y > this.#obstacles[o][2].y
            ) { return this.#obstacles[o]; }     
        }
    }
    lookLeft(){
        const head = this.#body[0];
        for(let o = 0; o < this.#obstacles.length; o++){
            if (
                this.#dir == 'U' && head.y == this.#obstacles[o][2].y && head.x > this.#obstacles[o][2].x ||
                this.#dir == 'R' && head.x == this.#obstacles[o][2].x && head.y > this.#obstacles[o][2].y ||
                this.#dir == 'D' && head.y == this.#obstacles[o][2].y && head.x < this.#obstacles[o][2].x ||
                this.#dir == 'L' && head.x == this.#obstacles[o][2].x && head.y < this.#obstacles[o][2].y
            ) { return this.#obstacles[o]; }    
        }
    }

    walkAhead(){
        this.#body.pop();

        const x = this.#body[0].x;            
        const y = this.#body[0].y;            
        const pixel = this.population.game.getPixel();
        switch(this.#dir){
            case 'U':
                this.#body.unshift({ x: x, y: y - pixel });
                break;
            case 'R':
                this.#body.unshift({ x: x + pixel, y: y });
                break;
            case 'D':
                this.#body.unshift({ x: x, y: y + pixel });
                break;
            case 'L':
                this.#body.unshift({ x: x - pixel, y: y });
                break;
        }
    }
    walkRight(){
        this.#body.pop();

        const x = this.#body[0].x;        
        const y = this.#body[0].y;        
        const pixel = this.population.game.getPixel();
        switch(this.#dir){
            case 'U':
                this.#body.unshift({ x: x + pixel, y: y });
                this.#dir = 'R';
                break;
            case 'R':
                this.#body.unshift({ x: x, y: y + pixel });
                this.#dir = 'D';
                break;
            case 'D':
                this.#body.unshift({ x: x - pixel, y: y });
                this.#dir = 'L';
                break;
            case 'L':
                this.#body.unshift({ x: x, y: y - pixel });
                this.#dir = 'U';
                break;
        }
    }
    walkLeft(){
        this.#body.pop();

        const x = this.#body[0].x;    
        const y = this.#body[0].y;    
        const pixel = this.population.game.getPixel();
        switch(this.#dir){
            case 'U':
                this.#body.unshift({ x: x - pixel, y: y });
                this.#dir = 'L';
                break;
            case 'R':
                this.#body.unshift({ x: x, y: y - pixel});
                this.#dir = 'U';
                break;
            case 'D':
                this.#body.unshift({ x: x + pixel, y: y });
                this.#dir = 'R';
                break;
            case 'L':
                this.#body.unshift({ x: x, y: y + pixel });
                this.#dir = 'D';
                break;
        }
    }

    distToFruit(){
        const pixel = this.population.game.getPixel();
        const width = this.population.game.getWidth();
        const height = this.population.game.getHeight();
        const max = Math.max(height * pixel, width * pixel);
        const c1 = this.#body[0].x - this.#fruit.getPos().x;
        const c2 = this.#body[0].y - this.#fruit.getPos().y;
        return Math.sqrt(c1 * c1 + c2 * c2)/max;
    }

    ate(){
        return JSON.stringify(this.#body[0]) == JSON.stringify(this.#fruit.getPos());
    }

    grow(){
        this.#body.push(this.#body[this.#body.length - 1]);
    }

    checkCollision(){
        const head = this.#body[0];
        var obs;
        for(let i = 0; i < this.#obstacles.length; i++){
            obs = this.#obstacles[i];
            if (obs[0] != 1 && JSON.stringify(head) == JSON.stringify(obs[2]))
                this.#dead = true;
        }
    }

    follow(){
        const le = this.lookLeft();
        const ah = this.lookAhead();
        const ri = this.lookRight();
        /*console.log(le[0]);
        console.log(ah[0]);
        console.log(ri[0]);
        this.walkAhead();*/
        this.updateObstacles();
    }

    think(){   
        let ah = this.lookAhead();
        let ri = this.lookRight();
        let le = this.lookLeft();
        
        let inputs = [  
            ah[0], ri[0], le[0], 
            ah[1], ri[1], le[1]
        ];

        const output = this.#brain.predict(inputs);
        switch (output.indexOf(Math.max(...output))){
            case 0:
                this.walkLeft();
                break;
            case 1:
                this.walkAhead();
                break;
            case 2:
                this.walkRight();
                break;
        }
        this.updateObstacles();
    }
    mutate(){
        this.#brain.mutate(mutateFunc);
    }
}