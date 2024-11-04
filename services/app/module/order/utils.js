const lodashTemplate = require('lodash/template');
const ServiceResponse = require('../../common/responses/service.response');
const mailchimpTransactional = require('@mailchimp/mailchimp_transactional')(process.env.MAILCHIMP_TRANSACTION_APIKEY);

const _btoa = function (str) {
  return Buffer.from(str).toString('base64');
};

const getTemplateFields = (templateString = '') => {
  const regex = /<%=\s*(\w+)\s*%>/g;
  const matches = templateString?.matchAll(regex) || [];
  const results = [];
  for (const match of matches) {
    const variableName = match[1];
    results.push(variableName);
  }
  return results;
};

const defaultValueFromTemplate = (templateString = '') => {
  const fields = getTemplateFields(templateString);
  const result = {};
  fields.forEach((field) => {
    result[field] = '';
  });
  return result;
};

const compliedTemplate = (template, data, typeSend = 'ZALO') => {
  const compliedObj = defaultValueFromTemplate(template);
  const compiled = lodashTemplate(template);
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

const sendOneMail = async ({ from_email, mail_to, from_name, mail_subject, mail_reply, email_content }) => {
  try {
    const payload = {
      message: {
        html: email_content,
        subject: mail_subject,
        from_email: from_email,
        from_name: from_name,
        reply_to: mail_reply,
        to: [
          {
            email: mail_to,
          },
        ],
        global_merge_vars: [],
        merge_vars: [],
        track_opens: true,
        track_clicks: true,
      },
    };

    const response = await mailchimpTransactional.messages.send(payload);

    return new ServiceResponse(true, 'success', response);
  } catch (e) {
    logger.error(e.message, { function: 'MailChimpService.sendOneMail' });
    return new ServiceResponse(false, e.message);
  }
};

module.exports = {
  compliedTemplate,
  sendOneMail,
};
