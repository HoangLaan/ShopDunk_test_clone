const express = require('express');
const shortLinkController = require('./short-link.controller');

const routes = express.Router();

const prefix = '/short-link';

// List options province
routes.route('')
  .get(shortLinkController.getList)
  .post(shortLinkController.createOrUpdate);

  routes.route('/:short_link_id(\\d+)')
    .get(shortLinkController.getById);
  routes.route('/:short_link_id(\\d+)')
    .put(shortLinkController.createOrUpdate);
 routes.route('/delete')
    .post(shortLinkController.handleDelete);
module.exports = {
  prefix,
  routes,
};
