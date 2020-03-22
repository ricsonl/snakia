class Game {
    #pixel = undefined;
    #height = undefined;
    #width = undefined;

    #color = undefined;

    #num = undefined;
    #snakes = undefined;
    #backup = undefined;
    #fruits = undefined;

    constructor(h, w, p, s){
        this.#pixel = p;

        this.#height = h;
        this.#width = w;

        this.#color = color(0, 0, 0);

        this.#num = s;
        this.#snakes = [];
        this.#backup = [];
        this.#fruits = [];
        for (let i = 0; i < this.#num; i++) {
            const randColor = color("hsl(" + Math.round(360 * i / this.#num) + ",80%,50%)");
            this.#fruits[i] = new Fruit(Math.floor(Math.random() * (this.#width - 2) + 2), Math.floor(Math.random() * (this.#height - 2) + 2), randColor, this);
            this.#snakes[i] = new Snake(Math.floor(this.#width / 2), Math.floor(this.#height * (7 / 8)), randColor, this, this.#fruits[i]);
        }

        createCanvas(this.getWidth()*this.getPixel(), this.getHeight()*this.getPixel());
        frameRate(10);
    }
    
    getPixel(){
        return this.#pixel.valueOf();
    }
    getHeight(){
        return this.#height.valueOf();
    }
    getWidth(){
        return this.#width.valueOf();
    }
    getColor(){
        return color(this.#color);
    }

    setColor(c){
        this.#color = c;
    }

    display() {
        noStroke();

        fill(this.getColor());
        rect(0, 0, this.getWidth()*this.getPixel(), this.getHeight()*this.getPixel());
   
        for(let i=0; i<this.#snakes.length; i++){
            if(!this.#snakes[i].checkCollision()){
                if (JSON.stringify(this.#snakes[i].getBody()[0]) === JSON.stringify(this.#fruits[i].getPos())) {
                    this.#snakes[i].grow();
                    this.#fruits[i].setPos(Math.floor(Math.random() * (this.getWidth() - 2) + 2), Math.floor(Math.random() * (this.getHeight() - 2) + 2));
                }
                this.#snakes[i].think();
                this.#snakes[i].drawDist();
            }
            this.#snakes[i].display();
            this.#fruits[i].display();
            if(this.#snakes[i].isDead()) this.removeSnake(i);
        }

        if(this.#snakes.length == 0){
            this.nextGeneration();
        }
    }
    
    humanControlSnake(key){
        this.#snakes[0].humanControl(key);
    }

    removeSnake(i){
        const deadSnake = this.#snakes.splice(i, 1)[0];
        this.#backup.push({ 
                        'brain': deadSnake.getBrain(),
                        'color': deadSnake.getColor()
                        });
        this.#fruits.splice(i, 1);
    }

    calculateFitness(){
        let sum = 0;
        for(let i=0; i < this.#snakes.length; i++){
            sum += this.#snakes[i].getScore();
        }
        for(let i=0; i < this.#snakes.length; i++){
            this.#snakes[i].setFitness(this.#snakes[i].getScore() / sum);
        }
    }

    pickOne(){
        const childB = random(this.#backup);
        const fruit = new Fruit(Math.floor(Math.random() * (this.#width - 2) + 2), Math.floor(Math.random() * (this.#height - 2) + 2), childB['color'], this);
        
        let child = new Snake(Math.floor(this.#width / 2), Math.floor(this.#height * (7 / 8)), childB['color'], this, fruit);
        child.setBrain(childB['brain']);
        child.mutate();
        return child;
    }

    nextGeneration() {
        this.calculateFitness();
        for (let i = 0; i < this.#num; i++) {
            const randColor = color("hsl(" + Math.round(360 * i / this.#num) + ",80%,50%)");
            this.#snakes[i] = this.pickOne();
            this.#fruits[i] = this.#snakes[i].getFruit();
        }
        this.#backup = [];
    }
}