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

  const minimax = (
    newBoard,
    player,
    alpha,
    beta,
    maximizingPlayer,
    depth = 0
  ) => {
    const availSpots = newBoard.getAvilableMoves();
    if (newBoard.checkWin()?.simbol === "O") {
      return { score: -100 + depth }; //human
    } else if (newBoard.checkWin()?.simbol === "X") {
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
        const result = minimax(newBoard, "O", alpha, beta, false, depth + 1);
        move.score = result.score;
        alpha = Math.max(alpha, result.score);
      } else {
        const result = minimax(newBoard, "X", alpha, beta, true, depth + 1);
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

  const setDifficulty = (newDifficulty) => (difficulty = newDifficulty);

  const play = (board) => {
    switch (AIdifficulty) {
      case "easy":
        let randomIndex = Math.floor(Math.random() * 10);
        while (!board.getAvilableMoves().includes(randomIndex)) {
          randomIndex = Math.floor(Math.random() * 10);
        }
        return randomIndex;
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
      case "hard":
        return minimax(board, AIsimbol, -Infinity, +Infinity, true).index;
    }
  };

  const changeSimbol = (newSimbol) => (AIsimbol = newSimbol);
  const getSimbol = () => AIsimbol;
  const changeDifficulty = (newDifficulty) => (AIdifficulty = newDifficulty);

  return { setDifficulty, play, changeSimbol, getSimbol, changeDifficulty };
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
  const player = createPlayer("O");
  const ai = createAI("X", "medium");

  const index = ai.play(mainBoard);
  displayController.printSimbol(squares[index], ai.getSimbol());
  squares.forEach((square) =>
    square.addEventListener("click", () => {
      displayController.printSimbol(square, player.getSimbol());
      if (mainBoard.checkWin()) {
        console.log("win");
      } else {
        const index = ai.play(mainBoard);
        displayController.printSimbol(squares[index], ai.getSimbol());
      }
    })
  );
})();
