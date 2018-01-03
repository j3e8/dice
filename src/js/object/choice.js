var Choice = {};

(function() {
  Choice.createChoice = function(value, color) {
    return {
      value: value,
      color: color,
      startAngle: 0,
      angleSize: 0
    }
  }

  Choice.setColor = function(choice, color) {
    choice.color = color;
  }

  Choice.setValue = function(choice, value) {
    choice.value = value;
  }

  Choice.setAngleSize = function(choice, angleSize) {
    choice.angleSize = angleSize;
  }

  Choice.setStartAngle = function(choice, startAngle) {
    choice.startAngle = startAngle;
  }

  Choice.render = function(ctx, choice, rotation, radius, labelFontSize, labelInsidePadding, labelOutsidePadding) {
    ctx.save();
    ctx.rotate(rotation + choice.startAngle);
    ctx.fillStyle = choice.color;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(radius, 0);
    ctx.arc(0, 0, radius, 0, choice.angleSize);
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

    ctx.restore();
  }

  Choice.hitTest = function(choice, cx, cy, rotation, radius, x, y) {
    var sqd = (x - cx)*(x - cx) + (y - cy)*(y - cy);
    if (sqd > radius * radius) {
      return false;
    }
    // polar coordinates
    var polar = getPolarCoords(cx, cy, x, y);
    var visualStartAngle = rotation + choice.startAngle - choice.angleSize / 2;
    if (visualStartAngle < 0) visualStartAngle += Math.PI * 2;
    if (visualStartAngle >= Math.PI*2) visualStartAngle -= Math.PI * 2;
    var visualEndAngle = rotation + choice.startAngle + choice.angleSize / 2;
    if (visualEndAngle < 0) visualEndAngle += Math.PI * 2;
    if (visualEndAngle >= Math.PI*2) visualEndAngle -= Math.PI * 2;
    if (visualStartAngle <= polar.t && polar.t <= visualEndAngle) {
      return true;
    }
    return false;
  }

  function getPolarCoords(cx, cy, x, y) {
    var theta = Math.atan((y - cy)/(x - cx));
    if (x < cx) {
      theta -= Math.PI;
    }
    if (theta < 0) {
      theta += Math.PI*2;
    }
    if (theta >= Math.PI*2) {
      theta -= Math.PI*2;
    }
    var radius = Math.sqrt((x - cx)*(x - cx) + (y - cy)*(y - cy));
    return {
      t: theta,
      r: radius
    }
  }

})();
