var Dice = {};

Dice.FOUR = 4;
Dice.SIX = 6;
Dice.EIGHT = 8;
Dice.TEN = 10;
Dice.TWELVE = 12;
Dice.TWENTY = 20;
Dice.ONE_THRU_THREE = 101;

(function() {
  var options = {};
  options[Dice.FOUR] = {
    diceColor: "#9C5ED3",
    dotColor: "#510693"
  }
  options[Dice.SIX] = {
    diceColor: "#A1D65C",
    dotColor: "#5C9605"
  }

  Dice.create = function(type) {
    var max;
    switch (type) {
      case Dice.FOUR: max = 4; break;
      case Dice.SIX: max = 6; break;
      case Dice.EIGHT: max = 8; break;
      case Dice.TEN: max = 10; break;
      case Dice.TWELVE: max = 12; break;
      case Dice.TWENTY: max = 20; break;
      case Dice.ONE_THRU_THREE: max = 3; break;
      default: max = 6; break;
    }
    return {
      type: type,
      max: max,
      value: Math.ceil(Math.random() * max),
      rotation: pickRandomRotation()
    }
  }

  Dice.roll = function(die) {
    die.value = Math.ceil(Math.random() * die.max);
    die.rotation = pickRandomRotation();
  }

  Dice.renderDie = function(ctx, cx, cy, d, die) {
    if (!die) {
      die = { max: 6, value: 5, rotation: 0 };
    }

    var r = d/2;
    var cr = r * 0.15;
    var dotSize = d/14;

    var dieOptions = {
      diameter: d,
      radius: r,
      cornerRadius: cr,
      dotSize: dotSize
    }

    ctx.fillStyle = options[die.type].diceColor;
    ctx.save();
    ctx.translate(cx, cy);
    if (die.rotation) {
      ctx.rotate(die.rotation);
    }

    switch (die.type) {
      case Dice.FOUR:
        renderFourSidedDie(ctx, die, dieOptions);
        break;
      case Dice.SIX:
        renderSixSidedDie(ctx, die, dieOptions);
        break;
      default:
        renderSixSidedDie(ctx, die, dieOptions);
        break;
    }

    ctx.restore();
  }

  function renderFourSidedDie(ctx, die, opt) {
    var radius = opt.radius * 1.25;
    ctx.beginPath();
    ctx.moveTo(0 - radius * Math.cos(Math.PI/6), 0 + radius * Math.sin(Math.PI/6));
    ctx.lineTo(0, 0 - radius);
    ctx.lineTo(0 + radius * Math.cos(Math.PI/6), 0 + radius * Math.sin(Math.PI/6));
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = options[die.type].dotColor;
    ctx.font = Math.round(radius * 0.5) + "px Avenir";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    var yo = radius * -0.05;
    switch (die.value) {
      case 1: renderDigit(ctx, '1', 0, yo, 0); renderDigit(ctx, '4', 0, yo, Math.PI*2/3); renderDigit(ctx, '2', 0, yo, Math.PI*4/3); break;
      case 2: renderDigit(ctx, '2', 0, yo, 0); renderDigit(ctx, '3', 0, yo, Math.PI*2/3); renderDigit(ctx, '1', 0, yo, Math.PI*4/3); break;
      case 3: renderDigit(ctx, '3', 0, yo, 0); renderDigit(ctx, '4', 0, yo, Math.PI*2/3); renderDigit(ctx, '1', 0, yo, Math.PI*4/3); break;
      case 4: renderDigit(ctx, '4', 0, yo, 0); renderDigit(ctx, '3', 0, yo, Math.PI*2/3); renderDigit(ctx, '2', 0, yo, Math.PI*4/3); break;
      default: break;
    }
  }

  function renderDigit(ctx, digit, x, y, rotation) {
    ctx.save();
    ctx.rotate(rotation);
    ctx.fillText(digit, x, y);
    ctx.restore();
  }

  function renderSixSidedDie(ctx, die, opt) {
    ctx.beginPath();
    ctx.moveTo(0 - opt.radius + opt.cornerRadius, 0 - opt.radius);
    ctx.lineTo(0 + opt.radius - opt.cornerRadius, 0 - opt.radius);
    ctx.arc(0 + opt.radius - opt.cornerRadius, 0 - opt.radius + opt.cornerRadius, opt.cornerRadius, -Math.PI/2, 0);
    ctx.lineTo(0 + opt.radius, 0 + opt.radius - opt.cornerRadius);
    ctx.arc(0 + opt.radius - opt.cornerRadius, 0 + opt.radius - opt.cornerRadius, opt.cornerRadius, 0, Math.PI/2);
    ctx.lineTo(0 - opt.radius + opt.cornerRadius, 0 + opt.radius);
    ctx.arc(0 - opt.radius + opt.cornerRadius, 0 + opt.radius - opt.cornerRadius, opt.cornerRadius, Math.PI/2, Math.PI);
    ctx.lineTo(0 - opt.radius, 0 - opt.radius + opt.cornerRadius);
    ctx.arc(0 - opt.radius + opt.cornerRadius, 0 - opt.radius + opt.cornerRadius, opt.cornerRadius, Math.PI, Math.PI*1.5);
    ctx.fill();

    var lx = 0 - opt.diameter * 0.23;
    var rx = 0 + opt.diameter * 0.23;
    var ty = 0 - opt.diameter * 0.24;
    var by = 0 + opt.diameter * 0.24;

    switch (die.value) {
      case 1: renderDot(ctx, 0, 0, die.type, opt.dotSize); break;
      case 2: renderDot(ctx, lx, ty, die.type, opt.dotSize); renderDot(ctx, rx, by, die.type, opt.dotSize); break;
      case 3: renderDot(ctx, 0, 0, die.type, opt.dotSize); renderDot(ctx, lx, ty, die.type, opt.dotSize); renderDot(ctx, rx, by, die.type, opt.dotSize); break;
      case 4: renderDot(ctx, lx, ty, die.type, opt.dotSize); renderDot(ctx, lx, by, die.type, opt.dotSize); renderDot(ctx, rx, ty, die.type, opt.dotSize); renderDot(ctx, rx, by, die.type, opt.dotSize); break;
      case 5: renderDot(ctx, 0, 0, die.type, opt.dotSize); renderDot(ctx, lx, ty, die.type, opt.dotSize); renderDot(ctx, lx, by, die.type, opt.dotSize); renderDot(ctx, rx, ty, die.type, opt.dotSize); renderDot(ctx, rx, by, die.type, opt.dotSize); break;
      case 6: renderDot(ctx, lx, ty, die.type, opt.dotSize); renderDot(ctx, lx, 0, die.type, opt.dotSize); renderDot(ctx, lx, by, die.type, opt.dotSize); renderDot(ctx, rx, ty, die.type, opt.dotSize); renderDot(ctx, rx, 0, die.type, opt.dotSize); renderDot(ctx, rx, by, die.type, opt.dotSize); break;
      default: break;
    }
  }

  function renderDot(ctx, cx, cy, type, dotSize) {
    ctx.fillStyle = options[type].dotColor;
    ctx.beginPath();
    ctx.arc(cx, cy, dotSize, 0, Math.PI * 2);
    ctx.fill();
  }

  function pickRandomRotation() {
    return Math.random() * Math.PI/3 - Math.PI/6;
  }

})();
