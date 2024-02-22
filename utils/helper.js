const USER_OPERATION = {
  TRANSACTION_HISTORY: 'TRANSACTION_HISTORY',
  PORTFOLIO_VALUATION: 'PORTFOLIO_VALUATION',
  PHONE_NUMBER_GENERATION: 'PHONE_NUMBER_GENERATION',
  INVEST: 'INVEST',
};
const USER_CONTEXT = {
  PHONE_NUMBER: 'phone_number_context',
  OPERATION: 'user_operation_context',
  FUND_CATEGORY: 'fundcategory-followup',
};
let intervalID = null;

const createPayload = (Payload, agent, richResponse) => {
  const payload = new Payload(
    agent.TELEGRAM,
    { ...richResponse },
    {
      rawPayload: false,
      sendAsMessage: true,
    }
  );
  return payload;
};

function cleanupPhoneNumber(agent) {
  console.log('deleting session');
  agent.context.delete(USER_CONTEXT.PHONE_NUMBER);
  agent.context.delete(USER_CONTEXT.OPERATION);
  agent.context.delete(USER_CONTEXT.FUND_CATEGORY);
  clearInterval(intervalID);
  intervalID = null;
}

// to store valid phone number in context for future communication till 20 lifespans
function setPhoneNumber(agent, phoneNumber, intervalId) {
  const context = {
    name: USER_CONTEXT.PHONE_NUMBER,
    lifespan: 20,
    parameters: { phoneNumber: phoneNumber },
  };
  intervalID = intervalId;
  agent.context.set(context);
}
function getPhoneNumber(agent) {
  let data = agent.context.get(USER_CONTEXT.PHONE_NUMBER);
  const phoneNumber = data?.parameters.phoneNumber;
  console.log('Phone number object form helper.js', data);
  return phoneNumber || null;
}

// sharing the value of categroy selected to follow up intent.
const setSelectedCategoryContext = (agent, selectedCategory, totalFunds) => {
  agent.context.set({
    name: USER_CONTEXT.FUND_CATEGORY,
    lifespan: 5,
    parameters: { category: selectedCategory, totalFunds },
  });
};
const getSelectedCategoryContext = (agent) => {
  let data = agent.context.get(USER_CONTEXT.FUND_CATEGORY);
  return {
    lifespan: data?.lifespan,
    category: data?.parameters?.category,
    totalFunds: data?.parameters?.totalFunds,
  };
};
function deleteSelectedCategoryContext(agent) {
  agent.context.delete(USER_CONTEXT.FUND_CATEGORY);
}

// to determinse which operation have selected to enter phone number
function setUserOperation(agent, userOperation) {
  const context = {
    name: USER_CONTEXT.OPERATION,
    lifespan: 100,
    parameters: { userOperation },
  };
  agent.context.set(context);
}
function getUserOperation(agent) {
  const userOperation = agent.context.get(USER_CONTEXT.OPERATION)?.parameters
    ?.userOperation;
  return userOperation || null;
}
function deleteUserOperationContext(agent) {
  agent.context.delete(USER_CONTEXT.OPERATION);
}

module.exports = {
  USER_OPERATION,
  createPayload,
  setSelectedCategoryContext,
  getSelectedCategoryContext,
  setPhoneNumber,
  getPhoneNumber,
  cleanupPhoneNumber,
  getUserOperation,
  setUserOperation,
  deleteUserOperationContext,
  deleteSelectedCategoryContext,
};
