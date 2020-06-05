(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const Player = require ('./player.js');
const {
  pl,
  Vec2,
  rand
} = require('./sdsconsts.js');

function Physics(ui) {
  const PLAYER = 2;
  const WALLS = 4;
  var SPACE_WIDTH = 16;
  var SPACE_HEIGHT = 9;
  const NUMSTEPS = 100;
  const BOT_NUM = 5;

  var SIZE = 0.30;
  var WALLRADIUS = 5;
  var state = {
    gameover: true,
    startGame: function () {
      this.gameover = false;
    },
    die: function () {
      this.endGame();
    },
    endGame: function () {
      this.gameover = true;
    }
  };

  var world;

  var yourPlayer;
  var otherBodies = [];
  var borderWall;
  var globalTime = 0;
  var lastShrinkTime = globalTime;
  var updateHealthTime = globalTime;
  var shrinkSteps = NUMSTEPS;
  var currentCircle = {
    radius: WALLRADIUS,
    position: Vec2(0, 0)
  };
  var newCircle = currentCircle;
  world = pl.World();

  function start() {
    state.startGame();
    yourPlayer = createPlayer(0, 0, true);
    setupBots();
    makeWalls(currentCircle);
  }

  function end() {
    state.endGame();
    ui.endGame();
  }

  function createPlayer (x = 0, y = 0, isHuman) {
    return new Player(setupPlayerBody (x,y), isHuman, ui.activeKeys);
  }

  function setupPlayerBody(x = 0, y = 0) {
    var player = world.createBody({
      type: 'dynamic',
      angularDamping: 2.0,
      linearDamping: 0.5,
      position: Vec2(x, y),
      bullet: true
    });

    player.createFixture(pl.Circle(SIZE), {
      density: 1000,
      filterCategoryBits: PLAYER,
      filterMaskBits: PLAYER | WALLS
    });

    return player;
  }

  function moveOtherBody() {
    otherBodies.forEach(body => body.tick());
  }

  function tick(dt) {
    if (state.gameover) {
      return;
    }
    globalTime += dt;
    yourPlayer.tick();
    moveOtherBody();
    shouldIshrink();
    updateHealth();
    //console.log (new Date());
    //console.log (globalTime);
    //console.log(yourPlayer.playerBody.getWorldCenter());

  }

  function updateHealth() {
    console.log (yourPlayer.health);
    if (Math.abs (globalTime - updateHealthTime) < 100) {
      return;
    }

    updateHealthTime = globalTime;
    yourPlayer.addHealth();
    if (yourPlayer.health <= 0) {
      die();//gameover
    }
  }

  function shouldIshrink() {

    if (globalTime - lastShrinkTime < 100) {
      return;
    }
    lastShrinkTime = globalTime;

    if (!shrinkSteps) {
      newCircle = createNewCircle(currentCircle);
      shrinkSteps = NUMSTEPS;
    } else {

      currentCircle = shrinkCircle(currentCircle, newCircle);
      makeWalls(currentCircle);
      shrinkSteps--;
    }
  }

  function shrinkCircle(cc, nc) {
    var nr = cc.radius - (cc.radius - nc.radius) / shrinkSteps;
    var x = cc.position.x + (nc.position.x - cc.position.x) / shrinkSteps;
    var y = cc.position.y + (nc.position.y - cc.position.y) / shrinkSteps;
    return {
      position: Vec2(x, y),
      radius: nr
    };
  }

  function createNewCircle(p) {
    var r = p.radius * 0.80;
    var pr = p.radius - r;
    var angle = rand(Math.PI * 2);
    var maxX = Math.sin(angle) * pr;
    var maxY = Math.cos(angle) * pr;
    var x = normalDistRandom() * maxX + p.position.x;
    var y = normalDistRandom() * maxY + p.position.y;
    return {
      position: Vec2(x, y),
      radius: r
    };
  }

  function normalDistRandom() {
    let u = 0, v = 0;
    while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while (v === 0) v = Math.random();
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    num = num / 10.0 + 0.5; // Translate to 0 -> 1
    if (num > 1 || num < 0) return randn_bm(); // resample between 0 and 1
    return num;
  }

  function setupBots() {
    otherBodies = [];

    for (var i = 0; i < BOT_NUM; i++) {
      var yourPosition = yourPlayer.getPosition();
      var x = yourPosition.x;
      var y = yourPosition.y;

      while (Math.abs(x - yourPosition.x) < SIZE * 2
        && Math.abs(y - yourPosition.y) < SIZE * 2) {
        var angle = rand(Math.PI * 2);
        x = rand(WALLRADIUS - SIZE) * Math.sin(angle);
        y = rand(WALLRADIUS - SIZE) * Math.cos(angle);
      }
      otherBodies.push(createPlayer (x,y, false));
    }
  }

  function makeWalls(cc) {
    var circlePoints = makeCirclePoints(cc.radius, cc.position.x, cc.position.y);

    if (!borderWall) {
      borderWall = world.createBody();
    }
    borderWall.createFixture(pl.Chain(circlePoints), {
      density: 0,
      filterCategoryBits: WALLS,
      filterMaskBits: PLAYER
    });
    var fixA = borderWall.getFixtureList();
    var limit = 5;
    while (limit-- > 0) {
      fixA = fixA ? fixA.getNext() : fixA
    }
    if (fixA) {
      borderWall.destroyFixture(fixA);
    }
    return borderWall;
  }

  function makeCirclePoints(radius, p_x, p_y, numpoints = 100) {
    if (numpoints < 3) return;
    var output = [];

    var angle = Math.PI * 2 / numpoints;

    for (i = 0; i < numpoints; ++i) {
      var currAngle = angle * i;
      var y = Math.sin(currAngle) * radius + p_x;
      var x = Math.cos(currAngle) * radius + p_y;
      output.push(Vec2(x, y));
    }
    output.push(output[0]);
    return output;
  }

  function die(you, other) {
    if (!yourPlayer.playerBody) return;

    state.die();

    world.destroyBody(yourPlayer.playerBody);
    for (i = 0; i < otherBodies.length; i++) {
      world.destroyBody(otherBodies[i].playerBody);
    }
    yourPlayer.playerBody = null;
    otherBodies = null;
    end();
  }

  this.start = start;
  this.world = world;
  this.state = state;
  this.spaceWidth = SPACE_WIDTH;
  this.spaceHeight = SPACE_HEIGHT;
  this.tick = tick;
  this.ratio = 64;
}

Stage(function (stage) {
  var activeKeys = {};
  Stage.image ('player')
  .appendTo(stage)
  .pin({
    align: 0.5, //0 for top left, 1 for to right
    scale : 0.25
  }); 

  var KEY_NAMES = {
    32: 'start',
    37: 'right',
    38: 'up',
    39: 'left',
    40: 'down'
  };

  
  var physics = new Physics({
    startGame: startGame,
    endGame: endGame,
    activeKeys: activeKeys
  });
  var world, meta;
  stage.background('#222222');
  stage.on('viewport', function (size) {
    meta.pin({
      scaleMode: 'in-pad',
      scaleWidth: size.width,
      scaleHeight: size.height
    });
    world.pin({
      scaleMode: 'in-pad',
      scaleWidth: size.width,
      scaleHeight: size.height
    });
  });
  //
  world = new Stage
    .planck(physics.world, { ratio: 80 })
    .pin({
      handle: -0.5,
      width: physics.spaceWidth,
      height: physics.spaceHeight
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
    .pin({ width: 1000, height: 1000 })
    .appendTo(stage);

  startScreen = Stage
    .string('text')
    .value('Start!')
    .pin({ offsetX: 500, offsetY: 500, scale: 1 })
    .appendTo(meta)
    .show();

  endScreen = Stage
    .string('text')
    .value('End!')
    .pin({ offsetX: 1, offsetY: 4, scale: 1 })
    .appendTo(meta)
    .hide();

  function startGame() {
    startScreen.hide();
    m_state = GAME_STATE;
    world.show();
    physics.start();
    endScreen.hide();
  }

  function addImage (){
    
  }

  function endGame() {
    startScreen.hide();
    m_state = END_STATE;
    world.hide();
    endScreen.show();
  }

  document.onkeydown = function (evt) {
    activeKeys[KEY_NAMES[evt.keyCode]] = true;
  };

  document.onkeyup = function (evt) {
    var old_start = activeKeys['start']
    activeKeys[KEY_NAMES[evt.keyCode]] = false;
    if (old_start && !activeKeys['start'] && m_state != GAME_STATE) {
      startGame();
    }
  };
});

Stage({
  name : 'player',
  image : './images/players.png'
});


Stage ({
  
  textures: {
    text: function (d) {
      d += '';
      return Stage.canvas(function (ctx) {
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

},{"./player.js":2,"./sdsconsts.js":3}],2:[function(require,module,exports){
const {
  INITIAL_HEALTH,
  INITIAL_SICK_RATE,
  MIN_HEALTH,
  MAX_HEALTH,
  pl,
  Vec2,
  rand
} = require('./sdsconsts.js');

class Player {
  constructor(playerBody, isHuman = false, activeKeys = []) {
    this._isHuman = isHuman;
    this._playerBody = playerBody;
    this._health = INITIAL_HEALTH;
    this._sickRate = INITIAL_SICK_RATE;
    this._activeKeys = activeKeys;
  }

  getWorldCenter() {
    return this.playerBody.getWorldCenter();
  }

  get health() {
    return this._health;
  }

  addHealth(amount = ((-1) * this._sickRate)) {
    this._health += amount;
  }

  checkHealth() {
    if (this._health > MAX_HEALTH) {
      this._health = MAX_HEALTH;
    }
    else if (this._health < MIN_HEALTH) {
      this._health = MIN_HEALTH
    }
  }
  getPosition() {
    return this._playerBody.getPosition();
  }
  get playerBody() {
    return this._playerBody;
  }
  getWorldCenter() {
    return this._playerBody.getWorldCenter();
  }
  getWorldVector(vec2) {
    return this._playerBody.getWorldVector(vec2);
  }
  applyLinearImpulse(f, p, b) {
    return this._playerBody.applyLinearImpulse(f, p, b);
  }

  tick(dt) {
    if (this._isHuman) {
      this.updateHuman(dt);
    } else {
      this.updateBot(dt);
    }
  }

  updateHuman(dt) {
    if (this.playerBody) {
      if (this._activeKeys.left && !this._activeKeys.right) {
        var f = Vec2(10.0, 0.0);
        var p = this.getWorldCenter();
        this.applyLinearImpulse(f, p, true);
      } else if (this._activeKeys.right && !this._activeKeys.left) {
        var f = Vec2(-10.0, 0.0);
        var p = this.getWorldCenter();
        this.applyLinearImpulse(f, p, true);
      }
      if (this._activeKeys.up && !this._activeKeys.down) {
        var f = Vec2(0.0, -10.0);
        var p = this.getWorldCenter();
        this.applyLinearImpulse(f, p, true);
      }
      if (this._activeKeys.down && !this._activeKeys.up) {
        var f = Vec2(0.0, 10.0);
        var p = this.getWorldCenter();
        this.applyLinearImpulse(f, p, true);
      }
    }
  }

  updateBot(dt) {
    var f = this.getWorldVector(Vec2(rand(50) * (rand(1) > 0.5 ? 1 : -1), rand(50) * (rand(1) > 0.5 ? 1 : -1)));
    var p = this.getWorldCenter();
    this.applyLinearImpulse(f, p, true);
  }
}

module.exports = Player;

},{"./sdsconsts.js":3}],3:[function(require,module,exports){
module.exports = {
    INITIAL_HEALTH : 100,
    INITIAL_SICK_RATE : 1,
    MAX_HEALTH : 100,
    MIN_HEALTH : 0,
    pl : planck,
    Vec2 : planck.Vec2,
    rand : function(value) {
      return (Math.random() - 0.5) * (value || 1);
    }
};

},{}]},{},[1]);
