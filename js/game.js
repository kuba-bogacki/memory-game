let time = 0;
let timeCounter;
let lose;
let moves = 0;
let pairs = 0;
let is_time;
let difficulty = 0;
let gameArray = [];
let allCards = [];
let actualPairs = [];
let backCard = "../cards/back.png"


for (let x = 1; x <= 35; x++){
    if (x < 10){
        x = "0" + x.toString();
    }
    allCards.push('../cards/card_' + x + '.png');
}

function initGame() {
    const queryString = window.location.search; // zwraca cały url
    const urlParams = new URLSearchParams(queryString); // odcina to co jest po ? wyciąga klucze i wartości
    is_time = urlParams.get('is_time'); // wyciągam konkretną wartość
    const level = urlParams.get('level_of_difficulty'); // wyciągam konkretną wartość
    let gameField = document.getElementById("board");
    if (is_time === "yes"){
        create_time(level);
        timeCounter = setInterval(decrease_time, 1000);
        lose = setInterval(lose_with_timeout, 1000);
    }
    pairs = create_pairs(level);
    difficulty = create_pairs(level);
    pairCardsToLevel(difficulty);
    shuffleCards();
    createArr(difficulty, gameField);
    setTimeout(rotateCards, 3000);
}


function create_pairs(level) {
    if (level === "easy") {
        return 8;
    } else if (level === "normal") {
        return 16;
    } else if (level === "hard") {
        return 32;
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
    location.href = 'index.html';

}

function win_without_timeout(){
    alert('YOU WIN');
    // zapis wyniku
    location.href = 'index.html';
}

function lose_with_timeout(){
    if (time === 0){
        clearInterval(timeCounter);
        clearInterval(lose);
        alert('TIME IS OVER');
        location.href = 'index.html';
    }
}

function pairCardsToLevel(difficulty) {
    while (gameArray.length <= difficulty * 2) {
        let item = allCards[Math.floor(Math.random()*allCards.length)];
        if (!gameArray.includes(item)) {
            gameArray.push(item);
            gameArray.push(item);
        }
    }
}

function shuffleCards() {
    let currentIndex = gameArray.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [gameArray[currentIndex], gameArray[randomIndex]] = [gameArray[randomIndex], gameArray[currentIndex]];
    }
}

function createArr(difficulty, gameField) {
    console.log(difficulty);
    let rows = (difficulty * 2) / 8;
    let cols = (difficulty * 2) / rows;
    for (let row = 0; row < rows; row++) {
        let rowElement = addRow(gameField);
        for (let col = 0; col < cols; col++) {
            addCell(rowElement, row, col, gameArray);
            gameArray.shift()
        }
    }
    let holdBoard = document.getElementsByClassName('board');
    holdBoard[0].style.pointerEvents = 'none';
}

function addRow(gameField) {
    gameField.insertAdjacentHTML('beforeend',
        `<div class="row"></div>`);
    return gameField.lastElementChild;
}

function addCell(rowElement, row, col, gameArray) {
    rowElement.insertAdjacentHTML('beforeend',
        `<div class="card" data-row="${row}" data-col="${col}" image="${gameArray[0]}"><img src="${gameArray[0]}"></div>`);
}

function rotateCards() {
    let rotateElement = document.getElementsByClassName('card');
    for (let element of rotateElement) {
        element.innerHTML = `<img src=${backCard}>`
    }
    let runBoard = document.getElementsByClassName('board');
    runBoard[0].style.pointerEvents = 'auto';
}