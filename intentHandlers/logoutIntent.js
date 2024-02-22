const { cleanupPhoneNumber, getPhoneNumber } = require('../utils/helper');

function handleLogoutIntent(agent) {
  console.log('handleLogoutIntent');
  let phoneNumber = getPhoneNumber(agent);
  cleanupPhoneNumber(agent);
  let message =
    'You have been successfully logged out \n type start to begin with';
  if (!phoneNumber) {
    message = 'Press start to start over.';
  }
  agent.add(message);
}

module.exports = handleLogoutIntent;
