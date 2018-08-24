/**
 * Created by work on 17/8/11.
 */
/* eslint-disable */
var fs = require('fs');
var path = require('path');
var Canvas = require('canvas');

// 圆形需要的参数
const defArgument = {
  canvasWidth: 80,
  fontColor: '#fff',
  text: '1',
  color: '绿'
};
// 圆形 方法定义
module.exports = function (argu) {
  const pieArgument = typeof argu === 'object' ? Object.assign(defArgument, argu) : defArgument;
  switch(pieArgument.color) {
    case '红' :
      pieArgument.color = '#ED7038';
        break;
    case '绿' :
      pieArgument.color = '#49B67F';
      break;
    case '蓝' :
      pieArgument.color = '#4BBED2';
      break;
    default: break;
  }
  var canvas = new Canvas(pieArgument.canvasWidth, pieArgument.canvasWidth);
  var ctx = canvas.getContext('2d');

  ctx.beginPath();
  ctx.translate(pieArgument.canvasWidth/2,pieArgument.canvasWidth/2);//定义中心点
  ctx.moveTo(0,0);
  ctx.arc(0,0,pieArgument.canvasWidth/2,0,Math.PI*2,false);
  ctx.fillStyle=pieArgument.color;
  ctx.fill();

  ctx.font = '52px 苹方-简';
  ctx.textAlign = "center";
  ctx.textBaseline = 'middle';
  ctx.fillStyle=pieArgument.fontColor;
  ctx.fillText(pieArgument.text, 0,0);

  ctx.closePath();
  canvas.createPNGStream().pipe(fs.createWriteStream(path.join(__dirname, 'smallCircle.png'))); // pipe

  return {url: canvas.toDataURL(), width: pieArgument.canvasWidth/4};
};