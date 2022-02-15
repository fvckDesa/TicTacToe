const squares = [...document.querySelectorAll(".square")];

const createPlayer = (simbol = "O") => {
  playerSimbol = simbol;

  const changeSimbol = (newSimbol) => (playerSimbol = newSimbol);
  const getSimbol = () => playerSimbol;

  return { changeSimbol, getSimbol };
};

const createAI = (simbol = "X", difficulty = "easy") => {
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
          console.log('minimax')
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
          console.log('minimax')
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

  return { setDifficulty, play, changeSimbol, getSimbol };
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
  const player1 = createPlayer("X");
  const player2 = createAI("O");

  squares.forEach((square) =>
    square.addEventListener("click", () => {
      displayController.printSimbol(square, player1.getSimbol());
      if (mainBoard.checkWin()) {
        console.log("win");
      } else {
        const index = player2.play(mainBoard);
        console.log(index);
        displayController.printSimbol(squares[index], player2.getSimbol());
      }
    })
  );

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

  [radioP1, radioP2].forEach((radio) => {
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
        }
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
    })
  });

  const restart = document.querySelector(".restart");
  restart.addEventListener("click", displayController.restart);
})();
