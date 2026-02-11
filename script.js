// Game state
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;

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

// Add click listeners to all cells
cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
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
            statusDisplay.textContent = `Player ${board[a]} Wins! 🎉`;
            gameActive = false;
            return;
        }
    }

    // Check for tie
    if (!board.includes('')) {
        statusDisplay.textContent = "It's a Tie! 🤝";
        gameActive = false;
    }
}

// Update status display
function updateStatus() {
    statusDisplay.textContent = `Player ${currentPlayer}'s Turn`;
}

// Reset game
function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    statusDisplay.textContent = `Player X's Turn`;
    
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
    });
}

// Add reset button listener
resetBtn.addEventListener('click', resetGame);
