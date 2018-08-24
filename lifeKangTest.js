/**
 * Created by work on 18/5/9.
 */
const fs = require('fs');
const lifeKang = require('./pdf/pdfDataObj');
const geneLifeHealth = require('./pdf/generalduty/generalduty');
geneLifeHealth(lifeKang.dataObj).stream.pipe(fs.createWriteStream('lifeKangTest.pdf'));