function max(arr) {
  // Validations
  if (!Array.isArray(arr)) {
    throw new Error('Argument must be an array object');
  }
  if (arr.length === 0) {
    throw new Error('Array cannot be empty');
  }

  // Smaller array, largests easier to find
  if (arr.length === 1) {
    return arr;
  }
  if (arr.length === 2) {
    return arr[0] > arr[1] ? arr : arr.reverse();
  }

  // find three largest elements
  var maxArr = [];
  for (var x = 0; x < 3; x++) {
    var i = 0;
    maxArr[x] = arr[0];

    arr.forEach(function (num, idx) {
      if (num > maxArr[x]) {
        maxArr[x] = num;
        i = idx;
      }
    })

    // Remove max element
    arr.splice(i, 1);
  }

  return maxArr;
}