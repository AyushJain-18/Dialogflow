const { isInPhoneNumberCollectionProcess } = require('../utils/phoneUtils');

const {
  isInMutualFundSelectionProcess,
} = require('../utils/mutualFundSelectionHelper');

function handleFallbackIntent(agent) {
  console.log('handleFallbackIntent');
  let payload = isInPhoneNumberCollectionProcess(agent);
  if (payload) {
    agent.add(payload);
    return;
  }
  let message = isInMutualFundSelectionProcess(agent);
  message =
    message ||
    'We did not get this.\nTo begin please type Start. \nTo explore various mutuals fund, please type Explore';
  agent.add(message);
}

module.exports = handleFallbackIntent;
