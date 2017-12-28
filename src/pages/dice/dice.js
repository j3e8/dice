floorsix.controller("/dice", function() {
  var dice = [
    Dice.createDie(),
    Dice.createDie()
  ];

  var BACKGROUND_COLOR = "#323232";

  var IDLE = 0;
  var ROLLING = 1;

  var ROLL_TIME = 1000;
  var ROLL_INTERVAL = 50;

  var CONTROLS_PCT = 0.2;
  var CONTROL_SIZE_PCT = 0.8;
  var MINUS_BUTTON_X = 0.33;
  var PLUS_BUTTON_X = 0.67;

  var phase = IDLE;
  var rollStart = null;
  var lastRollFrame = null;

  function animate(elapsedMs) {
    if (phase == ROLLING) {
      var now = new Date().getTime();
      if (!lastRollFrame || now - lastRollFrame >= ROLL_INTERVAL) {
        dice.forEach(function(die) {
          Dice.roll(die);
        });
        lastRollFrame = now;
      }
      if (now - rollStart >= ROLL_TIME) {
        phase = IDLE;
      }
    }
  }

  function render(canvas) {
    var ctx = canvas.context;

    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    var controlsHeight = determineControlsHeight(canvas);
    var area = {
      top: 0,
      left: 0,
      width: canvas.width,
      height: canvas.height - controlsHeight
    }
    var layout = determineLayout(area);

    var dieSize = Math.min(layout.cellWidth, layout.cellHeight) * 0.7;

    dice.forEach(function(die, i) {
      var cellY = Math.floor(i / layout.columns);
      var cellX = i - (cellY * layout.columns);
      var x = area.left + cellX * layout.cellWidth + layout.cellWidth / 2;
      var y = area.top + cellY * layout.cellHeight + layout.cellHeight / 2;
      Dice.renderDie(ctx, x, y, dieSize, die);
    });

    ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
    ctx.fillRect(0, canvas.height - controlsHeight, canvas.width, controlsHeight);

    var controlSize = controlsHeight * CONTROL_SIZE_PCT;
    ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    ctx.beginPath();
    ctx.arc(canvas.width*MINUS_BUTTON_X, canvas.height - controlsHeight/2, controlSize/2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(0, 0, 0, 0.15)";
    ctx.lineWidth = Math.round(controlSize*0.1);
    ctx.beginPath();
    ctx.moveTo(canvas.width*MINUS_BUTTON_X - controlSize*0.25, canvas.height - controlsHeight/2);
    ctx.lineTo(canvas.width*MINUS_BUTTON_X + controlSize*0.25, canvas.height - controlsHeight/2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(canvas.width*PLUS_BUTTON_X, canvas.height - controlsHeight/2, controlSize/2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(0, 0, 0, 0.15)";
    ctx.lineWidth = Math.round(controlSize*0.1);
    ctx.beginPath();
    ctx.moveTo(canvas.width*PLUS_BUTTON_X - controlSize*0.25, canvas.height - controlsHeight/2);
    ctx.lineTo(canvas.width*PLUS_BUTTON_X + controlSize*0.25, canvas.height - controlsHeight/2);
    ctx.moveTo(canvas.width*PLUS_BUTTON_X, canvas.height - controlsHeight/2 - controlSize*0.25);
    ctx.lineTo(canvas.width*PLUS_BUTTON_X, canvas.height - controlsHeight/2 + controlSize*0.25);
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#ffffff";
    ctx.font = Math.round(controlsHeight*0.8) + "px Avenir";
    ctx.fillText(dice.length, canvas.width/2, canvas.height - controlsHeight/2);
  }

  function handleTouchStart(x, y) { }

  function handleTouchMove(x, y) { }

  function handleTouchEnd(x, y) {
    var size = floorsix.getCanvasSize();
    var controlsHeight = determineControlsHeight(size);
    if (y >= size.height - controlsHeight) {
      if (hitTest(x, y, size.width * MINUS_BUTTON_X, size.height - controlsHeight / 2, controlsHeight*0.8)) {
        removeDie();
      }
      else if (hitTest(x, y, size.width * PLUS_BUTTON_X, size.height - controlsHeight / 2, controlsHeight*0.8)) {
        addDie();
      }
      return;
    }
    else {
      phase = ROLLING;
      rollStart = new Date().getTime();
    }
  }

  function hitTest(x, y, cx, cy, diameter) {
    var r = diameter/2;
    var sqd = (x - cx)*(x - cx) - (y - cy)*(y - cy);
    if (sqd <= r * r) {
      return true;
    }
    return false;
  }

  function removeDie() {
    if (dice.length > 1) {
      dice.pop();
    }
  }

  function addDie() {
    if (dice.length < 12) {
      dice.push(Dice.createDie());
    }
  }

  function determineControlsHeight(canvas) {
    return Math.min(canvas.width, canvas.height) * CONTROLS_PCT;
  }

  function determineLayout(area) {
    var layout = {
      rows: 1,
      columns: 1
    }

    while (layout.rows * layout.columns < dice.length) {
      var addRowAspect = (area.width / layout.columns) / (area.height / (layout.rows + 1));
      var addColumnAspect = (area.width / (layout.columns + 1)) / (area.height / layout.rows);

      if (Math.abs(addRowAspect - 1) < Math.abs(addColumnAspect - 1)) {
        layout.rows++;
      }
      else {
        layout.columns++;
      }
    }
    layout.cellWidth = area.width / layout.columns;
    layout.cellHeight = area.height / layout.rows;
    layout.cellAspect = layout.cellWidth / layout.cellHeight;

    return layout;
  }

  return {
    'animate': animate,
    'render': render,
    'touchstart': handleTouchStart,
    'touchmove': handleTouchMove,
    'touchend': handleTouchEnd
  }
});
