const { Payload } = require('dialogflow-fulfillment');
const {
  isPhoneNumberExist,
  isInOtherUserSelectionProcess,
} = require('../utils/phoneUtils');
const { callProvideNumFollowUpEvent } = require('../utils/followUpEvents');
const {
  setUserOperation,
  USER_OPERATION,
  createPayload,
} = require('../utils/helper');
const { GetInvestmentList } = require('../db/dbHandler/getPortfolioValuation');
const {
  isInMutualFundSelectionProcess,
} = require('../utils/mutualFundSelectionHelper');
const { generatePortfolioList } = require('../utils/portfolioHelper');

function handlePortfolioValuationIntent(agent) {
  console.log('handlePortfolioValuationIntent');
  let payload = isInOtherUserSelectionProcess(
    agent,
    USER_OPERATION.PORTFOLIO_VALUATION
  );
  if (payload) {
    agent.add(payload);
    return;
  }
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

  let allInvestment = GetInvestmentList(userPhoneNumber);

  if (!allInvestment) {
    handleEmptyPortfolio(agent, userPhoneNumber);
    return;
  }
  // when user have portofilio under thier account.
  const { name, portfolio, phone_number } = allInvestment;
  message = `Hello ${name}\nBelow is list of your investment linked to account ${phone_number}\n\n`;
  payload = generatePortfolioList(agent, portfolio, message);
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
