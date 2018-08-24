/**
 * Created by wenxue.z on 2018/2/1.
 */
const XLSX = require('node-xlsx');

const helper = require('../../lib/helper');
const apiModel = require('../../models/app');
const baseModel = require('../../models/smzg');

const Report = apiModel.Report;
const SampleOwner = apiModel.SampleOwner;

const BaseBookshelf = baseModel.Bookshelf;
const Vitamin = baseModel.Vitamin;
const Goods = apiModel.Goods;
// const Genotype = baseModel.Genotype;


function* getGoods(goodsId) {
  return yield new Goods({ id: goodsId }).fetch();
}

function getCorrectAmount(score, amount) {
  // const random = Math.floor(Math.random() * Math.floor(2)); // 0, 1
  const amountCorrect = amount;
  if (score === -1) {  // high 1.1, 1.2
    // amountCorrect = amount * (1.1 + (random / 10));
    // amountCorrect = amount * 1.15;
  } else if (score === 1) {  // low 0.8, 0.9
    // amountCorrect = amount * (0.8 + (random / 10));
    // amountCorrect = amount * 0.85;
  }
  return amountCorrect.toFixed(2);
}

/**
 * 获取等位基因类型
 * @param rsidArr
 * @returns {{}}
 */
function* getGenes(rsidArr) {
  const geneMap = {};
  const sql = 'select rsid, CONCAT_WS("/",allel1,allel2) as allel from genotype where allel1 != allel2 and rsid in (?)';
  const resultsTotal = yield BaseBookshelf.knex.raw(sql, [rsidArr]);

  for (const allelObj of resultsTotal[0]) {
    geneMap[allelObj.rsid] = allelObj.allel;
  }

  return geneMap;
}
/**
 * 获取检测人信息
 * @param reportId
 */
function* getSampleOwnerInfo(reportId) {
  const report = yield new Report({ id: reportId }).fetch({ withRelated: 'sample' });
  if (!report) { return null; }

  const sample = report.related('sample');
  const ownerId = sample.get('owner_id');
  const owner = yield new SampleOwner({ id: ownerId }).fetch();

  return {
    name: owner.get('name'),
    sex: owner.get('sex'),
    birthday: owner.get('birthday'),
    age: helper.getAge(owner.get('birthday')),
    phone: owner.get('phone_no'),
    activateTime: helper.dateToString(sample.get('activate_time'))
  };
}

function getData0(sampleOwner) {
  const sexStr = sampleOwner.sex ? '女' : '男';  // 0: 男, 1: 女
  const data = [['信息', '内容']];
  data.push(['姓名', sampleOwner.name]);
  data.push(['性别', sexStr]);
  data.push(['年龄', sampleOwner.age]);
  data.push(['手机号码', sampleOwner.phone]);
  data.push(['检测时间', sampleOwner.activateTime]);
  data.push(['订单号', '']);
  return { name: '0、基础信息', data };
}

// function* getGeneRatio(rsid, allel) {
//   const allel1 = allel[0];
//   const allel2 = allel[1];
//   const genotype = yield new Genotype({ allel1, allel2, rsid }).fetch();
//   if (!genotype) {
//     return '';
//   }
//   return genotype.get('frequency') ? (genotype.get('frequency') * 100) : '';
// }

function* getData45(sheetName, reportData) {
  const data = [['检测项目',	'基因名称', '位点编码', '等位基因类型', '基因型', '影响/等级', '基因型人群占比%', '结果', '结论', '结论人群占比%']];

  const datas = reportData.items;

  const phenotypeIds = [];
  const genotypeMap = {};
  const rsidArr = [];
  datas.forEach(obj => {
    phenotypeIds.push(obj.phenotypeId);
    genotypeMap[obj.phenotypeId] = obj.genotypes;
    if (obj.genotypes) {
      obj.genotypes.forEach(item => {
        rsidArr.push(item.rsid);
      });
    }
  });

  const geneMap = yield getGenes(rsidArr);

  for (const obj of datas) {
    // const phenotypeName = obj.title ? obj.title : '';
    const phenotypeName = obj.phenotypeName;
    const score = obj.score;
    const ratio = obj.ratio ? (obj.ratio * 100) : '';

    let summary = null;
    let resultStr = null;
    switch (score) {
      case 1:
        summary = `${phenotypeName}风险偏低`;
        resultStr = '风险偏低';
        break;
      case 0:
        summary = `${phenotypeName}风险一般`;
        resultStr = '风险一般';
        break;
      default:
        summary = `${phenotypeName}风险偏高`;
        resultStr = '风险偏高';
    }

    // obj.genotypes.forEach(item => {
    for (const item of obj.genotypes) {
      const geneName = item.gene;
      const rsid = item.rsid;
      const genoAllName = geneMap[rsid];
      // const thid = item.thid;
      const genotype = item.genotype;
      const info = item.info;
      // const geneRatio = yield getGeneRatio(rsid, genotype);
      const geneRatio = item.frequency ? (item.frequency * 100) : '';

      data.push([
        phenotypeName,
        geneName,
        rsid,
        // thid,
        genoAllName,
        genotype,
        info,
        geneRatio,  // 基因型人群占比%
        resultStr,  // 结果
        summary,    // 结论
        ratio       // 结论人群占比%
      ]);
    }
  }

  return { name: sheetName, data };
}

function* getData(sheetName, results, rpeortData) {
  const data = [['检测项目',	'基因名称', '位点编码', '等位基因类型', '基因型', '影响/等级', '均衡膳食供给量', '结果', '结论', '个体需求量']];

  const datas = rpeortData.items;
  const isman = results.sex;  // 0: 男, 1: 女
  const age = results.age;

  const phenotypeIds = [];
  const genotypeMap = {};
  const rsidArr = [];
  datas.forEach(obj => {
    phenotypeIds.push(obj.phenotypeId);
    genotypeMap[obj.phenotypeId] = obj.genotypes;
    if (obj.genotypes) {
      obj.genotypes.forEach(item => {
        rsidArr.push(item.rsid);
      });
    }
  });

  const geneMap = yield getGenes(rsidArr);

  for (const obj of datas) {
    const phenotypeName = obj.title;
    const score = obj.score;

    // 推荐量
    let amount = '';
    const result = yield Vitamin.query(qb => {
      qb.where('phenotype_id', obj.phenotypeId);
      // qb.andWhere('isman', isman);
      qb.andWhere('sex', isman);
      qb.andWhere('age', '<=', age);
      qb.orderBy('age', 'DESC');
      qb.limit(1);
    }).fetchAll();
    if (result.models.length === 1) {
      amount = result.models[0].get('amount');
      amount = getCorrectAmount(score, amount);
    }

    let summary = null;
    let resultStr = null;
    switch (score) {
      case 1:
        summary = `${phenotypeName}需求偏低`;
        resultStr = '需求偏低';
        break;
      case 0:
        summary = `${phenotypeName}需求正常`;
        resultStr = '需求正常';
        break;
      default:
        summary = `${phenotypeName}需求偏高`;
        resultStr = '需求偏高';
    }


    obj.genotypes.forEach(item => {
      const geneName = item.gene;
      const rsid = item.rsid;
      const genoAllName = geneMap[rsid];
      // const thid = item.thid;
      const genotype = item.genotype;
      const info = item.info;

      const unit = obj.phenotypeId === 190 ? 'μg' : 'mg';
      const unitAmount = '';  // 个体需求量

      data.push([
        phenotypeName,
        geneName,
        rsid,
        genoAllName,
        genotype,
        info,
        amount ? `${amount}${unit}` : '',
        resultStr,
        summary,
        unitAmount
      ]);
    });
  }

  return { name: sheetName, data };
}

// 生成
module.exports = function* (msgObj, ruleId) {
  // console.log('维他客产品-msgObj: ', JSON.stringify(msgObj));
  const reportId = msgObj.reportId;  // normal
  const dataObj = msgObj.dataObj;
  const extraInfo = dataObj.info;
  // const reportId = msgObj.reportId; // test
  // const extraInfo = msgObj.info;

  const vitamin = extraInfo.vitamin;    // 维生素 1
  const mineral = extraInfo.mineral;    // 矿物质 2
  const nutrient = extraInfo.nutrient;  // 功能性营养 3
  const HACV = extraInfo.HACV;          // 心脑血管 4
  const metabolism = extraInfo.metabolism;  // 代谢类 5
  const nowStr = helper.dateToString(new Date());
  const results = {};
  results.models = [];
  const [sampleOwner, goodsObj] = yield [getSampleOwnerInfo(reportId), getGoods(ruleId)];
  let productName = null;
  if (goodsObj) {
    productName = goodsObj.get('name');
  }


  // 1、维生素吸收与代谢检测 vitamin
  // 2、矿物质吸收与代谢检测 mineral
  // 3、功能性营养素吸收与代谢检测 nutrient
  // 4、心脑血管疾病易感基因检测 HACV
  // 5、代谢类疾病易感基因检测 metabolism
  let buffer = null;
  if (ruleId === 56) {
    productName = productName || '维他客营养基因检测';
    const [sheet0, sheet1, sheet2, sheet3] = yield [
      getData0(sampleOwner),
      getData('1、维生素吸收与代谢检测', sampleOwner, vitamin),
      getData('2、矿物质吸收与代谢检测', sampleOwner, mineral),
      getData('3、功能性营养素吸收与代谢检测', sampleOwner, nutrient)
    ];
    buffer = XLSX.build([
      sheet0, sheet1, sheet2, sheet3
    ]);
  } else if (ruleId === 57) {
    productName = productName || '维他客慢病基因检测';
    const [sheet0, sheet1, sheet2] = yield [
      getData0(sampleOwner),
      getData45('1、心脑血管疾病易感基因检测', HACV),
      getData45('2、代谢类疾病易感基因检测', metabolism)
    ];
    buffer = XLSX.build([
      sheet0, sheet1, sheet2
    ]);
  } else {
    productName = productName || '维他客营养和慢病基因检测';
    const [sheet0, sheet1, sheet2, sheet3, sheet4, sheet5] = yield [
      getData0(sampleOwner),
      getData('1、维生素吸收与代谢检测', sampleOwner, vitamin),
      getData('2、矿物质吸收与代谢检测', sampleOwner, mineral),
      getData('3、功能性营养素吸收与代谢检测', sampleOwner, nutrient),
      getData45('4、心脑血管疾病易感基因检测', HACV),
      getData45('5、代谢类疾病易感基因检测', metabolism)
    ];
    buffer = XLSX.build([
      sheet0, sheet1, sheet2, sheet3, sheet4, sheet5
    ]);
  }
  // fileName(日期-姓名-商品名-reportId), stream, totalPage
  const excelFileName = `${nowStr}-${sampleOwner.name}-${productName}-${reportId}.xlsx`;
  return {
    fileName: excelFileName,
    stream: buffer,
    totalPage: 0
  };
};