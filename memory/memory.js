FRUIT = ['🥕', '🍇', '🍉', '🍊', '🍋', '🍌', '🍍', '🍎', '🍏', '🍐', '🍒', '🍓', '🥝'];
VEGES = ['🥑', '🍆', '🥔', '🥕', '🌽', '🌶', '🥦', '🍄'];
PREP = ['🍞', '🥐', '🥖', '🥨', '🍕', '🌭', '🌮', '🥗'];

var lastSquare = -1;
var clearing = false;
var WIN_TEXT = '🏅';

function next() {
  var thingSet = randArrItem([FRUIT, VEGES, PREP]);
  var things = chooseN(thingSet, SIDE_LEN*SIDE_LEN/2);

  // Add each thing 2x
  var list = things.concat(things);
  
  for (var i = 0; i < squares.length; i += 1) {
    var thing = randArrItem(list);
    list = arrayRemoveOnce(list, thing);
    squares[i].innerHTML = '&nbsp;';
    squares[i].thing = thing;
    squares[i].classList.remove('found');
  }
  clearing = false;
}

function checkWin() {
  var win = true;
  for (var i = 0; i < squares.length; i += 1) {
    if (!squares[i].classList.contains('found')) {
      win = false;
    }
  }
  lastSquare = -1;
  if (win) {
    for (var i = 0; i < squares.length; i += 1) {
      squares[i].classList.remove('found');
      squares[i].innerText = WIN_TEXT;
    }
    setTimeout(next, 2000);
  } else {
    clearing = false;
  }
}

function clearSquares(a, b) {
  return function() {
    lastSquare = -1;
    squares[a].innerHTML = '&nbsp;';
    squares[b].innerHTML = '&nbsp;';
    clearing = false;
  }
}

function onClick(i) {
  return function() {
    if (clearing) { return; }
    if (squares[i].classList.contains('found')) { return; }

    if (lastSquare == -1) {
      squares[i].innerText = squares[i].thing;
      lastSquare = i;
    } else if (lastSquare == i) {
      lastSquare = -1;
      squares[i].innerHTML = '&nbsp;';
    } else {
      clearing = true;
      squares[i].innerText = squares[i].thing;
      if (squares[lastSquare].thing == squares[i].thing) {
        squares[lastSquare].classList.add('found');
        squares[i].classList.add('found');
        checkWin();
      } else {
        setTimeout(clearSquares(i, lastSquare), 2000);
      }
    }
  }
}

function init() {
  SIDE_LEN = 4;
  onClickSquare = onClick;
}

function start() {}

