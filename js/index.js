
function setup(){
    game = new Game(80, 80, 15);
    createCanvas(game.getWidth(), game.getHeight());
    frameRate(5);
}

function draw(){
    noStroke();
    game.display();
}

function keyPressed() {
    switch (keyCode) {
        case 74:
            if (game.getSnake().getDir() != 'R') {
                game.getSnake().setDir('L');
            }
            break;
        case 76:
            if (game.getSnake().getDir() != 'L') {
                game.getSnake().setDir('R');
            }
            break;
        case 73:
            if (game.getSnake().getDir() != 'D') {
                game.getSnake().setDir('U');
            }
            break;
        case 75:
            if (game.getSnake().getDir() != 'U') {
                game.getSnake().setDir('D');
            }
            break;
    }
}