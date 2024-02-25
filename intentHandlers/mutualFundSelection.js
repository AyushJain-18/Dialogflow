const {
  getAllCategory,
  getCategory,
  getEquityMutualFunds,
  getDebtMutualFunds,
  getHybridMutualFunds,
  getSOFMutualFunds,
} = require('../db/dbHandler/getFundsDetails');
const {
  getSelectedCategoryContext,
  deleteSelectedCategoryContext,
  setSelectedMFContext,
} = require('../utils/helper');

const { callWelcomeFollowUpEvent } = require('../utils/followUpEvents');
const {
  onWrongMutualFundSelection,
  displaySeletedMutualFundDetails,
} = require('../utils/mutualFundSelectionHelper');

function handleMutualFundSelection(agent) {
  console.log('handleMutualFundSelection');
  let userSelectedNumber = getSelectedMutualFundNumber(agent);
  // main menu seleciton
  if (userSelectedNumber == 0) {
    agent.add('Redirecting to welcome intent');
    deleteSelectedCategoryContext(agent);
    callWelcomeFollowUpEvent(agent);
  }
  let { selectedCategory, lifespan } = getSelectedMutualFundCategory(agent);
  let allCategory = getAllCategory(agent);
  let allFunds = [];

  switch (selectedCategory) {
    case allCategory[0]: // EQUITY
      allFunds = getEquityMutualFunds();
      break;
    case allCategory[1]: // DEBT
      allFunds = getDebtMutualFunds();
      break;
    case allCategory[2]: // HyBRID
      allFunds = getHybridMutualFunds();
      break;
    case allCategory[3]: // SOF
      allFunds = getSOFMutualFunds();
      break;
  }

  const totalEquityMF = allFunds.length;
  // when user provide number within given range
  if (userSelectedNumber > 0 && userSelectedNumber <= totalEquityMF) {
    let payload = displaySeletedMutualFundDetails(
      agent,
      allFunds,
      userSelectedNumber,
      selectedCategory,
      lifespan
    );
    deleteSelectedCategoryContext(agent);
    setSelectedMFContext(agent, userSelectedNumber);
    agent.add(payload);
    return;
  }
  // when user dose not provide number within given range
  if (lifespan) {
    let message = onWrongMutualFundSelection(lifespan, totalEquityMF);
    agent.add(message);
    return;
  }
  agent.add('Redirecting to Main Menu');
  callWelcomeFollowUpEvent(agent);
}

function getSelectedMutualFundCategory(agent) {
  const selectedMutualFundCategory = getSelectedCategoryContext(agent);
  // console.log('selectedMutualFundCategory', selectedMutualFundCategory);
  let value = selectedMutualFundCategory?.category || null;
  let selectedCategory = getCategory(value);
  let lifespan = selectedMutualFundCategory.lifespan;
  return { selectedCategory, lifespan };
}

function getSelectedMutualFundNumber(agent) {
  let userSelectedNumber = agent.parameters.number;
  return userSelectedNumber;
}

module.exports = handleMutualFundSelection;
