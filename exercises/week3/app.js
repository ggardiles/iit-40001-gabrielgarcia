var main = function () {
  "use strict";
  window.alert("hello world");

  $(".comment-input button").on("click", function () {
    var $new_comment = $("<p>");
    var $comment_text = $(".comment-input input");

    if (!$comment_text.val()) {
      window.alert("Empty Comment :(");
      return;
    }
    $new_comment.text($comment_text.val());
    $(".comment").append($new_comment);
    $comment_text.val("");
  })
};
$(".comment-input input").on("keypress", function (event) {
  var $comment_text = $(".comment-input input");

  if (event.keyCode === 13){ // Check for return key press
    $(".comment-input button").click();
  }
})


$(document).ready(main);