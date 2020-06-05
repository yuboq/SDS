const {
  INITIAL_HEALTH,
  INITIAL_SICK_RATE,
  MIN_HEALTH,
  MAX_HEALTH,
  Vec2,
  rand,
  SPACE_HEIGHT,
  SPACE_WIDTH,
  WALLRADIUS,
  GOD_MODE
} = require('./sdsconsts.js');

class Player {
  constructor(playerBody, isHuman = false, activeKeys = [], playerIcon) {
    this._isHuman = isHuman;
    this._playerBody = playerBody;
    this._health = INITIAL_HEALTH;
    this._sickRate = INITIAL_SICK_RATE;
    this._activeKeys = activeKeys;
    this._playerIcon = playerIcon;
  }

  getWorldCenter() {
    return this.playerBody.getWorldCenter();
  }

  get health() {
    return this._health;
  }

  addHealth(amount = ((-1) * this._sickRate)) {
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

      this._playerIcon.pin ({
        handle: 0.5,
        alignX: this.getPosition().x,
        alignY: this.getPosition().y,

        //offsetX: ((this._playerBody.getPosition().x+ SPACE_WIDTH)/2.0)*(1000/(WALLRADIUS*2)),
        //offsetY: ((this._playerBody.getPosition().y) + SPACE_HEIGHT/2.0) * (1000/(WALLRADIUS*2)),
        rotation: this._playerBody.getAngle()
      })

      console.log (this._playerBody.getWorldPoint(Vec2 (0, 0.30)));
    }
  }

  updateBot(dt) {
    var f = this.getWorldVector(Vec2(rand(50) * (rand(1) > 0.5 ? 1 : -1), rand(50) * (rand(1) > 0.5 ? 1 : -1)));
    var p = this.getWorldCenter();
    this.applyLinearImpulse(f, p, true);
  }
}

module.exports = Player;
