/**
 * Created by work on 18/4/12.
 */
/* eslint-disable */
const createTable = require('./common/createTable');
const partEnd = require('./common/partEnd');
const genes = require('./common/genes');

module.exports = function(data,phenotypes={phenotypeTplItems:[]},partInfo=null){
  let content=[];

  partInfo
    ?
    content.push({
      image: partInfo.img,
      width:600,
      pageBreak: 'before',
      absolutePosition:{x:0,y:0}
    })
    :
    null;

  content = content.concat([
    {
      text: data.phenotypeName,
      fontSize: 21,
      color: '#f00',
      alignment: 'center',
      pageBreak: 'before',
      absolutePosition: {x: 0, y: 0},
    },
    {
      image: __dirname + '/img/topBg.png',
      width: 595,
      absolutePosition: {x: 0, y: 0}
    },
    {
      text: partInfo ? `${partInfo.part} ${partInfo.name}` : '',
      fontSize: 14,
      alignment: 'center',
      color: '#fff',
      bold:true
    },
    {
      text: data.phenotypeName,
      fontSize: 21,
      alignment: 'center',
      color: '#fff',
      bold:true,
      margin:[0, 16, 0, 0]
    },
    {
      columns: [
        {
          image: data.score === 0 ? __dirname + '/img/noTakeAlong.png' : __dirname + '/img/takeAlong.png',
          width: 120,
          margin: [60,90,0,0]
        },
        {
          text: data.score === 0 ? '未携带' : '携带',
          fontSize: '12',
          color: data.score === 0 ? '#6ebe72' : '#e47048',
          margin: [-18,125,0,0]
        },
        {
          text: '风险突变',
          fontSize: '12',
          color: data.score === 0 ? '#6ebe72' : '#e47048',
          margin: [-142,145,0,0]
        },
        {
          stack: [
            {
              text: [
                '您',
                {
                  text: data.score === 0 ? '未携带' : '携带',
                  fontSize: 14,
                  color: data.score === 0 ? '#6ebe72' : '#e47048',
                  bold:true
                },
                `${data.phenotypeName}的风险突变`
              ],
              fontSize: 10,
              bold: true,
              color: '#231815'
            }
          ],
          margin: [-110, 140, 0, 0],
          lineHeight: '1.4'
        }
      ],
    },
    {
      text: '检测结果',
      color: '#3b9dd7',
      fontSize: 12,
      margin: [10, 30, 0, 6],
      bold: true
    },
    {
      table: {
        headerRows: 1,
        dontBreakRows: true,
        keepWithHeaderRows: 1,
        widths: [85, 90,80,90,85],
        body: createTable(5,data.genotypes)
      },
      layout: {
        fillColor: function (i, node) { return (i === 0) ?  '#7bc0e5' : null; },
        hLineColor: '#dcdddd'
      }
    },
    {
      text:'间隙',
      color:'#fff'
    }
  ]);
  let partEndData = [];
  if(phenotypes.phenotypeTplItems.length > 0){
    for(var i=2; i<phenotypes.phenotypeTplItems.length; i++){
      var itemArr = phenotypes.phenotypeTplItems[i].split(':');
      partEndData.push({
        text:itemArr[1],
        desc:phenotypes[itemArr[0]]
      })
    }
  }
  if(data.genes.length !== 0){
    content=content.concat(genes(data.genes));
  }
  content=content.concat(partEnd(partEndData));
  return content;
};
