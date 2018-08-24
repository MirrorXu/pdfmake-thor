/* eslint-disable */
const MongoClient = require('mongodb').MongoClient;
const co = require('co');
const url = 'mongodb://192.168.1.202:27017';

function insertMongo() {
  co(function* () {
    let client = yield MongoClient.connect(url);
    let db = client.db('testMassiveData');
    let col = db.collection('rsids');
    for (let i = 0; i < 20000000; i++) {
      let r = [];
      for (let j = 0; j < 1000; j++) {
        r.push({sample_name : `NA${Math.random() * 18564000}`, rsid : `rs${Math.random() * 3000000}`, allel1 : "C",
allel2 : "T", chrom : `${Math.random() * 3000}`, "pos" : `${new Date().getTime()}`});
      }
      yield col.insertMany(r);
      r = null;
    }
    db.close();
    console.log('===========finish=========');
  }).catch((err) => {
    console.log(err.stack);
  });
}

insertMongo();

