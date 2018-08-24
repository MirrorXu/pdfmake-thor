/**
 * Created by chao.z on 18/4/20.
 */
/* eslint-disable */
var fs = require('fs');
var path = require('path');
var Canvas = require('canvas');
var defArgument = {
  canvasWidth: 960,
  canvasHeight: 960,
  high: 15,
  middle:47,
  low:19
};
module.exports = function (argu) {
  const pieArgument = Object.assign(defArgument, argu);
  var cvsH = pieArgument.canvasHeight;
  var cvsW = pieArgument.canvasWidth;
  var canvas = new Canvas(cvsW, cvsH);
  var ctx = canvas.getContext('2d');
  var r1 = 380;
  // 计算总数
  var sum = pieArgument.high + pieArgument.middle + pieArgument.low;
  // 计算每一项的百分比
  var highPercent = pieArgument.high / sum;
  var middlePercent = pieArgument.middle / sum;
  var lowPercent = pieArgument.low / sum;
  // 计算每一项的扇形角度
  var highAngle = Math.round(360 * highPercent);
  var middleAngle = Math.round(360 * middlePercent);
  var lowAngle = Math.round(360 * lowPercent);
  // 计算每一项的开始角度 终止角度
  var highAngleStart = 270;
  var highAngleEnd = (270 + highAngle) > 360 ? 270 + highAngle - 360 : 270 + highAngle;
  var middleAngleStart = highAngleEnd;
  var middleAngleEnd = (middleAngleStart + middleAngle) > 360 ? middleAngleStart + middleAngle - 360 : middleAngleStart + middleAngle;
  var lowAngleStart = middleAngleEnd;
  var lowAngleEnd = lowAngleStart + lowAngle;
  if (canvas.getContext) {
    // 外圈文字
    var wcircle = {
      x: 480,
      y: 480,
      radius: 330
    };
    //背景色
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, 960, 960);
    ctx.fill();

    //彩色扇叶
    ites(highAngleStart, highAngleEnd, r1, '#e06440');
    ites(middleAngleStart, middleAngleEnd, r1, '#66b76a');
    ites(lowAngleStart, lowAngleEnd, r1, '#6eb8e9');

    //内覆盖扇形背景圆
    ites(0, 360, 240, '#fff');
    ctx.save();
  }
  //转换弧度
  function rads(x) {
    return Math.PI * x / 180;
  }
  //圆
  function ites(a, b, r, color) {
    ctx.beginPath();
    ctx.moveTo(480, 480);
    ctx.arc(480, 480, r, rads(a), rads(b), false);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }
  return {url: canvas.toDataURL(), width: cvsW/6, height: cvsH/6};
// canvas.createPNGStream().pipe(fs.createWriteStream(path.join(__dirname, 'bar.png')));
};