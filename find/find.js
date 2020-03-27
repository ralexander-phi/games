var pig = '🐖';
var nonPigs = ['🌱','🌲','🌳','🌴','🌵','🌾','🌿','🏔'];

var lastNonPig = null;
var lastPigPos = -1;

function notThePig(i) {
  return function() {
    squares[i].innerHTML = '&nbsp;';
    squares[i].classList.add('empty');
  }
}

function next() {
  var nonPig;
  var pigIdx;

  while ((nonPig = randArrItem(nonPigs)) == lastNonPig);
  while ((pigIdx = randInt(0, squares.length-1)) == lastPigPos);
  lastNonPig = nonPig;
  lastPigPos = pigIdx;

  for (var i = 0; i < squares.length; i += 1) {
    squares[i].classList.remove('empty');
    if (i == pigIdx) {
      squares[i].innerHTML = pig;
      squares[i].onclick = next;
    } else {
      squares[i].innerHTML = nonPig;
      squares[i].onclick = notThePig(i);
    }
  }
}

function init() {
  SIDE_LEN = 5;
}

function start() {}

