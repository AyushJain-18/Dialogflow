const { Payload } = require('dialogflow-fulfillment');
const { createPayload } = require('../utils/helper');
const {
  isInMutualFundSelectionProcess,
} = require('../utils/mutualFundSelectionHelper');
const { isInOtherUserSelectionProcess } = require('../utils/phoneUtils');

// Intent handler for FundExplorerIntent
function handleFundExplorerIntent(agent) {
  console.log('handleFundExplorerIntent');
  let payload = isInOtherUserSelectionProcess(agent);
  if (payload) {
    agent.add(payload);
    return;
  }
  let message = isInMutualFundSelectionProcess(agent);
  if (message) {
    agent.add(message);
    return;
  }
  const text =
    'Below are different funds category, please select anyone to proceed';
  const inlineKeyboard = {
    inline_keyboard: [
      [{ text: 'Equity Funds', callback_data: 'Equity' }],
      [{ text: 'Debt Funds', callback_data: 'Debt' }],
      [{ text: 'Hybrid Funds', callback_data: 'Hybrid' }],
      [
        {
          text: 'Solution oriented Schemes',
          callback_data: 'Solution oriented',
        },
      ],
    ],
  };
  payload = createPayload(Payload, agent, {
    text: text,
    reply_markup: inlineKeyboard,
  });
  agent.add(payload);
}

module.exports = handleFundExplorerIntent;
