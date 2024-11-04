const express = require('express');
const validate = require('express-validation');
const mailController = require('./mail.controller');
const routes = express.Router();
const rules = require('./mail.rule');
const multer = require('multer');
const upload = multer()
const prefix = '/mail';


// Get list inbox
routes.route('/incoming')
    .get(mailController.getListInbox);

// Get list inbox in day
routes.route('/incoming-in-day')
    .get(mailController.getListIncomingInDay);

// Delete a incoming mail
routes.route('/:mailId(\\d+)')
    .delete(mailController.deleteMail);

// Get list sent mail
routes.route('/sent')
    .get(mailController.getListSent);

// Get list flagged mail 
routes.route('/flagged')
    .get(mailController.getListFlagged);

// Get list draft mail
routes.route('/draft')
    .get(mailController.getListDraft);

// Get draft mail by id
routes.route('/draft/:mailId(\\d+)')
    .get(mailController.getDraftById);

// Delete draft mail by id
routes.route('/draft/:mailId(\\d+)')
    .delete(mailController.deleteDraft);

// Get list trash mail
routes.route('/trash')
    .get(mailController.getListTrash);

// Delete mail from trash
routes.route('/trash/:mailId(\\d+)')
    .delete(mailController.deleteTrash);

// Khoi phuc mail da xoa 
routes.route('/trash/:mailId(\\d+)/undo')
    .put(mailController.undoMailTrash);

// Get detail by id
routes.route('/:mailId(\\d+)')
    .get(mailController.getById);

// Send a mail
routes.route('/')
    .post(upload.any(), validate(rules.createOrUpdate), mailController.createMail);

// Update mail draft and send
routes.route('/:mailId(\\d+)')
    .put(upload.any(), mailController.updateMail);

// Create and save draft
routes.route('/save-draft')
    .post(upload.any(), mailController.saveDraft);

// Update draft and save draft
routes.route('/:mailId(\\d+)/save-draft')
    .put(upload.any(), validate(rules.createOrUpdate), mailController.updateDraft);

// Toggle flagged
routes.route('/:mailId(\\d+)/toggle-flagged')
    .put(mailController.toggleFlagged);

// Get status incoming mail
routes.route('/status-incoming-mail')
    .get(mailController.getStatusIncomingMail)

// List user view mail 
routes.route('/:mailId(\\d+)/user-view')
    .get(mailController.getListUserView);

// get count mail not read
routes.route('/not-read')
    .get(mailController.getListMailNotRead);

// update all status mail
routes.route('/update-status-all-mail')
    .get(mailController.updateStatusAllMail);

module.exports = {
    prefix,
    routes,
};
