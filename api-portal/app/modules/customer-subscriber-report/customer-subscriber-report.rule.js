const Joi = require('joi');
const omit = require('lodash/omit');

const customerSubscriberReportModel = {
  customer_subscriber_report_id: Joi.number().required(),
  customer_subscriber_report_name: Joi.string().trim().max(250),
  description: Joi.string().max(2000).allow('', null),
  is_active: Joi.number().valid(0, 1),
};

const rules = {
  create: {
    body: omit(customerSubscriberReportModel, ['customer_subscriber_report_id']),
  },
  update: {
    body: customerSubscriberReportModel,
  },
};

module.exports = rules;
