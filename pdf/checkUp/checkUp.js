/**
 * Created by work on 17/11/14.
 */
/* eslint-disable */
  // width: 595  pdf页面宽度总点数
  // height: 842
const fs = require('fs');
const Printer = require('pdfmake');
const base64Img = require('base64-img');
const co = require('co');
var devnull = require('dev-null');
const percentage = require('../common/percentage');
const namePdf = require('../common/namePdf');
const CONFIG_DATA = require('./listData');
const log = require('../../logger');
const exists = require('../common/util.js').exists;
const download = require('../common/util.js').download;

const tempUrl = 'http://gene-report.thorgene.com/box_file/%E9%AB%98%E8%A1%80%E5%8E%8B.jpg';

/**
 * @param {object} allData 生成pdf所需的整个json数据
 * @return {object} 生成pdf所需的所有图片包裹的对象
 */
function* getImgs(allData) {
  const imgList = {};
  var imgCount = 0;
  log.info('图片开始转码');
  const keys = CONFIG_DATA.products[allData.productId].keys;
  for (let key of keys) {
    const phens = allData.info[key.key].items;
    for (let phen of phens) {
      if (!phen.ignore) {
        imgCount ++;
        const imgUrl = allData.phenotypes[phen.phenotypeId].imageUrl || tempUrl;
        const imgPath = (`./${phen.phenotypeId}_${phen.phenotypeName}_表型图片`);
        do {
          yield download(imgUrl, imgPath);
        } while (!exists(imgPath));
        imgList[phen.phenotypeId] = imgPath;
      }
    }
  }
  if (Object.keys(imgList).length === imgCount) {
    log.info('图片下载完成');
    return imgList;
  }
}

/**
 * @method  用于
 * @param {object} data 生成pdf所需的整个json数据
 * @return {object} 包含最终完整的pdf流和对应信息数据
 */
module.exports = function* (data) {
  const imgList = yield getImgs(data);
  const isSingle = CONFIG_DATA.products[data.productId].keys.length === 1 && data.info[CONFIG_DATA.products[data.productId].keys[0].key].items.length === 1;  // 判断是否需要合到一起显示
  /**
   * @method insurancePDF 用于生成pdf流和获取第一遍遍历流得到的页面信息数据
   * @param {object} searchData 页面信息数据
   * @return {object} 包含pdf流和对应页面信息数据
   */
  function insurancePDF (searchData) {
    //  定义content数组
    var content = [];
    var totalPage = 0;

    var footerPage = 0;
    // 表格生成方法
    // type: 'collectList' 汇总列表
    //       'locusResolution' 位点解析
    function tablePart (type, tableData) {
      if (!tableData || tableData.length === 0) {
        return null;
      }
      var tableCon = [];
      switch (type) {
        case 'collectList': {
          var collect = [
            [
              {
                text: '检测项目',
                border: [false, false, false, false],
                alignment: 'center',
                color: '#fff',
                fontSize: 10,
                margin: [0, 5, 0, 5]
              },
              {
                text: '风险等级',
                border: [false, false, false, false],
                alignment: 'center',
                color: '#fff',
                fontSize: 10,
                margin: [0, 5, 0, 5]
              }
            ]
          ];
          tableData.forEach(function (item) {
            if (!item.ignore) {
              var levelImg = '';
              switch (item.score) {
                case -1: {
                  levelImg = __dirname + '/img/redDot.png';
                  break;
                }
                case 0: {
                  levelImg = __dirname + '/img/greenDot.png';
                  break;
                }
                case 1: {
                  levelImg = __dirname + '/img/blueDot.png';
                  break;
                }
                default: {
                  break
                }
              }
              var collectItem = [
                {
                  text: item.phenotypeName || '',
                  border: [false, false, false, false],
                  alignment: 'center',
                  margin: [0, 3, 0, 3],
                  fontSize: 10
                },
                {
                  columns: [
                    {
                      image: levelImg,
                      width: 11,
                      marginTop: 2
                    },
                    {
                      text: item.summary || '',
                      color: '#231815',
                      fontSize: 10,
                      width: 80,
                      marginLeft: 5
                    }
                  ],
                  margin: [40, 6, 0, 0],
                  // alignment: 'center',
                  border: [false, false, false, false]
                }
              ];
              collect.push(collectItem);
            }
          });
          return collect;
        }
        case 'locusResolution': {
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
              //   text: '影响',
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
          tableData.forEach(function(item) {
            if (!item.genotype) {
              return null;
            }
            var tableItem =  [
              {
                text: item.gene || '',
                border: [false, false, false, false],
                alignment: 'center',
                fontSize: 10,
                color: '#231815',
                margin: [0, 2, 0, 2]
              },
              {
                // text: item.rsid || '',
                text: item.thid || item.rsid || '',
                border: [false, false, false, false],
                alignment: 'center',
                fontSize: 10,
                color: '#231815',
                margin: [0, 2, 0, 2]
              },
              {
                text: item.genotype || '--',
                border: [false, false, false, false],
                alignment: 'center',
                fontSize: 10,
                color: '#231815',
                margin: [0, 2, 0, 2]
              },
              // {
              //   text: item.summary || '--',
              //   border: [false, false, false, false],
              //   alignment: 'center',
              //   fontSize: 10,
              //   color: '#231815',
              //   margin: [0, 2, 0, 2]
              // },
              {
                text: percentage(item.frequency ? (item.frequency * 100).toFixed(2).toString() : null) || '--',
                border: [false, false, false, false],
                alignment: 'center',
                fontSize: 10,
                color: '#231815',
                margin: [0, 2, 0, 2]
              }
            ];
            lrTable.push(tableItem);
          });
          tableCon = lrTable;
        }
      }
      return tableCon;
    }

    // 找到对应的表型描述
    function getPhenotypes (id) {
      return data.phenotypes[id];
    }

    /**
     * @method addBlankPage 添加空白页,如果符合条件 调用后将在整体流里添加空页
     * @param {bool} para 标示是否需要添加空页
     */
    function addBlankPage(para) {
      if (para) {
        content.push({
          text: 'BLANK_PAGE',
          style: 'forSearchWhite',
          pageBreak: 'after'
        });
      }
    }

    /**
     * @method geneCover 生成保险pdf封面
     * @param {object} data 生成pdf所需的整个json数据
     */
    function geneCover(data) {
      content.push(
        {
          image: __dirname + CONFIG_DATA.products[data.productId].coverFirst,
          width: 595,
          height: 845,
          margin: [-60, -44, -60, -70]
        },
        {
          text: 'COVER_START',
          style: 'forSearchWhite',
          absolutePosition: {x: 0, y: 0}
        },
        {
          text: '采样编号：' + data.sampleNo,
          fontSize: 12,
          absolutePosition: {x: 74, y: 605}
        },
        {
          text: '客户姓名：' + data.checker.name,
          fontSize: 12,
          absolutePosition: {x: 74, y: 630}
        },
        {
          text: '客户性别：' + (data.checker.sex ? '女' : '男'),
          fontSize: 12,
          absolutePosition: {x: 74, y: 655}
        }
      );
    }
    /**
     * @method geneCoverCU 生成体检报告封面
     * @param {object} data 生成pdf所需的整个json数据
     */
    function geneCoverCU(data) {
      var productTitle = CONFIG_DATA.products[data.productId].coverTitle;
      if (productTitle.length >= 16) {
        productTitle = productTitle.replace(/基因检测报告/,'\n基因检测报告')
      }
      content.push(
        {
          image: __dirname + '/img/logo.png',
          width: 88,
          margin: [-34, -10, 0, 0]
        },
        {
          text: 'COVER_START',
          style: 'forSearchWhite'
        },
        {
          text: productTitle,
          fontSize: 28,
          width: 595,
          absolutePosition: {x: 60, y: 128},
          // marginTop: 55,
          color: '#231815',
          alignment: 'center',
          bold: true
        },
        {
          image: __dirname + '/img/firstImg.png',
          width: 358,
          alignment: 'center',
          marginTop: 207
        },
        {
          text: '个人信息',
          fontSize: 14,
          color: '#231815',
          margin: [113, 100, 0, 0],
          bold: true
        },
        {
          text: '(Personal Details)',
          fontSize: 9,
          color: '#231815',
          margin: [113, 0, 0, 0]
        },
        {
          margin: [113, 20, 0, 0],
          color: '#231815',
          bold: true,
          table: {
            widths: [44, 66, 2, 44, 66],
            body: [
              [
                {text: '姓      名:', style: 'infoTableL', border: [false, false, false, false]},
                {text: data.checker.name || '', style: 'infoTable', border: [false, false, false, true]},
                {text: '', border: [false, false, false, false]},
                {text: '性      别:', style: 'infoTableL', border: [false, false, false, false]},
                {text: data.checker.sex ? '女' : '男', style: 'infoTable', border: [false, false, false, true]}
              ],
              [
                {text: '年      龄:', style: 'infoTableL', border: [false, false, false, false]},
                {text: data.checker.age || '', style: 'infoTable', border: [false, false, false, true]},
                {text: '', border: [false, false, false, false]},
                {text: '送检日期:', style: 'infoTableL', border: [false, false, false, false]},
                {text: data.activateTime || '', style: 'infoTable', border: [false, false, false, true]}
              ],
              [
                {text: '样本编号:', style: 'infoTableL', border: [false, false, false, false]},
                {text: data.sampleNo || '', style: 'infoTable', colSpan: 4, border: [false, false, false, true]},
                {},
                {},
                {}
              ],
              [
                {text: '送检项目:', style: 'infoTableL', border: [false, false, false, false]},
                {text: data.productName || '', style: 'infoTable', colSpan: 4, border: [false, false, false, true]},
                {},
                {},
                {}
              ],
              [
                {text: '送检单位:', style: 'infoTableL', border: [false, false, false, false]},
                {text: data.companyAddr || '', style: 'infoTable', colSpan: 4, border: [false, false, false, true]},
                {},
                {},
                {}
              ]
            ]
          },
          layout: {
            vLineColor: '#c9caca',
            hLineColor: '#c9caca'
          }
        },
        {
          text: '索 真 (北 京) 医 学 科 技 有 限 公 司',
          fontSize: 10,
          bold: true,
          color: '#231815',
          alignment: 'center',
          marginTop: 40
        }
      );
    }
    // 生成 致顾客页面
    function geneToCus() {
      content.push(
        {
          image: __dirname + '/img/toCustomer.jpg',
          width: 595,
          margin: [-60, -44, -60, -70]
        },
        {
          text: 'COVER_END',
          style: 'forSearchWhite'
        }
      );
    }
    /**
     * @method geneCatalog 生成目录
     * @param {object} data 生成pdf所需的整个json数据
     */
    function geneCatalog(data) {
      var catalog = [];
      CONFIG_DATA.products[data.productId].keys.forEach(function (item) {
        if (CONFIG_DATA.products[data.productId].keys.length > 1) {
          catalog.push(
            {
              name: item.name || '' + '汇总',
              page: 99,
              isPart: true
            });
        } else {
          catalog.push(
            {
              name: '检测结果汇总',
              page: 99,
              isPart: true
            });
        }
        data.info[item.key].items.forEach(function (ite) {
          if (!ite.ignore) {
            catalog.push(
              {
                name: ite.phenotypeName || '',
                page: 99,
                isSub: true
              });
          }
        });
      });
      if (searchData) {
        searchData.numList.forEach(function (item, index) {
          var noFooter = 0;
          var idx = 0;
          while (idx < item - 1) {
            if (!searchData.pagesInfo[idx].footer) {
              noFooter++;
            }
            idx++;
          }
          catalog[index].page = item - noFooter;
        });
      }

      content.push(
        {
          text: 'CAT_START',
          style: 'forSearchWhite',
          pageBreak: 'before'
        },
        {
          text: '目录',
          fontSize: 18,
          bold: true
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
          margin: [122, 15, 0, 5],
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
            margin: [132, 0, 0, 0]
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
        },
        {
          text: 'CAT_END',
          style: 'forSearchWhite'
        }
      );
      // addBlankPage(searchData && searchData.addPageList.indexOf('CATALOG') !== -1);
    }

    /**
     * @method geneGather 生成检测结果汇总
     * @param {object} data 表型的items
     * @param {object} it 配置数据keys的每一个块
     */
    function geneGather(data, it) {
      content.push(
        {
          text: 'GATHER_START',
          style: 'forSearchWhite',
          pageBreak: 'before'
        },
        {
          text: it.name || '',
          style: 'title',
          alignment: 'center'
        },
        {
          text: 'RECORD',
          style: 'forSearchWhite'
        },
        {
          table: {
            headerRows: 1,
            dontBreakRows: true,
            keepWithHeaderRows: 1,
            widths: [150, 150],
            body: tablePart('collectList', data)
          },
          layout: {
            fillColor: function (i, node) { return (i === 0) ?  '#7bc0e6' : null; },
            hLineColor: '#dcdddd'
          },
          margin: [87, 30, 87, 0]
        }
      );

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
          text: 'GATHER_END',
          style: 'forSearchWhite'
        }
      );
      // addBlankPage(searchData && searchData.addPageList.indexOf('GATHER') !== -1);
    }

    /**
     * @method geneItems 生成单项疾病详情
     * @param {object} data 表型的items
     * @param {object} it 配置数据keys的每一个块
     */
    function geneItems(data, it) {
      if (!isSingle) {
        geneGather(data, it);
      }
      data.forEach(function (item, index) {
        if (!item.ignore) {
          function log(key, value) {
            if (typeof value === 'undefined') {
              log.info('item:' + item.phenotypeName + '/id:' + item.phenotypeId + ' lacks ' + key)
            }
          }
          log('genotypes', item.genotypes);
          log('score', item.score);
          log('riskValue', item.riskValue);
          log('summary', item.summary);
          log('ratio', item.ratio);
          log('genes', item.genes);
          var itemLevel = '';
          var resultColor = '';
          switch (item.score) {
            case -1: {
              resultColor = '#ED7038';
              itemLevel = __dirname + '/img/high.png';
              break;
            }
            case 0: {
              resultColor = '#49B67F';
              itemLevel = __dirname + '/img/normal.png';
              break;
            }
            case 1: {
              resultColor = '#4BBED2';
              itemLevel = __dirname + '/img/low.png';
              break;
            }
            default: {
              break
            }
          }
          const thisImg = imgList[item.phenotypeId];
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
              margin: [-60, -44, 0, 0],
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
          if (index === 0) {
            content.push(
              {
                text: 'DETAIL_START',
                style: 'forSearchWhite'
              }
            );
          }
          const showNum = getPhenotypes(item.phenotypeId).caseRate ? '平均每10万人中患病人数为:' : '';
          content.push(
            {
              text: 'RECORD',
              style: 'forSearchWhite'
            },
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
                        '您的'+ item.phenotypeName +'风险等级为:',
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
                        '与您具有相同风险的人群占比:',
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
            },
            {
              text: '注：以上结果是根据中国人群大样本流行病学和已知疾病相关位点研究成果对您的遗传风险作出的评估；' +
              '您可参考该数据更加精准的预防疾病，但不能将其作为临床诊断依据',
              fontSize: 10,
              color: '#231815',
              bold: true
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
                // widths: [70, 100, 70, 80, 110],
                widths: [120, 120, 120, 120],
                body: tablePart('locusResolution', item.genotypes)
              },
              pageBreak: 'after'
            }
          );

          content.push(
            {
              image: __dirname + '/img/geneTop.jpg',
              width: 595,
              absolutePosition: {x: 0, y: 0}
            }
          );

          content.push(
            {
              text: 'NOOP',
              style: 'forSearchWhite',
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
          if (getPhenotypes(item.phenotypeId).jsonCause.items.length > 0) {
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
          if (getPhenotypes(item.phenotypeId).jsonPreventionGeneral.items.length > 0) {
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
              text: getPhenotypes(item.phenotypeId).jsonPreventionCheckup.summary,
              fontSize: 10,
              bold: true,
              color: '#231815',
              margin: [0, 0, 0, 10]
            }
          );
          if (getPhenotypes(item.phenotypeId).jsonPreventionCheckup.items.length > 0) {
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
      });
      content.push(
        {
          text: 'DETAIL_END',
          style: 'forSearchWhite'
        }
      )
    }

    // 生成结尾
    function geneEnding() {
      content.push(
        {
          text: 'ENDING_START',
          style: 'forSearchWhite'
        // },
        // {
        //   image: __dirname + '/img/aboutThor.jpg',
        //   width: 595,
        //   margin: [-60, 1, -60, -70],
        //   pageBreak: 'after'
        }
      );
      addBlankPage(searchData && searchData.addPageList.indexOf('CONTENT') !== -1);
      content.push(

        {
          image: __dirname + CONFIG_DATA.products[data.productId].coverLast,
          width: 595,
          height: 845,
          margin: [-60, -44, -60, -70],
          pageBreak: 'before'
        },
        {
          text: 'ENDING_END',
          style: 'forSearchWhite',
          absolutePosition: {x: 0, y: 0}
        }
      )
    }

    // 定义页眉,页脚,背景,样式等公共部分
    const STATIC_PART = {
      // 页脚(页码)
      footer: function(currentPage, pageCount) {
        if (searchData) {
          if (searchData.pagesInfo[currentPage - 1].footer) {
            footerPage++;
            return {
              text: footerPage,
              bold: true,
              alignment: 'center'
            }
          }
          totalPage = pageCount;
          return null;
        }
        return {
          text: currentPage,
          bold: true,
          alignment: 'center'
        };
      },
      pageMargins: [60, 44, 60, 70],
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
        title: {
          fontSize: 20,
          bold: true
        },
        desc: {
          fontSize: 16,
          bold: true,
          margin: [0, 20, 0, 0]
        },
        content: {
          fontSize: 12,
          lineHeight: 1.1,
          margin: [0, 20, 0, 0]
        },
        tableStyle: {
          margin: [0, 30, 0, 0]
        },
        tableContent: {
          margin: [0, 9.5, 0, 9.5],
          fontSize: 12
        },
        hint: {
          fontSize: 12,
          bold: true,
          margin: [0, 30, 0, -10]
        },
        hintContent: {
          fontSize: 10,
          lineHeight: 1.2,
          margin: [0, 12, 0, 0]
        },
        projectIntro: {
          fontSize: 16,
          bold: true,
          color: '#231815'
        },
        projectIntroCon: {
          fontSize: 10,
          margin: [0, 13, 0, 0],
          color: '#231815',
          lineHeight: 1.4
        },
        partTitle: {
          fontSize: 12,
          bold: true,
          margin: [0, 46, 0, 12]
        },
        remarkT: {
          fontSize: 12,
          lineHeight: 1.4
        },
        remarkCon: {
          fontSize: 10,
          color: '#727171',
          lineHeight: 1.4
        },
        pFiveThree: {
          fontSize: 10,
          color: '#231815'
        },
        lastTitle: {
          fontSize: 18,
          bold: true,
          alignment: 'center',
          margin: [0, 5, 0, 5]
        },
        lastContent: {
          fontSize: 10,
          alignment: 'left',
          lineHeight: 1.2,
          margin: [0, 0, 0, 5]
        },
        declare: {
          fontSize: 10,
          alignment: 'left',
          lineHeight: 1.2,
          margin: [0, 0, 0, 0]
        },
        forSearchWhite : {
          color: '#fff',
          fontSize: 0
        }

      }
    };

    /**
     * @method genePdf 生成总的pdf对象
     * @return {object}  用于生成pdf流的整个对象
     */
    function genePdf() {
      if (CONFIG_DATA.products[data.productId].type === 'CHECK_UP') {
        geneCoverCU(data);     // only cu
      } else {
        geneCover(data);
      }
      geneToCus();
      if (!isSingle) {
        geneCatalog(data);
      }
      CONFIG_DATA.products[data.productId].keys.forEach(function (item) {
        geneItems(data.info[item.key].items, item);
      });
      geneEnding();

      return Object.assign({}, STATIC_PART, {content: content})
    }

    // pdfmake 生成流
    var doc = new Printer({
      Roboto: {
        normal: __dirname + '/../fonts/PingFang Regular.ttf',
        bold: __dirname + '/../fonts/PingFang Medium.ttf',
        italics: __dirname + '/../fonts/PingFang Regular.ttf',
        bolditalics: __dirname + '/../fonts/PingFang Medium.ttf'
      }
    }).createPdfKitDocument(genePdf());
    doc.end();


    var numList = [];    // 记录目录页码
    var addNum = 0;   // 临时变量 暂存页面的增加

    var contentStart = 0;  // 记录详情页起始页码
    var pageCover = 0;    // 标示封面临时变量
    var pageCat = 0;
    var pageGather = 0;
    var pageDetail = 0;
    var pageEnding = 0;
    var pagesInfo = [];   // 每页的相关信息
    var addPageList = [];  // 添加的空白页
    var searchInfo = null;
     // 遍历第一遍生成的流 找到埋藏的隐藏字段 判断每页所属部分  从而配置每页的信息  第二遍生成时加入
    if (typeof searchData == 'undefined') {

      doc._pdfMakePages.forEach(function (page) {
        page.items.forEach(function (row) {
          if (row.item.inlines) {
            row.item.inlines.forEach(function (word) {
              var curPage = parseInt(page.items[page.items.length-1].item.inlines[0].text, 10);

              if(word.text === 'COVER_START') {
                contentStart = curPage;
                pageCover = curPage;
              }
              if(word.text === 'COVER_END') {
                while (pageCover <= curPage) {
                  pagesInfo.push(
                    {
                      footer: false
                    }
                  );
                  pageCover++;
                }
              }


              if(word.text === 'CAT_START') {
                pageCat = curPage;
              }
              if(word.text === 'CAT_END') {
                while (pageCat <= curPage) {
                  pagesInfo.push(
                    {
                      footer: false
                    }
                  );
                  pageCat++;
                }
              }

              if(word.text === 'GATHER_START') {
                pageGather = curPage;
              }
              if(word.text === 'GATHER_END') {
                while (pageGather <= curPage) {
                  pagesInfo.push(
                    {
                      footer: true
                    }
                  );
                  pageGather++;
                }
              }

              if(word.text === 'DETAIL_START') {
                pageDetail = curPage;
              }
              if(word.text === 'DETAIL_END') {
                while (pageDetail <= curPage) {
                  pagesInfo.push(
                    {
                      footer: true
                    }
                  );
                  pageDetail++;
                }
              }

              if(word.text === 'ENDING_START') {
                pageEnding = curPage;
              }
              if(word.text === 'ENDING_END') {
                const isAdd =(curPage - contentStart) % 2 === 0;
                while (pageEnding <= curPage) {
                  pagesInfo.push(
                    {
                      footer: false
                    }
                  );
                  pageEnding++;
                }
                if (isAdd) {    //模块总页数为奇数
                  addPageList.push('CONTENT');
                  pagesInfo.push(
                    {
                      footer: false
                    }
                  );
                  addNum++;
                }
              }

              if (word.text === 'RECORD') {
                numList.push(curPage+addNum);
              }
            })
          }
        })
      });

      doc.pipe(devnull());
    }
    searchInfo = {pagesInfo: pagesInfo, addPageList: addPageList, numList: numList};

    return {
      fileName: namePdf(data.checker.name, data.productName, data.sampleNo, data.meetingNo),
      stream: doc,
      searchData: searchInfo,
      totalPage: totalPage
    };

  }
  return insurancePDF(insurancePDF().searchData);
};