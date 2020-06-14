
const Physics = require ('./physics.js');
const InputHandler = require ('./inputs.js');


Stage(function (stage) {


  var physics = new Physics({
    startGame: startGame,
    endGame: endGame,
    activeKeys: InputHandler.getActiveKeys()
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

  window.world = world;

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

  function startGame(old_start) {

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
    world.empty();
    endScreen.show();
  }


});
Stage({
  name : 'player',
  image : './images/players.png',
  textures : {
    human : { x : 0, y : 0, width : 1000, height : 1000 },
    bot : { x : 1100, y : 0, width : 1000, height : 1000 },
  }
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
