window.addEventListener('load', function () {
  var header = document.getElementById('header');
  var game = document.getElementById('game');
  var squares = [];
  var happyFaces = ['😀', '😄', '😁', '🤩', '🙂'];
  var sadFaces = ['😒', '😩', '😠', '😦', '😞'];
  var winFace = '😍';

  var currHappy = null;
  var currSad = null;

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
            span.onclick = onHover(squares.length);
            squares.push(span);
            div.appendChild(span);
        }
        game.appendChild(div);
     }
  }

  function onHover(i) {
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
    console.log('HERE');
    for (var i = 0; i < squares.length; i += 1) {
      if (squares[i].classList.contains('sad')) {
        // someone is still sad
        return;
      }
    }

    // Success!
    win();
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

    var places = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];

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

  function startGame() {
    makeSquares(4);
    next();
  }
  
  startGame();
});

