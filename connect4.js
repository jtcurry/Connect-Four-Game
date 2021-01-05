/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

 
let WIDTH = 7;
let HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

//** makeBoard: set "board" to empty HEIGHT x WIDTH matrix array
const makeBoard = () => {
  for (let y = 0; y < HEIGHT; y++) {
    board.push(Array.from({ length: WIDTH })); //{length: WIDTH} creates an object with undef values and length of WIDTH
  }
  return board;
};

//** makeHtmlBoard: makes HTML table and row of column tops
const makeHtmlBoard = () => {
  const htmlBoard = document.getElementById("board");
  //create a top row of WIDTH cells wide each with an id attribute of its X(width) position
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);
  //create HEIGHT number of rows, each with WIDTH number of cells that have an id attribute of their position (y-x)
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
};

//** findSpotForCol: given column x, return top empty y (null if filled)
const findSpotForCol = (x) => {
  for (let i = HEIGHT - 1; i >= 0; i--) {
    if (!board[i][x]) {
      return i;
    }
  }
  return null;
};

//** placeInTable: update DOM to place piece into HTML table of board
const placeInTable = (y, x) => {
  const selectedCell = document.getElementById(`${y}-${x}`);
  const pieceDiv = document.createElement("div");
  pieceDiv.classList.add("piece", `p${currPlayer}`);
  selectedCell.append(pieceDiv);
};

//** endGame: announce game end
const endGame = (msg) => {
  alert(msg);
};

//** handleClick: handle click of column top to play piece
const handleClick = (evt) => {
  // get x from ID of clicked cell
  const x = +evt.target.id;
  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }
  //update board array
  board[y][x] = currPlayer;
  //update DOM
  placeInTable(y, x);
  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
    //check for tie
  } else if (board.every((arr) => arr.every((value) => value !== undefined))) {
    return endGame("It's a tie!");
  }
  //switch currPlayer 1 <-> 2
  currPlayer === 1 ? (currPlayer = 2) : (currPlayer = 1);
};

//** checkForWin: check board cell-by-cell for "does a win start here?"
const checkForWin = () => {
  function _win(cells) {
    // Check four cells to see if they're all valid cells and color of current player
    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }
  // Iterate through entire board selecting horiz, vert, diagonal groups of four cells
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const horiz = [
        [y, x],
        [y, x + 1],
        [y, x + 2],
        [y, x + 3],
      ];
      const vert = [
        [y, x],
        [y + 1, x],
        [y + 2, x],
        [y + 3, x],
      ];
      const diagDR = [
        [y, x],
        [y + 1, x + 1],
        [y + 2, x + 2],
        [y + 3, x + 3],
      ];
      const diagDL = [
        [y, x],
        [y + 1, x - 1],
        [y + 2, x - 2],
        [y + 3, x - 3],
      ];
      // Check current group of four cells to see if they are valid and of the same player
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
};

makeBoard();
makeHtmlBoard();
