/**
 * Created by work on 17/4/10.
 */

/* eslint-disable */
const CONFIG_DATA = require('./listData').CONFIG_DATA;
var devnull = require('dev-null');

const fs = require('fs');
const Printer = require('pdfmake');
module.exports = function (ALLData) {
  var configData = CONFIG_DATA.SMZG;
  if (ALLData.productId === 8) {
    configData = CONFIG_DATA.SBCQ;
  } else if (ALLData.productId === 50) {
    configData = CONFIG_DATA.SMZL;
  } else if (ALLData.productId === 53) {
    configData = CONFIG_DATA.QWXZ;
  }
  var time = new Date();
  function geneSteam(searchData) {
    // const partOrder= ['chronicDisease', 'tumour', 'nutrition', 'genericFeature', 'sportsAndFitness', 'drugResponse', 'genericDisease', 'genericTumor'];
    const dicTitle = ALLData.checker.sex ? '女士' : '先生';
    const PART_DICTIONARY = configData.PART_DICTIONARY;
    const IMG_DIC = configData.IMG_DIC;
    // 遍历原始数据生成目录
    var catalog = searchData ? searchData.catalog : geneCatalog(configData.partOrder);
    var totalPage = 0;

    function addZ(num) {
      var newN = 0;
      if (typeof num == 'number' || typeof num == 'string') {
        newN = num.toString().length <= 1 ? '0' + num.toString() : num.toString();
      }
      return newN;
    }

    function getLength(str){
      if(/[a-z0-9./()、-]/i.test(str)){
        return str.match(/[a-z0-9./()、-]/ig).length;
      }
      return 0;
    }

    function geneD(total, name) {
      const word = getLength(name);
      const dianNum = total - (name.length - word) * 4 - Math.floor(word * 2.5);
      var a = 0;
      var str = '';
      while (a <= dianNum) {
        str = str + '.';
        a++;
      }
      return str;
    }

    function geneCatalog(order) {
      var catalog = [];
      // const CN = ['一', '二', '三', '四', '五', '六', '七', '八'];
      // const COLOR = ['#248d35', '#df3b34', '#f4c62d', '#5fbcbe', '#e56e23', '#0f1d37', '#f4c62d', '#df3b34'];
      order.forEach(function (item, index) {
        var data = [];
        data.push({name: (item.gatherTitle || PART_DICTIONARY[item.key].name)+'汇总', id: 1000 + index, dian: geneD(136, (item.gatherTitle || PART_DICTIONARY[item.key].name)+'汇总'), pageNum: '999'});
        var subOrder = 0;
        ALLData.reportInfo[item.key].items.forEach(function (it) {
          if (!it.ignore) {
            subOrder ++;
            data.push({name: addZ(subOrder) + ' ' + it.phenotypeName, id: it.phenotypeId, dian: geneD(130, it.phenotypeName), pageNum: '999'})
          }
        });
        var part = {
          title: '第'+item.cn + '部分' +' '+ PART_DICTIONARY[item.key].name,
          data: data,
          color: item.color
        };
        catalog.push(part);
      });
      return catalog;
    }

    const newR = (function reset() {
      var rIdx = 0;
      return function (cur) {
        if(searchData && searchData.footList.some(function (item) {
            return item === cur
          })) {
          rIdx++;
          return null;
        }
        return { text: cur - rIdx, alignment: 'center', marginTop: 16 };
      };
    })();

    const STATIC_PART = {
      // 页眉
      header: function (currentPage) { //eslint-disable-line
        if (searchData && searchData.headList.some(function(item) {return item === currentPage})) {
          return null;
        }
        return [
          {
            table: {
              widths: ['*', '*'],
              body: [
                [
                  {
                    image: __dirname + '/img/logoGolden.png',
                    width: 83,
                    height: 15,
                    margin: [20, 27.5],
                    fillColor: '#0F1D37',
                    alignment: 'left',
                    border: [false, false, false, false]
                  },
                  {
                    text: 'Help You Know Yourself Better',
                    fontSize: 14,
                    color: '#C69E53',
                    margin: [20, 27.5],
                    fillColor: '#0F1D37',
                    alignment: 'right',
                    border: [false, false, false, false]
                  }
                ]
              ]
            },
            style: 'pageTop'
          }
        ];
      },
      // 页脚(页码)
      footer: function(currentPage, pageCount) {
        // if(searchData && searchData.footList.some(function(item) {return item === currentPage})) {
        //   return null;
        // }
        totalPage = pageCount;
        return newR(currentPage);
      },
      background: function (currentPage) {
        if (searchData) {
          const idx = searchData.imgList.indexOf(currentPage);
          if (idx !== -1) {
            return [{
              image: __dirname + IMG_DIC[idx],
              width: 594.3,
              height: 840.51
            }];
          }
        }
      },
      pageMargins: [90, 90, 90, 76],
      styles: {
        titlePage: {
          fontSize: 14,
          color: '#0d203f',
          lineHeight: 1.5,
          bold: true
        },
        titlePageO: {
          fontSize: 14,
          color: '#FF6633',
          lineHeight: 1.5,
          bold: true
        },
        pageTop: {
          margin: [0, 0, 0, 0],
          fontSize: 14
        },
        hzTitle: {
          fontSize: 14,
          margin: [0, 20, 0, 10],
          color: '#ffb802'
        },
        hzTable: {
          margin: [0, 3.5, 0, 3.5],
          fontSize: 10.5
        },
        tableP4: {
          margin: [0, 5, 0, 20],
          alignment: 'center',
          fontSize: 10.5
        },
        itemTitle: {
          fontSize: 14,
          color: '#ffb802'
        },
        geneLevel: {
          fontSize: 12,
          color: '#000',
          alignment: 'center',
          bold: true,
          margin: [0, 30, 0, 20]
        },
        itemDexTitle: {
          margin: [10, 0, 0, 15],
          color: '#ffd35b'
        },
        itemDex: {
          fontSize: 10.5,
          color: '#000',
          lineHeight: 1.5,
          margin: [0, 0, 0, 10],
          alignment: 'justify'
        },
        tableP8: {
          margin: [0, 24, 0, 20],
          alignment: 'center',
          fontSize: 10.5
        },
        tableTextP8: {
          margin: [0, 10, 0, 10]
        },
        tableHeaderP8: {
          margin: [0, 10, 0, 10]
        },
        gtTable: {
          alignment: 'left',
          margin: [1, 3.5, 0, 3.5],
          fontSize: 10.5,
          wordBreak: 'break-all'
        },
        gtTableH: {
          alignment: 'center',
          margin: [0, 3.5, 0, 3.5],
          fontSize: 10.5
        },
        gtTableTitle: {
          fontSize: 10.5,
          color: '#000',
          lineHeight: 1.5,
          margin: [0, 0, 0, 0]
        },
        gtTableTip: {
          fontSize: 9.5,
          color: '#333',
          alignment: 'right',
          margin: [0, -10, 0, 0]
        },
        forSearchWhite: {
          color: '#fff',
          fontSize: 0
        },
        forSearchBlue: {
          color: '#162046',
          fontSize: 0
        }
      }
    };
// 总的content
    var content = [
      {
        text: 'NO_HEADER',
        style: 'forSearchWhite'
      },
      {
        text: 'NO_FOOTER',
        style: 'forSearchWhite'
      },
      {
        text: 'FILL_IMG',
        style: 'forSearchWhite',
        pageBreak: 'after'
      },
      {
        text: 'NO_HEADER',
        style: 'forSearchWhite'
      },
      {
        text: 'INTRO_START',
        style: 'forSearchWhite'
      },
      {
        text: 'NO_FOOTER',
        style: 'forSearchWhite',
        pageBreak: 'after'
      },
      {
        text: '尊敬的' + ALLData.checker.name + dicTitle +'：',
        style: 'titlePage',
        margin: [0, 0, 0, 25]
      },
      {
        text: [
          {
            text: '哈哈',
            color: '#fff'
          },
          configData.say
        ],
        style: 'titlePage'
      },
      {
        text: [
          {
            text: '哈哈',
            color: '#fff'
          },
          '基因只是影响疾病和其他个体特征的内在因素，外在因素包括生活环境和生活方式等。' +
          '此基因报告仅为针对本次检测覆盖的基因位点的相关项目或指标的分析结果，并不能覆盖人体全部器官及全部指标。'
        ],
        style: 'titlePage'
      },
      {
        text: [
          {
            text: '哈哈',
            color: '#fff'
          },
          '*分析结果未见异常并不代表没有疾病，如您有不适症状，请及时到医院就诊。'
        ],
        style: 'titlePageO'
      },
      {
        text: [
          {
            text: '哈哈',
            color: '#fff'
          },
          '*如分析结果中存在中高危风险，不代表已经患有该疾病。不要有心理压力，应该针对性的调整生活习惯，积极预防。'
        ],
        style: 'titlePageO'
      },
      {
        text: [
          {
            text: '哈哈',
            color: '#fff'
          },
          '生命只有一次，索真健康为您保驾护航！'
        ],
        style: 'titlePage'
      },
      {
        text: [
          {
            text: '哈哈',
            color: '#fff'
          },
          '祝您身体健康、阖家欢乐！'
        ],
        style: 'titlePage'
      },
      {
        text: [
          {
            text: '哈哈',
            color: '#fff'
          },
          '索真健康'
        ],
        style: 'titlePage',
        margin: [0, 50, 0, 0]
      },
      {
        text: [
          {
            text: '哈哈',
            color: '#fff'
          },
          ALLData.reportTime
        ],
        style: 'titlePage'
      },
      {
        text: 'NO_HEADER',
        style: 'forSearchWhite'
      },
      {
        text: 'NO_FOOTER',
        style: 'forSearchWhite'
      },
      {
        text: 'INTRO_END',
        style: 'forSearchWhite'
      }
    ];
    if(searchData && searchData.addPageList.some(function(item){return item === 'AFTER_INTRO'})) {
      content.push({
          text: 'NO_HEADER',
          style: 'forSearchWhite',
          pageBreak: 'before'
        },
        {
          text: 'NO_FOOTER',
          style: 'forSearchWhite'
        });
    }
    content.push(
      {
        text: '目录',
        fontSize: 18,
        bold: true,
        color: '#383838',
        pageBreak: 'before'
      },
      {
        text: 'CAT_START',
        style: 'forSearchWhite'
      },
      catalog.map(
        function (item) {
          return [
            {
              text: item.title,
              fontSize: 11,
              bold: true,
              color: item.color,
              lineHeight: 1.4,
              margin: [0, 16, 0, 0]
            },
            [
              item.data.map(
                function (key, idx) {
                  if (key.pageNum < 10) {
                    key.pageNum = '0' + key.pageNum
                  }
                  if (key.name === item.data[item.data.length - 1].name) {
                    return {
                      columns: [
                        {
                          width: 'auto',
                          text: key.name,
                          color: item.color,
                          fontSize: 11,
                          lineHeight: 1.4
                        },
                        {
                          width: '*',
                          text: key.dian,
                          color: item.color,
                          fontSize: 11,
                          lineHeight: 1.4

                        },
                        {
                          width: 'auto',
                          text: key.pageNum,
                          color: item.color,
                          fontSize: 11,
                          lineHeight: 1.4
                        }
                      ],
                      margin: [0, 0, 0, 30]
                    };
                  }
                  return {
                    columns: [
                      {
                        width: 'auto',
                        text: key.name,
                        color: item.color,
                        fontSize: 11,
                        lineHeight: 1.4
                      },
                      {
                        width: '*',
                        text: key.dian,
                        color: item.color,
                        fontSize: 11,
                        lineHeight: 1.4

                      },
                      {
                        width: 'auto',
                        text: key.pageNum,
                        color: item.color,
                        fontSize: 11,
                        lineHeight: 1.4
                      }
                    ]
                  }
                }
              )
            ]
          ];
        }
      ),
      {
        text: 'CAT_END',
        style: 'forSearchWhite'
      }
    );
    if(searchData && searchData.addPageList.some(function(item){return item === 'AFTER_CAT'})) {
      content.push({
          text: 'NO_HEADER',
          style: 'forSearchWhite',
          pageBreak: 'before'
        },
        {
          text: 'NO_FOOTER',
          style: 'forSearchWhite'
        });
    }
// 静态部分

// 生成表格
// 参数是一个对象
// var tableArguments = {
//   listType: 'hz',  hz 或者 gene   代表汇总列表和基因列表
//   listData: ALLData.reportInfo.drugResponse.items,   数据
//   listHeader: hzTable,   表头
//   tableColor: '#fff0c5',  表格border颜色
//   fillColor: '#fff0c5',   表色填充色
//   widths: ['*', '*', '*']  表格宽度
// };
    function getTable(tableArguments) {
      var borderStyle = [false, false, false, true];
      for (var i = 0; i < tableArguments.listData.length; i++) {
        if (tableArguments.listType === 'hz' && tableArguments.listData[i].summary) {
          var hzListItem = [
            {
              text: addZ(i + 1),
              style: 'hzTable',
              border: borderStyle
            },
            {
              text: tableArguments.listData[i].phenotypeName || '',
              style: 'hzTable',
              border: borderStyle
            },
            {
              text: tableArguments.listData[i].summary || '',
              style: 'hzTable',
              border: borderStyle
            }
          ];
          tableArguments.listHeader.push(hzListItem);
        }
        if (tableArguments.listType === 'gene' && tableArguments.listData[i].summary) {
          // 如果summary为undefined,则删除这条数据
          const geneText =  tableArguments.listData[i].gene || '';
          var geneListItem = [
            {
              text: geneText.replace(/,/g, ", "),
              style: 'hzTable',
              border: borderStyle
            },
            {
              // text: tableArguments.listData[i].rsid || '',
              text: tableArguments.listData[i].thid || tableArguments.listData[i].rsid || '',
              style: 'hzTable',
              border: borderStyle
            },
            {
              text: tableArguments.listData[i].genotype || '',
              style: 'hzTable',
              border: borderStyle
            // },
            // {
            //   text: tableArguments.listData[i].summary || '',
            //   style: 'hzTable',
            //   border: borderStyle
            }
          ];
          tableArguments.listHeader.push(geneListItem);
        }
        if (tableArguments.listType === 'gt') {
          var pos = tableArguments.listData[i].pos || '';
          var newPos = pos.replace(/:/, ": ").replace(/-/g, "- ");
          var gtListItem = [
            {
              text: tableArguments.listData[i].gene || '',
              alignment: 'center',
              margin: [1, 3.5, 0, 3.5],
              fontSize: 10.5,
              wordBreak: 'break-all',
              border: borderStyle
            },
            {
              text: tableArguments.listData[i].variant1 || '',
              style: 'gtTable',
              border: borderStyle
            },
            // {
            //   text: tableArguments.listData[i].ENST || '',
            //   style: 'gtTable',
            //   border: borderStyle
            // },
            {
              text: tableArguments.listData[i].variant2 || '',
              style: 'gtTable',
              border: borderStyle
            },
            {
              text: tableArguments.listData[i].type || '',
              alignment: 'center',
              margin: [1, 3.5, 0, 3.5],
              fontSize: 10.5,
              wordBreak: 'break-all',
              border: borderStyle
            },
            {
              text: newPos || '',
              style: 'gtTable',
              border: borderStyle
            },
            {
              text: tableArguments.listData[i].analyse || '',
              alignment: 'center',
              margin: [1, 3.5, 0, 3.5],
              fontSize: 10.5,
              wordBreak: 'break-all',
              border: borderStyle
            }
          ];
          tableArguments.listHeader.push(gtListItem);
        }
      }

      var table = {
        table: {
          dontBreakRows: true,
          widths: tableArguments.widths,
          body: tableArguments.listHeader
        },
        layout: {
          vLineColor: tableArguments.tableColor,
          hLineColor: tableArguments.tableColor,
          fillColor: function (r) {
            return tableArguments.listType === 'hz' || tableArguments.listType === 'gt' ?
              (r < 1) ? null : tableArguments.fillColor : (r % 2 === 1) ? tableArguments.fillColor : null;
          }
        },
        style: 'tableP4'
      };
      return table;
    }

// 生成基因介绍
    function geneIntro(data, part, partIndex) {
      var geneHeader = [
        [
          {
            text: '基因',
            style: 'hzTable',
            border: [false, true, false, true]
          },
          {
            text: '位点',
            style: 'hzTable',
            border: [false, true, false, true]
          },
          {
            text: '基因型',
            style: 'hzTable',
            border: [false, true, false, true]
          // },
          // {
          //   text: part === 'genericDisease' ? '致病性分析' : '影响',
          //   style: 'hzTable',
          //   border: [false, true, false, true]
          }
        ]
      ];
      var tableArguments = {
        listType: 'gene',
        listData: data.genotypes,
        listHeader: geneHeader,
        tableColor: PART_DICTIONARY[part].lColor,
        fillColor: PART_DICTIONARY[part].fColor,
        // widths: ['*', 'auto', 60, 80]
        // widths: [94, 94, 94, 94]
        widths: [130, 130, 130]
      };
      const geneTable = getTable(tableArguments);

      content.push(
        {
          pageBreak: 'before',
          text: '\n ' + partIndex + '／' + data.phenotypeName,
          fontSize: 14,
          color: PART_DICTIONARY[part].tColor
        },
        {
          text: 'RECORD',
          style: 'forSearchWhite'
        },
        {
          text: '基因分析结果：' + data.summary,
          style: 'geneLevel'
        }
      );
      switch (part) {
        case 'genericDisease': {
          content.push(
            {
              columns: [
                {
                  image: PART_DICTIONARY[part].img,
                  width: 12,
                  height: 12,
                  margin: [0, 3, 10, 0]
                },
                {
                  text: '疾病介绍',
                  margin: [10, 0, 0, 15],
                  color: PART_DICTIONARY[part].tColor
                }
              ]
            },
            {
              text: ALLData.phenotypes[data.phenotypeId].introduction || '',
              style: 'itemDex'
            },
            {
              columns: [
                {
                  image: PART_DICTIONARY[part].img,
                  width: 12,
                  height: 12,
                  margin: [0, 3, 10, 0]
                },
                {
                  text: '相关基因解读',
                  margin: [10, 0, 0, 15],
                  color: PART_DICTIONARY[part].tColor
                }
              ]
            },
            {
              text: ALLData.phenotypes[data.phenotypeId].relatedGenes || '',
              style: 'itemDex'
            },
            {
              columns: [
                {
                  image: PART_DICTIONARY[part].img,
                  width: 12,
                  height: 12,
                  margin: [0, 3, 10, 0]
                },
                {
                  text: '基因检测结果',
                  margin: [10, 0, 0, 15],
                  color: PART_DICTIONARY[part].tColor
                }
              ]
            },
            geneTable
          );
          break;
        }
        case 'nutrition': {
          content.push(
            {
              columns: [
                {
                  image: PART_DICTIONARY[part].img,
                  width: 12,
                  height: 12,
                  margin: [0, 3, 10, 0]
                },
                {
                  text: '介绍',
                  margin: [10, 0, 0, 15],
                  color: PART_DICTIONARY[part].tColor
                }
              ]
            },
            {
              text: ALLData.phenotypes[data.phenotypeId].introduction || '',
              style: 'itemDex'
            }
          );
          if (ALLData.phenotypes[data.phenotypeId].advise) {
            content.push(
              {
                columns: [
                  {
                    image: PART_DICTIONARY[part].img,
                    width: 12,
                    height: 12,
                    margin: [0, 3, 10, 0]
                  },
                  {
                    text: '健康建议',
                    margin: [10, 0, 0, 15],
                    color: PART_DICTIONARY[part].tColor
                  }
                ]
              },
              {
                text: ALLData.phenotypes[data.phenotypeId].advise || '',
                style: 'itemDex'
              }
            );
          }
          if (ALLData.phenotypes[data.phenotypeId].relatedGenes) {
            content.push(
              {
                columns: [
                  {
                    image: PART_DICTIONARY[part].img,
                    width: 12,
                    height: 12,
                    margin: [0, 3, 10, 0]
                  },
                  {
                    text: '相关基因解读',
                    margin: [10, 0, 0, 15],
                    color: PART_DICTIONARY[part].tColor
                  }
                ]
              },
              {
                text: ALLData.phenotypes[data.phenotypeId].relatedGenes || '',
                style: 'itemDex'
              }
            );
          }
          content.push(
            {
              columns: [
                {
                  image: PART_DICTIONARY[part].img,
                  width: 12,
                  height: 12,
                  margin: [0, 3, 10, 0]
                },
                {
                  text: '基因检测结果',
                  margin: [10, 0, 0, 15],
                  color: PART_DICTIONARY[part].tColor
                }
              ]
            },
            geneTable
          );
          break;
        }
        case 'drugResponse': {
          content.push(
            {
              columns: [
                {
                  image: PART_DICTIONARY[part].img,
                  width: 12,
                  height: 12,
                  margin: [0, 3, 10, 0]
                },
                {
                  text: '介绍',
                  margin: [10, 0, 0, 15],
                  color: PART_DICTIONARY[part].tColor
                }
              ]
            },
            {
              text: ALLData.phenotypes[data.phenotypeId].introduction || '',
              style: 'itemDex'
            },
            {
              columns: [
                {
                  image: PART_DICTIONARY[part].img,
                  width: 12,
                  height: 12,
                  margin: [0, 3, 10, 0]
                },
                {
                  text: '基因检测结果',
                  margin: [10, 0, 0, 15],
                  color: PART_DICTIONARY[part].tColor
                }
              ]
            },
            geneTable
          );
          break;
        }
        case 'genericFeature': {
          content.push(
            {
              columns: [
                {
                  image: PART_DICTIONARY[part].img,
                  width: 12,
                  height: 12,
                  margin: [0, 3, 10, 0]
                },
                {
                  text: '介绍',
                  margin: [10, 0, 0, 15],
                  color: PART_DICTIONARY[part].tColor
                }
              ]
            },
            {
              text: ALLData.phenotypes[data.phenotypeId].introduction || '',
              style: 'itemDex'
            },
            {
              columns: [
                {
                  image: PART_DICTIONARY[part].img,
                  width: 12,
                  height: 12,
                  margin: [0, 3, 10, 0]
                },
                {
                  text: '基因检测结果',
                  margin: [10, 0, 0, 15],
                  color: PART_DICTIONARY[part].tColor
                }
              ]
            },
            geneTable
          );
          break;
        }
        case 'chronicDisease': {
          content.push(
            {
              columns: [
                {
                  image: PART_DICTIONARY[part].img,
                  width: 12,
                  height: 12,
                  margin: [0, 3, 10, 0]
                },
                {
                  text: '疾病介绍',
                  margin: [10, 0, 0, 15],
                  color: PART_DICTIONARY[part].tColor
                }
              ]
            },
            {
              text: ALLData.phenotypes[data.phenotypeId].introduction || '',
              style: 'itemDex'
            }
          );
          if (ALLData.phenotypes[data.phenotypeId].cause) {
            content.push(
              {
                columns: [
                  {
                    image: PART_DICTIONARY[part].img,
                    width: 12,
                    height: 12,
                    margin: [0, 3, 10, 0]
                  },
                  {
                    text: '风险因素',
                    margin: [10, 0, 0, 15],
                    color: PART_DICTIONARY[part].tColor
                  }
                ]
              },
              {
                text: ALLData.phenotypes[data.phenotypeId].cause || '',
                style: 'itemDex'
              }
            );
          }
          if (ALLData.phenotypes[data.phenotypeId].advise) {
            content.push(
              {
                columns: [
                  {
                    image: PART_DICTIONARY[part].img,
                    width: 12,
                    height: 12,
                    margin: [0, 3, 10, 0]
                  },
                  {
                    text: '预防建议',
                    margin: [10, 0, 0, 15],
                    color: PART_DICTIONARY[part].tColor
                  }
                ]
              },
              {
                text: ALLData.phenotypes[data.phenotypeId].advise || '',
                style: 'itemDex'
              }
            );
          }
          content.push(
            {
              columns: [
                {
                  image: PART_DICTIONARY[part].img,
                  width: 12,
                  height: 12,
                  margin: [0, 3, 10, 0]
                },
                {
                  text: '相关基因解读',
                  margin: [10, 0, 0, 15],
                  color: PART_DICTIONARY[part].tColor
                }
              ]
            },
            {
              text: ALLData.phenotypes[data.phenotypeId].relatedGenes || '',
              style: 'itemDex'
            },
            {
              columns: [
                {
                  image: PART_DICTIONARY[part].img,
                  width: 12,
                  height: 12,
                  margin: [0, 3, 10, 0]
                },
                {
                  text: '基因检测结果',
                  margin: [10, 0, 0, 15],
                  color: PART_DICTIONARY[part].tColor
                }
              ]
            },
            geneTable
          );
          break;
        }
        case 'sportsAndFitness': {
          content.push(
            {
              columns: [
                {
                  image: PART_DICTIONARY[part].img,
                  width: 12,
                  height: 12,
                  margin: [0, 3, 10, 0]
                },
                {
                  text: '介绍',
                  margin: [10, 0, 0, 15],
                  color: PART_DICTIONARY[part].tColor
                }
              ]
            },
            {
              text: ALLData.phenotypes[data.phenotypeId].introduction || '',
              style: 'itemDex'
            }
          );
          if (ALLData.phenotypes[data.phenotypeId].relatedGenes) {
            content.push(
              {
                columns: [
                  {
                    image: PART_DICTIONARY[part].img,
                    width: 12,
                    height: 12,
                    margin: [0, 3, 10, 0]
                  },
                  {
                    text: '相关基因解读',
                    margin: [10, 0, 0, 15],
                    color: PART_DICTIONARY[part].tColor
                  }
                ]
              },
              {
                text: ALLData.phenotypes[data.phenotypeId].relatedGenes || '',
                style: 'itemDex'
              }
            )
          }
          content.push(
            {
              columns: [
                {
                  image: PART_DICTIONARY[part].img,
                  width: 12,
                  height: 12,
                  margin: [0, 3, 10, 0]
                },
                {
                  text: '基因检测结果',
                  margin: [10, 0, 0, 15],
                  color: PART_DICTIONARY[part].tColor
                }
              ]
            },
            geneTable
          );
          break;
        }
        case 'tumour': {
          content.push(
            {
              columns: [
                {
                  image: PART_DICTIONARY[part].img,
                  width: 12,
                  height: 12,
                  margin: [0, 3, 10, 0]
                },
                {
                  text: '疾病介绍',
                  margin: [10, 0, 0, 15],
                  color: PART_DICTIONARY[part].tColor
                }
              ]
            },
            {
              text: ALLData.phenotypes[data.phenotypeId].introduction || '',
              style: 'itemDex'
            }
          );
          content.push(
            {
              columns: [
                {
                  image: PART_DICTIONARY[part].img,
                  width: 12,
                  height: 12,
                  margin: [0, 3, 10, 0]
                },
                {
                  text: '风险因素',
                  margin: [10, 0, 0, 15],
                  color: PART_DICTIONARY[part].tColor
                }
              ]
            },
            {
              text: ALLData.phenotypes[data.phenotypeId].cause || '',
              style: 'itemDex'
            }
          );
          if (ALLData.phenotypes[data.phenotypeId].advise) {
            content.push(
              {
                columns: [
                  {
                    image: PART_DICTIONARY[part].img,
                    width: 12,
                    height: 12,
                    margin: [0, 3, 10, 0]
                  },
                  {
                    text: '预防建议',
                    margin: [10, 0, 0, 15],
                    color: PART_DICTIONARY[part].tColor
                  }
                ]
              },
              {
                text: ALLData.phenotypes[data.phenotypeId].advise || '',
                style: 'itemDex'
              }
            );
          }
          if (ALLData.phenotypes[data.phenotypeId].relatedGenes) {
            content.push(
              {
                columns: [
                  {
                    image: PART_DICTIONARY[part].img,
                    width: 12,
                    height: 12,
                    margin: [0, 3, 10, 0]
                  },
                  {
                    text: '相关基因解读',
                    margin: [10, 0, 0, 15],
                    color: PART_DICTIONARY[part].tColor
                  }
                ]
              },
              {
                text: ALLData.phenotypes[data.phenotypeId].relatedGenes || '',
                style: 'itemDex'
              }
            );
          }
          content.push(
            {
              columns: [
                {
                  image: PART_DICTIONARY[part].img,
                  width: 12,
                  height: 12,
                  margin: [0, 3, 10, 0]
                },
                {
                  text: '基因检测结果',
                  margin: [10, 0, 0, 15],
                  color: PART_DICTIONARY[part].tColor
                }
              ]
            },
            geneTable
          );
          break;
        }
        default: {
          break;
        }
      }
    }
// 生成九个大块的每个块
    function genePart(part) {
      var partIndex = 0;
      const partData = ALLData.reportInfo[part];
      var hzHeader = [
        [
          {
            text: '序号',
            style: 'hzTable',
            border: [false, true, false, true]
          },
          {
            text: '项目',
            style: 'hzTable',
            border: [false, true, false, true]
          },
          {
            text: '结果',
            style: 'hzTable',
            border: [false, true, false, true]
          }
        ]
      ];
      const tableArguments = {
        listType: 'hz',
        listData: partData.items.filter(function (item) {return !item.ignore && item.summary}),
        listHeader: hzHeader,
        tableColor: PART_DICTIONARY[part].lColor,
        fillColor: PART_DICTIONARY[part].fColor,
        widths: ['*', '*', '*']
        // widths: ['*', '*']
      };
      const hzTable = getTable(tableArguments);
      if(searchData && searchData.addPageList.some(function(item){ if (typeof item === 'string') { return false } return part === configData.partOrder[item].key })) {
        content.push({
            text: 'NO_HEADER',
            style: 'forSearchWhite',
            pageBreak: 'before'
          },
          {
            text: 'NO_FOOTER',
            style: 'forSearchWhite'
          });
      }
      content.push(
        {
          text: 'NO_HEADER',
          style: 'forSearchBlue',
          pageBreak: 'before'
        },
        {
          text: 'NO_FOOTER',
          style: 'forSearchBlue'
        },
        {
          text: 'PART_END',
          style: 'forSearchBlue'
        },
        {
          text: 'FILL_IMG',
          style: 'forSearchBlue'
        },
        {
          text: 'NO_HEADER',
          style: 'forSearchWhite',
          pageBreak: 'before'
        },
        {
          text: 'NO_FOOTER',
          style: 'forSearchWhite'
        },
        {
          pageBreak: 'before',
          text: PART_DICTIONARY[part].name,
          fontSize: 14,
          margin: [0, 20, 0, 20],
          color: PART_DICTIONARY[part].tColor
        },
        {
          text: 'PART_START',
          style: 'forSearchWhite'
        },
        {
          text: 'RECORD',
          style: 'forSearchWhite'
        },
        hzTable
      );
      partData.items.forEach(function (item) {
        if (!item.ignore) {
          partIndex ++;
          geneIntro(item, part, addZ(partIndex));
        }
      });
    }

    function geneGTItem(data, part) {

      function gtTable(list) {
        tableHeader = [
          [
            {
              text: '基因',
              style: 'gtTableH',
              border: [false, true, false, true]
            },
            {
              text: '核苷酸变化',
              style: 'gtTableH',
              border: [false, true, false, true]
            },
            // {
            //   text: 'ENST号',
            //   style: 'gtTableH',
            //   border: [false, true, false, true]
            // },
            {
              text: '氨基酸变化',
              style: 'gtTableH',
              border: [false, true, false, true]
            },
            {
              text: '基因型',
              style: 'gtTableH',
              border: [false, true, false, true]
            },
            {
              text: '染色体位置',
              style: 'gtTableH',
              border: [false, true, false, true]
            // },
            // {
            //   text: '致病性分析',
            //   style: 'gtTableH',
            //   border: [false, true, false, true]
            }
          ]
        ];
        var tableArguments = {
          listType: 'gt',
          listData: list,
          listHeader: tableHeader,
          tableColor: PART_DICTIONARY[part].lColor,
          fillColor: PART_DICTIONARY[part].fColor,
          // widths: [36, 70, 70, 50, 72, 60]
          widths: [78, 78, 78, 78, 78, 0]
        };
        return getTable(tableArguments);
      }

      content.push(
        {
          pageBreak: 'before',
          text: '\n ' + data.phenotypeName,
          fontSize: 14,
          color: PART_DICTIONARY[part].tColor
        },
        {
          text: 'RECORD',
          style: 'forSearchWhite'
        },
        {
          text: '基因检测结果：' + data.summary,
          style: 'geneLevel'
        },
        {
          columns: [
            {
              image: PART_DICTIONARY[part].img,
              width: 12,
              height: 12,
              margin: [0, 3, 10, 0]
            },
            {
              text: '疾病介绍',
              margin: [10, 0, 0, 15],
              color: PART_DICTIONARY[part].tColor
            }
          ]
        },
        {
          text: ALLData.phenotypes[data.phenotypeId].introduction || '',
          style: 'itemDex'
        },
        {
          columns: [
            {
              image: PART_DICTIONARY[part].img,
              width: 12,
              height: 12,
              margin: [0, 3, 10, 0]
            },
            {
              text: '基因检测结果',
              margin: [10, 0, 0, 15],
              color: PART_DICTIONARY[part].tColor
            }
          ]
        }
      );
      if (data.genotypes.length > 0) {
        const level0 = data.genotypes.filter(function (item) {
          return (item.level == 0)
        });
        const level1 = data.genotypes.filter(function (item) {
          return (item.level == 1)
        });
        const level234 = data.genotypes.filter(function (item) {
          return (item.level > 1)
        });
        if (level0.length > 0) {
          const tableL0 = gtTable(level0);
          content.push(
            {
              text: '致病突变',
              style: 'gtTableTitle'
            },
            tableL0
          );
        }
        if (level1.length > 0) {
          const tableL1 = gtTable(level1);
          content.push(
            {
              text: '可能致病突变',
              style: 'gtTableTitle'
            },
            tableL1
          );
        }
        if (level234.length > 0) {
          const left = level234.length - 10;
          var tip = left > 0 ? '因篇幅有限，还有' + left + '条良性突变未显示' : '';
          const tableL234 = gtTable(level234.slice(0, 10));
          content.push(
            {
              text: '良性突变',
              style: 'gtTableTitle'
            },
            tableL234,
            {
              text: tip,
              style: 'gtTableTip'
            }
          );
        }
      } else {
        content.push(
          {
            text: '未检测到相关突变',
            style: 'gtTableTitle'
          }
        );
      }
    }

    //生成最后一部分
    function geneGT(part) {
      const partData = ALLData.reportInfo[part];
      var hzHeader = [
        [
          {
            text: '序号',
            style: 'hzTable',
            border: [false, true, false, true]
          },
          {
            text: '项目',
            style: 'hzTable',
            border: [false, true, false, true]
          },
          {
            text: '结果',
            style: 'hzTable',
            border: [false, true, false, true]
          }
        ]
      ];
      const tableArguments = {
        listType: 'hz',
        listData: partData.items.filter(function (item) {return !item.ignore && item.summary}),
        listHeader: hzHeader,
        tableColor: PART_DICTIONARY[part].lColor,
        fillColor: PART_DICTIONARY[part].fColor,
        widths: ['*', '*', '*']
        // widths: ['*', '*']
      };
      if(searchData && searchData.addPageList.some(function(item){ if (typeof item === 'string') { return false } return part === configData.partOrder[item].key })) {
        content.push({
            text: 'NO_HEADER',
            style: 'forSearchWhite',
            pageBreak: 'before'
          },
          {
            text: 'NO_FOOTER',
            style: 'forSearchWhite'
          });
      }
      const hzTable = getTable(tableArguments);
      content.push(
        {
          text: 'NO_HEADER',
          style: 'forSearchBlue',
          pageBreak: 'before'
        },
        {
          text: 'NO_FOOTER',
          style: 'forSearchBlue'
        },
        {
          text: 'PART_END',
          style: 'forSearchBlue'
        },
        {
          text: 'FILL_IMG',
          style: 'forSearchBlue'
        },
        {
          text: 'NO_HEADER',
          style: 'forSearchWhite',
          pageBreak: 'before'
        },
        {
          text: 'NO_FOOTER',
          style: 'forSearchWhite'
        },
        {
          pageBreak: 'before',
          text: '遗传性肿瘤',
          margin: [0, 30, 0, 20],
          fontSize: 14,
          color: PART_DICTIONARY[part].tColor
        },
        {
          text: 'RECORD',
          style: 'forSearchWhite'
        },
        hzTable
      );
      partData.items.forEach(function (item) {
        if (!item.ignore) {
          geneGTItem(item, part);
        }
      });
    }

    function generatePdf () {
      configData.partOrder.forEach(function (item) {
        if (item.key === 'genericTumor') {
          geneGT(item.key);
        } else {
          genePart(item.key)
        }
      });
      // genePart('chronicDisease');
      // genePart('tumour');
      // genePart('nutrition');
      // genePart('genericFeature');
      // genePart('sportsAndFitness');
      // genePart('drugResponse');
      // genePart('genericDisease');
      var dynamicPart = {
        content: content
      };
      return Object.assign({}, STATIC_PART, dynamicPart);
    }

    function namePdf() {
      // var timeStamp = new Date().getFullYear().toString() + '-' + (new Date().getMonth() + 1).toString()
      //   + '-' + new Date().getDate().toString();
      return ALLData.checker.name + configData.productName + '-' + ALLData.sampleNo + '.pdf';
    }

    console.log('pdf generating...... cost: ' + (new Date() - time) + 'ms');
    var doc = new Printer({
      Roboto: {
        normal: __dirname + '/../fonts/PingFang Regular.ttf',
        bold: __dirname + '/../fonts/PingFang Medium.ttf',
        italics: __dirname + '/../fonts/PingFang-Light.ttf',
        bolditalics: __dirname + '/../fonts/PingFang-Bold.ttf'
      }
    }).createPdfKitDocument(generatePdf());
    doc.end();
    console.log('pdf generated! cost: ' + (new Date() - time) + 'ms');

    var headList = [];
    var footList = [];
    var imgList = [];
    var addPageList = [];
    var numList = [];
    var pageAdd = 0;
    var startPage = 0;
    var pAdd = 0;
    var partCount = 0;
    if (typeof searchData == 'undefined') {
      console.log('catalog generating...... cost: ' + (new Date() - time) + 'ms');
      doc._pdfMakePages.forEach(function (page) {
        page.items.forEach(function (row) {
          if (row.item.inlines) {
            row.item.inlines.forEach(function (word) {
              var curPage = parseInt(page.items[page.items.length-1].item.inlines[0].text, 10);
              if(word.text === 'NO_HEADER') {
                headList.push(curPage + pAdd);
              }
              if(word.text === 'FILL_IMG') {
                imgList.push(curPage + pAdd);
              }
              if(word.text === 'NO_FOOTER') {
                footList.push(curPage + pAdd);
                pageAdd ++;
              }
              if (word.text === 'INTRO_START') {
                startPage = curPage;
              }
              if(word.text === 'INTRO_END') {
                if ((curPage - startPage) % 2 !==0) {
                  addPageList.push('AFTER_INTRO');
                  footList.push(curPage + pAdd + 1);
                  headList.push(curPage + pAdd + 1);
                  pAdd ++;
                  pageAdd ++;
                }
                startPage = 0;
              }
              if (word.text === 'CAT_START') {
                startPage = curPage;
              }
              if(word.text === 'CAT_END') {
                const totalCat = curPage - startPage + 1;
                var i = 0;
                while (i < totalCat) {
                  footList.push(startPage + pAdd + i);
                  i++;
                  pageAdd ++;
                }
                if ((curPage - startPage + 1) % 2 !==0) {
                  addPageList.push('AFTER_CAT');
                  footList.push(curPage + pAdd + 1);
                  headList.push(curPage + pAdd + 1);
                  pAdd ++;
                  pageAdd ++;
                }
                startPage = 0;
              }
              if(word.text === 'PART_START') {
                startPage = curPage;
              }
              if(word.text === 'PART_END' && startPage !== 0) {
                // console.log(startPage);
                // console.log(curPage);
                partCount ++;
                if ((curPage - startPage) % 2 !==0) {
                  addPageList.push(partCount);
                  footList.push(curPage + pAdd, curPage + pAdd + 1);
                  headList.push(curPage + pAdd, curPage + pAdd + 1);
                  pAdd ++;
                  pageAdd ++;
                }
                startPage = 0;
              }
              if (word.text === 'RECORD') {
                // console.log(curPage);
                // console.log((curPage - pageAdd + pAdd).toString());
                numList.push((curPage - pageAdd + pAdd).toString());
              }
            })
          }
        })
      });

      // console.log(headList);
      // console.log(footList);
      // console.log(imgList);
      // console.log(addPageList);
      // console.log(pageAdd);y
      // console.log(pAdd);

      var numIndex = 0;
      catalog.forEach(function (part, index) {
        part.data.forEach(function (list, idx) {
          catalog[index].data[idx].pageNum = numList[numIndex];
          numIndex++;
        })
      });
      console.log('catalog generated! cost: ' + (new Date() - time) + 'ms');
      doc.pipe(devnull());
    }
    return {
      fileName: namePdf(),
      stream: doc,
      searchData: {catalog: catalog, headList: headList, footList: footList, imgList: imgList, addPageList: addPageList},
      totalPage: totalPage
    };
  }
  return geneSteam(geneSteam().searchData);
};
