
function setup(){
    game = new Game(65, 65, 15);
    createCanvas(game.getWidth(), game.getHeight());
    frameRate(24);
}

function draw(){
    noStroke();
    game.display();
}

function keyPressed() {
    game.controlSnake(keyCode);
}