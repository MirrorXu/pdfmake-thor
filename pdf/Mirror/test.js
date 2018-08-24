const fs = require('fs');

const pdfDoc = require('./index');


let data = {
	checkerName: '张三',
	sex:'先生',
	date:`${ new Date().getFullYear() } . ${ new Date().getMonth()+1 } . ${ new Date().getDate() }`,
	output:'./ret/test.pdf'
}


const doc = pdfDoc(data);


doc.stream.pipe( fs.createWriteStream(doc._fileName) );

console.log('success...');


// console.log( new Date().getFullYear() )