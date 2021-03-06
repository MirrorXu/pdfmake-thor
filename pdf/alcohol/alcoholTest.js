/**
 * Created by chao.z on 17/12/15.
 */
/* eslint-disable */
const fs = require('fs');
var alcoholTest = require('./alcohol');
var data1 = {
  plan: null,
  info: {
    rank: 3,
    populate: 95.85,
    result: [
      {
        genotype: 'AA',
        rank: 1
      },
      {
        genotype: 'GG',
        rank: 1
      }
    ]
  },
  checkerName: '莫',
  phenotypeId: '64',
  phenotypeName: '酒精代谢能力',
  productId: 1,
  productName: '酒精代谢能力基因检测',
  sampleNo: 10150082342376,
  activateTime: '2017-09-13',
  companyAddr: 'ewefdj',
  subCompanyAddr: null,
  sales: null,
  meetingNo: null,
  checker: {
    name: '莫',
    sex: 0,
    sexLabel: '男',
    age: 2
  }
};
var data2 = {
  "reportId":928,
  "dataObj":{
    "plan":null,
    "info":{
      "rank":4,
      "populate":"4.08",
      "resultSummary":"您的酒精代谢能力极弱。稍微喝一点酒就脸红心跳，酒精代谢过慢会严重影响身体健康。在酒桌上最好只吃饭不喝酒，如遇劝酒可出示此报告。",
      "principle":"酒的主要成分是乙醇，90%以上的乙醇通过肝脏代谢。乙醇首先在乙醇脱氢酶（ADH1B）的作用下将乙醇代谢为乙醛，再由乙醛脱氢酶（ALDH2）代谢为乙酸。整个过程中，乙醛脱氢酶最为关键，活性高低主要与遗传有关，不同基因型乙醛脱氢酶的活力不同，酒精的代谢能力也不同。",
      "advise":"除去遗传，酒精代谢仍受多个因素影响，包括种族、性别以及体重等。无论酒精代谢能力强弱，都应该适度饮酒，过量的酒精摄入会对身体健康造成伤害，增加食道癌、糖尿病、心绞痛、冠心病等疾病的风险。",
      "result":[
        {
          "genotype":"GG",
          "rank":2,
          "picUrl":""
        },
        {
          "genotype":"AA",
          "rank":2,
          "picUrl":""
        }
      ]
    },
    "extInfos":[
      {
        "id":80,
        "name":"口腔/咽喉癌",
        "enName":"Oral/Throat Cancers",
        "fullName":"口腔/咽喉癌风险",
        "label":"正常",
        "result":"风险正常",
        "status":0,
        "summary":"口腔和咽喉癌是指除外鼻咽癌,发生于唇、舌、牙龈、口底、下颚、腮腺、唾液腺、扁桃腺、口咽、梨状窝、下咽,以及唇、口腔和咽中及" +
        "其他不明确部位的恶性肿瘤。临床表现为声音沙哑、咽喉异常感、吞咽疼痛久治不愈、血痰、吞咽困难、呼吸困难和颈淋巴肿大等。\n口腔癌和咽" +
        "喉癌是世界范围内最常见的恶性肿瘤之一。在发展中国家，口腔与咽癌位居男性恶性肿瘤的第3位，女性恶性肿瘤的第4位。引发咽喉癌的主要有化" +
        "学致癌物、物理致癌物和生物致癌因素。\n1.化学致癌物，尼古丁、乙醇可作为致癌物的溶剂,促使致癌物进入舌黏膜。\n2.物理致癌因素，不合" +
        "适的牙托、义齿、 龋齿、残缺的牙嵴等,不良的口腔卫生习惯,长期机械性损伤, 经常卡鱼刺、骨头等。\n3.生物致癌因素，人乳头状瘤病" +
        "毒、遗传、个体易感性、营养代谢障碍、种族及放射线等。","advise":"1. 建议您尽量戒除烟酒嗜好。研究显示，烟草和饮酒是口腔和咽喉" +
      "癌的重要致病因素，发病风险与吸烟量和饮酒量呈正相关，吸烟和饮酒可单独也可协同起作用。\n2. 远离化学致癌物质。对生产过程中的有害气" +
      "体、粉尘，如矽尘、氯氨、溴、碘等需要妥善处理，长期与有害化学气体接触的工作人员，应配戴防毒面具与穿防护隔离衣等。\n3. 防范饮食习" +
      "惯不良。勿过度吃腌菜、酸、辛辣刺激胜食物，禁吃霉变食物，对患有慢性咽喉炎者更为重要。应养成良好的饮食卫生习惯，如少荤多素，多食新" +
      "鲜水果、蔬菜等。\n4. 避免大声叫喊。如发声不当、用嗓过度，可使声带急性充血或出血，感冒期间更需注意。且不可发声过度，注意声带适当" +
      "休息。注意口腔清洁，不使外界不洁之物进入喉腔，免受致病细菌感染引起疾病。\n5. 学会释放压力，避免不良情绪。当今社会节奏较快，各行业" +
      "都感到压力很大。长期的生活、工作压力如果不能有效释放，身心都会受损。很多人不善于交流，又不会自己释放压力，很容易得口腔和咽喉癌或其" +
      "他肿瘤。另外，脾气暴躁，爱生闷气得人也都容易患上恶性肿瘤。","tip":"基因只是影响疾病和其他个体特征的内在因素，外在因素包括" +
      "生活环境和生活方式等。",
        "remark":"*分析结果未见异常并不代表没有疾病，如您有不适症状，请及时到医院就诊。\n*如分析结果中存在中高危风险，不代表已经患有该" +
        "疾病。不要有心理压力，应该针对性的调整生活习惯，积极预防。",
        "genes":{
          "gene":"ADH1B",
          "rsid":"rs1229984",
          "genotype":"GG",
          "summary":"正常",
          "status":0
        },
        "note":"ADH1B基因rs1229984位点的基因型为GG，表示口腔/咽喉癌风险正常。"
      },
      {
        "id":64,
        "name":"食管癌",
        "enName":"Esophageal Cancer",
        "fullName":"食管癌风险",
        "label":"略高",
        "result":"风险略高",
        "status":1,
        "summary":"食管癌是一类发生在食管中的癌症，是常见的消化道肿瘤，全世界每年约有30万人死于食管癌。其发病率和死亡率各国差异很大。我" +
        "国是世界上食管癌高发地区之一，每年平均病死约15万人。男多于女，发病年龄多在40岁以上。其主要分为两种类型：第一类为食管鳞状细" +
        "胞癌（ESCC），由食管上皮细胞癌变引起，主要发生在发展中国家；另一类为食管腺癌（EAC），由食管下部第三节腺细胞癌变引发，患者主要" +
        "分布在发达国家中。\n食管癌早期症状并不明显，当出现症状时，其在食管中的渗透率已达60%，发展为癌症中后期，典型症状为进行性咽下困" +
        "难，先是难咽干的食物，继而是半流质食物，最后水和唾液也不能咽下。","advise":"1. 建立健康生活习惯。食管癌特别是食管鳞癌与不良" +
      "生活习惯密切相关，包括长期吃粗硬食物、热汤、烫粥、烫茶或辣椒之类刺激性食物;或有快吞、咀嚼不细、暴饮暴食等。另外，吸烟和饮酒，以及" +
      "膳食中缺少蔬菜水果、缺少微量营养素和生物活性物质等也可能与食管癌发生相关。因此改变不良饮食习惯，建立健康生活习惯是降低食管癌发生的" +
      "重要因素。\n2. 饮食调节。美国国家癌症研究所指出，提高饮食中十字花科（甘蓝，西兰花/椰菜，花椰菜，布鲁塞尔豆芽）、绿色黄色蔬菜和水" +
      "果比例可以降低食管癌的发病风险。常食用膳食纤维对食管腺癌有重要预防作用。\n3. 改变不良饮食习惯，少吃或不吃霉变食物，多吃蔬菜、增" +
      "加维生素C等。",
        "tip":"基因只是影响疾病和其他个体特征的内在因素，外在因素包括生活环境和生活方式等。",
        "remark":"*分析结果未见异常并不代表没有疾病，如您有不适症状，请及时到医院就诊。\n*如分析结果中存在中高危风险，不代表已经患有该疾病。不要有心理压力，应该针对性的调整生活习惯，积极预防。",
        "genes":{
          "gene":"ALDH2",
          "rsid":"rs671",
          "genotype":"AA",
          "summary":"略高",
          "status":1
        },
        "note":"ALDH2基因rs671位点的基因型为AA，表示食管癌风险略高于正常水平。"
        },
      {
        "id":111,
        "name":"硝酸甘油",
        "enName":"Nitroglycerin",
        "fullName":"硝酸甘油疗效",
        "label":"基本无效",
        "result":"疗效极差",
        "status":-2,
        "summary":"乙醛脱氢酶(ALDH2)同时具有乙醛脱氢酶和酯酶活性,参与乙醇、硝酸甘油等药物的代谢，ALDH2上多态性位点rs671突变可导致所编码蛋白质第504 位的谷氨酸被赖氨酸所取代,携带突变等位基因的个体 ALDH2 酶活性下降,杂合子个体酶活性仅为野生型个体的 10%,突变纯合子个体酶活性缺失。因此,携带 rs671突变位点的个体代谢硝酸甘油的能力下降,硝酸甘油治疗心绞痛的效应减弱。","tip":"","remark":"","genes":{"gene":"ALDH2","rsid":"rs671","genotype":"AA","summary":"基本无效","status":-2},"note":"根据您的检测结果，您的硝酸甘油代谢能力的疗效极差，建议在医生指导下酌情调整用药方案。"}],
    "checkerName":"酒精",
    "productId":1,
    "productName":"酒精代谢能力基因检测",
    "sampleNo":"1016101002664",
    "activateTime":"2017-12-13",
    "companyAddr":null,
    "subCompanyAddr":null,
    "sales":null,
    "meetingNo":null,
    "checker":{
      "headImg":"http://wx.qlogo.cn/mmopen/emrKqqjXAXcrOHGBr5hInynWxxajtEYrGmQwsPkXOjakykspnv2SnNwd5GZzTttl0BLanXw9LuoEAiaubyOUhJOE7eTtEvOl0/0",
      "name":"酒精",
      "sex":1,
      "sexLabel":"女",
      "age":56
    },
    "phenotypes":null,
    "summary":"",
    "reportTime":"2017.12.13",
    "reportInfo":{
        "rank":4,
      "populate":"4.08",
      "resultSummary":"您的酒精代谢能力极弱。稍微喝一点酒就脸红心跳，酒精代谢过慢会严重影响身体健康。在酒桌上最好只吃饭不喝酒，如遇劝酒可出示此报告。",
      "principle":"酒的主要成分是乙醇，90%以上的乙醇通过肝脏代谢。乙醇首先在乙醇脱氢酶（ADH1B）的作用下将乙醇代谢为乙醛，再由乙醛脱氢酶（ALDH2）代谢为乙酸。整个过程中，乙醛脱氢酶最为关键，活性高低主要与遗传有关，不同基因型乙醛脱氢酶的活力不同，酒精的代谢能力也不同。",
      "advise":"除去遗传，酒精代谢仍受多个因素影响，包括种族、性别以及体重等。无论酒精代谢能力强弱，都应该适度饮酒，过量的酒精摄入会对身体健康造成伤害，增加食道癌、糖尿病、心绞痛、冠心病等疾病的风险。",
      "result":[
        {
          "genotype":"GG",
          "rank":2,
          "picUrl":""
        },
        {
          "genotype":"AA",
          "rank":2,
          "picUrl":""
        }
        ]
      },
    "productId1":1
  },
  "rtnUrl":"http://test.api.thorgene.com/mweb-gene-api/admin/pdf-gen-callback",
  "reportType":1
};

var data = {    "plan": null,
  "info": {
    "rank": 1,
    "populate": "73.70",
    "resultSummary": "您的综合酒精代谢能力较强，但空腹喝容易加快酒精吸收。所以您虽是喝酒好手，但空腹喝容易醉，最好在喝酒前吃点菜，才能在酒桌上屹立不倒。",
    "principle": "酒的主要成分是乙醇，90%以上的乙醇通过肝脏代谢。乙醇首先在乙醇脱氢酶（ADH1B）的作用下将乙醇代谢为乙醛，再由乙醛脱氢酶（ALDH2）代谢为乙酸。整个过程中，乙醛脱氢酶最为关键，活性高低主要与遗传有关，不同基因型乙醛脱氢酶的活力不同，酒精的代谢能力也不同。",
    "advise": "除去遗传，酒精代谢仍受多个因素影响，包括种族、性别以及体重等。无论酒精代谢能力强弱，都应该适度饮酒，过量的酒精摄入会对身体健康造成伤害，增加食道癌、糖尿病、心绞痛、冠心病等疾病的风险。",
    "result": [
      {
        "genotype": "AG",
        "rank": 1,
        "picUrl": ""
      },
      {
        "genotype": "GG",
        "rank": 0,
        "picUrl": ""
      }
    ]
  },
  "extInfos": [
    {
      "id": 80,
      "name": "口腔/咽喉癌",
      "enName": "Oral/Throat Cancers",
      "fullName": "口腔/咽喉癌风险",
      "label": "低于正常",
      "result": "低于正常风险",
      "status": -1,
      "summary": "口腔和咽喉癌是指除外鼻咽癌,发生于唇、舌、牙龈、口底、下颚、腮腺、唾液腺、扁桃腺、口咽、梨状窝、下咽,以及唇、口腔和咽中及其他不明确部位的恶性肿瘤。临床表现为声音沙哑、咽喉异常感、吞咽疼痛久治不愈、血痰、吞咽困难、呼吸困难和颈淋巴肿大等。\n口腔癌和咽喉癌是世界范围内最常见的恶性肿瘤之一。在发展中国家，口腔与咽癌位居男性恶性肿瘤的第3位，女性恶性肿瘤的第4位。引发咽喉癌的主要有化学致癌物、物理致癌物和生物致癌因素。\n1.化学致癌物，尼古丁、乙醇可作为致癌物的溶剂,促使致癌物进入舌黏膜。\n2.物理致癌因素，不合适的牙托、义齿、 龋齿、残缺的牙嵴等,不良的口腔卫生习惯,长期机械性损伤, 经常卡鱼刺、骨头等。\n3.生物致癌因素，人乳头状瘤病毒、遗传、个体易感性、营养代谢障碍、种族及放射线等。",
      "advise": "1. 建议您尽量戒除烟酒嗜好。研究显示，烟草和饮酒是口腔和咽喉癌的重要致病因素，发病风险与吸烟量和饮酒量呈正相关，吸烟和饮酒可单独也可协同起作用。\n2. 远离化学致癌物质。对生产过程中的有害气体、粉尘，如矽尘、氯氨、溴、碘等需要妥善处理，长期与有害化学气体接触的工作人员，应配戴防毒面具与穿防护隔离衣等。\n3. 防范饮食习惯不良。勿过度吃腌菜、酸、辛辣刺激胜食物，禁吃霉变食物，对患有慢性咽喉炎者更为重要。应养成良好的饮食卫生习惯，如少荤多素，多食新鲜水果、蔬菜等。\n4. 避免大声叫喊。如发声不当、用嗓过度，可使声带急性充血或出血，感冒期间更需注意。且不可发声过度，注意声带适当休息。注意口腔清洁，不使外界不洁之物进入喉腔，免受致病细菌感染引起疾病。\n5. 学会释放压力，避免不良情绪。当今社会节奏较快，各行业都感到压力很大。长期的生活、工作压力如果不能有效释放，身心都会受损。很多人不善于交流，又不会自己释放压力，很容易得口腔和咽喉癌或其他肿瘤。另外，脾气暴躁，爱生闷气得人也都容易患上恶性肿瘤。",
      "tip": "基因只是影响疾病和其他个体特征的内在因素，外在因素包括生活环境和生活方式等。",
      "remark": "*分析结果未见异常并不代表没有疾病，如您有不适症状，请及时到医院就诊。\n*如分析结果中存在中高危风险，不代表已经患有该疾病。不要有心理压力，应该针对性的调整生活习惯，积极预防。",
      "genes": {
        "gene": "ADH1B",
        "rsid": "rs1229984",
        "genotype": "AG",
        "summary": "低于正常",
        "status": -1
      },
      "note": "ADH1B基因rs1229984位点的基因型为AG，表示口腔/咽喉癌风险低于正常水平。"
    },
    {
      "id": 64,
      "name": "食管癌",
      "enName": "Esophageal Cancer",
      "fullName": "食管癌风险",
      "label": "正常",
      "result": "风险正常",
      "status": 0,
      "summary": "食管癌是一类发生在食管中的癌症，是常见的消化道肿瘤，全世界每年约有30万人死于食管癌。其发病率和死亡率各国差异很大。我国是世界上食管癌高发地区之一，每年平均病死约15万人。男多于女，发病年龄多在40岁以上。其主要分为两种类型：第一类为食管鳞状细胞癌（ESCC），由食管上皮细胞癌变引起，主要发生在发展中国家；另一类为食管腺癌（EAC），由食管下部第三节腺细胞癌变引发，患者主要分布在发达国家中。\n食管癌早期症状并不明显，当出现症状时，其在食管中的渗透率已达60%，发展为癌症中后期，典型症状为进行性咽下困难，先是难咽干的食物，继而是半流质食物，最后水和唾液也不能咽下。",
      "advise": "1. 建立健康生活习惯。食管癌特别是食管鳞癌与不良生活习惯密切相关，包括长期吃粗硬食物、热汤、烫粥、烫茶或辣椒之类刺激性食物;或有快吞、咀嚼不细、暴饮暴食等。另外，吸烟和饮酒，以及膳食中缺少蔬菜水果、缺少微量营养素和生物活性物质等也可能与食管癌发生相关。因此改变不良饮食习惯，建立健康生活习惯是降低食管癌发生的重要因素。\n2. 饮食调节。美国国家癌症研究所指出，提高饮食中十字花科（甘蓝，西兰花/椰菜，花椰菜，布鲁塞尔豆芽）、绿色黄色蔬菜和水果比例可以降低食管癌的发病风险。常食用膳食纤维对食管腺癌有重要预防作用。\n3. 改变不良饮食习惯，少吃或不吃霉变食物，多吃蔬菜、增加维生素C等。",
      "tip": "基因只是影响疾病和其他个体特征的内在因素，外在因素包括生活环境和生活方式等。",
      "remark": "*分析结果未见异常并不代表没有疾病，如您有不适症状，请及时到医院就诊。\n*如分析结果中存在中高危风险，不代表已经患有该疾病。不要有心理压力，应该针对性的调整生活习惯，积极预防。",
      "genes": {
        "gene": "ALDH2",
        "rsid": "rs671",
        "genotype": "GG",
        "summary": "正常",
        "status": 0
      },
      "note": "ALDH2基因rs671位点的基因型为GG，表示食管癌风险正常。"
    },
    {
      "id": 111,
      "name": "硝酸甘油",
      "enName": "Nitroglycerin",
      "fullName": "硝酸甘油疗效",
      "label": "正常",
      "result": "疗效正常",
      "status": 0,
      "summary": "乙醛脱氢酶(ALDH2)同时具有乙醛脱氢酶和酯酶活性,参与乙醇、硝酸甘油等药物的代谢，ALDH2上多态性位点rs671突变可导致所编码蛋白质第504 位的谷氨酸被赖氨酸所取代,携带突变等位基因的个体 ALDH2 酶活性下降,杂合子个体酶活性仅为野生型个体的 10%,突变纯合子个体酶活性缺失。因此,携带 rs671突变位点的个体代谢硝酸甘油的能力下降,硝酸甘油治疗心绞痛的效应减弱。",
      "tip": "",
      "remark": "",
      "genes": {
        "gene": "ALDH2",
        "rsid": "rs671",
        "genotype": "GG",
        "summary": "正常",
        "status": 0
      },
      "note": "根据您的检测结果，您的硝酸甘油代谢能力正常，使用硝酸甘油治疗心绞痛效应较好，可正常使用药物。"
    }
  ],
  "checkerName": "93",
  "productId": 1,
  "productName": "酒精代谢能力基因检测",
  "sampleNo": "1017667002695",
  "activateTime": "2017-12-20",
  "companyAddr": null,
  "subCompanyAddr": null,
  "sales": null,
  "meetingNo": null,
  "checker": {
    "headImg": null,
    "name": "93",
    "sex": 0,
    "sexLabel": "男",
    "age": 78
  },
  "phenotypes": null,
  "summary": "",
  "reportTime": "2017.12.20",
  "reportInfo": {
    "rank": 1,
    "populate": "73.70",
    "resultSummary": "您的综合酒精代谢能力较强，但空腹喝容易加快酒精吸收。所以您虽是喝酒好手，但空腹喝容易醉，最好在喝酒前吃点菜，才能在酒桌上屹立不倒。",
    "principle": "酒的主要成分是乙醇，90%以上的乙醇通过肝脏代谢。乙醇首先在乙醇脱氢酶（ADH1B）的作用下将乙醇代谢为乙醛，再由乙醛脱氢酶（ALDH2）代谢为乙酸。整个过程中，乙醛脱氢酶最为关键，活性高低主要与遗传有关，不同基因型乙醛脱氢酶的活力不同，酒精的代谢能力也不同。",
    "advise": "除去遗传，酒精代谢仍受多个因素影响，包括种族、性别以及体重等。无论酒精代谢能力强弱，都应该适度饮酒，过量的酒精摄入会对身体健康造成伤害，增加食道癌、糖尿病、心绞痛、冠心病等疾病的风险。",
    "result": [
      {
        "genotype": "AG",
        "rank": 1,
        "picUrl": ""
      },
      {
        "genotype": "GG",
        "rank": 0,
        "picUrl": ""
      }
    ]
  },
  "productId1": 1};





const doc = alcoholTest(data);
doc.stream.pipe(fs.createWriteStream(doc.fileName));