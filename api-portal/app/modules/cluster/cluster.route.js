const express = require('express');
const validate = require('express-validation');
const rules = require('./cluster.rule');
const clusterController = require('./cluster.controller');

const routes = express.Router();

const prefix = '/cluster';

// List Cluster
routes.route('').get(clusterController.getListCluster);

// Create new a Cluster
routes.route('').post(validate(rules.create), clusterController.createCluster);

// List options business
routes.route('/get-options').get(clusterController.getOptions);

// List store
routes.route('/get-stores').get(clusterController.getListStore);

// Update a Cluster
routes.route('/:id').put(validate(rules.update), clusterController.updateCluster);

// Delete a Cluster
routes.route('').delete(clusterController.deleteCluster);

// Detail a Cluster
routes.route('/:id').get(clusterController.detailCluster);


module.exports = {
    prefix,
    routes,
};
