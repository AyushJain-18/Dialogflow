const { Payload } = require('dialogflow-fulfillment');
const { isPhoneNumberExist } = require('../utils/phoneUtils');
const { callProvideNumFollowUpEvent } = require('../utils/followUpEvents');
const {
  setUserOperation,
  USER_OPERATION,
  createPayload,
} = require('../utils/helper');
const {
  getUserPortfolioData,
} = require('../db/dbHandler/getPortfolioValuation');
const {
  isInMutualFundSelectionProcess,
} = require('../utils/mutualFundSelectionHelper');

function handlePortfolioValuationIntent(agent) {
  console.log('handlePortfolioValuationIntent');
  let message = isInMutualFundSelectionProcess(agent);
  if (message) {
    agent.add(message);
    return;
  }
  setUserOperation(agent, USER_OPERATION.PORTFOLIO_VALUATION);
  let userPhoneNumber = isPhoneNumberExist(agent);
  if (!userPhoneNumber) {
    // if phone number is not present.
    callProvideNumFollowUpEvent(agent);
    agent.add('Please provie phone number to proceed further');
  }

  let portfolioData = getUserPortfolioData(userPhoneNumber);

  if (!portfolioData) {
    handleEmptyPortfolio(agent, userPhoneNumber);
    return;
  }

  // when user have portofilio under thier account.
  const { name, portfolio, phone_number } = portfolioData;
  message = `Hello ${name}\nBelow is list of your investment linked to account ${phone_number}\n\n`;
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
  agent.add(payload);
  return;
}

const handleEmptyPortfolio = (agent, userPhoneNumber) => {
  const buttons = {
    inline_keyboard: [
      [
        {
          text: 'Logout',
          callback_data: 'Logout',
        },
      ],
    ],
  };
  const payload = createPayload(Payload, agent, {
    text: `${userPhoneNumber} have not invested yet. Logout and tried with different account`,
    reply_markup: buttons,
  });
  agent.add(payload);
};
module.exports = handlePortfolioValuationIntent;
