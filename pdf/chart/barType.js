/**
 * Created by work on 17/8/1.
 */
/* eslint-disable */
var fs = require('fs');
var path = require('path');
var Canvas = require('canvas');
// 饼图需要的参数
var defArgument = {
  canvasWidth: 600,
  canvasHeight: 180,
  bgColor: '#055b98',
  fontColor: '#fff',
  text: 'default'
};

// ctx.beginPath();//开始绘画的声明
// ctx.moveTo(x,y);//定义起点,可以理解为将画笔移动到一个位置
// ctx.lineTo(x,y);//定义一个终点
// ctx.lineWidth=5;//定义线条宽度
// ctx.strokeStyle='blue';//定义线条颜色
// ctx.lineCap='round';//定义线帽（含圆角、尖角、斜角）
// ctx.stroke();//给线条上色，即进行绘制

module.exports = function (argu) {
  const pieArgument = typeof argu === 'object' ? Object.assign(defArgument, argu) : defArgument;
  var cvsH = pieArgument.canvasHeight;
  var cvsW = pieArgument.canvasWidth;
  if (pieArgument.text.length > 4) {
    cvsW = cvsW + (pieArgument.text.length - 4) * 100;
  }
  var canvas = new Canvas(cvsW, cvsH);
  var ctx = canvas.getContext('2d');

  ctx.beginPath();
  ctx.translate(cvsH/2,cvsH/2);//定义中心点
  ctx.moveTo(0,0);
  ctx.lineTo(cvsW-cvsH,0);
  ctx.lineWidth=cvsH;
  ctx.strokeStyle=pieArgument.bgColor;
  ctx.lineCap='round';
  ctx.stroke();
  ctx.translate(cvsW/2 - cvsH/2,0);
  ctx.moveTo(0,0);
  ctx.font = '100px 苹方-简';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle=pieArgument.fontColor;
  ctx.fillText(pieArgument.text, 0,0);
  ctx.closePath();

  return {url: canvas.toDataURL(), width: cvsW/4, height: cvsH/4};
  // console.log(canvas.toDataURL());
  // canvas.createPNGStream().pipe(fs.createWriteStream(path.join(__dirname, 'bar.png'))); // pipe
};


