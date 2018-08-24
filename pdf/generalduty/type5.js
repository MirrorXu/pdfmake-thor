/**
 * Created by work on 18/4/12.
 */
/* eslint-disable */
const createTable = require('./common/createTable');
const partEnd = require('./common/partEnd');

module.exports = function(k, phenotypes, partInfo=null){
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
      text: k.phenotypeName,
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
      text: k.phenotypeName || '',
      fontSize: 21,
      alignment: 'center',
      color: '#fff',
      bold:true,
      margin:[0, 16, 0, 0]
    },
    {
      columns: [
        {
          image: k.genotypes.some((val) =>{val.level == 1}) ? __dirname + '/img/takeAlong.png' : __dirname + '/img/noTakeAlong.png',
          width: 120,
          margin: [60,90,0,0]
        },
        {
          text: k.genotypes.some((val) =>{val.level == 1}) ? '携带' : '未携带',
          fontSize: '12',
          color: k.genotypes.some((val) =>{val.level == 1}) ? '#e47048' : '#6ebe72',
          margin: [-18,125,0,0]
        },
        {
          text: '风险突变',
          fontSize: '12',
          color:k.genotypes.some((val) =>{val.level == 1}) ? '#e47048' : '#6ebe72',
          margin: [-142,145,0,0]
        },
        {
          stack: [
            {
              text: [
                '您',
                {
                  text: k.genotypes.some((val) =>{val.level == 1}) ? '携带' : '未携带',
                  fontSize: 14,
                  color: k.genotypes.some((val) =>{val.level == 1}) ? '#e47048' : '#6ebe72',
                  bold:true
                },
                `${k.phenotypeName || '--'}的风险突变`
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
        widths: [110, 110,110,110],
        body: k.genotypes.length > 10 ? createTable(4,k.genotypes.slice(0,10)) : createTable(4,k.genotypes)
      },
      layout: {
        fillColor: function (i, node) { return (i === 0) ?  '#7bc0e5' : null; },
        hLineColor: '#dcdddd'
      },
    },
    {
      text: k.genotypes.length > 10 ? `还有${k.genotypes.length - 10}条非致病突变未显示` : '',
      alignment: 'center',
      fontSize: '10',
      color:'#9fa0a0',
      margin:[0,0,0,20]
    }
  ]);
  let partEndData = [];
  if(phenotypes){
    partEndData.push({
      text:phenotypes.phenotypeTplItems[2].split(':')[1],
      desc:phenotypes[phenotypes.phenotypeTplItems[2].split(':')[0]]
    });
  }
  content=content.concat(partEnd(partEndData));
  return content;
};