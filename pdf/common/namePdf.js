/**
 * Created by work on 17/8/10.
 */

/* eslint-disable */
module.exports = function (ownerName, productName, sampleNo, meetingNo) {
  const name = typeof ownerName === 'string' ? ownerName : '索真医学';
  const pName = typeof productName === 'string' ? productName : '索真基因检测';
  const sNo = typeof sampleNo === 'string' ? sampleNo : '';
  const mNo = typeof meetingNo === 'string' ? ('-' + meetingNo) : '';
  // var timeStamp = new Date().getFullYear().toString() + '-' + (new Date().getMonth() + 1).toString()
  //   + '-' + new Date().getDate().toString();
  return name + '-' + pName + '-' + sNo + mNo + '.pdf';
};
