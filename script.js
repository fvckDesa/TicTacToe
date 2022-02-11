const squares = [...document.querySelectorAll(".square")];

const createPlayer = (simbol) => {
  return { simbol };
};

const scoreTable = (() => {
  let p1 = 0,
    p2 = 0;
  const getScore = () => `${p1} - ${p2}`;
  const updateScore = (simbol) => (simbol === "X" ? p1++ : p2++);
  const clearScore = () => ([p1, p2] = [0, 0]);
  return { getScore, updateScore, clearScore };
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
        return [squares[i1], squares[i2], squares[i3]];
      }
    }
    return false;
  };
  const clearBoard = () => (_board = []);
  return { getBoard, setBoard, checkWin, clearBoard };
})();

const displayController = (() => {
  
  const clearBoard = () => {
    squares.forEach(square => {
      square.firstChild && square.firstChild.remove();
      square.classList.remove('winner');
      gameBoard.clearBoard();
    });
  };
  
  const printSimbol = (square, simbol) => {
    const turn = document.querySelector('#turn');
    if(!square.hasChildNodes()){
      turn.innerHTML = `${simbol === 'X' ? 'O' : 'X'} make your choice`;
      square.innerHTML = `<h1>${simbol}</h1>`;
      gameBoard.setBoard(squares.indexOf(square), simbol);
    }
    if(gameBoard.getBoard().join('').length === 9){
      clearBoard();
    }
  }

  const message = (text) => {
    const codeHTML = `<div class="message-bkg"></div><h1 class="message">${text}</h1>`;
    const message = document.createElement('div');
    message.classList.add('message-node', 'center');
    message.innerHTML = codeHTML;
    message.addEventListener('click', () => {
      message.remove();
      clearBoard();
    });
    document.body.appendChild(message);
    if(text.match('game')){
      scoreTable.clearScore();
    }
  }

  const printScore = () => {
    const score = document.querySelector('.score');
    score.innerHTML = scoreTable.getScore();
  }

  const printWinner = (squaresWin, text) => {
    squaresWin.forEach(square => square.classList.add('winner'));
    message(text);
    printScore();
  }

  const restart = () => {
    scoreTable.clearScore();
    clearBoard();
    printScore();
  }
  return {printSimbol, printWinner, restart }
})();

const gameController = (() => {
  let simbol = 'X';
  squares.forEach((square) => square.addEventListener("click", () => {
    displayController.printSimbol(square, simbol);
    const win = gameBoard.checkWin(simbol);
    if(win) {
      scoreTable.updateScore(simbol);
      const text = scoreTable.getScore().split(' - ').some(el => el === '3') ? 'game' : 'round';
      displayController.printWinner(win, `${simbol} win ${text}`);
    }
    simbol = simbol === 'X' ? 'O' : 'X';
    document.querySelector('button').addEventListener('click', () => {
      simbol = 'X';
      displayController.restart();
    })
  }));
})();

