
function setup(){
    game = new Game(65, 65, 15, 1);
}

function draw(){
    game.display();
}

function keyPressed() {
    game.humanControlSnake(keyCode);
}