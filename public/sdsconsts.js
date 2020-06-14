module.exports = {
    INITIAL_HEALTH : 100,
    INITIAL_SICK_RATE : 1,
    MAX_HEALTH : 100,
    MIN_HEALTH : 0,
    pl : planck,
    Vec2 : planck.Vec2,
    rand : function(value) {
      return (Math.random() - 0.5) * (value || 1);
    },
    SPACE_WIDTH: 16,
    SPACE_HEIGHT: 9,
    BOT_NUM: 5,
    CIRCLE_RESOLUTION : 100,
    SIZE : 0.30,
    WALL_RADIUS : 5,
    WORLD_WIDTH: 1000,
    WORLD_HEIGHT: 1000,
    GOD_MODE: true,

    KEY_NAMES : {
      32: 'space',
      37: 'right',
      38: 'up',
      39: 'left',
      40: 'down'
    }
};