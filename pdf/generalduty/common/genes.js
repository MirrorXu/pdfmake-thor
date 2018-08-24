/**
 * Created by work on 18/5/2.
 */
/* eslint-disable */

// const fs = require('fs');
// const Printer = require('pdfmake');

// 基因知识部分
  module.exports = function(data){
    let genesContent=[
      {
        image: __dirname + '/img/genes.png',
        width: 475
      },
      {
        text:'基因知识',
        fontSize: 12,
        margin:[14,-18,0,10],
        color:'#3b9dd7',
        bold: true
      }
    ];
    data.forEach((item) => {
      genesContent.push({
        text:item.related,
        color:'#231815',
        fontSize: 10,
        lineHeight: 1.3,
        bold:true,
        margin:[0,6,0,10]
      })
    });
    return genesContent;
  };

// var doc = new Printer({
//   Roboto: {
//     normal: __dirname + '/../../fonts/PingFang Regular.ttf',
//     bold: __dirname + '/../../fonts/PingFang Medium.ttf',
//     italics: __dirname + '/../../fonts/PingFang Regular.ttf',
//     bolditalics: __dirname + '/../../fonts/PingFang Medium.ttf'
//   }
// }).createPdfKitDocument({content:genesContent});
// doc.pipe(fs.createWriteStream('aaa.pdf'));
// doc.end();