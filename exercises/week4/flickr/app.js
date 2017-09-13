var requestURL =
  "https://api.flickr.com/services/feeds/photos_public.gne?tags=dogs&format=json&jsoncallback=?";

$.getJSON(requestURL, function (flickrRes) {
  flickrRes.items.forEach(function(el) {
    var $img = $('<img>').hide();

    $img.attr("src", el.media.m);
    $("body .photos").append($img);
    $img.fadeIn();
  }, this);
});