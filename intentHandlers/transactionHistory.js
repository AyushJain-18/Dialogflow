const { callProvideNumFollowUpEvent } = require('../utils/followUpEvents');
const { Payload } = require('dialogflow-fulfillment');
const { getTxnHistory } = require('../db/dbHandler/getTxnDetails');
const {
  onWronDateSelection,
  getStartAndEndDate,
  getDateFromUserQuery,
} = require('../utils/transactionHistoryHelper');

const {
  isInMutualFundSelectionProcess,
} = require('../utils/mutualFundSelectionHelper');
const {
  setUserOperation,
  USER_OPERATION,
  createPayload,
  setUserDate,
  getUserDate,
  deleteUserOperationContext,
} = require('../utils/helper');
const {
  isPhoneNumberExist,
  isInOtherUserSelectionProcess,
} = require('../utils/phoneUtils');

function handleTranscationHistoyIntent(agent) {
  console.log('handleTranscationHistoyIntent', agent.parameters);
  if (agent.query === 'table-cell') {
    agent.add('');
    return;
  }
  // if other operation are in process.
  let payload = isInOtherUserSelectionProcess(
    agent,
    USER_OPERATION.TRANSACTION_HISTORY
  );
  if (payload) {
    agent.add(payload);
    return;
  }
  // if user currently in process of selecting mutual fund.
  let message = isInMutualFundSelectionProcess(agent);
  if (message) {
    agent.add(message);
    return;
  }
  // setting user operation so that subsequent operation knows that user clicks on Txn history
  setUserOperation(agent, USER_OPERATION.TRANSACTION_HISTORY);
  // get user enter date
  let userContextDate = getUserDate(agent);
  let formatedDate = {};
  const date =
    agent.parameters['date'].length !== 0
      ? agent.parameters['date']
      : userContextDate?.parameters?.userDate?.date || [];
  const userText =
    agent.query !== 'TRANSACTION_HISTORY_EVENT'
      ? agent.query
      : userContextDate?.parameters?.userDate?.userText || '';
  // check if user phone number exist.
  let userPhoneNumber = isPhoneNumberExist(agent);
  if (!userPhoneNumber) {
    // if phone number is not present.
    let userDate = { date: date, userText: userText };
    console.log('User data to be set', userData);
    setUserDate(agent, userDate);
    callProvideNumFollowUpEvent(agent);
    agent.add('Please provie phone number to proceed further');
    return;
  }

  // when user opt to enter date.
  if (userText === 'Enter date') {
    let message =
      'Please provide start and end date in DD/MM/YYYY format to proceed futher';
    agent.add(message);
    return;
  }

  switch (date.length) {
    case 2:
      formatedDate = getStartAndEndDate(date[0], date[1]);
      break;

    case 1:
      formatedDate = getStartAndEndDate(date[0]);
      break;

    case 0:
      formatedDate = getDateFromUserQuery(agent, userText);
      break;

    default:
      formatedDate = onWronDateSelection(agent);
      break;
  }
  if (!formatedDate.isValid) {
    // not a valid date, hence sending worng date selection payload which will be stored in formatedDate back to user
    agent.add(formatedDate);
    return;
  }
  //  agent.add(new Suggestion({ title: 'Hello ' }));
  console.log('formated user date is', formatedDate);
  setUserDate(agent, formatedDate);
  let allTxn = getTxnHistory(userPhoneNumber, formatedDate);
  if (allTxn.length === 0) {
    agent.add(
      `No investment found from ${formatedDate.startDate} to ${formatedDate.endDate}`
    );
    return;
  }
  // console.log('History is', his);
  const inlineKeyboard = {
    inline_keyboard: [
      [
        { text: 'Mutual Fund Name', callback_data: 'table-cell' },
        { text: 'Investment amount', callback_data: 'table-cell' },
        { text: 'Investment date', callback_data: 'table-call' },
      ],
    ],
  };
  allTxn.forEach((txn) => {
    inlineKeyboard.inline_keyboard.push([
      { text: txn.fund_name, callback_data: 'table-cell' },
      { text: txn.investment_amount, callback_data: 'table-cell' },
      { text: txn.investment_date, callback_data: 'table-call' },
    ]);
  });
  payload = createPayload(Payload, agent, {
    text: `Here are your transaction from ${new Date(
      formatedDate.startDate
    ).toLocaleDateString()} to ${new Date(
      formatedDate.endDate
    ).toLocaleDateString()}`,
    reply_markup: inlineKeyboard,
  });
  const buttons = {
    inline_keyboard: [
      [
        { text: 'Yes', callback_data: 'Invest' },
        { text: 'No', callback_data: 'Thank you' },
      ],
    ],
  };
  agent.add(payload);
  agent.add(
    'Do you want to invest more?\nPlease type yes to confirm no to ignore.'
  );
  deleteUserOperationContext(agent);
}

module.exports = handleTranscationHistoyIntent;
