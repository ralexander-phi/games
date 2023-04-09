var level = 1;
var isPlaying = false;

function setupBoard() {
  
  const SIZE = 15;

  for (var row = 0; row < SIZE; row += 1) {
    var rowDiv = document.createElement("div");
    game.appendChild(rowDiv);
    for (var col = 0; col < SIZE; col += 1) {
      var colSpan = document.createElement("span");
      rowDiv.appendChild(colSpan);

      if (row == 1 && col == 1) {
        colSpan.classList.add("start");
        colSpan.onmouseover = onTouchStart;
      }

      if (row == SIZE-2 && col == SIZE-2) {
        colSpan.classList.add("end");
        colSpan.onmouseover = onTouchEnd;
      }

      var isWall = false;
      if (row == 0 || row == SIZE-1) {
        isWall = true;
      }
      if (col == 0 || col == SIZE-1) {
        isWall = true;
      }

      if (row % 2 == 0) {
        if (row % 4 == 0) {
          if (col > 1) {
            isWall = true;
          }
        } else {
          if (col < SIZE - 2) {
            isWall = true;
          }
        }
      }
      if (isWall) {
        colSpan.classList.add("wall");
        colSpan.onmouseover = onTouchWall;
      }
    }
  }
}


function onTouchEnd() {
  if (isPlaying) {
    isPlaying = false;

    if (level < 5) {
      level += 1;
      game.classList.remove("level-1");
      game.classList.remove("level-2");
      game.classList.remove("level-3");
      game.classList.remove("level-4");
      game.classList.remove("level-5");
      game.classList.add("level-" + level);

      game.classList.add("restart");
      game.classList.remove("play");
    } else {
      // win!
      console.log("WIN");

      // reset...
      onTouchWall();
    }
  }
}

function onTouchStart() {
  if (! isPlaying) {
    isPlaying = true;
    game.classList.add("play");
    game.classList.remove("restart");
  }
}

function onTouchWall() {
  if (isPlaying) {
    isPlaying = false;
    level = 1;

    game.classList.add("restart");
    game.classList.remove("play");

    game.classList.add("level-1");
    game.classList.remove("level-2");
    game.classList.remove("level-3");
    game.classList.remove("level-4");
    game.classList.remove("level-5");
  }
}

function startGame() {
  var game = document.getElementById('game');
  game.classList.add("restart");
  game.classList.add("level-1");
  setupBoard();
}

