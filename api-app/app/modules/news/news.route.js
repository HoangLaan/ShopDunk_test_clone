const express = require('express');
const newsController = require('./news.controller');
const routes = express.Router();
const prefix = '/news';
const rules = require('./news.rule');
const schemaMiddleWare = require('../../middlewares/schema.middleware');

// Get List
routes.route('').get(newsController.getListNews);

// Get top 4
routes.route('/top').get(newsController.getTopNews);

// Detail news
routes.route('/:newsId(\\d+)').get(newsController.detailNews);

// List user view
routes.route('/:news_id(\\d+)/user-view').get(schemaMiddleWare(rules.getDetail), newsController.getListUserView);

// Total unread by username
routes.route('/total-unread').get(newsController.getTotalUnreadByUsername);

//create news_userview
routes.route('/view').put(schemaMiddleWare(rules.getDetail), newsController.createUserView);

module.exports = {
    prefix,
    routes,
};
