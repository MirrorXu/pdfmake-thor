/**
 * Created by chao.z on 17/12/18.
 */
/* eslint-disable */
const fs = require('fs');
const Printer = require('pdfmake');
const cover = require('../common/cover');
const percentage = require('../common/percentage');
const namePdf = require('../common/namePdf');
var devnull = require('dev-null');
// 生成p53的报告
module.exports = function (data) {
  var totalPage = 0;
  function p53PDF(data) {
    // 引入报告封面
    const coverPage = cover('P53抑癌基因检测报告', '/img/p53.png', data);
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
      switch (data.score) {
        case -1: {
          resultName = '较差';
          resultColor = '#e47047';
          itemLevel = __dirname + '/img/p53-1.png';
          break;
        }
        case 1: {
          resultName = '较好';
          resultColor = '#7bc0e6';
          itemLevel = __dirname + '/img/p53-3.png';
          break;
        }
        case 0: {
          resultName = '正常';
          resultColor = '#6ebd72';
          itemLevel = __dirname + '/img/p53-2.png';
          break;
        }
        default: {
          resultColor = '#e84165';
          itemLevel = __dirname + '/img/p53-3.png';
          break;
        }
      }
      // 表型以及表型配图
      content.push(
        {
          columns: [
            {
              image:  __dirname + '/img/p53.jpg',
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
                  color: '#3b7db8'
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
              text: 'P53' + data.phenotypeName || '',
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
                    '您的抗癌能力为:',
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
                    '与您具有相近水平人群在总人群的占比:',
                    {
                      text: percentage(data.ratio ? (data.ratio * 100).toFixed(2).toString() : null) || '--',
                      fontSize: 10,
                      color: '#7bc0e6'
                    }
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
          text: '注:以上结果是根据中国人群大样本流行病学和已知疾病相关位点研究成果对您的遗传风险作出的评估; 您可参考该数据更加精准的预防' +
          '疾病,但不能将其作为临床诊断依据。',
          fontSize: 10,
          color: '#231815',
          bold: true,
          margin: [0, 0, 0, 20],
          lineHeight: 1.2
        });
      var tableArr = [
        [
          {
            text: '抑癌基因',
            border: [false, false, false, false],
            alignment: 'center',
            fontSize: 10,
            color: '#fff',
            margin: [0, 2, 0, 2],
            fillColor: '#3b7db8'
          },
          {
            text: '位点',
            border: [false, false, false, false],
            alignment: 'center',
            fontSize: 10,
            color: '#fff',
            margin: [0, 2, 0, 2],
            fillColor: '#3b7db8'
          },
          {
            text: '基因型',
            border: [false, false, false, false],
            alignment: 'center',
            fontSize: 10,
            color: '#fff',
            margin: [0, 2, 0, 2],
            fillColor: '#3b7db8'
          },
          // {
          //   text: '抗癌能力',
          //   border: [false, false, false, false],
          //   alignment: 'center',
          //   fontSize: 10,
          //   color: '#fff',
          //   margin: [0, 2, 0, 2],
          //   fillColor: '#3b7db8'
          // },
        ]
      ];
      // 生成表格方法
      function createTable() {
        data.genotypes.map((i) => {
          return tableArr.push(
            [
              {
                text: i.gene || '--',
                border: [false, false, false, false],
                alignment: 'center',
                fontSize: 10,
                color: '#231815',
                bold: true,
                margin: [0, 2, 0, 2]
              },
              {
                // text: i.rsid || '--',
                text: i.thid || i.rsid || '--',
                border: [false, false, false, false],
                alignment: 'center',
                fontSize: 10,
                bold: true,
                color: '#231815',
                margin: [0, 2, 0, 2]
              },
              {
                text: i.genotype || '--',
                border: [false, false, false, false],
                alignment: 'center',
                fontSize: 10,
                color: '#231815',
                bold: true,
                margin: [0, 2, 0, 2]
              },
              // {
              //   text: resultName || '--',
              //   border: [false, false, false, false],
              //   alignment: 'center',
              //   fontSize: 10,
              //   color: '#231815',
              //   bold: true,
              //   margin: [0, 2, 0, 2]
              // }
            ]
          )
        });
        return tableArr;
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
            body: createTable()
          }
        }
      );
      // 特别提示
      // P53基因突变与哪些肿瘤发生有关?
      content.push(
        {
          text: '特别提示',
          style: 'partTitle',
          bold: true,
          margin: [0, 15, 0, 5]
        },
        {
          text: '1、该检测结果提示的是您基因水平抗癌能力,仅是基于您的基因检测数据,不能用作疾病临床诊断依据。',
          style: 'partContent'
        },
        {
          text: [
            '2、抗癌能力分为“',
            {
              text: '较差',
              color: '#e47047'
            },
            '、',
            {
              text: '正常',
              color: '#6ebd72'
            },
            '、',
            {
              text: '较好',
              color: '#7bc0e6'
            },
            '”三个等级。“',
            {
              text: '较差',
              color: '#e47047'
            },
            '”表示您自身抗肿瘤能力低于平均水平; “',
            {
              text: '正常',
              color: '#6ebd72'
            },
            '”表示'
          ],
          fontSize: 10,
          color: '#231815',
          bold: true
        },
        {
          text: [
            {
              text: '您自身抗肿瘤能力与平均水平相近; “'
            },
            {
              text: '较好',
              color: '#7bc0e6'
            },
            '”表示您您自身抗肿瘤能力高于平均水平。'
          ],
          fontSize: 10,
          color: '#231815',
          bold: true,
          margin: [16, 0, 0, 20]
        },
        {
          text: 'P53基因突变与哪些肿瘤发生有关?',
          style: 'detailPart'
        },
        {
          text: '约有50%人类肿瘤的发生与P53基因突变有关,目前发现与P53基因突变有显著相关性的恶性肿瘤很多、且相对比较常见,如:',
          fontSize: 10,
          color: '#231815',
          bold: true,
          margin: [0, 0, 20, 5]
        },
        {
          image: __dirname + '/img/tumour.png',
          width: 500,
          margin: [0, 10, 0, 0],
          pageBreak: 'after'
        },
        {
          image: __dirname + '/img/geneTop.jpg',
          width: 595,
          absolutePosition: {x: 0, y: 0}
        },
        {
          text: '关于P53抑癌基因',
          style: 'detailPart',
          margin: [14, 160, 0, 0]
        },
        {
          text: '抑癌基因是一类能抑制细胞过度生长、增殖从而遏制肿瘤形成的基因。P53为最早发现抑癌基因之一,因其编 码一种分子量为53kDa的蛋白质,因而得名P53(也称为P53蛋白或P53肿瘤蛋白),P53蛋白能调节细胞周 期和避免细胞癌变发生。 因此,P53蛋白被称为基因组守护者,在避免癌症发生机制上扮演重要的角色。',
          style: 'partContent',
          margin: [14, 5, 14, 15]
        },
        {
          text: '1、抑制细胞周期',
          style: 'partContent',
          margin: [14, 0, 0, 5]
        },
        {
          text: 'P53蛋白能抑制细胞生长周期,使细胞周期停留于G1/S期的节律点上,以完成DNA损坏辨识。 (若细胞能在此 节律点上停留时间够久,DNA修复蛋白将有充足时间修复DNA损伤,并使细胞生长周期继续。)',
          style: 'partContent',
          margin: [14, 0, 0, 5]
        },
        {
          text: '2、促进细胞凋亡',
          style: 'partContent',
          margin: [14, 0, 0, 5]
        },
        {
          text: '若细胞DNA损伤已不能修复,P53蛋白能启动细胞凋亡程序,避免携带异常遗传信息的细胞继续分裂、生长。',
          style: 'partContent',
          margin: [14, 0, 0, 5]
        },
        {
          text: '3、维持基因组稳定性',
          style: 'partContent',
          margin: [14, 0, 0, 5]
        },
        {
          text: '当DNA受损时,P53蛋白能活化DNA修复蛋白,参与DNA损伤修复。',
          style: 'partContent',
          margin: [14, 0, 0, 5]
        },
        {
          text: '4、抑制血管新生',
          style: 'partContent',
          margin: [14, 0, 0, 5]
        },
        {
          text: '研究证实,肿瘤生长到一定程度后,可以通过自分泌途径生成促血管生成因子,刺激营养血管在瘤体实质内增 生。P53蛋白能刺激抑制血管生成基因Smad4 等表达,抑制肿瘤血管形成。',
          style: 'partContent',
          margin: [14, 0, 0, 20]
        },
        {
          text: '健康指导',
          style: 'detailPart',
          margin: [14, 0, 0, 5]
        },
        {
          text: 'P53基因检测结果显示您抗癌能力“较差”时,建议您从以下几方面入手,预防恶性肿瘤的发生:',
          style: 'partContent',
          margin: [14, 0, 0, 10]
        },
        {
          text: '1、 饮食禁忌',
          style: 'partContent',
          margin: [14, 0, 0, 5]
        },
        {
          text: '不吃煎炸熏烤食物,不吃剩饭剩菜,不吃霉变食物(如发霉的玉米、花生),不吃过烫食物,不喝高温汤、水,不吃坚硬、难消化食物。',
          style: 'partContent',
          margin: [14, 0, 0, 5]
        },
        {
          text: '2、合理用药',
          style: 'partContent',
          margin: [14, 0, 0, 5]
        },
        {
          text: '不滥用药物。如为疾病治疗需要,需长期用药,请遵医嘱,且定期监测肝肾功能。',
          style: 'partContent',
          margin: [14, 0, 0, 5]
        },
        {
          text: '3、减少职业暴露',
          style: 'partContent',
          margin: [14, 0, 0, 5]
        },
        {
          text: '化学污染物、放射线、电离辐射等为高危致癌因素,应加强自我防护,避免职业暴露。',
          style: 'partContent',
          margin: [14, 0, 0, 5]
        },
        {
          text: '4、保持心情愉悦,减少精神刺激',
          style: 'partContent',
          margin: [14, 0, 0, 5]
        },
        {
          text: '5、多吃新鲜蔬果',
          style: 'partContent',
          margin: [14, 0, 0, 5]
        },
        {
          text: '6、适当运动,增强机体免疫力',
          style: 'partContent',
          margin: [14, 0, 0, 5]
        },
        {
          text: '7、若有不适,请到专科门诊就诊',
          style: 'partContent',
          margin: [14, 0, 0, 5]
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
          image: __dirname + '/img/lastPage.jpg',
          width: 595,
          height: 845,
          margin: [-40, -44, -60, -70],
          pageBreak: 'before'
        }
      );
    }

    geneToCus();
    const phenotypeData =  data.info.default.items;
    phenotypeData.map((item) => {
      return geneItems(item);
    });
    geneEnding();
    // 页脚,样式
    const COMMON_PART = {
      // 页脚(页码)
      footer: function(currentPage, pageCount) {
        // var page = [1, 2, 7, 8];
        var page = [1, 2, 6];
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
        },
        detailPart: {
          color: '#3b7db8',
          bold: true,
          fontSize: 14,
          margin: [0, 0, 0, 5]
        },
        partContent: {
          fontSize: 10,
          color: '#231815',
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
  }).createPdfKitDocument(p53PDF(data));
  doc.end();
  doc.pipe(devnull());
  return {
    fileName: namePdf(data.checker.name, data.productName, data.sampleNo, data.meetingNo),
    stream: doc,
    totalPage: totalPage
  };
};