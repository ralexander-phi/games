var buttons = [];
var answer = -1;
var lastAnswer = -1;
var things = ['😁', '🤖', '👶', '🦍', '🐺', '🦁', '🐴', '🦄', '🦓', '🐷', '🐰'];
var lastThing = null;

function onClickButton(i) {
  return function() {
    if (answer == i) {
      next();
    } else {
      buttons[i-1].classList.add('wrong');
    }
  }
}

function init() {
  SIDE_LEN = 3;
  onClickSquare = onCount;
}
  
function start() {
  var answerDiv = document.createElement('div');
  for (var i = 1; i < (squares.length+1); i += 1) {
      var button = document.createElement('span');
      button.innerText = i;
      button.classList.add('button');
      button.onclick = onClickButton(i);
      answerDiv.appendChild(button);
      buttons.push(button);
  }
  game.appendChild(answerDiv);
}

function onCount(i) {
  return function() {
    if (squares[i].classList.contains('counted')) {
      squares[i].classList.remove('counted');
    } else {
      squares[i].classList.add('counted');
    }
  }
}

function next() {
  // Reset
  for (var i = 0; i < squares.length; i += 1) {
    squares[i].innerHTML = '&nbsp;';
    squares[i].classList.remove('counted');
    squares[i].classList.add('empty');
  }

  for (var i = 0; i < buttons.length; i += 1) {
    buttons[i].classList.remove('wrong');
  }

  var thing = null;
  while ((answer = randInt(1, squares.length)) == lastAnswer);
  lastAnswer = answer;
  while ((thing = randArrItem(things)) == lastThing);
  lastThing = thing;

  var places = range(squares.length);

  for (var i = 0; i < answer; i += 1) {
    var place = randArrItem(places);
    places = arrayRemove(places, place);
    squares[place].innerHTML = thing;
    squares[place].classList.remove('empty');
  }
}

