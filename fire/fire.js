window.addEventListener('load', function () {
  var header = document.getElementById('header');
  var game = document.getElementById('game');
  var squares = [];
  var fire = '🔥';
  var water = '💧';
  var winLogos = ['🚒', '👩‍🚒', '👨‍🚒', '🧯'];

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

  function makeSquares(sideLen) {
    for (var i = 0; i < sideLen; i += 1) {
        var div = document.createElement('div');
        div.classList.add('row');
        for (var j = 0; j < sideLen; j += 1) {
            var span = document.createElement('span');
            span.classList.add('cell');
            span.addEventListener('mouseover', onHover(squares.length));
            squares.push(span);
            div.appendChild(span);
        }
        game.appendChild(div);
     }
  }

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
    for (var i = 0; i < squares.length; i += 1) {
      squares[i].innerText = randArrItem(winLogos);
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

    var places = [];
    for (var i = 0; i < squares.length; i += 1) {
      places.push(i);
    }

    for (var i = 0; i < fireCount; i += 1) {
      var place = randArrItem(places);
      places = arrayRemove(places, place);
      squares[place].innerText = fire;
      squares[place].classList.add('fire');
    }
  }

  function startGame() {
    makeSquares(8);
    next();
  }
  
  startGame();
});

