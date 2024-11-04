const express = require('express');
const validate = require('express-validation');
const rules = require('./customerContact.rule');
const customerContactController = require('./customerContact.controller');

const routes = express.Router();

const prefix = '/customer-contact';

// List customer Contact
routes.route('').get(customerContactController.getListCustomerContact);

// Create new a customer Contact
routes.route('').post(validate(rules.create), customerContactController.createCustomerContact);

module.exports = {
    prefix,
    routes,
};
