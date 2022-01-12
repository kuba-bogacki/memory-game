let time = 0;
let timeCounter;
let lose;
let moves = 0;
let pairs = 0;
let is_time;


initGame();

function initGame() {
    const queryString = window.location.search; // zwraca cały url
    const urlParams = new URLSearchParams(queryString); // odcina to co jest po ? wyciąga klucze i wartości
    is_time = urlParams.get('is_time'); // wyciągam konkretną wartość
    const level = urlParams.get('level_of_difficulty'); // wyciągam konkretną wartość
    if (is_time === "yes"){
        create_time(level);
        timeCounter = setInterval(decrease_time, 1000);
        lose = setInterval(lose_with_timeout, 1000);
    }
    create_pairs(level);
}

function create_pairs(level){
    if (level === "easy"){
        pairs = 4;
    }
    else if (level === "normal"){
        pairs = 15;
    }
    else if (level === "hard"){
        pairs = 35;
    }
}

function create_time(level){
    if (level === "easy"){
        time = 61;
    }
    else if (level === "normal"){
        time = 301;
    }
    else if (level === "hard"){
        time = 601;
    }
}

function decrease_time(){
    time -= 1;
    document.getElementsByClassName('time_box')[0].innerHTML = "<h3>Time left: " + time + "</h3>";
}

function decrease_pairs(){
    pairs -= 1;
    if (pairs === 0 && is_time === 'yes'){
        win_with_timeout();
    }
    if (pairs === 0 && is_time === 'no'){
        win_without_timeout();
    }

}

function increase_moves(){
    moves += 1;
    document.getElementsByClassName('move_box')[0].innerHTML = "<h3>Total moves: " + moves + "</h3>";
}

function win_with_timeout(){
    clearInterval(timeCounter);
    clearInterval(lose);
    alert('YOU WIN');
    // zapis wyniku
    saveItemToSessionStorageWithTime()
    //
    location.href = 'index.html';

}

function win_without_timeout(){
    alert('YOU WIN');
    // zapis wyniku
    saveItemToSessionStorageWithoutTime()
    //
    location.href = 'index.html';
}

//
function saveItemToSessionStorageWithTime() {
    if (0) {
        sessionStorage.setItem('userName', "(nazwa użytkownika)")
        sessionStorage.setItem('moves', moves)
        sessionStorage.setItem('time', time)
    }
}

function saveItemToSessionStorageWithoutTime() {
    if (0) {
        sessionStorage.setItem('userName', "(nazwa użytkownika)")
        sessionStorage.setItem('moves', moves)
    }
}
//

function lose_with_timeout(){
    if (time === 0){
        clearInterval(timeCounter);
        clearInterval(lose);
        alert('TIME IS OVER');
        location.href = 'index.html';
    }
}