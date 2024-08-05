const btnCommence = document.getElementById("playBtn");
const btnSuspend = document.getElementById("pauseBtn");

const mainAudio = new Audio("./audio/type.mp3");
const clearLineAudio = new Audio("./audio/clear.mp3");
const themeAudio = new Audio("./audio/Tetris Theme Song.mp3");

function playClearLineAudio() {
  clearLineAudio.play();
}

function playMainAudio() {
  mainAudio.play();
}

function startThemeAudio() {
  themeAudio.loop = true;
  themeAudio.play();
}

function disableThemeAudio() {
  themeAudio.pause();
}



const IShape = [
  [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  [
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0],
  ],
  [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
  ],
  [
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
  ],
];

const JShape = [
  [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  [
    [0, 1, 1],
    [0, 1, 0],
    [0, 1, 0],
  ],
  [
    [0, 0, 0],
    [1, 1, 1],
    [0, 0, 1],
  ],
  [
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 0],
  ],
];

const LShape = [
  [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
  [
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 1],
  ],
  [
    [0, 0, 0],
    [1, 1, 1],
    [1, 0, 0],
  ],
  [
    [1, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
  ],
];

const OShape = [
  [
    [0, 0, 0, 0],
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
  ],
];

const SShape = [
  [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  [
    [0, 1, 0],
    [0, 1, 1],
    [0, 0, 1],
  ],
  [
    [0, 0, 0],
    [0, 1, 1],
    [1, 1, 0],
  ],
  [
    [1, 0, 0],
    [1, 1, 0],
    [0, 1, 0],
  ],
];

const CShape = [
  [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  [
    [0, 1, 0],
    [0, 1, 1],
    [0, 1, 0],
  ],
  [
    [0, 0, 0],
    [1, 1, 1],
    [0, 1, 0],
  ],
  [
    [0, 1, 0],
    [1, 1, 0],
    [0, 1, 0],
  ],
];

const CZShape = [
  [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  [
    [0, 0, 1],
    [0, 1, 1],
    [0, 1, 0],
  ],
  [
    [0, 0, 0],
    [1, 1, 0],
    [0, 1, 1],
  ],
  [
    [0, 1, 0],
    [1, 1, 0],
    [1, 0, 0],
  ],
];

// Game settings
let currentRow = (setLine = 0);
const ROW_COUNT = (setRow = 20);
const COLUMN_COUNT = (setColumn = 10);
const SQR_V = (squareSize = 20);
const EMPTY_V = "white"; 

// Canvas and context
const canvaGame = document.getElementById("gameCanva");
const mainCanvasContext = canvaGame.getContext("2d");

// DOM elements
const scoreBox = document.getElementById("score");
const lineElement = document.getElementById("line");

// draw a square
function drawSquare(xPos, yPos, squareColor) {
  mainCanvasContext.fillStyle = squareColor;
  mainCanvasContext.fillRect(xPos * SQR_V, yPos * SQR_V, SQR_V, SQR_V);

  mainCanvasContext.strokeStyle = "white";
  mainCanvasContext.strokeRect(xPos * SQR_V, yPos * SQR_V, SQR_V, SQR_V);
}

//drawing piece for next tetromino
const subCanvas = document.getElementById("showBox");
const canvasContext2 = subCanvas.getContext("2d");

const NUM_ROWS = (defRows = 4);
const NUM_COLS = (defCols = 4);
const NUM_SQTS = (defSQrs = 20);
const EMPTY_COL = (emptColor = "white"); 

// using x and y coordinate draw a square and speIShapefy a color
const drawSquaresOnCanvas = (xPos, yPos, colorN) => {
  canvasContext2.fillStyle = colorN;
  canvasContext2.fillRect(
    xPos * NUM_SQTS,
    yPos * NUM_SQTS,
    NUM_SQTS,
    NUM_SQTS
  );

  canvasContext2.strokeStyle = "white";
  canvasContext2.strokeRect(
    xPos * NUM_SQTS,
    yPos * NUM_SQTS,
    NUM_SQTS,
    NUM_SQTS
  );
};

const PIECES = [
  [CZShape, "red"],
  [SShape, "green"],
  [CShape, "purple"],
  [OShape, "yellow"],
  [LShape, "orange"],
  [IShape, "cyan"],
  [JShape, "blue"],
];

let theGameStatus = false;

btnCommence.addEventListener("click", () => {
  if (!theGameStatus) {
    theGameStatus = true;
    document.addEventListener("keydown", controller);
    btnCommence.disabled = true;
    btnSuspend.disabled = false;
    // cal the function to start the game
    startThemeAudio();
    descendPiece();
  }
});

btnSuspend.addEventListener("click", () => {
  if (theGameStatus) {
    theGameStatus = false;
    btnCommence.disabled = false;
    btnSuspend.disabled = true;
    document.removeEventListener("keydown", controller);
    disableThemeAudio();
    // call the function to Pause the game
    disableAnimation();
  }
});



// create the game board
let gameMap = [];
for (row = 0; row < ROW_COUNT; row++) {
  gameMap[row] = [];
  for (col = 0; col < COLUMN_COUNT; col++) {
    gameMap[row][col] = EMPTY_V;
  }
}

function renderGameBoard() {
  for (row = 0; row < ROW_COUNT; row++) {
    for (col = 0; col < COLUMN_COUNT; col++) {
      drawSquare(col, row, gameMap[row][col]);
    }
  }
}

renderGameBoard();

// object piece
function pieceGenerator() {
  let rw = (randomN = Math.floor(Math.random() * PIECES.length)); // 0 -> 6
  flow = new Piece(PIECES[rw][0], PIECES[rw][1]);
  return flow;
}

// Create an empty 2D array for the next tetrimino board
let previewShapes = [];
for (let row = 0; row < NUM_ROWS; row++) {
  previewShapes[row] = [];
  for (let col = 0; col < NUM_COLS; col++) {
    previewShapes[row][col] = EMPTY_COL;
  }
}

// Draw the next tetrimino board
function drawNextShapeBoard() {
  for (let row = 0; row < NUM_ROWS; row++) {
    for (let col = 0; col < NUM_COLS; col++) {
      drawSquaresOnCanvas(col, row, previewShapes[row][col]);
    }
  }
}

// Function to display the next tetrimino shape
function displayNextShape(pieceQueue) {
  // Clear the next tetrimino board
  for (let row = 0; row < NUM_ROWS; row++) {
    for (let col = 0; col < NUM_COLS; col++) {
      previewShapes[row][col] = EMPTY_COL;
    }
  }
  // Draw the next tetrimino shape on the board
  for (let row = 0; row < pieceQueue.tetromino[pieceQueue.shapeN].length; row++) {
    for (
      let col = 0;
      col < pieceQueue.tetromino[pieceQueue.shapeN].length;
      col++
    ) {
      if (pieceQueue.tetromino[pieceQueue.shapeN][row][col]) {
        previewShapes[row][col] = pieceQueue.color;
      }
    }
  }
  drawNextShapeBoard();
}

let upcomingPiece = pieceGenerator();
displayNextShape(upcomingPiece);

let p = pieceGenerator();

function Piece(tetromino, color) {
  this.tetromino = tetromino;
  this.color = color;

  this.shapeN = 0; // we start from the first pattern
  this.activePiece = this.tetromino[this.shapeN];

  // we need to control the pieces
  if (color == "yellow" || color == "cyan") {
    this.x = 3;
    this.y = -1;
  }
  if (color == "green" || color == "red") {
    this.x = 2;
    this.y = -1;
  } else {
    this.x = 3;
    this.y = -1;
  }
}

// fill function
Piece.prototype.fill = function (color) {
  for (row = 0; row < this.activePiece.length; row++) {
    for (col = 0; col < this.activePiece.length; col++) {
      
      if (this.activePiece[row][col]) {
        drawSquare(this.x + col, this.y + row, color);
      }
    }
  }
};

// draw a piece to the board
Piece.prototype.draw = function () {
  this.fill(this.color);
};

Piece.prototype.erase = function () {
  this.fill(EMPTY_V);
};

p.draw();

let gameScore = 0;

// move piece down
Piece.prototype.movePieceDown = function () {
  if (!this.collision(0, 1, this.activePiece)) {
    this.erase();
    this.y++;
    this.draw();
   
  } else {
    // we lock the piece and generate a new one
    p = upcomingPiece;

    this.securePiece();
    upcomingPiece = pieceGenerator();
    displayNextShape(upcomingPiece);
  }

};

// move Right the piece
Piece.prototype.shiftRight = function () {
  if (!this.collision(1, 0, this.activePiece)) {
    this.erase();
    this.x++;
    this.draw();
  }
};

// move Left the piece
Piece.prototype.shiftShapeLeft = function () {
  if (!this.collision(-1, 0, this.activePiece)) {
    this.erase();
    this.x--;
    this.draw();
  }
};

// rotate the piece
Piece.prototype.spinShape = function () {
  let nextPatternToDisplay =
    this.tetromino[(this.shapeN + 1) % this.tetromino.length];
  let executeKick = 0;

  if (this.collision(0, 0, nextPatternToDisplay)) {
    if (this.x > COLUMN_COUNT / 2) {
      // it's the right wall
      executeKick = -1; // we need to move the piece to the left
    } else {
      // it's the left wall
      executeKick = 1; // we need to move the piece to the right
    }
  }

  if (!this.collision(executeKick, 0, nextPatternToDisplay)) {
    this.erase();
    this.x += executeKick;
    this.shapeN = (this.shapeN + 1) % this.tetromino.length; // (0+1)%4 => 1
    this.activePiece = this.tetromino[this.shapeN];
    this.draw();
  }
};

Piece.prototype.securePiece = function () {
  for (r = 0; r < this.activePiece.length; r++) {
    for (c = 0; c < this.activePiece.length; c++) {
      // we skip the vacant squares
      if (!this.activePiece[r][c]) {
        continue;
      }
      // pieces to lock on top = game over
      if (this.y + r < 0) {
        alert("Game Over");
        disableThemeAudio();
        window.location.reload(true);
        // stop request animation frame
        disableAnimation();
        gameOver = true;
        break;
      }
      // we lock the piece
      gameMap[this.y + r][this.x + c] = this.color;
    }
  }
  // remove full rows
  for (r = 0; r < ROW_COUNT; r++) {
    let isRowFull = true;
    for (c = 0; c < COLUMN_COUNT; c++) {
      isRowFull = isRowFull && gameMap[r][c] != EMPTY_V;
    }
    if (isRowFull) {
      // if the row is full
      // we move down all the rows above it
      for (y = r; y > 1; y--) {
        for (c = 0; c < COLUMN_COUNT; c++) {
          gameMap[y][c] = gameMap[y - 1][c];
        }
      }
      // the top row board[0][..] has no row above it
      for (c = 0; c < COLUMN_COUNT; c++) {
        gameMap[0][c] = EMPTY_V;
      }
      // increment the score
      currentRow += 1;
      playClearLineAudio();
    }
  }

  // call function to update the game board
  renderGameBoard();

  // update the score
  lineElement.innerHTML = currentRow;
};

// collision function
Piece.prototype.collision = function (xCoord_, yCoord_, currentPiece) {
  for (r = 0; r < currentPiece.length; r++) {
    for (c = 0; c < currentPiece.length; c++) {
      // if the square is empty, we skip it
      if (!currentPiece[r][c]) {
        continue;
      }
      // coordinates of the Piece after movement
      let newX = this.x + c + xCoord_;
      let newY = this.y + r + yCoord_;

      // conditions
      if (newX < 0 || newX >= COLUMN_COUNT || newY >= ROW_COUNT) {
        return true;
      }
      // skip newY < 0; board[-1] will crush our game
      if (newY < 0) {
        continue;
      }
      // check if there is a locked Piece alrady in place
      if (gameMap[newY][newX] != EMPTY_V) {
        return true;
      }
    }
  }
  return false;
};

// hard drop function drop piece instantlly to board
Piece.prototype.quickDrop = function () {
  while (!this.collision(0, 1, this.activePiece)) {
    this.erase();
    this.y++;
    this.draw();
  }

  this.securePiece();
  playMainAudio();
};

let haltAnimation;

// control piece key function
// document.addEventListener("keydown",controller);
function controller(trigger) {
  if (trigger.keyCode == 37 || trigger.keyCode == 52) {
    playMainAudio();
    p.shiftShapeLeft();
    dropInitiate = Date.now();
  } else if (
    trigger.keyCode == 38 ||
    trigger.keyCode == 49 ||
    trigger.keyCode == 53 ||
    trigger.keyCode == 57
  ) {
    playMainAudio();
    p.spinShape();
    dropInitiate = Date.now();
  } else if (trigger.keyCode == 39 || trigger.keyCode == 54) {
    playMainAudio();
    p.shiftRight();
    dropInitiate = Date.now();
  } else if (trigger.keyCode == 40 || trigger.keyCode == 56) {
    gameScore += 1;
    playMainAudio();
    p.movePieceDown();
  } else if (trigger.keyCode == 80) {
    if (theGameStatus == true) {
      theGameStatus = false;
      btnCommence.disabled = false;
      btnSuspend.disabled = true;

      disableThemeAudio();
      disableAnimation();
    } else {
      theGameStatus = true;
      btnCommence.disabled = true;
      btnSuspend.disabled = false;

      startThemeAudio();
      descendPiece();
    }
  } else if (trigger.keyCode == 32) {
    p.quickDrop();
    gameScore += 12;
  } else if (trigger.keyCode == 27) {
    window.close();
  }
  scoreBox.innerHTML = gameScore;
}

let dropInitiate = Date.now();

function descendPiece() {
  let currentTime = Date.now();
  let delta = currentTime - dropInitiate;

  if (delta > 1000) {
    p.movePieceDown();
    dropInitiate = Date.now();
  }

  haltAnimation = requestAnimationFrame(descendPiece);
}

function disableAnimation() {
  cancelAnimationFrame(haltAnimation);
}

function startAnimation() {
  if (!animationFrameId) {
    draw(); // Start the animation
  }
}