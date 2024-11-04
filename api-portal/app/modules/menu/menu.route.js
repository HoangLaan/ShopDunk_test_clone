const express = require('express');
const validate = require('express-validation');
const rules = require('./menu.rule');
const menuController = require('./menu.controller');

const routes = express.Router();

const prefix = '/menu';

// List menu
routes.route('')
  .get(menuController.getListMenu);
// List menu by user
routes.route('/get-by-user')
  .get(menuController.getListMenuByUser);

// Create new a menu
routes.route('')
  .post(validate(rules.createMenu), menuController.createMenu);

// Update a menu
routes.route('/:menuId(\\d+)')
  .put(validate(rules.updateMenu), menuController.updateMenu);

// Delete a menu
routes.route('/:menuId(\\d+)')
  .delete(menuController.deleteMenu);

// Detail a menu
routes.route('/:menuId(\\d+)')
  .get(menuController.detailMenu);

  // Delete list menu
routes.route('/').delete(menuController.deleteListMenu);

// Change status a menu
routes.route('/:menuId(\\d+)/change-status')
  .put(validate(rules.changeStatusMenu), menuController.changeStatusMenu);

module.exports = {
  prefix,
  routes,
};
