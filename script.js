const board = document.getElementById("game-board");
const statusText = document.getElementById("status");
const gamesPlayedSpan = document.getElementById("games-played");
const xWinsSpan = document.getElementById("x-wins");
const oWinsSpan = document.getElementById("o-wins");
const drawsSpan = document.getElementById("draws");


let currentPlayer = "X";
let cells = Array(9).fill(null);
let gameOver = false;
let gamesPlayed = 0;
let xWins = 0;
let oWins = 0;
let draws = 0;

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

function handleMove(index) {
  if (cells[index] || gameOver) return;

  cells[index] = currentPlayer;
  if (checkWinner()) {
    statusText.textContent = `Player ${currentPlayer} wins!`;
    gameOver = true;
    gamesPlayed++;
    if (currentPlayer === "X") xWins++;
    else oWins++;
    updateStats();
    setTimeout(resetGame, 1500); // Reset after 1.5 seconds
  } else if (cells.every(cell => cell)) {
    statusText.textContent = "It's a draw!";
    gameOver = true;
    gamesPlayed++;
    draws++;
    updateStats();
    setTimeout(resetGame, 1500); // Reset after 1.5 seconds
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    renderBoard();
  }
}
function resetGame() {
  cells = Array(9).fill(null);
  currentPlayer = "X";
  gameOver = false;
  renderBoard();
  statusText.textContent = `Player ${currentPlayer}'s turn`;
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


// Add this after your other DOM queries
const resetStatsBtn = document.getElementById("reset-stats-btn");
resetStatsBtn.addEventListener("click", resetStats);


renderBoard();
