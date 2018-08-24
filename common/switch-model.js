const commonConst = require('../constants/common');
const smzgModels = require('../models/smzg');
const appModel = require('../models/app');

const PRODUCT_TYPE = commonConst.PRODUCT_TYPE;

module.exports.getModel = function (productId, modelName) {
  switch (productId) {
    case PRODUCT_TYPE.SMZG:
      return smzgModels[modelName];
    case PRODUCT_TYPE.SPORT:
      return smzgModels[modelName];
    case PRODUCT_TYPE.NUTRITION:
      return smzgModels[modelName];
    default:
      return null;
  }
};

module.exports.getReport = function (isSubReport) {
  if (isSubReport) {
    return appModel.SubReport;
  }
  return appModel.Report;
};