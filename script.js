const createPlayer = (simbol) => {
    return {simbol};
}

const gameBoard = (() => {
    let _board = Array(9);
    const getBoard = () => _board;
    const setBoard = (index, simbol) => _board[index] = simbol;
    const clearBoard = () => _board = Array(9);
    return {getBoard, setBoard, clearBoard}
})();


const displayController = (() => {
    const print = (index, simbol) => {
        const squares = document.querySelectorAll('.square');
        squares[index].innerHTML = `<h1 id="simbol">${simbol}</h1>`;
    }
    const score = (score) => {
        const displayScore = document.querySelector('.score');
        displayScore.innerText = score;
    }
    return {print, score}
})();

const scoreTable = (() => {
    let _player1 = 0, _player2 = 0;
    const getScore = () => `${_player1} - ${_player2}`;
    const updateScore = (simbol) => {
        simbol === 'X' ? _player1++ : _player2++;
        displayController.score(getScore());
    };
    const clearScore = () => [_player1, _player2] = [0, 0];
    return {getScore, updateScore, clearScore};
})();

const gameController = (() => {
    const player1 = createPlayer('X');
    const player2 = createPlayer('O');

    let turn = 0;

    const changeTurn = () => {
        turn++;
        return turn % 2 === 0 ? player1.simbol : player2.simbol;
    }

    const checkWinner = (board, simbol) => {
        if([board[0], board[1], board[2]].every(el => el === simbol)) return true;
        if([board[3], board[4], board[5]].every(el => el === simbol)) return true;
        if([board[6], board[7], board[8]].every(el => el === simbol)) return true;
        if([board[0], board[3], board[6]].every(el => el === simbol)) return true;
        if([board[1], board[4], board[7]].every(el => el === simbol)) return true;
        if([board[2], board[5], board[8]].every(el => el === simbol)) return true;
        if([board[0], board[4], board[8]].every(el => el === simbol)) return true;
        if([board[2], board[4], board[6]].every(el => el === simbol)) return true;
        return false;
    }

    const squares = document.querySelectorAll('.square');
    squares.forEach(el => el.addEventListener('click', (e) => {
        const index = e.target.getAttribute('value');
        const simbol = changeTurn()
        displayController.print(index, simbol);
        gameBoard.setBoard(index, simbol);
        if(checkWinner(gameBoard.getBoard(), simbol)){
            scoreTable.updateScore(simbol);
            if(scoreTable.getScore().split(' - ').some(score => score >= 3)){
                scoreTable.clearScore();
                displayController.score('0 - 0');
            }
            const h1s = document.querySelectorAll('#simbol');
            h1s.forEach(h1 => h1.remove());
            gameBoard.clearBoard();
        }
    }));
    
})();