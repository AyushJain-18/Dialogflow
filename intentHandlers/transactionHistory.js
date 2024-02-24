const { Suggestion } = require('dialogflow-fulfillment');
const {
  onWronDateSelection,
  getStartAndEndDate,
  getDateFromUserQuery,
} = require('../utils/transactionHIstoryHelper');

const {
  isInMutualFundSelectionProcess,
} = require('../utils/mutualFundSelectionHelper');
const { setUserOperation, USER_OPERATION } = require('../utils/helper');
const { isPhoneNumberExist } = require('../utils/phoneUtils');

function handleTranscationHistoyIntent(agent) {
  console.log('handleTranscationHistoyIntent', agent.parameters);
  // if user currentlt in process of selecting mutual fund.
  let message = isInMutualFundSelectionProcess(agent);
  if (message) {
    agent.add(message);
    return;
  }

  // setting user operation so that subsequent operation knows that user clicks on Txn history
  setUserOperation(agent, USER_OPERATION.TRANSACTION_HISTORY);

  // check if user phone number exist.
  let userPhoneNumber = isPhoneNumberExist(agent);
  if (!userPhoneNumber) {
    // if phone number is not present.
    callProvideNumFollowUpEvent(agent);
    agent.add('Please provie phone number to proceed further');
  }

  // reading date using parameter
  const date = agent.parameters['date'];
  const userText = agent.query;
  let userDate = {};

  switch (date.length) {
    case 2:
      userDate = getStartAndEndDate(date[0], date[1]);
      break;

    case 1:
      userDate = getStartAndEndDate(date[0]);
      break;

    case 0:
      userDate = getDateFromUserQuery(agent, userText);
      break;

    default:
      userDate = onWronDateSelection(agent);
      break;
  }
  if (userDate.isError) {
    return;
  }
  //  agent.add(new Suggestion({ title: 'Hello ' }));
  agent.add(`here are your transaction`);
}

module.exports = handleTranscationHistoyIntent;
