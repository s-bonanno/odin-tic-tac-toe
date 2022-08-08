//player factor
const player = (name, symbol) => {
  return {name, symbol};
}

//gameboard object
const gameboard = (() => {  

  //gameboard array
  let gameboardArray = ["","","","","","","","",""];

  //map all squares on board
  const gameSquare = document.querySelectorAll('.square');

  //update the symbols on each sqare on the gameboard
  function drawGameboard() {
    gameboardArray.forEach((item,index) => {
      switch(item) {
        case "X":
          gameSquare[index].classList.add("x");
          break;
        case "O":
          gameSquare[index].classList.add("o");
          break;
        default:
          return
      };
    });
  }

  //add event listener to each square
  gameSquare.forEach((item) => {
    item.addEventListener('click',markSquare);
  });

  //update array on click
  function markSquare(e) {
    const arrayIndex = e.target.getAttribute("data-array-index");
    gameboardArray.splice(arrayIndex, 1, game.activePlayer.symbol);
    //remove event listener from clicked square
    e.target.removeEventListener('click',markSquare);
    //redraw board
    drawGameboard();
    game.swapPlayers();
    console.log(game.activePlayer);
  };
  return {};
})();

const game = (() => {
  // declare players
  const playerOne = player('Player 1', 'X');
  const playerTwo = player('Player 2', 'O');
  let activePlayer = playerOne;

  function swapPlayers() {
    activePlayer === playerOne ? activePlayer = playerTwo : activePlayer = playerOne;
    console.log("player switched to "+ activePlayer.symbol);
  }

  return {activePlayer, swapPlayers}
})();

