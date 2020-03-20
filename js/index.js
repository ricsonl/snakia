
function setup(){
    game = new Game(65, 65, 15);
}

function draw(){
    game.display();
}

function keyPressed() {
    game.controlSnake(keyCode);
}