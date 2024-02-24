const { Payload } = require('dialogflow-fulfillment');
const {
  createPayload,
  deleteSelectedCategoryContext,
} = require('../utils/helper');
const { isInOtherUserSelectionProcess } = require('../utils/phoneUtils');
const {
  isInMutualFundSelectionProcess,
} = require('../utils/mutualFundSelectionHelper');

function handleWelcomeIntent(agent) {
  console.log('handleWelcomeIntent');
  isInOtherUserSelectionProcess(agent);
  let text = isInMutualFundSelectionProcess(agent);
  if (text) {
    agent.add(text);
    return;
  }
  deleteSelectedCategoryContext(agent);
  text =
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
