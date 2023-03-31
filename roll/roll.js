var tiger = '🐯';
var giraffe = '🦒';
var panda = '🐼';
var monkey = '🐒';
var bunny = '🐇';
var eagle = '🦅';

var dieFaces = ['1️⃣','2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣'];

var giraffeHerd;
var tigerStreak;
var pandaEmbarrassment;
var monkeyTroop;
var bunnyFluffle;
var eagleAerie;
var rollButton;
var winDiv;
var rollView;
var rollViewOuter;

function roll() {
  rollButton.disabled = true;
  rollViewOuter.classList.add("rolling");
  rolling(8);
}

function rolling(stepsLeft) {
  console.log("Rolling " + stepsLeft);
  if (stepsLeft <= 0) {
    endRoll();
  } else {
    rollView.innerText = randArrItem(dieFaces);
    setTimeout(() => {
      rolling(stepsLeft-1);
    }, 400);
  }
}

function endRoll() {
  var child = document.createElement("span");
  child.classList = ['player'];
  var team;
  var player;
  var rollValue = randInt(0, 5);
  var rollFace = dieFaces[rollValue];
  console.log(rollValue);
  console.log(rollFace);
  rollView.innerText = rollFace;
  rollViewOuter.classList.remove("rolling");
  if (0 == rollValue % 6) {
    team = tigerStreak;
    player = tiger;
  } else if (1 == rollValue % 6) {
    team = giraffeHerd;
    player = giraffe;
  } else if (2 == rollValue % 6) {
    team = pandaEmbarrassment;
    player = panda;
  } else if (3 == rollValue % 6) {
    team = monkeyTroop;
    player = monkey;
  } else if (4 == rollValue % 6) {
    team = bunnyFluffle;
    player = bunny;
  } else {
    team = eagleAerie;
    player = eagle;
  }
  child.innerText = player;
  team.appendChild(child);

  children = team.querySelectorAll("span.player");
  console.log(children.length);
  if (children.length >= 3) {
    setTimeout(() => {
      winDiv.innerText = player + " wins!";
      tigerStreak.innerHTML = '&nbsp;';
      giraffeHerd.innerHTML = '&nbsp;';
      pandaEmbarrassment.innerHTML = '&nbsp;';
      monkeyTroop.innerHTML = '&nbsp;';
      bunnyFluffle.innerHTML = '&nbsp;';
      eagleAerie.innerHTML = '&nbsp;';

      setTimeout(() => {
        rollButton.disabled = false;
        rollView.innerText = '';
        winDiv.innerText = '';
      }, 2000);
    }, 1000);
  } else {
    rollButton.disabled = false;
  }
}

function init() {
  rollButton = document.getElementById("rollButton");
  rollButton.onclick = roll;
  tigerStreak = document.getElementById("tiger-streak");
  giraffeHerd = document.getElementById("giraffe-herd");
  pandaEmbarrassment = document.getElementById("panda-embarrassment");
  monkeyTroop = document.getElementById("monkey-troop");
  bunnyFluffle = document.getElementById("bunny-fluffle");
  eagleAerie = document.getElementById("eagle-aerie");
  winDiv = document.getElementById("win");
  rollView = document.getElementById("rollView");
  rollViewOuter = document.getElementById("rollViewOuter");
}

function start() {}
function next() {}
function win() {}

