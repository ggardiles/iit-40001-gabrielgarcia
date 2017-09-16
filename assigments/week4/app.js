function handAssessor(arr) {

  // Validation
  if (arr.length > 5) {
    throw new Error('Poker hand cannot exceed 5 cards');
  }
  var reason = isHandInvalid(arr);
  if (reason) {
    var msg = reason[0] === -1 ? 'rank: ' : 'suit: ';
    throw new Error('Hand is not valid due to bad ' + msg + reason[1]);
  }
  if (isCardRepeated(arr)) {
    throw new Error('Hand is not valid: some cards are repeated');
  }

  // Evaluation of hands with optimizations (Dont assess some impossible combinations)
  hands = []

  // Royal flush
  if (isRoyalFlush(arr)) {
    hands = ["Royal Flush", "Straight Flush", "Straight"];
  }
  else if (isStraightFlush(arr)) {
    hands = ["Straight Flush", "Straight"];
  }
  else if (isStraight(arr)) {
    hands.push("Straight");
  }

  // Full House
  if (isFullHouse(arr)) {
    hands.push("FullHouse", "Three of a kind", "Two of a kind");
  }
  // Flush
  else if (isFlush(arr)) {
    hands.push("Flush");
  }
  else if (isFour(arr)) {
    hands.push("Four of a kind");
  }
  // Three of a kind
  else if (isThree(arr)) {
    hands.push("Three of a kind");
  }
  // Two pair
  else if (isTwo(arr)) {
    hands.push("Two of a kind");
  }

  // Print hands
  if (hands.length === 0) {
    console.log("Bust");
  } else {
    hands.forEach(function (hand) {
      console.log(hand);
    });
  }
};
function isHandInvalid(arr) {
  var ranks = {
    2: true,
    3: true,
    4: true,
    5: true,
    6: true,
    7: true,
    8: true,
    9: true,
    10: true,
    'J': true,
    'Q': true,
    'K': true,
    'A': true
  };
  var suits = {
    'hearts': true,
    'diamonds': true,
    'clubs': true,
    'spades': true
  };

  for (var x = 0; x < arr.length; x++) { // Check if all cards are valid
    var card = arr[x];
    if (!ranks[card.rank]) {
      return [-1, card.rank + ' not in [2, 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K, A]'];
    }
    if (!suits[card.suit]) {
      return [-2, card.suit + ' not in [hearts, diamonds, spades, clubs]'];
    }
  };
  return false;
}
function isCardRepeated(arr) {
  var cardArray = arr.map(function (card) { return String(card.rank) + card.suit });
  return cardArray.some(function (card, idx) {
    return cardArray.indexOf(card) != idx;
  })
}
function isRoyalFlush(arr) {
  for (var x = 0; x < arr.length; x++) { // Check if ranks are > 10 or letters
    var card = arr[x];
    if (isNaN(parseInt(card.rank))) {
      continue;
    }
    if (card.rank < 10) {
      return false;
    }
  };

  return isStraightFlush(arr);
}
function isStraightFlush(arr) {
  return isFlush(arr) && isStraight(arr);
}
function isStraight(arr) {
  min = 1;
  max = 14;
  ranks = {};

  for (var x = 0; x < arr.length; x++) {
    var card = arr[x];
    var rank;
    if (card.rank === "A") {
      rank = max === 14 ? 14 : 1;
    } else if (card.rank === "K") {
      rank = 13;
    } else if (card.rank === "Q") {
      rank = 12;
    } else if (card.rank === "J") {
      rank = 11;
    } else {
      rank = card.rank;
    };

    // Add to ranks set (ranks cannot be repeated)
    if (ranks[rank]) {
      return false;
    }
    ranks[rank] = true;

    // Check if rank within range of straight
    if (rank > max || rank < min) {
      return false;
    };

    // Get new straight range without overflow
    tmpMin = rank - 4 > 0 ? rank - 4 : 1;
    tmpMax = rank + 4 < 14 ? rank + 4 : 14;

    // Update straight range if more restrictive
    min = tmpMin > min ? tmpMin : min;
    max = tmpMax < max ? tmpMax : max;
  };

  return true;
}
function isFullHouse(arr) {
  cards = {};

  for (var x = 0; x < arr.length; x++) {
    var card = arr[x];
    cards[card.rank] += 1;
    if (Object.keys(cards).length > 2) {
      return false;
    }
  };

  return !isFour(arr);
}
function isFlush(arr) {
  suit = arr[0].suit;
  for (var x = 0; x < arr.length; x++) {
    var card = arr[x];
    if (card.suit !== suit) {
      return false;
    }
  };

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
  for (var x = 0; x < arr.length; x++) {
    var card = arr[x];
    cards[card.rank] = cards[card.rank] ? cards[card.rank] + 1 : 1;
    if (cards[card.rank] >= n) {
      return true;
    }
  };

  return false;
}
