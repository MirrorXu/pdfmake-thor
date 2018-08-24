/**
 * Created by chao.z on 17/12/20.
 */
/* eslint-disable */
const fs = require('fs');


const Printer = require('pdfmake');
const cover = require('../common/cover');


const percentage = require('../common/percentage');

const namePdf = require('../common/namePdf');


var devnull = require('dev-null');


// 生成apoe的报告
module.exports = function (data) {
	var totalPage = 0;
	var preventData = [
		{
			title: '预防建议',
			data: [
				{
					littleTitle: '1、严格控制体重',
					desc: '体重指数BMI=体重(kg)/身高平方(m2)'
				},
				{
					littleTitle: '2、戒烟限酒',
					desc: '烟草中含有多种有害物质,如烟焦油、尼古丁,吸烟可升高血浆胆固醇和三酰甘油水平,降低HDL-胆固醇水平,可增加高 血压、冠心病、肥胖症等多种慢性疾病及多种恶性肿瘤的患病风险。少量饮酒虽可活血化瘀、促进血液循环,但长期大量的 饮酒超过肝脏解酒功能,可引起肝细胞损伤、肝纤维化以及酒精性肝硬化等疾病,同时还会加快动脉硬化和升高血压。'
				},
				{
					littleTitle: '3、规律作息',
					desc: '调整生活作息时间,早睡早起,保证7-8小时的睡眠时间,避免长期的熬夜,从而减少对心肌造成的损害。'
				},
				{
					littleTitle: '4、情绪管理',
					desc: '培养兴趣爱好,保持乐观愉悦的情绪,选择适合自己的方式减轻生活及工作中的压力,避免长期处于抑郁、暴怒等情绪不 稳的状态,劳逸结合。'
				}
			]
		},
		{
			title: '饮食建议',
			data: [
				{
					littleTitle: '1、“三低”',
					desc: '清淡饮食,遵循“低盐、低脂、低糖”的饮食习惯,摄取的食物热量不宜过高,一日三餐规律饮食、避免暴饮暴食。'
				},
				{
					littleTitle: '2、调整膳食结构',
					desc: '荤素均衡,适当的减少肉菜,降低高胆固醇及高油脂食物的摄入,增加优质蛋白、高纤维素、蔬菜水果、豆类、谷物、坚果 等的摄入。'
				},
				{
					littleTitle: '3、补充微量元素',
					desc: '适当的增加富含维生素C、维生素E、锌、铁、钾等营养元素的蔬菜水果,如菠菜、山药、海带、黄豆、坚果等,补充每日 所需的微量元素。同时还应减少重金属汞、铅、铜等摄入,以便更好的预防老年痴呆。'
				}
			]
		},
		{
			title: '运动建议',
			data: [
				{
					littleTitle: '1、频率:每周3-5次,每次大约30分钟',
					desc: ''
				},
				{
					littleTitle: '2、方式:以中等强度的有氧运动为主,如慢跑、瑜伽、爬楼梯、骑自行车、游泳等',
					desc: ''
				},
				{
					littleTitle: '3、注意事项',
					desc: ''
				},
				{
					littleTitle: 'a、运动时将心率控制在最高心率的80%以下(最高心率=220-年龄)。运动时间不宜过长,量力而行,避免因运动强度 过大出现胸闷、气喘等情况。',
					desc: ''
				},
				{
					littleTitle: 'b、运动前多做热身和舒缓动作,勿仓促启动,骤然停止,减少运动对心脑血管系统的压力和患病风险。',
					desc: ''
				},
				{
					littleTitle: 'c、冬天寒冷及空气污染较严重时选择室内运动为主。',
					desc: ''
				},
				{
					littleTitle: '4、意义',
					desc: '坚持规律的运动对于预防和改善肥胖、锻炼心脑血管系统的功能、调整血脂代谢均有益处,是预防冠心病、脑梗塞及阿兹 海默症的一项积极措施。'
				}
			]
		},
		{
			title: '体检建议',
			data: [
				{
					littleTitle: '1、生化检查',
					desc: '血压、血糖、血脂、血生化、血尿便常规、肝肾功能、心肌坏死标志物(肌红蛋白、肌钙蛋白、肌酸激酶同工酶)'
				},
				{
					littleTitle: '2、影像学检查',
					desc: '心电图、动态心电图、超声心动图、冠状动脉CT、脑CT/MRI、经颅多普勒超声、脑电图'
				},
				{
					littleTitle: '3、特殊检查',
					desc: '冠状动脉造影、放射性核素心肌显像、脑脊液检查、数字减影全脑血管造影 (DSA)、淀粉样蛋白PET显像、神经心理学评估'
				}
			]
		}
	];

	function apoePDF(data) {
		// 引入报告封面
		const coverPage = cover('载脂蛋白E基因检测报告', '/img/apoe.png', data);

		var content = [...coverPage];

		// 生成致客户
		function geneToCus() {
			content.push(
				{
					image: __dirname + '/img/toCustomer.jpg',
					width: 590,
					margin: [-40, 0, -60, -70],
					pageBreak: 'before'
				}
			);
		}

		/**
		 * @method geneItems 生成单项疾病详情
		 * @param {object} data 表型的items
		 */
		function geneItems(data) {
			// 表盘
			let itemLevel = '';
			let resultColor = '';
			let resultName = '';

			switch (data.info.result) {
				case 'ε2ε2': {
					resultName = data.info.result + '(' + data.info.summary + ')';
					resultColor = '#6ebd72';
					itemLevel = __dirname + '/img/ε2ε2.png';
					break;
				}
				case 'ε2ε3': {
					resultName = data.info.result + '(' + data.info.summary + ')';
					resultColor = '#6ebd72';
					itemLevel = __dirname + '/img/ε2ε3.png';
					break;
				}
				case 'ε2ε4': {
					resultName = data.info.result + '(' + data.info.summary + ')';
					resultColor = '#e46f47';
					itemLevel = __dirname + '/img/ε2ε4.png';
					break;
				}
				case 'ε3ε3': {
					resultName = data.info.result + '(' + data.info.summary + ')';
					resultColor = '#e46f47';
					itemLevel = __dirname + '/img/ε3ε3.png';
					break;
				}
				case 'ε3ε4': {
					resultName = data.info.result + '(' + data.info.summary + ')';
					resultColor = '#e46f47';
					itemLevel = __dirname + '/img/ε3ε4.png';
					break;
				}
				case 'ε4ε4': {
					resultName = data.info.result + '(' + data.info.summary + ')';
					resultColor = '#e46f47';
					itemLevel = __dirname + '/img/ε4ε4.png';
					break;
				}
				default: {
					resultName = '出错了';
					resultColor = '#e46f47';
					itemLevel = __dirname + '/img/ε2ε2.png';
					break;
				}
			}


			// 表型以及表型配图
			content.push(
				{
					columns: [
						{
							image: __dirname + '/img/apoe.jpg',
							width: 297
						},
						{
							canvas: [
								{
									type: 'rect',
									x: 0,
									y: 0,
									w: 298,
									h: 184,
									color: '#3b7db8'
								}
							]
						}
					],
					margin: [-40, -44, 0, 0],
					pageBreak: 'before'
				},
				{
					stack: [
						{
							text: '载脂蛋白E',
							alignment: 'center',
							color: '#fff',
							fontSize: 18
						},
						{
							text: '——',
							alignment: 'center',
							color: '#fff',
							fontSize: 34,
							margin: [0, -18, 0, -18]
						},
						{
							text: '检测结果分析',
							alignment: 'center',
							color: '#fff',
							fontSize: 12
						}
					],
					absolutePosition: {x: 357, y: 65}
				},
				{
					image: __dirname + '/img/radius.png',
					width: 74,
					absolutePosition: {x: 259.5, y: 167}
				});


			content.push(
				{
					columns: [
						{
							image: itemLevel,
							width: 200,
							marginLeft: 26
						},
						{
							stack: [
								{
									text: [
										'您的APOE基因型为:',
										{
											text: ' ' + resultName,
											fontSize: 14,
											color: resultColor,
											bold: true
										}
									],
									fontSize: 10,
									color: '#231815'
								},
								{
									text: [
										'与您基因型相同的人在总人群中的占比: ',
										{
											text: '' + percentage(data.info.ratio ? (data.info.ratio * 100).toFixed(2).toString() : null) || '--',
											fontSize: 10,
											color: '#3b7db8'
										}
									],
									fontSize: 10,
									bold: true,
									color: '#231815',
									margin: [0, 10, 0, 0]
								}
							],
							margin: [94, 20, 0, 0]
						}
					],
					margin: [0, 24, 0, 10]
				},
				{
					text: 'APOE基因检测结果反映的是与蛋白功能密切相关的心脑血管疾病的患病风险,心脑血管系统疾病患病风险同时受环境、 饮食、运动等多种因素。因此请根据为您定制的预防建议,积极实施健康管理,尽早预防,及时干预。',
					fontSize: 10,
					color: '#231815',
					bold: true,
					margin: [0, 0, 0, 20],
					lineHeight: 1.2
				}
			);


			var influence = data.info.influence;

			var marginTopNum = 0;

			if (influence.length > 12) {
				marginTopNum = 8;
			} else {
				marginTopNum = 14;
			}
			// 表格生成
			content.push(
				{
					text: '检测结果',
					style: 'partTitle',
					bold: true
				},
				{
					table: {
						headerRows: 1,
						dontBreakRows: true,
						keepWithHeaderRows: 1,
						widths: [160, 160, 160],
						body: [
							[
								{
									text: '基因',
									border: [false, false, false, false],
									alignment: 'center',
									fontSize: 10,
									color: '#fff',
									margin: [0, 2, 0, 2],
									fillColor: '#3b7db8'
								},
								{
									text: '位点',
									border: [false, false, false, false],
									alignment: 'center',
									fontSize: 10,
									color: '#fff',
									margin: [0, 2, 0, 2],
									fillColor: '#3b7db8'
								},
								{
									text: '基因型',
									border: [false, false, false, false],
									alignment: 'center',
									fontSize: 10,
									color: '#fff',
									margin: [0, 2, 0, 2],
									fillColor: '#3b7db8'
								},
								// {
								//   text: '影响',
								//   border: [false, false, false, false],
								//   alignment: 'center',
								//   fontSize: 10,
								//   color: '#fff',
								//   margin: [0, 2, 0, 2],
								//   fillColor: '#3b7db8'
								// },
							],
							[
								{
									text: 'APOE',
									border: [false, false, false, false],
									alignment: 'center',
									fontSize: 10,
									color: '#221815',
									margin: [0, 14, 0, 2],
									rowSpan: 2
								},
								{
									text: 'rs429358',
									border: [false, false, false, false],
									alignment: 'center',
									fontSize: 10,
									color: '#221815',
									margin: [0, 2, 0, 2],
								},
								{
									text: data.info.genotypes,
									border: [false, false, false, false],
									alignment: 'center',
									fontSize: 10,
									color: '#221815',
									margin: [0, 14, 0, 2],
									rowSpan: 2
								},
								// {
								//   text: influence,
								//   border: [false, false, false, false],
								//   alignment: 'center',
								//   fontSize: 10,
								//   color: '#221815',
								//   margin: [0, marginTopNum, 0, 2],
								//   rowSpan: 2
								// },
							],
							[
								'',
								{
									text: 'rs7412',
									border: [false, false, false, false],
									alignment: 'center',
									fontSize: 10,
									color: '#221815',
									margin: [0, 2, 0, 2],
								},
								'',
								// ''
							]
						]
					}
				}
			);
			// 载脂蛋白E与疾病
			content.push(
				{
					text: '载脂蛋白E与疾病',
					style: 'partTitle'
				},
				{
					image: __dirname + '/img/illness.png',
					width: 236,
					margin: [0, 0, 0, 10]
				},
				{
					text: [
						'血浆中血脂如果过多,容易造成"血稠",在血管壁上沉积,逐渐形成小斑块,由于过多脂肪沉积,造成动脉硬 化,使血流受阻,阻塞血液流入相应部位,引起功能缺损,发生在冠状动脉时可引起',
						{
							text: '冠心病',
							style: 'illnessItem'
						},
						',发生在脑血管时 易发生',
						{
							text: '脑梗塞',
							style: 'illnessItem'
						},
						',大量血脂在脑部沉积,影响脑胆固醇稳态,导致细胞外神经炎性斑块和细胞内神经元纤维缠 绕,增加',
						{
							text: '阿兹海默症',
							style: 'illnessItem'
						},
						'的患病风险。'
					],
					style: 'partContent',
					margin: [0, 0, 0, 20],
					lineHeight: 1.2,
					bold: true
				},
				{
					text: '基因知识',
					style: 'partTitle'
				},
				{
					text: 'APOE基因位于19号染色体,编码载脂蛋白E (APOE),是血浆中重要的载脂蛋白之一。该蛋白参与机体血脂调 节、胆固醇平衡、中枢神经系统受损神经元的修复,具有重要生理学功能。',
					style: 'partContent',
					lineHeight: 1.2
				},
				{
					text: '载脂蛋白E(APOE) 是同时存在于血清和中枢神经系统中的脂质相关蛋白,APOE将多余的血脂运输到肝脏进行 清除和分解,维持机体脂质代谢平衡,APOE在血浆中的浓度一定程度上决定了血浆中血脂的水平。',
					style: 'partContent',
					lineHeight: 1.2,
					pageBreak: 'after'
				},
				{
					image: __dirname + '/img/geneTop.jpg',
					width: 595,
					absolutePosition: {x: 0, y: 0}
				},
				{
					text: '疾病预防',
					style: 'partTitle',
					margin: [14, 160, 0, 5]
				}
			);

			// 疾病预防
			function prevent(preventData) {
				preventData.forEach((item) => {
					content.push(
						{
							text: item.title,
							style: 'partItemTitle',
							margin: [14, 0, 0, 10]
						}
					);
					item.data.forEach((i) => {
						content.push(
							{
								text: i.littleTitle,
								style: 'partContent',
								margin: [14, 0, 0, 5]
							},
							{
								text: i.desc,
								style: 'partContent',
								margin: [14, 0, 0, 5]
							}
						)
					})
				});
			}

			prevent(preventData);
		}

		// 生成结尾
		function geneEnding() {
			content.push(
				// {
				//   image: __dirname + '/img/aboutThor.jpg',
				//   width: 595,
				//   margin: [-40, 1, -60, -70],
				//   pageBreak: 'after'
				// },
				{
					text: 'empty',
					color: '#fff',
					pageBreak: 'after'
				},
				{
					image: __dirname + '/img/lastPage.jpg',
					width: 595,
					height: 845,
					margin: [-40, -44, -60, -70],
					pageBreak: 'before'
				}
			);
		}

		geneToCus();
		geneItems(data);
		geneEnding();
		// 页脚,样式
		const COMMON_PART = {
			// 页脚(页码)
			footer: function (currentPage, pageCount) {
				// var page = [1, 2, 8, 9, 10];
				var page = [1, 2, 7, 8];
				if (page.indexOf(currentPage) !== -1) {
					return {
						text: ''
					};
				}
				totalPage = pageCount;
				return {
					text: currentPage - 2,
					bold: true,
					alignment: 'center'
				};
			},
			// 样式
			styles: {
				infoTableL: {
					fontSize: 10,
					lineHeight: 1,
					bold: true
				},
				infoTable: {
					fontSize: 10,
					alignment: 'center',
					lineHeight: .8,
					bold: true
				},
				partTitle: {
					fontSize: 14,
					bold: true,
					color: '#3b7db8',
					margin: [0, 0, 0, 10]
				},
				detailPart: {
					color: '#3b7db8',
					bold: true,
					fontSize: 14,
					margin: [0, 0, 0, 5]
				},
				partContent: {
					fontSize: 10,
					color: '#231815',
					bold: true
				},
				illnessItem: {
					color: '#e47047'
				},
				partItemTitle: {
					fontSize: 10,
					bold: true,
					color: '#3b7db8',
					margin: [0, 0, 0, 10]
				}
			}
		};
		return Object.assign({}, {content: content}, COMMON_PART)
	}

	var doc = new Printer({
		Roboto: {
			normal: __dirname + '/../fonts/PingFang Regular.ttf',
			bold: __dirname + '/../fonts/PingFang Medium.ttf',
			italics: __dirname + '/../fonts/PingFang Regular.ttf',
			bolditalics: __dirname + '/../fonts/PingFang Medium.ttf'
		}
	}).createPdfKitDocument(apoePDF(data));
	doc.end();
	doc.pipe(devnull());
	return {
		fileName: namePdf(data.checker.name, data.productName, data.sampleNo, data.meetingNo),
		stream: doc,
		totalPage: totalPage
	};
};