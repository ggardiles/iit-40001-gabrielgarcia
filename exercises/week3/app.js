var main = function(){
  "use strict";
  window.alert("hello world");

  $(".comment-input button").on("click", function(){
    var $newP = $("<p>");
    var inputStr = $(".comment-input input").val();

    $newP.text(inputStr);
    $(".comment").append($newP);
  })
};

$(document).ready(main);