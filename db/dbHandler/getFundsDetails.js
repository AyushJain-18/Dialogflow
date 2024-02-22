const data = require('../db.json');

function getAllCategory() {
  return data.CATEGORY;
}
function getCategory(categoryNumber) {
  return data.CATEGORY[categoryNumber - 1];
}
function getDebtMutualFunds() {
  return data.Debt_Funds;
}

function getEquityMutualFunds() {
  return data.Equity_Funds;
}
function getHybridMutualFunds() {
  return data.Hybrid_Funds;
}
function getSOFMutualFunds() {
  return data.Solution_Oriented_Schemes;
}

function getMFDetails(categroyName, fundName) {
  return data[categroyName][fundName];
}

module.exports = {
  getAllCategory,
  getCategory,
  getDebtMutualFunds,
  getEquityMutualFunds,
  getHybridMutualFunds,
  getSOFMutualFunds,
  getMFDetails,
};
