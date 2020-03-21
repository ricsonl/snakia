class Snake {
    #game = undefined;
    #fruit = undefined;
    #body = undefined;
    #dir = undefined;
    #points = undefined;
    #targets = undefined;

    #nn = undefined;

    #color = undefined;

    constructor(x, y, g, f){
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

        this.#nn = new NeuralNetwork(15, [9,9], 3);

        this.#color = color(255, 255, 255);
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

    setPT(dir){
        let head = this.#body[0];
        let pixel = this.#game.getPixel();
        let width = this.#game.getWidth();
        let height = this.#game.getHeight();

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

    drawDist(){
        strokeWeight(0.5);

        Object.entries(this.#targets).map((t) =>{
            if (t[0] == 'food') stroke(color(255, 190, 20));
            else if (t[0] == 'tail') stroke(color(0, 255, 0));
            else stroke(color(50, 120, 255));
            Object.values(this.#points).map((d) => {
                line(t[1].x, t[1].y, d.x, d.y);
            });
        })
    }

    display(){
        stroke(this.getColor());
        strokeWeight(this.#game.getPixel());
        let body = this.getBody();

        let prev = body[0];
        for(let i=1; i<body.length; i++){
            let curr = body[i];
            if ((curr.x != prev.x && curr.y != prev.y)){
                line(prev.x, prev.y, body[i-1].x, body[i-1].y);
                prev = body[i - 1];
            }
            if (i == body.length-1){
                line(prev.x, prev.y, curr.x, curr.y);
            }
        }
    }

    walk() {  
        this.#body.pop();
        this.#body.unshift(this.#points['ahead']);
        this.setPT(this.#dir);
    }
    turn(dir) {
        switch(this.#dir){
            case 'U':
                if(dir == 'right') this.#dir = 'L';
                else this.#dir = 'R';
                break;
            case 'R':
                if (dir == 'right') this.#dir = 'D';
                else this.#dir = 'U'; 
                break;
            case 'D':
                if(dir == 'right') this.#dir = 'R';
                else this.#dir = 'L';
                break;
            case 'L':
                if(dir == 'right') this.#dir = 'U';
                else this.#dir = 'D';
                break;
        }
        this.setPT(this.#dir);
    }

    grow() {
        this.#body.push(this.#body[this.#body.length - 1]);
    }

    checkCollision() {
        let body = this.getBody();

        let _x = body[0].x;
        let _y = body[0].y;

        for (let i = 1; i < body.length - 1; i++) {
            let segm = body[i];
            if (segm.x == _x && segm.y == _y ||
                this.getBody()[0].x >= (this.#game.getWidth() * this.#game.getPixel()) ||
                this.getBody()[0].x <= 0 ||
                this.getBody()[0].y >= (this.#game.getHeight() * this.#game.getPixel()) ||
                this.getBody()[0].y <= 0
                ) {
                this.setColor(color(255, 0, 0));
                return true;
            }
        }
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
        this.setPT(this.#dir);
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

        //console.log(inputs);
        
        let output = this.#nn.predict(inputs);
        console.log(output);
        switch (output.indexOf(Math.max(...output))){
            case 0:
                break;
            case 1:
                this.turn('right');
                break;
            case 2:
                this.turn('left');
                break;
        }
    }
}