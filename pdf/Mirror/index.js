
const Printer = require('pdfmake');
const path = require('path');


function _path( realPath ) {
	return path.join(__dirname , realPath );
}


const defaultData = {
	output:_path(`./ret/${Date.now()}.pdf`)
}



module.exports = function (data ) {

	const pdfTpl = {
		content : [
			{
				image: 'imgs/2.jpg',
				width: 100,
				alignment: 'right'
			},
			{
				text: [
					'尊敬的',
					{text: `${data.checkerName || ' err: checkerName lost'}`, color: 'red'},
					`${data.sex || '先生/女士'} :`
				],
				margin: [0, 10, 0, 10]
			},
			{
				text: '中共中央总书记习近平指出，新时代推进生态文明建设，必须坚持好以下原则。一是坚持人与自然和谐共生，坚持节约优先、保护优先、自然恢复为主的方针，像保护眼睛一样保护生态环境，像对待生命一样对待生态环境，让自然生态美景永驻人间，还自然以宁静、和谐、美丽。二是绿水青山就是金山银山，贯彻创新、协调、绿色、开放、共享的发展理念，加快形成节约资源和保护环境的空间格局、产业结构、生产方式、生活方式，给自然生态留下休养生息的时间和空间。三是良好生态环境是最普惠的民生福祉，坚持生态惠民、生态利民、生态为民，重点解决损害群众健康的突出环境问题，不断满足人民日益增长的优美生态环境需要。四是山水林田湖草是生命共同体，要统筹兼顾、整体施策、多措并举，全方位、全地域、',
				lineHeight: 1.2,
				bold: true,
				margin: [0, 0, 0, 30]
			},

			{
				text: '中共中央总书记习近平指出，新时代推进生态文明建设，必须坚持好以下原则。一是坚持人与自然和谐共生，坚持节约优先、保护优先、自然恢复为主的方针，像保护眼睛一样保护生态环境，像对待生命一样对待生态环境，让自然生态美景永驻人间，还自然以宁静、和谐、美丽。二是绿水青山就是金山银山，贯彻创新、协调、绿色、开放、共享的发展理念，加快形成节约资源和保护环境的空间格局、产业结构、生产方式、生活方式',
				lineHeight: 1.2,
				bold: true,
				margin: [0, 0, 0, 30]
			},

			{
				text: '生命只有一次，索真为您保驾护航',
				lineHeight: 1.2,
				bold: true,
				margin: [0, 0, 0, 5]
			},

			{
				text: '身体健康、阖家欢乐',
				lineHeight: 1.2,
				bold: true,
				margin: [0, 5, 0, 5]
			},
			{
				text: '索真健康',
				lineHeight: 1.2,
				bold: true,
			},
			{
				text: `${ data.date || 'xx年xx月xx日'}`,
				lineHeight: 1.2,
				bold: true,
			},
			{
				image: 'imgs/1.jpg',
				width: 200,
				alignment: 'right'
			}
		],
		// styles:defaultStyles
	}

	const doc = new Printer({
		Roboto: {
			normal:_path('../fonts/PingFang Regular.ttf'),
			bold: _path('../fonts/PingFang Medium.ttf'),
			italics:_path( '../fonts/PingFang Regular.ttf'),
			bolditalics:_path('../fonts/PingFang Medium.ttf')
		}
	}).createPdfKitDocument( pdfTpl );
	doc.end();
	return {
		stream: doc ,
		_fileName: _path( data.output )|| defaultData.output
	};
};


/*
* data = { checkerName:'用户名' , sex:'性别' , date:'时间' }
*
*
*
*
*
* */