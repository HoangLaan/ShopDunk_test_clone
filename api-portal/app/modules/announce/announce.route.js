const express = require('express');
const validate = require('express-validation');
const rules = require('./announce.rule');
const announceController = require('./announce.controller');
const routes = express.Router();
const prefix = '/announce';
const multer = require('multer');
const upload = multer();
// // List
routes.route('').get(announceController.getListAnnounce);
routes.route('/list-announce-view').get(announceController.getListAnnounceView);
routes.route('/get-all').get(announceController.getListAllAnnounce);

routes.route('/companies').get(announceController.getListCompany);
routes.route('/not-read').get(announceController.getListAnnounceNotRead);

//Comment
routes.route('/announce-comment/list-user').get(announceController.getListUserView);

// // Create
routes.route('').post(upload.any(), announceController.createAnnounce);
routes.route('/create-announce-user-view').post(announceController.createAnnounceUserView);

// Update
routes.route('/:announce_id(\\d+)').put(upload.any(), announceController.updateAnnounce);

// Detail
routes.route('/:announce_id(\\d+)').get(announceController.detailAnnounce);
routes.route('/announce-view/:announce_id(\\d+)').get(announceController.detailAnnounceView);
//Delete
routes.route('').delete(announceController.deleteAnnounce);
// Download attachment file
routes.route('/attachment/download/:announce_attachment_id(\\d+)').get(announceController.downloadAttachment);

// //list option store
// routes.route('/store/get-options').get(stocksController.getListStoreOptions);

//list option stocks type
routes.route('/announce-type/get-options').get(announceController.getListAnnounceTypeOptions);

//get review level
routes.route('/get-review-level').get(announceController.getOptionsAnnounceReviewLevel);

// Upload file
// routes.route('/upload').post(upload.any(), announceController.upload);

// routes.route('/list-reivew/:announce_type_id(\\d+)').get(announceController.getListReviewLevelByAnnounceTypeId);

// //list option user by store
// routes.route('/list-user/get-options').get(stocksController.getListUserByStoreIdOptions);

// review annouce
routes.route('/review').post(announceController.reviewAnnounce);

module.exports = {
    prefix,
    routes,
};
