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
