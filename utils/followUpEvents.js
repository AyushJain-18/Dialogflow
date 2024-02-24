const callWelcomeFollowUpEvent = (agent) => {
  agent.setFollowupEvent('WELCOME_INTENT');
};

const callFundExplorerFollowUpEvent = (agent) => {
  agent.setFollowupEvent('FUND_EXPLORE_EVENT');
};
const callProvideNumFollowUpEvent = (agent) => {
  agent.setFollowupEvent('PROVIDE_PHONE_NUMBER');
};

const callProfileValuationFollowUpEvent = (agent) => {
  agent.setFollowupEvent('PORTFOLIO_VALUATION_EVENT');
};

const callPortfolioSelectionFollowUpEvent = (agent) => {
  agent.setFollowupEvent('PORTFOLIO_VALUATION_SELECTION_EVENT');
};

const callTransationHistryFollowUpEvent = (agent) => {
  agent.setFollowupEvent('TRANSACTION_HISTORY_EVENT');
};

module.exports = {
  callProvideNumFollowUpEvent,
  callWelcomeFollowUpEvent,
  callProfileValuationFollowUpEvent,
  callPortfolioSelectionFollowUpEvent,
  callTransationHistryFollowUpEvent,
  callFundExplorerFollowUpEvent,
};
