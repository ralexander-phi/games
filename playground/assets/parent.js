const PARENT_AWAY_LENGTH_SECONDS = 10;
const PARENT_CALL_DELAY = 10;
const PARENT_HUG_LENGTH_SECONDS = 0.5;
const PARENT_PATIENCE_SECONDS = 10;
const PLAY_TIME_LIMIT_SECONDS = 60; // TODO: longer

const PARENT_POS_X = 0;
const PARENT_POS_Y = 300;


function parentStateMessage(ctx, newState) {
  switch (newState) {
    case ParentState.CALLING:
    case ParentState.FRUSTRATED:
      ctx.say("Where are you?");
      break;

    case ParentState.TIME_TO_GO:
    case ParentState.OVERTIME:
    case ParentState.TOO_LONG:
      ctx.say("It's time to go home");
      break;

    case ParentState.ONE_LAST_THING:
      ctx.say("Please, do one last thing.");
      break;

    default:
      ctx.say("");
  }
}

function parentVisible(ctx, newState) {
  if (newState == ParentState.AWAY) {
    ctx.image.visible = false;
  } else {
    ctx.image.visible = true;
  }
}

function heartsVisible(ctx, newState) {
  if (newState == ParentState.HUGGING) {
    Globals.hearts.start();
  } else {
    Globals.hearts.stop();
  }
}

function frustratedVisible(ctx, newState) {
  switch (newState) {
    case ParentState.TOO_LONG:
    case ParentState.FRUSTRATED:
      ctx.frustrated.start();
      break;

    default:
      ctx.frustrated.stop();
      break;
  }
}

class Parent extends Entity {
  constructor(game) {
    super();
    this.state = ParentState.AWAY;
    this.onStateChangeCallbacks = [ parentStateMessage, parentVisible, heartsVisible ];

    this.image = game.physics.add.image(PARENT_POS_X, PARENT_POS_Y, 'mom');
    this.image.visible = false;
    this.image.setCollideWorldBounds(true);

    this.frustrated = game.add.particles(5, -40, 'frustrated', {
      speed: 80,
      scale: { start: 0.1, end: 0.7 },
      blendMode: 'NORMAL',
      maxAliveParticles: 7,
    });
    this.frustrated.startFollow(this.image);
    this.frustrated.stop();
    this.frustratedSince = 0;
  }

  isPresent() {
    return ParentState.AWAY != this.state;
  }

  isAllowingPlay() {
    return [ ParentState.WAITING,
             ParentState.AWAY,
             ParentState.HUGGING,
             ParentState.ONE_LAST_THING,
           ].includes(this.state);
  }

  isTimeToGo() {
    return [ ParentState.TIME_TO_GO,
             ParentState.OVERTIME,
             ParentState.TOO_LONG,
           ].includes(this.state);
  }

  createMessage(game) {
    this.momMessage = game.add.text(
      PARENT_POS_X + 5,
      PARENT_POS_Y - 80,
      '',
      {
        fontSize: "3em",
        backgroundColor: "#333",
        padding: { "x": 10, "y": 5 },
      },
    );
    this.momMessage.visible = false;
  }

  say(text) {
    if (text === "") {
      this.momMessage.visible = false;
      this.momMessage.text = text;
    } else {
      this.momMessage.visible = true;
      this.momMessage.text = text;
    }
  }

  update(time) {
    switch (this.state) {
      case ParentState.AWAY:
        if (this.waitExceeded(time, PARENT_AWAY_LENGTH_SECONDS)) {
          this.changeState(ParentState.WAITING, time);
        }
        break;

      case ParentState.WAITING:
        if (this.waitExceeded(time, PARENT_CALL_DELAY)) {
          this.changeState(ParentState.CALLING, time);
          this.frustratedSince = time;
        }
        break;

      case ParentState.CALLING:
        if (this.waitExceeded(time, PARENT_PATIENCE_SECONDS)) {
          this.changeState(ParentState.FRUSTRATED, time);
        }
        break;

      case ParentState.HUGGING:
        if (this.waitExceeded(time, PARENT_HUG_LENGTH_SECONDS)) {
          if (time > (PLAY_TIME_LIMIT_SECONDS*1000)) {
            this.changeState(ParentState.ONE_LAST_THING, time);
          } else {
            this.changeState(ParentState.AWAY, time);
          }
        }
        break;

      case ParentState.FRUSTRATED:
        if ((time - this.frustratedSince) > 900) {
          this.frustratedSince = time;
          Globals.score.updateScore(-1);
        }
        break;

      case ParentState.TIME_TO_GO:
        if (this.waitExceeded(time, 10)) {
          this.changeState(ParentState.OVERTIME, time);
        }
        break;

      case ParentState.OVERTIME:
        if (this.waitExceeded(time, 10)) {
          this.changeState(ParentState.TOO_LONG, time);
        }
        break;

      case ParentState.TOO_LONG:
        if ((time - this.frustratedSince) > 900) {
          this.frustratedSince = time;
          Globals.score.updateScore(-1);
        }
        break;
    }
  }
}

class HugActivity extends BaseActivity {
  constructor(level) {
    super(
      PlayerState.RUNNING, // Keep running
      PARENT_POS_X,
      PARENT_POS_Y,
      25,
      30,
    );
    this.level = level;
  }

  checkActivation(time) {
    if (this.checkPosition()) {
      if (Globals.parentObj.isTimeToGo()) {
        if (Globals.parentObj.state == ParentState.TOO_LONG) {
          this.level.gameOver();
        } else {
          this.level.nextLevel();
        }
      } else if (! [ ParentState.HUGGING,
                     ParentState.ONE_LAST_THING,
                     ParentState.TIME_TO_GO,
                     ParentState.OVERTIME,
                     ParentState.TOO_LONG,
                     ParentState.AWAY,
                   ].includes(Globals.parentObj.state)) {
        Globals.parentObj.changeState(ParentState.HUGGING, time);
        if (Globals.parentObj.isAllowingPlay()) {
          Globals.score.updateScore(10);
        }
      }
    }
  }
}

