/**
 * Created by wenxue.z on 2018/2/1.
 */
const co = require('co');
const config = require('config');

const ossConf = config.get('aliOss');
const OSS = require('ali-oss').Wrapper;
const ossClient = new OSS(ossConf.connection);

const vitamin = require('./pdf/vitamin/genExcel');

/* eslint-disable */
const data = {
  reportId: 1387,
  info: {
    'vitamin': {
      'type': 1,
      'items': [
        {
          'phenotypeId': 340,
          'phenotypeName': '高血糖症',
          'isMan': 0,
          'genotypes': [
            {
              'rsid': 'rs560887',
              'gene': 'G6PC2',
              'genotype': 'CC',
              'score': -1,
              'info': '风险增加',
              'frequency': 0.9617,
              'summary': '风险增加'
            }
          ],
          'title': null,
          'score': -1,
          'riskValue': 1,
          'summary': '风险偏高',
          'ratio': 0.1603
        }
      ]
    },
    'mineral': {
      'type': 2,
      'items': [
        {
          'phenotypeId': 363,
          'phenotypeName': '酒精代谢能力',
          'isMan': 0,
          'genotypes': [
            {
              'rsid': 'rs671',
              'gene': 'ALDH2',
              'genotype': 'AA',
              'score': -1,
              'info': '较弱',
              'frequency': 0.0453,
              'summary': '较弱'
            }
          ],
          'title': null,
          'score': -1,
          'riskValue': 1,
          'summary': '较弱',
          'ratio': 0.0533
        }
      ]
    },
    'nutrient': {
      'type': 3,
      'items': [
        {
          'phenotypeId': 345,
          'phenotypeName': '食物摄入量',
          'isMan': 0,
          'genotypes': [
            {
              'rsid': 'rs9939609',
              'gene': 'FTO',
              'genotype': 'AA',
              'score': -1,
              'info': '偏高',
              'frequency': 0.0348,
              'summary': '偏高'
            }
          ],
          'title': null,
          'score': -1,
          'riskValue': 1,
          'summary': '偏高',
          'ratio': 0.0047
        }
      ]
    },
    'HACV': {
      'type': 4,
      'items': [
        {
          'phenotypeId': 1,
          'phenotypeName': '高血压',
          'isMan': 0,
          'genotypes': [
            {
              'rsid': 'rs1378942',
              'gene': 'CSK',
              'genotype': 'AA',
              'score': 0,
              'info': '风险正常',
              'frequency': null,
              'summary': '风险正常'
            },
            {
              'rsid': 'rs5186',
              'gene': 'AGTR1',
              'genotype': 'AA',
              'score': 0,
              'info': '风险正常',
              'frequency': 0.878,
              'summary': '风险正常'
            }
          ],
          'title': null,
          'score': 0,
          'riskValue': 0.694,
          'summary': '风险正常',
          'detail': '你的患病风险正常',
          'ratio': 0.7247
        },
        {
          'phenotypeId': 2,
          'phenotypeName': '冠心病',
          'isMan': 0,
          'genotypes': [
            {
              'rsid': 'rs11556924',
              'gene': 'C3HC1',
              'genotype': 'CC',
              'score': 0,
              'info': '风险正常',
              'frequency': null,
              'summary': '风险正常'
            },
            {
              'rsid': 'rs7412',
              'gene': 'APOE',
              'genotype': 'CC',
              'score': 0,
              'info': '风险正常',
              'frequency': 0.8153,
              'summary': '风险正常'
            }
          ],
          'title': null,
          'score': 0,
          'riskValue': 0.833,
          'summary': '风险正常',
          'detail': '你的患病风险正常',
          'ratio': 0.7684
        }
      ]
    },
    'metabolism': {
      'type': 5,
      'items': [
        {
          'phenotypeId': 57,
          'phenotypeName': '痛风',
          'isMan': 0,
          'genotypes': [
            {
              'rsid': 'rs12498742',
              'gene': 'GLUT9',
              'genotype': 'AA',
              'score': -1,
              'info': '风险增加',
              'frequency': 0.9791,
              'summary': '风险增加'
            }
          ],
          'title': null,
          'score': -1,
          'riskValue': 1,
          'summary': '风险偏高',
          'ratio': 0.219
        }
      ]
    }
  }
}


co(function* () {
  const excelObj = yield vitamin(data);
  const { fileName, stream } = excelObj;
  const obj = yield ossClient.put(`smzg/${fileName}`, stream);
  console.log('上传Excel文件完成', obj.url);
});