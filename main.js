/**
 * 从消息队列中取出数据，生成pdf，以及上传到ali－oss
 * @input data {
 *    rtnUrl: '' // 上传成功回调
 *    dataObj: {} // pdf报告所需数据
 *    reportType: '" // 生成报告类型
 * }
 *
 * */

require('./rabbitmq/mqTask');

