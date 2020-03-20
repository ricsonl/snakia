
function setup(){
    game = new Game(25, 25, 15);
    createCanvas(game.getHeight(), game.getWidth());
    frameRate(15);
}

function draw(){
    game.display();
}