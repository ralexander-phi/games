
var monkey = '🐒';
var banana = '🍌';
var others = ['🌱','🌲','🌳','🌴','🌵','🌿','🏔'];

var lastMonkeyIdx= -1;
var WIN_TEXT = '🍌';

function win() {
  for (var i = 0; i < squares.length; i += 1) {
    if (i != lastMonkeyIdx) {
      squares[i].innerText = WIN_TEXT;
    }
    squares[i].classList.add('flipped');
  }
  window.setTimeout(next, 1500);
}

function next() {
  var monkeyIdx;
  while ((monkeyIdx = randInt(0, squares.length-1)) == lastMonkeyIdx);
  lastMonkeyIdx = monkeyIdx;

  var bananaIdx = allNeighbors(monkeyIdx, SIDE_LEN, includeDiag=true);

  for (var i = 0; i < squares.length; i += 1) {
    squares[i].classList.remove('flipped');
    squares[i].innerHTML = '&nbsp;';
    if (i == monkeyIdx) {
      squares[i].thing = monkey;
      squares[i].classList.add('monkey');
    } else if (bananaIdx.includes(i)) {
      squares[i].thing = banana;
      squares[i].classList.remove('monkey');
    } else {
      squares[i].thing = randArrItem(others);
      squares[i].classList.remove('monkey');
    }
  }
}

function onClick(i) {
  return function() {
    if (!squares[i].classList.contains('flipped')) {
      squares[i].innerHTML = squares[i].thing;
      squares[i].classList.add('flipped');

      if (squares[i].classList.contains('monkey')) {
        setTimeout(win, 1000);
      }
    }
  }
}

function init() {
  SIDE_LEN = 5;
  onClickSquare = onClick;
}

function start() {}

