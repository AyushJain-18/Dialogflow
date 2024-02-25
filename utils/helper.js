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
  PORTFOLIO_SELECTION: 'portfolio_valuation-followup',
  USER_TRXN_DATE: 'user_trxn_date',
  SELECTED_FUND: 'user_selected_mutual_fund',
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
  let data = getPhoneNumberContext(agent);
  const phoneNumber = data?.parameters.phoneNumber;
  // console.log('Phone number object form helper.js', data);
  return phoneNumber || null;
}
function getPhoneNumberContext(agent) {
  let data = agent.context.get(USER_CONTEXT.PHONE_NUMBER);
  return data;
}
function cleanupPhoneNumber(agent) {
  console.log('deleting session');
  agent.context.delete(USER_CONTEXT.PHONE_NUMBER);
  agent.context.delete(USER_CONTEXT.OPERATION);
  agent.context.delete(USER_CONTEXT.FUND_CATEGORY);
  agent.context.delete(USER_CONTEXT.PORTFOLIO_SELECTION);
  agent.context.delete(USER_CONTEXT.USER_TRXN_DATE);
  agent.context.delete(USER_CONTEXT.SELECTED_FUND);
  clearInterval(intervalID);
  intervalID = null;
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

// this follow up content, when user click on valuation it been setup in dialogflow
function getPortfolioSelectionContext(agent) {
  let data = agent.context.get(USER_CONTEXT.PORTFOLIO_SELECTION);
  return data;
}

// to determine user enter date for transaction history
function setUserDate(agent, userDate) {
  const context = {
    name: USER_CONTEXT.USER_TRXN_DATE,
    lifespan: 5,
    parameters: { userDate },
  };
  agent.context.set(context);
}

function getUserDate(agent) {
  const userDate = agent.context.get(USER_CONTEXT.USER_TRXN_DATE);
  return userDate || null;
}
function deleteUserDate(agent) {
  agent.context.delete(USER_CONTEXT.USER_TRXN_DATE);
}

function setSelectedMFContext(agent, fundNo) {
  const context = {
    name: USER_CONTEXT.SELECTED_FUND,
    lifespan: 5,
    parameters: { fundNo },
  };
  agent.context.set(context);
}

function getSelectedMFContext(agent) {
  const fundNo = agent.context.get(USER_CONTEXT.SELECTED_FUND)?.parameters
    ?.fundNo;
  return fundNo || null;
}
function deleteSelectedMFContext(agent) {
  agent.context.delete(USER_CONTEXT.SELECTED_FUND);
}
module.exports = {
  USER_OPERATION,
  USER_CONTEXT,
  createPayload,
  setSelectedCategoryContext,
  getSelectedCategoryContext,
  setPhoneNumber,
  getPhoneNumber,
  getPhoneNumberContext,
  cleanupPhoneNumber,
  getUserOperation,
  setUserOperation,
  deleteUserOperationContext,
  deleteSelectedCategoryContext,
  getPortfolioSelectionContext,
  getUserDate,
  setUserDate,
  deleteUserDate,
  setSelectedMFContext,
  getSelectedMFContext,
  deleteSelectedMFContext,
};
