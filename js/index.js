
function setup(){
    game = new Game(65, 65, 15);
    createCanvas(game.getWidth(), game.getHeight());
    frameRate(5);
}

function draw(){
    noStroke();
    game.display();
}

function keyPressed() {
    switch (keyCode) {
        case 38:
            if (game.getSnake().getDir() != 'D') {
                game.getSnake().setDir('U');
            }
            break;
        case 39:
            if (game.getSnake().getDir() != 'L') {
                game.getSnake().setDir('R');
            }
            break;
        case 40:
            if (game.getSnake().getDir() != 'U') {
                game.getSnake().setDir('D');
            }
            break;
        case 37:
            if (game.getSnake().getDir() != 'R') {
                game.getSnake().setDir('L');
            }
            break;
    }
}