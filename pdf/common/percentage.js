/**
 * Created by work on 17/8/14.
 */
module.exports = function percentage(num) {
  if (typeof num !== 'string' && typeof num !== 'number' || isNaN(num)) {
    return null;
  }
  const lastWord = num.toString()[num.toString().length - 1];
  if (lastWord === '0') {
    var subNum = num.substring(0, num.length - 1);
    return percentage(subNum);
  } else if (lastWord === '.') {
    return num.substring(0, num.length - 1) + '%';   // eslint-disable-line
  }
  return num + '%'; // eslint-disable-line
};