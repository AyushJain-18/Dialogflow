const { Payload } = require('dialogflow-fulfillment');
const {
  callProfileValuationFollowUpEvent,
  callTransationHistryFollowUpEvent,
} = require('../utils/followUpEvents');
const {
  setPhoneNumber,
  cleanupPhoneNumber,
  getUserOperation,
  getPhoneNumber,
  setUserOperation,
  USER_OPERATION,
  createPayload,
  deleteSelectedCategoryContext,
  setUserDate,
} = require('../utils/helper');

const {
  validatePhoneNumber,
  formatPhoneNumber,
} = require('../utils/phoneUtils');
const {
  isInMutualFundSelectionProcess,
  isMutualFundSelectedForInvestment,
} = require('../utils/mutualFundSelectionHelper');

function redirectUser(agent, phoneNumber) {
  let userOperation = getUserOperation(agent);
  if (userOperation === USER_OPERATION.PORTFOLIO_VALUATION) {
    // redirect him to  PORTFOLIO_VALUATION Intent
    callProfileValuationFollowUpEvent(agent);
    agent.add(USER_OPERATION.PORTFOLIO_VALUATION);
    return;
  }

  if (userOperation === USER_OPERATION.TRANSACTION_HISTORY) {
    // redirect him to  TRANSACTION_HISTORY Intent
    callTransationHistryFollowUpEvent(agent);
    agent.add(USER_OPERATION.TRANSACTION_HISTORY);
    return;
  }
  if (userOperation === USER_OPERATION.INVEST) {
    let isInvested = isMutualFundSelectedForInvestment(agent);
    if (isInvested) {
      deleteSelectedCategoryContext(agent);
      let message = 'Thank you for investing';
      agent.add(message);
    }
    return;
  }
  // when user provide phone number wihthout selecting any operation
  let text = `
  Your phone number is ${phoneNumber}\n  Please select any one option to begin with`;
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

function handlePhoneNumberIntent(agent) {
  console.log('handlePhoneNumberIntent');
  let message = isInMutualFundSelectionProcess(agent);
  if (message) {
    agent.add(message);
    return;
  }
  let data = getUserOperation(agent);
  let savedPhoneNumber = getPhoneNumber(agent);

  if (validatePhoneNumber(savedPhoneNumber)) {
    if (data === USER_OPERATION.TRANSACTION_HISTORY) {
      setUserDate(agent, { date: null, userText: agent.query });
      callTransationHistryFollowUpEvent(agent);
    }
    if (data === USER_OPERATION.PORTFOLIO_VALUATION) {
      callProfileValuationFollowUpEvent(agent);
    }
  }
  // console.log('data', agent.context.get('user_operation_context'));

  if (!data) {
    setUserOperation(agent, USER_OPERATION.PHONE_NUMBER_GENERATION);
  }
  let phoneNumber = agent.parameters['phone-number'] || savedPhoneNumber;
  // phone numebr not present or invalid phone number
  if (!phoneNumber || !validatePhoneNumber(phoneNumber)) {
    let returnMsg = phoneNumber
      ? `Please provide a valid phone number\nPlease try again as ${phoneNumber} is incorect.\n\nOr type exit to skip`
      : `Please provide a valid phone number to proceed ${
          data ? data.replace('_', ' ') : ''
        }\n\nOr type exit to skip`;
    agent.add(returnMsg);
    return;
  }

  // when valid phone number provided.
  phoneNumber = formatPhoneNumber(phoneNumber);
  // setting up a interval which will delete user phone number after 10 mins.
  let intervalId = setInterval(() => {
    cleanupPhoneNumber(agent);
  }, 10 * 60 * 1000);
  setPhoneNumber(agent, phoneNumber, intervalId);
  redirectUser(agent, phoneNumber);
}

module.exports = handlePhoneNumberIntent;
