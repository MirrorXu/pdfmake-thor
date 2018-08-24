/**
 * Created by work on 17/12/21.
 */
/* eslint-disable */
const fs = require('fs');
const Printer = require('pdfmake');

const cover = require('../common/cover');
const namePdf = require('../common/namePdf');
const percentage = require('../common/percentage');
var devnull = require('dev-null');
// 生成酒精的报告
module.exports = function (data) {
  var totalPage = 0;

  function alcoholPDF() {

    function getPhenotypes (id) {
      return data.phenotypes[id];
    }
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

    function geneCatalog() {
      var catalog = [
        {
          name: '酒精代谢能力',
          page: 1,
          isSub: true
        },
        {
          name: '硝酸甘油代谢能力',
          page: 2,
          isSub: true
        },
        {
          name: '食管癌',
          page: 3,
          isSub: true
        }
      ];

      content.push(
        {
          text: '目录',
          fontSize: 18,
          bold: true,
          pageBreak: 'before'
        },
        {
          text: '—',
          fontSize: 36,
          bold: true,
          margin: [0, -15, 0, -15]
        },
        {
          text: 'CONTENTS',
          fontSize: 18,
          bold: true
        },
        {
          text: '01 致尊敬的客户',
          fontSize: 14,
          color: '#4393d0',
          margin: [122, 5, 0, 0],
          lineHeight: 1,
          bold: true
        },
        {
          text: '02 检测结果',
          fontSize: 14,
          color: '#4393d0',
          margin: [122, 15, 0, 10],
          lineHeight: 1,
          bold: true
        }
      );

      catalog.forEach(function (item) {
        if (item.isSub) {
          content.push({
            columns: [
              {
                width: '*',
                text: item.name,
                fontSize: 10,
                bold: true,
                color: '#231815',
                lineHeight: 1.4
              },
              {
                width: 'auto',
                text: item.page,
                fontSize: 10,
                bold: true,
                color: '#231815',
                lineHeight: 1.4,
                alignment: 'right'
              }
            ],
            margin: [145, 0, 0, 0]
          });
        } else {
          content.push({
            columns: [
              {
                width: '*',
                text: item.name,
                fontSize: 12,
                color: '#4393d0',
                bold: true,
                lineHeight: 1.4
              },
              {
                width: 'auto',
                text: item.page,
                fontSize: 12,
                bold: true,
                color: '#4393d0',
                lineHeight: 1.4,
                alignment: 'right'
              }
            ],
            margin: [132, 8, 0, 0]
          });
        }
      });

      content.push(
        {
          text: '03 关于索真健康',
          fontSize: 14,
          color: '#4393d0',
          margin: [122, 10, 0, 0],
          lineHeight: 1.8,
          bold: true
        }
      );
    }
    /**
     * @method geneItems 生成单项疾病详情
     * @param {object} data 表型的items
     */
    function geneAlc(data) {
      // 表盘
      let itemLevel = '';
      let resultColor = '';
      let resultName = '';
      let phenotypeName = '酒精代谢能力';
      switch (data.rank) {
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
                      text: ' ' + data.populate + '%' || '',
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
                // }
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
                  text: data.result[0].genotype || '--',
                  border: [false, false, false, false],
                  alignment: 'center',
                  fontSize: 10,
                  color: '#231815',
                  bold: true,
                  margin: [0, 2, 0, 2]
                // },
                // {
                //   text: '乙醇代谢能力: ' + grade(data.result[0].rank) || '--',
                //   border: [false, false, false, false],
                //   alignment: 'center',
                //   fontSize: 10,
                //   color: '#231815',
                //   bold: true,
                //   margin: [0, 2, 0, 2]
                }
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
                  text: data.result[1].genotype || '--',
                  border: [false, false, false, false],
                  alignment: 'center',
                  fontSize: 10,
                  bold: true,
                  color: '#231815',
                  margin: [0, 2, 0, 2]
                // },
                // {
                //   text: '乙醛代谢能力: ' + grade(data.result[1].rank) || '--',
                //   border: [false, false, false, false],
                //   alignment: 'center',
                //   fontSize: 10,
                //   bold: true,
                //   color: '#231815',
                //   margin: [0, 2, 0, 2]
                }
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

    function geneOther(data) {
      const phenotypeList = [];
      phenotypeList.push(data.info.alcohol.items.find(item => item.phenotypeId === 111));
      phenotypeList.push(data.info.alcohol.items.find(item => item.phenotypeId === 64));
      phenotypeList.forEach(function (item, index) {
        if (!item.ignore) {
          var itemLevel = __dirname + '/img/normal.png';
          var resultColor = '#49B67F';
          switch (item.score) {
            case -1: {
              resultColor = '#ED7038';
              itemLevel = __dirname + (item.phenotypeId === 111 ? '/img/high.png' : '/img/high1.png');
              break;
            }
            case 0: {
              resultColor = '#49B67F';
              itemLevel = __dirname + (item.phenotypeId === 111 ? '/img/normal.png' : '/img/normal1.png');
              break;
            }
            case 1: {
              resultColor = '#4BBED2';
              itemLevel = __dirname + (item.phenotypeId === 111 ? '/img/low.png' : '/img/low1.png');
              break;
            }
            default: {
              break
            }
          }
          var thisImg = __dirname + '/img/alcohol.jpg';
          if (item.phenotypeId === 111) {
            thisImg = __dirname + '/img/xsgy.jpg';
          } else if (item.phenotypeId === 64) {
            thisImg = __dirname + '/img/sga.jpg';
          }
          content.push(
            {
              columns: [
                {
                  image: thisImg,
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
                  text: item.phenotypeName || '',
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
          const showNum = getPhenotypes(item.phenotypeId).caseRate ? '平均每10万人中患病人数为:' : '';
          content.push(
            {
              columns: [
                {
                  image: itemLevel,
                  width: 185,
                  marginLeft: 26
                },
                {
                  stack: [
                    {
                      text: [
                        '您的'+ item.phenotypeName +(item.phenotypeId === 111 ? '为:' : '风险等级为:'),
                        {
                          text: ' ' + item.summary,
                          fontSize: 12,
                          color: resultColor
                        }
                      ],
                      fontSize: 10,
                      bold: true,
                      color: '#231815'
                    },
                    {
                      text: [
                        showNum,
                        {
                          text: ' ' + (getPhenotypes(item.phenotypeId).caseRate ? (getPhenotypes(item.phenotypeId).caseRate + '人') : ''),
                          fontSize: 10,
                          color: '#2ea7e0'
                        }
                      ],
                      fontSize: 10,
                      color: '#231815',
                      bold: true,
                      margin: [0, 3, 0, 3]
                    },
                    {
                      text: [
                        (item.phenotypeId === 111 ? '与您具有相同基因型的人群占比:' : '与您具有相同风险的人群占比:'),
                        {
                          text: ' ' + percentage((item.ratio * 100).toFixed(2).toString()) || '',
                          fontSize: 10,
                          color: '#2ea7e0'
                        }
                      ],
                      fontSize: 10,
                      bold: true,
                      color: '#231815'
                    }
                  ],
                  margin: [94, 20, 0, 0]
                }
              ],
              margin: [0, 54, 0, 30]
            }
            );
          if(item.phenotypeId === 64) {
            content.push({
              text: '注：以上结果是根据中国人群大样本流行病学和已知疾病相关位点研究成果对您的遗传风险作出的评估；' +
              '您可参考该数据更加精准的预防疾病，但不能将其作为临床诊断依据',
              fontSize: 10,
              color: '#231815',
              bold: true,
              margin: [0, 0, 0, 20]
            })
          }
          var lrTable = [
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
              //   text: item.phenotypeId === 111 ? '代谢能力' : '影响',
              //   border: [false, false, false, false],
              //   alignment: 'center',
              //   fontSize: 10,
              //   color: '#fff',
              //   margin: [0, 2, 0, 2],
              //   fillColor: '#7bc0e6'
              // },
              {
                text: '中国人群占比',
                border: [false, false, false, false],
                alignment: 'center',
                fontSize: 10,
                color: '#fff',
                margin: [0, 2, 0, 2],
                fillColor: '#7bc0e6'
              }
            ]
          ];


          item.genotypes.forEach(function(it) {
            if (!it.genotype) {
              return null;
            }
            var tableItem = [
              {
                text: it.gene || '',
                border: [false, false, false, false],
                alignment: 'center',
                fontSize: 10,
                color: '#231815',
                margin: [0, 2, 0, 2]
              },
              {
                // text: it.rsid || '',
                text: it.thid || it.rsid || '',
                border: [false, false, false, false],
                alignment: 'center',
                fontSize: 10,
                color: '#231815',
                margin: [0, 2, 0, 2]
              },
              {
                text: it.genotype || '--',
                border: [false, false, false, false],
                alignment: 'center',
                fontSize: 10,
                color: '#231815',
                margin: [0, 2, 0, 2]
              },
              // {
              //   text: it.summary || '--',
              //   border: [false, false, false, false],
              //   alignment: 'center',
              //   fontSize: 10,
              //   color: '#231815',
              //   margin: [0, 2, 0, 2]
              // },
              {
                text: percentage(it.frequency ? (it.frequency * 100).toFixed(2).toString() : null) || '--',
                border: [false, false, false, false],
                alignment: 'center',
                fontSize: 10,
                color: '#231815',
                margin: [0, 2, 0, 2]
              }
            ];
            lrTable.push(tableItem);
          });
          content.push(
            {
              text: '检测结果',
              style: 'partTitle'
            },
            {
              table: {
                headerRows: 1,
                dontBreakRows: true,
                keepWithHeaderRows: 1,
                // widths: [80, 105, 75, 90, 115],
                widths: [120, 120, 120, 120],
                body: lrTable
              }
            }
          );
          if (item.phenotypeId === 111) {
            content.push(
              {
                text: '硝酸甘油用药机制',
                fontSize: 14,
                bold: true,
                color: '#2ea7e0',
                margin: [0, 10, 0, 5]
              },
              {
                text: '1、乙醛脱氢酶2(ALDH2)是硝酸甘油在人体内生物代谢的关键酶,三硝酸甘油(NTG)通过乙醛脱氢酶2(ALDH2) ' +
                '的代谢产生等分子量的二硝酸甘油(NDG)和一氧化氮(NO),一氧化氮(NO)是硝酸甘油扩张血管的主要活性物质。' +
                '一氧化氮(NO)可刺激血小板和平滑肌的鸟苷酸环化酶,从而增加cGMP的合成,使血管平滑肌舒张, 血管扩张。 ' ,
                fontSize: 10,
                lineHeight: 1.2,
                bold: true,
                color: '#231815'
              },
              {
                text: '2、其治疗心绞痛的生理机制不仅仅是通过直接扩张冠心病缺血区域的血管,从而直接增加缺血区域的氧供,' +
                '更主要的是在于其扩张动静脉血管,可以降低心脏的前后负荷,从而降低心脏的氧耗。',
                fontSize: 10,
                lineHeight: 1.2,
                bold: true,
                color: '#231815',
                margin: [0, 0, 0, 12]
              },
              {
                text: '药物应用',
                fontSize: 14,
                bold: true,
                color: '#2ea7e0',
                margin: [0, 10, 0, 5]
              },
              {
                text: '本品为血管扩张剂,用于预防及治疗冠状动脉狭窄引起的心绞痛,也可用于降低血压或治疗充血性心力衰竭。',
                fontSize: 10,
                lineHeight: 1.2,
                bold: true,
                color: '#231815',
                margin: [0, 0, 0, 12]
              },
              {
                text: '用药指导',
                fontSize: 14,
                bold: true,
                color: '#2ea7e0',
                margin: [0, 10, 0, 5]
              },
              {
                text: '服用硝酸甘油常见以下不良反应,用法用量均应在专科医生的指导下进行,如有不适,应及时就医。\r\n' +
                '1、头痛:可于用药后立即发生,可为剧痛和呈持续性。 \r\n' +
                '2、偶可发生眩晕、虚弱、心悸和其他体位性低血压的表现,尤其在直立、制动的患者。\r\n' +
                '3、治疗剂量可发生明显的低血压反应,表现为恶心、呕吐、虚弱、出汗、苍白和虚脱。\r\n' +
                '4、晕厥、面红、药疹和剥脱性皮炎均有报告。',
                fontSize: 10,
                lineHeight: 1.2,
                bold: true,
                color: '#231815',
                margin: [0, 0, 0, 12]
              }
            );
          } else {
            content.push(
              {
                text: '特别提示',
                style: 'hint'
              },
              {
                text: '1、基因检测不同于临床诊断，其结果不能作为判断受检者是否患有某种疾病的临床诊断依据，但可作为疾病预防和精准医疗的重要参考。',
                style: 'hintContent'
              },
              {
                text: '2、在未获知您的生活习惯、饮食方式、疾病史、家族史、运动习惯等相关信息的前提下，' +
                '我们给出的疾病风险等级评估是仅基于您的遗传信息作出的判断，不包括疾病相关的理化因素、生活因素、社会-心理学因素等对疾病易感性的影响。',
                style: 'hintContent'
              },
              {
                text: [
                  '3、本报告疾病风险等级分为“',
                  {
                    text: '偏低',
                    color: '#4CB4C7'
                  },
                  '、',
                  {
                    text: '正常',
                    color: '#4AAE7A'
                  },
                  '、',
                  {
                    text: '偏高',
                    color: '#E26D39'
                  },
                  '”三个等级。疾病风险等级评定的参考对象是普通人群。（1）风险等级“',
                  {
                    text: '正常',
                    color: '#4AAE7A'
                  },
                  '”指您的发病几率与人群平均发病几率相近，并不表示无发病风险，仍然需要根据预防建议保持良好的生活、饮食、运动习惯，' +
                  '出现相关临床症状时需配合相关临床检查。 (2)风险等级“',
                  {
                    text: '偏低',
                    color: '#4CB4C7'
                  },
                  '”指您的发病几率低于平均水平，但并不排除环境因素致病的可能，同样需要加以预防。 (3)风险等级“',
                  {
                    text: '偏高',
                    color: '#E26D39'
                  },
                  '”指您的发病几率高于平均水平，相对易受到环境因素的影响而发病,需引起您的高度关注。'
                ],
                style: 'hintContent'
              }
            );
            content.push(
              {
                image: __dirname + '/img/geneTop.jpg',
                width: 595,
                absolutePosition: {x: 0, y: 0},
                pageBreak: 'before'
              }
            );

            content.push(
              {
                text: 'NOOP',
                fontSize: 0,
                color: '#fff',
                margin: [0, 160, 0, 5]
              }
            );
            // 基因知识 new
            if (item.genes && item.genes.length > 0) {
              content.push(
                {
                  text: '基因知识',
                  fontSize: 14,
                  bold: true,
                  color: '#2ea7e0',
                  margin: [0, 10, 0, 5]
                }
              );
              item.genes.forEach(function (gene, geneIdx) {
                content.push(
                  {
                    text: gene.related || '',
                    fontSize: 10,
                    lineHeight: 1.2,
                    bold: true,
                    color: '#231815',
                    margin: [0, 0, 0, 12]
                  }
                );
              })
            }
            // 疾病简介 new
            content.push(
              {
                text: '疾病简介',
                fontSize: 14,
                bold: true,
                color: '#2ea7e0',
                margin: [0, 10, 0, 5]
              },
              {
                text: getPhenotypes(item.phenotypeId).introduction || '',
                fontSize: 10,
                lineHeight: 1.2,
                bold: true,
                color: '#231815',
                margin: [0, 0, 0, 12]
              }
            );
            // 疾病与遗传 new
            if (getPhenotypes(item.phenotypeId).geneticCorrelation) {
              content.push(
                {
                  text: '疾病与遗传',
                  fontSize: 14,
                  bold: true,
                  color: '#2ea7e0',
                  margin: [0, 10, 0, 5]
                },
                {
                  text: getPhenotypes(item.phenotypeId).geneticCorrelation || '',
                  fontSize: 10,
                  lineHeight: 1.2,
                  bold: true,
                  color: '#231815',
                  margin: [0, 0, 0, 12]
                }
              );
            }

            // 疾病临床症状 new
            if (getPhenotypes(item.phenotypeId).symptom) {
              content.push(
                {
                  text: '疾病临床症状',
                  fontSize: 14,
                  bold: true,
                  color: '#2ea7e0',
                  margin: [0, 10, 0, 5]
                },
                {
                  text: getPhenotypes(item.phenotypeId).symptom || '',
                  fontSize: 10,
                  lineHeight: 1.2,
                  bold: true,
                  color: '#231815',
                  margin: [0, 0, 0, 12]
                }
              );
            }


            // 高危风险因素 new
            if (getPhenotypes(item.phenotypeId).jsonCause.items && getPhenotypes(item.phenotypeId).jsonCause.items.length > 0) {
              content.push(
                {
                  text: '高危风险因素',
                  fontSize: 14,
                  bold: true,
                  color: '#2ea7e0',
                  margin: [0, 10, 0, 5]
                }
              );
              getPhenotypes(item.phenotypeId).jsonCause.items.forEach(function (risk, riskIdx) {
                content.push(
                  {
                    text: (riskIdx + 1) + '、' + risk.title || '',
                    fontSize: 10,
                    lineHeight: 1.2,
                    bold: true,
                    color: '#231815'
                  },
                  {
                    text: risk.desc || '',
                    fontSize: 10,
                    lineHeight: 1.2,
                    bold: true,
                    color: '#231815',
                    margin: [0, 0, 0, 10]
                  }
                );
              })
            }

            // 疾病预防 new
            if (getPhenotypes(item.phenotypeId).prevention) {
              content.push(
                {
                  text: '疾病预防',
                  fontSize: 14,
                  bold: true,
                  color: '#2ea7e0',
                  margin: [0, 10, 0, 5]
                },
                {
                  text: getPhenotypes(item.phenotypeId).prevention || '',
                  fontSize: 10,
                  lineHeight: 1.2,
                  bold: true,
                  color: '#231815',
                  margin: [0, 0, 0, 12]
                }
              );
            }

            //  预防建议 new
            if (getPhenotypes(item.phenotypeId).jsonPreventionGeneral.items && getPhenotypes(item.phenotypeId).jsonPreventionGeneral.items.length > 0) {
              content.push(
                {
                  text: '预防建议',
                  fontSize: 10,
                  bold: true,
                  color: '#2ea7e0',
                  margin: [0, 10, 0, 5]
                }
              );
              getPhenotypes(item.phenotypeId).jsonPreventionGeneral.items.forEach(function (advise, adviseIdx) {
                content.push(
                  {
                    text: (adviseIdx + 1) + '、' + advise.title || '',
                    fontSize: 10,
                    lineHeight: 1.2,
                    bold: true,
                    color: '#231815'
                  },
                  {
                    text: advise.desc || '',
                    fontSize: 10,
                    lineHeight: 1.2,
                    bold: true,
                    color: '#231815',
                    margin: [0, 0, 0, 10]
                  }
                );
              })
            }

            //  体检建议 new
            content.push(
              {
                text: '体检建议',
                fontSize: 10,
                bold: true,
                color: '#2ea7e0',
                margin: [0, 10, 0, 5]
              },
              {
                text: getPhenotypes(item.phenotypeId).jsonPreventionCheckup.summary || '',
                fontSize: 10,
                bold: true,
                color: '#231815',
                margin: [0, 0, 0, 10]
              }
            );
            if (getPhenotypes(item.phenotypeId).jsonPreventionCheckup.items && getPhenotypes(item.phenotypeId).jsonPreventionCheckup.items.length > 0) {
              getPhenotypes(item.phenotypeId).jsonPreventionCheckup.items.forEach(function (advise, adviseIdx) {
                content.push(
                  {
                    text: (adviseIdx + 1) + '、' + advise.title || '',
                    fontSize: 10,
                    bold: true,
                    color: '#231815'
                  },
                  {
                    text: advise.desc || '',
                    fontSize: 10,
                    bold: true,
                    color: '#231815'
                  }
                );
              })
            }
          }
        }
      });
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
          image: __dirname + '/img/lastPage.jpg',
          width: 595,
          height: 845,
          margin: [-40, -44, -60, -70],
          pageBreak: 'before'
        }
      );
    }

    geneToCus();
    geneCatalog();
    geneAlc(data.alcoholSubReportDetail.info);
    geneOther(data);
    geneEnding();

    // 页脚,样式
    const COMMON_PART = {
      // 页脚(页码)
      footer: function(currentPage, pageCount) {
        // var page = [1, 2, 3, 4, 11, 12];
        var page = [1, 2, 3, 4, 10];
        if(page.indexOf(currentPage) !== -1) {
          return {
            text: ''
          };
        }
        totalPage = pageCount;
        return {
          text: currentPage - 4,
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
        },
        hint: {
          fontSize: 12,
          bold: true,
          margin: [0, 30, 0, 0]
        },
        hintContent: {
          fontSize: 10,
          lineHeight: 1.2,
          bold: true,
          margin: [0, 12, 0, 0]
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