'use strict';

const bunyan = require('bunyan');

module.exports = bunyan.createLogger({
  name: 'thorgene-gene',
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
});