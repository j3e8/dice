floorsix.controller("/spinner", function() {
  var choices = [
    Choice.createChoice('1', '#A1D65C'),
    Choice.createChoice('2', '#23C1CC'),
    Choice.createChoice('3', '#A23BC4'),
    Choice.createChoice('4', '#D14336')
  ];

  var BACKGROUND_COLOR = "#323232";
  var ROTATION_PER_MS = 0.03;

  var IDLE = 0;
  var SPINNING = 1;
  var phase = IDLE;
  var highlight = false;

  var rotation = 0;
  var currentSpin = 0;
  var totalSpin = 0;

  function animate(elapsedMs) {
    if (phase == SPINNING) {
      var spin = ROTATION_PER_MS * elapsedMs;
      rotation += spin;
      if (rotation >= Math.PI * 2) {
        rotation -= Math.PI * 2;
      }
      currentSpin += spin;
      if (currentSpin >= totalSpin) {
        var diff = currentSpin - totalSpin;
        rotation -= diff;
        currentSpin -= diff;
        phase = IDLE;
        highlight = true;
      }
    }
  }

  function render(canvas) {
    var ctx = canvas.context;

    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    var cx = canvas.width / 2;
    var cy = canvas.height / 2;
    var spinnerRadius = Math.min(canvas.width, canvas.height) * 0.9 / 2;
    var labelInsidePadding = spinnerRadius * 0.25;
    var labelOutsidePadding = spinnerRadius * 0.1;
    var labelFontSize = spinnerRadius * 0.6;

    // determine font size
    ctx.font = labelFontSize + "px Avenir";
    choices.forEach(function(choice) {
      var size = ctx.measureText(choice.value);
      var allowedWidth = spinnerRadius - (labelInsidePadding + labelOutsidePadding);
      if (size.width > allowedWidth) {
        labelFontSize *= allowedWidth / size.width;
      }
    });

    // render
    ctx.save();
    ctx.translate(cx, cy);
    var choiceAngleSize = Math.PI * 2 / choices.length;
    ctx.rotate(-choiceAngleSize / 2);
    choices.forEach(function(choice, i) {
      if (phase == IDLE && highlight && !isHighlightedChoice(i)) {
        ctx.globalAlpha = 0.2;
      }
      else {
        ctx.globalAlpha = 1;
      }
      ctx.save();
      ctx.rotate(rotation + i * choiceAngleSize);
      ctx.fillStyle = choice.color;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(spinnerRadius, 0);
      ctx.arc(0, 0, spinnerRadius, 0, choiceAngleSize);
      ctx.lineTo(0, 0);
      ctx.fill();

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#000";
      ctx.font = labelFontSize + "px Avenir";
      ctx.rotate(Math.PI/4);
      ctx.fillText(choice.value, labelInsidePadding + (spinnerRadius - (labelInsidePadding + labelOutsidePadding))/2, 0);

      ctx.restore();
    });
    ctx.restore();

    // the pointer
    ctx.save();
    ctx.translate(cx, cy);
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.moveTo(spinnerRadius * 0.8, 0);
    ctx.lineTo(spinnerRadius * 1.05, -spinnerRadius*0.1);
    ctx.lineTo(spinnerRadius * 1.05, +spinnerRadius*0.1);
    ctx.lineTo(spinnerRadius * 0.8, 0);
    ctx.fill();
    ctx.restore();
  }

  function isHighlightedChoice(choiceIndex) {
    var choiceAngleSize = Math.PI * 2 / choices.length;
    var s = choiceIndex * choiceAngleSize - choiceAngleSize / 2;
    var s2 = s + Math.PI * 2;
    var e = (choiceIndex + 1) * choiceAngleSize - choiceAngleSize / 2;
    var e2 = e + Math.PI * 2;
    var reverse = Math.PI * 2 - rotation;
    if ((s <= reverse && reverse < e) || (Math.min(s, e) < 0 && s2 <= reverse && reverse < e2)) {
      return true;
    }
    return false;
  }

  function handleTouchStart(x, y) { }

  function handleTouchMove(x, y) { }

  function handleTouchEnd(x, y) {
    if (phase == IDLE) {
      phase = SPINNING;
      totalSpin = Math.random() * Math.PI * 2 + Math.PI * 6;
      currentSpin = 0;
      highlight = false;
    }
  }


  return {
    'animate': animate,
    'render': render,
    'touchstart': handleTouchStart,
    'touchmove': handleTouchMove,
    'touchend': handleTouchEnd
  }
});
