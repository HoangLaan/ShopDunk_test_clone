const express = require('express');
const validate = require('express-validation');
const uploadFileController = require('./upload-file.controller');
const routes = express.Router();
const rules = require('./upload-file.rule');
const prefix = '/upload-file';

// Create new a area
routes.route('')
  .post(validate(rules.upload),uploadFileController.uploadFile);

module.exports = {
  prefix,
  routes,
};
