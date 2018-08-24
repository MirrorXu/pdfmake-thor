/**
 * Created by cyt-work on 16/10/18.
 */
'use strict';

const moment = require('moment');
const execSync = require('child_process').execSync;

module.exports.dateToString = function (date) {
  if (!date) {
    return null;
  }
  return moment(date).format('YYYY-MM-DD');
};

module.exports.getAge = function (date) {
  if (!date) {
    return null;
  }

  return moment().diff(moment(date), 'years');
};

module.exports.pdfCompress = (inputFilePath, outputFilePath) => {
  const cmd = `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook -dNOPAUSE -dQUIET -dBATCH -sOutputFile=${outputFilePath} ${inputFilePath} 2>>/dev/null`;
  execSync(cmd);
};