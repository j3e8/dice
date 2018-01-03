var FColor = {};

(function() {
  var rgb_r = /rgba?\(\s*([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\s*(,\s*([0-9\.]+))?\s*\)/i;

  FColor.create = function(r, g, b, a) {
    return {
      r: r,
      g: g,
      b: b,
      a: a !== undefined ? a : 1
    }
  }

  FColor.createFromString = function(str) {
    if (typeof(str) != 'string') {
      throw "Invalid input format for FColor.createFromString";
    }
    var r, g, b, a = 1;
    if (str.substring(0, 1) == '#') {
      var hex = str.substring(1);
      if (hex.length == 3) {
        hex = hex.substring(0, 1) + hex.substring(0, 1)
          + hex.substring(1, 2) + hex.substring(1, 2)
          + hex.substring(2, 3) + hex.substring(2, 3);
      }
      r = parseInt(hex.substring(0, 2), 16);
      g = parseInt(hex.substring(2, 4), 16);
      b = parseInt(hex.substring(4, 6), 16);
    }
    else if (str.substring(0, 3) == 'rgb') {
      var match = rgb_r.exec(str);
      if (match && match.length >= 4) {
        r = match[1];
        g = match[2];
        b = match[3];
        if (match.length >= 6) {
          a = match[5];
        }
      }
      else {
        throw "Invalid rgba input format for FColor.createFromString";
      }
    }
    return FColor.create(r, g, b, a);
  }

  FColor.createFromHSL = function(hsl) {
    var h = hsl.h;
    var s = hsl.s;
    var l = hsl.l;

    if (typeof(hsl) != 'object') {
      throw "Invalid input for FColor.createFromHSL";
    }
    if (!s) {
      return { r: l, g: l, b: l };
    }
    if (h >= 360) {
      h = 0;
    }
    h /= 60;

    var i = Math.floor(h);
    var ff = h - i;
    var p = l * (1.0 - s) * 255;
    var q = l * (1.0 - (s * ff)) * 255;
    var t = l * (1.0 - (s * (1.0 - ff))) * 255;
    var ll = l * 255;

    var r, g, b;
    switch(i) {
      case 0:
        r = ll;
        g = t;
        b = p;
        break;
      case 1:
        r = q;
        g = ll;
        b = p;
        break;
      case 2:
        r = p;
        g = ll;
        b = t;
        break;
      case 3:
        r = p;
        g = q;
        b = ll;
        break;
      case 4:
        r = t;
        g = p;
        b = ll;
        break;
      case 5:
      default:
        r = ll;
        g = p;
        b = q;
        break;
    }
    return FColor.create(r, g, b);
  }

  FColor.toString = function(color) {
    if (typeof(color) != 'object') {
      throw "Invalid input for FColor.toString";
    }
    if (color.a !== 1) {
      return 'rgba(' + Math.floor(color.r) + ',' + Math.floor(color.g) + ',' + Math.floor(color.b) + ',' + color.a + ')';
    }
    return 'rgb(' + Math.floor(color.r) + ',' + Math.floor(color.g) + ',' + Math.floor(color.b) + ')';
  }

  FColor.toHSL = function(color) {
    if (typeof(color) != 'object') {
      throw "Invalid input for FColor.toHSL";
    }
    var min = Math.min(color.r, color.g, color.b);
    var max = Math.max(color.r, color.g, color.b);
    var delta = max - min;
    if (!delta) {
      return { h: 0, s: 0, l: min };
    }
    var h;
    var s = delta / max;
    var l = max / 255;
    if (color.r == max) {
      h = (color.g - color.b) / delta;
    }
    else if (color.g == max) {
      h = 2 + (color.b - color.r) / delta;
    }
    else if (color.b == max) {
      h = 4 + (color.r - color.g) / delta;
    }
    h *= 60;
    if (h < 0) {
      h += 360;
    }
    return { h: h, s: s, l: l };
  }

})();
