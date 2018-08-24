/* eslint-disable */
// var resultArr = [];
// function getArrList(arr, n, sum, result) {
//   const newArr = arr.concat();
//   for (var i=0; i <= newArr.length -1; i++) {
//     const newResult = [].concat(result);
//     const reduceArr = newArr.concat();
//     newResult.push(arr[i]);
//     console.log('sum:  ' + sum);
//     if (n <= 1) {
//       if (sum - arr[i] === 0) {
//         newResult.push(arr[i]);
//         resultArr.push(newResult);
//       }
//     } else {
//       arguments.callee(reduceArr.splice(0, i+1), n - 1, sum - arr[i], result);
//     }
//   }
// }
//
// getArrList([2, 3, 4, 5], 2, 7, []);
// console.log(resultArr);



function choose(arr, size, sum) {
  var allResult = [];
  var niceResult = [];
  (function (arr, size, result) {
    var arrLen = arr.length;
    if (size > arrLen) {
      return;
    }
    if (size == arrLen) {
      allResult.push([].concat(result, arr))
    } else {
      for (var i = 0 ; i < arrLen; i++) {
        var newResult = [].concat(result);
        newResult.push(arr[i]);

        if (size == 1) {
          allResult.push(newResult);
        } else {
          var newArr = [].concat(arr);
          newArr.splice(0, i + 1);
          arguments.callee(newArr, size - 1, newResult);
        }
      }
    }
  })(arr, size, []);
  allResult.forEach(function (item) {
    if (item.reduce(function (pre, next) {
        return pre += next;
      }) === sum) {
      niceResult.push(item);
    }
  });
  return niceResult;
}

console.log(choose([1, 2, 3, 4, 5, 6, 7, 8], 2, 7));
