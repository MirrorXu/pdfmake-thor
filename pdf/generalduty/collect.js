/**
 * Created by chao.z on 18/4/23.
 */

/* eslint-disable */
const annular = require('./common/annular');
const collectTable = require('./common/collectTable').generatePdf;

module.exports = function(checker, reportTime, sunmmaryData, tempObj) {
  const huan = annular({
    high: sunmmaryData[0].summary.highRisk,
    middle:sunmmaryData[0].summary.normal,
    low:sunmmaryData[0].summary.lowRisk
  });
  let content=[
    {
      image: __dirname + '/img/firstPage.jpg',
      width:595,
      absolutePosition:{x:0, y:0}
    },
    {
      text:[
        {
          text:'尊敬的'
        },
        {
          text:checker.name,
          color: '#3b9dd7',
          bold:true
        },
        {
          text:checker.sex === 0 ? '先生：' : '女士：'
        }
      ],
      fontSize:13,
      color: '#3f3b3a',
      bold:true,
      absolutePosition:{x:60, y:74},
    },
    {
      text:reportTime,
      color:'#231815',
      bold:true,
      fontSize:13,
      absolutePosition:{x:60, y:420},
      pageBreak:'after'
    },
    {
      image: __dirname + '/img/secondPage.jpg',
      width:595,
      absolutePosition:{x:0, y:0},
      pageBreak:'after'
    },

    {
      image: __dirname + '/img/mulu.png',
      width: 595,
      absolutePosition:{x:0, y:0}
    },
    {
      text:'疾病易感风险评估结果',
      color:'#fff',
      fontSize: 20,
      bold:true,
      margin:[ 0,-10,0,20]
    },
    {
      text:'在您所检测的疾病中：',
      color:'#595656',
      fontSize:12,
      margin:[0,60,0,0],
      bold:true
    },
    {
      text:[
        `${sunmmaryData[0].summary.highRisk}种疾病`,
        {
          text:'风险偏高',
          color:'#e47048'
        },
        '，患病风险高于普通人群，请您重点关注与预防；'
      ],
      color:'#595656',
      fontSize:10,
      margin:[0,6,0,0]
    },
    {
      text:[
        `${sunmmaryData[0].summary.normal}种疾病`,
        {
          text:'风险正常',
          color:'#6ebe72'
        },
        '，患病风险等于普通人群，请您适当关注;'
      ],
      color:'#595656',
      fontSize:10,
      margin:[0,6,0,0]
    },
    {
      text:[
        `${sunmmaryData[0].summary.lowRisk}种疾病`,
        {
          text:'风险偏低',
          color:'#7bc0e5'
        },
        '，患病风险低于普通人群。'
      ],
      color:'#595656',
      fontSize:10,
      margin:[0,6,0,0]
    },
    {
      image: huan.url,
      width: huan.width,
      height: huan.height,
      margin: [310, -120, 0, 0]
    },
    {
      image:__dirname + '/img/huan.png',
      width: 160,
      height: 10,
      absolutePosition: {x: 360, y: 260},
    },
    {
      text:'需要关注的健康风险',
      color:'#3b9dd7',
      fontSize:12,
      margin:[0,20,0,0],
      bold:true
    },
    {
      text:'分析结果未见异常并不代表没有疾病，如您有不适症状，请及时到医院就诊。',
      color:'#9fa0a0',
      fontSize:10,
      margin:[0,10,0,10]
    },
];
  content = content.concat(collectTable(sunmmaryData[0], tempObj));

  content = content.concat([
  {
    image: __dirname + '/img/top2.png',
    width: 595,
    absolutePosition: {x: 0, y: 0},
    pageBreak:'before'
  },
  {
    text:' 遗传特征评估结果',
    color:'#fff',
    fontSize: 20,
    bold:true,
    margin:[ 0,-10,0,20]
  },
  {
    text:'需要关注的遗传特征',
    color:'#4a4b9d',
    fontSize:12,
    margin:[0,40,0,0],
    bold:true
  },
  {
    text:'以下项目需要结合自身实际情况进行精准维护,指导建议请参见相关章节',
    color:'#9fa0a0',
    fontSize:10,
    margin:[0,10,0,10]
  },
]);

  content = content.concat(collectTable(sunmmaryData[1], tempObj));

content = content.concat([
  {
    image: __dirname + '/img/top3.png',
    width: 595,
    absolutePosition: {x: 0, y: 0},
    pageBreak:'before'
  },
  {
    text:'药物反应评估结果',
    color:'#fff',
    fontSize: 20,
    bold:true,
    margin:[ 0,-10,0,20]
  },
  {
    text:'药物通过各种途径进入人体后，会引起器官和组织的反应，不同基因型的人对药物的反应性也不同，故清楚明白自身对药物的反应性具有十分重要的意义。由于药物副作用的发病率高，危害性大，严重者可致死亡，故明白自身对药物的代谢能力对副作用的预防有重要意义。',
    color:'#595656',
    fontSize:10,
    margin:[0,30,0,10],
    lineHeight: 1.3,
    bold: true
  },
  {
    text:'本项检测包含8大类共37种药物多个位点，可以全面评估药物的疗效或副作用。',
    color:'#595656',
    fontSize:10,
    margin:[0,10,0,20],
    bold: true
  },
]);
  content = content.concat(collectTable(sunmmaryData[2], tempObj));
  content = content.concat([
    {
      image: __dirname + '/img/top4.png',
      width: 595,
      absolutePosition: {x: 0, y: 0},
      pageBreak:'before'
    },
    {
      text:'综合健康建议',
      color:'#fff',
      fontSize: 20,
      bold:true,
      margin:[ 0,-10,0,20]
    },
    {
      text:'慢性复杂性疾病的发生是多种因素共同作用导致的，除了遗传因素，也跟您的生活方式，生活环境等密切相关，请关注与疾病相关的预防建议，积极预防疾病。',
      color:'#000',
      fontSize:10,
      margin:[0,30,0,0],
      lineHeight: 1.3,
      bold: true
    },
    {
      image: __dirname + '/img/advisebg.png',
      width: 470,
      margin:[0,20,0,0]
    },
    {
      text:'饮食建议',
      fontSize: 12,
      margin:[10,-20,0,10],
      color:'#fff',
      bold: true
    },
    {
      text:'1. 在日常饮食中优先选择下列食物：',
      color:'#000',
      fontSize:10,
      lineHeight: 1.3,
      bold: true
    },
    {
      text:`补充富含${sunmmaryData[3].summary}的食物。`,
      color:'#000',
      fontSize:10,
      lineHeight: 1.3,
      margin:[0,0,0,10],
      bold: true
    }
  ]);
  sunmmaryData[3].details[0].analysis.forEach((item) => {
    content.push({
      text:`富含${item.title}的食物，如${item.richFood}`,
      color:'#000',
      fontSize:10,
      lineHeight: 1.3,
      margin:[0,0,0,10],
      bold: true
    });
  });

  content = content.concat([
    {
      text:'2. 在日常饮食中尽量减少食用下列食物：',
      color:'#000',
      fontSize:10,
      lineHeight: 1.3,
      margin:[0,10,0,0],
      bold: true
    },
    {
      text:'盐的摄入每天不超过6g，推荐高钾低钠盐。高盐食物，如香肠、各种腌制品、酱油、豆瓣酱等。',
      color:'#000',
      fontSize:10,
      lineHeight: 1.3,
      bold: true
    },
    {
      text:'3. 在日常饮食中尽量避免食用下列食物：',
      color:'#000',
      fontSize:10,
      lineHeight: 1.3,
      margin:[0,20,0,0],
      bold: true
    },
    {
      text:'腌制、烟熏和油煎类食物。',
      color:'#000',
      fontSize:10,
      lineHeight: 1.3,
      bold: true
    },
    {
      image: __dirname + '/img/advisebg.png',
      width: 470,
      margin:[0,20,0,0]
    },
    {
      text:'运动建议',
      fontSize: 12,
      margin:[10,-20,0,10],
      color:'#fff',
      bold: true
    },
    {
      text:'饮食过多与过少会损伤健康，运动太多和太少同样也会损伤体力；唯有适度运动可以产生、增进、保持体力和健康。',
      color:'#000',
      fontSize:10,
      lineHeight: 1.3,
      bold: true
    },
    {
      text:'1. 保持理想体重:维持理想体重对于降低心脑血管等慢性病的发病风险非常有利。您可以根据自己的基因检测结果采取运动减肥或节食减肥方法让您的体重指数(BMI)达到正常人理想体重标准值18.5-24之间。(体重指数BMI=体重/身高的平方(国际单位kg/m²)',
      color:'#000',
      fontSize:10,
      lineHeight: 1.3,
      bold: true
    },
    {
      text:'2. 人体运动是需要能量的，如果这些能量来自细胞内的有氧代谢，就是有氧运动；如果能量来自无氧酵解，就是无氧运动，无氧运动会产生大量乳酸等中间代谢产物。',
      color:'#000',
      fontSize:10,
      lineHeight: 1.3,
      margin:[0,20,0,0],
      bold: true
    },
    {
      text:'常见的有氧运动项目有:瑜伽、步行、慢跑、滑冰、游泳、骑自行车、打太极拳、跳健身舞、做韵律操等。有氧运动主要锻炼您的心血管与肺活量，同时简单的有氧运动可以帮助您养成锻炼习惯。',
      color:'#000',
      fontSize:10,
      lineHeight: 1.3,
      margin:[0,20,0,0],
      bold: true
    },
    {
      text:'建议您每周进行规律的体育锻炼，可选择您喜欢的运动形式，养成良好的运动习惯。比如每周5-7次，每次30分钟的慢跑或快走等运动方式。',
      color:'#000',
      fontSize:10,
      lineHeight: 1.3,
      margin:[0,20,0,0],
      bold: true
    },
    {
      text:'3. 可以根据您的运动健身基因检测结果，适当增加一些无氧运动。无氧运动最重要的一点是增加您的肌肉，肌肉是代谢活跃的组织，在构建和保持肌肉时需要消耗更多的能量。所以增加肌肉可以增加您的代谢率，帮助您更快地燃烧卡路里。',
      color:'#000',
      fontSize:10,
      lineHeight: 1.3,
      margin:[0,20,0,0],
      bold: true
    },
    {
      text:'健身小贴士：',
      color:'#7bc0e5',
      fontSize:10,
      margin:[0,20,0,0],
      lineHeight:1.2,
      bold: true
    },
    {
      text:'在此之前如您没有运动习惯或有运动禁忌症，请遵医嘱。运动时请您从最小量开始，循序渐进，并结合自我感觉来判断运动量是否适宜。',
      color:'#595757',
      fontSize:10,
      lineHeight:1.2,
      bold: true
    },
    {
      text:'1、运动量适宜表现为锻炼后有微汗、轻松愉快、食欲和睡眠良好，虽然稍感疲乏、肌肉酸痛，但休息后可以消失，次日体力充沛，有运动欲望。',
      color:'#595757',
      fontSize:10,
      lineHeight:1.2,
      bold: true
    },
    {
      text:'2、如出现心率明显加快、心律不齐、严重胸闷憋气、膝踝关节疼痛等症状时，应立即停止运动，及时与医生联系。',
      color:'#595757',
      fontSize:10,
      lineHeight:1.2,
      bold: true
    },
    {
      text:'3、运动时最好穿运动鞋/运动服，以免受伤。',
      color:'#595757',
      fontSize:10,
      lineHeight:1.2,
      bold: true,
      pageBreak: 'after'
    }
  ]);
  return content;
};
