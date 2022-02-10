const createPlayer = (simbol) => {
  return { simbol };
};

const scoreTable = (() => {
    let p1 = 0, p2 = 0;
    const getScore = () => `${p1} - ${p2}`;
    const updateScore = (simbol) => simbol === 'X' ? p1++ : p2++;
    const clearScore = () => [p1, p2] = [0, 0];
    return {getScore, updateScore, clearScore};
})();

const gameBoard = (() => {
  let _board = [];
  const getBoard = () => _board;
  const setBoard = (index, value) => (_board[index] = value);
  const checkWin = (simbol) => {
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
      if ([_board[i1], _board[i2], _board[i3]].every((el) => el === simbol)) {
        return win;
      }
    }
    return false;
  };
  const clearBoard = () => (_board = []);
  return { getBoard, setBoard, checkWin, clearBoard };
})();

const displayController = (() => {
  const printBoard = (...args) => {
    const [square, simbol] = args;
    if (!square.hasChildNodes()) {
      square.innerHTML = `<h1 id="simbol">${simbol}</h1>`;
      gameBoard.setBoard(square.getAttribute("value"), simbol);
    }
  };
  const printWinner = (squares) =>
    squares.forEach((square) => square.classList.add("winner"));
  const clearDisplay = (squares) => {
    squares.forEach(square => {
        const simbol = document.querySelector('#simbol');
        square.classList.remove('winner');
        simbol && simbol.remove();
        gameBoard.clearBoard();
    })
  }
  const printScore = (score) => document.querySelector('.score').innerText = score;
  return { printBoard, printWinner, printScore, clearDisplay };
})();

const gameController = (() => {
  const player1 = createPlayer("X");
  const player2 = createPlayer("O");
  let simbol = player1.simbol;

  const changeSimbol = () =>
    simbol === player1.simbol
      ? (simbol = player2.simbol)
      : (simbol = player1.simbol);

  const squares = document.querySelectorAll(".square");
  squares.forEach((square) =>
    square.addEventListener("click", () => {
      displayController.printBoard(square, simbol);
      const win = gameBoard.checkWin(simbol);
      if (win) {
        const [i1, i2, i3] = win;
        displayController.printWinner([squares[i1], squares[i2], squares[i3]]);
        displayController.clearDisplay(squares);
        scoreTable.updateScore(simbol);
        displayController.printScore(scoreTable.getScore());
        if(scoreTable.getScore().split(' - ').includes('3')){
            scoreTable.clearScore();
            displayController.printScore(scoreTable.getScore());
        }
      }
      changeSimbol();
    })
  );
})();