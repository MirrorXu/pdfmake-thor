const fs = require('fs');
const Printer = require('pdfmake');

const dd = {
  header: function (page) { //eslint-disable-line
    if (page > 2) {
      return [
        {
          image: 'img/top.png',
          width: 418,
          margin: [90, 30, 0, 0]
        }
      ];
    }
  },
  pageMargins: [90, 72, 90, 72],
  content: [
    // page1
    {
      image: 'img/logoNew.png',
      width: 120,
      height: 45,
      margin: [-40, 20, 0, 0]
    },
    {
      stack: [
        '分子遗传检测报告单',
        {
          text: 'Molecular Genetics Report',
          style: 'coverTitleEn'
        }
      ],
      style: 'coverTitle'
    },
    {
      stack: [
        {
          text: ['姓\t  名：', { text: '\t    陈琨         ', style: 'userInfo' }],
          style: 'infoItem'
        },
        {
          text: ['取样日期：', { text: '2017年02月13日', style: 'userInfo' }],
          style: 'infoItem'
        },
        {
          text: ['报告日期：', { text: '2017年02月23日', style: 'userInfo' }],
          style: 'infoItem'
        }
      ],
      style: 'coverInfo'
    },
    {
      stack: [
        {
          text: ['检测机构：', { text: '北京索真医学检验所有限公司', style: 'ItemInfo' }],
          style: 'BotItem'
        },
        {
          text: ['分析机构：', { text: '北京索真医学检验所有限公司', style: 'ItemInfo' }],
          style: 'BotItem'
        },
        {
          text: ['编\t  号：', { text: ' 1021303001447', style: 'ItemInfo' }],
          style: 'BotItem'
        }
      ],
      style: 'coverBottom',
      pageBreak: 'after'
    },


    // page2
    {
      text: '尊敬的陈琨女士：',
      style: 'p2Content'
    },
    {
      text: [
        {
          text: '缩进',
          color: '#fff'
        },
        '您好！非常荣幸为您提供“女性两癌筛查”基因检测套餐服务，该套餐主要筛查女性遗传性乳腺癌和卵巢癌，' +
      '检测其中最为重要的BRCA1和BRCA2两个基因的遗传致病位点。'],
      style: 'p2Content'
    },
    {
      text: [
        {
          text: '缩进',
          color: '#fff'
        },
        '此为您的专属报告，报告显示您的基因状况非常优秀，但是也要保持健康的生活方式和饮食习惯。' +
        '我们索真为您提供了详细的健康建议，详情见本次基因检测报告。'],
      style: 'p2Content'
    },
    {
      text: [
        {
          text: '缩进',
          color: '#fff'
        },
        '生命只有一次，索真医学为您保驾护航！'],
      style: 'p2Content'
    },
    {
      text: [
        {
          text: '缩进',
          color: '#fff'
        },
        '祝您身体健康、阖家欢乐！'],
      style: 'p2Content'
    },
    {
      text: [
        {
          text: '\n缩进',
          color: '#fff'
        },
        '索真健康'],
      style: 'p2Content'
    },
    {
      text: [
        {
          text: '缩进',
          color: '#fff'
        },
        '2017.03.30'],
      style: 'p2Content',
      pageBreak: 'after'
    },

    // page3
    {
      text: '报告阅读说明',
      fontSize: 14,
      lineHeight: 1.6,
      bold: true,
      margin: [0, 20, 0, 2]
    },
    {
      text: [
        {
          text: '缩进',
          color: '#fff'
        },
        '您的基因分析报告由套餐筛查内容、基因检测结果汇总及专家指导建议等部分组成。'],
      style: 'p3Content'
    },
    {
      text: [
        {
          text: '缩进',
          color: '#fff'
        },
        '基因检测风险越低，说明相对应的疾病发生风险越低。'],
      style: 'p3Content'
    },
    {
      text: [
        {
          text: '缩进',
          color: '#fff'
        },
        '基因分析报告数据只是针对本次测试覆盖的基因相关项目或指标的检查结果，并非能覆盖人体全部器官及全部指标。如果您提供健康信息不完整，' +
        '可能会导致体检结果有偏差。由于基因分析及医学本身的局限性，本次测试未见异常并不代表没有疾病，如您有不适症状，请及时到医院就诊。'],
      style: 'p3Content'
    },
    {
      text: [
        {
          text: '缩进',
          color: '#fff'
        },
        '如对结果有疑议，请在收到报告后的7个工作日内与我们联系。'],
      style: 'p3Content',
      pageBreak: 'after'
    },

    // page4
    {
      text: '综合分析结果',
      fontSize: 14,
      color: '#F46293',
      bold: true,
      margin: [0, 20, 0, 0]
    },
    {
      table: {
        widths: ['*', 342],
        body: [
          [
            {
              text: '检测项目',
              style: 'tableTextP4',
              border: [false, true, false, false]
            },
            {
              text: '遗传性肿瘤-女性套餐',
              style: 'tableTextP4',
              border: [false, true, false, false]
            }
          ],
          [
            {
              text: '检测内容',
              style: 'tableTextP4',
              border: [false, false, false, false],
              fillColor: '#F46293'
            },
            {
              text: '女性遗传性乳腺癌和卵巢癌筛查',
              style: 'tableTextP4',
              border: [false, false, false, false],
              fillColor: '#F46293'
            }
          ],
          [
            {
              text: '检测结果',
              style: 'tableTextP4',
              border: [false, false, false, true]
            },
            {
              text: '低风险',
              style: 'tableTextP4',
              border: [false, false, false, true]
            }
          ]
        ]
      },
      layout: {
        vLineColor: '#F46293',
        hLineColor: '#F46293'
      },
      style: 'tableP4'
    },
    {
      text: '专家指导建议',
      fontSize: 14,
      color: '#F46293',
      bold: true,
      margin: [0, 60, 0, 2]
    },
    {
      text: [
        {
          text: '根据您的基因检测结果，您乳腺癌和卵巢癌遗传易感性较低。',
          bold: true
        },
        '平时可按健康人群管理，养成健康生活习惯。同时，建议您积极采取预防上述疾病的一般性措施（可参考报告中的预防建议）。'],
      fontSize: 10.5,
      lineHeight: 1.5,
      margin: [0, 20, 0, 0],
      pageBreak: 'after'
    },


    // page5
    {
      text: '样本信息',
      fontSize: 14,
      color: '#F46293',
      bold: true,
      margin: [0, 20, 0, 0]
    },
    {
      table: {
        widths: ['*', '*'],
        body: [
          [
            {
              text: '姓名： 陈琨',
              style: 'tableTextP5',
              fillColor: '#F46293',
              border: [false, false, false, false]
            },
            {
              text: '性别： 女',
              style: 'tableTextP5',
              fillColor: '#F46293',
              border: [false, false, false, false]
            }
          ],
          [
            {
              text: '年龄：40岁',
              style: 'tableTextP5',
              border: [false, false, false, false]
            },
            {
              text: '条形编码号：1021303001447',
              style: 'tableTextP5',
              border: [false, false, false, false]
            }
          ],
          [
            {
              text: '联系电话：13701316656',
              style: 'tableTextP5',
              fillColor: '#F46293',
              border: [false, false, false, false]
            },
            {
              text: '邮箱地址：',
              style: 'tableTextP5',
              fillColor: '#F46293',
              border: [false, false, false, false]
            }
          ],
          [
            {
              text: '家族遗传病史：无',
              style: 'tableTextP5',
              colSpan: 2,
              border: [false, false, false, false]
            },
            {}
          ],
          [
            {
              text: '有无良/恶性肿瘤病史：无',
              style: 'tableTextP5',
              fillColor: '#F46293',
              colSpan: 2,
              border: [false, false, false, false]
            },
            {}
          ],
          [
            {
              text: '有无长期用药史：无',
              style: 'tableTextP5',
              colSpan: 2,
              border: [false, false, false, false]
            },
            {}
          ],
          [
            {
              text: '样品类型： 口腔拭子',
              style: 'tableTextP5',
              fillColor: '#F46293',
              border: [false, false, false, false]
            },
            {
              text: '检测项目：遗传性肿瘤-女性套餐',
              style: 'tableTextP5',
              fillColor: '#F46293',
              border: [false, false, false, false]
            }
          ],
          [
            {
              text: '送检单位： 个人',
              style: 'tableTextP5',
              border: [false, false, false, false]
            },
            {
              text: '样本采集日期： 2017年02月13日',
              style: 'tableTextP5',
              border: [false, false, false, false]
            }
          ],
          [
            {
              text: '样本接受日期： 2017年02月15日',
              style: 'tableTextP5',
              fillColor: '#F46293',
              border: [false, false, false, false]
            },
            {
              text: '报告日期： 2017年03月30日',
              style: 'tableTextP5',
              fillColor: '#F46293',
              border: [false, false, false, false]
            }
          ]
        ]
      },
      layout: {
        vLineColor: '#F46293',
        hLineColor: '#F46293'
      },
      style: 'tableP5'
    },
    {
      table: {
        widths: ['auto', '*'],
        body: [
          [
            {
              text: '检测信息',
              style: 'tableTextP5',
              fillColor: '#F46293',
              border: [false, false, false, false],
              colSpan: 2
            },
            {}
          ],
          [
            {
              text: '疾病名称',
              style: 'tableTextP5',
              border: [false, false, false, false]
            },
            {
              text: '遗传性乳腺癌和卵巢癌 [HBOC]',
              style: 'tableTextP5',
              border: [false, false, false, false]
            }
          ],
          [
            {
              text: '检测基因',
              style: 'tableTextP5',
              border: [false, true, false, true]
            },
            {
              text: 'BRCA1、BRCA2',
              style: 'tableTextP5',
              border: [false, true, false, true]
            }
          ],
          [
            {
              text: '检测方法',
              style: 'tableTextP5',
              border: [false, false, false, false]
            },
            {
              text: '外显子高通量测序',
              style: 'tableTextP5',
              border: [false, false, false, false]
            }
          ]
        ]
      },
      layout: {
        vLineColor: '#F46293',
        hLineColor: '#F46293'
      },
      style: 'table2P5'
    },
    {
      table: {
        widths: ['*', '*'],
        body: [
          [
            {
              text: '高通量测序参数',
              style: 'tableTextP5',
              fillColor: '#F46293',
              border: [false, false, false, false],
              colSpan: 2
            },
            {}
          ],
          [
            {
              text: '目标基因数',
              style: 'tableTextP5',
              border: [false, false, false, false]
            },
            {
              text: '2',
              style: 'tableTextP5',
              border: [false, false, false, false]
            }
          ],
          [
            {
              text: '目标区长度（bp）',
              style: 'tableTextP5',
              border: [false, true, false, true]
            },
            {
              text: '23716',
              style: 'tableTextP5',
              border: [false, true, false, true]
            }
          ],
          [
            {
              text: '目标区覆盖度',
              style: 'tableTextP5',
              border: [false, false, false, false]
            },
            {
              text: '94.72%',
              style: 'tableTextP5',
              border: [false, false, false, false]
            }
          ],
          [
            {
              text: '目标区平均深度（X）',
              style: 'tableTextP5',
              border: [false, true, false, true]
            },
            {
              text: '39.86',
              style: 'tableTextP5',
              border: [false, true, false, true]
            }
          ],
          [
            {
              text: '目标区平均深度>30X 位点所占比例',
              style: 'tableTextP5',
              border: [false, false, false, false]
            },
            {
              text: '93.1%',
              style: 'tableTextP5',
              border: [false, false, false, false]
            }
          ],
          [
            {
              text: '**本报告只涉及DNA水平，不涉及蛋白，RNA水平。\n' +
              ' **以上结论均为实验室检测数据，仅用于突变检测之目的，不代表最终诊断结果，仅供临床参考。\n' +
              ' **数据解读规则参考ASHG相关指南。\n' +
              ' **变异命名参照HGVS建议的规则给出（http://www.hgvs.org/mutnomen/）。',
              style: 'table3TextP5',
              border: [false, true, false, true],
              colSpan: 2
            },
            {}
          ]
        ]
      },
      layout: {
        vLineColor: '#F46293',
        hLineColor: '#F46293'
      },
      style: 'table3P5',
      pageBreak: 'after'
    },


    // page7
    {
      text: '基因检测结果',
      fontSize: 14,
      color: '#f46293',
      lineHeight: 2
    },
    {
      text: '癌症相关基因突变',
      style: 'smallTitle'
    },
    {
      table: {
        widths: ['auto', 'auto', 70, 'auto', 'auto', 90, 'auto'],
        body: [
          [
            {
              text: '基因',
              style: 'tableHeaderP7',
              fillColor: '#F46293',
              border: [true, false, false, false]
            },
            {
              text: '核苷酸变化',
              style: 'tableHeaderP7',
              fillColor: '#F46293',
              border: [false, false, false, false]
            },
            {
              text: 'ENST号',
              style: 'tableHeaderP7',
              fillColor: '#F46293',
              border: [false, false, false, false]
            },
            {
              text: '氨基酸变化',
              style: 'tableHeaderP7',
              fillColor: '#F46293',
              border: [false, false, false, false]
            },
            {
              text: '基因型',
              style: 'tableHeaderP7',
              fillColor: '#F46293',
              border: [false, false, false, false]
            },
            {
              text: '染色体位置',
              style: 'tableHeaderP7',
              fillColor: '#F46293',
              border: [false, false, false, false]
            },
            {
              text: '致病性分析',
              style: 'tableHeaderP7',
              fillColor: '#F46293',
              border: [false, false, true, false]
            }
          ],
          [
            {
              text: 'BRAC2',
              style: 'tableTextP7',
              fillColor: '#F0F0F0'
            },
            {
              text: 'c.-52A>G',
              style: 'tableTextP7',
              fillColor: '#F0F0F0'
            },
            {
              text: '00000380152',
              style: 'tableTextP7',
              fillColor: '#F0F0F0'
            },
            {
              text: 'afaa',
              style: 'tableTextP7',
              fillColor: '#F0F0F0'
            },
            {
              text: '杂合',
              style: 'tableTextP7',
              fillColor: '#F0F0F0'
            },
            {
              text: 'chr13:32889792 - 32889792',
              style: 'tableTextP7',
              fillColor: '#F0F0F0'
            },
            {
              text: '突变，良性',
              style: 'tableTextP7',
              fillColor: '#F0F0F0'
            }
          ]
        ]
      },
      layout: {
        vLineColor: '#E0E0E0',
        hLineColor: '#E0E0E0'
      },
      style: 'tableP7'
    },
    {
      text: '未知突变基因',
      style: 'smallTitle'
    },
    {
      table: {
        widths: ['auto', 'auto', 70, 'auto', 'auto', 90, 'auto'],
        body: [
          [
            {
              text: '基因',
              style: 'tableHeaderP7',
              fillColor: '#F46293',
              border: [true, false, false, false]
            },
            {
              text: '核苷酸变化',
              style: 'tableHeaderP7',
              fillColor: '#F46293',
              border: [false, false, false, false]
            },
            {
              text: 'ENST号',
              style: 'tableHeaderP7',
              fillColor: '#F46293',
              border: [false, false, false, false]
            },
            {
              text: '氨基酸变化',
              style: 'tableHeaderP7',
              fillColor: '#F46293',
              border: [false, false, false, false]
            },
            {
              text: '基因型',
              style: 'tableHeaderP7',
              fillColor: '#F46293',
              border: [false, false, false, false]
            },
            {
              text: '染色体位置',
              style: 'tableHeaderP7',
              fillColor: '#F46293',
              border: [false, false, false, false]
            },
            {
              text: '致病性分析',
              style: 'tableHeaderP7',
              fillColor: '#F46293',
              border: [false, false, true, false]
            }
          ],
          [
            {
              text: 'BRAC2',
              style: 'tableTextP7',
              fillColor: '#F0F0F0'
            },
            {
              text: 'c.-52A>G',
              style: 'tableTextP7',
              fillColor: '#F0F0F0'
            },
            {
              text: '00000380152',
              style: 'tableTextP7',
              fillColor: '#F0F0F0'
            },
            {
              text: 'afaa',
              style: 'tableTextP7',
              fillColor: '#F0F0F0'
            },
            {
              text: '杂合',
              style: 'tableTextP7',
              fillColor: '#F0F0F0'
            },
            {
              text: 'chr13:32889792 - 32889792',
              style: 'tableTextP7',
              fillColor: '#F0F0F0'
            },
            {
              text: '突变，良性',
              style: 'tableTextP7',
              fillColor: '#F0F0F0'
            }
          ]
        ]
      },
      layout: {
        vLineColor: '#E0E0E0',
        hLineColor: '#E0E0E0'
      },
      style: 'tableP7'
    },
    {
      text: '相关基因解读',
      style: 'smallTitle'
    },
    {
      text: 'BRCA1',
      fontSize: 10.5,
      margin: [0, 10, 0, 10],
      color: 'purple'
    },
    {
      text: 'BRCA1基因是一个抑癌基因，位于人的第17号染色体，在1990年由Hall等人首次发现，并认为其与家族性乳腺癌密切相关。后期研究发现，当它发生' +
      '突变时，患乳腺癌和卵巢癌的高达80%和40%。',
      fontSize: 10.5,
      lineHeight: 1.5
    },
    {
      text: 'BRCA2',
      fontSize: 10.5,
      margin: [0, 10, 0, 10],
      color: 'purple'
    },
    {
      text: 'BRCA2基因于1994年由Michael Stratton等人发现，位于人的第13号染色体，与BRCA1一起为乳腺癌、卵巢癌相关性最强的两个基因。当发生有害' +
      '变异后患乳腺癌和卵巢癌的风险高达70%和18%。',
      fontSize: 10.5,
      lineHeight: 1.5
    },
    {
      text: '附录1 遗传性乳腺癌-卵巢癌综合征',
      style: 'fuLu',
      pageBreak: 'before'
    },
    {
      columns: [
        {
          image: 'img/intro.png',
          width: 12,
          height: 12,
          margin: [0, 3, 0, 0]
        },
        {
          text: '疾病介绍',
          style: 'fuLuTitle'
        }
      ]
    },
    {
      text: '遗传性乳腺癌卵巢癌综合征（HBOCS）是一种常染色体显性遗传性的癌症易感性综合征，遗传外显特性多变。HBOCS的一个重要特征是发病年龄早，已' +
      '证实与HBOCS根据其定义，该综合征表现为：在有乳腺癌倾向的家族中，乳腺癌患者或其一、二级血亲中有两个或两个以上的卵巢癌患者，并有以下临床特点：' +
      '（1）家族中乳腺癌多呈早发表现，一般发病年龄<50岁;（2）家族中卵巢癌患者发病年龄也较早，一般为49.6～55.3岁，平均52.4岁(散发性卵巢癌的发病年' +
      '龄平均为59岁);（3）家族中可有其他类型肿瘤患者，如黑色素瘤、前列腺癌、胰腺癌等;（4）家族中同一系多代人患有乳腺癌和（或）卵巢癌，例如祖母及姑' +
      '姑均患有这些癌症；（5）卵巢癌的病理类型以浆液性乳头状囊腺癌为多见。',
      fontSize: 10.5,
      lineHeight: 1.2,
      margin: [0, 0, 0, 10]
    },
    {
      columns: [
        {
          image: 'img/advise.png',
          width: 12,
          height: 12,
          margin: [0, 3, 0, 0]
        },
        {
          text: '预防建议',
          style: 'fuLuTitle'
        }
      ]
    },
    {
      text: '对于有BRCA1和（或）BRCA2基因突变的女性家族成员而言：',
      style: 'adviceTitle'
    },
    {
      ol: [
        '从18岁起，每月应进行乳腺自查。',
        '从25岁起，每年由专业临床医师进行乳腺检查。',
        '从25岁起，每年进行双侧乳腺核磁共振（MRI）检查。',
        '从30岁起，每6个月交替进行双侧乳腺MRI或X线检查。',
        '从30岁起，每6个月进行骨盆检查、经阴道彩超检查以及血CA-125检查。（需要指出的是，多数卵巢癌在早期不易被筛查）。',
        '建议40岁后或完成生育后，进行预防性输卵管-卵巢切除术。',
        '建立良好的生活方式，调整好生活节奏，保持心情舒畅；坚持体育锻炼，积极参加社交活动，避免和减少精神、心理紧张因素，保持心态平和。',
        '养成良好的饮食习惯。儿童发育期减少摄入过量的高蛋白和低纤维饮食；青春期不要大量摄入脂肪和动物蛋白，加强身体锻炼；平时养成不过量摄入肉类、' +
        '煎蛋、黄油、奶酪、甜食等饮食习惯，少食腌、熏、炸、烤食品，增加食用新鲜蔬菜、水果、维生素、胡萝卜素、橄榄油、鱼、豆类制品等。',
        '不乱用外源性雌激素。若存在需要雌激素治疗时，需在专业医师指导下合理使用。',
        '远离环境污染。如放射线暴露、电离辐射、环境污染物等'
      ],
      fontSize: 10.5,
      lineHeight: 1.2,
      margin: [0, 0, 0, 16]
    },
    {
      text: '对于男性家族成员而言：',
      style: 'adviceTitle'
    },
    {
      ol: [
        '从30岁起，每月应进行乳腺自查。',
        '从30岁起，每年由专业临床医师进行乳腺检查。',
        '对BRCA2基因突变的男性，若存在男性乳房发育（青春期或成年后乳腺组织膨大）或乳腺X线光片显示乳腺较大，35岁起做基础乳腺X检查。',
        '从40岁起，每年直肠指诊及血前列腺特异性抗体以筛查前列腺癌。'
      ],
      fontSize: 10.5,
      lineHeight: 1.2,
      margin: [0, 0, 0, 16]
    },
    {
      text: '附录2 外显子高通量测序及生物信息分析流程',
      style: 'fuLu',
      pageBreak: 'before'
    },
    {
      text: '此报告数据获得及解读主要包含生物样本处理及生物信息分析两部分，如下图所示。',
      fontSize: 10,
      lineHeight: 1.5
    },
    {
      image: 'img/photo3.png',
      width: 415.3,
      height: 162.5
    },
    {
      text: '图 1 分析概览',
      style: 'photoName'
    },
    {
      ol: [
        [
          {
            text: '生物样本处理',
            style: 'list',
            margin: [0, 20, 0, 0]
          },
          {
            ul: [
              '样本收集，提取DNA;',
              '将基因组DNA随机打断成随机片段文库;',
              '文库经纯化后通过与外显子捕获系统进行杂交富集;',
              'PCR扩增，在经qPCR质量合格后，即可上机进行高通量测序;'
            ],
            style: 'list'
          },
          {
            image: 'img/photo2.png',
            width: 287.8,
            height: 333.75,
            margin: [60, 0, 0, 0],
            pageBreak: 'before'
          },
          {
            text: '图 2 生物样本处理流程',
            style: 'photoName'
          }
        ],
        [
          {
            text: '生物信息分析流程',
            style: 'list',
            margin: [0, 20, 0, 0]
          },
          {
            ul: [
              '序列质量分析:检查测序的文件的相关质量，包括每个位置的碱基测序质量，每条序列的测序质量，GC含量等。如果存在太多的低质量的序列，需要重新做实验;',
              '去除接头和低质量的碱基：在进行正式的序列比对前，需要进行接头的去除，低质量的序列的过滤;',
              '序列比对：使用比对软件快速的将短序列比对到人类基因组（本分析参考hg19版本） ;',
              '评估和分析比对结果，进行SNV 和 INDEL检测;',
              '借助相关数据库，进行SNV 和 INDEL注释;',
              '医学根据分析结果和参考相关文献，给出最终结果。'
            ],
            style: 'list'
          },
          {
            image: 'img/photo1.png',
            width: 395.6,
            height: 455.1
          },
          {
            text: '图 3 生物信息分析流程',
            style: 'photoName'
          }
        ],
        [
          {
            text: '局限性',
            style: 'list',
            margin: [0, 20, 0, 0]
          },
          {
            ul: [
              '本检测只针对已知的与疾病相关的基因，一些功能尚未明确的基因不在检测范围内。为保证结果的准确性，目标区域内，覆盖度过低的变异被去除。',
              '该方法可以发现目标基因小片段插入缺失突变，但是对大片段缺失、重复及结构变异为涉及；此外，基因调控区及深度内含子区可能存在的致病性变异无法检测。'
            ],
            style: 'list'
          }
        ]
      ]
    },
    {
      text: '参考文献',
      fontSize: 14,
      color: '#ff7e79',
      lineHeight: 2,
      pageBreak: 'before'
    },
    {
      ol: [
        'Quiles, F., Menéndez, M., Tornero, E. et al. Investigating the effect of 28 BRCA1 and BRCA2 mutations on ' +
        'their related transcribed mRNA. Breast Cancer Res Treat (2016) 155: 253.1',
        'King MC, Marks JH, Mandell JB, New York Breast Cancer Study Group. Breast and ovarian cancer risks due to ' +
        'inherited mutations in BRCA1 and BRCA2. Science. 2003 Oct 24; 302(5645):643-6.',
        'Bermejo-Pérez MJ, Márquez-Calderón S, Llanos-Méndez A. Effectiveness of preventive interventions in BRCA1/2 ' +
        'gene mutation carriers: a systematic review. Int J Cancer. 2007 Jul 15; 121(2):225-31.',
        'De Leeneer K, Coene I, Poppe B, De Paepe A, Claes K. Rapid and sensitive detection of BRCA1/2 mutations in ' +
        'a diagnostic setting: comparison of two high-resolution melting platforms. Clin Chem. 2008 Jun; 54(6):982-9.',
        'Mattocks CJ, Watkins G, Ward D, Janssens T, Bosgoed EA, van der Donk K, Ligtenberg MJ, Pot B, Theelen J, ' +
        'Cross NC, Scheffer H, Matthijs G. Interlaboratory diagnostic validation of conformation-sensitive capillary ' +
        'electrophoresis for mutation scanning. Clin Chem. 2010 Apr; 56(4):593-602.',
        'Morgan JE, Carr IM, Sheridan E, Chu CE, Hayward B, Camm N, Lindsay HA, Mattocks CJ, Markham AF, Bonthron ' +
        'DT, Taylor GR. Genetic diagnosis of familial breast cancer using clonal sequencing. Hum Mutat. 2010 Apr; ' +
        '31(4):484-91.',
        'Thompson JF, Reifenberger JG, Giladi E, Kerouac K, Gill J, Hansen E, Kahvejian A, Kapranov P, Knope T, ' +
        'Lipson D, Steinmann KE, Milos PM. Single-step capture and sequencing of natural DNA for detection of ' +
        'BRCA1 mutations. Genome Res. 2012 Feb; 22(2):340-5.',
        'Palmero EI, Alemar B, et al. Screening for germline BRCA1, BRCA2, TP53 and CHEK2 mutations in families ' +
        'at-risk for hereditary breast cancer identified in a population-based study from Southern Brazil. Genet ' +
        'Mol Biol. 2016 May 24;39(2):210-22.',
        'Felix GE, et al. Germline mutations in BRCA1, BRCA2, CHEK2 and TP53 in patients at high-risk for HBOC: ' +
        'characterizing a Northeast Brazilian Population. Hum Genome Var. 2014 Oct 16; 1():14012.',
        'Ewald IP, et al. Prevalence of the BRCA1 founder mutation c.5266dupin Brazilian individuals at-risk for ' +
        'the hereditary breast and ovarian cancer syndrome. Hered Cancer Clin Pract. 2011 Dec 20; 9():12.',
        'Johnson N, et al. Counting potentially functional variants in BRCA1, BRCA2 and ATM predicts breast cancer ' +
        'susceptibility. Hum Mol Genet. 2007 May 1;16(9):1051-7.',
        'Healey CS, et al. A common variant in BRCA2 is associated with both breast cancer risk and prenatal ' +
        'viability. Nat Genet. 2000 Nov;26(3):362-4.',
        'Hasan TN, et al. Lack of association of BRCA1 and BRCA2 variants with breast cancer in an ethnic ' +
        'population of Saudi Arabia, an emerging high-risk area. Asian Pac J Cancer Prev. 2013;14(10):5671-4.',
        'Tian CQ, et al. Assessment of the Prognostic Value of Two Common Variants of BRCA1 and BRCA2 Genes in ' +
        'Ovarian Cancer Patients Treated with Cisplatin and Paclitaxel: A Gynecologic Oncology Group Study. Front ' +
        'Oncol. 2013 Aug 12;3:206.',
        'Agalliu I, et al. Genetic variation in DNA repair genes and prostate cancer risk: results from a ' +
        'population-based study. Cancer Causes Control. 2010 Feb;21(2):289-300.'
      ],
      fontSize: 10.5,
      lineHeight: 1
    },
    {
      columns: [
        [
          {
            image: 'img/logo0.png',
            width: 86.2,
            height: 22.91
          },
          {
            text: '索·微·求·真',
            fontSize: 12,
            bold: true,
            margin: [6, 0, 0, 0]
          },
          {
            image: 'img/ewm.png',
            width: 67.87,
            height: 73.9,
            margin: [8, 8, 0, 0]
          }
        ],
        [
          {
            text: '北京索真医学检验所有限公司',
            bold: true,
            fontSize: 10.5,
            lineHeight: 1,
            margin: [-50, 10, 0, 20]
          },
          {
            text: '地址：北京市经济技术开发区科创六街88号生物医药园A1-2层\r\n电话：010-56315456\r\n网站: www.thorgene.com',
            fontSize: 9,
            bold: true,
            lineHeight: 1.5,
            margin: [-50, 0, 0, 0]
          }
        ]
      ],
      margin: [50, 500, 0, 0],
      pageBreak: 'before'
    }
  ],
  styles: {
    coverTitle: {
      alignment: 'center',
      fontSize: 22,
      bold: true,
      margin: [0, 100, 0, 0],
      width: 300
    },
    coverTitleEn: {
      fontSize: 11
    },
    coverInfo: {
      margin: [130, 140, 0, 0]
    },
    infoItem: {
      fontSize: 14,
      alignment: 'left',
      margin: [0, 4]
    },
    userInfo: {
      fontSize: 11,
      decoration: 'underline',
      lineHeight: 1.2
    },
    coverBottom: {
      margin: [0, 200, 0, 0]
    },
    BotItem: {
      fontSize: 10.5,
      alignment: 'left'
    },
    ItemInfo: {
      fontSize: 10.5,
      decoration: 'underline',
      lineHeight: 1.2
    },
    p2Content: {
      color: '#0D203F',
      fontSize: 14,
      lineHeight: 1.6,
      bold: true
    },
    p3Content: {
      fontSize: 12,
      lineHeight: 1.5,
      margin: [0, 2]
    },
    tableP4: {
      margin: [0, 24, 0, 20],
      alignment: 'center',
      fontSize: 10.5
    },
    tableTextP4: {
      margin: [0, 10, 0, 10]
    },
    tableP5: {
      margin: [0, 10, 0, 0],
      alignment: 'left',
      fontSize: 12
    },
    tableTextP5: {
      margin: [5, 6, 0, 6]
    },
    table2P5: {
      margin: [0, 0, 0, 0],
      alignment: 'center',
      fontSize: 12
    },
    table3P5: {
      margin: [0, 0, 0, 0],
      alignment: 'center',
      fontSize: 12
    },
    table3TextP5: {
      alignment: 'left',
      lineHeight: 2,
      margin: [10, 0, 0, 0]
    },
    tableP7: {
      alignment: 'center',
      fontSize: 9,
      margin: [0, 0, 0, 20]
    },
    tableHeaderP7: {
      margin: [0, 10, 0, 10]
    },
    tableTextP7: {
      alignment: 'left',
      wordBreak: 'break-all',
      margin: [2, 10, 0, 2],
      lineHeight: 1.5
    },
    smallTitle: {
      fontSize: 10.5,
      lineHeight: 2,
      color: '#f46293'
    },
    adviceTitle: {
      fontSize: 10.5,
      lineHeight: 1.2,
      margin: [20, 0, 0, 6]
    },
    fuLuTitle: {
      fontSize: 12,
      color: '#ff7e79',
      lineHeight: 2,
      margin: [10, 0, 0, 0]
    },
    fuLu: {
      fontSize: 14,
      color: '#ff7e79',
      lineHeight: 2
    },
    list: {
      fontSize: 10,
      lineHeight: 2
    },
    photoName: {
      alignment: 'center',
      fontSize: 9,
      margin: [0, 6, 0, 10]
    }
  }
};

var doc = new Printer({
  Roboto: {
    normal: '../fonts/PingFang Regular.ttf',
    bold: '../fonts/PingFang Medium.ttf',
    italics: '../fonts/PingFang-Light.ttf',
    bolditalics: '../fonts/PingFang-Bold.ttf'
  }
}).createPdfKitDocument(dd);
doc.pipe(fs.createWriteStream('femaleCancer.pdf'));
doc.end();