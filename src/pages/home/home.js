floorsix.controller("/", function() {
  var BACKGROUND_COLOR = "#323232";
  var PADDING_PCT = 0.08;
  var TOP_PADDING_PCT = 0.5;

  function animate(elapsedMs) { }

  function render(canvas) {
    var ctx = canvas.context;
    var iconWidth = canvas.width * 0.2;

    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    renderDiceIcon(ctx, PADDING_PCT * canvas.width + iconWidth / 2, TOP_PADDING_PCT * canvas.height + iconWidth / 2, iconWidth);
  }

  function renderDiceIcon(ctx, cx, cy, size) {
    var r = size/2;
    var br = r * 0.15;
    var dotSize = size/14;
    var diceColor = "#A1D65C";
    var dotColor = "#5C9605";

    function renderDot(ctx, cx, cy, dotSize) {
      ctx.fillStyle = dotColor;
      ctx.beginPath();
      ctx.arc(cx, cy, dotSize, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = diceColor;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.beginPath();
    ctx.moveTo(0 - r + br, 0 - r);
    ctx.lineTo(0 + r - br, 0 - r);
    ctx.arc(0 + r - br, 0 - r + br, br, -Math.PI/2, 0);
    ctx.lineTo(0 + r, 0 + r - br);
    ctx.arc(0 + r - br, 0 + r - br, br, 0, Math.PI/2);
    ctx.lineTo(0 - r + br, 0 + r);
    ctx.arc(0 - r + br, 0 + r - br, br, Math.PI/2, Math.PI);
    ctx.lineTo(0 - r, 0 - r + br);
    ctx.arc(0 - r + br, 0 - r + br, br, Math.PI, Math.PI*1.5);
    ctx.fill();

    var lx = 0 - size * 0.23;
    var rx = 0 + size * 0.23;
    var ty = 0 - size * 0.24;
    var by = 0 + size * 0.24;

    renderDot(ctx, 0, 0, dotSize);
    renderDot(ctx, lx, ty, dotSize);
    renderDot(ctx, lx, by, dotSize);
    renderDot(ctx, rx, ty, dotSize);
    renderDot(ctx, rx, by, dotSize);

    var fontSize = Math.round(size * 0.2);
    ctx.fillStyle = "#ffffff";
    ctx.font = fontSize + "px Avenir";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText("Dice", 0, size/2 + fontSize * 1.5);
    ctx.restore();
  }

  function handleTouchStart(x, y) { }

  function handleTouchMove(x, y) { }

  function handleTouchEnd(x, y) { }


  return {
    'animate': animate,
    'render': render,
    'touchstart': handleTouchStart,
    'touchmove': handleTouchMove,
    'touchend': handleTouchEnd
  }
});
