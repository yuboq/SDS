const {
  INITIAL_HEALTH,
  INITIAL_SICK_RATE,
  MIN_HEALTH,
  MAX_HEALTH,
  Vec2,
  rand,
  GOD_MODE
} = require('./sdsconsts.js');

class Player {
  constructor(playerBody, isHuman = false, activeKeys = []) {
    this._isHuman = isHuman;
    this._playerBody = playerBody;
    this._health = INITIAL_HEALTH;
    this._sickRate = INITIAL_SICK_RATE;
    this._activeKeys = activeKeys;
    this._playerIcon = Stage.image(isHuman? 'human' : 'bot')
      .appendTo(window.world);
    this._playerIcon.pin({scale: 0.00065, handle: 0.5})
  }

  getWorldCenter() {
    return this.playerBody.getWorldCenter();
  }

  get health() {
    return this._health;
  }

  addHealth(amount = ((-1) * this._sickRate)) {
    debugger;
    if (GOD_MODE) {
      this._health = 100;
      return;
    }
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
    this.updateIcon();
  }

  updateIcon() {
    this._playerIcon.pin ({
      offsetX: this.getPosition().x,
      offsetY: this.getPosition().y,
      rotation: this._playerBody.getAngle()
    })
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
      } else if (this._activeKeys.down && !this._activeKeys.up) {
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
