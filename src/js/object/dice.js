var Dice = {};

Dice.FOUR = 4;
Dice.SIX = 6;
Dice.EIGHT = 8;
Dice.TEN = 10;
Dice.TWELVE = 12;
Dice.TWENTY = 20;

(function() {
  Dice.create = function(type) {
    var max;
    var img;
    switch (type) {
      case Dice.FOUR: max = 4; img = FImage.create('www/images/dice4.svg'); break;
      case Dice.SIX: max = 6; img = FImage.create('www/images/dice6.svg'); break;
      case Dice.EIGHT: max = 8; img = FImage.create('www/images/dice8.svg'); break;
      case Dice.TEN: max = 10; img = FImage.create('www/images/dice10.svg'); break;
      case Dice.TWELVE: max = 12; img = FImage.create('www/images/dice12.svg'); break;
      case Dice.TWENTY: max = 20; img = FImage.create('www/images/dice20.svg'); break;
      default: max = 6; img = FImage.create('www/images/dice6.svg'); break;
    }
    return {
      type: type,
      max: max,
      img: img,
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
      case Dice.EIGHT:
        renderEightSidedDie(ctx, die, dieOptions);
        break;
      case Dice.TEN:
        renderTenSidedDie(ctx, die, dieOptions);
        break;
      case Dice.TWELVE:
        renderTwelveSidedDie(ctx, die, dieOptions);
        break;
      case Dice.TWENTY:
        renderTwentySidedDie(ctx, die, dieOptions);
        break;
      default:
        renderSixSidedDie(ctx, die, dieOptions);
        break;
    }

    ctx.restore();
  }

  function renderFourSidedDie(ctx, die, opt) {
    opt = Object.assign({}, opt);
    opt.radius *= 1.25;

    ctx.drawImage(die.img.image, -opt.radius, -opt.radius, opt.radius*2, opt.radius*2);

    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.font = Math.round(opt.radius * 0.5) + "px Avenir";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    var yo = opt.radius * -0.05;
    switch (die.value) {
      case 1: renderDigit(ctx, '1', 0, yo, 0); ctx.globalAlpha = 0.25; renderDigit(ctx, '4', 0, yo, Math.PI*2/3); renderDigit(ctx, '2', 0, yo, Math.PI*4/3); break;
      case 2: renderDigit(ctx, '2', 0, yo, 0); ctx.globalAlpha = 0.25; renderDigit(ctx, '3', 0, yo, Math.PI*2/3); renderDigit(ctx, '1', 0, yo, Math.PI*4/3); break;
      case 3: renderDigit(ctx, '3', 0, yo, 0); ctx.globalAlpha = 0.25; renderDigit(ctx, '4', 0, yo, Math.PI*2/3); renderDigit(ctx, '1', 0, yo, Math.PI*4/3); break;
      case 4: renderDigit(ctx, '4', 0, yo, 0); ctx.globalAlpha = 0.25; renderDigit(ctx, '3', 0, yo, Math.PI*2/3); renderDigit(ctx, '2', 0, yo, Math.PI*4/3); break;
      default: break;
    }
  }

  function renderSixSidedDie(ctx, die, opt) {
    ctx.drawImage(die.img.image, -opt.radius, -opt.radius, opt.radius*2, opt.radius*2);

    var lx = 0 - opt.diameter * 0.23;
    var rx = 0 + opt.diameter * 0.23;
    var ty = 0 - opt.diameter * 0.24;
    var by = 0 + opt.diameter * 0.24;

    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    switch (die.value) {
      case 1: renderDot(ctx, 0, 0, opt.dotSize); break;
      case 2: renderDot(ctx, lx, ty, opt.dotSize); renderDot(ctx, rx, by, opt.dotSize); break;
      case 3: renderDot(ctx, 0, 0, opt.dotSize); renderDot(ctx, lx, ty, opt.dotSize); renderDot(ctx, rx, by, opt.dotSize); break;
      case 4: renderDot(ctx, lx, ty, opt.dotSize); renderDot(ctx, lx, by, opt.dotSize); renderDot(ctx, rx, ty, opt.dotSize); renderDot(ctx, rx, by, opt.dotSize); break;
      case 5: renderDot(ctx, 0, 0, opt.dotSize); renderDot(ctx, lx, ty, opt.dotSize); renderDot(ctx, lx, by, opt.dotSize); renderDot(ctx, rx, ty, opt.dotSize); renderDot(ctx, rx, by, opt.dotSize); break;
      case 6: renderDot(ctx, lx, ty, opt.dotSize); renderDot(ctx, lx, 0, opt.dotSize); renderDot(ctx, lx, by, opt.dotSize); renderDot(ctx, rx, ty, opt.dotSize); renderDot(ctx, rx, 0, opt.dotSize); renderDot(ctx, rx, by, opt.dotSize); break;
      default: break;
    }
  }

  function renderEightSidedDie(ctx, die, opt) {
    ctx.drawImage(die.img.image, -opt.radius, -opt.radius, opt.radius*2, opt.radius*2);

    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.font = Math.round(opt.radius * 0.8) + "px Avenir";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    renderDigit(ctx, die.value, 0, 0, 0);
  }

  function renderTenSidedDie(ctx, die, opt) {
    ctx.drawImage(die.img.image, -opt.radius, -opt.radius, opt.radius*2, opt.radius*2);

    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.font = Math.round(opt.radius * 0.8) + "px Avenir";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    renderDigit(ctx, die.value, 0, opt.radius * 0.15, 0);
  }

  function renderTwelveSidedDie(ctx, die, opt) {
    ctx.drawImage(die.img.image, -opt.radius, -opt.radius, opt.radius*2, opt.radius*2);

    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.font = Math.round(opt.radius * 0.8) + "px Avenir";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    renderDigit(ctx, die.value, 0, 0, 0);
  }

  function renderTwentySidedDie(ctx, die, opt) {
    ctx.drawImage(die.img.image, -opt.radius, -opt.radius, opt.radius*2, opt.radius*2);

    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.font = Math.round(opt.radius * 0.5) + "px Avenir";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    renderDigit(ctx, die.value, 0, 0, 0);
  }

  function renderDigit(ctx, digit, x, y, rotation) {
    ctx.save();
    ctx.rotate(rotation);
    ctx.fillText(digit, x, y);
    ctx.restore();
  }

  function renderDot(ctx, cx, cy, dotSize) {
    ctx.beginPath();
    ctx.arc(cx, cy, dotSize, 0, Math.PI * 2);
    ctx.fill();
  }

  function pickRandomRotation() {
    return Math.random() * Math.PI/3 - Math.PI/6;
  }

})();
