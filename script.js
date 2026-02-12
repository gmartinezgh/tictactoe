// Game state
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let gameMode = 'classic';

// Game History
let history = ['', '', '', '', '', '', '', '', ''];
let turn = 0;

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
const gameModeRadios = document.querySelectorAll('input[name="gameMode"]');

// Add click listeners to all cells
cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

// Add game mode change listener
gameModeRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        gameMode = e.target.value;
        resetGame();
    });
});

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
    
    // Apply memory-loss mechanic only in memory-loss mode
    if (gameMode === 'memory-loss' && turn > 6) {
        idxToForget = history[turn - 7]
        const cellToForget = document.querySelector(`[data-index="${idxToForget}"]`)
        board[idxToForget] = '';
        cellToForget.textContent = '';
        cellToForget.classList.remove('x', 'o');
    }

    // update history
    history[turn] = index;
    turn = turn + 1

    // Check for winner
    checkWinner();

    // Switch player
    if (gameActive) {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateStatus();
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
            statusDisplay.textContent = `Player ${board[a]} Wins! 🎉 after ${turn + 1} turns`;
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

// Update status display
function updateStatus() {
    statusDisplay.textContent = `Player ${currentPlayer}'s`;
}

// Reset game
function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    turn = 0;
    statusDisplay.textContent = `Player X's Turn`;

    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
    });
}

// Add reset button listener
resetBtn.addEventListener('click', resetGame);
