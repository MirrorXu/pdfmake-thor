/**
 * Created by work on 18/4/12.
 */
/* eslint-disable */
const dialPlate = require('./common/dialPlate');
const createTable = require('./common/createTable');
const partEnd = require('./common/partEnd');
const genes = require('./common/genes');


module.exports = function(data, phenotypes={phenotypeTplItems:[]}, partInfo=null, k=null) {
  const thisBar = dialPlate(phenotypes.resultCase);
  let pointer = '';
  let color = '';
  switch(data.score){
    case 0:
      pointer = 'pointer.png';
      color = '#6ebe72';
      break;
    case -1:
      pointer = 'pointer1.png';
      color = '#e47048';
      break;
    case 1:
      pointer = 'pointer0.png';
      color = '#7bc0e5';
      break;
    default:
      break;
  }
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
              text: k ? '散发性分析：' : '',
              fontSize: 12,
              color: '#3b9dd7',
              bold:true
            },
            {
              text: [
                `您的${data.phenotypeName}风险等级为：`,
                {
                  text: data.summary,
                  fontSize: 14,
                  color: color,
                  bold: true
                }
              ],
              fontSize: 10,
              bold: true,
              color: '#231815'
            },
            {
              text: [
                data.caseRate ? '平均每10万人中患病人数为：' : '',
                {
                  text: data.caseRate || '',
                  fontSize: 10,
                  color: '#28a7e1'
                }
              ],
              fontSize: 10,
              bold: true,
              color: '#231815'
            }
          ],
          margin: [-10, 120, 0, 0],
          lineHeight: 1.4
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
  ]);
  if(k){
      content = content.concat([
        {
          columns: [
            {
              image: k.genotypes.some((val) =>{val.level == 1}) ? __dirname + '/img/takeAlong.png' : __dirname + '/img/noTakeAlong.png',
              width: 120,
              margin: [60,30,0,0]
            },
            {
              text: k.genotypes.some((val) =>{val.level == 1}) ? '携带' : '未携带',
              fontSize: '14',
              color: k.genotypes.some((val) =>{val.level == 1}) ? '#e47048' : '#6ebe72',
              margin: [-22,65,0,0]
            },
            {
              text: '致病突变',
              fontSize: '14',
              color:k.genotypes.some((val) =>{val.level == 1}) ? '#e47048' : '#6ebe72',
              margin: [-148,85,0,0]
            },
            {
              stack: [
                {
                  text:'家族性分析：',
                  fontSize: 12,
                  color: '#3b9dd7',
                  bold:true
                },
                {
                  text: [
                    '您',
                    {
                      text: k.genotypes.some((val) =>{val.level == 1}) ? '携带' : '未携带',
                      fontSize: 14,
                      color: k.genotypes.some((val) =>{val.level == 1}) ? '#e47048' : '#6ebe72',
                      bold:true
                    },
                    `家族性${k.phenotypeName}的致病突变`
                  ],
                  fontSize: 10,
                  bold: true,
                  color: '#231815'
                }
              ],
              margin: [-110, 60, 0, 0],
              lineHeight: '1.4'
            }
          ],
          pageBreak:'before'
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
          }
        },
        {
          text: k.genotypes.length > 10 ? `还有${k.genotypes.length - 10}条非致病突变未显示` : '',
          alignment: 'center',
          fontSize: '10',
          color:'#9fa0a0'
        },
      ])
  }
  content.push({
    text: '注:以上结果是根据中国人群大样本流行病学和已知疾病相关位点研究成果对您的遗传风险作出的评估；您可参考该数据更加精准的预防疾病，但不能将其作为临床诊断依据。',
    fontSize: '10',
    color:'#9fa0a0',
    bold:true,
    margin: k ? [0, 20,0,0] : [0,20,0,20],
    lineHeight: 1.3
  });
  if(k){
    content.push(
      {
        text: '散发性肿瘤一般不会在家族密集型发生。所谓家族性肿瘤，就是一种典型的发生在家庭成员，如父母、兄弟、姐妹之间的癌症，家族中有多人发生相似或同系统肿瘤，或者年龄不到50岁就被诊断为恶性肿瘤。',
        fontSize: '10',
        color:'#9fa0a0',
        bold:true,
        lineHeight: 1.3,
        margin:[0,0,0,20]
      }
    )
  };
  let partEndData = [];
  if(phenotypes.phenotypeTplItems.length > 0){
    for(var i=4; i<phenotypes.phenotypeTplItems.length; i++){
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