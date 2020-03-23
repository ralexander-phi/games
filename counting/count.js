window.addEventListener('load', function () {
  var header = document.getElementById('header');
  var game = document.getElementById('game');
  var squares = [];
  var buttons = [];
  var answer = -1;
  var things = ['😁', '🤖', '👶', '🦍', '🐺', '🦁', '🐴', '🦄', '🦓', '🐷', '🐰'];
  var lastThing = null;

  function randInt(min, max) {
    return Math.floor(Math.random() * (max-min+1)) + min;
  }

  function randArrItem(arr) {
    return arr[randInt(0, arr.length-1)];
  }

  function onClickButton(i) {
    return function() {
      if (answer == i) {
        next();
      } else {
        buttons[i-1].classList.add('wrong');
      }
    }
  }

  function makeSquares(sideLen) {
    for (var i = 0; i < sideLen; i += 1) {
        var div = document.createElement('div');
        div.classList.add('row');
        for (var j = 0; j < sideLen; j += 1) {
            var span = document.createElement('span');
            span.classList.add('cell');
            span.onclick = onCount(squares.length);
            squares.push(span);
            div.appendChild(span);
        }
        game.appendChild(div);
     }

     var answerDiv = document.createElement('div');
     for (var i = 1; i < 10; i += 1) {
         var button = document.createElement('span');
         button.innerText = i;
         button.classList.add('button');
         button.onclick = onClickButton(i);
         answerDiv.appendChild(button);
         buttons.push(button);
     }
     game.appendChild(answerDiv);
  }

  function arrayRemove(arr, value) {
    return arr.filter(function(e){
      return e != value;
    });
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
    answer = randInt(1, 5);
    while ((thing = randArrItem(things)) == lastThing);
    lastThing = thing;

    var places = [0,1,2,3,4,5,6,7,8];


    for (var i = 0; i < answer; i += 1) {
      var place = randArrItem(places);
      places = arrayRemove(places, place);
      squares[place].innerHTML = thing;
      squares[place].classList.remove('empty');
    }
  }

  function startGame() {
    makeSquares(3);
    next();
  }
  
  startGame();
});

