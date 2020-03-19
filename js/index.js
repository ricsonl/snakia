
function setup(){
    game = new Game(550, 550, 127);
    createCanvas(game.getHeight(), game.getWidth());
    frameRate(15);
}

function draw(){
    game.display();
}