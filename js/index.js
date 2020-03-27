
function setup(){
    game = new Game(350);
    frameRate(8);
}

function draw(){
    game.evolve(true);
}

/*function keyPressed() {
    game.humanControl(keyCode);
}*/