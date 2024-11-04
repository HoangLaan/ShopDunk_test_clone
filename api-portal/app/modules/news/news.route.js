const express = require('express');
const validate = require('express-validation');
const newsController = require('./news.controller');
const routes = express.Router();
const rules = require('./news.rule');
const prefix = '/news';

// Get List
routes.route('')
  .get(newsController.getListNews);

// Detail a news
routes.route('/:newsId(\\d+)')
  .get(newsController.detailNews);

// Create new a news
routes.route('')
  .post(validate(rules.createNews), newsController.createNews);

// Update a news
routes.route('/:newsId(\\d+)')
  .put(validate(rules.updateNews), newsController.updateNews);

// Delete a news
routes.route('/delete')
  .delete(newsController.deleteNews);

// Remove news related
routes.route('/:news_id(\\d+)/:related_id(\\d+)').delete(newsController.deleteNewsRelated)

// Get List Inside
routes.route('/inside')
  .get(newsController.getListNewsInside);

// Detail a news inside
routes.route('/inside/:newsId(\\d+)')
  .get(newsController.detailNewsInside);

module.exports = {
  prefix,
  routes,
};
