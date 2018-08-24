/**
 * Created by work on 17/8/3.
 */
/* eslint-disable */
const fs = require('fs');
const Printer = require('pdfmake');
var devnull = require('dev-null');

const drawPie = require('../chart/pie');
const drawCircle = require('../chart/circle');
const drawBar = require('../chart/barType');
const drawSCircle = require('../chart/smallCircle');
const getCharLength = require('../common/getCharLength');
const percentage = require('../common/percentage');
const namePdf = require('../common/namePdf');
const CONFIG_DATA = require('./listData');

module.exports = function (data) {
  // const PID = data.productId;
  const isMini = CONFIG_DATA.products[data.productId].minimum;   // 判断是否需要合到一起显示
  function insurancePDF (searchData) {
    //  定义content数组
    var content = [];
    var totalPage = 0;

    var footerPage = 0;
    // 表格生成方法
    // type: 'collectList' 汇总列表
    //       'similarList' 部分类似列表 高危风险因素、预防建议
    //       'geneKnowledge' 基因知识
    //       'physical'  体检建议
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
                fontSize: 13
              },
              {
                text: '结果说明',
                border: [false, false, false, false],
                alignment: 'center',
                color: '#fff',
                fontSize: 13
              },
              {
                text: '等级',
                border: [false, false, false, false],
                alignment: 'center',
                color: '#fff',
                fontSize: 13
              }
            ]
          ];
          tableData.forEach(function (item) {
            if (!item.ignore) {
              var levelImg = '';
              var geneColor = '';
              switch (item.score) {
                case -1: {
                  geneColor = '#ED7038';
                  levelImg = __dirname + '/imgs/high.png';
                  break;
                }
                case 0: {
                  geneColor = '#4BBED2';
                  levelImg = __dirname + '/imgs/mid.png';
                  break;
                }
                case 1: {
                  geneColor = '#49B67F';
                  levelImg = __dirname + '/imgs/low.png';
                  break;
                }
                default: {
                  break
                }
              }
              var collectItem = [
                {
                  text: item.phenotypeName || '',
                  border: [false, false, false, true],
                  alignment: 'center',
                  style: 'tableContent'
                },
                {
                  text: item.summary || '',
                  border: [false, false, false, true],
                  alignment: 'center',
                  color: geneColor,
                  style: 'tableContent'
                },
                {
                  image: levelImg,
                  width: 80,
                  border: [false, false, false, true],
                  alignment: 'center',
                  margin: [0, 10, 0, 0]
                }
              ];
              collect.push(collectItem);
            }
          });
          return collect;
        }
        case 'hRiskList': {
          var highRiskTable = [];
          tableData.forEach(function (item, index) {
            const thisCircle = drawSCircle({text: (index + 1).toString(), color: '红' });
            var hrItem = [
              {
                image: thisCircle.url,
                border: [false, false, false, false],
                width: thisCircle.width,
                alignment: 'left',
                margin: [0, 0, 0, 0]
              },
              {
                text: [
                  {
                    text:  item.title + ' \n',
                    border: [false, false, false, false],
                    alignment: 'left',
                    fontSize: 12,
                    bold: true
                  },
                  {
                    text: item.desc,
                    border: [false, false, false, false],
                    alignment: 'left',
                    fontSize: 10,
                    color: '#595757'
                  }
                ],
                border: [false, false, false, false],
                lineHeight: 1.3
              }
            ];
            highRiskTable.push(hrItem);
          });
          tableCon = highRiskTable;
          break;
        }
        case 'preventList': {
          var highRiskTable = [];
          tableData.forEach(function (item, index) {
            const thisCircle = drawSCircle({text: (index + 1).toString(), color: '绿' });
            var hrItem = [
              {
                image: thisCircle.url,
                border: [false, false, false, false],
                alignment: 'left',
                width: thisCircle.width,
                margin: [0, 0, 0, 0]
              },
              {
                text: [
                  {
                    text:  item.title + ' \n',
                    border: [false, false, false, false],
                    alignment: 'left',
                    fontSize: 12,
                    bold: true
                  },
                  {
                    text: item.desc,
                    border: [false, false, false, false],
                    alignment: 'left',
                    fontSize: 10,
                    color: '#595757'
                  }
                ],
                border: [false, false, false, false],
                lineHeight: 1.3
              }
            ];
            highRiskTable.push(hrItem);
          });
          tableCon = highRiskTable;
          break;
        }
        case 'geneKnowledge': {
          var geneKnoTable = [];
          tableData.forEach(function (item, index) {
            var circle = drawCircle({text: item.gene || ''});
            var hrItem =  [
              {
                image: circle.url,
                border: [false, false, false, false],
                alignment: 'center',
                margin: [0, 0, 5, 5],
                width: circle.width * .9,
                height: circle.height * .9
              },
              {
                text: item.related || '',
                border: [false, false, false, false],
                color: '#595757',
                alignment: 'left',
                lineHeight: 1.3,
                fontSize: 10,
                margin: [0, 5, 0, 5]
              }
            ];
            geneKnoTable.push(hrItem);
          });
          tableCon = geneKnoTable;
          break;
        }
        case 'physical': {
          var physicalTable = [];
          tableData.forEach(function (item, index) {
            const thisCircle = drawSCircle({text: (index + 1).toString(), color: '蓝' });
            var hrItem = [
              {
                image: thisCircle.url,
                border: [false, false, false, false],
                alignment: 'left',
                width: thisCircle.width,
                margin: [0, 0, 0, 0]
              },
              {
                text: [
                  {
                    text:  item.title + ' \n',
                    border: [false, false, false, false],
                    alignment: 'left',
                    fontSize: 12,
                    bold: true
                  },
                  {
                    text: item.desc || '',
                    border: [false, false, false, false],
                    alignment: 'left',
                    fontSize: 10,
                    color: '#595757'
                  }
                ],
                border: [false, false, false, false],
                lineHeight: 1.3
              }
              // {
              //   text:  item.title,
              //   alignment: 'left',
              //   fontSize: 12,
              //   bold: true,
              //   border: [false, false, false, false],
              //   lineHeight: 1.3
              // }
            ];
            physicalTable.push(hrItem);
          });
          tableCon = physicalTable;
          break;
        }
        case 'locusResolution': {
          var lrTable = [
            [
              {
                text: '基因',
                border: [false, false, false, false],
                alignment: 'center',
                fontSize: 12,
                color: '#fff',
                margin: [0, 5, 0, 5],
                fillColor: '#4abed3'
              },
              {
                text: '位点',
                border: [false, false, false, false],
                alignment: 'center',
                fontSize: 12,
                color: '#fff',
                margin: [0, 5, 0, 5],
                fillColor: '#4abed3'
              },
              {
                text: '基因型',
                border: [false, false, false, false],
                alignment: 'center',
                fontSize: 12,
                color: '#fff',
                margin: [0, 5, 0, 5],
                fillColor: '#4abed3'
              },
              {
                text: '检测结果',
                border: [false, false, false, false],
                alignment: 'center',
                fontSize: 12,
                color: '#fff',
                margin: [0, 5, 0, 5],
                fillColor: '#4abed3'
              },
              {
                text: '中国人群占比',
                border: [false, false, false, false],
                alignment: 'center',
                fontSize: 12,
                color: '#fff',
                margin: [0, 5, 0, 5],
                fillColor: '#4abed3'
              }
            ]
          ];
          tableData.forEach(function(item) {
            if (!item.genotype) {
              return null;
            }
            var locusColor = '';
            switch (item.score) {
              case -1: {
                locusColor = '#ED7038';
                break;
              }
              case 0: {
                locusColor = '#4BBED2';
                break;
              }
              case 1: {
                locusColor = '#49B67F';
                break;
              }
              default: {
                break
              }
            }

            var tableItem =  [
              {
                text: item.gene || '',
                border: [false, false, false, false],
                alignment: 'center',
                fontSize: 12,
                color: '#000',
                margin: [0, 5, 0, 5]
              },
              {
                // text: item.rsid || '',
                text: item.thid || item.rsid || '',
                border: [false, false, false, false],
                alignment: 'center',
                fontSize: 12,
                color: '#000',
                margin: [0, 5, 0, 5]
              },
              {
                text: item.genotype || '--',
                border: [false, false, false, false],
                alignment: 'center',
                fontSize: 12,
                color: '#000',
                margin: [0, 5, 0, 5]
              },
              {
                text: item.summary || '--',
                border: [false, false, false, false],
                alignment: 'center',
                fontSize: 12,
                color: locusColor,
                margin: [0, 5, 0, 5]
              },
              {
                text: percentage((item.frequency * 100).toFixed(2).toString()) || '--',
                border: [false, false, false, false],
                alignment: 'center',
                fontSize: 12,
                color: '#000',
                margin: [0, 5, 0, 5]
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

    function geneLine(total, name) {
      const word = getCharLength(name);
      const dianNum = total - (name.length - word) * 2.8 - Math.floor(word * 2);
      var a = 0;
      var line = '';
      while (a <= dianNum) {
        line = line + ' -';
        a++;
      }
      return line;
    }

    function addBlankPage(para) {
      if (para) {
        content.push({
            text: 'BLANK_PAGE',
            style: 'forSearchWhite',
            pageBreak: 'after'
        });
      }
    }


    // 生成pdf封面
    function geneCover(data) {
      content.push(
        {
          text: '采样编号：' + data.sampleNo,
          fontSize: 12,
          margin: [24, 500, 0, 0]
        },
        {
          text: '客户姓名：' + data.checker.name,
          fontSize: 12,
          margin: [24, 8, 0, 0]
        },
        {
          text: '客户性别：' + (data.checker.sex ? '女' : '男'),
          fontSize: 12,
          margin: [24, 8, 0, 0]
        },
        {
          text: 'COVER_START',
          style: 'forSearchWhite',
          pageBreak: 'after'
        },
        {
          text: '支公司：' + (data.subCompanyAddr || ''),
          fontSize: 12,
          color: '#fff',
          margin: [0, -60, 0, 0]
        },
        {
          text: '业务员：' + (data.sales || ''),
          fontSize: 12,
          color: '#fff',
          margin: [0, 8, 0, 0]
        },
        {
          text: '场次编号：' + (data.meetingNo || ''),
          fontSize: 12,
          color: '#fff',
          margin: [0, 8, 0, 0]
        },
        {
          text: 'IMGIMGIMG',
          style: 'forSearchWhite',
          pageBreak: 'after'
        }
      );
    }

    // 生成封面
    function geneTitlePage(data) {
      content.push(
        {
          image: __dirname + '/imgs/logo.png',
          width: 120,
          alignment: 'left',
          marginTop: 20
        },
        {
          text: CONFIG_DATA.products[data.productId].coverTitle,
          color: '#075daa',
          bold: true,
          fontSize: 26,
          alignment: 'left',
          marginTop: 30
        },
        {
          text: '检测项目：' + CONFIG_DATA.products[data.productId].secondTitle,
          bold: true,
          fontSize: 14,
          alignment: 'left',
          marginTop: 80
        },
        {
          text: '检测单位：' + '索真健康医学检测中心',
          fontSize: 14,
          bold: true,
          alignment: 'left',
          marginTop: 15
        },
        {
          image: __dirname + '/imgs/stamp.png',
          width: '136',
          absolutePosition: {x: 190, y: 290}
        },
        {
          image: __dirname + '/imgs/blueLine.png',
          width: '594.3',
          margin: [-50, 60, 0, 0],
          pageBreak: 'after'
        },
        {
          text: 'COVER_END',
          style: 'forSearchWhite',
          pageBreak: 'after'
        }
      );
    }

    // 生成目录
    function geneCatalog(data, title) {
      var catalog = [
        {
          name: '基因检测简介',
          line: geneLine(94, '基因检测简介'),
          page: 99
        },
        {
          name: '详细检测结果分析',
          line: geneLine(94, '详细检测结果分析'),
          page: 99
        }
      ];
      CONFIG_DATA.products[data.productId].keys.forEach(function (item) {
        catalog.push(
          {
            name: item.name || '',
            line: geneLine(90, item.name),
            page: 99,
            isPart: true
          });
        data.info[item.key].items.forEach(function (ite) {
          if (!ite.ignore) {
            catalog.push(
              {
                name: ite.phenotypeName || '',
                line: geneLine(91, ite.phenotypeName),
                page: 99,
                isSub: true
              });
          }
        });
      });
      catalog.push(
        {
          name: '郑重承诺',
          line: geneLine(94, '郑重承诺'),
          page: 99
        },
        {
          name: '特别声明',
          line: geneLine(94, '特别声明'),
          page: 99
        },
        {
          name: '名词解释',
          line: geneLine(94, '名词解释'),
          page: 99
        }
      );
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
          style: 'forSearchWhite'
        },
        {
          text: title,
          fontSize: 26,
          bold: true,
          color: '#075daa'
        },
        {
          text: '目 录',
          fontSize: 26,
          bold: true,
          alignment: 'right',
          margin: [0, 30, 30, 0]
        });

      catalog.forEach(function (item) {
          if (item.isSub) {
            content.push({
              columns: [
                {
                  width: 'auto',
                  text: item.name,
                  fontSize: 12,
                  marginLeft: 32
                },
                {
                  width: '*',
                  text: item.line,
                  fontSize: 5,
                  bold: true,
                  color: '#ababab',
                  margin: [10, 6, 0, 0]
                },
                {
                  width: 'auto',
                  // alignment: 'right',
                  text: item.page,
                  fontSize: 13,
                  bold: true,
                  marginRight: 5
                }
              ],
              marginTop: 20
              // text: [
              //   {
              //     text: item.name + ' ',
              //     fontSize: 13
              //   },
              //   {
              //     text: ' ' + item.line + ' ',
              //     fontSize: 5,
              //     bold: true,
              //     color: '#ababab'
              //     // padding: [10, 6, 0, 0]
              //   },
              //   {
              //     text: ' ' + item.page,
              //     fontSize: 13,
              //     bold: true,
              //     alignment: 'right'
              //   }
              // ],
              // margin: [70, 20, 30, 0]
            });
          } else if (item.isPart) {
            content.push({
              columns: [
                {
                  width: 'auto',
                  text: item.name,
                  fontSize: 13,
                  marginLeft: 32,
                  bold: true
                },
                {
                  width: '*',
                  text: item.line,
                  fontSize: 5,
                  bold: true,
                  color: '#ababab',
                  margin: [10, 6, 0, 0]
                },
                {
                  width: 'auto',
                  text: item.page,
                  fontSize: 13,
                  bold: true,
                  marginRight: 5
                }
              ],
              marginTop: 20
            });
          } else {
            content.push({
              // text: [
              //   {zh
              //     text: item.name + ' ',
              //     fontSize: 14,
              //     bold: true
              //   },
              //   {
              //     text: ' ' + item.line + ' ',
              //     fontSize: 5,
              //     bold: true,
              //     color: '#ababab'
              //     // padding: [10, 6, 0, 0]
              //   },
              //   {
              //     text: ' ' + item.page,
              //     fontSize: 13,
              //     alignment: 'right',
              //     bold: true
              //   }
              // ],
              // margin: [40, 20, 30, 0]
              columns: [
                {
                  width: 'auto',
                  text: item.name,
                  fontSize: 14,
                  bold: true,
                  marginLeft: 5
                },
                {
                  width: '*',
                  text: item.line,
                  fontSize: 5,
                  bold: true,
                  color: '#ababab',
                  margin: [10, 6, 0, 0]
                },
                {
                  width: 'auto',
                  text: item.page,
                  fontSize: 14,
                  bold: true,
                  marginRight: 5
                }
              ],
              marginTop: 20
            });
          }
        });

      content.push(
        {
          text: 'CAT_END',
          style: 'forSearchWhite'
        }
      );

      addBlankPage(searchData && searchData.addPageList.indexOf('CATALOG') !== -1);

    }


    // 生成基因检测简介
    function geneBrief() {
      content.push(
        {
          text: 'BRIEF_START',
          style: 'forSearchWhite',
          pageBreak: 'before'
        },
        {
          text: '基因检测介绍',
          style: 'title'
        },
        {
          text: 'RECORD',
          style: 'forSearchWhite'
        },
        {
          text: '健康的身体是灵魂的客厅，有病的身体则是灵魂的禁闭室。--培根',
          style: 'desc'
        },
        {
          text: '大文豪爱默生曾经说过，“健康是人生的第一财富”，拥有健康的身体才有追逐幸福的资本。早在中国最早的医学典籍《黄帝内经•素问》中' +
          '就已提出 “未病先防、既病防变”的理念，《黄帝内经•灵枢》进一步提出“上工不治已病治未病”的养生思想。',
          style: 'content'
        },
        {
          text: '一方面，随着生活水平的不断提高，人们所处的不良生活方式与生活环境成为多种疾病滋生的温床，如恶性肿瘤、高血压、糖尿病、' +
          '高血脂、慢性呼吸道疾病等；另一方面，生活节奏加快、工作强度激增成为近75%城市人群长期处于亚健康状态的主因之一，失眠多梦、' +
          '精神焦虑、食欲不振等亚健康症状严重威胁人们的生存质量。',
          style: 'content'
        },
        {
          text: '虽然疾病的病因、发病机制存在差异，但其均与基因之间存在不同程度的联系。基因蕴含着人类生老病死的重要遗传信息，指导生物体生长、' +
          '发育与生命机能的运作。基因检测是从染色体结构、DNA序列、DNA变异位点或基因表现程度，为受检者与医疗研究人员提供评估一些与基因相关的疾病、' +
          '体质或个人特质的依据。',
          style: 'content'
        },
        {
          text: '该基因检测服务由索真医学检验所检测完成。索真医学检验所是通过卫计委审批的具备从事基因检测资质的医学检验所，' +
          '检测设备均通过卫计委认证，结果准确率超过99%。通过检测与疾病相关的基单核苷酸多态性(SNP)与拷贝数变异(CNV)情况，' +
          '为您提供一份检测报告，帮助您精准预防、治疗疾病，提高生命质量。',
          style: 'content'
        },
        {
          image: __dirname + '/imgs/bigGene.png',
          width: 300,
          alignment: 'center',
          marginTop: 40
        },
        {
          text: 'BRIEF_END',
          style: 'forSearchWhite',
          pageBreak: 'after'
        }
      );
      addBlankPage(searchData && searchData.addPageList.indexOf('BRIEF') !== -1);
      content.push(
        {
          text: 'BLANK_START',
          style: 'forSearchWhite'
        },
        {
          text: 'RECORD',
          style: 'forSearchWhite'
        },
        {
          table: {
            widths: ['*'],
            body: [
              [
                {
                  text: '详细检测结果分析',
                  fontSize: 26,
                  bold: true,
                  lineHeight: 1,
                  color: 'white',
                  fillColor: '#4187A4',
                  alignment: 'center',
                  margin: [0, 328, 0, 488],
                  border: [false, false, false, false]
                }
              ]
            ]
          },
          // canvas: [
          //   {
          //     type: 'rect',
          //     x: 0,
          //     y: 0,
          //     w: 595,
          //     h: 842,
          //     color: 'blue'
          //   }
          // ],
          margin: [-50, -105, -50, 0],
          overflow: 'hidden'
        },
        {
          text: 'BLANK_END',
          style: 'forSearchWhite'
        }
      );
    }

    // 生成检测结果汇总
    function geneGather(data, allData, it) {
      content.push(
        {
          text: 'GATHER_START',
          style: 'forSearchWhite',
          pageBreak: 'before'
        },
        {
          text: it.name || '',
          style: 'title'
        },
        {
          text: 'RECORD',
          style: 'forSearchWhite'
        },
        {
          style: 'tableStyle',
          table: {
            headerRows: 1,
            dontBreakRows: true,
            keepWithHeaderRows: 1,
            widths: [ 120, 240, '*'],
            body: tablePart('collectList', data)
          },
          layout: {
            fillColor: function (i, node) { return (i === 0) ?  '#4abed3' : null; },
            hLineColor: '#dcdddd'
          }
        }
      );

      if (isMini) {
        content.push(
          {
            text: '基因检测结果',
            fontSize: 16,
            bold: true,
            margin: [0, 20, 0, 0]
          },
          {
            text: 'CYP1A1、XRCC1基因突变与多种肿瘤的发生密切相关，包括肺癌、胃癌、肝癌、大肠癌及甲状腺癌。' +
            '此二者疾病作为肿瘤易感基因，常用于评估肿瘤易感性。通过基因检测早期评估疾病罹患风险，通过采取预防干预措施，' +
            '预防或降低疾病疾病风险。',
            fontSize: 10,
            lineHeight: 1.4,
            margin: [0, 10, 0, 20]
          },
          {
            table: {
              headerRows: 1,
              dontBreakRows: true,
              keepWithHeaderRows: 1,
              widths: [70, 110, 70, 70, 130],
              body: tablePart('locusResolution', allData.genotypes)
            },
            layout: {
              fillColor: function (i, node) { return (i >= 1 && i % 2 === 0) ?  '#d6edf3' : '#f2f9fb'; }
            }
          }
        );
      }

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
          text: '3、本报告疾病风险等级分为“正常、偏低、偏高”三个等级。疾病风险等级评定的参考对象是普通人群。',
          style: 'hintContent'
        },
        {
          text: [
            '（1）风险等级',
            {
              text: '“正常”',
              color: '#4CB4C7'
            },
            '指您的疾病罹患风险与平均水平一致，但并不表示普通人无发病风险。当您的风险等级显示为“正常”时，也不能掉以轻心，' +
            '还需根据预防建议养成良好的生活、饮食、运动习惯，出现相关临床症状时需配合相关临床检查。'
          ],
          fontSize: 10,
          lineHeight: 1.4
        },
        {
          text: [
            '（2）风险等级',
            {
              text: '“偏低”',
              color: '#4AAE7A'
            },
            '指您的疾病罹患风险低于普通人。虽然您的基因检测结果评价较好，但并不排除环境因素致病的可能，也应参照该病普通人的预防建议加以预防。'
          ],
          fontSize: 10,
          lineHeight: 1.4
        },
        {
          text: [
            '（3）风险等级',
            {
              text: '“偏高”',
              color: '#E26D39'
            },
            '指您的疾病罹患风险高于普通人。对于基因检测结果显示“风险略高”的疾病，并不代表您未来一定患此病，' +
            '而是表示您该病的遗传风险较普通人要高，更易受到环境因素的影响而发病，需引起您的高度关注。'
          ],
          fontSize: 10,
          lineHeight: 1.4
        }
      );

      if (isMini) {
        if (allData.genes && allData.genes.length > 0) {
          content.push(
            {
              text: '基因知识',
              style: 'partTitle'
            },
            {
              table: {
                dontBreakRows: true,
                widths: [70, '*'],
                body: tablePart('geneKnowledge', allData.genes)
              }
            }
          );
        }
      }

      content.push(
        {
          text: 'GATHER_END',
          style: 'forSearchWhite'
        }
      );
      // addBlankPage(searchData && searchData.addPageList.indexOf('GATHER') !== -1);
    }

    // 生成单项疾病详情
    function geneItems(data, allData, it) {
      geneGather(data, allData, it);
      data.forEach(function (item, index) {
        if (!item.ignore) {
          function log(key, value) {
            if (typeof value === 'undefined') {
              console.log('item:' + item.phenotypeName + '/id:' + item.phenotypeId + ' lacks ' + key)
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
              itemLevel = __dirname + '/imgs/high.png';
              break;
            }
            case 0: {
              resultColor = '#4BBED2';
              itemLevel = __dirname + '/imgs/mid.png';
              break;
            }
            case 1: {
              resultColor = '#49B67F';
              itemLevel = __dirname + '/imgs/low.png';
              break;
            }
            default: {
              break
            }
          }
          const thisBar = drawBar({text: item.phenotypeName || ''});
          const thisPie = drawPie({ratio: item.ratio});
          if (index === 0) {
            content.push(
              {
                image: thisBar.url,
                width: thisBar.width,
                height: thisBar.height,
                alignment: 'center',
                margin: [0, 0, 0, 0],
                pageBreak: 'before'
              },
              {
                text: 'DETAIL_START',
                style: 'forSearchWhite'
              }
            );
          } else {
            content.push(
              {
                image: thisBar.url,
                width: thisBar.width,
                height: thisBar.height,
                alignment: 'center',
                margin: [0, 0, 0, 0],
                pageBreak: 'before'
              }
            );
          }
          content.push(
            {
              text: 'RECORD',
              style: 'forSearchWhite'
            },
            // 疾病简介
            {
              text: '疾病简介',
              bold: true,
              fontSize: 18,
              margin: [0, 20, 0, 12]
            },
            {
              text: getPhenotypes(item.phenotypeId).introduction,
              fontSize: 10,
              color: '#595757',
              lineHeight: 1.4
            },
            {
              text: '疾病与遗传',
              bold: true,
              fontSize: 18,
              margin: [0, 20, 0, 12]
            },
            {
              text: getPhenotypes(item.phenotypeId).geneticCorrelation,
              fontSize: 10,
              color: '#595757',
              lineHeight: 1.4
            },
            {
              text: '检测结果',
              style: 'partTitle'
            },
            {
              table: {
                widths: ['*', '*'],
                body: [
                  [
                    {
                      text: '您的'+ item.phenotypeName +'风险等级为',
                      border: [false, false, false, false],
                      alignment: 'left',
                      fontSize: 14,
                      margin: [-4, 0, 0, 0]
                    },
                    {
                      text: '与您具有相同风险的人群占比',
                      border: [false, false, false, false],
                      alignment: 'center',
                      fontSize: 14
                    }
                  ],
                  [
                    {
                      type: 'none',
                      ol: [
                        {
                          text: item.summary || '',
                          fontSize: 20,
                          color: resultColor,
                          margin: [0, 10, 0, 0]
                        },
                        {
                          image: itemLevel,
                          width: 80,
                          border: [false, false, false, false],
                          margin: [0, 10, 0, 0]
                        },
                        {
                          text: getPhenotypes(item.phenotypeId).caseRate ? '平均每10万人中患病人数为' : '',
                          margin: [0, 20, 0, 0],
                          fontSize: 14
                        },
                        {
                          text: getPhenotypes(item.phenotypeId).caseRate ? (getPhenotypes(item.phenotypeId).caseRate + '人') : '',
                          fontSize: 20,
                          color: resultColor,
                          margin: [0, 10, 0, 0]
                        }
                      ],
                      border: [false, false, false, false],
                      margin: [-18, 0, 0, 0]
                    },
                    {
                      image: thisPie.url,
                      width: thisPie.width,
                      height: thisPie.height,
                      border: [false, false, false, false],
                      alignment: 'center',
                      marginTop: 10
                    }
                  ]
                ]
              }
            },
            {
              text: '注：以上结果是根据中国人群大样本流行病学和已知的疾病相关位点研究成果对您的遗传风险作出的评估；您可参考该数据更加精准的预防疾病，但不能将其作为临床诊断依据。',
              color: '#727171',
              fontSize: 10,
              lineHeight: 1.2,
              margin: [0, 10, 0, 5]
            }
          );

          if(!isMini) {
            content.push(
              {
                text: '位点解析',
                style: 'partTitle'
              },
              {
                table: {
                  headerRows: 1,
                  dontBreakRows: true,
                  keepWithHeaderRows: 1,
                  widths: [70, 110, 70, 70, 130],
                  body: tablePart('locusResolution', item.genotypes)
                },
                layout: {
                  fillColor: function (i, node) { return (i >= 1 && i % 2 === 0) ?  '#d6edf3' : '#f2f9fb'; }
                }
              }
            );
          }

          if (!isMini && item.genes && item.genes.length > 0) {
            content.push(
              {
                text: '基因知识',
                style: 'partTitle'
              },
              {
                table: {
                  dontBreakRows: true,
                  widths: [70, '*'],
                  body: tablePart('geneKnowledge', item.genes)
                }
              });
          }


          if (getPhenotypes(item.phenotypeId).symptom) {
            content.push(
              {
                text: '疾病临床症状',
                style: 'partTitle'
              },
              {
                text: getPhenotypes(item.phenotypeId).symptom,
                fontSize: 10,
                lineHeight: 1.3,
                color: '#595757'
              }
            );
          }

          if (getPhenotypes(item.phenotypeId).jsonCause.items.length > 0) {
            content.push(
              {
                text: '高危风险因素',
                style: 'partTitle'
              },
              {
                table: {
                  dontBreakRows: true,
                  widths: [20, '*'],
                  body: tablePart('hRiskList', getPhenotypes(item.phenotypeId).jsonCause.items)
                }
              }
            );
          }

          if (getPhenotypes(item.phenotypeId).prevention) {
            content.push(
              {
                text: '疾病预防',
                style: 'partTitle'
              },
              {
                text: getPhenotypes(item.phenotypeId).prevention,
                color: '#595757',
                lineHeight: 1.2
              }
            );
          }

          if (getPhenotypes(item.phenotypeId).jsonPreventionGeneral.items.length > 0) {
            content.push(
              {
                text: '预防建议',
                fontSize: 14,
                margin: [0, 12, 0, 10]
              },
              {
                table: {
                  dontBreakRows: true,
                  widths: [20, '*'],
                  body: tablePart('preventList', getPhenotypes(item.phenotypeId).jsonPreventionGeneral.items)
                }
              }
            );
          }

          content.push(
            {
              text: '体检建议',
              fontSize: 14,
              margin: [0, 12, 0, 10]
            },
            {
              text: getPhenotypes(item.phenotypeId).jsonPreventionCheckup.summary,
              color: '#595757',
              lineHeight: 1.2,
              fontSize: 10
            }
          );
          if (getPhenotypes(item.phenotypeId).jsonPreventionCheckup.items.length > 0) {
            content.push(
              {
                table: {
                  dontBreakRows: true,
                  widths: [20, '*'],
                  body: tablePart('physical', getPhenotypes(item.phenotypeId).jsonPreventionCheckup.items)
                }
              }
            );
          }

        }
      });
      content.push(
        {
          text: 'DETAIL_END',
          style: 'forSearchWhite'
        }
      );
    }

    // 生成结尾
    function geneEnding() {
      content.push(
        {
          text: 'ENDING_START',
          style: 'forSearchWhite',
          pageBreak: 'before'
        },
        {
          text: '郑重承诺',
          alignment: 'center',
          style: 'lastTitle'
        },
        {
          text: 'RECORD',
          style: 'forSearchWhite'
        },
        {
          text: '对于客户的基因信息,我们严格遵守我国的相关法律与法规予以保密。采用特殊编码管理, 确保受检者的身份信息与基因检测和评估信息的分离,' +
          '充分保护个人隐私。未经客户允许保证不将客户的相关信息用于任何商业用途。',
          alignment: 'center',
          style: 'lastContent'
        },
        {
          text: '特别声明',
          alignment: 'center',
          style: 'lastTitle'
        },
        {
          text: 'RECORD',
          style: 'forSearchWhite'
        },
        {
          ul: [
            {
              text: '本公司确认本报告为申请人所提供受检者 DNA 样本的正确检测结果;',
              style: 'declare'
            },
            {
              text: '本公司对检测结果的当前正确性负责。本报告仅作为健康咨询指导报告,而不作为临床诊断报告;',
              style: 'declare'
            },
            {
              text: '本报告中给出的健康建议是对个人遗传基因筛查所获得的综合信息,基于目前最新的生物科学技术得出,该结果还将随着科学的发展而不断完善。',
              style: 'declare'
            }
          ]
        },
        {
          text: '名词解释',
          alignment: 'center',
          style: 'lastTitle'
        },
        {
          text: 'RECORD',
          style: 'forSearchWhite'
        }
      );
      content.push(CONFIG_DATA.nounList.map(function (item) {
        return {
          text: [
            {
              text: item.noun + ' \n',
              color: '#01589f',
              bold: true,
              lineHeight: 1.1
            },
            {
              text: item.desc,
              fontSize: 10,
              alignment: 'left',
              lineHeight: 1.2
            }
          ],
          margin: [0, 3, 0, 0]
        };
      }));
      content.push(
        {
          text: 'ENDING_END',
          style: 'forSearchWhite'
        }
      );
    }


    // pdf对象
    // const insurance = {
    //   pageMargins: [50, 75, 50, 50],
    //   content: content,
    //   styles: {
    //     title: {
    //       fontSize: 24,
    //       bold: true
    //     },
    //     desc: {
    //       fontSize: 16,
    //       bold: true,
    //       margin: [0, 20, 0, 0]
    //     },
    //     content: {
    //       fontSize: 12,
    //       margin: [0, 20, 0, 0]
    //     },
    //     tableStyle: {
    //       margin: [0, 30, 0, 0]
    //     },
    //     tableContent: {
    //       margin: [0, 9.5, 0, 9.5],
    //       fontSize: 13
    //     },
    //     hint: {
    //       fontSize: 15,
    //       bold: true,
    //       margin: [0, 20, 0, -10]
    //     },
    //     hintContent: {
    //       fontSize: 10,
    //       lineHeight: 1.4,
    //       margin: [0, 20, 0, 0]
    //     },
    //     projectIntro: {
    //       fontSize: 16,
    //       bold: true,
    //       color: '#231815'
    //     },
    //     projectIntroCon: {
    //       fontSize: 10,
    //       margin: [0, 13, 0, 0],
    //       color: '#231815',
    //       lineHeight: 1.4
    //     },
    //     partTitle: {
    //       fontSize: 16,
    //       bold: true,
    //       margin: [0, 20, 0, 12]
    //     },
    //     remarkT: {
    //       fontSize: 12,
    //       lineHeight: 1.4
    //     },
    //     remarkCon: {
    //       fontSize: 10,
    //       color: '#727171',
    //       lineHeight: 1.4
    //     },
    //     pFiveThree: {
    //       fontSize: 10,
    //       color: '#231815'
    //     },
    //     lastTitle: {
    //       fontSize: 18,
    //       bold: true,
    //       alignment: 'center',
    //       margin: [0, 5, 0, 5]
    //     },
    //     lastContent: {
    //       fontSize: 10,
    //       alignment: 'left',
    //       lineHeight: 1.2,
    //       margin: [0, 0, 0, 5]
    //     },
    //     declare: {
    //       fontSize: 10,
    //       alignment: 'left',
    //       lineHeight: 1.2,
    //       margin: [0, 0, 0, 0]
    //     }
    //   }
    // };

    // 定义页眉,页脚,背景,样式等公共部分
    const STATIC_PART = {
      // 页眉
      header: function (currentPage) {
        if (searchData) {
          switch (searchData.pagesInfo[currentPage - 1].header) {
            case 'CATALOG' : {
              return {
                image: __dirname + '/imgs/catalog.png',
                width: 495,
                alignment: 'center',
                marginTop: 60
              };
            }
            case 'BRIEF' : {
              return {
                image: __dirname + '/imgs/brief.png',
                width: 495,
                alignment: 'center',
                marginTop: 60
              };
            }
            case 'GATHER' : {
              return {
                image: __dirname + '/imgs/gather.png',
                width: 495,
                alignment: 'center',
                marginTop: 60
              };
            }
            case 'DETAIL' : {
              return {
                image: __dirname + '/imgs/detail.png',
                width: 495,
                alignment: 'center',
                marginTop: 60
              };
            }
            //  // 去掉末尾相关知识页面header logo
            // case 'ENDING' : {
            //   return {
            //     image: __dirname + '/imgs/logo.png',
            //     width: 72,
            //     alignment: 'right',
            //     margin: [0, 25, 15, 0]
            //   };
            // }
            default : {
              return null;
            }
          }
        }
        return null;
      },
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
      background: function (currentPage) {
        if (searchData) {
          if (currentPage ===1 || currentPage ===2) {
            return [{
              image: __dirname + CONFIG_DATA.products[data.productId].cover[currentPage - 1],
              width: 595,
              height: 842
            }];
          }
        }
      },
      pageMargins: [50, 105, 50, 70],
      styles: {
        title: {
          fontSize: 24,
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
          fontSize: 15,
          bold: true,
          margin: [0, 20, 0, -10]
        },
        hintContent: {
          fontSize: 10,
          lineHeight: 1.4,
          margin: [0, 20, 0, 0]
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
          fontSize: 16,
          bold: true,
          margin: [0, 20, 0, 12]
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

    // 生成总的pdf对象
    function genePdf() {
      geneCover(data);
      geneTitlePage(data);
      geneCatalog(data, CONFIG_DATA.products[data.productId].coverTitle);
      geneBrief();
      // geneGather(data.info.tumour.items, data);
      CONFIG_DATA.products[data.productId].keys.forEach(function (item) {
        geneItems(data.info[item.key].items, data, item);
      });
      // geneItems(data.info.tumour.items, data);
      geneEnding();

      return Object.assign({}, STATIC_PART, {content: content})
    }

    var doc = new Printer({
      Roboto: {
        normal: __dirname + '/../fonts/PingFang Regular.ttf',
        bold: __dirname + '/../fonts/PingFang Medium.ttf',
        italics: __dirname + '/../fonts/PingFang Regular.ttf',
        bolditalics: __dirname + '/../fonts/PingFang Medium.ttf'
      }
    }).createPdfKitDocument(genePdf());
    doc.end();


    var numList = [];
    var addNum = 0;

    var pageCover = 0;
    var pageCat = 0;
    var pageBrief = 0;
    var pageGather = 0;
    var pageBlank = 0;
    var pageDetail = 0;
    var pageEnding = 0;
    var pagesInfo = [];
    var addPageList = [];
    var searchInfo = null;

    if (typeof searchData == 'undefined') {

      doc._pdfMakePages.forEach(function (page) {
        page.items.forEach(function (row) {
          if (row.item.inlines) {
            row.item.inlines.forEach(function (word) {
              var curPage = parseInt(page.items[page.items.length-1].item.inlines[0].text, 10);


              if(word.text === 'COVER_START') {
                pageCover = curPage;
              }
              if(word.text === 'COVER_END') {
                while (pageCover <= curPage) {
                  pagesInfo.push(
                    {
                      header: false,
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
                const isAdd =(curPage - pageCat) % 2 === 0;
                while (pageCat <= curPage) {
                  pagesInfo.push(
                    {
                      header: 'CATALOG',
                      footer: false
                    }
                  );
                  pageCat++;
                }
                if (isAdd) {    //模块总页数为奇数
                  addPageList.push('CATALOG');
                  pagesInfo.push(
                    {
                      header: false,
                      footer: false
                    }
                  );
                  addNum++;
                }
              }


              if(word.text === 'BRIEF_START') {
                pageBrief = curPage;
              }
              if(word.text === 'BRIEF_END') {
                const isAdd =(curPage - pageBrief) % 2 === 0;
                while (pageBrief <= curPage) {
                  pagesInfo.push(
                    {
                      header: 'BRIEF',
                      footer: true
                    }
                  );
                  pageBrief++;
                }
                if (isAdd) {    //模块总页数为奇数
                  addPageList.push('BRIEF');
                  pagesInfo.push(
                    {
                      header: false,
                      footer: false
                    }
                  );
                  addNum++;
                }
              }


              if(word.text === 'BLANK_START') {
                pageBlank = curPage;
              }
              if(word.text === 'BLANK_END') {
                while (pageBlank <= curPage) {
                  pagesInfo.push(
                    {
                      header: false,
                      footer: false
                    }
                  );
                  pageBlank++;
                }
              }

              if(word.text === 'GATHER_START') {
                pageGather = curPage;
              }
              if(word.text === 'GATHER_END') {
                // const isAdd =(curPage - pageGather) % 2 ===0;
                while (pageGather <= curPage) {
                  pagesInfo.push(
                    {
                      header: 'GATHER',
                      footer: true
                    }
                  );
                  pageGather++;
                }
                // if (isAdd) {    //模块总页数为奇数
                //   addPageList.push('GATHER');
                //   pagesInfo.push(
                //     {
                //       header: false,
                //       footer: false
                //     }
                //   );
                //   addNum++;
                // }
              }

              if(word.text === 'DETAIL_START') {
                pageDetail = curPage;
              }
              if(word.text === 'DETAIL_END') {
                while (pageDetail <= curPage) {
                  pagesInfo.push(
                    {
                      header: 'DETAIL',
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
                while (pageEnding <= curPage) {
                  pagesInfo.push(
                    {
                      header: 'ENDING',
                      footer: true
                    }
                  );
                  pageEnding++;
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
