var fire = '🔥';
var water = '💧';
var winLogos = ['🚒', '👩‍🚒', '👨‍🚒', '🧯'];
var winAltLogos = ['🎉', '💯', '🙌', '⭐'];

function onHover(i) {
  return function() {
    if (squares[i].classList.contains('win')) {
      return;
    }
    squares[i].classList.remove('fire');
    squares[i].innerText = water;
    checkAllSafe();
  }
}

function checkAllSafe() {
  for (var i = 0; i < squares.length; i += 1) {
    if (squares[i].classList.contains('fire')) {
      return;
    }
    if (squares[i].classList.contains('win')) {
      return;
    }
  }

  // Success!
  win();
}

function win() {
  var winItem = randArrItem(winLogos);
  var winItem2 = randArrItem(winAltLogos);
  for (var i = 0; i < squares.length; i += 1) {
    if (i % 5 == 0) {
      squares[i].innerText = winItem;
    } else if (i % 5 == 2) {
      squares[i].innerText = winItem2;
    } else {
      squares[i].innerHTML = '&nbsp;';
    }
    squares[i].classList.add('win');
  }

  window.setTimeout(next, 2000);
}

function next() {
  // Reset
  for (var i = 0; i < squares.length; i += 1) {
    squares[i].innerHTML = '&nbsp;';
    squares[i].classList.remove('fire');
    squares[i].classList.remove('win');
  }

  var fireCount = randInt(2, 30);
  var places = range(squares.length);
  for (var i = 0; i < fireCount; i += 1) {
    var place = randArrItem(places);
    places = arrayRemove(places, place);
    squares[place].innerText = fire;
    squares[place].classList.add('fire');
  }
}

function init() {
  SIDE_LEN = 8;
  onHoverSquare = onHover;
}

function start() {}

