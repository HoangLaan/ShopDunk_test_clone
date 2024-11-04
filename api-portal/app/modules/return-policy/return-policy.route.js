const express = require('express');
const validate = require('express-validation');
const returnPolicyController = require('./return-policy.controller');
const routes = express.Router();
const prefix = '/return-policy';
const rules = require('./return-policy.rule');

routes
    .route('')
    .get(returnPolicyController.getReturnPolicyList)
    .post(validate(rules.create), returnPolicyController.createReturnPolicy)
    .put(validate(rules.update), returnPolicyController.updateReturnPolicy)
    .delete(returnPolicyController.deleteReturnPolicy);

routes.route('/:id(\\d+)').get(returnPolicyController.returnPolicyDetail);

routes.route('/condition').get(returnPolicyController.getConditionList);

routes.route('/customer-type-options').get(returnPolicyController.getCustomerTypeOptions);

routes.route('/product-category').get(returnPolicyController.getProductCategoryList);

routes.route('/product').get(returnPolicyController.getProductList);

routes.route('/category-options').get(returnPolicyController.getCategoryOptions);
routes.route('/product-options').get(returnPolicyController.getProductOptions);

module.exports = {
    prefix,
    routes,
};
