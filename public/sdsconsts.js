module.exports = {
    INITIAL_HEALTH: 100,
    INITIAL_SICK_RATE: 1,
    MAX_HEALTH: 100,
    MIN_HEALTH: 0,
    PLAYER: 2,
    WALLS: 4,
    SPACE_WIDTH: 16,
    SPACE_HEIGHT: 9,
    NUMSTEPS: 100,
    BOT_NUM: 5,

    SIZE: 0.30,
    WALLRADIUS: 5,
    pl: planck,
    Vec2: planck.Vec2,
    rand: function(value) {
      return (Math.random() - 0.5) * (value || 1);
    }
}
