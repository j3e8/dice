var Dice = {};

(function() {
  var options = {
    diceColor: "#A1D65C",
    dotColor: "#5C9605"
  }

  Dice.createDie = function() {
    return {
      value: Math.ceil(Math.random() * 6),
      rotation: pickRandomRotation()
    }
  }

  Dice.roll = function(die) {
    die.value = Math.ceil(Math.random() * 6);
    die.rotation = pickRandomRotation();
  }

  Dice.renderDie = function(ctx, cx, cy, d, die) {
    if (!die) {
      die = { value: 5, rotation: 0 };
    }
    var r = d/2;
    var br = r * 0.15;
    var dotSize = d/14;

    ctx.fillStyle = options.diceColor;
    ctx.save();
    ctx.translate(cx, cy);
    if (die.rotation) {
      ctx.rotate(die.rotation);
    }

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

    var lx = 0 - d * 0.23;
    var rx = 0 + d * 0.23;
    var ty = 0 - d * 0.24;
    var by = 0 + d * 0.24;

    switch (die.value) {
      case 1: renderDot(ctx, 0, 0, dotSize); break;
      case 2: renderDot(ctx, lx, ty, dotSize); renderDot(ctx, rx, by, dotSize); break;
      case 3: renderDot(ctx, 0, 0, dotSize); renderDot(ctx, lx, ty, dotSize); renderDot(ctx, rx, by, dotSize); break;
      case 4: renderDot(ctx, lx, ty, dotSize); renderDot(ctx, lx, by, dotSize); renderDot(ctx, rx, ty, dotSize); renderDot(ctx, rx, by, dotSize); break;
      case 5: renderDot(ctx, 0, 0, dotSize); renderDot(ctx, lx, ty, dotSize); renderDot(ctx, lx, by, dotSize); renderDot(ctx, rx, ty, dotSize); renderDot(ctx, rx, by, dotSize); break;
      case 6: renderDot(ctx, lx, ty, dotSize); renderDot(ctx, lx, 0, dotSize); renderDot(ctx, lx, by, dotSize); renderDot(ctx, rx, ty, dotSize); renderDot(ctx, rx, 0, dotSize); renderDot(ctx, rx, by, dotSize); break;
      default: break;
    }

    ctx.restore();
  }

  function renderDot(ctx, cx, cy, dotSize) {
    ctx.fillStyle = options.dotColor;
    ctx.beginPath();
    ctx.arc(cx, cy, dotSize, 0, Math.PI * 2);
    ctx.fill();
  }

  function pickRandomRotation() {
    return Math.random() * Math.PI/2 - Math.PI/4;
  }

})();
