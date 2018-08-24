const log = require('../logger/index');
const lifePdfGen = require('./pdfGenTask').lifePdfGen;

process.on('message', (msg) => {
  const msgObj = JSON.parse(msg);
  console.log(msg);
  lifePdfGen(msgObj)
    .then(() => {
      process.send('ok');
    })
    .catch((err) => {
      process.send('nok');
      log.error(`报告ID为${msgObj.reportId}生成出错，错误为:${err}`);
    });
});