floorsix.controller("/", function() {
  var BACKGROUND_COLOR = "#323232";
  var PADDING_PCT = 0.08;
  var COLUMNS = 3;

  var canvasSize = floorsix.getCanvasSize();
  var padding = PADDING_PCT * canvasSize.width;
  var iconWidth = ((canvasSize.width - padding) / COLUMNS) - padding;

  var _icon4size = iconWidth * 1.2;
  var _icon4offset =  (_icon4size - iconWidth) / 2;
  var dice4Icon = FImageButton.create('www/images/dice4icon.svg', { x: padding - _icon4offset, y: padding - _icon4offset }, { width: iconWidth * 1.2 });
  var dice6Icon = FImageButton.create('www/images/dice6icon.svg', { x: padding + (iconWidth + padding), y: padding }, { width: iconWidth });
  var dice8Icon = FImageButton.create('www/images/dice8icon.svg', { x: padding + (iconWidth + padding) * 2, y: padding }, { width: iconWidth });
  var dice10Icon = FImageButton.create('www/images/dice10icon.svg', { x: padding, y: padding + (iconWidth + padding) }, { width: iconWidth });
  var dice12Icon = FImageButton.create('www/images/dice12icon.svg', { x: padding + (iconWidth + padding), y: padding + (iconWidth + padding) }, { width: iconWidth });

  function animate(elapsedMs) { }

  function render(canvas) {
    var ctx = canvas.context;
    var iconWidth = canvas.width * 0.2;

    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    FImageButton.render(ctx, dice4Icon);
    FImageButton.render(ctx, dice6Icon);
    FImageButton.render(ctx, dice8Icon);
    FImageButton.render(ctx, dice10Icon);
    FImageButton.render(ctx, dice12Icon);
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
    if (FImageButton.hitTest(dice8Icon, x, y)) {
      floorsix.navigate('/dice?type=EIGHT');
      return;
    }
    if (FImageButton.hitTest(dice10Icon, x, y)) {
      floorsix.navigate('/dice?type=TEN');
      return;
    }
    if (FImageButton.hitTest(dice12Icon, x, y)) {
      floorsix.navigate('/dice?type=TWELVE');
      return;
    }
  }

  return {
    'animate': animate,
    'render': render,
    'click': handleClick
  }
});
