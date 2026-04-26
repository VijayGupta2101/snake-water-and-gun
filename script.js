// Game State
let scores = { p1: 0, p2: 0 };
let currentRoundChoices = { p1: null, p2: null };
const WINNING_SCORE = 5;

let playerName = "Player";
let computerName = "Computer";

const computerNamesList = [
    "Bot Alpha", "Robo-Snake", "Terminator", "HAL 9000", 
    "GLaDOS", "C-3PO", "Ultron", "Wall-E", "Byte Master", "Cypher"
];

// Elements
const screens = {
    menu: document.getElementById('main-menu'),
    game: document.getElementById('game-screen'),
    win: document.getElementById('win-screen'),
    exit: document.getElementById('exit-screen')
};

const playerInputEl = document.getElementById('player-input');

const p1NameEl = document.getElementById('p1-name');
const p2NameEl = document.getElementById('p2-name');
const p1ScoreEl = document.getElementById('p1-score');
const p2ScoreEl = document.getElementById('p2-score');

const turnBanner = document.getElementById('turn-banner');
const choicesContainer = document.getElementById('choices-container');

const revealArea = document.getElementById('reveal-area');
const revealP1Name = document.getElementById('reveal-p1-name');
const revealP2Name = document.getElementById('reveal-p2-name');
const revealP1Choice = document.getElementById('reveal-p1-choice');
const revealP2Choice = document.getElementById('reveal-p2-choice');

const roundResultText = document.getElementById('round-result-text');
const btnNextRound = document.getElementById('btn-next-round');

const winnerAnnouncement = document.getElementById('winner-announcement');
const winnerSubAnnouncement = document.getElementById('winner-sub-announcement');
const winIcon = document.getElementById('win-icon');

// Icons Mapping
const icons = {
    snake: '🐍',
    water: '💧',
    gun: '🔫'
};

function switchScreen(screenKey) {
    Object.values(screens).forEach(screen => {
        screen.classList.remove('active');
    });
    screens[screenKey].classList.add('active');
}

function initGame() {
    // Read player name
    let enteredName = playerInputEl.value.trim();
    if (enteredName) {
        playerName = enteredName;
    } else {
        playerName = "Player";
    }

    // Pick random computer name
    computerName = computerNamesList[Math.floor(Math.random() * computerNamesList.length)];

    // Reset scores
    scores = { p1: 0, p2: 0 };
    updateScoreBoard();
    
    // Set Names on UI
    p1NameEl.innerText = playerName;
    p1NameEl.title = playerName; // For hover overflowing text
    
    p2NameEl.innerText = computerName;
    p2NameEl.title = computerName;
    
    revealP1Name.innerText = playerName;
    revealP2Name.innerText = computerName;

    resetRound();
    switchScreen('game');
}

function goToMenu() {
    switchScreen('menu');
}

function exitGame() {
    // Attempt window close, otherwise fallback to exit screen
    switchScreen('exit');
    setTimeout(() => {
        window.close();
    }, 500);
}

function makeChoice(choice) {
    if(revealArea.classList.contains('hidden') === false) {
        return; // Prevents clicking during reveal
    }
    
    currentRoundChoices.p1 = choice;
    currentRoundChoices.p2 = getComputerChoice();
    resolveRound();
}

function getComputerChoice() {
    const choices = ['snake', 'water', 'gun'];
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
}

function resolveRound() {
    // Hide choices layout smoothly (using generic hidden class which acts fast here now via display:none)
    turnBanner.classList.add('hidden');
    choicesContainer.classList.add('hidden');
    
    // Set icons
    revealP1Choice.innerText = icons[currentRoundChoices.p1];
    revealP2Choice.innerText = icons[currentRoundChoices.p2];
    
    // Show Reveal Area (contains the next round button explicitly now)
    revealArea.classList.remove('hidden');

    // Determine winner
    const result = determineWinner(currentRoundChoices.p1, currentRoundChoices.p2);
    
    // Reset styling
    roundResultText.className = '';
    
    let winnerText = "";
    if (result === 0) {
        winnerText = "It's a Draw!";
        roundResultText.classList.add('round-draw');
    } else if (result === 1) {
        winnerText = `${playerName} Wins Round!`;
        roundResultText.classList.add('round-win-p1');
        scores.p1++;
    } else {
        winnerText = `${computerName} Wins Round!`;
        roundResultText.classList.add('round-win-p2');
        scores.p2++;
    }

    roundResultText.innerText = winnerText;
    updateScoreBoard();

    // Change button text dynamically if it's match point
    if (scores.p1 >= WINNING_SCORE || scores.p2 >= WINNING_SCORE) {
        btnNextRound.innerText = "⭐ See Result ⭐";
    } else {
        btnNextRound.innerText = "Next Round";
    }
}

function determineWinner(c1, c2) {
    // 0: Draw, 1: Player 1, 2: Player 2
    if (c1 === c2) return 0;
    
    if (c1 === 'snake') {
        return c2 === 'water' ? 1 : 2; // snake beats water, gun beats snake
    } else if (c1 === 'water') {
        return c2 === 'gun' ? 1 : 2; // water beats gun, snake beats water
    } else if (c1 === 'gun') {
        return c2 === 'snake' ? 1 : 2; // gun beats snake, water beats gun
    }
}

function updateScoreBoard() {
    p1ScoreEl.innerText = scores.p1;
    p2ScoreEl.innerText = scores.p2;
}

function nextRound() {
    if (scores.p1 >= WINNING_SCORE || scores.p2 >= WINNING_SCORE) {
        endMatch();
    } else {
        resetRound();
    }
}

function resetRound() {
    currentRoundChoices = { p1: null, p2: null };
    
    revealArea.classList.add('hidden');
    
    turnBanner.classList.remove('hidden');
    choicesContainer.classList.remove('hidden');
}

function endMatch() {
    let matchWinner = "";
    if (scores.p1 > scores.p2) {
        matchWinner = `${playerName} Wins the Match!`;
        winnerAnnouncement.style.color = "var(--color-snake)";
        winIcon.innerText = "🏆";
    } else {
        matchWinner = `${computerName} Wins the Match.`;
        winnerAnnouncement.style.color = "var(--color-gun)";
        winIcon.innerText = "💀";
    }
    
    winnerAnnouncement.innerText = matchWinner;
    winnerSubAnnouncement.innerText = `Final Score: ${scores.p1} - ${scores.p2}`;
    
    switchScreen('win');
}

function rematch() {
    initGame();
}
