/**
 * Created by chao.z on 18/4/8.
 */

/* eslint-disable */

var fs = require('fs');
var path = require('path');
var Canvas = require('canvas');
var defArgument = {
  canvasWidth: 960,
  canvasHeight: 480
};
module.exports = function (argu) {
  const pieArgument = Object.assign(defArgument, argu);
  var cvsH = pieArgument.canvasHeight;
  var cvsW = pieArgument.canvasWidth;
  var canvas = new Canvas(cvsW, cvsH);
  var ctx = canvas.getContext('2d');
  var r1 = 380;
  if (canvas.getContext) {
    // 外圈文字
    var wcircle = {
      x: 480,
      y: 480,
      radius: 340
    };
    //背景色
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, 960, 480);
    ctx.fill();

    //彩色扇叶
    ites(180, 240, r1, '#7bc0e5');
    ites(240, 300, r1, '#6ebe72');
    ites(300, 360, r1, '#e47048');

    //内覆盖扇形背景圆
    ites(180, 360, 240, '#fff');
    //交叉背景线
    line(202.9, 0, 480, 480);
    line(757.1, 0, 480, 480);
    ctx.save();
    //文字
    drawCircularText(wcircle, pieArgument[1].summary, rads(190), rads(230), 'center');
    drawCircularText(wcircle, pieArgument[0].summary, rads(250), rads(290), 'center');
    drawCircularText(wcircle, pieArgument[-1].summary, rads(310), rads(350), 'center');
    ctx.closePath();
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
  //线
  function line(a, b, c, d) {
    ctx.beginPath();
    ctx.moveTo(a, b);
    ctx.lineTo(c, d);
    ctx.strokeStyle = "#fff";
    ctx.closePath();
    ctx.lineWidth = 10;
    ctx.stroke();
  }

  function drawCircularText(s, string, startAngle, endAngle, lv) {
    var radius = s.radius,
      angleDecrement = (startAngle - endAngle) / (string.length - 1),
      angle = parseFloat(startAngle),
      index = 0,
      character;
    ctx.save();
    ctx.fillStyle = 'white';
    ctx.font = '45px 苹方-简';
    ctx.textAlign = lv;
    ctx.textBaseline = 'hanging';

    while (index < string.length) {
      character = string.charAt(index);
      ctx.save();
      ctx.beginPath();
      ctx.translate(s.x + Math.cos(angle) * radius,
        s.y + Math.sin(angle) * radius);
      ctx.rotate(Math.PI / 2 + angle);
      ctx.fillText(character, 0, 0);
      angle -= angleDecrement;
      index++;
      ctx.restore();
    }
    ctx.restore();
  }
  return {url: canvas.toDataURL(), width: cvsW/4, height: cvsH/4};
};