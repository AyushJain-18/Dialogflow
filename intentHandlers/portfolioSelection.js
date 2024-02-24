const { getPortfolioData } = require('../db/dbHandler/getPortfolioValuation');
const {
  getPhoneNumber,
  USER_OPERATION,
  deleteUserOperationContext,
} = require('../utils/helper');
const { isInOtherUserSelectionProcess } = require('../utils/phoneUtils');
const { onWrongPortfolioSelection } = require('../utils/portfolioHelper');

function handlePortfolioSelectionIntent(agent) {
  console.log('handlePortfolioSelectionIntent');
  let payload = isInOtherUserSelectionProcess(
    agent,
    USER_OPERATION.PORTFOLIO_VALUATION
  );
  if (payload) {
    agent.add(payload);
    return;
  }
  let phoneNumber = getPhoneNumber(agent);
  let message = '';
  if (!phoneNumber) {
    message = 'Session ended\nPlease Provide your phone number to login again';
    agent.add(message);
    return;
  }
  let userSelectedNumber = agent.parameters.portfolionumber;
  let portfolioData = getPortfolioData(phoneNumber, userSelectedNumber);
  if (!portfolioData) {
    let payload = onWrongPortfolioSelection(agent);
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
  deleteUserOperationContext(agent);
  message = `Investment detail for ${portfolio_id} as of ${date} is \n\n Fund Category  ${fund_category.replaceAll(
    '_',
    ' '
  )}\n Fund Name  ${fund_name}\n Investmented amount  ${investment_amount}\n Current Value  ${current_value}\n`;

  agent.add(message);
}

module.exports = handlePortfolioSelectionIntent;
