/**
 * Created by chao.z on 18/4/8.
 */

/* eslint-disable */

const fs = require('fs');

var devnull = require('dev-null');

const Printer = require('pdfmake');

// 模版类型 tplid=6 执行type4模版
const type1 = require('./type1');
const type2 = require('./type2');
const type3 = require('./type3');
const type4 = require('./type4');
const type5 = require('./type5');
// 八部分的配图
// const part1 = require('./img/part1.jpg');
// const part2 = require('./img/part2.jpg');
// const part3 = require('./img/part3.jpg');
// const part4 = require('./img/part4.jpg');
// const part5 = require('./img/part5.jpg');
// const part6 = require('./img/part6.jpg');
// const part7 = require('./img/part7.jpg');
// const part8 = require('./img/part8.jpg');

// 目录部分
const mulu = require('./common/catalog');


// 汇总部分
const collect = require('./collect');

var doc = null;

// 标记是否第一次执行 geneStream()
var first = true;

module.exports = function (data) {
// 生成文件名
	function namePdf() {
		return data.checkerName + '-' + data.productName + '-' + data.sampleNo + '-' + data.summary.reportTime + '.pdf';
	}

	function geneStream(secondData = {header: [], muluData: []}) {

		// 定义pdf 展示八部分
		var partInfo = [
			{
				key: 1,
				name: '疾病风险',
				part: '第一部分',
				img: __dirname + '/img/part1.jpg'
			},
			{
				key: 2,
				name: '肿瘤风险',
				part: '第二部分',
				img: __dirname + '/img/part2.jpg'
			},
			{
				key: 0,
				name: '遗传性疾病',
				part: '第三部分',
				img: __dirname + '/img/part3.jpg'
			},
			{
				key: 4,
				name: '药物反应',
				part: '第四部分',
				img: __dirname + '/img/part4.jpg'
			},
			{
				key: 3,
				name: '营养代谢',
				part: '第五部分',
				img: __dirname + '/img/part5.jpg'
			},
			{
				key: 7,
				name: '医学特征',
				part: '第六部分',
				img: __dirname + '/img/part6.jpg'
			},
			{
				key: 8,
				name: '体质特征',
				part: '第七部分',
				img: __dirname + '/img/part7.jpg'
			},
			{
				key: 6,
				name: '运动健身',
				part: '第八部分',
				img: __dirname + '/img/part8.jpg'
			}
		];


		var content = [];


		// 定义 页眉不显示的数组
		var header = [];


		// 定义 表型和页码 对应
		var tempObj = {};


		// 定义目录需要的数据
		var muluData = [];

		/*
		[
			{
				name:'第一部分 疾病风险',
				data:[
					{
						pname:'表型名',
						pagenum:0
					},
					...
				]
			},
			...
		]

		*/



		// 总页码
		var totalPage = 0;


		// 根据定义的八部分 遍历数据  生成目录数据
		for (var item in partInfo) {
			// 表型数组
			let pNameArr = [];

			muluData.push({
				name: `${partInfo[item].part}:${partInfo[item].name}`,
				data: pNameArr
			});


			for (var itemPart in data.reportInfo) {
				if (data.reportInfo[itemPart].type === partInfo[item].key) {
					for (var i = 0; i < data.reportInfo[itemPart].items.length; i++) {
						pNameArr.push({
							pname: data.reportInfo[itemPart].items[i].phenotypeName,
							pageNum: 0
						});
					}
				}
			}
		}


		// 汇总的部分
		content = content.concat(collect(data.checker, data.reportTime, data.summary.content, first ? {} : secondData.tempObj));


		// 目录部分
		content = content.concat(mulu(first ? muluData : secondData.muluData));


		// 目录最后标记
		content.push({
			text: 'MULUEND',
			color: '#fff',
			pageBreak: secondData.header.length % 2 === 0 ? '' : 'after'
		});


		//content部分
		for (var item in partInfo) {
			for (var itemPart in data.reportInfo) {
				if (data.reportInfo[itemPart].type === partInfo[item].key) {
					for (var i = 0; i < data.reportInfo[itemPart].items.length; i++) {
						// 只有每个部分的第一个表型 才会显示 title 例如:'第一部分：疾病风险' 其他的不会显示
						if (i === 0) {
							// 根据tplid 判断每个表型 渲染哪个模版
							switch (data.phenotypes[data.reportInfo[itemPart].items[i].phenotypeId].phenotypeTplId) {
								case 1:
									let key = '';
									data.reportInfo.genericTumor.items.forEach((k) => {
										if (k.phenotypeId === data.reportInfo[itemPart].items[i].phenotypeId) {
											key = k;
										}
									});
									// 判断是否有家族性 分析
									if (key) {
										content = content.concat(type1(data.reportInfo[itemPart].items[i], data.phenotypes[data.reportInfo[itemPart].items[i].phenotypeId], partInfo[item], key));
									} else {
										content = content.concat(type1(data.reportInfo[itemPart].items[i], data.phenotypes[data.reportInfo[itemPart].items[i].phenotypeId], partInfo[item]));
									}
									break;
								case 2:
									content = content.concat(type2(data.reportInfo[itemPart].items[i], data.phenotypes[data.reportInfo[itemPart].items[i].phenotypeId], partInfo[item]));
									break;
								case 3:
									content = content.concat(type3(data.reportInfo[itemPart].items[i], data.phenotypes[data.reportInfo[itemPart].items[i].phenotypeId], partInfo[item]));
									break;
								case 4:
									content = content.concat(type4(data.reportInfo[itemPart].items[i], data.phenotypes[data.reportInfo[itemPart].items[i].phenotypeId], partInfo[item]));
									break;
								case 5:
									data.reportInfo.genericTumor.items.forEach((k) => {
										if (k.phenotypeId === data.reportInfo[itemPart].items[i].phenotypeId) {
											content = content.concat(type5(k, data.phenotypes[data.reportInfo[itemPart].items[i].phenotypeId], partInfo[item]));
										}
									});
									break;
								// tplId = 6  渲染 type4
								case 6:
									content = content.concat(type4(data.reportInfo[itemPart].items[i], data.phenotypes[data.reportInfo[itemPart].items[i].phenotypeId], partInfo[item]));
									break;
								default:
									break;
							}
						} else {
							switch (data.phenotypes[data.reportInfo[itemPart].items[i].phenotypeId].phenotypeTplId) {
								case 1:
									let key = '';
									data.reportInfo.genericTumor.items.forEach((k) => {
										if (k.phenotypeId === data.reportInfo[itemPart].items[i].phenotypeId) {
											key = k;
										}
									});
									if (key) {
										content = content.concat(type1(data.reportInfo[itemPart].items[i], data.phenotypes[data.reportInfo[itemPart].items[i].phenotypeId], null, key));
									} else {
										content = content.concat(type1(data.reportInfo[itemPart].items[i], data.phenotypes[data.reportInfo[itemPart].items[i].phenotypeId]));
									}
									break;
								case 2:
									content = content.concat(type2(data.reportInfo[itemPart].items[i], data.phenotypes[data.reportInfo[itemPart].items[i].phenotypeId]));
									break;
								case 3:
									content = content.concat(type3(data.reportInfo[itemPart].items[i], data.phenotypes[data.reportInfo[itemPart].items[i].phenotypeId]));
									break;
								case 4:
									content = content.concat(type4(data.reportInfo[itemPart].items[i], data.phenotypes[data.reportInfo[itemPart].items[i].phenotypeId]));
									break;
								case 5:
									data.reportInfo.genericTumor.items.forEach((k) => {
										if (k.phenotypeId === data.reportInfo[itemPart].items[i].phenotypeId) {
											content = content.concat(type5(k, data.phenotypes[data.reportInfo[itemPart].items[i].phenotypeId]));
										}
									});
									break;
								case 6:
									content = content.concat(type4(data.reportInfo[itemPart].items[i], data.phenotypes[data.reportInfo[itemPart].items[i].phenotypeId]));
									break;
								default:
									break;
							}
						}
					}
				}
			}
		}


		const STATIC_PART = {
			// 页眉
			header: function (currentPage) { //eslint-disable-line
				// 判断页眉不显示的数组 长度是奇数还是偶数 (奇数后面补一页空白页)
				secondData.header.length % 2 === 0 ? secondData.header : secondData.header.push(secondData.header.length + 1);
				if (secondData.header && secondData.header.some(function (item) {
						return item === currentPage
					})) {
					return [];
				} else {
					if (currentPage % 2 === 0) {
						return [{
							image: __dirname + '/img/header.png',
							width: 100,
							margin: [42, 16, 0, 10]
						}];
					}
					return [{
						image: __dirname + '/img/header.png',
						width: 100,
						margin: [450, 16, 0, 10]
					}]
				}
			},
			// 页脚(页码)
			footer: function (currentPage, pageCount) {
				totalPage = pageCount;
				if (secondData.header && secondData.header.some(function (item) {
						return item === currentPage
					})) {
					return '';
				} else {
					if (currentPage % 2 === 0) {
						return {
							text: currentPage - secondData.header.length,
							alignment: 'left',
							color: '#3b9dd7',
							margin: [55, 0, 0, 0]
						};
					}
					return {
						text: currentPage - secondData.header.length,
						color: '#3b9dd7',
						alignment: 'right',
						margin: [0, 0, 50, 0]
					};
				}
			},
			pageMargins: [60, 50, 60, 50],
			// 这个样式是在汇总表格里面用的
			styles: {
				hzTable: {
					margin: [0, 3.5, 0, 3.5],
					fontSize: 10.5
				},
				tableP4: {
					margin: [0, 5, 0, 20],
					alignment: 'center',
					fontSize: 10.5
				}
			}
		};


		doc = new Printer({
			Roboto: {
				normal: __dirname + '/../fonts/PingFang Regular.ttf',
				bold: __dirname + '/../fonts/PingFang Medium.ttf',
				italics: __dirname + '/../fonts/PingFang-Light.ttf',
				bolditalics: __dirname + '/../fonts/PingFang-Bold.ttf'
			}
		}).createPdfKitDocument(Object.assign({}, STATIC_PART, {content: content}));
		doc.end();


// 取藏在content中的内容 判断头部和底部的显示
		if (first) {
			doc._pdfMakePages.forEach(function (page, index) {
				var curPage = parseInt(page.items[page.items.length - 1].item.inlines[0].text, 10);

				let pname = '';

				page.items.forEach(function (row) {
					if (row.item.inlines) {
						row.item.inlines.forEach(function (word) {
							if (word.text === 'MULUEND') {
								for (var i = 1; i <= curPage; i++) {
									header.push(i);
								}
							}
							if (word.fontSize === 21 && word.color === '#f00' && word.alignment === 'center') {
								for (var i = 0; i < row.item.inlines.length; i++) {
									pname += row.item.inlines[i].text;
								}
								tempObj[pname] = curPage - header.length;
							}
						});
					}
				});
			});
		}


		first = false;
		doc.pipe(devnull());


		// 表型+页码
		muluData.forEach((item) => {
			item.data.forEach((k) => {
				k.pageNum = tempObj[k.pname]
			})
		});


		return {
			fileName: namePdf(),
			stream: doc,
			secondData: {header, muluData, tempObj},
			totalPage
		};
	}


	return geneStream(geneStream().secondData);
};
