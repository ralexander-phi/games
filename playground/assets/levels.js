const SIZE = 800;

const LAVA_POS_X = 500;
const LAVA_POS_Y = 500;

const POOL_POS_X = 100;
const POOL_POS_Y = 100;

const SLIDE_START_POS_X = (SIZE/2) - 175;
const SLIDE_START_POS_Y = (SIZE/2) + 80;

const SPINNER_START_POS_X = 650;
const SPINNER_START_POS_Y = 250;

class BaseLevel extends Phaser.Scene {
  preload () {
    this.load.image('grass',      'assets/grass.png');
    this.load.image('player',     'assets/player.png');
    this.load.image('mom',        'assets/mom.png');
    this.load.image('dust',       'assets/dust.png');
    this.load.image('splash',     'assets/splash.png');
    this.load.image('heart',      'assets/heart.png');
    this.load.image('frustrated', 'assets/frustrated.png');
    this.load.image('slide1',     'assets/slide1.png');
    this.load.image('star',       'assets/star.png');
    this.load.image('motion',     'assets/motion.png');
    this.load.image('tree1',      'assets/tree1.png');
    this.load.image('tree2',      'assets/tree2.png');
    this.load.image('spinner',    'assets/spinner.png');
    this.load.image('pool',       'assets/pool.png');
    this.load.spritesheet('lava', 'assets/lava.png', { frameWidth: 16, frameHeight: 16 });
  }

  create () {
    this._createBackground();

    this.activities = [
      new HugActivity(this),
    ];
    this._createActivities();

    Globals.parentObj = new Parent(this);
    Globals.playerObj = new Player(this);

    // Hearts managed by parent and player

    this.frustratedSince = 0;
    this._createTrees();

    Globals.score = new Score(this);

    // After the trees
    Globals.parentObj.createMessage(this);
  }

  gameOver(score) {
    Globals.parentObj.say("Love you!");
    var url = "win.html?score=" + Globals.score.score;
    setTimeout(
      function() {
        game.destroy(true, false)
        window.location = url;
      },
      PARENT_HUG_LENGTH_SECONDS * 1000,
    );
  }

  update(time, delta) {
    const didSomething = Globals.playerObj.update(time);
    Globals.parentObj.update(time);

    this._checkActivityActivation(time);

    if (didSomething && Globals.parentObj.state == ParentState.ONE_LAST_THING) {
      Globals.parentObj.changeState(ParentState.TIME_TO_GO, time);
    }
  }

  _checkActivityActivation(time) {
    for (const act of this.activities) {
      act.checkActivation(time);
    }
  }

  _createTrees() {
    for (var pos of [
      [150, 50],
      [200, 320],
      [550, 390],
      [800, 30],
      [650, 45],
      [80,  650],
      [210, 690],
    ]) {
      if (Math.random() > 0.5) {
        this.add.image(pos[0], pos[1], 'tree1');
      } else {
        this.add.image(pos[0], pos[1], 'tree2');
      }
    }
  }
}

class SlideActivity extends BaseActivity {
  constructor(game) {
    super(
      PlayerState.SLIDING,
      SLIDE_START_POS_X,
      SLIDE_START_POS_Y,
      50,
      50,
    );
    game.add.image(SIZE/2, SIZE/2, 'slide1');
  }
}

class SpinnerActivity extends BaseActivity {
  constructor(game) {
    super(
      PlayerState.SPINNING,
      SPINNER_START_POS_X,
      SPINNER_START_POS_Y,
      50,
      50,
    );
    game.add.image(650, 250, 'spinner');
  }
}

class Level1 extends BaseLevel {
  nextLevel() {
    Globals.parentObj.say("Love you!");
    var url = "level2.html?score=" + Globals.score.score;
    setTimeout(
      function() {
        game.destroy(true, false)
        window.location = url;
      },
      PARENT_HUG_LENGTH_SECONDS * 1000,
    );
  }

  _createBackground() {
    this.add.image(SIZE/2, SIZE/2, 'grass');
  }

  _createActivities() {
    this.activities.push(new SlideActivity(this));
    this.activities.push(new SpinnerActivity(this));
  }
}

class PoolActivity extends BaseActivity {
  constructor(game) {
    super(
      PlayerState.SWIMMING,
      POOL_POS_X,
      POOL_POS_Y,
      50,
      50,
    );

    game.add.image(SIZE/2, SIZE/2, 'pool');
  }

  // Override
  onActivate(time) {
    Globals.playerObj.changeState(PlayerState.SWIMMING, time);
  }
}

class LavaActivity extends BaseActivity {
  constructor(game) {
    super(
      PlayerState.RUNNING, // Keep running
      LAVA_POS_X,
      LAVA_POS_Y,
      50,
      50,
    );

    var frames = [...Array(45).keys()];
    const LAVA_SCALE = 4;
    for (var x = 0; x < 3; x+=1) {
      for (var y = 0; y < 3; y+=1) {
        frames.push(frames.shift());
        const animName = 'lavaAnim' + x + '_' + y;
        game.anims.create({
          key: animName,
          frames: game.anims.generateFrameNumbers('lava', { frames: frames }),
          frameRate: 10,
          repeat: -1
        });
        const lava = game.add.sprite(LAVA_POS_X+x*16*LAVA_SCALE, LAVA_POS_Y+y*16*LAVA_SCALE);
        lava.setScale(LAVA_SCALE);
        lava.play(animName, true);
      }
    }

    game.add.text(
      LAVA_POS_X,
      LAVA_POS_Y+50,
      'Danger: Lava',
      {
        fontSize: "3em",
        backgroundColor: "#933",
        padding: { "x": 10, "y": 5 },
      },
    );
  }

  // Override
  checkState() {
    return ! Globals.parentObj.isTimeToGo();
  }

  // Override
  onActivate(time) {
    Globals.score.score = 0;
    Globals.parentObj.changeState(ParentState.TIME_TO_GO, time);
  }
}

class Level2 extends BaseLevel {
  nextLevel() {
    this.gameOver();
  }

  _createBackground() {
    this.add.image(SIZE/2, SIZE/2, 'grass');
  }

  _createActivities() {
    Globals.lavaActivity = new LavaActivity(this);
    this.activities.push(Globals.lavaActivity);
    Globals.poolActivity = new PoolActivity(this);
    this.activities.push(Globals.poolActivity);
  }
}

