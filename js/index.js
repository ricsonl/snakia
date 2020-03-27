
function setup(){
    game = new Game(350);
    frameRate(8);
}

function draw(){
    game.evolve(document.getElementById("lines").checked);
}

/*function keyPressed() {
    game.humanControl(keyCode);
}*/