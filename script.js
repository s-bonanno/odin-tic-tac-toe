//player factory
const player = (playerName, symbol, type) => {
  return { playerName, symbol, type };
};

const game = (() => {
  //setup players
  const playerOne = player("Player 1", "X", "Human");
  const playerTwo = player("Player 2", "O", "Human");

  //set active player
  let activePlayer = playerOne;

  function setPlayerTwo() {
    if (gameboard.getMove() != 0){return};
    if (gameboard.playerSelect.textContent === "🧑 vs 🧑") {
      gameboard.playerSelect.textContent = "🧑 vs 🤖 (Easy)";
      playerTwo.type = "Computer";
    } else {
      gameboard.playerSelect.textContent = "🧑 vs 🧑";
      playerTwo.type = "Human";
    }
  }

  const getActivePlayer = () => activePlayer;

  function swapPlayers() {
    activePlayer = activePlayer === playerOne ? playerTwo : playerOne;
  }

  function restartGame() {
    activePlayer = playerOne;
    showGameStatus("reset");
    gameboard.resetMoves();
    gameboard.addHoverSymbol();
    gameboard.playerSelect.classList.remove("disabled");
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
      [6, 4, 2],
    ];

    //Check for any winning combos
    winningCombos.forEach((winningCombo) => {
      if (
        gameboard
          .getGameboardArray()
          .find((move) => move.position == winningCombo[0])?.symbol ===
          activePlayer.symbol &&
        gameboard
          .getGameboardArray()
          .find((move) => move.position == winningCombo[1])?.symbol ===
          activePlayer.symbol &&
        gameboard
          .getGameboardArray()
          .find((move) => move.position == winningCombo[2])?.symbol ===
          activePlayer.symbol
      ) {
        playerWins = true;
        gameOver(winningCombo);
        gameboard.removeHoverSymbol();
        gameboard.resetMoves();
        gameboard.colourSquares("win", winningCombo);

        showGameStatus("win");
      }
    });

    if (playerWins === false && gameboard.getMove() < 9) {
      swapPlayers();
      showGameStatus("next");
      gameboard.addHoverSymbol();
      playComputerMove();
    }

    //If there is no winner, check if all moves have been made. If so, declare a draw.
    if (playerWins === false && gameboard.getMove() === 9) {
      drawGame();
      showGameStatus("draw");
    }
  }

  function playComputerMove() {
    if (gameboard.getMove() === 9) return;
    if (activePlayer.type === "Computer") {

      //choose a random number between 0 and 8
      const position = Math.floor(Math.random() * 8);

      if (
        gameboard.getGameboardArray().some((item) => item.position === position)
      ) {
        playComputerMove();
      } else {
        gameboard.increaseMove();
        gameboard.getGameboardArray().push({
          player: activePlayer.playerName,
          type: activePlayer.type,
          symbol: activePlayer.symbol,
          position: position,
          moveNumber: gameboard.getMove(),
        });
        gameboard.drawGameboard();
        checkWinner();
      }
    }
  }

  function drawGame() {
    gameboard.resetMoves();
    gameboard.colourSquares("draw", [0, 1, 2, 3, 4, 5, 6, 7, 8]);
  }

  function gameOver(result) {
    gameboard.makeSquaresUnclickable();
    return result;
  }

  function showGameStatus(status) {
    switch (status) {
      case "win":
        gameboard.displayBlock.innerHTML = `Player ${activePlayer.symbol} wins <span>👏👏👏</span>`;
        break;
      case "draw":
        gameboard.displayBlock.innerHTML = `It's a draw <span>🤷‍♀️</span>`;
        break;
      case "next":
        gameboard.displayBlock.innerHTML = `Player ${activePlayer.symbol}'s turn`;
        break;
      case "reset":
        gameboard.displayBlock.innerHTML = `Player X to start <span>🏁</span>`;
        break;
    }
  }

  return {
    getActivePlayer,
    restartGame,
    checkWinner,
    showGameStatus,
    gameOver,
    setPlayerTwo,
  };
})();

//gameboard object
const gameboard = (() => {
  let gameboardArray = [];
  const getGameboardArray = () => gameboardArray;

  const playerSelect = document.querySelector("#playerSelect");
  playerSelect.addEventListener("click", game.setPlayerTwo);

  //game controls
  const resetButton = document.querySelector("#reset");
  resetButton.addEventListener("click", clearGameboard);

  //map all squares on board
  const gameSquare = document.querySelectorAll(".square");

  const displayBlock = document.querySelector("#display");

  //add event listener to each square to make it clickable
  function makeSquaresClickable() {
    gameSquare.forEach((item) => {
      item.addEventListener("click", markSquare);
    });
  }
  makeSquaresClickable();

  //remove event listener on each square
  function makeSquaresUnclickable() {
    gameSquare.forEach((item) => {
      item.removeEventListener("click", markSquare);
    });
  }

  //add event listener to each square to show a symbol on hover
  function addHoverSymbol() {
    gameSquare.forEach((item) => setHover(item));
  }
  addHoverSymbol();

  function removeHoverSymbol() {
    gameSquare.forEach((item) => {
      item.classList.remove("xhover");
      item.classList.remove("ohover");
    });
  }

  function setHover(item) {
    const activePlayer = game.getActivePlayer();

    item.classList.remove("xhover");
    item.classList.remove("ohover");

    if (!item.classList.contains("x") && !item.classList.contains("o")) {
      if (activePlayer.symbol === "X") {
        item.classList.add("xhover");
      } else {
        item.classList.add("ohover");
      }
    }
  }

  let move = 0;
  const getMove = () => move;
  const increaseMove = () => move++;
  const resetMoves = () => (move = 0);

  //update array on click
  function markSquare(e) {
    if (move === 0){ playerSelect.classList.add("disabled")};
    move++;
    const activePlayer = game.getActivePlayer();
    const arrayIndex = e.target.getAttribute("data-array-index");
    gameboardArray.push({
      player: activePlayer.playerName,
      type: activePlayer.type,
      symbol: activePlayer.symbol,
      position: parseInt(arrayIndex),
      moveNumber: move,
    });
    e.target.removeEventListener("click", markSquare);
    drawGameboard();
    game.checkWinner();
  }

  function colourSquares(className, squares) {
    squares.forEach((square) => {
      gameSquare[square].classList.add(className);
    });
  }

  function drawGameboard() {
    gameboardArray.forEach((item) => {
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
    });
  }

  function clearGameboard() {
    gameboardArray = [];
    gameSquare.forEach((square) => {
      square.classList.remove("o");
      square.classList.remove("x");
      square.classList.remove("xhover");
      square.classList.remove("ohover");
      square.classList.remove("win");
      square.classList.remove("draw");
    });
    drawGameboard();
    makeSquaresClickable();
    game.restartGame();
  }

  return {
    makeSquaresUnclickable,
    getMove,
    colourSquares,
    getGameboardArray,
    resetMoves,
    addHoverSymbol,
    removeHoverSymbol,
    displayBlock,
    playerSelect,
    drawGameboard,
    increaseMove,
  };
})();