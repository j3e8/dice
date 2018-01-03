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
  var choiceToEdit;

  var MODE_PLAY = 10;
  var MODE_EDIT = 11;
  var mode = MODE_PLAY;

  var rotation = 0;
  var currentSpin = 0;
  var totalSpin = 0;

  var canvasSize = floorsix.getCanvasSize();
  var backButton = FImageButton.create('www/images/back.svg', { x: canvasSize.width * 0.02, y: canvasSize.width * 0.02 }, { width: canvasSize.width * 0.1 });
  var iconSize = Math.min(canvasSize.width, canvasSize.height) * 0.2;
  var settingsButton = FImageButton.create('www/images/settings.svg', { x: canvasSize.width / 2 - iconSize / 2, y: canvasSize.height - iconSize * 1.1 }, { width: iconSize });
  var doneButton = FImageButton.create('www/images/done.svg', { x: canvasSize.width / 2 - iconSize / 2, y: canvasSize.height - iconSize * 1.1 }, { width: iconSize });

  var spinnerRadius = Math.min(canvasSize.width, canvasSize.height) * 0.9 / 2;
  var sliderHeight = canvasSize.height * 0.05;
  var sliderY = canvasSize.height * 0.1 + spinnerRadius * 0.8 * 2 + canvasSize.height * 0.1;
  var hueSlider = FGradientSlider.create({ x: canvasSize.width * 0.05, y: sliderY }, { width: canvasSize.width * 0.9, height: sliderHeight }, FGradientSlider.Types.HUE);
    sliderY += sliderHeight * 1.5;
  var lightnessSlider = FGradientSlider.create({ x: canvasSize.width * 0.05, y: sliderY }, { width: canvasSize.width * 0.9, height: sliderHeight }, FGradientSlider.Types.LIGHTNESS);
    sliderY += sliderHeight * 1.5;
  var saturationSlider = FGradientSlider.create({ x: canvasSize.width * 0.05, y: sliderY }, { width: canvasSize.width * 0.9, height: sliderHeight }, FGradientSlider.Types.SATURATION);

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

    var radius = spinnerRadius;
    var cx = canvas.width * 0.5;
    var cy = canvas.height * 0.4;
    if (mode == MODE_EDIT) {
      radius *= 0.8;
      cy = canvas.height * 0.05 + radius;
    }
    var labelInsidePadding = radius * 0.25;
    var labelOutsidePadding = radius * 0.1;
    var labelFontSize = radius * 0.6;

    // determine font size
    ctx.font = labelFontSize + "px Avenir";
    choices.forEach(function(choice) {
      var size = ctx.measureText(choice.value);
      var allowedWidth = radius - (labelInsidePadding + labelOutsidePadding);
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
      ctx.lineTo(radius, 0);
      ctx.arc(0, 0, radius, 0, choiceAngleSize);
      ctx.lineTo(0, 0);
      ctx.fill();

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      var color = FColor.createFromString(choice.color);
      var hsl = FColor.toHSL(color);
      if (hsl.l >= 0.5) {
        ctx.fillStyle = "#000";
      }
      else {
        ctx.fillStyle = "#fff";
      }
      ctx.font = labelFontSize + "px Avenir";
      ctx.rotate(Math.PI/4);
      ctx.fillText(choice.value, labelInsidePadding + (radius - (labelInsidePadding + labelOutsidePadding))/2, 0);

      // remove icon
      if (mode == MODE_EDIT) {

      }

      ctx.restore();
    });
    ctx.restore();

    if (mode == MODE_PLAY) {
      renderPointer(canvas, cx, cy, radius);
    }

    if (mode == MODE_EDIT) {
      renderEditLabel(canvas, canvas.height * 0.08 + radius * 2);
      FGradientSlider.render(ctx, hueSlider);
      FGradientSlider.render(ctx, lightnessSlider);
      FGradientSlider.render(ctx, saturationSlider);
    }

    renderIcons(canvas);
  }

  function renderPointer(canvas, cx, cy, spinnerRadius) {
    var ctx = canvas.context;
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

  function renderEditLabel(canvas, y) {
    var fs = canvas.width * 0.1;
    var ctx = canvas.context;
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.font = fs + "px Avenir";
    var w = ctx.measureText(choiceToEdit.value).width;
    if (w > canvas.width * 0.9) {
      var diff = w - canvas.width * 0.9;
      fs *= diff / w;
      ctx.font = fs + "px Avenir";
    }
    ctx.fillText(choiceToEdit.value, canvas.width / 2, y);
  }

  function renderIcons(canvas) {
    var ctx = canvas.context;
    if (mode == MODE_EDIT && doneButton.loaded) {
      FImageButton.render(ctx, doneButton);
    }
    else if (mode == MODE_PLAY && settingsButton.loaded) {
      FImageButton.render(ctx, settingsButton);
    }

    FImageButton.render(ctx, backButton);
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

  function handleClick(x, y) {
    floorsix.log('handleClick ' + x + ',' + y);
    if (FImageButton.hitTest(backButton, x, y)) {
      floorsix.navigate('/');
      return;
    }

    if (mode == MODE_PLAY && FImageButton.hitTest(settingsButton, x, y)) {
      mode = MODE_EDIT;
      phase = IDLE;
      rotation = 0;
      highlight = true;
      choiceToEdit = choices[0];
      FGradientSlider.setColor(hueSlider, choiceToEdit.color);
      FGradientSlider.setColor(saturationSlider, choiceToEdit.color);
      FGradientSlider.setColor(lightnessSlider, choiceToEdit.color);
      return;
    }
    else if (mode == MODE_EDIT && FImageButton.hitTest(doneButton, x, y)) {
      mode = MODE_PLAY;
      return;
    }

    if (mode == MODE_EDIT) {
      var inp = document.createElement("input");
      inp.type = "text";
      inp.style.display = "none";
      document.body.appendChild(inp);
      inp.focus();
    }
    else if (mode == MODE_PLAY && phase == IDLE) {
      phase = SPINNING;
      totalSpin = Math.random() * Math.PI * 2 + Math.PI * 6;
      currentSpin = 0;
      highlight = false;
    }
  }

  var dragObject = null;

  function handleMouseDown(x, y) {
    mousedown(x, y);
  }

  function handleTouchStart(pts) {
    var pt = pts[0];
    mousedown(pt.x, pt.y);
  }

  function mousedown(x, y) {
    if (FGradientSlider.hitTest(hueSlider, x, y)) {
      var pct = FGradientSlider.calculateXPercentage(hueSlider, x, y);
      if (pct !== null) {
        dragObject = hueSlider;
        recalculateHue(pct);
      }
    }
    else if (FGradientSlider.hitTest(saturationSlider, x, y)) {
      var pct = FGradientSlider.calculateXPercentage(saturationSlider, x, y);
      if (pct !== null) {
        dragObject = saturationSlider;
        recalculateSaturation(pct);
      }
    }
    else if (FGradientSlider.hitTest(lightnessSlider, x, y)) {
      var pct = FGradientSlider.calculateXPercentage(lightnessSlider, x, y);
      if (pct !== null) {
        dragObject = lightnessSlider;
        recalculateLightness(pct);
      }
    }
  }



  function handleMouseMove(x, y) {
    mousemove(x, y);
  }

  function handleTouchMove(pts) {
    var pt = pts[0];
    mousemove(pt.x, pt.y);
  }

  function mousemove(x, y) {
    if (dragObject == hueSlider) {
      var pct = FGradientSlider.calculateXPercentage(hueSlider, x, y);
      if (pct != null) {
        recalculateHue(pct);
      }
    }
    else if (dragObject == saturationSlider) {
      var pct = FGradientSlider.calculateXPercentage(saturationSlider, x, y);
      if (pct != null) {
        recalculateSaturation(pct);
      }
    }
    else if (dragObject == lightnessSlider) {
      var pct = FGradientSlider.calculateXPercentage(lightnessSlider, x, y);
      if (pct != null) {
        recalculateLightness(pct);
      }
    }
  }



  function handleMouseUp(x, y) {
    up(x, y);
  }

  function handleTouchEnd(pts) {
    var pt = pts[0];
    up(pt.x, pt.y);
  }

  function up(x, y) {
    if (dragObject == hueSlider) {
      var pct = FGradientSlider.calculateXPercentage(hueSlider, x, y);
      if (pct !== null) {
        recalculateHue(pct);
      }
    }
    else if (dragObject == saturationSlider) {
      var pct = FGradientSlider.calculateXPercentage(saturationSlider, x, y);
      if (pct !== null) {
        recalculateSaturation(pct);
      }
    }
    else if (dragObject == lightnessSlider) {
      var pct = FGradientSlider.calculateXPercentage(lightnessSlider, x, y);
      if (pct !== null) {
        recalculateLightness(pct);
      }
    }
    dragObject = null;
  }

  function recalculateHue(pct) {
    var currentColor = FColor.createFromString(choiceToEdit.color);
    var hsl = FColor.toHSL(currentColor);
    hsl.h = pct * 360;
    var newColor = FColor.createFromHSL(hsl);
    choiceToEdit.color = FColor.toString(newColor);
    FGradientSlider.setColor(hueSlider, choiceToEdit.color);
  }

  function recalculateSaturation(pct) {
    var currentColor = FColor.createFromString(choiceToEdit.color);
    var hsl = FColor.toHSL(currentColor);
    hsl.s = (1 - pct) * 1;
    var newColor = FColor.createFromHSL(hsl);
    choiceToEdit.color = FColor.toString(newColor);
    FGradientSlider.setColor(saturationSlider, choiceToEdit.color);
  }

  function recalculateLightness(pct) {
    var currentColor = FColor.createFromString(choiceToEdit.color);
    var hsl = FColor.toHSL(currentColor);
    hsl.l = (1 - pct) * 1;
    var newColor = FColor.createFromHSL(hsl);
    choiceToEdit.color = FColor.toString(newColor);
    FGradientSlider.setColor(lightnessSlider, choiceToEdit.color);
  }

  return {
    'animate': animate,
    'render': render,
    'click': handleClick,
    'mousedown': handleMouseDown,
    'mousemove': handleMouseMove,
    'mouseup': handleMouseUp,
    'touchstart': handleTouchStart,
    'touchmove': handleTouchMove,
    'touchend': handleTouchEnd
  }
});
