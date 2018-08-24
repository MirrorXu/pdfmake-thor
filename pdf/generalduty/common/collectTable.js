/**
 * Created by chao.z on 18/4/23.
 */
/* eslint-disable */
const getTable = (tableArguments, catalogObj) => {
  const borderStyle = [false, false, false, true];
  let groupName = '';
  const groupNameArr = [];
  for (let gIndex = 0; gIndex < tableArguments.listData.length; gIndex++) {
    for (let pIndex = 0; pIndex < tableArguments.listData[gIndex].analysis.length; pIndex++) {
      if (groupName !== (tableArguments.listData[gIndex].groupName || tableArguments.listData[gIndex].tplCategory)) {
        groupName = tableArguments.listData[gIndex].groupName || tableArguments.listData[gIndex].tplCategory;
        groupNameArr.push({ groupName });
      }
      if (tableArguments.listType === 'diseaseRisk') {
        const geneListItem = [
          {
            text: pIndex === 0 ? tableArguments.listData[gIndex].groupName : '',
            style: pIndex === 0 ? 'hzTable' : null,
            border: borderStyle,
            rowSpan: pIndex === 0 ? tableArguments.listData[gIndex].analysis.length : undefined,
            fillColor: tableArguments.ffillColor[groupNameArr.length % 2]
          },
          {
            text: tableArguments.listData[gIndex].analysis[pIndex].phenotypeName,
            style: 'hzTable',
            border: borderStyle,
            fillColor: (pIndex % 2 === 1) ? tableArguments.fillColor : '#f7f8f8'
          },
          {
            text: tableArguments.listData[gIndex].analysis[pIndex].diseaseIncidence || '',
            style: 'hzTable',
            border: borderStyle,
            fillColor: (pIndex % 2 === 1) ? tableArguments.fillColor : '#f7f8f8'
          },
          {
            text: catalogObj[tableArguments.listData[gIndex].analysis[pIndex].phenotypeName] || '',
            style: 'hzTable',
            border: borderStyle,
            fillColor: (pIndex % 2 === 1) ? tableArguments.fillColor : '#f7f8f8'
          }
        ];
        tableArguments.listHeader.push(geneListItem);
      }
      if (tableArguments.listType === 'genericFeature') {
        const geneListItem = [
          {
            text: pIndex === 0 ? tableArguments.listData[gIndex].groupName : '',
            style: pIndex === 0 ? 'hzTable' : null,
            border: borderStyle,
            rowSpan: pIndex === 0 ? tableArguments.listData[gIndex].analysis.length : undefined,
            fillColor: tableArguments.ffillColor[groupNameArr.length % 2]
          },
          {
            text: tableArguments.listData[gIndex].analysis[pIndex].phenotypeName,
            style: 'hzTable',
            border: borderStyle,
            fillColor: (pIndex % 2 === 1) ? tableArguments.fillColor : '#f7f8f8'
          },
          {
            text: tableArguments.listData[gIndex].analysis[pIndex].resultSummary || '',
            style: 'hzTable',
            border: borderStyle,
            fillColor: (pIndex % 2 === 1) ? tableArguments.fillColor : '#f7f8f8'
          },
          {
            text: catalogObj[tableArguments.listData[gIndex].analysis[pIndex].phenotypeName] || '',
            style: 'hzTable',
            border: borderStyle,
            fillColor: (pIndex % 2 === 1) ? tableArguments.fillColor : '#f7f8f8'
          }
        ];
        tableArguments.listHeader.push(geneListItem);
      }
      if (tableArguments.listType === 'drugResponse') {
        const geneListItem = [
          {
            text: pIndex === 0 ? tableArguments.listData[gIndex].tplCategory : '',
            style: pIndex === 0 ? 'hzTable' : null,
            border: borderStyle,
            rowSpan: pIndex === 0 ? tableArguments.listData[gIndex].analysis.length : undefined,
            fillColor: tableArguments.ffillColor[groupNameArr.length % 2]
          },
          {
            text: tableArguments.listData[gIndex].analysis[pIndex].title,
            style: 'hzTable',
            border: borderStyle,
            fillColor: (pIndex % 2 === 1) ? tableArguments.fillColor : '#f7f8f8'
          },
          {
            text: tableArguments.listData[gIndex].analysis[pIndex].goodsName || '',
            style: 'hzTable',
            border: borderStyle,
            fillColor: (pIndex % 2 === 1) ? tableArguments.fillColor : '#f7f8f8'
          },
          {
            text: tableArguments.listData[gIndex].analysis[pIndex].recommendation || '',
            style: 'hzTable',
            border: borderStyle,
            fillColor: (pIndex % 2 === 1) ? tableArguments.fillColor : '#f7f8f8'
          },
          {
            text: catalogObj[tableArguments.listData[gIndex].analysis[pIndex].phenotypeName] || '',
            style: 'hzTable',
            border: borderStyle,
            fillColor: (pIndex % 2 === 1) ? tableArguments.fillColor : '#f7f8f8'
          }
        ];
        tableArguments.listHeader.push(geneListItem);
      }
    }
  }
  const table = {
    dontBreakRows: true,
    widths: tableArguments.widths,
    body: tableArguments.listHeader
  };
  const layout = {
    vLineColor: tableArguments.tableColor,
    hLineColor: tableArguments.tableColor
  };
  return {
    table,
    layout,
    style: 'tableP4'
  };
};

module.exports.generatePdf = (sunmmaryDataItem, catalogObj = {}) => {
  const content = [];
  const geneHeaderDR = [
    [
      {
        text: '分类',
        style: 'hzTable',
        border: [false, true, false, true],
        fillColor: '#439dd7',
        color:'#fff'
      },
      {
        text: '疾病',
        style: 'hzTable',
        border: [false, true, false, true],
        fillColor: '#439dd7',
        color:'#fff'
      },
      {
        text: '人群发病率',
        style: 'hzTable',
        border: [false, true, false, true],
        fillColor: '#439dd7',
        color:'#fff'
      },
      {
        text: '页码',
        style: 'hzTable',
        border: [false, true, false, true],
        fillColor: '#439dd7',
        color:'#fff'
      }
    ]
  ];
  const geneHeaderGF = [
    [
      {
        text: '类别',
        style: 'hzTable',
        border: [false, true, false, true],
        fillColor: '#4c4b9d',
        color:'#fff'
      },
      {
        text: '项目',
        style: 'hzTable',
        border: [false, true, false, true],
        fillColor: '#4c4b9d',
        color:'#fff'
      },
      {
        text: '分析结果',
        style: 'hzTable',
        border: [false, true, false, true],
        fillColor: '#4c4b9d',
        color:'#fff'
      },
      {
        text: '页码',
        style: 'hzTable',
        border: [false, true, false, true],
        fillColor: '#4c4b9d',
        color:'#fff'
      }
    ]
  ];

  const geneHeaderDrugR = [
    [
      {
        text: '类别',
        style: 'hzTable',
        border: [false, true, false, true],
        fillColor: '#f08834',
        color:'#fff'
      },
      {
        text: '药物名称',
        style: 'hzTable',
        border: [false, true, false, true],
        fillColor: '#f08834',
        color:'#fff'
      },
      {
        text: '商品名',
        style: 'hzTable',
        border: [false, true, false, true],
        fillColor: '#f08834',
        color:'#fff'
      },
      {
        text: '用药建议',
        style: 'hzTable',
        border: [false, true, false, true],
        fillColor: '#f08834',
        color:'#fff'
      },
      {
        text: '页码',
        style: 'hzTable',
        border: [false, true, false, true],
        fillColor: '#f08834',
        color:'#fff'
      }
    ]
  ];
  const PART_DICTIONARY = {
    drugResponse: {
      fColor: '#e9eaea',
      ffColor: ['#f7c0a2', '#fad2be'],
      lColor: '#F5F6F6',
      tColor: '#F5F6F6',
      name: '药物反应',
      img: __dirname + '/img/icon2.png'
    },
    genericFeature: {
      fColor: '#e9eaea',
      ffColor: ['#cbcbe5', '#e7e0ef'],
      lColor: '#F5F6F6',
      tColor: '#F5F6F6',
      name: '遗传特征',
      img: __dirname + '/img/icon3.png'
    },
    chronicDisease: {
      fColor: '#e9eaea',
      ffColor: ['#d7eefa', '#c0e5f7'],
      lColor: '#F5F6F6',
      tColor: '#F5F6F6',
      name: '疾病易感风险',
      img: __dirname + '/img/icon4.png'
    }
  };
  const getSummary = (data, catalogObj) => {
    const tableArguments = {
      listData: data.details
    };
    switch (data.chapterName) {
      case '疾病易感风险':
        tableArguments.widths = [115, 120, 100, 100];
        tableArguments.listType = 'diseaseRisk';
        tableArguments.listHeader = geneHeaderDR;
        tableArguments.tableColor = PART_DICTIONARY['chronicDisease'].lColor;
        tableArguments.fillColor = PART_DICTIONARY['chronicDisease'].fColor;
        tableArguments.ffillColor = PART_DICTIONARY['chronicDisease'].ffColor;
        const diseaseRiskTable = getTable(tableArguments, catalogObj);
        content.push(diseaseRiskTable);
        break;
      case '遗传特征':
        tableArguments.widths = [115, 120, 100, 100];
        tableArguments.listType = 'genericFeature';
        tableArguments.listHeader = geneHeaderGF;
        tableArguments.tableColor = PART_DICTIONARY['genericFeature'].lColor;
        tableArguments.fillColor = PART_DICTIONARY['genericFeature'].fColor;
        tableArguments.ffillColor = PART_DICTIONARY['genericFeature'].ffColor;
        const genericFeatureTable = getTable(tableArguments, catalogObj);
        content.push(genericFeatureTable);
        break;
      case '药物反应':
        tableArguments.widths = [90, 90, 90, 95, 60];
        tableArguments.listType = 'drugResponse';
        tableArguments.listHeader = geneHeaderDrugR;
        tableArguments.tableColor = PART_DICTIONARY['drugResponse'].lColor;
        tableArguments.fillColor = PART_DICTIONARY['drugResponse'].fColor;
        tableArguments.ffillColor = PART_DICTIONARY['drugResponse'].ffColor;
        const drugResponseTable = getTable(tableArguments, catalogObj);
        content.push(drugResponseTable);
        break;
      default: {
        break;
      }
    }
  };
  if (sunmmaryDataItem.chapterName !== "综合健康建议") {
    getSummary(sunmmaryDataItem, catalogObj);
  }
  return content;
};