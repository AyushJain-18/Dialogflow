const data = require('../db.json');
const GetInvestmentList = (userPhoneNumber) => {
  let userPortfolioData = data.portfolio_details[`${userPhoneNumber}`];
  return userPortfolioData;
};

const getPortfolioData = (userPhoneNumber, portfolio_id) => {
  let userPortfolioData = GetInvestmentList(userPhoneNumber);
  let portfolioData = userPortfolioData?.portfolio.filter(
    (eachPolio) => eachPolio.portfolio_id === portfolio_id
  );
  return portfolioData?.length > 0 ? portfolioData[0] : null;
};

module.exports = { GetInvestmentList, getPortfolioData };
