const { Payload } = require('dialogflow-fulfillment');
const {
  createPayload,
  deleteSelectedCategoryContext,
} = require('../utils/helper');

function handleWelcomeIntent(agent) {
  console.log('handleWelcomeIntent');
  deleteSelectedCategoryContext(agent);
  let text =
    'Welcome to ABC Mutual Fund Service. Please select any one option to begin with';
  const buttons = {
    inline_keyboard: [
      [
        {
          text: 'Portfolio Valuation',
          callback_data: 'PORTFOLIO_VALUATION',
        },
      ],
      [
        {
          text: 'Fund Explorer',
          callback_data: 'FUND_EXPLORER',
        },
      ],
      [
        {
          text: 'Transaction History',
          callback_data: 'TRANSACTION_HISTORY',
        },
      ],
    ],
  };
  const payload = createPayload(Payload, agent, {
    text: text,
    reply_markup: buttons,
  });
  agent.add(payload);
}

module.exports = handleWelcomeIntent;
