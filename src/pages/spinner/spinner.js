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

  var settingsImage = FImage.create('www/images/settings.svg');
  var doneImage = FImage.create('www/images/done.svg');

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

    var cx = canvas.width * 0.5;
    var cy = canvas.height * 0.4;
    var spinnerRadius = Math.min(canvas.width, canvas.height) * 0.9 / 2;
    if (mode == MODE_EDIT) {
      spinnerRadius *= 0.8;
      cy = canvas.height * 0.05 + spinnerRadius;
    }
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

      // remove icon
      if (mode == MODE_EDIT) {

      }

      ctx.restore();
    });
    ctx.restore();

    if (mode == MODE_PLAY) {
      renderPointer(canvas, cx, cy, spinnerRadius);
    }

    if (mode == MODE_EDIT) {
      renderEditLabel(canvas, canvas.height * 0.08 + spinnerRadius * 2);
      renderEditColors(canvas, canvas.height * 0.1 + spinnerRadius * 2 + canvas.height * 0.1, canvas.height * 0.05);
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

  function renderEditColors(canvas, y, h) {
    var ctx = canvas.context;
    var color = FColor.createFromHex(choiceToEdit.color);

    ctx.fillStyle = FColor.toString(color);

    renderHuePicker(canvas, y, h);
    renderLightnessPicker(canvas, y + h * 1.5, h);
    renderSaturationPicker(canvas, y + h * 3, h);
  }

  function renderHuePicker(canvas, y, h) {
    var ctx = canvas.context;
    var x = canvas.width * 0.05;
    var w = canvas.width * 0.9;
    var grd = ctx.createLinearGradient(x,y,w,y);
    grd.addColorStop(0,"#ff0000");
    grd.addColorStop(1/6,"#ffff00");
    grd.addColorStop(2/6,"#00ff00");
    grd.addColorStop(3/6,"#00ffff");
    grd.addColorStop(4/6,"#0000ff");
    grd.addColorStop(5/6,"#ff00ff");
    grd.addColorStop(1,"#ff0000");
    ctx.fillStyle = grd;
    ctx.fillRect(x, y, w, h);

    var color = FColor.createFromHex(choiceToEdit.color);
    var hsl = FColor.toHSL(color);
    renderCarat(canvas, x + (hsl.h/360)*w, y, h, h*0.2);
  }

  function renderLightnessPicker(canvas, y, h) {
    var color = FColor.createFromHex(choiceToEdit.color);
    var hsl = FColor.toHSL(color);
    var hsl2 = Object.assign({}, hsl, { l: 1 });
    var fullLightness = FColor.createFromHSL(hsl2);

    var ctx = canvas.context;
    var x = canvas.width * 0.05;
    var w = canvas.width * 0.9;
    var grd = ctx.createLinearGradient(x,y,w,y);
    grd.addColorStop(0, FColor.toString(fullLightness));
    grd.addColorStop(1, "#000000");
    ctx.fillStyle = grd;
    ctx.fillRect(x, y, w, h);

    renderCarat(canvas, x + (1-hsl.l)*w, y, h, h*0.2);
  }

  function renderSaturationPicker(canvas, y, h) {
    var color = FColor.createFromHex(choiceToEdit.color);
    var hsl = FColor.toHSL(color);
    var hsl2 = Object.assign({}, hsl, { s: 1 });
    var fullSat = FColor.createFromHSL(hsl2);

    var ctx = canvas.context;
    var x = canvas.width * 0.05;
    var w = canvas.width * 0.9;
    var grd = ctx.createLinearGradient(x,y,w,y);
    grd.addColorStop(0, FColor.toString(fullSat));
    grd.addColorStop(1, "#ffffff");
    ctx.fillStyle = grd;
    ctx.fillRect(x, y, w, h);

    renderCarat(canvas, x + (1-hsl.s)*w, y, h, h*0.2);
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

  function renderCarat(canvas, x, y, h, size) {
    var ctx = canvas.context;
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - size*0.6, y - size);
    ctx.lineTo(x + size*0.6, y - size);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x, y + h);
    ctx.lineTo(x - size*0.6, y+h + size);
    ctx.lineTo(x + size*0.6, y+h + size);
    ctx.closePath();
    ctx.fill();
  }

  function renderIcons(canvas) {
    var ctx = canvas.context;
    var bounds = getIconBounds();
    if (mode == MODE_EDIT && doneImage.loaded) {
      ctx.drawImage(doneImage.image, bounds.left, bounds.top, bounds.width, bounds.height);
    }
    else if (mode == MODE_PLAY && settingsImage.loaded) {
      ctx.drawImage(settingsImage.image, bounds.left, bounds.top, bounds.width, bounds.height);
    }
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
    if (hitTestIcon(x, y)) {
      if (mode == MODE_EDIT) {
        mode = MODE_PLAY;
      }
      else {
        mode = MODE_EDIT;
        phase = IDLE;
        rotation = 0;
        highlight = true;
        choiceToEdit = choices[0];
      }
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

  function hitTestIcon(x, y) {
    var bounds = getIconBounds();
    if (x >= bounds.left && x <= bounds.right && y >= bounds.top && y <= bounds.bottom) {
      return true;
    }
    return false;
  }

  function getIconBounds() {
    var size = floorsix.getCanvasSize();
    var iconSize = Math.min(size.width, size.height) * 0.2;
    var bounds = {
      left: size.width / 2 - iconSize / 2,
      top: size.height - iconSize * 1.1,
      width: iconSize,
      height: iconSize
    }
    bounds.right = bounds.left + bounds.width;
    bounds.bottom = bounds.top + bounds.height;
    return bounds;
  }


  return {
    'animate': animate,
    'render': render,
    'touchstart': handleTouchStart,
    'touchmove': handleTouchMove,
    'touchend': handleTouchEnd
  }
});
