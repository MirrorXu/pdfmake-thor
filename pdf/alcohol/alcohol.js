/**
 * Created by chao.z on 17/12/14.
 */
/* eslint-disable */
const fs = require('fs');
const Printer = require('pdfmake');
const cover = require('../common/cover');
const namePdf = require('../common/namePdf');


var devnull = require('dev-null');



// 生成酒精的报告
module.exports = function (data) {
  var totalPage = 0;
  function alcoholPDF()  {
    // 引入报告封面
    const coverPage = cover('酒精代谢能力基因检测报告', '/img/alcohol.png', data);

    var content = [...coverPage];

    // 生成致客户
    function geneToCus() {
      content.push(
        {
          image: __dirname + '/img/toCustomer.jpg',
          width: 590,
          margin: [-40, 0, -60, -70],
          pageBreak: 'before'
        }
      );
    }
    /**
     * @method geneItems 生成单项疾病详情
     * @param {object} data 表型的items
     */
    function geneItems(data) {
      // 表盘
      let itemLevel = '';
      let resultColor = '';
      let resultName = '';
      let phenotypeName = '酒精代谢能力';
      switch (data.info.rank) {
        case 4: {
          resultName = '滴酒不沾';
          resultColor = '#7bbfe6';
          itemLevel = __dirname + '/img/alcohol1.png';
          break;
        }
        case 3: {
          resultName = '小酌怡情';
          resultColor = '#7bc177';
          itemLevel = __dirname + '/img/alcohol2.png';
          break;
        }
        case 2: {
          resultName = '颇有雅量';
          resultColor = '#f5ba43';
          itemLevel = __dirname + '/img/alcohol3.png';
          break;
        }
        case 1: {
          resultName = '众醉独醒';
          resultColor = '#eb5d5b';
          itemLevel = __dirname + '/img/alcohol4.png';
          break;
        }
        case 0: {
          resultName = '量如江海';
          resultColor = '#e84165';
          itemLevel = __dirname + '/img/alcohol5.png';
          break;
        }
        default: {
          resultColor = '#e84165';
          itemLevel = __dirname + '/img/alcohol5.png';
          break
        }
      }
      // 表型以及表型配图
      content.push(
        {
          columns: [
            {
              image:  __dirname + '/img/alcohol.jpg',
              width: 297
            },
            {
              canvas: [
                {
                  type: 'rect',
                  x: 0,
                  y: 0,
                  w: 298,
                  h: 184,
                  color: '#7bc0e6'
                }
              ]
            }
          ],
          margin: [-40, -44, 0, 0],
          pageBreak: 'before'
        },
        {
          stack: [
            {
              text: phenotypeName || '',
              alignment: 'center',
              color: '#fff',
              fontSize: 18
            },
            {
              text: '——',
              alignment: 'center',
              color: '#fff',
              fontSize: 34,
              margin: [0, -18, 0, -18]
            },
            {
              text: '检测结果分析',
              alignment: 'center',
              color: '#fff',
              fontSize: 12
            }
          ],
          absolutePosition: {x: 357, y: 65}
        },
        {
          image: __dirname + '/img/radius.png',
          width: 74,
          absolutePosition: {x: 259.5, y: 167}
        });
      content.push(
        {
          columns: [
            {
              image: itemLevel,
              width: 200,
              marginLeft: 26
            },
            {
              stack: [
                {
                  text: [
                    '您的'+ phenotypeName +'为:',
                    {
                      text: ' ' + resultName,
                      fontSize: 14,
                      color: resultColor
                    }
                  ],
                  fontSize: 10,
                  color: '#231815'
                },
                {
                  text: [
                    '您的畅饮能力超越了',
                    {
                      text: ' ' + data.info.populate + '%' || '',
                      fontSize: 10,
                      color: '#2ea7e0'
                    },
                    ' 的人'
                  ],
                  fontSize: 10,
                  bold: true,
                  color: '#231815',
                  margin: [0, 10, 0, 0]
                }
              ],
              margin: [94, 20, 0, 0]
            }
          ],
          margin: [0, 24, 0, 10]
        },
        {
          text: '注: 以上检测结果仅反映先天酒精代谢能力,部分人长期饮酒会产生酒精耐受使酒量提升,但对于健康的损伤依然存在。',
          fontSize: 10,
          color: '#231815',
          bold: true,
          margin: [0, 0, 0, 20]
        });

      // 返回代谢能力等级
      function grade (rank) {
        var adinfluence;
        switch(rank) {
          case 0: {
            adinfluence = '强';
            break;
          }
          case 1: {
            adinfluence = '中';
            break;
          }
          case 2: {
            adinfluence = '弱';
            break;
          }
          default: {
            break;
          }
        }
        return adinfluence;
      }
      // 表格生成
      content.push(
        {
          text: '检测结果',
          style: 'partTitle',
          bold: true
        },
        {
          table: {
            headerRows: 1,
            dontBreakRows: true,
            keepWithHeaderRows: 1,
            // widths: [120, 125, 100, 125],
            widths: [160, 160, 160],
            body: [
              [
                {
                  text: '基因',
                  border: [false, false, false, false],
                  alignment: 'center',
                  fontSize: 10,
                  color: '#fff',
                  margin: [0, 2, 0, 2],
                  fillColor: '#7bc0e6'
                },
                {
                  text: '位点',
                  border: [false, false, false, false],
                  alignment: 'center',
                  fontSize: 10,
                  color: '#fff',
                  margin: [0, 2, 0, 2],
                  fillColor: '#7bc0e6'
                },
                {
                  text: '基因型',
                  border: [false, false, false, false],
                  alignment: 'center',
                  fontSize: 10,
                  color: '#fff',
                  margin: [0, 2, 0, 2],
                  fillColor: '#7bc0e6'
                },
                // {
                //   text: '影响',
                //   border: [false, false, false, false],
                //   alignment: 'center',
                //   fontSize: 10,
                //   color: '#fff',
                //   margin: [0, 2, 0, 2],
                //   fillColor: '#7bc0e6'
                // },
              ],
              [
                {
                  text: 'ADH1B',
                  border: [false, false, false, false],
                  alignment: 'center',
                  fontSize: 10,
                  color: '#231815',
                  bold: true,
                  margin: [0, 2, 0, 2]
                },
                {
                  text: 'rs1229984',
                  border: [false, false, false, false],
                  alignment: 'center',
                  fontSize: 10,
                  bold: true,
                  color: '#231815',
                  margin: [0, 2, 0, 2]
                },
                {
                  text: data.info.result[0].genotype || '--',
                  border: [false, false, false, false],
                  alignment: 'center',
                  fontSize: 10,
                  color: '#231815',
                  bold: true,
                  margin: [0, 2, 0, 2]
                },
                // {
                //   text: '乙醇代谢能力' + grade(data.info.result[0].rank) || '--',
                //   border: [false, false, false, false],
                //   alignment: 'center',
                //   fontSize: 10,
                //   color: '#231815',
                //   bold: true,
                //   margin: [0, 2, 0, 2]
                // }
              ],
              [
                {
                  text: 'ALDH2',
                  border: [false, false, false, false],
                  alignment: 'center',
                  fontSize: 10,
                  color: '#231815',
                  bold: true,
                  margin: [0, 2, 0, 2]
                },
                {
                  text: 'rs671',
                  border: [false, false, false, false],
                  alignment: 'center',
                  fontSize: 10,
                  bold: true,
                  color: '#231815',
                  margin: [0, 2, 0, 2]
                },
                {
                  text: data.info.result[1].genotype || '--',
                  border: [false, false, false, false],
                  alignment: 'center',
                  fontSize: 10,
                  bold: true,
                  color: '#231815',
                  margin: [0, 2, 0, 2]
                },
                // {
                //   text: '乙醛代谢能力' + grade(data.info.result[1].rank) || '--',
                //   border: [false, false, false, false],
                //   alignment: 'center',
                //   fontSize: 10,
                //   bold: true,
                //   color: '#231815',
                //   margin: [0, 2, 0, 2]
                // }
              ]
            ]
          }
        },
        {
          image:  __dirname + '/img/detection.png',
          width: 485,
          margin: [0, 30, 0, 0]
        }
      );
    }
    // 生成结尾
    function geneEnding() {
      content.push(
        // {
        //   image: __dirname + '/img/aboutThor.jpg',
        //   width: 595,
        //   margin: [-40, 1, -60, -70],
        //   pageBreak: 'after'
        // },
        {
          text: 'empty',
          color: '#fff',
          pageBreak: 'after'
        },
        {
          image: __dirname + '/img/lastPage.jpg',
          width: 595,
          height: 845,
          margin: [-40, -44, -60, -70],
          pageBreak: 'before'
        }
      );
    }

    geneToCus();
    geneItems(data);
    geneEnding();

    // 页脚,样式
    const COMMON_PART = {
      // 页脚(页码)
      footer: function(currentPage, pageCount) {
        // var page = [1, 2, 6, 7, 8];
        var page = [1, 2, 5, 6];
        if(page.indexOf(currentPage) !== -1) {
          return {
            text: ''
          };
        }
        totalPage = pageCount;
        return {
          text: currentPage - 2,
          bold: true,
          alignment: 'center'
        };
      },
      // 样式
      styles: {
        infoTableL: {
          fontSize: 10,
          lineHeight: 1,
          bold: true
        },
        infoTable: {
          fontSize: 10,
          alignment: 'center',
          lineHeight: .8,
          bold: true
        },
        partTitle: {
          fontSize: 12,
          bold: true,
          margin: [0, 0, 0, 10]
        }
      }
    };
    return Object.assign({}, {content: content}, COMMON_PART)
  }

  var doc = new Printer({
    Roboto: {
      normal: __dirname + '/../fonts/PingFang Regular.ttf',
      bold: __dirname + '/../fonts/PingFang Medium.ttf',
      italics: __dirname + '/../fonts/PingFang Regular.ttf',
      bolditalics: __dirname + '/../fonts/PingFang Medium.ttf'
    }
  }).createPdfKitDocument(alcoholPDF());

  doc.end();

  doc.pipe(devnull());

  return {
    fileName: namePdf(data.checker.name, data.productName, data.sampleNo, data.meetingNo),
    stream: doc,
    totalPage: totalPage
  };
};