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

    #population = undefined;

    #body = undefined;
    #points = undefined;
    #targets = undefined;

    #color = undefined;

    fruit = undefined;

    constructor(c, p){
        this.#dir = 'U';
        this.#lastScores = [0,];
        this.#lastMoves = ['ahead'];
        this.#brain = new NeuralNetwork(9, 6, 3);

        this.#score = 0;
        this.#dead = false;

        this.#population = p;

        const x = Math.floor(this.#population.game.getWidth() / 2);
        const y =Math.floor(this.#population.game.getHeight() * (7 / 8));
        this.#body = [
                        { x: x*p.game.getPixel(), y: y*p.game.getPixel() }, 
                        { x: x*p.game.getPixel(), y: (y+1)*p.game.getPixel() }, 
                        /*{ x: x*p.game.getPixel(), y: (y+2)*p.game.getPixel() },*/
                    ];

        const head = this.#body[0];
        const pixel = p.game.getPixel();
        const width = p.game.getWidth();
        const height = p.game.getHeight();

        this.#points = {
            'ahead': { x: head.x, y: head.y - pixel },
            'right': { x: head.x + pixel, y: head.y },
            'left': { x: head.x - pixel, y: head.y },
        }

        this.#color = c;
        this.fruit = new Fruit(c, this.#population.game);
    
        this.#targets = {
            'food': this.fruit.getPos(),
            'tail': this.#body[this.#body.length - 1],
            'aWall': { x: head.x, y: 0 },
            'rWall': { x: width * pixel, y: head.y },
            'lWall': { x: 0, y: head.y },
        }
    }

    isDead(){
        return (this.#dead ? true:false);
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

    setBrain(b){
        this.#brain = b;
    }

    drawDist(){
        strokeWeight(0.5);
        stroke(this.#color);
        Object.entries(this.#targets).map((t) =>{
            Object.entries(this.#points).map((d) => {
                if (
                    (t[0] == 'aWall' && (d[0] == 'right' || d[0] == 'left')) ||
                    (t[0] == 'rWall' && (d[0] == 'ahead' || d[0] == 'left')) ||
                    (t[0] == 'lWall' && (d[0] == 'ahead' || d[0] == 'right'))
                ){} else line(t[1].x, t[1].y, d[1].x, d[1].y);
            });
        })
    }

    display(){
        stroke(this.getColor());
        strokeWeight(this.#population.game.getPixel());
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

        this.fruit.display();
    }

    walk(dir) {
        this.#body.unshift(this.#points[dir]);
        this.#body.pop();

        const head = this.#body[0];
        const pixel = this.#population.game.getPixel();
        const width = this.#population.game.getWidth();
        const height = this.#population.game.getHeight();
        this.#targets['tail'] = this.#body[this.#body.length - 1];
        this.#targets['food'] = this.fruit.getPos();
        
        switch(this.#dir){
            case 'U':
                this.#dir = (dir == 'right') ? 'R' : ((dir == 'left') ? 'L' : 'U');
                break;
            case 'R':
                this.#dir = (dir == 'right') ? 'D' : ((dir == 'left') ? 'U' : 'R');
                break;
            case 'D':
                this.#dir = (dir == 'right') ? 'L' : ((dir == 'left') ? 'R' : 'D');
                break;
            case 'L':
                this.#dir = (dir == 'right') ? 'U' : ((dir == 'left') ? 'D' : 'L');
                break;
        }

        switch (this.#dir) {
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
        const pixel = this.#population.game.getPixel();
        const width = this.#population.game.getWidth();
        const height = this.#population.game.getHeight();

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
        let inputs = [];
        let pixel = this.#population.game.getPixel();

        Object.entries(this.#targets).map((t) => {
            Object.entries(this.#points).map((d) => {
                if (
                    (t[0] == 'aWall' && (d[0] == 'right' || d[0] == 'left')) ||
                    (t[0] == 'rWall' && (d[0] == 'ahead' || d[0] == 'left')) ||
                    (t[0] == 'lWall' && (d[0] == 'ahead' || d[0] == 'right'))
                ){} else {
                    const c1 = (t[1].x - d[1].x) / pixel;
                    const c2 = (t[1].y - d[1].y) / pixel;
                    inputs.push(Math.sqrt( c1*c1 + c2*c2 ));
                }
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

    calculateDistScore() {
        const c1 = this.#body[0].x - this.fruit.getPos().x;
        const c2 = this.#body[0].y - this.fruit.getPos().y;
        const diag = Math.sqrt(this.#population.game.getHeight() * this.#population.game.getHeight() + this.#population.game.getWidth() * this.#population.game.getWidth());
        
        const distToFood = Math.sqrt(c1 * c1 + c2 * c2) / this.#population.game.getPixel();

        return (diag - distToFood);
    }

    mutate() {
        this.#brain.mutate(mutateFunc);
    }
}