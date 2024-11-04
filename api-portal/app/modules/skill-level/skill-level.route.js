const express = require('express');
const validate = require('express-validation');
const skillLevelController = require('./skill-level.controller');
const routes = express.Router();
const rules = require('./skill-level.rule');
const prefix = '/skill-level';
// List
routes.route('')
  .get(skillLevelController.getListSkillLevel);

// // Detail 
routes.route('/:level_id(\\d+)')
  .get(skillLevelController.detailSkillLevel);

// // Create 
routes.route('')
  .post(validate(rules.createLevel), skillLevelController.createSkillLevel);

// // Update
routes.route('/:level_id(\\d+)')
  .put(validate(rules.createLevel), skillLevelController.updateSkillLevel);

// Delete
routes.route('/delete')
  .post(skillLevelController.deleteSkillLevel);

// options skill-level
routes.route('/options')
  .get(skillLevelController.getOptionsSkillLevel);


module.exports = {
  prefix,
  routes,
};
