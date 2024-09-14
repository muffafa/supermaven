// Game variables
const gridSize = 9; // Adjust for desired board size
const numMines = 10; // Adjust for desired number of mines
let board = [];
let gameStarted = false;
let gameEnded = false; // Add a variable to track if the game has ended

// Function to generate the game board
function generateBoard() {
    const gameBoard = document.getElementById('game');
    gameBoard.innerHTML = ''; // Clear existing board

    board = [];
    for (let i = 0; i < gridSize; i++) {
        let row = [];
        for (let j = 0; j < gridSize; j++) {
            row.push({
                x: i,
                y: j,
                isMine: false,
                isRevealed: false,
                isFlagged: false,
                adjacentMines: 0
            });

            let cell = document.createElement('div');
            cell.classList.add('cell', 'hidden');
            cell.id = `${i}-${j}`;
            cell.addEventListener('click', () => handleClick(cell));
            cell.addEventListener('contextmenu', (e) => handleRightClick(e, cell));
            gameBoard.appendChild(cell);
        }
        board.push(row);
    }

    // Place mines randomly
    let minesPlaced = 0;
    while (minesPlaced < numMines) {
        let x = Math.floor(Math.random() * gridSize);
        let y = Math.floor(Math.random() * gridSize);
        if (!board[x][y].isMine) {
            board[x][y].isMine = true;
            minesPlaced++;
        }
    }

    // Calculate adjacent mines for each cell
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (!board[i][j].isMine) {
                board[i][j].adjacentMines = countAdjacentMines(i, j);
            }
        }
    }
}

// Function to handle cell clicks
function handleClick(cell) {
    if (gameEnded) { // Check if the game has ended
        showModal('The game has ended. Please restart to play again.'); // Show modal again
        return; // Prevent further interaction
    }

    if (!gameStarted) {
        gameStarted = true;
    }

    let [x, y] = cell.id.split('-').map(Number);

    if (board[x][y].isRevealed || board[x][y].isFlagged) {
        return;
    }

    if (board[x][y].isMine) {
        gameOver();
        return;
    }

    revealCell(x, y);
    checkWinCondition();
}

function handleRightClick(e, cell) {
    e.preventDefault(); // Prevent default context menu

    if (!gameStarted) {
        gameStarted = true;
    }

    let [x, y] = cell.id.split('-').map(Number);

    if (board[x][y].isRevealed) {
        return;
    }

    if (board[x][y].isFlagged) {
        board[x][y].isFlagged = false;
        cell.classList.remove('flag');
    } else {
        board[x][y].isFlagged = true;
        cell.classList.add('flag');
    }
}

function revealCell(x, y) {
    if (x < 0 || x >= gridSize || y < 0 || y >= gridSize || board[x][y].isRevealed) {
        return;
    }

    board[x][y].isRevealed = true;
    let cell = document.getElementById(`${x}-${y}`);
    cell.classList.remove('hidden');
    cell.classList.add('revealed');

    if (board[x][y].adjacentMines > 0) {
        cell.textContent = board[x][y].adjacentMines;
    } else {
        // Recursively reveal adjacent empty cells
        revealCell(x - 1, y - 1);
        revealCell(x - 1, y);
        revealCell(x - 1, y + 1);
        revealCell(x, y - 1);
        revealCell(x, y + 1);
        revealCell(x + 1, y - 1);
        revealCell(x + 1, y);
        revealCell(x + 1, y + 1);
    }
}

function countAdjacentMines(x, y) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            let newX = x + i;
            let newY = y + j;
            if (newX >= 0 && newX < gridSize && newY >= 0 && newY < gridSize && board[newX][newY].isMine) {
                count++;
            }
        }
    }
    return count;
}

function gameOver() {
    gameEnded = true; // Set gameEnded to true when the game is over

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (board[i][j].isMine) {
                let cell = document.getElementById(`${i}-${j}`);
                cell.classList.remove('hidden');
                cell.classList.add('mine');
            }
        }
    }

    showModal('Game Over!');
}

function checkWinCondition() {
    let revealedCount = 0;
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (board[i][j].isRevealed && !board[i][j].isMine) {
                revealedCount++;
            }
        }
    }

    if (revealedCount === gridSize * gridSize - numMines) {
        gameEnded = true; // Set gameEnded to true when the game is won
        showModal('You Win!');
    }
}

// Initialize the game
generateBoard();

// Modal functions
function showModal(message) {
    document.getElementById('modalMessage').textContent = message;
    document.getElementById('gameModal').style.display = 'block';
    gameStarted = false;
}

function closeModal() {
    document.getElementById('gameModal').style.display = 'none';
}

function restartGame() {
    closeModal();
    gameStarted = false; // Reset gameStarted
    gameEnded = false; // Reset gameEnded
    generateBoard();
}
