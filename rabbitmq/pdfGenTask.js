'use strict';

const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
const config = require('config');
const co = require('co');
const amqp = require('amqplib');
const OSS = require('ali-oss').Wrapper;
const urllib = require('url');
const Promise = require('bluebird');
const rp = require('request-promise');
const log = require('../logger/index');
const genReportPdf = require('../pdf/genePdf');
const genExcel = require('../pdf/vitamin/genExcel');
const gm = require('gm');
const exists = require('../pdf/common/util.js').exists;
const mySetTimeout = require('../pdf/common/util.js').mySetTimeout;
const pdfCompress = require('../lib/helper').pdfCompress;

const ossConf = config.get('aliOss');
const ossClient = new OSS(ossConf.connection);
const pdfGenTaskConfig = config.get('pdfGenTask');
const pdfGenTaskInterval = pdfGenTaskConfig.interval;

const pdfGenTaskQueue = pdfGenTaskConfig.pdfTaskQueue;
const pdfTaskExchange = pdfGenTaskConfig.pdfTaskExchange;
const pdfGenMaxTry = pdfGenTaskConfig.maxTry;

module.exports.publishPdfGenTask = function (msgObj) {
  let producerChannel;
  co(function*() {
    if (!producerChannel) {
      const proConn = yield amqp.connect(config.get('amqpAddr'));
      producerChannel = yield proConn.createChannel();
    }
    yield producerChannel.assertExchange(pdfTaskExchange, 'direct');
    yield producerChannel.assertQueue(pdfGenTaskQueue, { durable: true });
    yield producerChannel.bindQueue(pdfGenTaskQueue, pdfTaskExchange, 'rk1');
    yield producerChannel.assertExchange('DeadExchange', 'direct');
    yield producerChannel.assertQueue('DEQ', {
      arguments: {
        'x-dead-letter-exchange': pdfTaskExchange,
        'x-dead-letter-routing-key': 'rk1',
        'x-message-ttl': pdfGenTaskInterval,
        'x-expires': 1800000
      }
    });
    yield producerChannel.bindQueue('DEQ', 'DeadExchange', '');
    const msgStr = JSON.stringify(msgObj);
    producerChannel.sendToQueue(pdfGenTaskQueue, new Buffer(msgStr), { persistent: true });
  })
    .catch((err) => {
      log.error(err);
    });
};

module.exports.lifePdfGen = function (msgObj) {
  let obj;
  let compressedObj;
  return co(function* () {
    let pdfObj;
    // 做此判断是因为内部实现有些使用generator func, 有些没有用
    if (msgObj.dataObj.productId === 1
      || msgObj.dataObj.productId === 5
      || msgObj.dataObj.productId === 8
      || msgObj.dataObj.productId === 18
      || msgObj.dataObj.productId === 49
      || msgObj.dataObj.productId === 48
      || msgObj.dataObj.productId === 50
    ) {
      pdfObj = genReportPdf(msgObj.dataObj);
    } else if (msgObj.dataObj.productId === 56
      || msgObj.dataObj.productId === 57
      || msgObj.dataObj.productId === 58) { // 维他客临时方案, 生成Excel
      pdfObj = yield genExcel(msgObj, msgObj.dataObj.productId);

      const { fileName, stream, totalPage } = pdfObj;
      log.info(`${msgObj.reportId}====> pageNum:`, totalPage);
      obj = yield ossClient.put(`smzg/${fileName}`, stream);
      log.info(`${msgObj.reportId}====> 上传维他客Excel文件完成`);
      if (obj.res) {
        if (obj.res.statusCode !== 200) {
          log.error(JSON.stringify(obj));
        }
      }
      const urlObj = urllib.parse(obj.url, true);
      const pdfUrl = urllib.resolve(ossConf.urlAliasPrefix, urlObj.pathname); // 用自有域名
      const body = {
        pdfUrl,
        reportId: msgObj.reportId,
        imgUrls: ' '  // mysql  image_url is not null
      };
      const args = {
        url: msgObj.rtnUrl,
        body,
        method: 'POST',
        json: true
      };
      const resp = yield rp(args);
      if (resp.retCode === 0) {
        log.info(`${msgObj.reportId}====> gen excel task complete`);
      } else {
        log.error(`${msgObj.reportId}====> ${JSON.stringify(resp)}`);
      }
      return;
    } else {
      pdfObj = yield genReportPdf(msgObj.dataObj);
    }
    const { fileName, stream, totalPage } = pdfObj;
    log.info(`${msgObj.reportId}====> pageNum:`, totalPage);
    yield new Promise(resolve => {
      stream
        .pipe(fs.createWriteStream(`./${fileName}`))
        .on('finish', resolve)
        .on('error', (err) => console.log(err));
    });
    if (!exists(`./${fileName}`)) {
      log.error(`报告编号为：${msgObj.reportId}的pdf文件未能正确生成！`);
    }
    pdfCompress(`./${fileName}`, `./compressed_${fileName}`);
    if (!exists(`./compressed_${fileName}`)) { log.error(`报告编号为：${msgObj.reportId}的pdf文件未能正确压缩！`); }
    log.info(`${msgObj.reportId}====> 压缩完成`);
    obj = yield ossClient.put(`smzg/${fileName}`, `./${fileName}`);
    compressedObj = yield ossClient.put(`smzg/compressed_${fileName}`, `./compressed_${fileName}`);
    log.info(`${msgObj.reportId}====> 上传PDF文件完成`);
    const picArray = [];
    let imgUrls = '';
    if (obj.res) {
      if (obj.res.statusCode !== 200) {
        log.error(JSON.stringify(obj));
      }
    }
    const urlObj = urllib.parse(obj.url, true);
    const compressedUrlObj = urllib.parse(compressedObj.url, true);
    const pdfCompressedUrl = urllib.resolve(ossConf.urlAliasPrefix, compressedUrlObj.pathname);
    const pdfUrl = urllib.resolve(ossConf.urlAliasPrefix, urlObj.pathname); // 用自有域名
    if (!fileName.includes('生命之康') && !fileName.includes('生命之福')) {
      for (let pageNo = 0; pageNo < totalPage; pageNo++) {
        let picUpObj = {};
        yield new Promise((resolve, reject) => {
          gm(`./${fileName}[${pageNo}]`)
            .setFormat('png')
            .density(200, 200)
            .flatten()
            .write(`./${fileName}[${pageNo}].png`, (err) => {
              if (err) {
                reject(err);
              } else {
                resolve('done');
              }
            });
        });
        mySetTimeout(3000);
        if (exists(`./${fileName}[${pageNo}].png`)) {
          picUpObj = yield ossClient.put(`report_img/${fileName}[${pageNo}].png`, `./${fileName}[${pageNo}].png`);
          fs.unlinkSync(`./${fileName}[${pageNo}].png`);
          const picUrlObj = urllib.parse(picUpObj.url, true);
          const picUrl = urllib.resolve(ossConf.urlAliasPrefix, picUrlObj.pathname);
          picArray.push(picUrl);
        }
        if (picUpObj.res) {
          if (picUpObj.res.statusCode !== 200) {
            log.error(`${msgObj.reportId}====> ${JSON.stringify(picUpObj)}`);
          }
        }
      }
      fs.unlinkSync(`./${fileName}`);
      fs.unlinkSync(`./compressed_${fileName}`);
      imgUrls = picArray.join('\n');
      // console.log(imgUrls);
      const pagePic = picArray.length;
      log.info(`${msgObj.reportId}====> picNum:`, pagePic);
      if (pagePic < totalPage) log.error(`${msgObj.reportId}====> 图片页数小于pdf页数，需要重新转换图片！`);
    }
    const body = {
      pdfUrl,
      pdfCompressedUrl,
      reportId: msgObj.reportId,
      imgUrls
    };
    const args = {
      url: msgObj.rtnUrl,
      body,
      method: 'POST',
      json: true
    };
    const resp = yield rp(args);
    if (resp.retCode === 0) {
      log.info(`${msgObj.reportId}====> gen pdf task complete`);
    } else {
      log.error(`${msgObj.reportId}====> ${JSON.stringify(resp)}`);
    }
  });
};

module.exports.pdfTask = function* (consumerChannel) {
  yield consumerChannel.assertExchange(pdfTaskExchange, 'direct');
  yield consumerChannel.assertQueue(pdfGenTaskQueue, {
    durable: true,
    arguments: {
      'x-dead-letter-exchange': 'DeadExchange',
      'x-dead-letter-routing-key': 'rk1',
      'x-message-ttl': 18000000
    }
  });
  yield consumerChannel.bindQueue(pdfGenTaskQueue, pdfTaskExchange, 'rkRetry');
  consumerChannel.prefetch(1);
  consumerChannel.consume(pdfGenTaskQueue, (msg) => {
    const msgStr = msg.content.toString();
    const pdfGenProcess = childProcess.spawn(
      'node',
      [`${path.join(__dirname, './execChild.js')}`],
      { stdio: [0, 1, 2, 'ipc'] }
      );
    pdfGenProcess.send(msgStr);
    pdfGenProcess.on('message', (message) => {
      if (message === 'ok') {
        consumerChannel.ack(msg);
      } else if (message === 'nok') {
        const headers = msg.properties.headers || {};
        const retryCount = (headers['x-retries'] || 0) + 1;
        if (retryCount >= pdfGenMaxTry) {
          consumerChannel.ack(msg);
        } else {
          headers['x-retries'] = retryCount;
          msg.properties.headers = headers;
          consumerChannel.publish(pdfTaskExchange, 'rkRetry', msg.content, msg.properties);
          consumerChannel.ack(msg);
        }
      }
    });
  });
};
