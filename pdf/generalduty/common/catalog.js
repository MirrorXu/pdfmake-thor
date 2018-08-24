/**
 * Created by chao.z on 18/4/18.
 */
/* eslint-disable */
module.exports = function (mulu) {
	var content = [
		{
			image: __dirname + '/img/mulu.png',
			width: 595,
			absolutePosition: {x: 0, y: 0}
		},
		{
			text: '目录/Contents',
			color: '#fff',
			fontSize: 24,
			bold: true,
			margin: [0, -10, 0, 20]
		}
	];
  	mulu.forEach((item) => {
		var left = [], right = [], left1 = [], left2 = [], right1 = [], right2 = [];


		for (var i = 0; i < item.data.length; i++) {
			i % 2 === 0 ? left.push(item.data[i]) : right.push(item.data[i]);
		}


		left.forEach((i) => {
			left1.push(i.pname || '');
			left2.push(i.pageNum || '');
		});
		right.forEach((y) => {
			right1.push(y.pname || '');
			right2.push(y.pageNum || '');
		});

		content = content.concat([
			{
				text: item.name,
				color: '#3b9dd7',
				fontSize: 14,
				bold: true,
				margin: [0, 20, 0, 8]
			},
			{
				image: __dirname + '/img/line.png',
				width: 470,
				margin: [0, 0, 0, 12]
			},
			{
				columns: [
					{
						type: 'none',
						ol: left1,
						width: 180,
						color: '#595656',
						fontSize: 10,
						lineHeight: 1.4,
						bold: true
					},
					{
						type: 'none',
						ol: left2,
						width: 50,
						color: '#3b9dd7',
						fontSize: 10,
						bold: true,
						lineHeight: 1.4
					},
					{
						type: 'none',
						ol: right1,
						width: 200,
						color: '#595656',
						fontSize: 10,
						bold: true,
						lineHeight: 1.4
					},
					{
						type: 'none',
						ol: right2,
						width: 30,
						alignment: 'right',
						color: '#3b9dd7',
						fontSize: 10,
						bold: true,
						lineHeight: 1.4
					}
				]
			}
		]);
	});
	return content;
};

