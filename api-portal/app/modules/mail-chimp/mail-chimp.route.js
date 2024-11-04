const express = require('express');
const controller = require('./mail-chimp.controller');
const routes = express.Router();
const validate = require('express-validation');
const rules = require('./mail-chimp.rule');

const prefix = '/mail-chimp';

// transactions mail
routes.route('/transaction/template').get(controller.getListTransactionTemplate);
routes.route('/transaction/template').post(controller.createTransactionTemplate);
routes.route('/transaction/template/send').post(controller.sendMailByTemplate);

routes.route('/transaction/sender').get(controller.getSenderInfo);
routes.route('/transaction/send-list').post(controller.sendListMailByTemplate);
routes.route('/transaction/send-one').post(controller.sendOneMailByTemplate);
routes.route('/transaction/send-list-leads').post(controller.sendListMailByTemplateToCustomerLeads);
routes.route('/transaction/send-list-member').post(controller.sendListMailByTemplateToMember);

module.exports = {
    prefix,
    routes,
};
