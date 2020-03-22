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
    #dead = undefined;

    #game = undefined;
    #fruit = undefined;

    #body = undefined;
    #dir = undefined;
    #points = undefined;
    #targets = undefined;

    #color = undefined;
    
    #brain = undefined;
    #score = undefined;
    #fitness = undefined;

    #lastScores = undefined;

    constructor(x, y, c, g, f){
        this.#dead = false;
        this.#game = g;
        this.#fruit = f;
        this.#body = [
                        { x: x*g.getPixel(), y: y*g.getPixel() }, 
                        { x: x*g.getPixel(), y: (y+1)*g.getPixel() }, 
                        { x: x*g.getPixel(), y: (y+2)*g.getPixel() }
                    ];
        this.#points = {
            'ahead': undefined,
            'right': undefined,
            'left': undefined
        }
        this.#targets = {
            'food': undefined,
            'tail': undefined,
            'aWall': undefined,
            'rWall': undefined,
            'lWall': undefined,
        }
        this.#dir = 'U';
        this.setPT(this.#dir);

        this.#brain = new NeuralNetwork(15, 9, 3);

        this.#color = c;

        
        this.#score = 0;
        this.#fitness = 0;
        this.#lastScores = [0,];
    }

    isDead(){
        return (this.#dead ? true:false);
    }
    getGame(){
        return this.#game;
    }
    getFruit(){
        return this.#fruit;
    }
    getBody(){ 
        return this.#body.slice();
    }
    getDir(){
        return this.#dir.valueOf();
    }
    getColor(){
        return color(this.#color);
    }

    getBrain(){
        return new NeuralNetwork(this.#brain);
    }
    getScore(){
        return this.#score.valueOf();
    }
    getFitness(){
        return this.#fitness.valueOf();
    }

    setPT(dir){
        const head = this.#body[0];
        const pixel = this.#game.getPixel();
        const width = this.#game.getWidth();
        const height = this.#game.getHeight();

        this.#targets['tail'] = this.#body[this.#body.length - 1];
        this.#targets['food'] = this.#fruit.getPos();

        switch(dir){
            case 'U':
                this.#points['ahead'] = { x: head.x, y: head.y - pixel };
                this.#points['right'] = { x: head.x + pixel, y: head.y };
                this.#points['left'] = { x: head.x - pixel, y: head.y };

                this.#targets['aWall'] = { x: head.x, y: 0 };
                this.#targets['rWall'] = { x: width * pixel, y: head.y };
                this.#targets['lWall'] = { x: 0, y: head.y };
                
                break;

            case 'R':
                this.#points['ahead'] = { x: head.x + pixel, y: head.y };
                this.#points['right'] = { x: head.x, y: head.y + pixel };
                this.#points['left'] = { x: head.x, y: head.y - pixel };

                this.#targets['aWall'] = { x: width * pixel, y: head.y };
                this.#targets['rWall'] = { x: head.x, y: height * pixel };
                this.#targets['lWall'] = { x: head.x, y: 0 };
                
                break;

            case 'D':
                this.#points['ahead'] = { x: head.x, y: head.y + pixel };
                this.#points['right'] = { x: head.x - pixel, y: head.y };
                this.#points['left'] = { x: head.x + pixel, y: head.y };

                this.#targets['aWall'] = { x: head.x, y: height * pixel };
                this.#targets['rWall'] = { x: 0, y: head.y };
                this.#targets['lWall'] = { x: width * pixel, y: head.y };
                
                break;

            case 'L':
                this.#points['ahead'] = { x: head.x - pixel, y: head.y };
                this.#points['right'] = { x: head.x, y: head.y - pixel };
                this.#points['left'] = { x: head.x, y: head.y + pixel };

                this.#targets['aWall'] = { x: 0, y: head.y };
                this.#targets['rWall'] = { x: head.x, y: 0 };
                this.#targets['lWall'] = { x: head.x, y: height * pixel };
                
                break;

        }
    }

    setFruit(f){
        this.#fruit = f;
    }

    setColor(c){
        this.#color = c;
    }

    setFitness(f){
        this.#fitness = f;
    }
    setBrain(b){
        this.#brain = b;
    }

    drawDist(){
        strokeWeight(0.5);
        stroke(this.#color);
        Object.entries(this.#targets).map((t) =>{
            Object.values(this.#points).map((d) => {
                line(t[1].x, t[1].y, d.x, d.y);
            });
        })
    }

    display(){
        stroke(this.getColor());
        strokeWeight(this.#game.getPixel());
        const body = this.getBody();

        let prev = body[0];
        for(let i=1; i<body.length; i++){
            const curr = body[i];
            if ((curr.x != prev.x && curr.y != prev.y)){
                line(prev.x, prev.y, body[i-1].x, body[i-1].y);
                prev = body[i - 1];
            }
            if (i == body.length-1){
                line(prev.x, prev.y, curr.x, curr.y);
            }
        }
    }

    walk(dir) {
        switch(this.#dir){
            case 'U':
                this.#body.pop();
                this.#body.unshift(this.#points[dir]);
                this.#dir = (dir == 'right') ? 'R' : ((dir == 'left') ? 'L' : 'U');
                this.setPT(this.#dir);
                break;
            case 'R':
                this.#body.pop();
                this.#body.unshift(this.#points[dir]);
                this.#dir = (dir == 'right') ? 'D' : ((dir == 'left') ? 'U' : 'R');
                this.setPT(this.#dir);
                break;
            case 'D':
                this.#body.pop();
                this.#body.unshift(this.#points[dir]);
                this.#dir = (dir == 'right') ? 'L' : ((dir == 'left') ? 'R' : 'D');
                this.setPT(this.#dir);
                break;
            case 'L':
                this.#body.pop();
                this.#body.unshift(this.#points[dir]);
                this.#dir = (dir == 'right') ? 'U' : ((dir == 'left') ? 'D' : 'L');
                this.setPT(this.#dir);
                break;
        }

        this.#lastScores.unshift(this.#score);
        if(this.#score > this.#lastScores[1])
            this.#lastScores = [];
        else if(this.#lastScores.length >= 180){
            if(this.#lastScores.every((val, i, arr) => val === arr[0])){
                this.#dead = true;
            }
        }

    }

    grow() {
        this.#body.push(this.#body[this.#body.length - 1]);
        this.#score++;
    }

    checkCollision() {
        const pixel = this.#game.getPixel();
        const width = this.#game.getWidth();
        const height = this.#game.getHeight();

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

        for (let i = 1; i < this.#body.length - 1; i++) {
            let segm = this.#body[i];
            if (segm.x == _x && segm.y == _y){
                this.#dead = true;
            }
        }

        return this.#dead;
    }

    humanControl(key) {
        switch (key) {
            case 38:
                if (this.#dir != 'D')
                    this.#dir = 'U';
                break;
            case 39:
                if (this.#dir != 'L')
                    this.#dir = 'R';
                break;
            case 40:
                if (this.#dir != 'U')
                    this.#dir = 'D';
                break;
            case 37:
                if (this.#dir != 'R')
                    this.#dir = 'L';
                break;
        }
    }

    think(){
        let inputs = [];
        let pixel = this.#game.getPixel();

        Object.entries(this.#targets).map((t) => {
            Object.entries(this.#points).map((d) => {
                let c1 = (t[1].x - d[1].x) / pixel;
                let c2 = (t[1].y - d[1].y) / pixel;
                inputs.push(Math.sqrt( c1*c1 + c2*c2 ));
            });
        });

        let output = this.#brain.predict(inputs);
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

    mutate() {
        this.#brain.mutate(mutateFunc);
    }
}