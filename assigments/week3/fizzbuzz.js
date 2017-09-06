/**
 * 
 * @param {*Item to be validated as positive integer} n 
 */

function isPosInt(n) {
  return n === parseInt(n, 10) && n > 0;
};

/**
 * 
 * @param {*First positive integer of the range} n1 
 * @param {*Last positive integer of the range} n2 
 */
function fizzBuzz(n1, n2) {
  // Validation
  if (!isPosInt(n1)) {
    throw new Error('Left bound of range is not a positive integer: ' + n1);
  }
  if (!isPosInt(n2)) {
    throw new Error('Right bound of range is not a positive integer: ' + n2);
  }
  if (n2 < n1) {
    throw new Error('Invalid range ' + n2 + '<' + n1);
  }
  if (n2 - n1 > 200) {
    throw new Error('Range is too big [' + n1 + ', ' + n2 + ']. Do not exceed 200 elements');
  }

  // Do Magic
  for (var i = n1; i <= n2; i++) {
    if ((i % 3 === 0) && (i % 5 === 0)) {
      console.log("FizzBuzz");
    } else if (i % 3 === 0) {
      console.log("Fizz");
    } else if (i % 5 === 0) {
      console.log("Buzz");
    } else {
      console.log(i);
    }
  }
};