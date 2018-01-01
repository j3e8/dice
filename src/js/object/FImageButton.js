var FImageButton = {};

(function() {
  FImageButton.create = function(src, position, size) {
    var button = {
      fimage: null,
      x: position.x || 0,
      y: position.y || 0,
      width: 0,
      height: 0,
      loaded: false
    };
    button.fimage = FImage.create(src, function(fimg) {
      console.log('img loaded', size, fimg);
      if (size && size.width) {
        button.width = size.width;
        if (size.height) {
          button.height = size.height;
        }
        else {
          button.height = size.width / fimg.aspect;
        }
      }
      else if (size && size.height) {
        button.height = size.height;
        button.width = size.height * fimg.aspect;
      }
      button.loaded = true;
      console.log(button);
    });
    return button;
  }

  FImageButton.getBounds = function(button) {
    if (button && button.loaded) {
      var bounds = {
        left: button.x,
        top: button.y,
        width: button.width,
        height: button.height
      }
      bounds.right = bounds.left + bounds.width;
      bounds.bottom = bounds.top + bounds.height;
      return bounds;
    }
    return null;
  }

  FImageButton.render = function(ctx, button) {
    if (ctx && button && button.loaded) {
      var bounds = FImageButton.getBounds(button);
      if (bounds.left !== undefined && bounds.top !== undefined && bounds.width && bounds.height) {
        ctx.drawImage(button.fimage.image, bounds.left, bounds.top, bounds.width, bounds.height);
      }
    }
  }

  FImageButton.hitTest = function(button, x, y) {
    var bounds = FImageButton.getBounds(button);
    if (x >= bounds.left && x <= bounds.right && y >= bounds.top && y <= bounds.bottom) {
      return true;
    }
    return false;
  }
})();
