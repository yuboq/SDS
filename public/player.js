const {
  INITIAL_HEALTH,
  INITIAL_SICK_RATE,
  MIN_HEALTH,
  MAX_HEALTH
} = require('./sdsconsts.js');

class Player {

  constructor(playerBody) {
    this._playerBody = playerBody;
    this._health = INITIAL_HEALTH;
    this._sickRate = INITIAL_SICK_RATE;
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
}

module.exports = Player;