var pig = '🐖';
var nonPigs = ['🌱','🌲','🌳','🌴','🌵','🌾','🌿','🏔','⛰'];

function notThePig(i) {
  return function() {
    squares[i].innerHTML = '&nbsp';
    squares[i].onclick = false;
    squares[i].classList.add('empty');
  }
}

function next() {
  var nonPig = randArrItem(nonPigs);
  var pigIdx = randInt(0, squares.length-1);
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

