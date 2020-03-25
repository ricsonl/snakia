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
                { x: x * p.game.getPixel(), y: (y + 1) * p.game.getPixel() },
                /*{ x: x*p.game.getPixel(), y: (y+2)*p.game.getPixel() },*/
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
    getObstacles() {
        return this.#obstacles.slice();
    }

    setBrain(b){
        this.#brain = b;
    }

    setDir(d){
        this.#dir = d;
    }

    setFruitPos(x, y){
        this.#fruit.setPos(x, y);
    }

    drawLines(){
        const head = this.#body[0];

        const pointA = this.lookAhead()['point'];
        const pointR = this.lookRight()['point'];
        const pointL = this.lookLeft()['point'];
        
        strokeWeight(0.6);
        stroke(this.#color);
        line(head.x, head.y, pointA.x, pointA.y);
        line(head.x, head.y, pointR.x, pointR.y);
        line(head.x, head.y, pointL.x, pointL.y);

        strokeWeight(7);
        stroke(color(150, 150, 150));
        for (let i = 0; i < this.#obstacles.length; i++) {
            line(this.#obstacles[i].x, this.#obstacles[i].y, this.#obstacles[i].x, this.#obstacles[i].y);
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

    updateObstacles(){
        const head = this.#body[0];
        const pixel = this.population.game.getPixel();
        const width = this.population.game.getWidth();
        const height = this.population.game.getHeight();

        this.#obstacles = [];
        this.#obstacles.push(this.#fruit.getPos());

        for(let h = 1; h < height; h++){
            let c1 = head.x;
            let c2 = head.y - h*pixel;
            this.#obstacles.push([{ x: 0, y: h*pixel}, ]);
            this.#obstacles.push({ x: width*pixel, y: h*pixel});
        }
        for(let w = 1; w < width; w++){
            this.#obstacles.push({ x: w*pixel, y: 0});
            this.#obstacles.push({ x: w*pixel, y: height*pixel});
        }
        for(let b = 1; b < this.#body.length; b++){
            this.#obstacles.push(this.#body[b]);
        }
    }

    lookAhead(){
        const head = this.#body[0];
        const pixel = this.population.game.getPixel();
        const width = this.population.game.getWidth();
        const height = this.population.game.getHeight();
        let res = {
            'point': undefined,
            'dist': undefined,
            'isFood': 0,
        }
        switch(this.#dir){
            case 'U':
                for(let o = 0; o < this.#obstacles.length; o++){
                    if (head.x == this.#obstacles[o].x && head.y > this.#obstacles[o].y){
                        res['point'] = this.#obstacles[o];
                        if(o == 0) res['isFood'] = 1;
                    } 
                }
                res['dist'] = Math.abs(res['point'].y - head.y) / (height*pixel);
                break;

            case 'R':
                for(let o = 0; o < this.#obstacles.length; o++){
                    if (head.y == this.#obstacles[o].y && head.x < this.#obstacles[o].x){
                        res['point'] = this.#obstacles[o];
                        if(o == 0) res['isFood'] = 1;
                    } 
                }
                res['dist'] = Math.abs(res['point'].x - head.x) /(width*pixel);
                break;

            case 'D':
                for(let o = 0; o < this.#obstacles.length; o++){
                    if (head.x == this.#obstacles[o].x && head.y < this.#obstacles[o].y){
                        res['point'] = this.#obstacles[o];
                        if(o == 0) res['isFood'] = 1;
                    } 
                }
                res['dist'] = Math.abs(res['point'].y - head.y) / (height*pixel);
                break;

            case 'L':
                for(let o = 0; o < this.#obstacles.length; o++){
                    if (head.y == this.#obstacles[o].y && head.x > this.#obstacles[o].x){
                        res['point'] = this.#obstacles[o];
                        if(o == 0) res['isFood'] = 1;
                    } 
                }
                res['dist'] = Math.abs(res['point'].x - head.x) /(width*pixel);
                break;

        }
        
        return res;
    }
    lookRight(){
        const head = this.#body[0];
        const pixel = this.population.game.getPixel();
        const width = this.population.game.getWidth();
        const height = this.population.game.getHeight();
        let res = {
            'point': undefined,
            'dist': undefined,
            'isFood': 0,
        }
        switch(this.#dir){
            case 'U':
                for(let o = 0; o < this.#obstacles.length; o++){
                    if (head.y == this.#obstacles[o].y && head.x < this.#obstacles[o].x){
                        res['point'] = this.#obstacles[o];
                        if(o == 0) res['isFood'] = 1;
                    } 
                }
                res['dist'] = Math.abs(res['point'].x - head.x) / (width*pixel);
                break;

            case 'R':
                for(let o = 0; o < this.#obstacles.length; o++){
                    if (head.x == this.#obstacles[o].x && head.y < this.#obstacles[o].y){
                        res['point'] = this.#obstacles[o];
                        if(o == 0) res['isFood'] = 1;
                    } 
                }
                res['dist'] = Math.abs(res['point'].y - head.y) /(height*pixel);
                break;

            case 'D':
                for(let o = 0; o < this.#obstacles.length; o++){
                    if (head.y == this.#obstacles[o].y && head.x > this.#obstacles[o].x){
                        res['point'] = this.#obstacles[o];
                        if(o == 0) res['isFood'] = 1;
                    } 
                }
                res['dist'] = Math.abs(res['point'].x - head.x) / (width*pixel);
                break;

            case 'L':
                for(let o = 0; o < this.#obstacles.length; o++){
                    if (head.x == this.#obstacles[o].x && head.y > this.#obstacles[o].y){
                        res['point'] = this.#obstacles[o];
                        if(o == 0) res['isFood'] = 1;
                    } 
                }
                res['dist'] = Math.abs(res['point'].y - head.y) /(height*pixel);
                break;

        }
        
        return res;
    }
    lookLeft(){
        const head = this.#body[0];
        const pixel = this.population.game.getPixel();
        const width = this.population.game.getWidth();
        const height = this.population.game.getHeight();
        let res = {
            'point': undefined,
            'dist': undefined,
            'isFood': 0,
        }
        switch(this.#dir){
            case 'U':
                for(let o = 0; o < this.#obstacles.length; o++){
                    if (head.y == this.#obstacles[o].y && head.x > this.#obstacles[o].x){
                        res['point'] = this.#obstacles[o];
                        if(o == 0) res['isFood'] = 1;
                    } 
                }
                res['dist'] = Math.abs(res['point'].x - head.x) / (width*pixel);
                break;

            case 'R':
                for(let o = 0; o < this.#obstacles.length; o++){
                    if (head.x == this.#obstacles[o].x && head.y > this.#obstacles[o].y){
                        res['point'] = this.#obstacles[o];
                        if(o == 0) res['isFood'] = 1;
                    } 
                }
                res['dist'] = Math.abs(res['point'].y - head.y) /(height*pixel);
                break;

            case 'D':
                for(let o = 0; o < this.#obstacles.length; o++){
                    if (head.y == this.#obstacles[o].y && head.x < this.#obstacles[o].x){
                        res['point'] = this.#obstacles[o];
                        if(o == 0) res['isFood'] = 1;
                    } 
                }
                res['dist'] = Math.abs(res['point'].x - head.x) / (width*pixel);
                break;

            case 'L':
                for(let o = 0; o < this.#obstacles.length; o++){
                    if (head.x == this.#obstacles[o].x && head.y < this.#obstacles[o].y){
                        res['point'] = this.#obstacles[o];
                        if(o == 0) res['isFood'] = 1;
                    } 
                }
                res['dist'] = Math.abs(res['point'].y - head.y) /(height*pixel);
                break;

        }
        return res;
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

    ate(){
        return JSON.stringify(this.#body[0]) == JSON.stringify(this.#fruit.getPos());
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

    follow(){
        const le = this.lookLeft();
        const ah = this.lookAhead();
        const ri = this.lookRight();
        console.log(le, ah, ri);
        this.walkAhead();
        this.updateObstacles();
    }

    think(){   
        let inputs = [0, 1, 1, 0, 1, 0];

        let ah = this.lookAhead();
        let ri = this.lookRight();
        let le = this.lookLeft();

        console.log(le, ah, ri);
        //

        const output = this.#brain.predict(inputs);
        //console.log(inputs, output);
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

    mutate() {
        this.#brain.mutate(mutateFunc);
    }
}