let time = 0;
let timeCounter;
let lose;


initGame();

function initGame() {
    const queryString = window.location.search; // zwraca cały url
    const urlParams = new URLSearchParams(queryString); // odcina to co jest po ? wyciąga klucze i wartości
    const is_time = urlParams.get('is_time'); // wyciągam konkretną wartość
    const level = urlParams.get('level_of_difficulty'); // wyciągam konkretną wartość
    if (is_time === "yes"){
        create_time(level);
    }
    timeCounter = setInterval(decrease_time, 1000);
    lose = setInterval(lose_with_timeout, 1000);


}

function create_time(level){
    if (level === "easy"){
        time = 3;
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
    document.getElementsByClassName('time_box')[0].innerHTML = "<h3>Time left: " + time + "</h3>";
}

function win_with_timeout(){

}

function win_without_timeout(){

}

function lose_with_timeout(){
    if (time === 0){
        clearInterval(timeCounter);
        clearInterval(lose);
        alert('TIME IS OVER');
        location.href = 'index.html';
    }
}