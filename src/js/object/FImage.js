var FImage = {};

(function() {

  FImage.create = function(src, callback, errcallback) {
    var img = {
      image: new Image(),
      loaded: false
    }
    img.image.src = src;
    img.image.onload = function() {
      img.width = img.image.width;
      img.height = img.image.height;
      img.aspect = img.width / img.height;
      img.loaded = true;
      if (callback) {
        callback(img);
      }
    }
    img.image.onerror = function(err) {
      img.error = true;
      if (errcallback) {
        errcallback(err);
      }
    }
    return img;
  }

})();
