const express = require('express');
const validate = require('express-validation');
const relationshipController = require('./relationship.controller');
const routes = express.Router();
const rules = require('./relationship.rule');
const prefix = '/relationship';
// List relationship
routes.route('').get(relationshipController.getListRelationship);

// Create a new relationship
routes.route('').post(validate(rules.create), relationshipController.createRelationship);

// Get & update & delete relationship by id
routes
    .route('/:id')
    .get(relationshipController.getById)
    .put(validate(rules.update), relationshipController.updateRelationship)
    .delete(relationshipController.deleteRelationship);

module.exports = {
    prefix,
    routes,
};
