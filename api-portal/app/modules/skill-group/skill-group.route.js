const express = require('express');
const validate = require('express-validation');
const skillGroupController = require('./skill-group.controller');
const routes = express.Router();
const rules = require('./skill-group.rule');
const prefix = '/skill-group';

// List skillgroup
routes.route('')
    .get(skillGroupController.getListSkillGroup);

// Detail a skillgroup
routes.route('/:skillgroup_id(\\d+)')
    .get(skillGroupController.detailSkillGroup);

// Create new a skillgroup
routes.route('')
    .post(validate(rules.createSkillGroup), skillGroupController.createSkillGroup);

// Update a skillgroup
routes.route('/:skillgroup_id(\\d+)')
    .put(validate(rules.updateSkillGroup), skillGroupController.updateSkillGroup);

// Delete skillgroups
routes.route('/delete')
    .post(skillGroupController.deleteSkillGroup);


// options skillgroup
routes.route('/options')
    .get(skillGroupController.getOptionsSkillGroup);

module.exports = {
    prefix,
    routes,
};
