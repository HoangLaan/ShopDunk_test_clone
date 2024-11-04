const express = require('express');
const validate = require('express-validation');
const rules = require('./account.rule');
const crmAccountController = require('./account.controller');
const routes = express.Router();
const prefix = '/account';
const multer = require('multer');

// List crm-account
routes
    .route('')
    .get(crmAccountController.getListCRMAccount)
    .post(validate(rules.createCRMAccount), crmAccountController.createCRMAccount);
// List Customer Optimal
routes.route('/list_customer').get(crmAccountController.getListCustomerOptimal);
// Summary account by date
routes.route('/latest').get(crmAccountController.getListLatestCRMAccount);
// Change status a crm-account
routes
    .route('/:member_id(\\d+)/change-status')
    .put(validate(rules.changeStatusCRMAccount), crmAccountController.changeStatusCRMAccount);
// Update a am-busines
routes.route('/:member_id(\\d+)').put(validate(rules.updateCRMAccount), crmAccountController.updateCRMAccount);

// Update full name acc
routes.route('/:member_id(\\d+)/change-name').put(crmAccountController.changeName);

// Delete a crm-account
routes.route('/:member_id(\\d+)').delete(crmAccountController.deleteCRMAccount);

// Detail a crm-account
routes.route('/:member_id(\\d+)').get(crmAccountController.detailCRMAccount);
// Detail a gen customer code
routes.route('/gen-customer-code').get(crmAccountController.detailGenCustomerCode);

// Change pass crm-account
routes.route('/:member_id(\\d+)/change-password').put(crmAccountController.changePassCRMAccount);

// Update customer hobbies/relatives
routes
    .route('/:member_id(\\d+)/hobbies-relatives')
    .get(crmAccountController.getHobbiesRelatives)
    .put(validate(rules.updateHobbiesRelatives), crmAccountController.updateHobbiesRelatives);

routes.route('/:account_hobbies_id(\\d+)/hobbies-relatives').delete(crmAccountController.deleteHobbiesRelatives);

// Get list history
routes.route('/:member_id(\\d+)/list-attribute-history').get(crmAccountController.getListHistory);

// Export excel
routes.route('/export-excel').post(crmAccountController.exportExcel);
routes.route('/template-import').post(crmAccountController.getTemplateImport);
// routes.route('/import-excel').post(crmAccountController.importExcel);
routes
    .route('/import-excel')
    .post(multer().single('customer_import'), rules.importExcel, crmAccountController.importExcel);

// list source
routes.route('/list-source').get(crmAccountController.getListSource);
// list source
routes.route('/list-career').get(crmAccountController.getListCareer);
routes.route('/list-process-step').get(crmAccountController.getListProcess);
// list buy history
routes.route('/list-purchase-history').get(crmAccountController.getBuyHistoryList);
// list buy history
routes.route('/list-customertype-history-list/:member_id(\\d+)').get(crmAccountController.getCustomerTypeHistoryList);

routes.route('/list-warranty-repair-history/:member_id(\\d+)').get(crmAccountController.getCustomerRepairHistoryList);
// create or update address book
// List crm-account
routes.route('/address-book').post(crmAccountController.createOrUpdateAddressBook);
routes.route('/v2/address-book/:member_id(\\d+)').put(crmAccountController.updateAddressBookList);
// list buy history
routes
    .route('/address-book/:member_id(\\d+)')
    .get(crmAccountController.getListAddress)
    .delete(crmAccountController.deleteAddress)
    .put(crmAccountController.changeDefault);

routes.route('/product-watchlist/:member_id(\\d+)').get(crmAccountController.getProductWatchlist);

// list history care
routes.route('/list-history-data-leads-care').get(crmAccountController.getListHistoryDataLeadsCare);

routes.route('/list-history-zalo-chat').get(crmAccountController.getListChatHistoryZalo);

routes.route('/task').get(crmAccountController.getListCRMAccountTask);

// lấy danh sách lịch sử điểm của user
routes.route('/list_member_point').get(crmAccountController.getListMemberPoint);

// lấy danh sách lịch sử điểm của user
routes.route('/list_user_repair').get(crmAccountController.getListUserRepair);

// Get options
routes.route('/get-options-product-attribute').get(crmAccountController.getOptionsProductAttribute);
routes.route('/get-options-relationship').get(crmAccountController.getOptionsRelationship);

routes.route('/').delete(crmAccountController.deleteListAccount);

routes.route('/get-list-customer').get(crmAccountController.getListByUser);
routes.route('/task-history').get(crmAccountController.getTaskHistory);

module.exports = {
    prefix,
    routes,
};
