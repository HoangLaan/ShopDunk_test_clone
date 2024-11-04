const express = require('express');
const controller = require('./member-point.controller');
const routes = express.Router();
const validate = require('express-validation');
const rules = require('./member-point.rule');

const prefix = '/member-point';

//List by user
routes.route('/get-of-user').get(controller.getListOfUser)

//List exchange point on order 
routes.route('/get-exchange-point').post(controller.getExchangePointApplyOnOrder)

// List
routes.route('/:customer_id').get(controller.getPointByUser);



module.exports = {
    prefix,
    routes,
};
