// game state
let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameOver = false;
let mode = "ai"; // "ai" or "2p"
let scores = { X: 0, O: 0, D: 0 };

// winning combinations
const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

function setMode(m) {
  mode = m;

  document.getElementById("btn-ai").classList.toggle("active", m === "ai");
  document.getElementById("btn-2p").classList.toggle("active", m === "2p");

  if (m === "ai") {
    document.getElementById("label-x").textContent = "You (X)";
    document.getElementById("label-o").textContent = "CPU (O)";
  } else {
    document.getElementById("label-x").textContent = "Player X";
    document.getElementById("label-o").textContent = "Player O";
  }

  resetBoard();
}

function handleClick(index) {
  if (gameOver) return;
  if (board[index] !== "") return;

  // block clicks when it's AI's turn
  if (mode === "ai" && currentPlayer === "O") return;

  makeMove(index, currentPlayer);

  // let AI play after player move
  if (!gameOver && mode === "ai" && currentPlayer === "O") {
    setTimeout(function () {
      aiMove();
    }, 400);
  }
}

function makeMove(index, player) {
  board[index] = player;

  let cell = document.getElementById("c" + index);
  cell.textContent = player;
  cell.classList.add(player.toLowerCase());

  let winResult = checkWinner();

  if (winResult) {
    // highlight winning cells
    winResult.forEach(function (i) {
      document.getElementById("c" + i).classList.add("win");
    });

    gameOver = true;
    scores[player]++;
    updateScores();

    if (mode === "ai") {
      document.getElementById("status").textContent =
        player === "X" ? "You win! 🎉" : "Computer wins! 🤖";
    } else {
      document.getElementById("status").textContent = "Player " + player + " wins! 🎉";
    }

    return;
  }

  // check for draw
  if (!board.includes("")) {
    gameOver = true;
    scores.D++;
    updateScores();
    document.getElementById("status").textContent = "It's a draw! 🤝";
    return;
  }

  // switch player
  currentPlayer = currentPlayer === "X" ? "O" : "X";

  if (mode === "ai") {
    document.getElementById("status").textContent =
      currentPlayer === "X" ? "Your turn! (X)" : "Computer thinking...";
  } else {
    document.getElementById("status").textContent = "Player " + currentPlayer + "'s turn";
  }
}

// check if there's a winner, returns winning indexes or null
function checkWinner() {
  for (let i = 0; i < winCombos.length; i++) {
    let a = winCombos[i][0];
    let b = winCombos[i][1];
    let c = winCombos[i][2];

    if (board[a] !== "" && board[a] === board[b] && board[a] === board[c]) {
      return [a, b, c];
    }
  }
  return null;
}

// AI using minimax so it never loses
function aiMove() {
  let bestScore = -Infinity;
  let bestIndex = -1;

  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = "O";
      let score = minimax(board, 0, false);
      board[i] = "";

      if (score > bestScore) {
        bestScore = score;
        bestIndex = i;
      }
    }
  }

  if (bestIndex !== -1) {
    makeMove(bestIndex, "O");
  }
}

function minimax(boardState, depth, isMaximizing) {
  let winner = getWinnerFromBoard(boardState);

  if (winner === "O") return 10 - depth;
  if (winner === "X") return depth - 10;
  if (!boardState.includes("")) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (boardState[i] === "") {
        boardState[i] = "O";
        best = Math.max(best, minimax(boardState, depth + 1, false));
        boardState[i] = "";
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (boardState[i] === "") {
        boardState[i] = "X";
        best = Math.min(best, minimax(boardState, depth + 1, true));
        boardState[i] = "";
      }
    }
    return best;
  }
}

function getWinnerFromBoard(b) {
  for (let i = 0; i < winCombos.length; i++) {
    let a = winCombos[i][0];
    let x = winCombos[i][1];
    let c = winCombos[i][2];

    if (b[a] !== "" && b[a] === b[x] && b[a] === b[c]) {
      return b[a];
    }
  }
  return null;
}

function updateScores() {
  document.getElementById("score-x").textContent = scores.X;
  document.getElementById("score-o").textContent = scores.O;
  document.getElementById("score-d").textContent = scores.D;
}

function resetBoard() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameOver = false;

  for (let i = 0; i < 9; i++) {
    let cell = document.getElementById("c" + i);
    cell.textContent = "";
    cell.className = "cell";
  }

  if (mode === "ai") {
    document.getElementById("status").textContent = "Your turn! (X)";
  } else {
    document.getElementById("status").textContent = "Player X's turn";
  }
}

function resetAll() {
  scores = { X: 0, O: 0, D: 0 };
  updateScores();
  resetBoard();
}