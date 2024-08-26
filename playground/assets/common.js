const SPEED = 100;

const Globals = {};

const ParentState = {
  AWAY: "Away",
  WAITING: "Waiting",
  HUGGING: "Hugging",
  CALLING: "Calling",
  FRUSTRATED: "Frustrated",
  ONE_LAST_THING: "One last thing",
  TIME_TO_GO: "Time to go",
  OVERTIME: "Over time",
  TOO_LONG: "Too long",
};

const PlayerState = {
  RUNNING: "Running",
  SWIMMING: "Swimming",
  SLIDING: "Sliding",
  SPINNING: "Spinning",
};

class Entity {
  constructor() {
    this.stateChangedAt = 0;
  }

  changeState(newState, time) {
    console.log(newState, time);
    this.state = newState;
    for (var cb of this.onStateChangeCallbacks) {
      cb(this, newState);
    }
    this.stateChangedAt = time;
  }

  addCallback(cb) {
    this.onStateChangeCallbacks.push(cb);
  }

  waitExceeded(time, limitSeconds) {
    var remaining = limitSeconds - (this.timeInState(time) / 1000);
    return remaining < 0;
  }

  timeInState(time) {
    return time - this.stateChangedAt;
  }
}

class Score {
  constructor(game) {
    const urlParams = new URLSearchParams(window.location.search);
    this.score = Number(urlParams.get('score')) || 0;
    this.scoreText = game.add.text(
      20,
      20,
      '' + this.score,
      {
        fontSize: "5em",
        backgroundColor: "#333",
        padding: { "x": 10, "y": 5 },
      },
    );
  }

  updateScore(amount) {
    this.score += amount;
    this.scoreText.text = "" + this.score;
    if (amount > 0) {
      this.scoreText.style.backgroundColor = "#333";
    } else {
      this.scoreText.style.backgroundColor = "#622";
    }

    // Loss
    if (this.score <= 0) {
      Globals.parentObj.changeState(ParentState.TIME_TO_GO, 0);
    }
  }
}

class BaseActivity {
  constructor(
    activityState,
    activationX,
    activationY,
    distX,
    distY,
  ) {
    this.activityState = activityState;
    this.activationX = activationX;
    this.activationY = activationY;
    this.distX = distX;
    this.distY = distY;
  }

  checkPosition() {
    return (Math.abs(Globals.playerObj.image.body.position.x - this.activationX) < this.distX) &&
           (Math.abs(Globals.playerObj.image.body.position.y - this.activationY) < this.distY);
  }

  checkState() {
    return Globals.playerObj.isRunning();
  }

  onActivate(time) {
    Globals.playerObj.image.body.position.x = this.activationX;
    Globals.playerObj.image.body.position.y = this.activationY;
  }

  checkActivation(time) {
    if (this.checkPosition() && this.checkState()) {
      Globals.playerObj.changeState(this.activityState, time);
      this.onActivate(time);
    }
  }
}
