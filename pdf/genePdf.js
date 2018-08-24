/**
 * Created by work on 17/8/14.
 */
const geneLife = require('./life/lifePDF');
// const geneIns = require('./insurance/insurance');
const geneCU = require('./checkUp/checkUp');
const genAlcohol = require('./alcohol/alcohol');
const genAlcohol3Items = require('./alcohol/alcohol3');
const genP53 = require('./p53/p53');
const genApoe = require('./apoe/apoe');
const geneLifeHealth = require('./generalduty/generalduty');

module.exports = function (data) {
  if (process.env.NODE_ENV !== 'production') {
    console.log(JSON.stringify(data));
  }
  switch (data.productId) {
    case 48: {
      return genAlcohol3Items(data);
    }
    case 8: case 50: case 53: {
      return geneLife(data);
    }
    case 5: {
      return geneLifeHealth(data);
    }
    case 1: {
      return genAlcohol(data);
    }
    case 18: {
      return genP53(data);
    }
    case 49: {
      return genApoe(data);
    }
    // case 11: case 12: case 13: case 21: case 19: case 20: case 22: case 23: case 24: {
    //   return geneIns(data);
    // }
    // case 21: {
    //   return geneCU(data);
    // }

    // 通用的 case
    // case ((data.productId>=60) ? data.productId : -1):
    default: {
      return geneCU(data);
      // return null;
    }
  }
};

/** TODO:
 * {
     *  checkerName，
     *  reportTime，
     *  content: [
     *    0 : {
     *      chapterName: "疾病易感风险",
     *      summary: "",
     *      details: [
     *        {
     *          groupId: 1,
     *          groupName: "疾病风险",
   *            analysis: [{
   *              phenotypeId: 23,
   *              phenotypeName: "肺癌",
   *              caseRate: '20人'
   *            }]
     *        }
     *      ]
     *    },
     *    1 : {
     *      chapterName: "遗传特征",
     *      details: [
     *        {
     *          groupId: 1,
     *          groupName: "医学特征",
     *          analysis: [{
   *              phenotypeId: 22,
   *              phenotypeName: "血糖水平",
   *              resultSummary: '偏高'
*            ··}]
     *        }
     *      ]
     *    }，
     *   2 : {
     *     chapterName: "药物反应",
     *     details: [{
     *        tplCategory: "降压类药物",
     *        analysis: [{
     *           phenotypeId: 26,
 *               phenotypeName: "阿替洛尔",// title
 *               recommendation: "建议增加药物用量",
 *               goodsName: ""
     *        }]
     *        }
     *     ]
     *   },
     *   3 : {
     *    chapterName: "综合健康建议",
     *    summary: "维生素A、维生素D、维生素C、维生素E、镁、钙",
     *    details: [{
     *      analysis: [{
     *        phenotypeId: 26,
     *        phenotypeName: "维生素A",
     *        richFood: ""
     *      }]
     *      }
     *    ]
     *   }
     *  ]
     * }
 */