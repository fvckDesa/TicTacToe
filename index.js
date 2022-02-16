const squares = [...document.querySelectorAll(".square")];

const createPlayer = (simbol = "O") => {
  const type = "human";
  let playerSimbol = simbol;

  const changeSimbol = (newSimbol) => (playerSimbol = newSimbol);
  const getSimbol = () => playerSimbol;

  return { changeSimbol, getSimbol, type };
};

const createAI = (simbol = "X", difficulty = "easy") => {
  const type = "computer";
  let AIdifficulty = difficulty;
  let AIsimbol = simbol;
  let otherSimbol = AIsimbol === "X" ? "O" : "X";

  const minimax = (
    newBoard,
    player,
    alpha,
    beta,
    maximizingPlayer,
    depth = 0
  ) => {
    const availSpots = newBoard.getAvilableMoves();
    if (newBoard.checkWin()?.simbol === otherSimbol) {
      return { score: -100 + depth };
    } else if (newBoard.checkWin()?.simbol === AIsimbol) {
      return { score: 100 - depth };
    } else if (availSpots.length === 0) {
      return { score: 0 };
    }

    const moves = [];

    for (let i = 0; i < availSpots.length; i++) {
      const spot = availSpots[i];

      const move = {};
      move.index = spot;

      newBoard.setBoard(spot, player);

      if (maximizingPlayer) {
        const result = minimax(
          newBoard,
          otherSimbol,
          alpha,
          beta,
          false,
          depth + 1
        );
        move.score = result.score;
        alpha = Math.max(alpha, result.score);
      } else {
        const result = minimax(
          newBoard,
          AIsimbol,
          alpha,
          beta,
          true,
          depth + 1
        );
        move.score = result.score;
        beta = Math.min(beta, result.score);
      }

      newBoard.setBoard(spot, move.index);

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
  };

  const play = (board) => {
    switch (AIdifficulty) {
      case "easy":
        if (Math.floor(Math.random() * 101) <= 20) {
          return minimax(board, AIsimbol, -Infinity, +Infinity, true).index;
        } else {
          let randomIndex = Math.floor(Math.random() * 10);
          while (!board.getAvilableMoves().includes(randomIndex)) {
            randomIndex = Math.floor(Math.random() * 10);
          }
          return randomIndex;
        }
        break;
      case "medium":
        if (Math.floor(Math.random() * 101) >= 50) {
          return minimax(board, AIsimbol, -Infinity, +Infinity, true).index;
        } else {
          let randomIndex = Math.floor(Math.random() * 10);
          while (!board.getAvilableMoves().includes(randomIndex)) {
            randomIndex = Math.floor(Math.random() * 10);
          }
          return randomIndex;
        }
        break;
      case "hard":
        return minimax(board, AIsimbol, -Infinity, +Infinity, true).index;
        break;
    }
  };

  const changeSimbol = (newSimbol) => {
    AIsimbol = newSimbol;
    otherSimbol = newSimbol === "X" ? "O" : "X";
  };

  const getSimbol = () => AIsimbol;

  const setDifficulty = (newDifficulty) => (AIdifficulty = newDifficulty);
  const getDifficulty = () => AIdifficulty;

  return { setDifficulty, getDifficulty, play, changeSimbol, getSimbol, type };
};

const scoreTable = (() => {
  let p1 = 0,
    p2 = 0;
  const getScore = () => `${p1} - ${p2}`;
  const updateScore = (simbol) => (simbol === "X" ? p1++ : p2++);
  const clearScore = () => ([p1, p2] = [0, 0]);
  return { getScore, updateScore, clearScore };
})();

const gameBoard = (board = [...Array(9).keys()]) => {
  let _board = board;
  const getBoard = () => _board;
  const getAvilableMoves = () => _board.filter((s) => s !== "X" && s !== "O");
  const setBoard = (index, value) => (_board[index] = value);
  const checkWin = () => {
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
      if ([_board[i1], _board[i2], _board[i3]].every((el) => el === "X")) {
        return { win: [squares[i1], squares[i2], squares[i3]], simbol: "X" };
      } else if (
        [_board[i1], _board[i2], _board[i3]].every((el) => el === "O")
      ) {
        return { win: [squares[i1], squares[i2], squares[i3]], simbol: "O" };
      }
    }
    return false;
  };
  const clearBoard = () => (_board = [...Array(9).keys()]);
  return { getBoard, setBoard, checkWin, clearBoard, getAvilableMoves };
};

const mainBoard = gameBoard();

const displayController = (() => {
  const clearBoard = () => {
    squares.forEach((square) => {
      square.firstChild && square.firstChild.remove();
      square.classList.remove("winner");
      mainBoard.clearBoard();
    });
  };

  const printSimbol = (square, simbol) => {
    const turn = document.querySelector("#turn");
    if (!square.hasChildNodes()) {
      turn.innerHTML = `${simbol === "X" ? "O" : "X"} make your choice`;
      square.innerHTML = `<h1>${simbol}</h1>`;
      mainBoard.setBoard(squares.indexOf(square), simbol);
    }
  };

  const message = (text) => {
    const codeHTML = `<div class="message-bkg"></div><h1 class="message">${text}</h1>`;
    const message = document.createElement("div");
    message.classList.add("message-node", "center");
    message.innerHTML = codeHTML;
    message.addEventListener("click", () => {
      message.remove();
      clearBoard();
    });
    document.body.appendChild(message);
    if (text.match("game")) {
      scoreTable.clearScore();
    }
  };

  const printScore = () => {
    const score = document.querySelector(".score");
    score.innerHTML = scoreTable.getScore();
  };

  const printWinner = (squaresWin, text) => {
    squaresWin.forEach((square) => square.classList.add("winner"));
    message(text);
    printScore();
  };

  const restart = () => {
    scoreTable.clearScore();
    clearBoard();
    printScore();
  };
  return { printSimbol, printWinner, restart };
})();

const gameController = (() => {
  let player1 = createPlayer("X");
  let player2 = createAI("O");

  const start = () => {
    squares.forEach(square => square.clearEventListeners());

    let simbol = player1.getSimbol();

    function playGame(...args) {
      const [numHuman, square] = args;
      displayController.printSimbol(square, simbol);
      simbol = simbol === "X" ? "O" : "X";
      const win = mainBoard.checkWin();
      if (win) {
        displayController.printWinner(win.win, `The winner is ${win.simbol}`);
      } else if (numHuman === 1) {
        const index =
          player1.type === "computer"
            ? player1.play(mainBoard)
            : player2.play(mainBoard);
        displayController.printSimbol(squares[index], simbol);
        simbol = simbol === "X" ? "O" : "X";
      }
    }

    if (player1.type === "human" && player2.type === "human") {
      squares.forEach((square) =>
        square.addEventListener("click", playGame.bind(this, 2, square))
      );
    } else if (player1.type === "computer" && player2.type === "computer") {
      for (let i = 0; i < 9 && !mainBoard.checkWin(); i++) {
        const index =
          i % 2 === 0 ? player1.play(mainBoard) : player2.play(mainBoard);
        mainBoard.setBoard(index, simbol);
        playGame(0, squares[index]);
      }
    } else {
      if (player1.type === "computer") {
        const index = player1.play(mainBoard);
        playGame(squares[index]);
      } else {
        squares.forEach((square) =>
          square.addEventListener("click", playGame.bind(this, 1, square))
        );
      }
    }
  };

  const simbolBtn = document.querySelectorAll(".simbol-btn");
  simbolBtn.forEach((btn) =>
    btn.addEventListener("click", () => {
      displayController.restart();
      simbolBtn.forEach((simbol, index) => {
        simbol.classList.toggle("current-simbol");
        if (simbol.classList.contains("current-simbol")) {
          if (index < 2) {
            player1.changeSimbol(simbol.getAttribute("value"));
          } else {
            player2.changeSimbol(simbol.getAttribute("value"));
          }
        }
      });
    })
  );

  const aside = document.querySelector("aside");
  const radioP1 = aside.querySelectorAll('div#player1 input[type="radio"]');
  const radioP2 = aside.querySelectorAll('div#player2 input[type="radio"]');

  [radioP1, radioP2].forEach((radio, index) => {
    radio.forEach((btn) => {
      btn.addEventListener("input", () => {
        const select = aside.querySelector(
          `#player${index === 0 ? 1 : 2} #AIdifficulty`
        );

        if (
          btn.getAttribute("value") === "computer" &&
          select.classList.contains("hidden")
        ) {
          select.classList.remove("hidden");
        } else {
          select.classList.add("hidden");
          select.value = "easy";
        }

        if (btn.getAttribute("value") === "computer") {
          index === 0
            ? (player1 = createAI(player1.getSimbol()))
            : (player2 = createAI(player2.getSimbol()));
        } else {
          index === 0
            ? (player1 = createPlayer(player1.getSimbol()))
            : (player2 = createPlayer(player2.getSimbol()));
        }
        start();
      });
    });
  });

  const selectDifficulty = aside.querySelectorAll("#AIdifficulty");
  selectDifficulty.forEach((select, index) => {
    select.addEventListener("input", (e) => {
      displayController.restart();
      if (index === 0) {
        player1?.setDifficulty(e.target.value);
      } else {
        player2?.setDifficulty(e.target.value);
      }
    });
  });

  const restart = document.querySelector(".restart");
  restart.addEventListener("click", () => {
    displayController.restart();
    start();
  });

  return { start };
})();

gameController.start();