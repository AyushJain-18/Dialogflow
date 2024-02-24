const {
  callWelcomeFollowUpEvent,
  callProvideNumFollowUpEvent,
} = require('../utils/followUpEvents');
const {
  setUserOperation,
  USER_OPERATION,
  deleteSelectedCategoryContext,
} = require('../utils/helper');
const { isInOtherUserSelectionProcess } = require('../utils/phoneUtils');

function handleOtherButtonIntent(agent) {
  console.log('handleOtherButtonIntent');
  let payload = isInOtherUserSelectionProcess(agent);
  if (payload) {
    agent.add(payload);
    return;
  }
  deleteSelectedCategoryContext(agent);
  let queryText = agent.query;
  queryText = String(queryText).trim().toLocaleLowerCase();

  if (queryText === 'invest') {
    setUserOperation(agent, USER_OPERATION.INVEST);
    callProvideNumFollowUpEvent(agent);
  }

  if (queryText === 'main menu') {
    callWelcomeFollowUpEvent(agent);
  }
  agent.add('respose');
}

module.exports = handleOtherButtonIntent;
