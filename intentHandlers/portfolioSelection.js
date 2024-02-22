const {
  getPortfolioData,
  GetInvestmentList,
} = require('../db/dbHandler/getPortfolioValuation');
const { getPhoneNumber } = require('../utils/helper');
const { generatePortfolioList } = require('../utils/portfolioHelper');

function handlePortfolioSelectionIntent(agent) {
  console.log('handlePortfolioSelectionIntent');
  let phoneNumber = getPhoneNumber(agent);
  let message = '';
  if (!phoneNumber) {
    messgae = 'Session ended\nPlease Provide your phone number to login again';
    agent.add(message);
    return;
  }
  let userSelectedNumber = agent.parameters.portfolionumber;
  let portfolioData = getPortfolioData(phoneNumber, userSelectedNumber);
  let { portfolio } = GetInvestmentList(phoneNumber);
  if (!portfolioData) {
    message = `${userSelectedNumber} is not a valid portfolio number\n\n`;
    message += 'Please select from below list';
    let payload = generatePortfolioList(agent, portfolio, message);
    agent.add(payload);
    return;
  }
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

  message = `Your Portfolio No. "${portfolio_id}" on "${date}" is \n\n Fund Category  ${fund_category}\n Fund Name  ${fund_name}\n Investmented amount  ${investment_amount}\n Current Value  ${current_value}\n`;

  agent.add(message);
}

module.exports = handlePortfolioSelectionIntent;
