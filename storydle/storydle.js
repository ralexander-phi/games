var targetWord = null;
var currentGuess = '';

function win() {
  var rows = document.querySelectorAll('div.row');
  var lastRow = rows[rows.length - 1];
  var letters = lastRow.querySelectorAll('span.cell');
  winAnimation(letters, 0)();
}

function winAnimation(letters, i) {
  return function() {
    if (i == 5) {
      var award = document.createElement('div');
      award.classList.add('award');
      award.innerText = '🚀';
      game.appendChild(award);
      setTimeout(function() {
        clear();
        next();
      }, 2000);
    } else {
      letters[i].classList.add('green');
      setTimeout(winAnimation(letters, i+1), 350);
    }
  }
}

function init() {}

var book = "The large elephant has a very small friend, the mouse. The mouse climbs the elephant's trunk. They play together all day and night.";

function clear() {
  // Remove all rows
  document.querySelectorAll('div.row').forEach(e => e.remove());
  document.querySelectorAll('div.award').forEach(e => e.remove());
}

function newGuess() {
  currentGuess = '';
  var row = document.createElement('div');
  row.classList.add('row');
  for (var i = 0; i < 5; i += 1) {
    var span = document.createElement('span')
    span.classList.add('cell');
    span.innerText = '_';
    row.appendChild(span);
  }
  game.appendChild(row);
}

function pickTargetWord() {
  var words = book.match(/\b(\w+)\b/g)
  words = words.filter(word => word.length == 5);
  var choice = words[Math.floor(Math.random() * words.length)];
  return choice.toUpperCase();
}

function next() {
  targetWord = pickTargetWord();
  console.log(targetWord);
  newGuess();
}

function startGame() {
  var story = document.createElement('span');
  story.innerText = book;
  story.classList.add('story');
  document.querySelector('#story').appendChild(story);
  clear();
  next();
}

function makeGuessCallback(then, letters, i) {
  return function() {
    if (i == currentGuess.length) {
      then();
    } else {
      letters[i].innerText = currentGuess[i];
      if (currentGuess[i] == targetWord[i]) {
        letters[i].classList.add('green');
      } else if (targetWord.includes(currentGuess[i])) {
        letters[i].classList.add('yellow');
      } else {
        letters[i].classList.add('dark');
      }

      setTimeout(makeGuessCallback(then, letters, i+1), 450);
    }
  }
}

function makeGuess(then) {
  var rows = document.querySelectorAll('div.row');
  var lastRow = rows[rows.length - 1];
  if (! lastRow) {
    then();
  }
  var letters = lastRow.querySelectorAll('span.cell');
  makeGuessCallback(then, letters, 0)();
}

function renderGuess() {
  var rows = document.querySelectorAll('div.row');
  var lastRow = rows[rows.length - 1];
  if (! lastRow) {
    return;
  }
  var letters = lastRow.querySelectorAll('span.cell');
  for (var i = 0; i < 5; i += 1) {
    if (i < currentGuess.length) {
      letters[i].innerText = currentGuess[i];
    } else {
      letters[i].innerText = '_';
    }
  }
}

document.onkeydown = onKey;

const atoz = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function onKey(e) {
  const k = e.key.toUpperCase();
  if (k == 'ENTER') {
    if (currentGuess.length == 5) {
      var isWin = currentGuess == targetWord;
      if (isWin) {
        win();
      } else {
        makeGuess(newGuess);
      }
    } else {
      // too short, error
      // TODO: do something
    }
  } else if (k == 'BACKSPACE') {
    if (currentGuess.length > 0) {
      // delete last char
      currentGuess = currentGuess.slice(0, currentGuess.length - 1);
      renderGuess();
    }
  } else if (k.length == 1 && atoz.includes(k)) {
    if (currentGuess.length < 5) {
      currentGuess += k;
      renderGuess();
    } else {
      // TODO: do something
    }
  } else {
    // ignore...
  }
}


