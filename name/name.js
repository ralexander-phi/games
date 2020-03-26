var started = false;
var name = 'None';
var decoyLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
var winAnimationFrameLen = 70;

function win() {
  setTimeout(winAnimation(0), winAnimationFrameLen);
}

function winAnimation(i) {
  return function() {
    if (i == SIDE_LEN) {
      setTimeout(next, 1000);
      return;
    }
    for (var j = 0; j < SIDE_LEN; j += 1) {
      var pos = j + SIDE_LEN*i;
      if (!squares[pos].classList.contains('name')) {
        squares[pos].innerHTML = '&nbsp;';
      }
      squares[pos].classList.add('win');
      squares[pos].classList.remove('empty');
    }
    setTimeout(winAnimation(i+1), winAnimationFrameLen);
  }
}

function notTheName(i) {
  return function() {
    squares[i].classList.add('empty');
  }
}

function next() {
  if (!started) { return; }

  // First reset everything with decoy letters
  for (var i = 0; i < squares.length; i += 1) {
    squares[i].innerText = randArrItem(decoyLetters);
    ['empty', 'win', 'name', 'hidden'].forEach(function(item, idx) {
      squares[i].classList.remove(item);
    })
    squares[i].onclick = notTheName(i);
  }

  // Decide: Name should be left->right or top->bottom
  var isLeftToRight = Math.random() > 0.5;

  // Pick a starting squares that is name.length from the right or bottom edge
  var maxFarIn = SIDE_LEN - name.length;

  var x;
  var y;
  if (isLeftToRight) {
    x = randInt(0, maxFarIn);
    y = randInt(0, SIDE_LEN-1);
  } else {
    x = randInt(0, SIDE_LEN-1);
    y = randInt(0, maxFarIn);
  }

  // Write the name starting at that squares
  if (isLeftToRight) {
    for (var i = 0; i < name.length; i += 1) {
      var pos = (x+i) + y*SIDE_LEN;
      squares[pos].innerText = name[i];
      squares[pos].onclick = win;
      squares[pos].classList.add('name');
    }
  } else {
    for (var i = 0; i < name.length; i += 1) {
      var pos = x + (y+i)*SIDE_LEN;
      squares[pos].innerText = name[i];
      squares[pos].onclick = win;
      squares[pos].classList.add('name');
    }
  }
}

function init() {
  SIDE_LEN = 8;
}

function onSetName() {
  var form = document.getElementById('form');
  var nameField = document.getElementById('name');
  name = nameField.value.toUpperCase();
  if (name.length < 1) { return; };
  for (var i = 0; i < name.length; i += 1) {
    decoyLetters = arrayRemoveOnce(decoyLetters, name[i]);
  }
  started = true;
  form.parentElement.removeChild(form);
  next();
}

function showForm() {
  var form = document.createElement('form');
  form.setAttribute('id', 'form');
  form.action = '#';
  form.onsubmit = onSetName;
  var nameField = document.createElement('input');
  nameField.type = "text";
  nameField.id = 'name';
  nameField.placeholder = "What is your name?";
  form.appendChild(nameField);
  var submit = document.createElement('input');
  submit.type = "submit";
  submit.value = "Play";
  form.appendChild(submit);
  game.appendChild(form);
}

function start() {
  // Hide grid until name is set
  for (var i = 0; i < squares.length; i += 1) {
    squares[i].classList.add('hidden');
  }
  showForm();
}

