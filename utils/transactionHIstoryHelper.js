const { Payload } = require('dialogflow-fulfillment');
const { createPayload } = require('./helper');

function getFinancialYear(today, type = 'current') {
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
  return {
    startDate: new Date(`${startYear}-04-01`).getTime(),
    endDate: new Date(`${endYear}-03-31`).getTime(),
  };
}
function convertTextToDate(text) {
  text = text.trim().toLocaleLowerCase();
  let currentYearRegex =
    /\b((?:current|this|ongoing) (?:financial )(?:year|month))\b/i;
  let lastYearRegex = /\b((?:previous|last) (?:financial )(?:year|month))\b/i;
  let dateRegex =
    /((?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{4})\b/i;
  let yearRegex = /\b\d{4}\b/i;
  let regex = /^\d{2}[\/-]\d{2}[\/-]\d{4}$/g;
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
  if (yearRegex.test(text)) {
    const matches = text.match(yearRegex);
    return getFinancialYear(new Date(matches[0]));
  }
  if (regex.test(text)) {
    const matches = text.match(regex);
    return getFinancialYear(new Date(matches[0]));
  }
}

function getDateFromUserQuery(agent, userText) {
  const dateRegex = /(\d{2}[\/-]\d{2}[\/-]\d{4})\b/g;
  const regex =
    /\b(?:current|this|next|previous|last|ongoing) (?:financial )(?:year|month)\b|(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{4}\b/gi;
  const combinedRegex = new RegExp(
    `(${dateRegex.source})|(${regex.source})`,
    'gi'
  );

  const matches = userText.match(combinedRegex);
  let result = {};
  if (matches?.length > 0) {
    matches.forEach((match, index) => {
      let data = convertTextToDate(match);
      result[`${index}`] = data;
    });
    let dateObj = {
      startDate: new Date().getTime(),
      endDate: new Date(1).getTime(),
    };
    Object.values(result).forEach((eachObj) => {
      if (dateObj?.startDate > eachObj.startDate) {
        dateObj.startDate = eachObj.startDate;
      }
      if (dateObj?.endDate < eachObj.endDate) {
        dateObj.endDate = eachObj.endDate;
      }
    });
    dateObj['isValid'] = true;
    return dateObj;
  }
  // when no input match
  return onWronDateSelection(agent);
}
function getStartAndEndDate(date1, date2) {
  date1 = new Date(date1).getTime();
  date2 = date2 ? new Date(date2).getTime() : new Date().getTime();
  let startDate = date1 < date2 ? date1 : date2;
  let endDate = date1 < date2 ? date2 : date1;
  // todo
  // let { startYear } = getFinancialYear(startDate);
  // let { endYear } = getFinancialYear(endDate);
  return { startDate, endDate, isValid: true };
}
function onWronDateSelection(agent) {
  let message =
    'Please provide a correct time period.\nOR you can select a option from below';
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
          callback_data: 'Enter date',
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
