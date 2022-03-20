const displayController = (() => {
  function printSymbol(square, symbol) {
    const path = symbol === "x" ? "./svg/symbol_X.svg" : "./svg/symbol_O.svg";
    const img = new Image(100, 100);
    img.src = path;
    square.appendChild(img);
  }

  function winner(winnerSquares) {
    winnerSquares.forEach((square) => square.classList.add("winner"));
  }

  function clearDisplay() {
    for (const symbolImg of document.querySelectorAll('img[src^="./svg/"]')) {
      symbolImg.remove();
    }
    for (const square of document.querySelectorAll(".square")) {
      square.classList.remove("winner");
    }
  }

  return { printSymbol, clearDisplay, winner };
})();

const gameController = (() => {
  const squares = [...document.querySelectorAll(".square")];
  const mainBoard = GameBoard();

  let currGame = humanVsComputer;
  let _interval = null;
  let countForHumanVsHuman = 0;

  let _player1 = Player("x");
  let _player2 = AIPlayer("o", "hard");

  const symbolBtn = [...document.querySelectorAll(".symbol")];
  symbolBtn.forEach((btn) => btn.addEventListener("click", switchSymbol));

  const restartBtn = document.querySelector(".restart");
  restartBtn.addEventListener("click", restart);

  const playersInput = [...document.querySelectorAll(".player-type>input")];
  playersInput.forEach((btn) => btn.addEventListener("input", changePlayer));

  const difficultySelects = [...document.querySelectorAll("#difficulty")];
  difficultySelects.forEach((select) =>
    select.addEventListener("input", changeDifficulty)
  );

  play();

  function play() {
    if (currGame !== computerVsComputer) {
      squares.forEach((square) =>
        square.removeEventListener("click", currGame)
      );
    }
    if (_player1.type === "human" && _player2.type === "human") {
      squares.forEach((square) =>
        square.addEventListener("click", humanVsHuman)
      );
      currGame = humanVsHuman;
    }
    if (
      (_player1.type === "human" && _player2.type === "computer") ||
      (_player1.type === "computer" && _player2.type === "human")
    ) {
      squares.forEach((square) =>
        square.addEventListener("click", humanVsComputer)
      );
      currGame = humanVsComputer;
    }
    if (_player1.type === "computer" && _player2.type === "computer") {
      currGame = computerVsComputer;
      computerVsComputer();
    }
  }

  function humanVsHuman(e) {
    if (!e.target.classList.contains("square")) return;
    const square = e.target;
    const symbol = countForHumanVsHuman % 2 === 0 ? _player1.getSymbol() : _player2.getSymbol();
    mainBoard.addSymbol(squares.indexOf(square), symbol);
    displayController.printSymbol(square, symbol);

    const winner = mainBoard.checkBoard();
    if (winner) {
      displayController.winner(
        squares.filter((_, i) => winner.squares.includes(i))
      );
      squares.forEach((square) => square.removeEventListener("click", humanVsHuman));
      countForHumanVsHuman = 0;
      return;
    }
    countForHumanVsHuman++;
  }

  function humanVsComputer(e) {
    if (!e.target.classList.contains("square")) return;
    const square = e.target;
    mainBoard.addSymbol(squares.indexOf(square), _player1.getSymbol());
    displayController.printSymbol(square, _player1.getSymbol());

    const index = _player2.getMoves(mainBoard);
    mainBoard.addSymbol(index, _player2.getSymbol());
    displayController.printSymbol(squares[index], _player2.getSymbol());

    const winner = mainBoard.checkBoard();
    if (winner) {
      displayController.winner(
        squares.filter((_, i) => winner.squares.includes(i))
      );
      squares.forEach((square) => square.removeEventListener("click", humanVsComputer));
    }
  }

  function computerVsComputer() {
    let countTurn = 0;
    _interval = setInterval(() => {
      const symbol =
        countTurn % 2 === 0 ? _player1.getSymbol() : _player2.getSymbol();
      const position =
        countTurn % 2 === 0
          ? _player1.getMoves(mainBoard)
          : _player2.getMoves(mainBoard);
      mainBoard.addSymbol(position, symbol);
      displayController.printSymbol(squares[position], symbol);

      const winner = mainBoard.checkBoard();
      if (winner) {
        displayController.winner(
          squares.filter((_, i) => winner.squares.includes(i))
        );
        clearInterval(_interval);
      }
      countTurn++;
    }, 800);
  }

  function switchSymbol(e) {
    if (e.target.classList.contains("current")) return;
    symbolBtn.forEach((btn, i) => {
      btn.classList.toggle("current");
      if (btn.classList.contains("current")) {
        if (i < 2) {
          _player1.changeSymbol(btn.getAttribute("symbol"));
        } else {
          _player2.changeSymbol(btn.getAttribute("symbol"));
        }
      }
      restart();
    });
  }

  function changePlayer(e) {
    const radio = e.target;
    const type = radio.getAttribute("typePlayer");
    const select = document.querySelector(`select[name="${radio.name}"]`);
    if (type === "computer") {
      select.classList.remove("hidden");
      select.value = "easy";
      if (radio.name === "player1") _player1 = AIPlayer(_player1.getSymbol());
      if (radio.name === "player2") _player2 = AIPlayer(_player2.getSymbol());
    }
    if (type === "human") {
      select.classList.add("hidden");
      if (radio.name === "player1") _player1 = Player(_player1.getSymbol());
      if (radio.name === "player2") _player2 = Player(_player2.getSymbol());
    }
    restart();
  }

  function changeDifficulty(e) {
    const player = e.target.name;
    if (player === "player1") _player1.changeDifficulty(e.target.value);
    if (player === "player2") _player2.changeDifficulty(e.target.value);
    restart();
  }

  function restart() {
    clearInterval(_interval);
    displayController.clearDisplay();
    mainBoard.clearBoard();
    play();
  }
})();

function GameBoard(board = [...Array(9).keys()]) {
  let _board = board;

  function addSymbol(index, symbol) {
    _board[index] = symbol;
    checkBoard();
  }

  function getAvailableMoves() {
    return _board.filter((s) => s !== "x" && s !== "o");
  }

  function clearBoard() {
    _board = [...Array(9).keys()];
  }

  function checkBoard() {
    const possibleWins = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (const win of possibleWins) {
      const [i1, i2, i3] = win;
      if ([_board[i1], _board[i2], _board[i3]].every((el) => el === "x")) {
        return { symbol: "x", squares: win };
      } else if (
        [_board[i1], _board[i2], _board[i3]].every((el) => el === "o")
      ) {
        return { symbol: "o", squares: win };
      }
    }
    return false;
  }

  return { addSymbol, checkBoard, getAvailableMoves, clearBoard };
}

function Player(symbol) {
  const type = "human";
  let _symbol = symbol;

  function getSymbol() {
    return _symbol;
  }

  function changeSymbol(newSymbol) {
    _symbol = newSymbol;
  }
  return { getSymbol, changeSymbol, type };
}

function AIPlayer(symbol = "x", difficulty = "easy") {
  const type = "computer";
  let _symbol = symbol;
  let _difficulty = difficulty;
  let _opponentSymbol = _symbol === "x" ? "o" : "x";

  function getMoves(board) {
    switch (_difficulty) {
      case "easy":
        if (Math.floor(Math.random() * 101) <= 20) {
          return minimax(board, _symbol, -Infinity, +Infinity, true).index;
        } else {
          let randomIndex = Math.floor(Math.random() * 10);
          while (!board.getAvailableMoves().includes(randomIndex)) {
            randomIndex = Math.floor(Math.random() * 10);
          }
          return randomIndex;
        }
        break;
      case "medium":
        if (Math.floor(Math.random() * 101) >= 50) {
          return minimax(board, _symbol, -Infinity, +Infinity, true).index;
        } else {
          let randomIndex = Math.floor(Math.random() * 10);
          while (!board.getAvailableMoves().includes(randomIndex)) {
            randomIndex = Math.floor(Math.random() * 10);
          }
          return randomIndex;
        }
        break;
      case "hard":
        return minimax(board, _symbol, -Infinity, +Infinity, true).index;
        break;
    }
  }

  function minimax(newBoard, player, alpha, beta, maximizingPlayer, depth = 0) {
    const availSpots = newBoard.getAvailableMoves();
    const winner = newBoard.checkBoard();

    if (winner && winner.symbol === _opponentSymbol) {
      return { score: -100 + depth };
    } else if (winner && winner.symbol === _symbol) {
      return { score: 100 - depth };
    } else if (availSpots.length === 0) {
      return { score: 0 };
    }

    const moves = [];

    for (let i = 0; i < availSpots.length; i++) {
      const spot = availSpots[i];

      const move = {};
      move.index = spot;

      newBoard.addSymbol(spot, player);

      if (maximizingPlayer) {
        const result = minimax(
          newBoard,
          _opponentSymbol,
          alpha,
          beta,
          false,
          depth + 1
        );
        move.score = result.score;
        alpha = Math.max(alpha, result.score);
      } else {
        const result = minimax(newBoard, _symbol, alpha, beta, true, depth + 1);
        move.score = result.score;
        beta = Math.min(beta, result.score);
      }

      newBoard.addSymbol(spot, move.index);

      moves.push(move);
      if (beta <= alpha) break;
    }

    let bestMove;
    if (maximizingPlayer) {
      let bestScore = -Infinity;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }

    return moves[bestMove];
  }

  function getSymbol() {
    return _symbol;
  }

  function changeSymbol(newSymbol) {
    _opponentSymbol = _symbol;
    _symbol = newSymbol;
  }

  function changeDifficulty(newDifficulty) {
    _difficulty = newDifficulty;
  }

  return { getMoves, getSymbol, changeSymbol, changeDifficulty, type };
}
