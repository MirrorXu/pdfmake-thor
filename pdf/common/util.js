const fs = require('fs');
const http = require('http');

module.exports.exists = (pth) => {
  try {
    fs.accessSync(pth);
    return true;
  } catch (e) {
    return false;
  }
};

module.exports.mySetTimeout = (ms) => {
  var currentTime = new Date().getTime();
  while (new Date().getTime() < currentTime + ms);
};


module.exports.download = (url, path) => new Promise((resolve, reject) => {
  http.get(url, response => {
    const statusCode = response.statusCode;

    if (statusCode !== 200) {
      return reject('Download error!');
    }

    const writeStream = fs.createWriteStream(path);
    response.pipe(writeStream);

    writeStream.on('error', () => reject('Error writing to file!'));
    writeStream.on('finish', () => writeStream.close(resolve));
  });
}).catch(err => console.error(err));