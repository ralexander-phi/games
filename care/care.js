var challenges = [
  'Help',
  'Nap',
  'Walk',
  'Music',
  'Art',
  'Craft',
  'De-clutter',
  'Massage',
  'Cook',
  'Hug',
  'Read',
  'Brain dump',
  'Celebrate',
  'Get inspired',
  'Reconnect',
  'Tasty drink',
  'Shower',
  'Floss',
  'Drink water',
  'Excercise',
  'Go outside',
  'Good TV',
  'Meditate',
  'Introspect',
  'Prioritize',
  'Stretch',
  'Breathing',
  'Bed early',
  'Daydream',
  'Watch sports',
  'Bath',
  'Coffee out',
  'Aroma',
];

function toggle(i) {
  return function() {
    squares[i].classList.toggle('complete');
  }
}

function next() {
  var tasks = chooseN(challenges, 24);
  tasks.splice(12, 0, "FREE")

  for (var i = 0; i < squares.length; i += 1) {
    if (i != 12) {
      squares[i].onclick = toggle(i);
    } else {
      squares[i].classList.add('free');
    }
    squares[i].innerHTML = tasks[i];
  }
}

function init() {
  SIDE_LEN = 5;
}

function start() {}

