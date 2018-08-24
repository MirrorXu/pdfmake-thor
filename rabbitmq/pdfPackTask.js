'use strict';
const fs = require('fs');
const config = require('config');
const co = require('co');
const OSS = require('ali-oss').Wrapper;
const urllib = require('url');
const rp = require('request-promise');
const log = require('../logger/index');
const archiver = require('archiver');

const ossConf = config.get('aliOss');
const ossClient = new OSS(ossConf.connection);
const pdfGenTaskConfig = config.get('pdfGenTask');

const pdfGenMaxTry = pdfGenTaskConfig.maxTry;
const pdfPackTaskQueue = pdfGenTaskConfig.pdfPackTaskQueue;
const pdfTaskExchange = pdfGenTaskConfig.pdfTaskExchange;

function urlDecoder(url) {
  return decodeURIComponent(url.replace(/\+/g, ' '));
}

function getPdfName(url) {
  const lastIndex = url.lastIndexOf('/') + 1;
  if (lastIndex !== -1) {
    return url.substring(lastIndex);
  }
  return null;
}

function downloadMeetingZip(msg) {
  return co(function*() {
    // zip包名称
    // “场次编码-报告数量-导入表格时间”
    const meetingId = msg.meetingId;
    const meetingNo = msg.meetingNo;
    const reportNum = msg.reportNum;
    const createTime = msg.createTime;
    const pdfUrls = msg.pdfUrls;
    const apiCallBackUrl = msg.apiCallBackUrl;

    if (meetingId && meetingNo && reportNum && createTime && pdfUrls && apiCallBackUrl) {
      const filePath = `${__dirname}/${meetingNo}-${reportNum}-${createTime}.zip`;
      var output = fs.createWriteStream(filePath);
      var archive = archiver('zip', {
        zlib: { level: 9 }
      });

      for (const pdfUrl of pdfUrls) {
        const decodeUrl = urlDecoder(pdfUrl);
        const pdfName = getPdfName(decodeUrl);
        if (!pdfName) {
          // 抛异常告诉api
          throw new Error('文件名异常!');
        }
        const result = yield ossClient.get(`smzg/${pdfName}`);

        const curTime = `${new Date().getTime()}`;
        archive.append(result.content, { name: `${pdfName}-${curTime}.pdf` });
      }


      archive.on('warning', (err) => {
        log.error('pdfPackTask --> archive warning', err);
      });
      archive.pipe(output);
      archive.finalize();

      yield new Promise((resolve, reject) => {
        output.on('close', () => {
          console.log('-------全部下载完成;');
          console.log(`${archive.pointer()}total bytes`);
          co(function* () {
            // 回调发生给api端
            const result = yield ossClient.multipartUpload(`smzg/${meetingNo}-${reportNum}-${createTime}.zip`,
              `${filePath}`
              // , {
              //   progress: function* (p) {
              //     console.log('Progress: ', p);
              //   }
              // }
            );
            // call-back api
            if (result.res) {
              if (result.res.statusCode !== 200) {
                throw new Error(JSON.stringify(result));
              }
            }
            // 上传成功后 删除本地文件
            if (filePath) {
              fs.unlinkSync(filePath, error => {
                if (error) {
                  console.log(error);
                  log.error(`delete upload file error: ${filePath}`);
                  log.error(error);
                }
              });
            }
            const resUrl = result.res.requestUrls[0];
            const zipUrlObj = urllib.parse(resUrl, true);
            const zipUrl = urllib.resolve(ossConf.urlAliasPrefix, zipUrlObj.pathname);
            console.log('回调: ', apiCallBackUrl);
            if (zipUrl && apiCallBackUrl) {
              // 回调给api 当前场次上传成功!
              const body = {
                meetingZipUrl: zipUrl,
                meetingId,
                meetingStatus: 2  // 待打印
              };
              const args = {
                url: apiCallBackUrl,
                body,
                method: 'POST',
                json: true
              };
              const resp = yield rp(args);
              if (resp.retCode === 0) {
                log.info('pack pdf task complete!');
              }
              // TODO UnhandledPromiseRejectionWarning 异常信息!!!
              // else {
              //   // throw new Error(JSON.stringify(resp));
              //   log.error(JSON.stringify(resp));
              // }
            }
          }).then(() => {
            resolve();
          }).catch(err => {
            reject(err);
          });
        });
        archive.on('error', (err) => {
          log.error('pdfPackTask --> archive error', err);
          reject(err);
        });
      });
    }
  });
}

module.exports.pdfPackTask = function* (consumerChannel) {
  yield consumerChannel.assertExchange(pdfTaskExchange, 'direct');
  yield consumerChannel.assertQueue(pdfPackTaskQueue, {
    durable: true,
    arguments: {
      'x-dead-letter-exchange': 'DeadExchange',
      'x-dead-letter-routing-key': 'pdfPack',
      'x-message-ttl': 18000000
    }
  });
  yield consumerChannel.bindQueue(pdfPackTaskQueue, pdfTaskExchange, 'rkRetry');
  consumerChannel.prefetch(1);
  consumerChannel.consume(pdfPackTaskQueue, (msg) => {
    const msgStr = msg.content.toString();
    const msgObj = JSON.parse(msgStr);
    // 执行业务处理
    downloadMeetingZip(msgObj).then(() => {
      consumerChannel.ack(msg);
    })
      .catch(() => {
        try {
          const headers = msg.properties.headers || {};
          const retryCount = (headers['x-retries'] || 0) + 1;
          if (retryCount >= pdfGenMaxTry) {
            log.error(`场次${msgObj.meetingNo}三次重试出错!`);
            consumerChannel.ack(msg);
          } else {
            headers['x-retries'] = retryCount;
            msg.properties.headers = headers;
            consumerChannel.publish(pdfTaskExchange, 'rkRetry', msg.content, msg.properties);
            consumerChannel.ack(msg);
          }
        } catch (errRetry) {
          consumerChannel.nack(msg);
          log.error('重试过程中出错，错误为', errRetry);
        }
      });
  });
};