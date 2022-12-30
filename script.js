//player factory
const player = (playerName, symbol) => {
  return {playerName, symbol};
}


//gameboard object
const gameboard = (() => {
  
  let gameboardArray = [];
  const getGameboardArray = () => gameboardArray;

  //game controls
  const resetButton = document.querySelector("#reset");
  resetButton.addEventListener("click", clearGameboard);

  //map all squares on board
  const gameSquare = document.querySelectorAll(".square");

  const displayBlock = document.querySelector("#display");

  //add event listener to each square
  function makeSquaresClickable() {
    gameSquare.forEach((item) => {
      item.addEventListener("click", markSquare);
    })
  }
  makeSquaresClickable();

  //remove event listener on each square
  function makeSquaresUnclickable() {
    gameSquare.forEach(item => {
      item.removeEventListener("click", markSquare);
    })
  }

  let move = 0;
  const getMove = () => move;
  const resetMoves = () => move = 0;

  //update array on click
  function markSquare(e) {
    move++;
    const activePlayer = game.getActivePlayer();
    const arrayIndex = e.target.getAttribute("data-array-index");
    gameboardArray.push({player: activePlayer.playerName, symbol: activePlayer.symbol, position: arrayIndex, moveNumber: move});
    e.target.removeEventListener("click", markSquare);
    drawGameboard();
    game.checkWinner();
  }

  function colourSquares(className, squares){
    squares.forEach(square => {
      gameSquare[square].classList.add(className);
    })
  }

  function drawGameboard() {
    gameboardArray.forEach((item, index) => {
      switch (item.symbol) {
        case "X":
          gameSquare[item.position].classList.add("x");
          break;
        case "O":
          gameSquare[item.position].classList.add("o");
          break;
        default:
          return;
      }
    })
  }

  function clearGameboard() {
    gameboardArray = [];
    gameSquare.forEach(square => {
      square.classList.remove("o");
      square.classList.remove("x");
      square.classList.remove("win");
      square.classList.remove("draw");
    });
    drawGameboard();
    makeSquaresClickable();
    game.restartGame();
    console.log("clearGameboard")
  }

  return {
    makeSquaresUnclickable,
    getMove,
    colourSquares,
    getGameboardArray,
    resetMoves,
    displayBlock
  }
})();

const game = (() => {

  //setup players
  const playerOne = player("Player 1", "X");
  const playerTwo = player("Player 2", "O");

  let activePlayer = playerOne;

  const getActivePlayer = () => activePlayer;

  function swapPlayers() {
    activePlayer = activePlayer === playerOne ? playerTwo : playerOne;
  }

  function restartGame() {
    activePlayer = playerOne;
    showGameStatus("reset");
    console.log("restartGame");
    gameboard.resetMoves();
  }

  function checkWinner() {

    let playerWins = false;

    const winningCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [6, 4, 2]
    ]

    //Check for any winning combos
    winningCombos.forEach(winningCombo => {
      if (
        gameboard.getGameboardArray().find(move => move.position == winningCombo[0])?.symbol === activePlayer.symbol &&
        gameboard.getGameboardArray().find(move => move.position == winningCombo[1])?.symbol === activePlayer.symbol &&
        gameboard.getGameboardArray().find(move => move.position == winningCombo[2])?.symbol === activePlayer.symbol
        ){
        playerWins = true;
        gameOver(winningCombo);
        gameboard.resetMoves();
        gameboard.colourSquares("win",winningCombo);
        showGameStatus("win");
      }
    })

    if (playerWins === false && gameboard.getMove() < 9) {
      swapPlayers();
      showGameStatus("next");
    }

    //If there is no winner, check if all moves have been made. If so, declare a draw.
    if (playerWins === false && gameboard.getMove() === 9) {
      drawGame();
      showGameStatus("draw");
    }

  }

  function drawGame() {
    gameboard.resetMoves();
    gameboard.colourSquares("draw",[0,1,2,3,4,5,6,7,8]);
  }

  function gameOver(result) {
    console.log(`${activePlayer.symbol} wins. Winning squares ${result}`)
    gameboard.makeSquaresUnclickable();
    return result
  }

  function showGameStatus(status) {
    console.log("running")
    switch (status) {
      case "win":
        gameboard.displayBlock.textContent = `Player ${activePlayer.symbol} wins 👏👏👏`;
        break;
      case "draw":
        console.log("draw status")
        gameboard.displayBlock.textContent = `It's a draw 🤷‍♀️`;
        break;
      case "next":
        gameboard.displayBlock.textContent = `Player ${activePlayer.symbol}'s turn`;
        break;
      case "reset":
        gameboard.displayBlock.textContent = "Player X to start 🏁";
        break;
      }
  }

  return {
    getActivePlayer,
    restartGame,
    checkWinner,
    showGameStatus,
    gameOver
  }
})();