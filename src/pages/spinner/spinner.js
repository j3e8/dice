floorsix.controller("/spinner", function() {
  var BACKGROUND_COLOR = "#323232";

  var IDLE = 0;
  var SPINNING = 1;
  var phase = IDLE;
  var choiceToEdit;

  var MODE_PLAY = 10;
  var MODE_EDIT = 11;
  var mode = MODE_PLAY;

  var rotation = 0;
  var currentSpin = 0;
  var totalSpin = 0;

  var canvasSize = floorsix.getCanvasSize();
  var spinnerRadius = Math.min(canvasSize.width, canvasSize.height) * 0.9 / 2;
  var spinner = Spinner.create(canvasSize.width/2, canvasSize.height * 0.4, spinnerRadius, canvasSize.width/2, canvasSize.height * 0.05 + (spinnerRadius * 0.8), spinnerRadius * 0.8);
  Spinner.addChoice(spinner, Choice.createChoice('1', '#A1D65C'));
  Spinner.addChoice(spinner, Choice.createChoice('2', '#23C1CC'));
  Spinner.addChoice(spinner, Choice.createChoice('3', '#A23BC4'));
  Spinner.addChoice(spinner, Choice.createChoice('4', '#D14336'));

  var backButton = FImageButton.create('www/images/back.svg', { x: canvasSize.width * 0.02, y: canvasSize.width * 0.02 }, { width: canvasSize.width * 0.1 });
  var iconSize = Math.min(canvasSize.width, canvasSize.height) * 0.2;
  var settingsButton = FImageButton.create('www/images/settings.svg', { x: canvasSize.width / 2 - iconSize / 2, y: canvasSize.height - iconSize * 1.1 }, { width: iconSize });
  var doneButton = FImageButton.create('www/images/done.svg', { x: canvasSize.width / 2 - iconSize / 2, y: canvasSize.height - iconSize * 1.1 }, { width: iconSize });

  var sliderHeight = canvasSize.height * 0.05;
  var sliderY = canvasSize.height * 0.1 + spinnerRadius * 0.8 * 2 + canvasSize.height * 0.1;
  var hueSlider = FGradientSlider.create({ x: canvasSize.width * 0.05, y: sliderY }, { width: canvasSize.width * 0.9, height: sliderHeight }, FGradientSlider.Types.HUE);
    sliderY += sliderHeight * 1.5;
  var lightnessSlider = FGradientSlider.create({ x: canvasSize.width * 0.05, y: sliderY }, { width: canvasSize.width * 0.9, height: sliderHeight }, FGradientSlider.Types.LIGHTNESS);
    sliderY += sliderHeight * 1.5;
  var saturationSlider = FGradientSlider.create({ x: canvasSize.width * 0.05, y: sliderY }, { width: canvasSize.width * 0.9, height: sliderHeight }, FGradientSlider.Types.SATURATION);

  function animate(elapsedMs) {
    if (phase == SPINNING) {
      Spinner.animate(elapsedMs, spinner);
      if (!Spinner.isSpinning(spinner)) {
        phase = IDLE;
      }
    }
  }

  function render(canvas) {
    var ctx = canvas.context;

    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    Spinner.render(ctx, spinner);

    if (mode == MODE_PLAY) {
      renderPointer(canvas, spinner.x, spinner.y, spinner.radius);
    }

    if (mode == MODE_EDIT) {
      renderEditLabel(canvas, spinner.editY + spinner.editRadius + canvas.height * 0.03);
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

  function selectChoice(choice) {
    Spinner.selectChoice(spinner, choice);
    choiceToEdit = choice;
    FGradientSlider.setColor(hueSlider, choice.color);
    FGradientSlider.setColor(saturationSlider, choice.color);
    FGradientSlider.setColor(lightnessSlider, choice.color);
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
      Spinner.edit(spinner);
      selectChoice(spinner.choices[0]);
      return;
    }
    else if (mode == MODE_EDIT && FImageButton.hitTest(doneButton, x, y)) {
      Spinner.finishEdit(spinner);
      mode = MODE_PLAY;
      return;
    }

    if (mode == MODE_EDIT) {
      for (var i=0; i < spinner.choices.length; i++) {
        if (Choice.hitTest(spinner.choices[i], spinner.editX, spinner.editY, spinner.rotation, spinner.editRadius, x, y)) {
          selectChoice(spinner.choices[i]);
          break;
        }
      }
      var inp = document.createElement("input");
      inp.type = "text";
      inp.style.display = "none";
      document.body.appendChild(inp);
      inp.focus();
    }
    else if (mode == MODE_PLAY && phase == IDLE) {
      Spinner.spin(spinner);
      phase = SPINNING;
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
    Choice.setColor(choiceToEdit, FColor.toString(newColor));
    FGradientSlider.setColor(hueSlider, choiceToEdit.color);
    FGradientSlider.setColor(saturationSlider, choiceToEdit.color);
    FGradientSlider.setColor(lightnessSlider, choiceToEdit.color);
  }

  function recalculateSaturation(pct) {
    var currentColor = FColor.createFromString(choiceToEdit.color);
    var hsl = FColor.toHSL(currentColor);
    hsl.s = (1 - pct) * 1;
    var newColor = FColor.createFromHSL(hsl);
    Choice.setColor(choiceToEdit, FColor.toString(newColor));
    FGradientSlider.setColor(hueSlider, choiceToEdit.color);
    FGradientSlider.setColor(saturationSlider, choiceToEdit.color);
    FGradientSlider.setColor(lightnessSlider, choiceToEdit.color);
  }

  function recalculateLightness(pct) {
    var currentColor = FColor.createFromString(choiceToEdit.color);
    var hsl = FColor.toHSL(currentColor);
    hsl.l = (1 - pct) * 1;
    var newColor = FColor.createFromHSL(hsl);
    Choice.setColor(choiceToEdit, FColor.toString(newColor));
    FGradientSlider.setColor(hueSlider, choiceToEdit.color);
    FGradientSlider.setColor(saturationSlider, choiceToEdit.color);
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
