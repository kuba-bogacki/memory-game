let time = 0;
let timeCounter;
let lose;
let level;
let moves = 0;
let pairs = 0;
let is_time;
let difficulty = 0;
let gameArray = [];
let allCards = [];
let actualPairs = [];
let user_name = '';
let stop_time = false;
let backCard = "../static/cards/back.png"
let flipCard = new Audio('../static/sounds/flip.wav');
let flipCards = new Audio('../static/sounds/flipcard.wav');
let matchPair = new Audio('../static/sounds/match_pair.wav');
let winGame = new Audio('../static/sounds/win.wav');
let loseGame = new Audio('../static/sounds/lose.wav');
let pauseGame = new Audio('../static/sounds/pause.wav');
let backgroundMusic = new Audio('../static/sounds/background.wav');


for (let x = 1; x <= 35; x++) {
    if (x < 10) {
        x = "0" + x.toString();
    }
    allCards.push('../static/cards/card_' + x + '.png');
}

async function initGame() {
    const queryString = window.location.search; // zwraca cały url
    const urlParams = new URLSearchParams(queryString); // odcina to co jest po ? wyciąga klucze i wartości
    is_time = urlParams.get('is_time'); // wyciągam konkretną wartość
    user_name = urlParams.get('user-name');
    create_user_name();
    level = urlParams.get('level_of_difficulty'); // wyciągam konkretną wartość
    let gameField = document.getElementById("board");
    if (is_time === "yes") {
        await displayHighestScoreWithTime();
    } else {
        await displayHighestScoreWithoutTime();
    }

    pairs = create_pairs(level);
    difficulty = create_pairs(level);
    playMusic()
    pairCardsToLevel(difficulty);
    shuffleCards();
    createArr(difficulty, gameField);
    setTimeout(rotateCards, 3000);
    await leftClick();
    rightClick();
    document.getElementById('time_button').addEventListener('click', stop_the_time);
}

function create_pairs(level) {
    if (level === "easy") {
        return 8;
    } else if (level === "normal") {
        return 16;
    } else if (level === "hard") {
        return 30;
    }
}

function create_user_name() {
    document.getElementsByClassName('username')[0].innerHTML = "<h3>Your name: " + user_name + "</h3>";
}

function create_time(level) {
    if (level === "easy") {
        time = 61;
    } else if (level === "normal") {
        time = 301;
    } else if (level === "hard") {
        time = 601;
    }
}

async function displayHighestScoreWithTime() {
    if (level === 'easy' && await theBestScore('time_easy') !== 0) {
        document.getElementById('highest_score').innerHTML = "<h4>Best time: " + await theBestScore('time_easy') + "</h4>";
    } else if (level === 'normal' && await theBestScore('time_medium') !== 0) {
        document.getElementById('highest_score').innerHTML = "<h4>Best time: " + await theBestScore('time_medium') + "</h4>";
    } else if (level === 'hard' && await theBestScore('time_hard') !== 0) {
        document.getElementById('highest_score').innerHTML = "<h4>Best time: " + await theBestScore('time_hard') + "</h4>";
    } else {
        document.getElementById('highest_score').innerHTML = "";
    }
}

async function displayHighestScoreWithoutTime() {
    if (level === 'easy' && await theBestScore('no_time_easy') !== null) {
        document.getElementById('highest_score').innerHTML = "<h4>Fewest movements: " + await theBestScore('no_time_easy') + "</h4>";
    } else if (level === 'normal' && await theBestScore('no_time_medium') !== null) {
        document.getElementById('highest_score').innerHTML = "<h4>Fewest movements: " + await theBestScore('no_time_medium') + "</h4>";
    } else if (level === 'hard' && await theBestScore('no_time_hard') !== null) {
        document.getElementById('highest_score').innerHTML = "<h4>Fewest movements: " + await theBestScore('no_time_hard') + "</h4>";
    } else {
        document.getElementById('highest_score').innerHTML = "";
    }
}

async function loadScores() {
    let response = await fetch("/api/all_scores");
    return await response.json();

}

async function displayAllHighestScores() {
    let scores = await loadScores();
    for (let score of scores) {
        if (score['game_type'] === 'time_easy') {
            document.getElementById('easy-with-time').innerHTML = "Easy with time: " + score['user_name'] + " " + score['score'] + "s";
        }
        if (score['game_type'] === 'time_medium') {
            document.getElementById('normal-with-time').innerHTML = "Normal with time: " + score['user_name'] + " " + score['score'] + "s";
        }
        if (score['game_type'] === 'time_hard') {
            document.getElementById('hard-with-time').innerHTML = "Hard with time: " + score['user_name'] + " " + score['score'] + "s";
        }
        if (score['game_type'] === 'no_time_easy') {
            document.getElementById('easy-without-time').innerHTML = "Easy: " + score['user_name'] + " " + score['score'] + " moves";
        }
        if (score['game_type'] === 'no_time_medium') {
            document.getElementById('normal-without-time').innerHTML = "Normal: " + score['user_name'] + " " + score['score'] + " moves";
        }
        if (score['game_type'] === 'no_time_hard') {
            document.getElementById('hard-without-time').innerHTML = "Hard: " + score['user_name'] + " " + score['score'] + " moves";
        }
    }
}


function decrease_time() {
    time -= 1;
    document.getElementsByClassName('time_box')[0].innerHTML = "<h3>Time left: " + time + "</h3>";
}

async function decrease_pairs() {
    pairs -= 1;
    if (pairs === 0 && is_time === 'yes') {
        await win_with_timeout();
    }
    if (pairs === 0 && is_time === 'no') {
        await win_without_timeout();
    }

}

function increase_moves() {
    moves += 1;
    document.getElementsByClassName('move_box')[0].innerHTML = "<h3>Total moves: " + moves + "</h3>";
}

async function win_with_timeout() {
    clearInterval(timeCounter);
    clearInterval(lose);
    winGame.play();
    alert('YOU WIN');
    await saveScoreWithTime();
    location.href = '/main';
}

async function win_without_timeout() {
    winGame.play();
    alert('YOU WIN');
    await saveScoreWithoutTime();
    location.href = '/main';
}

async function save(score, type) {
    return await fetch("/api/score_update", {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({user_name: user_name, score: score, game_type: type})
    })
        ;
}

async function theBestScore(game_type){
    let response = await fetch("/api/the_best_score/" + game_type);
    let json = await response.json();
    return json['score'];
}

async function saveScoreWithTime() {
    if (level === 'easy' && await theBestScore('time_easy') < time) {
        await save(time, 'time_easy');
    } else if (level === 'normal' && await theBestScore('time_medium') < time) {
        await save(time, 'time_medium');
    } else if (level === 'hard' && await theBestScore('time_hard') < time) {
        await save(time, 'time_hard');
    }
}

async function saveScoreWithoutTime() {
    if (level === 'easy' && (await theBestScore('no_time_easy') > moves || await theBestScore('no_time_easy') === null)) {
        await save(moves + 1, 'no_time_easy');
    }
    if (level === 'normal' && (await theBestScore('no_time_medium') > moves || await theBestScore('no_time_medium') === null)) {
        await save(moves + 1, 'no_time_medium');
    }
    if (level === 'hard' && (await theBestScore('no_time_hard') > moves || await theBestScore('no_time_hard') === null)) {
        await save(moves + 1, 'no_time_hard');
    }
}

function lose_with_timeout() {
    if (time === 0) {
        clearInterval(timeCounter);
        clearInterval(lose);
        loseGame.play();
        alert('TIME IS OVER');
        location.href = '/main';
    }
}

function pairCardsToLevel(difficulty) {
    while (gameArray.length < difficulty * 2) {
        let item = allCards[Math.floor(Math.random() * allCards.length)];
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
    let amount_rows = 8;
    if (difficulty === 30){
        amount_rows = 12;
    }
    let rows = (difficulty * 2) / amount_rows;
    let cols = (difficulty * 2) / rows;
    for (let row = 0; row < rows; row++) {
        let rowElement = addRow(gameField);
        for (let col = 0; col < cols; col++) {
            addCell(rowElement, row, col, gameArray);
            gameArray.shift();
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
        `<div class="card" data-row="${row}" data-col="${col}" reverse="false" image="${gameArray[0]}"><img src="${gameArray[0]}"></div>`);
}

function rotateCards() {
    let rotateElement = document.getElementsByClassName('card');
    for (let element of rotateElement) {
        element.innerHTML = `<img src=${backCard}>`
    }
    flipCards.play();
    let runBoard = document.getElementsByClassName('board');
    runBoard[0].style.pointerEvents = 'auto';
    if (is_time === "yes") {
        create_time(level);
        timeCounter = setInterval(decrease_time, 1000);
        lose = setInterval(lose_with_timeout, 1000);
    }
}


function leftClick() {
    const fields = document.querySelectorAll('.board .row .card');
    for (let field of fields) {
        // we add the same event listener for the left click (so called click) event
        field.addEventListener('click', async function (event) {
            // so if you left click on any field...
            if (actualPairs.length === 2) {
                return;
            }
            let card_image = field.getAttribute('image'); // pobiera atrybut obiektu na który klikamy
            //console.log(card_image)
            flipCard.play();
            field.innerHTML = '<img src=' + card_image + '>';
            actualPairs.push(field);
            field.style.pointerEvents = 'none';

            if (actualPairs.length === 2) {
                let board = document.getElementById('board');
                console.log(board);
                board.style.pointerEvents = 'none'; // zatrzymanie ruuchu na planszy
                if (actualPairs[0].getAttribute('image') === actualPairs[1].getAttribute('image')) {
                    await theSameCards();
                    matchPair.play();
                } else {
                    differentCards();
                    flipCards.play();
                }
                increase_moves();
                board.style.pointerEvents = 'auto'; // wznowienie ruuchu na planszy
            }
        });
    }
}

function rightClick() {
    const fields = document.querySelectorAll('.board .row .card');
    for (let field of fields) {
        // we add the same event listener for the right click (so called contextmenu) event
        field.addEventListener('contextmenu', function (event) {
            // so if you left click on any field...
            event.preventDefault();
        });
    }
}

async function theSameCards() {
    for (let card of actualPairs) {
        card.style.opacity = 0.3;
        card.setAttribute('reverse', 'true');  // ustawianie atrybutu obiektu
        card.style.pointerEvents = 'none'; // turn off clicking on the element
    }
    await decrease_pairs();
    actualPairs = []; // czyszczenie tablicy
}

function differentCards() {
    setTimeout(() => {
        for (let card of actualPairs) {
            card.innerHTML = '<img src="../static/cards/back.png">';
            card.style.pointerEvents = 'auto';
        }
        flipCards.play();
        actualPairs = []; // czyszczenie tablicy
    }, 1000); // wstrzymanie czasu
}

function change_time_statistic(stop, button, event) {
    const fields = document.querySelectorAll('.board .row .card');
    for (let field of fields) {
        let reverse_image = field.getAttribute('reverse');
        if (reverse_image === 'false') {
            field.innerHTML = '<img src=' + backCard + '>';
            field.style.pointerEvents = event;
        }
    }
    document.getElementById('time_button').innerHTML = button;
    stop_time = stop;
    actualPairs = []; // czyszczenie tablicy
}

function stop_the_time() {
    if (stop_time) {
        pauseGame.play();
        change_time_statistic(false, 'PAUSE', 'auto');
        if (is_time === "yes") {
            timeCounter = setInterval(decrease_time, 1000);
            lose = setInterval(lose_with_timeout, 1000);
        }
    } else {
        pauseGame.play();
        change_time_statistic(true, 'RESUME', 'none');
        if (is_time === "yes") {
            clearInterval(timeCounter);
            clearInterval(lose);
        }
    }
}

function playMusic() {
    if (typeof backgroundMusic.loop == 'boolean') {
        backgroundMusic.loop = true;
    }
    backgroundMusic.play();
}
