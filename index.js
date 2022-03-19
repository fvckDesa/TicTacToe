const displayController = (() => {
  function printSymbol(square, symbol) {
    const path = symbol === "x" ? "./svg/symbol_X.svg" : "./svg/symbol_O.svg";
    const img = new Image(100, 100);
    img.src = path;
    square.appendChild(img);
  }

  function winner(winnerSquares) {
    winnerSquares.forEach(square => square.classList.add("winner"));
  }

  function clearDisplay() {
    for (const symbolImg of document.querySelectorAll('img[src^="./svg/"]')) {
      symbolImg.remove();
    }
  }

  return { printSymbol, clearDisplay, winner };
})();

const gameController = (() => {
  const squares = [...document.querySelectorAll(".square")];
  const mainBoard = GameBoard();
  let currSymbol = "x";

  for (const square of squares) {
    square.addEventListener("click", play);
  }

  function play(e) {
    if(!e.target.classList.contains("square")) return;
    const square = e.target;
      mainBoard.addSymbol(squares.indexOf(square), currSymbol);
      displayController.printSymbol(square, currSymbol);
      const winner = mainBoard.checkBoard();
      if (winner) {
        displayController.winner(squares.filter((_, i) => winner.squares.includes(i)));
        squares.forEach((square) => square.removeEventListener("click", play));
      }
      switchSymbol();
  }

  function switchSymbol() {
    if (currSymbol === "x") currSymbol = "o";
    else currSymbol = "x";
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

  return { addSymbol, checkBoard };
}
