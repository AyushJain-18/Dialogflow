const {
  callWelcomeFollowUpEvent,
  callProvideNumFollowUpEvent,
  callFundExplorerFollowUpEvent,
} = require('../utils/followUpEvents');
const {
  setUserOperation,
  USER_OPERATION,
  deleteSelectedCategoryContext,
  getUserDate,
  deleteUserDate,
} = require('../utils/helper');
const { isInOtherUserSelectionProcess } = require('../utils/phoneUtils');

function handleOtherButtonIntent(agent) {
  console.log('handleOtherButtonIntent');
  let payload = isInOtherUserSelectionProcess(agent);
  if (payload) {
    agent.add(payload);
    return;
  }
  let queryText = agent.query;
  queryText = String(queryText).trim().toLocaleLowerCase();

  if (queryText === 'invest') {
    setUserOperation(agent, USER_OPERATION.INVEST);
    callProvideNumFollowUpEvent(agent);
  }

  if (queryText === 'main menu') {
    deleteSelectedCategoryContext(agent);
    callWelcomeFollowUpEvent(agent);
  }
  let userDate = getUserDate(agent)?.parameters?.userDate;
  if (queryText === 'yes' && !!userDate) {
    deleteUserDate(agent);
    callFundExplorerFollowUpEvent(agent);
  }
  if (queryText === 'no' && !!userDate) {
    deleteUserDate(agent);
    agent.add('Thank you for using our service');
    return;
  }
  agent.add('We didnt get this.\n Please type start to begin with');
}

module.exports = handleOtherButtonIntent;
