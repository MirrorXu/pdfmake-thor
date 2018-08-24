/**
 * Created by work on 17/4/10.
 */
const fs = require('fs');
const Printer = require('pdfmake');
const data = {
  drug: {
    items: [
      {
        num: '01',
        name: 'A型尼曼-匹克病',
        level: '正常'
      },
      {
        num: '02',
        name: '地中海贫血',
        level: '正常'
      },
      {
        num: '03',
        name: '肢带型肌营养不良2D型',
        level: '正常'
      }
    ]
  }
};
var hzTable = [
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
      text: '等级',
      style: 'hzTable',
      border: [false, true, false, true]
    }
  ]
];
function hzList () {   //eslint-disable-line
  var list = data.drug.items;
  for (var i = 0; i < list.length; i++) {
    var listItem = [
      {
        text: list[i].num,
        style: 'hzTable'
      },
      {
        text: list[i].name,
        style: 'hzTable'
      },
      {
        text: list[i].level,
        style: 'hzTable'
      }
    ];
    hzTable.push(listItem);
  }
  return hzTable;
}

hzList();

const life = {
  pageMargins: [90, 90, 90, 72],
  content: {
    table: {
      dontBreakRows: true,
      widths: ['*', '*', '*'],
      body: hzTable
    }
  },
  styles: {
    drug: {
      fontSize: 14,
      color: '#000'
    },
    hzTable: {
      margin: [0, 3.5, 0, 3.5],
      fontSize: 10.5,
      border: [false, false, false, true],
      fillColor: '#fff0c5'
    }
  }
};

var doc = new Printer({
  Roboto: {
    normal: './fonts/PingFang Regular.ttf',
    bold: './fonts/PingFang Medium.ttf',
    italics: './fonts/PingFang-Light.ttf',
    bolditalics: './fonts/PingFang-Bold.ttf'
  }
}).createPdfKitDocument(life);
doc.pipe(fs.createWriteStream('life.pdf'));
doc.end();