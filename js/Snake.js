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
    fruit = undefined;
    
    #population = undefined;
    #dead = undefined;

    #body = undefined;
    #dir = undefined;
    #points = undefined;
    #targets = undefined;

    #color = undefined;
    
    #brain = undefined;
    #score = undefined;

    #lastMoves = undefined;
    #lastScores = undefined;

    constructor(x, y, c, p){
        this.#dead = false;
        this.#population = p;
        this.fruit = new Fruit(Math.floor(Math.random() * (this.#population.game.getWidth() - 2) + 2), Math.floor(Math.random() * (this.#population.game.getHeight() - 2) + 2), c, this.#population.game);
        this.#body = [
                        { x: x*p.game.getPixel(), y: y*p.game.getPixel() }, 
                        { x: x*p.game.getPixel(), y: (y+1)*p.game.getPixel() }, 
                        { x: x*p.game.getPixel(), y: (y+2)*p.game.getPixel() }
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

        this.#color = c;
        
        this.#brain = new NeuralNetwork(9, 6, 3);
        this.#score = 0;
        this.#lastMoves = [];
        this.#lastScores = [0,];
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

    setPT(dir){
        const head = this.#body[0];
        const pixel = this.#population.game.getPixel();
        const width = this.#population.game.getWidth();
        const height = this.#population.game.getHeight();

        this.#targets['tail'] = this.#body[this.#body.length - 1];
        this.#targets['food'] = this.fruit.getPos();

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

        this.fruit.display();
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

        this.#lastMoves.unshift(dir);
        if (this.#lastMoves[0] != 'ahead' && this.#lastMoves.length >= 25) {
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

        for (let i = 1; i < this.#body.length - 1; i++) {
            let segm = this.#body[i];
            if (segm.x == _x && segm.y == _y){
                this.#dead = true;
            }
        }

        return this.#dead;
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
                ){} else if(t[0] == 'tail'){
                    const c1 = (t[1].x - d[1].x) / pixel;
                    const c2 = (t[1].y - d[1].y) / pixel;
                    inputs.push(this.#score * Math.sqrt( c1*c1 + c2*c2 ));
                } else {
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