const data = require('../db.json');
const getUserPortfolioData = (userPhoneNumber) => {
  let userPortfolioData = data.portfolio_details[`${userPhoneNumber}`];
  return userPortfolioData;
};

const getPortfolioData = (userPhoneNumber, portfolio_id) => {
  let userPortfolioData = getUserPortfolioData(userPhoneNumber);
  let portfolioData = userPortfolioData?.portfolio.filter(
    (eachPolio) => eachPolio.portfolio_id === portfolio_id
  );
  return portfolioData?.length > 0 ? portfolioData[0] : [];
};

module.exports = { getUserPortfolioData, getPortfolioData };
