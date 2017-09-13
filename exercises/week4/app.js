$.getJSON('cards/aceOfSpades.json', function(card){
  var $cardP = $("<p>");
  $cardP.text(card.rank + " of " + card.suit);

  $("body").append($cardP);
});