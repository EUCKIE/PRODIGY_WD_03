const board = document.getElementById("game-board");
const statusText = document.getElementById("status");
const gamesPlayedSpan = document.getElementById("games-played");
const xWinsSpan = document.getElementById("x-wins");
const oWinsSpan = document.getElementById("o-wins");
const drawsSpan = document.getElementById("draws");
const gameModeBtn = document.getElementById("game-mode-btn");

let currentPlayer = "X";
let cells = Array(9).fill(null);
let gameOver = false;
let gamesPlayed = 0;
let xWins = 0;
let oWins = 0;
let draws = 0;
let vsAI = false;

function renderBoard() {
  board.innerHTML = "";
  cells.forEach((cell, i) => {
    const cellDiv = document.createElement("div");
    cellDiv.classList.add("cell");
    cellDiv.textContent = cell;
    cellDiv.addEventListener("click", () => handleMove(i));
    board.appendChild(cellDiv);
  });
  statusText.textContent = `Player ${currentPlayer}'s turn`;
}

function checkWinner() {
  const winPatterns = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // cols
    [0,4,8], [2,4,6]           // diagonals
  ];
  return winPatterns.some(pattern => {
    const [a, b, c] = pattern;
    return cells[a] && cells[a] === cells[b] && cells[a] === cells[c];
  });
}

function isBoardFull() {
  return cells.every(cell => cell);
}

function handleMove(index) {
  if (cells[index] || gameOver) return;

  cells[index] = currentPlayer;
  
  if (checkWinner()) {
    endGame(`Player ${currentPlayer} wins!`);
    if (currentPlayer === "X") xWins++;
    else oWins++;
  } else if (isBoardFull()) {
    endGame("It's a draw!");
    draws++;
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    renderBoard();
    
    // If playing against AI and it's AI's turn
    if (vsAI && currentPlayer === "O" && !gameOver) {
      setTimeout(makeAIMove, 500); // Delay for better UX
    }
  }
}

function endGame(message) {
  statusText.textContent = message;
  gameOver = true;
  gamesPlayed++;
  updateStats();
  setTimeout(resetGame, 1500);
}

function makeAIMove() {
  if (gameOver) return;
  
  // Simple AI: first try to win, then block, then random
  let move = findWinningMove("O") || 
             findWinningMove("X") || 
             findRandomMove();
  
  if (move !== null) {
    handleMove(move);
  }
}

function findWinningMove(player) {
  for (let i = 0; i < 9; i++) {
    if (!cells[i]) {
      cells[i] = player;
      if (checkWinner()) {
        cells[i] = null; // Undo the test move
        return i;
      }
      cells[i] = null; // Undo the test move
    }
  }
  return null;
}

function findRandomMove() {
  const availableMoves = cells.map((cell, index) => cell === null ? index : null)
                             .filter(val => val !== null);
  if (availableMoves.length > 0) {
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }
  return null;
}

function resetGame() {
  cells = Array(9).fill(null);
  currentPlayer = "X";
  gameOver = false;
  renderBoard();
  
  // If playing against AI and AI goes first
  if (vsAI && currentPlayer === "O") {
    setTimeout(makeAIMove, 500);
  }
}

function updateStats() {
  gamesPlayedSpan.textContent = gamesPlayed;
  xWinsSpan.textContent = xWins;
  oWinsSpan.textContent = oWins;
  drawsSpan.textContent = draws;
}

function resetStats() {
  gamesPlayed = 0;
  xWins = 0;
  oWins = 0;
  draws = 0;
  updateStats();
}

function toggleGameMode() {
  vsAI = !vsAI;
  gameModeBtn.textContent = vsAI ? "Play vs Human" : "Play vs AI";
  resetGame();
}

// Event listeners
document.getElementById("reset-stats-btn").addEventListener("click", resetStats);
document.getElementById("reset-game-btn").addEventListener("click", resetGame);
gameModeBtn.addEventListener("click", toggleGameMode);

renderBoard();