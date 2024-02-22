const { Payload } = require('dialogflow-fulfillment');
const {
  createPayload,
  getPortfolioSelectionContext,
  getPhoneNumber,
} = require('./helper');
const { GetInvestmentList } = require('../db/dbHandler/getPortfolioValuation');

function generatePortfolioList(agent, portfolio, message) {
  let buttons = {
    inline_keyboard: [],
  };
  portfolio.map((eachPortfolio) => {
    buttons.inline_keyboard.push([
      {
        text: eachPortfolio.portfolio_id,
        callback_data: eachPortfolio.portfolio_id,
      },
    ]);
  });
  const payload = createPayload(Payload, agent, {
    text: message,
    reply_markup: buttons,
  });
  return payload;
}

function onWrongPortfolioSelection(agent) {
  let userSelectedNumber = agent.parameters.portfolionumber;
  let phoneNumber = getPhoneNumber(agent);
  let contextData = getPortfolioSelectionContext(agent);
  if (!contextData?.lifespan) return null;
  let { portfolio } = GetInvestmentList(phoneNumber);
  let message = userSelectedNumber
    ? `you dont have any investment under ${userSelectedNumber}\n\n`
    : '';
  message += 'Please select from below list\n';
  message += `${contextData?.lifespan} chances remaing\n`;
  return generatePortfolioList(agent, portfolio, message);
}

module.exports = { generatePortfolioList, onWrongPortfolioSelection };
