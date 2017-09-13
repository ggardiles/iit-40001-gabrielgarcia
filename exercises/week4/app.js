$.getJSON('cards/aceOfSpades.json', function (cards) {
  var $cardUl = $("<ul>");
  cards.forEach(function (card) {
    var $cardLi = $("<li>");
    $cardLi.text(card.rank + " of " + card.suit);
    $cardUl.append($cardLi);
  }, this);
  $("body").append($cardUl);
});