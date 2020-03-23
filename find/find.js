window.addEventListener('load', function () {
  var header = document.getElementById('header');
  var game = document.getElementById('game');
  var squares = [];
  var pig = '🐖';
  var nonPigs = ['🌱','🌲','🌳','🌴','🌵','🌾','🌿','🏔','⛰','🏢'];

  function randInt(min, max) {
    return Math.floor(Math.random() * (max-min+1)) + min;
  }

  function randArrItem(arr) {
    return arr[randInt(0, arr.length-1)];
  }

  function makeSquares(sideLen) {
    for (var i = 0; i < sideLen; i += 1) {
        var div = document.createElement('div');
        div.classList.add('row');
        for (var j = 0; j < sideLen; j += 1) {
            var span = document.createElement('span');
            span.classList.add('cell');
            span.classList.add('rotate');
            squares.push(span);
            div.appendChild(span);
        }
        game.appendChild(div);
     }
  }

  function foundPig() {
    next();
  }

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
            squares[i].onclick = foundPig;
        } else {
            squares[i].innerHTML = nonPig;
            squares[i].onclick = notThePig(i);
        }
    }
  }

  function startGame() {
    makeSquares(5);
    next();
  }
  
  startGame();
});

