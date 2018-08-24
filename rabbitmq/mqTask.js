'use strict';
const config = require('config');
const co = require('co');
const amqp = require('amqplib');
const log = require('../logger/index');
const pdfTask = require('./pdfGenTask').pdfTask;
const pdfPackTask = require('./pdfPackTask').pdfPackTask;

co(function*() {
  const Conn = yield amqp.connect(config.get('amqpAddr'));
  const consumerChannel = yield Conn.createChannel();
  yield pdfTask(consumerChannel);
  yield pdfPackTask(consumerChannel);
})
  .catch((err) => {
    log.error(err);
  });