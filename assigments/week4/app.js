function handAssessor(arr) {
  hands = []
  // Royal flush
  if (isRoyalFlush(arr)) {
    hands.push(["Royal Flush", "Straight Flush", "Straight"]);
  }
  else if (isStraightFlush(arr)) {
    hands.push(["Straight Flush", "Straight"]);
  }
  else if (isStraight(arr)) {
    hands.push("Straight");
  }

  // Full House
  if (isFullHouse(arr)) {
    hands.push("FullHouse");
  }
  // Flush
  else if (isFlush(arr)) {
    hands.push("Flush");
  }
  // OR Four of a kind
  else if (isFour(arr)) {
    hands.push("Four of a kind");
  }

  // Three of a kind
  if (isThree(arr)) {
    hands.push("Three of a kind");
  }
  // Two pair
  if (isTwo(arr)) {
    hands.push("Two of a kind");
  }

  // Print hands
  if (hands.length === 0) {
    console.log("Bust");
  } else {
    hands.forEach(function (hand) {
      console.log(hand);
    }, this);
  }
};

function isRoyalFlush(arr) {
  arr.forEach(function(card){
    if (isNaN(parseInt(card.rank))){
      continue;
    }
    if (card.rank < 10){
      return false;
    }
  });

  return isStraight();
}
function isStraightFlush(arr) {
  return isFlush() && isStraight();
}
function isStraight(arr) {
  min = 1;
  max = 14;

  arr.forEach(function(card){
    var rank;
    if (card.rank === "A"){
      rank = max === 14 ? 14 : 1;
    }else if (card.rank === "K"){
      rank = 13;
    }else if (card.rank === "Q"){
      rank = 12;
    }else if (card.rank === "J"){
      rank = 11;
    };

    // Check if rank within range of straight
    if (rank > max || rank < min){
      return false;
    }

    // Get new straight range without overflow
    tmpMin = rank - 4 > 0  ? rank - 4 : 1;
    tmpMax = rank + 4 < 14 ? rank + 4 : 14;

    // Update straight range if more restrictive
    min = tmpMin > min ? tmpMin : min;
    max = tmpMax < max ? tmpMax : max;
  })

  return true;
}
function isFullHouse(arr) {
  cards = {};

  arr.forEach(function (card) {
    cards[card.rank] += 1;
    if (Object.keys(a).length > 2){
      return false;
    }
  });

  return !isFour();
}
function isFlush(arr) {
  suit = arr[0].suit;
  arr.forEach(function (card) {
    if (card.suit !== suit) {
      return false;
    }
  });

  return true;
}
function isFour(arr) {
  return isSameRankNTimes(arr, 4);
}
function isThree(arr) {
  return isSameRankNTimes(arr, 3);
}
function isTwo(arr) {
  return isSameRankNTimes(arr, 2);
}
function isSameRankNTimes(arr, n) {
  cards = {};
  // Iterate over cards and see if at least there are N with same rank
  arr.forEach(function (card) {
    cards[card.rank] += 1;
    if (cards[card.rank] >= N) {
      return true;
    }
  });

  return false;
}