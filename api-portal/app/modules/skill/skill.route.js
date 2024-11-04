const express = require('express');
const validate = require('express-validation');
const skillController = require('./skill.controller');
const routes = express.Router();
const rules = require('./skill.rule');
const prefix = '/skill';

// List skill
routes.route('')
    .get(skillController.getListSkill);

// Detail a skill
routes.route('/:skill_id(\\d+)')
    .get(skillController.detailSkill);

// Create new a skill
routes.route('')
    .post(validate(rules.createSkill), skillController.createSkill);

// Update a skill
routes.route('/:skill_id(\\d+)')
    .put(validate(rules.updateSkill), skillController.updateSkill);

// Delete a skill
routes.route('/delete')
    .post(skillController.deleteSkill);

// List options skill
routes.route('/get-options')
    .get(skillController.getOptions);
routes.route('/optionslevel')
    .get(skillController.getListLevel);

// List options skill
routes.route('/optionsskillgroup')
    .get(skillController.getListSkillGroup);

module.exports = {
    prefix,
    routes,
};