// Game state
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;

// Bot variables
let botPlayer = currentPlayer === 'X' ? 'O' : 'X';
let rank = ['', '', '', '', '', '', '', '', ''];

// Game History
let history = ['', '', '', '', '', '', '', '', ''];
let move = 0;
const forgetAfter = 6;

// Winning combinations
const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// DOM elements
const cells = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('status');
const resetBtn = document.getElementById('resetBtn');
const numPlayersRadios = document.querySelectorAll('input[name="numPlayers"]');
const gameModeRadios = document.querySelectorAll('input[name="gameMode"]');
const difficultyRadios = document.querySelectorAll('input[name="difficulty"]');

// Add click listeners to all cells
cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});


// Game mode change listener
numPlayersRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        resetGame();
    });
});
gameModeRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        resetGame();
    });
});
difficultyRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        resetGame();
    });
});

resetGame();

// Handle cell click
function handleCellClick(e) {
    const cell = e.target;
    const index = cell.getAttribute('data-index');

    // If cell is already filled or game is over, return
    if (board[index] !== '' || !gameActive) {
        return;
    }

    // Update board and cell display
    board[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());
    
    if (gameMode === 'memory-loss' && move >= forgetAfter) {
        idxToForget = history[move - forgetAfter]
        const cellToForget = document.querySelector(`[data-index="${idxToForget}"]`)
        board[idxToForget] = '';
        cellToForget.textContent = '';
        cellToForget.classList.remove('x', 'o');
    }

    // update history
    history[move] = index;
    move += 1;

    // Check status
    checkWinner();

    // Oponent player
    if (gameActive) {
        if (numPlayers == 2) {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            updateStatus();
        } else {
            botMove();
            checkWinner();
        }
    }
}

// Check for winner or tie
function checkWinner() {
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (board[a] === '' || board[b] === '' || board[c] === '') {
            continue;
        }
        if (board[a] === board[b] && board[b] === board[c]) {
            if (numPlayers === 1 && board[a] === botPlayer) {
                winner = "Computer"
            } else {
                winner = `Player ${board[a]}`;
            }
            statusDisplay.textContent = `${winner} Wins! 🎉 after ${Math.floor((move + 1) / 2)} turns`;
            gameActive = false;
            return;
        }
    }

// DOM elements
    // Check for tie
    if (!board.includes('')) {
        statusDisplay.textContent = "It's a Tie! 🤝";
        gameActive = false;
    }
}

// Evaluate status of a row
function evaluateRow(row, player) {
    // returns:
    // 5    - row with two signs of player
    // 3.5  - row with two signs of oponent
    // 3    - row with one sign of player
    // 1.5  - empty row
    // 1    - row with one sign of the opponent
    // 0.5  - row with one sign of each
    // 0    - full row (value = 2)
    let self = 0;
    let oponent = 0;
    let empty = 0;
    for (let idx of row) {
        if (board[idx] === player) {
            self += 1;
        } else if (board[idx] === '') {
            empty += 1;
        } else {
            oponent += 1;
        }
    }
    value = Math.abs(2 * self - 2 * oponent + 0.5 * empty);
    if (value === 2) {
        return 0;
    } else {
        return value;
    }
}

// Bot intelligence
function botMove() {
    
    function choose(index) {
        board[index] = botPlayer;
        const cell = cells.item(index);
        cell.textContent = botPlayer;
        cell.classList.add(botPlayer.toLowerCase());
        history[move] = index;
        move += 1;
    }

    function chooseEmptyCorner(row) {
        for (let corner of [0, 2, 6, 8]) {
            if (row.includes(corner) && board[corner] === '') {
                choose(corner);
                return true;
            }
        }
        return false;
    }
    
    let bestRank = 0;
    // Choose best winning condition to play for
    for (let i = 0; i < winningConditions.length; i++) {
        rank[i] = evaluateRow(winningConditions[i], botPlayer);
        bestRank = Math.max(bestRank, rank[i]);
        if (rank[i] >= bestRank) {
            best = winningConditions[i];
        }
    }
    // Choose position within the winning condition
    // Choose the center if free
    if (difficulty > 0 && best.includes(4) && board[4] === '') {
        choose(4);
        return;
    }
    if (difficulty == 2) {
        if (chooseEmptyCorner(best)) {
            return;
        }
    }
    if (difficulty == 3) {
        for (let i = 0; i < winningConditions.length; i++) {
            if (rank[i] == bestRank) {
                const [a, b, c] = winningConditions[i]
                if ((a === 1 && b === 4 && c === 7) || (a === 3 && b === 4 && c === 5)) {
                    best = winningConditions[i];
                    break;
                }
            }
        }
    }
    for (let index of best) {
        if (board[index] === '') {
            choose(index);
            return;
        } 
    }
}

// Update status display
function updateStatus(player) {
    statusDisplay.textContent = `Player ${player}'s`;
}

// Reset game
function resetGame() {
    numPlayers = document.querySelector('input[name="numPlayers"]:checked').value;
    gameMode = document.querySelector('input[name="gameMode"]:checked').value;
    difficulty = document.querySelector('input[name="difficulty"]:checked').value;
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    move = 0;
    statusDisplay.textContent = `Player X's Turn`;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
    });
}

// Add reset button listener
resetBtn.addEventListener('click', resetGame);
