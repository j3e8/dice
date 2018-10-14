floorsix.controller("/", function() {
  var BACKGROUND_COLOR = "#323232";
  var PADDING_PCT = 0.08;
  var COLUMNS = 3;

  var canvasSize = floorsix.getCanvasSize();
  var padding = PADDING_PCT * canvasSize.width;
  var vpadding = PADDING_PCT * canvasSize.width * 2;
  var iconWidth = ((canvasSize.width - padding) / COLUMNS) - padding;

  var dice6Icon = FImageButton.create('www/images/dice6icon.svg', { x: padding, y: vpadding }, { width: iconWidth });
  var dice4Icon = FImageButton.create('www/images/dice4icon.svg', { x: padding + (iconWidth + padding), y: vpadding }, { width: iconWidth });
  var dice4Icon = FImageButton.create('www/images/dice4icon.svg', { x: padding + (iconWidth + padding), y: vpadding }, { width: iconWidth });
  var dice8Icon = FImageButton.create('www/images/dice8icon.svg', { x: padding + (iconWidth + padding) * 2, y: vpadding }, { width: iconWidth });

  var dice10Icon = FImageButton.create('www/images/dice10icon.svg', { x: padding, y: vpadding + (iconWidth + vpadding) }, { width: iconWidth });
  var dice12Icon = FImageButton.create('www/images/dice12icon.svg', { x: padding + (iconWidth + padding), y: vpadding + (iconWidth + vpadding) }, { width: iconWidth });
  var dice20Icon = FImageButton.create('www/images/dice20icon.svg', { x: padding + (iconWidth + padding) * 2, y: vpadding + (iconWidth + vpadding) }, { width: iconWidth });

  function animate(elapsedMs) { }

  function render(canvas) {
    var ctx = canvas.context;

    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.font = Math.floor(iconWidth * 0.18) + "px Avenir";

    FImageButton.render(ctx, dice6Icon);
    ctx.fillText('6 sided', dice6Icon.x + iconWidth/2, dice6Icon.y + iconWidth);

    FImageButton.render(ctx, dice4Icon);
    ctx.fillText('4 sided', dice4Icon.x + iconWidth/2, dice4Icon.y + iconWidth);

    FImageButton.render(ctx, dice8Icon);
    ctx.fillText('8 sided', dice8Icon.x + iconWidth/2, dice8Icon.y + iconWidth);

    FImageButton.render(ctx, dice10Icon);
    ctx.fillText('10 sided', dice10Icon.x + iconWidth/2, dice10Icon.y + iconWidth);

    FImageButton.render(ctx, dice12Icon);
    ctx.fillText('12 sided', dice12Icon.x + iconWidth/2, dice12Icon.y + iconWidth);

    FImageButton.render(ctx, dice20Icon);
    ctx.fillText('20 sided', dice20Icon.x + iconWidth/2, dice20Icon.y + iconWidth);
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
    if (FImageButton.hitTest(dice20Icon, x, y)) {
      floorsix.navigate('/dice?type=TWENTY');
      return;
    }
  }

  return {
    'animate': animate,
    'render': render,
    'click': handleClick
  }
});
