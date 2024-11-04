const Joi = require('joi');

const listApplyPproductArray = Joi.object().keys({
  product_id:Joi.number().required(),
});
const listOfferApplyArray = Joi.object().keys({
  promotion_offer_id:Joi.number().required(),
});
const listCompanyArray = Joi.object().keys({
  company_id:Joi.number().required(),
  business_id:Joi.number().required(),
});

const ruleCreateOrUpdate = Joi.object().keys({
  promotion_name: Joi.string().required(),
  begin_date:Joi.string().required(),
  end_date: Joi.string().required(),
  is_active: Joi.number().valid(0, 1).required(),
  //is_apply_with_order_promotion: Joi.number().valid(0, 1).required(),
  //is_promotion_by_total_money: Joi.number().valid(0, 1).required(),
  //is_promorion_by_total_quantity: Joi.number().valid(0, 1).required(),
  //is_limit_promotion_times: Joi.number().valid(0, 1).required(),
  //is_combo_promotion: Joi.number().valid(0, 1).required(),
  // list_apply_product: Joi.array().min(1).items(listApplyPproductArray),
  //offer_apply_list: Joi.array().min(1).items(listOfferApplyArray),
  //list_company:Joi.array().min(1).items(listCompanyArray),
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
      is_review: Joi.number().valid(0, 1, 2).required(),
    },
  },
};

module.exports = validateRules;
