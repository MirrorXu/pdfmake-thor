/**
 * Created by work on 17/8/8.
 */
module.exports = {
  nounList: [
    // {
    //   noun: '细胞( Cell )',
    //   desc: '细胞是人类身体的基本结构单位,也是生命活动的基本单位。细胞像是一个海洋,里面有大大小小的船,叫做细胞器,遗传物质(DNA)就藏在名叫细胞核的大船中。'
    // },
    // {
    //   noun: '染色体( Chromosome )',
    //   desc: '染色体位于细胞核中,是高度螺旋化的 DNA。人类有 23 对染色体,包括 22 对常染色体 和一对性染色体,每一对中有一条遗传自父亲,' +
    //   '另一条遗传自母亲。性染色体包括:X 染色 体和 Y 染色体,正常男性的性染色体组成是 XY,女性是 XX。'
    // },
    {
      noun: 'DNA( deoxyribonucleic acid )',
      desc: 'DNA 是人体的遗传物质,中文名:脱氧核糖核酸,为著名的双螺旋结构。构成 DNA 有四种 不同的碱基(腺嘌呤 A、胸腺嘧啶 T、胞嘧啶 C、' +
      '和鸟嘌呤 G),碱基通过不同的排列顺序 来储存信息,就像字母构成单词和句子。'
    },
    {
      noun: '基因( Gene )',
      desc: '基因是有遗传效应的 DNA 片段,可以编码具有特定功能的蛋白质。'
    },
    {
      noun: '蛋白质( Protein )',
      desc: '蛋白质是细胞构成的基础,是其生长和发挥功能的主要物质。蛋白质由 20 种不同的氨基酸 构成。每种氨基酸对应着特定的碱基排列顺序,' +
      '因此基因的 DNA 序列决定了对应的蛋白质 的氨基酸序列,并最终决定了蛋白质的外形和功能。'
    },
    {
      noun: '基因型( Genotype )',
      desc: '人的基因,一半来自母亲,一半来自父亲,比如某个基因位点上来自母亲的是 A,来自父亲 的是 G,则认为该人携带了 AG 基因型。'
    },
    {
      noun: '表现型( Phenotype )',
      desc: '表现型,与基因型是相对的,是指生物发育的某一具体性状。如上例,我们可以说由于携带了 AG 基因型,而产生了有缺陷的酶,引起代谢混乱,' +
      '最终导致疾病。这里的疾病,就是表 现型。基因型、表现型与环境之间的关系,可用后面这个公式来表示:表现型=基因型+环境。'
    },
    {
      noun: '基因多态性( Gene polymorphism )',
      desc: '基因多态性是指人群中在某一基因位点上存在着 2 个或 2 个以上不同等位基因的现象。出 现基因多态性的原因可以是单核苷酸变异,' +
      '或是某些高重复序列的拷贝数变异。比如,一个 人携带的基因型是 CC,另外一个人是 CT,我们就可以认为这个基因位点存在多态性。'
    }
  ],
  products: {
    11: {
      coverTitle: '肿瘤易感基因检测报告',
      SubTitle: 'TM21',
      secondTitle: '常见肿瘤易感基因',
      cover: ['/cover/tm21_1.png', '/cover/tm21_2.png'],
      keys: [{ key: 'tumour', name: '检测结果' }]
    },
    12: {
      coverTitle: '常见疾病基因检测报告',
      SubTitle: '男六项',
      secondTitle: '男性常见疾病易感基因',
      cover: ['/cover/maleSix_1.png', '/cover/maleSix_2.png'],
      keys: [{ key: 'tumour', name: '检测结果汇总' }]
    },
    13: {
      coverTitle: '常见疾病基因检测报告',
      SubTitle: '女六项',
      secondTitle: '女性常见疾病易感基因',
      cover: ['/cover/femaleSix_1.png', '/cover/femaleSix_2.png'],
      keys: [{ key: 'tumour', name: '检测结果汇总' }]
    },
    19: {
      coverTitle: '肿瘤易感基因检测报告',
      SubTitle: '套餐一',
      secondTitle: '常见肿瘤易感基因',
      cover: ['/cover/base1_1.png', '/cover/base12_2.png'],
      keys: [{ key: 'tumour', name: '检测结果汇总' }],
      minimum: true
    },
    20: {
      coverTitle: '肿瘤易感基因测报告',
      SubTitle: '套餐二',
      secondTitle: '常见肿瘤易感基因',
      cover: ['/cover/base2_1.png', '/cover/base12_2.png'],
      keys: [
        { key: 'tumour', name: '检测结果汇总' }]
    },
    21: {
      coverTitle: '肿瘤易感基因测报告',
      SubTitle: '套餐三',
      secondTitle: '常见肿瘤易感基因',
      cover: ['/cover/base3_1.png', '/cover/base12_2.png'],
      keys: [
        { key: 'tumour', name: '肿瘤' },
        { key: 'CCVD', name: '心脑血管疾病' },
        { key: 'metabolicDiseases', name: '代谢疾病' }
      ]
    },
    22: {
      coverTitle: '心脑血管疾病基因检测',
      SubTitle: '套餐一',
      secondTitle: '心脑血管疾病易感基因',
      cover: ['/cover/xn1_1.jpg', '/cover/xn123_2.jpg'],
      keys: [{ key: 'CCVD', name: '检测结果汇总' }]
      // minimum: true
    },
    23: {
      coverTitle: '心脑血管疾病基因检测',
      SubTitle: '套餐二',
      secondTitle: '心脑血管疾病易感基因',
      cover: ['/cover/xn2_1.jpg', '/cover/xn123_2.jpg'],
      keys: [
        { key: 'CCVD', name: '心脑血管疾病' },
        { key: 'metabolicDiseases', name: '代谢疾病' }
      ]
    },
    24: {
      coverTitle: '心脑血管疾病基因检测',
      SubTitle: '套餐三',
      secondTitle: '心脑血管疾病易感基因',
      cover: ['/cover/xn3_1.jpg', '/cover/xn123_2.jpg'],
      keys: [
        { key: 'CCVD', name: '心脑血管疾病' },
        { key: 'metabolicDiseases', name: '代谢疾病' }
      ]
    }
  }
};

// module.exports.CONFIG_DATA = CONFIG_DATA;