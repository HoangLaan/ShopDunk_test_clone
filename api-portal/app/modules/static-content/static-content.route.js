const express = require('express');
const validate = require('express-validation');
const staticController = require('./static-content.controller');
const routes = express.Router();
const rules = require('./static-content.rule');
const prefix = '/static-content';

// Get List
routes.route('')
  .get(staticController.getListStatic);

// Detail a Static
routes.route('/:StaticCode(\\w+)')
  .get(staticController.detailStatic);

// Create new a Static
routes.route('')
  .post(validate(rules.createNews), staticController.createStatic);

// Update a Static
routes.route('/:StaticCode(\\w+)')
  .put(validate(rules.updateNews), staticController.updateStatic);

// Delete a news
routes.route('/delete')
  .delete(staticController.deleteStatic);

routes.route('/export-excel').post(staticController.exportExcel);


// Detail a gen customer code
routes.route('/generate-group-code').get(staticController.generateGroupCode);


// // Remove news related
// routes.route('/:news_id(\\d+)/:related_id(\\d+)').delete(newsController.deleteNewsRelated)

// // Get List Inside
// routes.route('/inside')
//   .get(newsController.getListNewsInside);

// // Detail a news inside
// routes.route('/inside/:newsId(\\d+)')
//   .get(newsController.detailNewsInside);

module.exports = {
  prefix,
  routes,
};
