function dustVisible(ctx, newState) {
  if (newState != PlayerState.RUNNING) {
    ctx.dust.stop();
  } 
}

function splashVisible(ctx, newState) {
  if (newState != PlayerState.SWIMMING) {
    ctx.dust.stop();
  } 
}

function blurMotion(ctx, newState) {
  if ([ PlayerState.RUNNING,
        PlayerState.SLIDING, // Only blur on the way down
      ].includes(newState)) {
    ctx.motion.stop();
  } else {
    ctx.motion.start();
  }
}

function playerVelocity(ctx, newState) {
  if (newState != PlayerState.RUNNING) {
    ctx.image.body.velocity.x = 0;
    ctx.image.body.velocity.y = 0;
  }
}

class Player extends Entity {
  constructor(game) {
    super();
    this.state = PlayerState.RUNNING;
    this.onStateChangeCallbacks = [
      dustVisible,
      blurMotion,
      playerVelocity,
    ];

    this.image = game.physics.add.image(400, 100, 'player');
    this.image.setCollideWorldBounds(true);

    this.dust = game.add.particles(0, 20, 'dust', {
      speed: 100,
      scale: { start: 0.4, end: 0.1 },
      blendMode: 'ADD',
      lifespan: 400,
    });
    this.dust.startFollow(this.image);
    this.dust.stop();

    this.splash = game.add.particles(0, 20, 'splash', {
      speed: 100,
      scale: { start: 0.4, end: 0.1 },
      blendMode: 'ADD',
      lifespan: 400,
    });
    this.splash.startFollow(this.image);
    this.splash.stop();

    this.motion = game.add.particles(0, 0, 'motion', {
      speed: 0,
      scale: { start: 0.3, end: 0.4 },
      blendMode: 'NORMAL',
      lifespan: 50,
      frequency: 10,
    });
    this.motion.startFollow(this.image);
    this.motion.stop();

    Globals.hearts = game.add.particles(0, 0, 'heart', {
      speed: 80,
      scale: { start: 0.3, end: 0.8 },
      blendMode: 'NORMAL',
      frequency: 100,
    });
    Globals.hearts.startFollow(this.image);
    Globals.hearts.stop();

    // Control the player
    //this.cursor = game.input.keyboard.createCursorKeys();
    this.shift = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    this.wKey = game.input.keyboard.addKey('W');
    this.aKey = game.input.keyboard.addKey('A');
    this.sKey = game.input.keyboard.addKey('S');
    this.dKey = game.input.keyboard.addKey('D');
  }

  update(time) {
    var didSomething = false;
    switch (this.state) {
      case PlayerState.RUNNING:
        var speedUp = this.shift.isDown ? 3 : 1;

        var moving = false;
        if (this.wKey.isDown) {
          moving = true;
          this.image.body.velocity.y = -1 * speedUp * SPEED;
        } else if (this.sKey.isDown) {
          moving = true;
          this.image.body.velocity.y = speedUp * SPEED;
        } else {
          this.image.body.velocity.y = 0;
        }
        if (this.aKey.isDown) {
          moving = true;
          this.image.body.velocity.x = -1 * speedUp * SPEED;
        } else if (this.dKey.isDown) {
          moving = true;
          this.image.body.velocity.x = speedUp * SPEED;
        } else {
          this.image.body.velocity.x = 0;
        }

        // Dusty
        if (moving && speedUp > 1) {
          this.dust.start();
        } else {
          this.dust.stop();
        }
        break;

      case PlayerState.SWIMMING:
        var speedUp = this.shift.isDown ? 3 : 1;

        var moving = false;
        if (this.wKey.isDown) {
          moving = true;
          this.image.body.velocity.y = -1 * speedUp * SWIM_SPEED;
        } else if (this.sKey.isDown) {
          moving = true;
          this.image.body.velocity.y = speedUp * SWIM_SPEED;
        } else {
          this.image.body.velocity.y = 0;
        }
        if (this.aKey.isDown) {
          moving = true;
          this.image.body.velocity.x = -1 * speedUp * SWIM_SPEED;
        } else if (this.dKey.isDown) {
          moving = true;
          this.image.body.velocity.x = speedUp * SWIM_SPEED;
        } else {
          this.image.body.velocity.x = 0;
        }

        // splash
        if (moving && speedUp > 1) {
          this.splash.start();
        } else {
          this.splash.stop();
        }
        break;

      case PlayerState.SLIDING:
        const CLIMB_TIME = 1.2;
        const SLIDE_TIME = 0.3;
        const CLIMB_RATE = 10;
        const SLIDE_RATE = 6;
        const SLIDE_TOP_X = SLIDE_START_POS_X + (CLIMB_TIME/CLIMB_RATE)*1000 + 75;
        const SLIDE_TOP_Y = SLIDE_START_POS_Y - (CLIMB_TIME/CLIMB_RATE)*1000;
        var slideTime = this.timeInState(time);
        if (!this.waitExceeded(time, CLIMB_TIME)) {
          this.image.body.position.x = SLIDE_START_POS_X + (slideTime/CLIMB_RATE);
          this.image.body.position.y = SLIDE_START_POS_Y - (slideTime/CLIMB_RATE) * 1.3;
        } else if (!this.waitExceeded(time, CLIMB_TIME+SLIDE_TIME)) {
          this.motion.start();
          slideTime -= CLIMB_TIME + 300;
          this.image.body.position.x = SLIDE_TOP_X + Math.sin(slideTime/180 + 45) * 130;
          this.image.body.position.y = SLIDE_TOP_Y + Math.cos(slideTime/180) * 100;
        } else {
          didSomething = true;
          if (Globals.parentObj.isAllowingPlay()) {
            Globals.score.updateScore(5);
          }
          this.changeState(PlayerState.RUNNING, time);
        }
        break;

      case PlayerState.SPINNING:
        const SPIN_TIME = 2.3;
        const spinTime = this.timeInState(time);
        this.image.body.position.x = SPINNER_START_POS_X + Math.sin(spinTime/100) * 100 - 10;
        this.image.body.position.y = SPINNER_START_POS_Y + Math.cos(spinTime/100) * 70 - 10;
        if (this.waitExceeded(time, SPIN_TIME)) {
          didSomething = true;
          if (Globals.parentObj.isAllowingPlay()) {
            Globals.score.updateScore(5);
          }
          this.changeState(PlayerState.RUNNING, time);
        }
        break;
    }

    return didSomething;
  }

  isRunning() {
    return this.state == PlayerState.RUNNING;
  }
}
