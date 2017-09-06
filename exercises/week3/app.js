// Custom functions
var main = function () {
  "use strict";
  window.alert("hello world");
};

var addCommentFromInput = function () {
  var $new_comment = $("<p>");
  var $comment_text = $(".comment-input input");

  if (!$comment_text.val()) {
    window.alert("Empty Comment :(");
    return;
  }
  $new_comment.text($comment_text.val());
  $(".comment").append($new_comment);
  $new_comment.fadeIn("fast");
  $comment_text.val("");
};

// Events
$(".comment-input button").on("click", addCommentFromInput);

$(".comment-input input").on("keypress", function (event) {
  var $comment_text = $(".comment-input input");

  if (event.keyCode === 13) { // Check for return key press
    addCommentFromInput();
  }
});

// Document is ready
$(document).ready(main);