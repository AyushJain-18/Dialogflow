const { Payload } = require('dialogflow-fulfillment');
const { getMFDetails } = require('../db/dbHandler/getFundsDetails');
const { getSelectedCategoryContext, createPayload } = require('./helper');
const { callFundExplorerFollowUpEvent } = require('./followUpEvents');

function onWrongMutualFundSelection(lifespan, totalEquityMF) {
  let wrongInputMsg = `Wrong Input selected please enter 1 to ${totalEquityMF} to proced further.\n`;
  let mainMenuMsg = `Or type 0 for main menu \n`;
  let attemptsRemaingMsg = `${lifespan} attempts remaining`;
  let message = `${wrongInputMsg} ${mainMenuMsg} ${attemptsRemaingMsg}`;
  return message;
}
function isInMutualFundSelectionProcess(agent) {
  const { lifespan, totalFunds, category } = getSelectedCategoryContext(agent);
  let message = null;
  if (category) {
    message = onWrongMutualFundSelection(lifespan, totalFunds);
  }
  return message;
}

function displaySeletedMutualFundDetails(
  agent,
  allFunds,
  userSelectedNumber,
  selectedCategory,
  lifespan
) {
  let mutualFundName = allFunds[userSelectedNumber - 1];
  let details = getMFDetails(selectedCategory, mutualFundName);
  let text = `Here are the details of your selected mutual fund.`;
  text += `\n\n${userSelectedNumber}.${mutualFundName}`;
  text += `\n${details} \n\n for more details https://www.amfiindia.com/investor-corner/knowledge-center/what-are-mutual-funds-new.html`;
  text += `\n\nSelect 1 to ${
    allFunds.length
  } to know about other funds in ${selectedCategory
    .replace('_Details', '')
    .replace('_', '')} `;
  text += `\n${lifespan} more attemps remaining`;
  const inlineKeyboard = {
    inline_keyboard: [
      [
        { text: 'Invest', callback_data: 'Invest' },
        { text: 'Main Menu', callback_data: 'Main Menu' },
      ],
    ],
  };
  let payload = createPayload(Payload, agent, {
    text: text,
    reply_markup: inlineKeyboard,
  });
  return payload;
}

function displayListOfSelectedMutualFunds(selectedFundCategory, allFunds) {
  let message = `Below is the list of ${capitalizeFirstLetter(
    selectedFundCategory
  )} Mutual Fund \n\n`;
  allFunds.map((fund, index) => {
    message += `${index + 1}. ${fund}\n`;
  });
  message += '\n Please type its corresponding number to get more details \n\n';
  message += `Press 0 for Main Menu\n`;
  return message;
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function isMutualFundSelectedForInvestment(agent) {
  let message = isInMutualFundSelectionProcess(agent);
  if (message) {
    agent.add(message);
    return;
  }
  const { lifespan, totalFunds, category } = getSelectedCategoryContext(agent);
  if (!category) {
    callFundExplorerFollowUpEvent(agent);
    agent.add('FUND_EXPLORER');
    return;
  }
  return true;
}

module.exports = {
  isInMutualFundSelectionProcess,
  onWrongMutualFundSelection,
  displayListOfSelectedMutualFunds,
  displaySeletedMutualFundDetails,
  isMutualFundSelectedForInvestment,
};
