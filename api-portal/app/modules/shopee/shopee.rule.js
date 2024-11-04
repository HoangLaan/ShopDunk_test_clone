const Joi = require('joi');

const createOrder = {
  customer_id: Joi.number().required(),
  is_partner: Joi.number().valid(0, 1).allow(null),
  total_money: Joi.number().required(),
  // sub_total: Joi.number().required(),
  // total_vat: Joi.number().required(),
  // total_discount: Joi.number().required(),
  // is_stocks: Joi.number().valid(0, 1).required(),
  // stocks_id: Joi.number().required(),
  payment_time: Joi.number().required(),
  delivery_time: Joi.number().required(),
  // list_product: Joi.array().required(),
  // is_system: Joi.number().valid(0, 1).allow(null),
};
const createCustomerStocks = {
  
};

const createReasonCancel = {
  order_id: Joi.number().required(),
};

createCustomerDelivery = {
  driver_name: Joi.string().required(),
  phone_number: Joi.string().required(),
  // license_plates: Joi.string().required(),
}

createPartnerTransport = {
  partner_transport_id: Joi.number().required(),
  license_plates: Joi.string().required(),
  driver_name: Joi.string().required(),
  phone_number: Joi.string().required(),
}

const validateRules = {
  createOrder: {
    body: createOrder,
  },
  updateOrder: {
    body: createOrder,
  },
  changeStatusOrder: {
    body: {
      is_active: Joi.number().valid(0, 1).required(),
    },
  },
  createCustomerStocks: {
    body: createCustomerStocks,
  },
  createReasonCancel: {
  },
  createCustomerDelivery: {
    body: createCustomerDelivery
  },
  createStocksOutRequest:{

  },
  createPartnerTransport: {
    body: createPartnerTransport
  },
  closeOrder: {
    body : {
      order_closing: Joi.number().valid(1, 2, 3).required(),
    }
  }
};

module.exports = validateRules;

