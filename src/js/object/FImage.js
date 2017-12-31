var FImage = {};

(function() {

  FImage.create = function(src) {
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
    }
    img.image.onerror = function() {
      img.error = true;
    }
    return img;
  }

})();
