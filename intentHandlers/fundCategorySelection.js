const {
  getDebtMutualFunds,
  getHybridMutualFunds,
  getSOFMutualFunds,
  getEquityMutualFunds,
} = require('../db/dbHandler/getFundsDetails');
const { setSelectedCategoryContext } = require('../utils/helper');
const { isInOtherUserSelectionProcess } = require('../utils/phoneUtils');
const {
  isInMutualFundSelectionProcess,
  displayListOfSelectedMutualFunds,
} = require('../utils/mutualFundSelectionHelper');

function handleFundCategorySelection(agent) {
  console.log('handleFundCategorySelection');
  let payload = isInOtherUserSelectionProcess(agent);
  if (payload) {
    agent.add(payload);
    return;
  }
  let message = isInMutualFundSelectionProcess(agent);
  if (message) {
    agent.add(message);
    return;
  }
  let selectedFundCategory = agent.parameters.FundsCategory;
  selectedFundCategory = selectedFundCategory.toLocaleLowerCase();
  let allFunds = [];
  let selectedCategory = 0;
  switch (selectedFundCategory) {
    case 'equity':
    case 'equity fund':
    case 'equity funds':
      allFunds = getEquityMutualFunds();
      selectedCategory = 1;
      break;
    case 'debt':
    case 'debt funds':
    case 'debt funds':
      allFunds = getDebtMutualFunds();
      selectedCategory = 2;
      break;
    case 'hybrid':
    case 'hybrid funds':
    case 'hybrid funds':
      allFunds = getHybridMutualFunds();
      selectedCategory = 3;
      break;
    case 'sof':
    case 'solution oriented':
    case 'solution oriented funds':
    case 'solution oriented fund':
      selectedCategory = 4;
      allFunds = getSOFMutualFunds();
      break;
    default:
      allFunds = [];
      selectedCategory = 0;
      break;
  }
  // when user select wrong category.
  if (selectedCategory === 0) {
    message = 'Wrong input selection\n';
    message += `Press 0 for Main Menu\n`;
    agent.add(message);
    return;
  }
  // sharing the value of categroy selected to follow up intent.
  setSelectedCategoryContext(agent, selectedCategory, allFunds.length);
  // preparing the message.
  message = displayListOfSelectedMutualFunds(selectedFundCategory, allFunds);
  agent.add(message);
}

module.exports = handleFundCategorySelection;
