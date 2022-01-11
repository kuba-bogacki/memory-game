initGame();

let time = 0

function initGame() {

    // Your game can start here, but define separate functions, don't write everything in here :)
    timeCounter = setInterval(decrease_time, 1000);

}

function create_time(level){
    if (level === "easy"){
        time = 60;
    }
    else if (level === "normal"){
        time = 300;
    }
    else if (level === "hard"){
        time = 600;
    }
}

function decrease_time(){
    time -= 1;
    document.getElementById('time_box').value = time;
}

function win_with_timeout(){

}

function win_without_timeout(){

}

function lose_with_timeout(){

}