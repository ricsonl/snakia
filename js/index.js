
function setup(){
    game = new Game(65, 65, 15, 1);
    game.aiControlSnake();
}

function draw(){
    game.display();
}

function keyPressed() {
    game.humanControlSnake(keyCode);
}