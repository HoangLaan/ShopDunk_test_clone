const Joi = require('joi');

const ruleCreateOrUpdate = Joi.object().keys({
  promotion_offer_id: Joi.number(),
  promotion_offer_name: Joi.string().required(),
  //business_id: Joi.number().required(),
  order_index: Joi.number().required(),
  is_active: Joi.number().valid(0, 1),
  is_system: Joi.number().valid(0, 1),
  is_percent_discount: Joi.number().valid(0, 1),
  is_discount_by_set_price: Joi.number().valid(0, 1),
  is_fixed_gift: Joi.number().valid(0, 1),
  is_fix_price: Joi.number().valid(0, 1),
  discountvalue: Joi.number().allow(''),
});
const validateRules = {
  create: {
    body: ruleCreateOrUpdate,
  },
  update: {
    body: ruleCreateOrUpdate,
  },
  changeStatus: {
    body: {
      is_active: Joi.number().valid(0, 1).required(),
    },
  },
  approve: {
    body: {
      is_review: Joi.number().valid(0, 1).required(),
    },
  },
};

module.exports = validateRules;
