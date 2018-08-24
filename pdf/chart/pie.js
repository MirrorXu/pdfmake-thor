/**
 * Created by work on 17/8/1.
 */
/**
 * Created by work on 17/7/26.
 */
/* eslint-disable */
var fs = require('fs');
var path = require('path');
var Canvas = require('canvas');
// 饼图需要自定义的参数
var defArgument = {
  canvasWidth: 900,
  canvasHeight: 500,
  ratio: 0.1333,
  fillColor: "#3ebbc1",
  bgColor: '#e6e6e6',
  fontColor: '#3ebbc1'
};


// 去零拼百分比
function percentage(num) {
  const lastWord = num.toString()[num.toString().length -1];
  if (lastWord === '0') {
    var subNum = num.substring(0, num.length -1);
    return percentage(subNum)
  } else if (lastWord === '.') {
    return num.substring(0, num.length -1) + '%';
  }
  return num + '%'
}

// 饼图 方法定义
module.exports = function (argu) {
  const pieArgument = typeof argu === 'object' ? Object.assign(defArgument, argu) : defArgument;
  var percent = pieArgument.ratio;
  var pieLable = percentage((percent*100).toFixed(2).toString());

  var radian = Math.PI/180*360*percent - Math.PI*0.5;
  var canvas = new Canvas(pieArgument.canvasWidth, pieArgument.canvasHeight);
  var ctx = canvas.getContext('2d');
  ctx.beginPath();
  ctx.translate(pieArgument.canvasHeight/2,pieArgument.canvasHeight/2);//定义中心点
  ctx.moveTo(0,0);
  ctx.arc(0,0,pieArgument.canvasHeight/2,0,Math.PI*2,false);
  ctx.fillStyle=pieArgument.bgColor;
  ctx.fill();
  ctx.moveTo(0,0);
  ctx.arc(0,0,pieArgument.canvasHeight/2,Math.PI*1.5,radian,true);
  ctx.fillStyle=pieArgument.fillColor;
  ctx.fill();

  ctx.translate(pieArgument.canvasWidth/2,0);//定义中心点
  ctx.font = '80px 苹方-简';
  ctx.textAlign = "center";
  ctx.textBaseline = 'middle';
  ctx.fillStyle=pieArgument.fontColor;
  ctx.fillText(pieLable, 0,0);

  ctx.closePath();
  return {url: canvas.toDataURL(), width: pieArgument.canvasWidth/4.5, height: pieArgument.canvasHeight/4.5};
  // console.log(canvas.toDataURL());//生成图片base64
  // canvas.createPNGStream().pipe(fs.createWriteStream(path.join(__dirname, 'pie.png'))) // 生成本地图片(指定文件名)
};
// aa(defArgument);