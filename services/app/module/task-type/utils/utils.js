const lodashTemplate = require('lodash/template');

const _btoa = function (str) {
  return Buffer.from(str).toString('base64');
};

/**
 *
 * @param {*} dateString : 10/08/2023 14:30
 * @returns : 30 14 10 8 *
 * meaning: At 02:30 PM, on day 10 of the month, only in August
 */
const convertToCronPattern = (dateString) => {
  // Parse the input date and time
  const dateTimeParts = dateString.split(' ');
  const dateParts = dateTimeParts[0].split('/');
  const timeParts = dateTimeParts[1].split(':');

  const day = parseInt(dateParts[0], 10);
  const month = parseInt(dateParts[1], 10);
  const year = parseInt(dateParts[2], 10);
  const hour = parseInt(timeParts[0], 10);
  const minute = parseInt(timeParts[1], 10);

  // Construct the cron pattern
  const cronPattern = `${minute} ${hour} ${day} ${month} *`;

  return cronPattern;
};

const compliedTemplate = (template, data, typeSend = 'ZALO') => {
  const compiled = lodashTemplate(template);
  const compliedObj = {};
  if (template.includes('<%= FULLNAME %>')) {
    compliedObj['FULLNAME'] = data?.full_name || '';
  }
  if (template.includes('<%= EMAIL %>')) {
    compliedObj['EMAIL'] = data?.email || '';
  }
  if (template.includes('<%= PHONENUMBER %>')) {
    compliedObj['PHONENUMBER'] = data?.phone_number || '';
  }
  if (template.includes('<%= BIRTHDAY %>')) {
    compliedObj['BIRTHDAY'] = data?.birthday || '';
  }
  if (template.includes(`<%= INTERESTID %>`)) {
    compliedObj['INTERESTID'] = _btoa(`${typeSend}_${data?.customer_code}`);
  }
  if (template.includes('<%= COUPONCODE %>')) {
    compliedObj['COUPONCODE'] = data?.coupon_code || 'ABCDE';
  }
  const compliedResult = compiled(compliedObj);
  return compliedResult;
};

module.exports = {
  convertToCronPattern,
  compliedTemplate,
};
