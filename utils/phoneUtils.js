const { callProvideNumFollowUpEvent } = require('./followUpEvents');
const {
  getPhoneNumber,
  getUserOperation,
  USER_OPERATION,
  USER_CONTEXT,
} = require('./helper');
const { onWrongPortfolioSelection } = require('./portfolioHelper');

const isPhoneNumberExist = (agent) => {
  const phoneNumber = getPhoneNumber(agent);
  return phoneNumber || null;
};

// to check if phone number is valid or not.
const validatePhoneNumber = (phoneNumber) => {
  const regex = /^(\+91)?[6-9]\d{9}$/;
  return regex.test(phoneNumber);
};

// to convert valid phone number to stanard format.
function formatPhoneNumber(phoneNumber) {
  // Remove all spaces and hyphens from the phone number
  phoneNumber = phoneNumber.replace(/[\s-]/g, '');
  // add +91 to phone number
  if (!phoneNumber.startsWith('+91')) {
    phoneNumber = '+91' + phoneNumber;
  }
  return phoneNumber;
}

function isInPhoneNumberCollectionProcess(agent) {
  let data = getUserOperation(agent);
  let phone = isPhoneNumberExist(agent);
  if (!data) return null;

  if (!phone) {
    callProvideNumFollowUpEvent(agent);
    agent.add('Redirect to add phone number');
    return;
  }

  if (data === USER_OPERATION.PORTFOLIO_VALUATION)
    return onWrongPortfolioSelection(agent);
  if (data === USER_OPERATION.TRANSACTION_HISTORY) {
    // todo
  }
}

module.exports = {
  isPhoneNumberExist,
  validatePhoneNumber,
  formatPhoneNumber,
  isInPhoneNumberCollectionProcess,
};
