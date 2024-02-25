const data = require('../db.json');

const getAllTxnHistory = (phoneNumber) => {
  return data.transactions[`${phoneNumber}`]?.allTxn;
};

const getTxnHistory = (phoneNumber, date) => {
  let startTime = date.startDate;
  let endTime = date.endDate;
  let allTxn = getAllTxnHistory(phoneNumber);

  // console.log('start date', startTime);
  // console.log('end date', endTime);

  allTxn = allTxn.filter((eachTxn) => {
    let investmentime = new Date(eachTxn.investment_date).getTime();
    if (startTime < investmentime && investmentime < endTime) {
      return eachTxn;
    }
    return null;
  });
  // console.log('allTxn', allTxn);
  return allTxn;
};
module.exports = { getAllTxnHistory, getTxnHistory };
