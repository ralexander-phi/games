var happyFaces = ['😀', '😄', '😁', '🤩', '🙂'];
var sadFaces = ['😒', '😩', '😠', '😦', '😞'];
var winFace = '😍';

var currHappy = null;
var currSad = null;

function onClick(i) {
  return function() {
    if (squares[i].classList.contains('sad')) {
      squares[i].classList.remove('sad');
      squares[i].classList.add('happy');
      squares[i].innerText = currHappy;
    } else if (squares[i].classList.contains('happy')) {
      squares[i].classList.remove('happy');
      squares[i].classList.add('sad');
      squares[i].innerText = currSad;
    }
    checkAllHappy();
  }
}

function checkAllHappy() {
  var allSad = true;
  var allHappy = true;
  
  for (var i = 0; i < squares.length; i += 1) {
    if (squares[i].classList.contains('sad')) {
      // someone is still sad
      allHappy = false;
    }
    if (squares[i].classList.contains('happy')) {
      // someone is still sad
      allSad = false;
    }
  }

  // Success!
  if (allHappy || allSad) {
    win();
  }
}

function win() {
  for (var i = 0; i < squares.length; i += 1) {
    squares[i].innerText = winFace;
    squares[i].classList.add('win');
    squares[i].classList.remove('happy');
    squares[i].classList.remove('sad');
  }
  window.setTimeout(next, 2000);
}

function next() {
  // Reset
  for (var i = 0; i < squares.length; i += 1) {
    squares[i].innerHTML = '&nbsp;';
    squares[i].classList.remove('happy');
    squares[i].classList.remove('sad');
    squares[i].classList.remove('win');
  }

  var happyCount = randInt(2, 7);
  var sadCount = randInt(2, 7);

  currHappy = randArrItem(happyFaces);
  currSad = randArrItem(sadFaces);

  var places = range(SIDE_LEN * SIDE_LEN);

  for (var i = 0; i < happyCount; i += 1) {
    var place = randArrItem(places);
    places = arrayRemove(places, place);
    squares[place].innerText = currHappy;
    squares[place].classList.add('happy');
  }
  for (var i = 0; i < sadCount; i += 1) {
    var place = randArrItem(places);
    places = arrayRemove(places, place);
    squares[place].innerText = currSad;
    squares[place].classList.add('sad');
  }
}

function init() {
  SIDE_LEN = 4;
  onClickSquare = onClick;
}

function start() {}

