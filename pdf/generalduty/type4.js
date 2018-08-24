/**
 * Created by work on 18/4/12.
 */
/* eslint-disable */
const dialPlate = require('./common/dialPlate');
const createTable = require('./common/createTable');
const genes = require('./common/genes');
const partEnd = require('./common/partEnd');

module.exports = function (data,phenotypes,partInfo=null){
  const thisBar = dialPlate(phenotypes.resultCase);
  let pointer = '';
  let resultDrawing = null;
  let IsTwoResults = false;
  switch(data.score){
    case 0:
      pointer = 'pointer.png';
      break;
    case 1:
      pointer = 'pointer0.png';
      break;
    case -1:
      pointer = 'pointer1.png';
      break;
    default:
      break;
  }
  if (phenotypes.resultCase[0].summary === phenotypes.resultCase[1].summary){
    IsTwoResults = true;
  } else if (phenotypes.resultCase[0].summary === phenotypes.resultCase[-1].summary){
    IsTwoResults = true;
  }
  if(IsTwoResults) {
    resultDrawing = {
      columns: [
        {
          image: data.score !== -1 ? __dirname + '/img/noTakeAlong.png' : __dirname + '/img/takeAlong.png',
          width: 120,
          margin: [60,90,0,0]
        },
        {
          text: phenotypes.resultCase[data.score].summary,
          fontSize: '12',
          color: data.score !== -1 ? '#6ebe72' : '#e47048',
          margin: [-10,140,0,0]
        },
        {
          stack: [
            {
              text: data.detail || '',
              fontSize: 12,
              bold: true,
              color: '#231815'
            }
          ],
          margin: [-10, 140, 0, 0],
          lineHeight: 1.4
        }
      ]
    }
  } else {
    resultDrawing = {
      columns: [
        {
          image: thisBar.url,
          width: thisBar.width,
          height: thisBar.height,
          margin: [0, 80, 0, 0]
        },
        {
          image: __dirname + '/img/' + pointer,
          width: 40,
          margin: [-138, 170, 0, 0]
        },
        {
          stack: [
            {
              text: data.detail || '',
              fontSize: 12,
              bold: true,
              color: '#231815'
            },
          ],
          margin: [-10, 140, 0, 0],
          lineHeight: 1.4
        }
      ]
    }
  }
  let content = [];
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
      text: data.phenotypeName || '',
      fontSize: 21,
      alignment: 'center',
      color: '#fff',
      bold:true,
      margin:[0, 16, 0, 0]
    },
  ]);
  content.push(resultDrawing);
  content = content.concat([
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
  if(phenotypes){
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
