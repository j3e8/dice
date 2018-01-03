var Spinner = {};

(function() {
  var ROTATION_PER_MS = 0.03;

  Spinner.create = function(x, y, r, editX, editY, editR) {
    return {
      x: x,
      y: y,
      radius: r,
      editX: editX,
      editY: editY,
      editRadius: editR,
      choices: [],
      rotation: 0,
      currentSpin: 0,
      totalSpin: 0,
      spinning: false,
      highlight: false,
      isEditing: false
    };
  }

  Spinner.addChoice = function(spinner, choice) {
    spinner.choices.push(choice);
    recalculateChoiceDimensions(spinner);
  }

  Spinner.removeChoice = function(spinner, choice) {
    spinner.choices.splice(spinner.choices.indexOf(choice), 1);
    recalculateChoiceDimensions(spinner);
  }

  Spinner.setRadius = function(spinner, r) {
    spinner.r = r;
  }

  Spinner.spin = function(spinner) {
    spinner.totalSpin = Math.random() * Math.PI * 2 + Math.PI * 6;
    spinner.currentSpin = 0;
    spinner.spinning = true;
    spinner.highlight = false;
  }

  Spinner.edit = function(spinner) {
    spinner.highlight = false;
    spinner.rotation = 0;
    spinner.isEditing = true;
  }

  Spinner.finishEdit = function(spinner) {
    spinner.highlight = false;
    spinner.isEditing = false;
  }

  Spinner.animate = function(elapsedMs, spinner) {
    if (spinner.spinning) {
      var spin = ROTATION_PER_MS * elapsedMs;
      spinner.rotation += spin;
      if (spinner.rotation >= Math.PI * 2) {
        spinner.rotation -= Math.PI * 2;
      }
      spinner.currentSpin += spin;
      if (spinner.currentSpin >= spinner.totalSpin) {
        var diff = spinner.currentSpin - spinner.totalSpin;
        spinner.rotation -= diff;
        spinner.currentSpin -= diff;
        spinner.spinning = false;
        spinner.highlight = true;
      }
    }
  }

  Spinner.isSpinning = function(spinner) {
    return spinner.spinning;
  }

  Spinner.render = function(ctx, spinner) {
    var radius = spinner.isEditing ? spinner.editRadius : spinner.radius;
    var cx = spinner.isEditing ? spinner.editX : spinner.x;
    var cy = spinner.isEditing ? spinner.editY : spinner.y;
    var labelInsidePadding = radius * 0.25;
    var labelOutsidePadding = radius * 0.1;
    var labelFontSize = radius * 0.6;

    // determine font size
    ctx.font = labelFontSize + "px Avenir";
    spinner.choices.forEach(function(choice) {
      var size = ctx.measureText(choice.value);
      var allowedWidth = radius - (labelInsidePadding + labelOutsidePadding);
      if (size.width > allowedWidth) {
        labelFontSize *= allowedWidth / size.width;
      }
    });

    // render
    ctx.save();
    ctx.translate(cx, cy);
    var choiceAngleSize = Math.PI * 2 / spinner.choices.length;
    ctx.rotate(-choiceAngleSize / 2);
    spinner.choices.forEach(function(choice, i) {
      if (!spinner.spinning && spinner.highlight && !isHighlightedChoice(spinner, i)) {
        ctx.globalAlpha = 0.2;
      }
      else {
        ctx.globalAlpha = 1;
      }

      Choice.render(ctx, choice, spinner.rotation, radius, labelFontSize, labelInsidePadding, labelOutsidePadding);

      // remove icon
      // if (mode == MODE_EDIT) {
      //
      // }
    });
    ctx.restore();
  }

  Spinner.selectChoice = function(spinner, choice) {
    spinner.highlight = true;
    spinner.rotation = -spinner.choices.indexOf(choice) * (Math.PI*2 / spinner.choices.length);
  }

  function recalculateChoiceDimensions(spinner) {
    var num = spinner.choices.length;
    var angleSize = Math.PI * 2 / num;
    spinner.choices.forEach(function(choice, i) {
      Choice.setAngleSize(choice, angleSize);
      Choice.setStartAngle(choice, angleSize * i);
    });
  }

  function isHighlightedChoice(spinner, choiceIndex) {
    var choiceAngleSize = Math.PI * 2 / spinner.choices.length;
    var s = choiceIndex * choiceAngleSize - choiceAngleSize / 2;
    var s2 = s + Math.PI * 2;
    var e = (choiceIndex + 1) * choiceAngleSize - choiceAngleSize / 2;
    var e2 = e + Math.PI * 2;
    var reverse = Math.PI * 2 - spinner.rotation;
    if (reverse < 0) reverse += Math.PI * 2;
    if (reverse >= Math.PI*2) reverse -= Math.PI * 2;
    if ((s <= reverse && reverse < e) || (Math.min(s, e) < 0 && s2 <= reverse && reverse < e2)) {
      return true;
    }
    return false;
  }

})();
