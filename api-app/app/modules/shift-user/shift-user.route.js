const express = require('express');
const lockShiftController = require('./shift-user.controller');
const routes = express.Router();

const prefix = '/shift-user';

// List shift user
routes.route('').get(lockShiftController.getShiftUserList);

module.exports = {
    prefix,
    routes,
};
