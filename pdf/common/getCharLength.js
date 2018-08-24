
/**
 * Created by work on 17/8/9.
 */
// 检测字符串中的非汉字字符的数量
module.exports = function (str) {
  var string = typeof str === 'number' ? str.toString() : str;
  if (typeof string !== 'string') {
    return 0;
  } else if (/[a-z0-9./()、-]/i.test(string)) {
    return string.match(/[a-z0-9./()、-]/ig).length;
  }
  return 0;
};

