const { Payload } = require('dialogflow-fulfillment');
const { createPayload } = require('./helper');

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

module.exports = { generatePortfolioList };
