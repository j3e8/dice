floorsix.controller("/", function() {
  var BACKGROUND_COLOR = "#323232";
  var PADDING_PCT = 0.08;
  var COLUMNS = 3;

  var canvasSize = floorsix.getCanvasSize();
  var padding = PADDING_PCT * canvasSize.width;
  var iconWidth = ((canvasSize.width - padding) / COLUMNS) - padding;

  var _icon4size = iconWidth * 1.2;
  var _icon4offset =  (_icon4size - iconWidth) / 2;
  var dice4Icon = FImageButton.create('www/images/dice4.svg', { x: padding - _icon4offset, y: padding - _icon4offset }, { width: iconWidth * 1.2 });
  var dice6Icon = FImageButton.create('www/images/dice6.svg', { x: padding + (iconWidth + padding), y: padding }, { width: iconWidth });

  function animate(elapsedMs) { }

  function render(canvas) {
    var ctx = canvas.context;
    var iconWidth = canvas.width * 0.2;

    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    FImageButton.render(ctx, dice4Icon);
    FImageButton.render(ctx, dice6Icon);
  }

  function handleClick(x, y) {
    if (FImageButton.hitTest(dice4Icon, x, y)) {
      floorsix.navigate('/dice?type=FOUR');
      return;
    }
    if (FImageButton.hitTest(dice6Icon, x, y)) {
      floorsix.navigate('/dice?type=SIX');
      return;
    }
  }

  return {
    'animate': animate,
    'render': render,
    'click': handleClick
  }
});
