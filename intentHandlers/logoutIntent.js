const { cleanupPhoneNumber } = require('../utils/helper');

function handleLogoutIntent(agent) {
  console.log('handleLogoutIntent');
  cleanupPhoneNumber(agent);
  agent.add('You have been successfully loged out \n type start to begin with');
}

module.exports = handleLogoutIntent;
