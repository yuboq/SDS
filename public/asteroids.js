function Physics(ui) {
  var pl = planck, Vec2 = pl.Vec2;
  var YOU = 2;
  var OTHER = 4;
  var SPACE_WIDTH = 16;
  var SPACE_HEIGHT = 9;

  var SIZE = 0.30;
  var state = {
    gameover: true,
    startGame: function() {
      this.gameover = false;
    },
    crash: function() {
      this.endGame();
    },
    endGame: function() {
      this.gameover = true;
    }
  };

  var world;
  var otherBodies = [];
  var yourBody;

  world = pl.World();
  world.on('pre-solve', function(contact) {
    var fixtureA = contact.getFixtureA();
    var fixtureB = contact.getFixtureB();

    var bodyA = contact.getFixtureA().getBody();
    var bodyB = contact.getFixtureB().getBody();

    var youCrashed = bodyA == yourBody || bodyB == yourBody;
    if (youCrashed) {
      setTimeout(function () {
        crash(yourBody, bodyA == yourBody ? bodyB : bodyA);
      }, 1);
    }
  });

  function start() {
    state.startGame();
    setupYou();
    setupBots();
  }

  function end() {
    state.endGame();
    ui.endGame();
  }

  function setupYou() {
    yourBody = world.createBody({
      type : 'dynamic',
      angularDamping : 2.0,
      linearDamping : 0.5,
      position : Vec2(),
    });

    yourBody.createFixture(pl.Circle(SIZE), {
      density : 1000,
      filterCategoryBits : YOU,
      filterMaskBits : OTHER
    });
  }

  var globalTime = 0;

  function tick(dt) {
    if (state.gameover) {
      return;
    }
    globalTime += dt;
    if (yourBody) {
      if (ui.activeKeys.left && !ui.activeKeys.right) {
        var f = yourBody.getWorldVector(Vec2(10.0, 0.0));
        var p = yourBody.getWorldCenter();
        yourBody.applyLinearImpulse(f, p, true);
      } else if (ui.activeKeys.right && !ui.activeKeys.left) {
        var f = yourBody.getWorldVector(Vec2(-10.0, 0.0));
        var p = yourBody.getWorldCenter();
        yourBody.applyLinearImpulse(f, p, true);
      }
      if (ui.activeKeys.up && !ui.activeKeys.down) {
        var f = yourBody.getWorldVector(Vec2(0.0, -10.0));
        var p = yourBody.getWorldCenter();
        yourBody.applyLinearImpulse(f, p, true);
      }
      if (ui.activeKeys.down && !ui.activeKeys.up) {
        var f = yourBody.getWorldVector(Vec2(0.0, 10.0));
        var p = yourBody.getWorldCenter();
        yourBody.applyLinearImpulse(f, p, true);
      }
    }
    console.log(yourBody.getWorldCenter());
    for (var i = 0; i !== otherBodies.length; i++) {
      otherBody = otherBodies[i]
      var f = otherBody.getWorldVector(Vec2(rand(50) * (rand(1) > 0.5 ? 1 : -1), rand(50) * (rand(1) > 0.5 ? 1 : -1)));
      var p = otherBody.getWorldCenter();
      otherBody.applyLinearImpulse(f, p, true);
    }
  }

  function setupBots() {
    otherBodies = [];

    for (var i = 0; i < 5; i++) {
      var yourPosition = yourBody.getPosition();
      var x = yourPosition.x;
      var y = yourPosition.y;

      while (Math.abs(x - yourPosition.x) < SIZE * 2
      && Math.abs(y - yourPosition.y) < SIZE * 2) {
        x = rand(SPACE_WIDTH);
        y = rand(SPACE_HEIGHT);
      }

      var vx = rand(1);
      var vy = rand(1);
      var va = rand(1);
      makeOtherBody(x, y, vx, vy, va);
    }
  }

  function makeOtherBody(x, y, vx, vy, va) {
    var otherBody = world.createBody({
      position : Vec2(x, y),
      type : 'dynamic',
      linearDamping : 1.0,
    });
    otherBodies.push(otherBody);
    otherBody.createFixture(pl.Circle(SIZE), {
      density : 1000,
      filterCategoryBits : OTHER,
      filterMaskBits : YOU
    });
    return otherBody;
  }

  function crash(you, other) {
    if (!yourBody) return;

    state.crash();

    // Remove the ship body for a while
    world.destroyBody(yourBody);
    yourBody = null;
    end();
  }

  function rand(value) {
    return (Math.random() - 0.5) * (value || 1);
  }

  //If player hits out of bounds, game over for that player
  function outofbounds (body) {
    var p = body.getPosition();
    
  }

  this.start = start;
  this.world = world;
  this.state = state;
  this.spaceWidth = SPACE_WIDTH;
  this.spaceHeight = SPACE_HEIGHT;
  this.tick = tick;
  this.ratio = 64;
}

Stage(function(stage) {
  var activeKeys = {};

  Stage.image('bg').pin ('align', 0.5).appendTo(stage);
  

  var KEY_NAMES = {
    32 : 'start',
    37 : 'right',
    38 : 'up',
    39 : 'left',
    40 : 'down'
  };

  var physics = new Physics({
    startGame: startGame,
    endGame: endGame,
    activeKeys: activeKeys
  });
  var world, meta;
  stage.background('#222222');
  stage.on('viewport', function(size) {
    meta.pin({
      scaleMode : 'in-pad',
      scaleWidth : size.width,
      scaleHeight : size.height
    });
    world.pin({
      scaleMode : 'in-pad',
      scaleWidth : size.width,
      scaleHeight : size.height
    });
  });
  //
  world = new Stage
    .planck(physics.world, { ratio: 80 })
    .pin({
      handle : -0.5,
      width : physics.spaceWidth,
      height : physics.spaceHeight
    })
    .appendTo(stage)
    .hide();

  stage.tick(physics.tick);

  START_STATE = 1;
  GAME_STATE = 2;
  END_STATE = 3;
  m_state = START_STATE;

  meta = Stage
    .create()
    .pin({ width : 1000, height : 1000 })
    .appendTo(stage);

  startScreen = Stage
    .string('text')
    .value('Start!')
    .pin({ offsetX: 500, offsetY: 500, scale : 1 })
    .appendTo(meta)
    .show();

  endScreen = Stage
    .string('text')
    .value('End!')
    .pin({offsetX: 1, offsetY: 4, scale : 1 })
    .appendTo(meta)
    .hide();

  function startGame() {
    startScreen.hide();
    m_state = GAME_STATE;
    world.show();
    physics.start();
    endScreen.hide();
  }

  function endGame() {
    startScreen.hide();
    m_state = END_STATE;
    world.hide();
    endScreen.show();
  }

  document.onkeydown = function(evt) {
    activeKeys[KEY_NAMES[evt.keyCode]] = true;
  };

  document.onkeyup = function(evt) {
    var old_start = activeKeys['start']
    activeKeys[KEY_NAMES[evt.keyCode]] = false;
    if (old_start && !activeKeys['start'] && m_state != GAME_STATE) {
      startGame();
    }
  };
});

Stage({
  textures : {
    'bg' : Stage.canvas(function(ctx) {
      var ratio = 200;
      this.size(16, 9, ratio);
      ctx.scale(200, 200);
      ctx.moveTo(1, 1);
      ctx.lineTo(1, 9);
      ctx.lineTo(16, 9);
      ctx.lineTo(16, 1);
      ctx.lineTo (1,1);
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#999';
      ctx.stroke();
    }),

    text : function(d) {
      d += '';
      return Stage.canvas(function(ctx) {
        var ratio = 2;
        this.size(16, 24, ratio);
        ctx.scale(ratio, ratio);
        ctx.font = 'bold 24px monospace';
        ctx.fillStyle = '#ddd';
        ctx.textBaseline = 'top';
        ctx.fillText(d, 0, 1);
      });
    }

  }
});
