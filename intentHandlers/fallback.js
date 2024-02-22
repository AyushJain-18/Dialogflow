const { isInPhoneNumberCollectionProcess } = require('../utils/phoneUtils');

const {
  isInMutualFundSelectionProcess,
} = require('../utils/mutualFundSelectionHelper');

function handleFallbackIntent(agent) {
  console.log('handleFallbackIntent');
  isInPhoneNumberCollectionProcess(agent);
  let message = isInMutualFundSelectionProcess(agent);
  message =
    message ||
    'We did not get this.\n To begin please type Start \n To explore various mutuals fund, please type Explore';
  agent.add(message);
}

module.exports = handleFallbackIntent;