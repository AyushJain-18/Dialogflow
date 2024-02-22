const { getPortfolioData } = require('../db/dbHandler/getPortfolioValuation');
const { getPhoneNumber } = require('../utils/helper');

function handlePortfolioSelectionIntent(agent) {
  console.log('handlePortfolioSelectionIntent');
  let userSelectedNumber = agent.parameters.portfolionumber;
  let phoneNumber = getPhoneNumber(agent);
  if (!phoneNumber) {
    agent.add('Session ended\nPlease Provide your phone number to login again');
    return;
  }
  let portfolioData = getPortfolioData(phoneNumber, userSelectedNumber);
  let {
    fund_category,
    fund_name,
    current_value,
    investment_amount,
    portfolio_id,
  } = portfolioData;
  let currentDate = new Date();
  let date = `${currentDate.getDate()}-${
    currentDate.getMonth() + 1
  }-${currentDate.getFullYear()}`;

  let message = `Your Portfolio No. "${portfolio_id}" on "${date}" is \n\n Fund Category  ${fund_category}\n Fund Name  ${fund_name}\n Investmented amount  ${investment_amount}\n Current Value  ${current_value}\n`;

  agent.add(message);
}

module.exports = handlePortfolioSelectionIntent;
