const { Payload } = require('dialogflow-fulfillment');
const { createPayload } = require('./helper');

function getFinancialYear(today, type = 'current') {
  console.log('today', today);
  const currentYear = today.getFullYear();
  const fiscalStartMonth = 3; // April (0-indexed)

  // Determine the start year of the financial year
  let startYear = currentYear;
  if (today.getMonth() < fiscalStartMonth && type === 'current') {
    startYear--;
  } else if (today.getMonth() >= fiscalStartMonth && type === 'last') {
    startYear--;
  } else if (today.getMonth() < fiscalStartMonth && type === 'last') {
    startYear -= 2;
  }

  const endYear = startYear + 1;
  console.log('getFinancialYear', startYear, endYear);
  return { startYear, endYear };
}
function convertTextToDate(text) {
  text = text.trim().toLocaleLowerCase();
  let currentYearRegex =
    /\b((?:current|this|ongoing) (?:financial )(?:year|month))\b/i;
  let lastYearRegex = /\b((?:previous|last) (?:financial )(?:year|month))\b/i;
  let dateRegex =
    /((?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{4})\b/i;
  let monthRegex = /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/i;
  let result;
  if (currentYearRegex.test(text)) {
    return getFinancialYear(new Date());
  }
  if (lastYearRegex.test(text)) {
    return getFinancialYear(new Date(), 'last');
  }
  if (dateRegex.test(text)) {
    const matches = text.match(dateRegex);
    return getFinancialYear(new Date(matches[0]));
  }
  if (monthRegex.test(text)) {
    // return getFinancialYear(new Date());
  }
}

function getDateFromUserQuery(agent, userText) {
  const regex =
    /\b((?:current|this|next|previous|last|ongoing) (?:financial )(?:year|month))|((?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{4}\b|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))\b/gi;
  const matches = userText.match(regex);
  let result = {};
  if (matches?.length > 0) {
    matches.forEach((match, index) => {
      console.log('match is', match);
      let data = convertTextToDate(match);
      result[`${index}`] = data;
      result['isValid'] = false;
    });
    console.log('result', result);
    return result;
  }
  // when no input match
  return onWronDateSelection(agent);
}
function getStartAndEndDate(date1, date2) {
  date1 = new Date(date1);
  date2 = date2 ? new Date(date2) : new Date();
  let startDate = date1 < date2 ? date1 : date2;
  let endDate = date1 < date2 ? date2 : date1;
  let { startYear } = getFinancialYear(startDate);
  let { endYear } = getFinancialYear(endDate);
  return { startDate, endDate, startYear, endYear, isValid: false };
}
function onWronDateSelection(agent) {
  let message =
    'Please provide a time period.\nyou can select a option from below';
  let suggestionChips = {
    inline_keyboard: [
      [
        {
          text: 'This financial year',
          callback_data: 'Transaction for this financial year',
        },
      ],
      [
        {
          text: 'Last financial year',
          callback_data: 'Transaction for last financial year',
        },
      ],
      [
        {
          text: 'Enter date',
          callback_data: 'Transaction',
        },
      ],
    ],
  };
  let payload = createPayload(Payload, agent, {
    text: message,
    reply_markup: suggestionChips,
  });
  return payload;
}

module.exports = {
  onWronDateSelection,
  getStartAndEndDate,
  getDateFromUserQuery,
};
