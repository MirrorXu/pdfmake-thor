/**
 * Created by work on 17/8/1.
 */
/* eslint-disable */
var fs = require('fs');
var path = require('path');
var Canvas = require('canvas');

// 圆形需要的参数
const defArgument = {
  canvasWidth: 320,
  canvasHeight: 320,
  bgColor: '#4abed3',
  fontColor: '#fff',
  text: "CYP1A1"
};
// 圆形 方法定义
module.exports = function (argu) {
  const pieArgument = typeof argu === 'object' ? Object.assign(defArgument, argu) : defArgument;
  var canvas = new Canvas(pieArgument.canvasWidth, pieArgument.canvasHeight);
  var ctx = canvas.getContext('2d');
  var FONT = '80px 苹方-简';
  if(pieArgument.text.length >= 6 && pieArgument.text.length < 8) {
    FONT = '64px 苹方-简';
  } else if (pieArgument.text.length >= 8) {
    FONT = '48px 苹方-简';
  }
  ctx.beginPath();
  ctx.translate(pieArgument.canvasHeight/2,pieArgument.canvasHeight/2);//定义中心点
  ctx.moveTo(0,0);
  ctx.arc(0,0,pieArgument.canvasHeight/2,0,Math.PI*2,false);
  ctx.fillStyle=pieArgument.bgColor;
  ctx.fill();

  ctx.font = FONT;
  ctx.textAlign = "center";
  ctx.textBaseline = 'middle';
  ctx.fillStyle=pieArgument.fontColor;
  ctx.fillText(pieArgument.text, 0,0);

  ctx.closePath();
  canvas.createPNGStream().pipe(fs.createWriteStream(path.join(__dirname, 'circle.png'))); // pipe

  return {url: canvas.toDataURL(), width: pieArgument.canvasWidth/4, height: pieArgument.canvasHeight/4};
  // console.log(canvas.toDataURL());
};
// pie(pieArgument);