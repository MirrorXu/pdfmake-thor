/**
 * Created by chao.z on 18/4/9.
 */
/* eslint-disable */
const percentage = require('../../common/percentage');
module.exports = function(num,data){
  var lrTable = [];
  var tableItem=[];
  if(num === 4) {
    lrTable = [
      [
        {
          text: '基因',
          border: [false, false, false, false],
          alignment: 'center',
          fontSize: 10,
          color: '#fff',
          bold:true,
          margin: [0, 2, 0, 2],
          fillColor: '#7bc0e6'
        },
        {
          text: '位点',
          border: [false, false, false, false],
          alignment: 'center',
          fontSize: 10,
          color: '#fff',
          bold:true,
          margin: [0, 2, 0, 2],
          fillColor: '#7bc0e6'
        },
        {
          text: '突变',
          border: [false, false, false, false],
          alignment: 'center',
          fontSize: 10,
          color: '#fff',
          bold:true,
          margin: [0, 2, 0, 2],
          fillColor: '#7bc0e6'
        },
        {
          text: '突变类型',
          border: [false, false, false, false],
          alignment: 'center',
          fontSize: 10,
          color: '#fff',
          bold:true,
          margin: [0, 2, 0, 2],
          fillColor: '#7bc0e6'
        }
      ]
    ];
    data.forEach(function(item) {
      tableItem =  [
        {
          text: item.gene || '',
          border: [false, false, false, false],
          alignment: 'center',
          fontSize: 10,
          bold:true,
          color: '#231815',
          margin: [0, 2, 0, 2]
        },
        {
          text: item.thid || item.rsid || '',
          border: [false, false, false, false],
          alignment: 'center',
          fontSize: 10,
          color: '#231815',
          bold:true,
          margin: [0, 2, 0, 2]
        },
        {
          text: item.variant1 || '--',
          border: [false, false, false, false],
          alignment: 'center',
          fontSize: 10,
          bold:true,
          color: '#231815',
          margin: [0, 2, 0, 2]
        },
        {
          text: item.analyse || '--',
          border: [false, false, false, false],
          alignment: 'center',
          fontSize: 10,
          bold:true,
          color: '#231815',
          margin: [0, 2, 0, 2]
        },
      ];
      lrTable.push(tableItem);
    });
    return lrTable;
  } else if (num === 5){
    lrTable = [
      [
        {
          text: '基因',
          border: [false, false, false, false],
          alignment: 'center',
          fontSize: 10,
          color: '#fff',
          bold:true,
          margin: [0, 2, 0, 2],
          fillColor: '#7bc0e6'
        },
        {
          text: '位点',
          border: [false, false, false, false],
          alignment: 'center',
          fontSize: 10,
          color: '#fff',
          bold:true,
          margin: [0, 2, 0, 2],
          fillColor: '#7bc0e6'
        },
        {
          text: '基因型',
          border: [false, false, false, false],
          alignment: 'center',
          fontSize: 10,
          color: '#fff',
          bold:true,
          margin: [0, 2, 0, 2],
          fillColor: '#7bc0e6'
        },
        {
          text: '影响',
          border: [false, false, false, false],
          alignment: 'center',
          fontSize: 10,
          color: '#fff',
          bold:true,
          margin: [0, 2, 0, 2],
          fillColor: '#7bc0e6'
        },
        {
          text: '中国人群占比',
          border: [false, false, false, false],
          alignment: 'center',
          fontSize: 10,
          color: '#fff',
          bold:true,
          margin: [0, 2, 0, 2],
          fillColor: '#7bc0e6'
        }
      ]
    ];
    data.forEach(function(item) {
      if (!item.genotype) {
        return null;
      }
      tableItem =  [
        {
          text: item.gene || '',
          border: [false, false, false, false],
          alignment: 'center',
          fontSize: 10,
          bold:true,
          color: '#231815',
          margin: [0, 2, 0, 2]
        },
        {
          text: item.thid || item.rsid || '',
          border: [false, false, false, false],
          alignment: 'center',
          fontSize: 10,
          bold:true,
          color: '#231815',
          margin: [0, 2, 0, 2]
        },
        {
          text: item.genotype || '--',
          border: [false, false, false, false],
          alignment: 'center',
          fontSize: 10,
          bold:true,
          color: '#231815',
          margin: [0, 2, 0, 2]
        },
        {
          text: item.summary || '--',
          border: [false, false, false, false],
          alignment: 'center',
          fontSize: 10,
          bold:true,
          color: '#231815',
          margin: [0, 2, 0, 2]
        },
        {
          text: percentage(item.frequency ? (item.frequency * 100).toFixed(2).toString() : null) || '--',
          border: [false, false, false, false],
          alignment: 'center',
          fontSize: 10,
          bold:true,
          color: '#231815',
          margin: [0, 2, 0, 2]
        }
      ];
      lrTable.push(tableItem);
    });
    return lrTable;
  }
};