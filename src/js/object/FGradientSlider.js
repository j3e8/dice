var FGradientSlider = {};

(function() {
  FGradientSlider.Types = {
    HUE: 0,
    SATURATION: 1,
    LIGHTNESS: 2
  }

  FGradientSlider.create = function(position, size, type) {
    var slider = {
      color: null,
      x: position.x,
      y: position.y,
      width: size.width,
      height: size.height,
      type: type
    };
    return slider;
  }

  FGradientSlider.setColor = function(slider, fcolor) {
    slider.color = fcolor;
  }

  FGradientSlider.render = function(ctx, slider) {
    switch (slider.type) {
      case FGradientSlider.Types.HUE:
        renderHuePicker(ctx, slider);
        break;
      case FGradientSlider.Types.SATURATION:
        renderSaturationPicker(ctx, slider);
        break;
      case FGradientSlider.Types.LIGHTNESS:
        renderLightnessPicker(ctx, slider);
        break;
    }
  }

  FGradientSlider.getBounds = function(slider) {
    var bounds = {
      left: slider.x,
      top: slider.y,
      width: slider.width,
      height: slider.height,
      right: slider.x + slider.width,
      bottom: slider.y + slider.height
    }
    return bounds;
  }

  FGradientSlider.hitTest = function(slider, x, y) {
    var bounds = FGradientSlider.getBounds(slider);
    if (x >= bounds.left && x <= bounds.right && y >= bounds.top && y <= bounds.bottom) {
      return true;
    }
    return false;
  }

  FGradientSlider.calculateXPercentage = function(slider, x, y) {
    var bounds = FGradientSlider.getBounds(slider);
    if (x <= bounds.left) {
      return 0;
    }
    else if (x >= bounds.right) {
      x = 1;
    }
    else {
      var pct = (x - bounds.left) / bounds.width;
      return pct;
    }
    return null;
  }

  function renderHuePicker(ctx, slider) {
    var grd = ctx.createLinearGradient(slider.x, slider.y, slider.width, slider.y);
    grd.addColorStop(0, "#ff0000");
    grd.addColorStop(1/6, "#ffff00");
    grd.addColorStop(2/6, "#00ff00");
    grd.addColorStop(3/6, "#00ffff");
    grd.addColorStop(4/6, "#0000ff");
    grd.addColorStop(5/6, "#ff00ff");
    grd.addColorStop(1, "#ff0000");
    ctx.fillStyle = grd;
    ctx.fillRect(slider.x, slider.y, slider.width, slider.height);

    var color = FColor.createFromString(slider.color);
    var hsl = FColor.toHSL(color);
    renderCarat(ctx, slider.x + (hsl.h/360)*slider.width, slider.y, slider.height, slider.height*0.2);
  }

  function renderLightnessPicker(ctx, slider) {
    var color = FColor.createFromString(slider.color);
    var hsl = FColor.toHSL(color);
    var hsl2 = Object.assign({}, hsl, { l: 1 });
    var fullLightness = FColor.createFromHSL(hsl2);

    var grd = ctx.createLinearGradient(slider.x, slider.y, slider.width, slider.y);
    grd.addColorStop(0, FColor.toString(fullLightness));
    grd.addColorStop(1, "#000000");
    ctx.fillStyle = grd;
    ctx.fillRect(slider.x, slider.y, slider.width, slider.height);

    renderCarat(ctx, slider.x + (1-hsl.l)*slider.width, slider.y, slider.height, slider.height*0.2);
  }

  function renderSaturationPicker(ctx, slider) {
    var color = FColor.createFromString(slider.color);
    var hsl = FColor.toHSL(color);
    var hsl2 = Object.assign({}, hsl, { s: 1 });
    var fullSat = FColor.createFromHSL(hsl2);

    var grd = ctx.createLinearGradient(slider.x, slider.y, slider.width, slider.y);
    grd.addColorStop(0, FColor.toString(fullSat));
    grd.addColorStop(1, "#ffffff");
    ctx.fillStyle = grd;
    ctx.fillRect(slider.x, slider.y, slider.width, slider.height);

    renderCarat(ctx, slider.x + (1-hsl.s)*slider.width, slider.y, slider.height, slider.height*0.2);
  }

  function renderCarat(ctx, x, y, h, size) {
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

})();
