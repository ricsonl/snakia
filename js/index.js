
function setup(){
    game = new Game(350);
    slider = createSlider(1, 100, 1);
}

function draw(){
    game.evolve(slider.value(), true);
}

/*function keyPressed() {
    game.humanControl(keyCode);
}*/