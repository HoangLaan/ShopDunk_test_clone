const express = require('express');
const validate = require('express-validation');
const controller = require('./crm-note-phonenumber.controller');

const routes = express.Router();

const prefix = '/crm-note-phonenumber';

// List
routes.route('').post(controller.createNotePhoneNumber);
routes.route('').get(controller.getList);

module.exports = {
    prefix,
    routes,
};
