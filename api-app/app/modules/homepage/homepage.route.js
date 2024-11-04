const express = require('express');
const controller = require('./homepage.controller');
const schemaMiddleWare = require('../../middlewares/schema.middleware');
const rules = require('./homepage.rule');

const routes = express.Router();

const prefix = '/homepage';

// Homepage statistical data
routes.route('/statistical').get(schemaMiddleWare(rules.ruleGetList), controller.getHomepageStatisticalData);

// Homepage mailbox data
routes.route('/mailbox').get(schemaMiddleWare(rules.ruleGetList), controller.getHomepageMailboxData);

// Homepage announce data
routes.route('/announce').get(schemaMiddleWare(rules.ruleGetList), controller.getHomepageAnnounceData);

// Homepage news data
routes.route('/news').get(schemaMiddleWare(rules.ruleGetList), controller.getHomepageNewsData);

module.exports = {
    prefix,
    routes,
};
