/**
 * Created by chao.z on 17/12/14.
 */
/* eslint-disable */
module.exports = function (productTitle, imgUrl, data) {
  return [
    {
      image: __dirname + '/img/logo.png',
      width: 88,
      margin: [-10, 0, 0, 0]
    },
    {
      text: productTitle,
      fontSize: 28,
      width: 595,
      absolutePosition: {x: 60, y: 106},
      color: '#221815',
      alignment: 'center',
      bold: true
    },
    {
      image: __dirname + imgUrl,
      width: 242,
      alignment: 'center',
      marginTop: 160
    },
    {
      text: '个人信息',
      fontSize: 14,
      color: '#221815',
      margin: [113, 100, 0, 0],
      bold: true
    },
    {
      text: '(Personal Details)',
      fontSize: 9,
      color: '#221815',
      margin: [113, 0, 0, 0]
    },
    {
      margin: [108, 20, 0, 0],
      color: '#221815',
      bold: true,
      table: {
        widths: [44, 66, 2, 44, 66],
        body: [
          [
            {text: '姓      名:', style: 'infoTableL', border: [false, false, false, false]},
            {text: data.checker.name || '', style: 'infoTable', border: [false, false, false, true]},
            {text: '', border: [false, false, false, false]},
            {text: '性      别:', style: 'infoTableL', border: [false, false, false, false]},
            {text: data.checker.sexLabel, style: 'infoTable', border: [false, false, false, true]}
          ],
          [
            {text: '年      龄:', style: 'infoTableL', border: [false, false, false, false]},
            {text: data.checker.age || '', style: 'infoTable', border: [false, false, false, true]},
            {text: '', border: [false, false, false, false]},
            {text: '送检日期:', style: 'infoTableL', border: [false, false, false, false]},
            {text: data.activateTime || '', style: 'infoTable', border: [false, false, false, true]}
          ],
          [
            {text: '样本编号:', style: 'infoTableL', border: [false, false, false, false]},
            {text: data.sampleNo || '', style: 'infoTable', colSpan: 4, border: [false, false, false, true]},
            {},
            {},
            {}
          ],
          [
            {text: '送检项目:', style: 'infoTableL', border: [false, false, false, false]},
            {text: data.productName || '', style: 'infoTable', colSpan: 4, border: [false, false, false, true]},
            {},
            {},
            {}
          ],
          [
            {text: '送检单位:', style: 'infoTableL', border: [false, false, false, false]},
            {text: data.companyAddr || '', style: 'infoTable', colSpan: 4, border: [false, false, false, true]},
            {},
            {},
            {}
          ]
        ]
      },
      layout: {
        vLineColor: '#dedcdc',
        hLineColor: '#dedcdc'
      }
    },
    {
      text: '索 真 (北 京) 医 学 科 技 有 限 公 司',
      fontSize: 10,
      bold: true,
      color: '#221815',
      alignment: 'center',
      marginTop: 40,
      pageBreak: 'after',
    }
  ]
};