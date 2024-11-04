const express = require('express');
const validate = require('express-validation');
const routes = express.Router();
const rules = require('./experience.rule');
const experienceController = require('./experience.controller');
const prefix = '/experience';

// List Experience
routes.route('').get(experienceController.getListExperience)

// Create new a experience
routes.route('').post(validate(rules.create), experienceController.createExperience);

// Get & update & delete experience by id
routes.route('/:id')
  .get(experienceController.getById)
  .put(validate(rules.update), experienceController.updateExperience)
  .delete(experienceController.deleteExperience)

// Delete list experiences
routes.route('').delete(experienceController.deleteListExperience);


module.exports = {
  prefix,
  routes,
};
