var squares = [];

// Override these
var SIDE_LEN = -1;
var onHoverSquare = null;
var onClickSquare = null

function randInt(min, max) {
  return Math.floor(Math.random() * (max-min+1)) + min;
}

function randArrItem(arr) {
  return arr[randInt(0, arr.length-1)];
}

function arrayRemove(arr, value) {
  return arr.filter(function(e){
    return e != value;
  });
}

function randBool() {
  return Math.random() < 0.5;
}

function atLeftSide(idx, sideLen) {
  return idx % sideLen == 0;
}

function atRightSide(idx, sideLen) {
  return idx % sideLen == sideLen -1;
}

function atTop(idx, sideLen) {
  return idx < sideLen;
}

function atBottom(idx, sideLen) {
  return idx >= (sideLen*(sideLen-1));
}

function allNeighbors(idx, sideLen, includeDiag=false) {
  var n = [];

  if (!atLeftSide(idx, sideLen)) {
    n.push(idx - 1);
    if (includeDiag) {
      if (!atTop(idx, sideLen)) {
        n.push(idx - 1 - sideLen);
      }
      if (!atBottom(idx, sideLen)) {
        n.push(idx - 1 + sideLen);
      }
    }
  }

  if (!atRightSide(idx, sideLen)) {
    n.push(idx + 1);
    if (includeDiag) {
      if (!atTop(idx, sideLen)) {
        n.push(idx + 1 - sideLen);
      }
      if (!atBottom(idx, sideLen)) {
        n.push(idx + 1 + sideLen);
      }
    }
  }

  if (!atTop(idx, sideLen)) {
    n.push(idx - sideLen);
  }
  if (!atBottom(idx, sideLen)) {
    n.push(idx + sideLen);
  }

  return n;
}

function randomNeighbor(idx, sideLen) {
  return randArrItem(allNeighbors(idx, sideLen));
}

function chooseN(arr, n) {
  var r = [];
  for (var i = 0; i < n; i += 1) {
    var v = randArrItem(arr);
    arr = arrayRemoveOnce(arr, v);
    r.push(v);
  }
  return r;
}

// Insecure 32bit hash
function fastHash(s) {
  var hash = 0;
  for (var i = 0, len = s.length; i < len; i++) {
    var chr = s.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return hash;
}

function chooseNForToday(arr, n) {
  var now = new Date()
  // Seed with the current date, in the current timezone
  var seed = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toJSON().slice(0, 10)
  var offset = fastHash(seed);

  var r = [];
  for (var i = 0; i < n; i += 1) {
    var v = arr[Math.abs(offset % arr.length)];
    arr = arrayRemoveOnce(arr, v);
    r.push(v);
    seed += 'x';
    offset += fastHash(seed);
  }
  return r;
}

function arrayRemoveOnce(arr, value) {
  var r = [];
  var removed = false;
  for (var i = 0; i < arr.length; i += 1) {
    if (arr[i] == value && !removed) {
      removed = true;
    } else {
      r.push(arr[i]);
    }
  }
  return r;
}

function range(count) {
  var a = [];
  for (var i = 0; i < count; i += 1) {
    a.push(i);
  }
  return a;
}

function makeSquares() {
  for (var i = 0; i < SIDE_LEN; i += 1) {
      var div = document.createElement('div');
      div.classList.add('row');
      for (var j = 0; j < SIDE_LEN; j += 1) {
          var span = document.createElement('span');
          span.classList.add('cell');
          if (onHoverSquare != null) {
            span.addEventListener('mouseover', onHoverSquare(squares.length));
          }
          if (onClickSquare != null) {
            span.onclick = onClickSquare(squares.length);
          }
          squares.push(span);
          div.appendChild(span);
      }
      game.appendChild(div);
   }
}

function startGame() {
  init();
  makeSquares(8);
  start();
  next();
}
  
window.addEventListener('load', function () {
  var header = document.getElementById('header');
  var game = document.getElementById('game');
  startGame();
});

