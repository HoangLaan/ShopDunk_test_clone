const Joi = require('joi');
const path = require('path');

const ruleCreateOrUpdate = {
  customer_code: Joi.string().allow('', null),
  register_date: Joi.string().allow('', null),
  image_avatar: Joi.string().allow('', null),
  full_name: Joi.string().required(),
  birth_day: Joi.string().allow('', null),
  gender: Joi.number().required(),
  marital_status: Joi.number().allow('', null),
  phone_number: Joi.string().allow('', null),
  email: Joi.string().allow('', null),
  password: Joi.string().allow('', null),
  id_card: Joi.string().allow('', null),
  id_card_date: Joi.string().allow('', null),
  id_card_place: Joi.string().allow('', null),
  career_id: Joi.number().allow('', null),
  postal_code: Joi.string().allow('', null),
  address: Joi.string().allow('', null),
  province_id: Joi.number().allow('', null),
  district_id: Joi.number().allow('', null),
  country_id: Joi.number().allow('', null),
  ward_id: Joi.number().allow('', null),
  postal_code: Joi.string().allow('', null),
  is_system: Joi.number().valid(0, 1).default(0),
  is_active: Joi.number().valid(0, 1).default(1),
  is_change_password: Joi.number().valid(0, 1).allow('', null),
  customer_type_id: Joi.number().required().allow('',null),
  zalo_id: Joi.string().allow('', null),
  facebook_id: Joi.string().allow('', null),
  affiliate: Joi.string().allow('', null),
  source_id: Joi.number().allow('', null),
  presenter_id: Joi.number().allow('', null),
  customer_company_id: Joi.string().allow('', null),
};

const ruleCreateOrUpdateAddress = {
  address: Joi.string().allow('', null),
  province_id: Joi.number().allow('', null),
  district_id: Joi.number().allow('', null),
  country_id: Joi.number().allow('', null),
};
const validateRules = {
  createCRMAccount: {
    body: ruleCreateOrUpdate,
  },
  updateCRMAccount: {
    body: ruleCreateOrUpdate,
  },
  changeStatusCRMAccount: {
    body: {
      is_active: Joi.number().valid(0, 1).required(),
    },
  },
  createCRMAccountAddress: {
    body: ruleCreateOrUpdateAddress,
  },
  updateHobbiesRelatives: {
    body: {
      customer_hobbies: Joi.array().items(Joi.number()).allow('', null),
      customer_relatives: Joi.array().items(Joi.object({
        member_ref_id: Joi.number().required(),
        relationship_member_id: Joi.number().required(),
      })).allow('', null),
    }
  },
  importExcel: (req, res, next) => {
    const filetypes = /xlsx|application\/vnd.openxmlformats-officedocument.spreadsheetml.sheet|xls/;
    const extname = filetypes.test(path.extname(req.file.originalname).toLowerCase());
    const mimetype = filetypes.test(req.file.mimetype);
    if (!mimetype || !extname) {
      return next(new Error('Tập tin tải lên không đúng định dạng'));
    }
    next()
  }
};

module.exports = validateRules;
