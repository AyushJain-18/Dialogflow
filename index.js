const express = require('express');
const bodyParser = require('body-parser');
const { WebhookClient } = require('dialogflow-fulfillment');
const handleWelcomeIntent = require('./intentHandlers/welcome');
const handleFundExplorerIntent = require('./intentHandlers/fundExplore');
const handleFundCategorySelection = require('./intentHandlers/fundCategorySelection');
const handleMutualFundSelection = require('./intentHandlers/mutualFundSelection');
const handleFallbackIntent = require('./intentHandlers/fallback');
const handlePortfolioValuationIntent = require('./intentHandlers/portfolioValuation');
const handlePhoneNumberIntent = require('./intentHandlers/phoneNumber');
const handleLogoutIntent = require('./intentHandlers/logoutIntent');
const handleOtherButtonIntent = require('./intentHandlers/otherButtunIntent');
const handlePortfolioSelectionIntent = require('./intentHandlers/portfolioSelection');
const handleTranscationHistoyIntent = require('./intentHandlers/transactionHistory');

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());

app.get('/', (req, res) => res.send('online'));

// Handle POST requests to /webhook
app.post('/dialogflow', (req, res) => {
  const agent = new WebhookClient({ request: req, response: res });

  // Map the Dialogflow intent handlers to the corresponding intent names
  let intentMap = new Map();
  intentMap.set('WelcomeIntent', handleWelcomeIntent);
  intentMap.set('Fallback', handleFallbackIntent);
  intentMap.set('LOGOUT_INTENT', handleLogoutIntent);
  intentMap.set('PHONE_NUMBER_INPUT_INTENT', handlePhoneNumberIntent);

  // intent for operation type
  intentMap.set('PORTFOLIO_VALUATION', handlePortfolioValuationIntent);
  intentMap.set('FUND_EXPLORER', handleFundExplorerIntent);
  intentMap.set('TRANSACTION_HISTORY', handleTranscationHistoyIntent);
  intentMap.set('OTHER_BUTTON_INTENT', handleOtherButtonIntent);

  // Fund category and selection
  intentMap.set('MUTUAL_FUND_CATEGORY_SELECTION', handleFundCategorySelection);
  intentMap.set('MUTUAL_FUND_SELECTION', handleMutualFundSelection);
  intentMap.set(
    'PORTFOLIO_VALUATION_SELECTION',
    handlePortfolioSelectionIntent
  );
  agent.handleRequest(intentMap);
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// todo.
// 1. when user sleect invest or main menu then MFdetails entent should end
// 2. when user type only 3 number, then fallback intent is triggering which says that we dont get
// this instead it should say that phone number is not correct
// 3. when lifespan is undined then Mutual fund category should not gave any result

// FundCategory-followup
