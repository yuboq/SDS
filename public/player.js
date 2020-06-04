const {
  INITIAL_HEALTH,
  INITIAL_SICK_RATE,
  MIN_HEALTH,
  MAX_HEALTH,
  SIZE,
  PLAYER,
  WALLS,
  pl,
  Vec2,
  rand
} = require('./sdsconsts.js');

class Player {
  constructor(world, ui, x, y, isHuman = false, activeKeys = []) {
    this._world = world;
    this._ui = ui;
    this._isHuman = isHuman;
    this._playerBody = isHuman ? this.createPlayerBody(x, y) : this.createBotBody(x, y);
    this._health = INITIAL_HEALTH;
    this._sickRate = INITIAL_SICK_RATE;
    this._activeKeys = activeKeys;
    this.x = x;
    this.y = y;
    this.vMin = 0;
    this.vMax = 100;
    this.aMax = 10;
    this.vx = 0;
    this.vy = 0;
    this.v = 0;
    this.dir = 0;
    this.rotation = 0;
    this.accMain = 0;
    this.accSide = 0;
    this.accX = 0;
    this.accY = 0;
    this.accCX = null;
    this.accCY = null;
  }

  createBotBody(x, y) {
    this.createBotUI();
    return this.createBody(x, y)
  }

  createPlayerBody(x, y) {
    this.createPlayerUI();
    return this.createBody(x, y)
  }

  createBody(x, y) {
    var player = this._world.createBody({
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

  getWorldCenter() {
    return this.playerBody.getWorldCenter();
  }

  get health() {
    return this._health;
  }

  createPlayerUI() {
    this.playerUI = Stage.create().pin('handle', 0.5);
    this.playerUI.player = Stage.image('player').pin('handle', 0.5).appendTo(this._ui);
    this.playerUI.appendTo(this._ui);
    this.uiUpdate();
  }

  createBotUI() {

  }

  uiUpdate() {
    this.playerUI.offset(this);
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
      this.x = this._playerBody.x;
      this.y = this._playerBody.y;
      this.uiUpdate();
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
