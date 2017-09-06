// Hide relevant elements be4 pageload
var $ps = $("div.relevant p");
$ps.hide();

var pageLoaded = function () {
  "use strict";
  // Odd elements color
  $ps.filter(":odd")
    .css("background", "aliceblue");

  // Even elements color
  $ps.filter(":even")
    .css("background", "lightcyan");

  $ps.each(function (idx) {
    $(this).delay(500 * idx).fadeIn();
  });
};

// Document is ready
$(document).ready(pageLoaded);