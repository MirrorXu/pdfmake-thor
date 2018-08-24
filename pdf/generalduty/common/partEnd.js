/**
 * Created by chao.z on 18/4/11.
 */

/* eslint-disable */

// 除了基因知识 剩下的介绍 建议等等
module.exports = function(data) {
  let contentEnd=[];
  data.forEach(function(item){
    contentEnd.push(
      {
        table: {
          // headerRows: 1,
          // dontBreakRows: true,
          // keepWithHeaderRows: 1,
          widths: [465],
          body: [
            [
              {
                text: item.text,
                border: [false, false, false, false],
                alignment: 'left',
                fontSize: 12,
                color: '#3b9dd7',
                bold: true,
                fillColor: '#f0f2f2',
                margin:[10,0,0,0]
              }
            ],
            [
              {
                text:item.desc,
                border: [false, false, false, false],
                color:'#231815',
                fontSize: 10,
                lineHeight: 1.3,
                bold:true,
                margin:[0,10,0,10]
              }
            ]
          ]
        }
      }
    )
  });
  return contentEnd;
};
