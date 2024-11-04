const express = require('express');
const mailBoxController = require('./mailbox.controller');
const multer = require('multer');
const path = require('path');
const routes = express.Router();
const prefix = '/mail-box';

const whitelistfile = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp',
    "video/mp4",
    "video/3gpp",
    "video/quicktime",
    "application/pdf",
    "application/msword",
    "application/x-zip-compressed",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
]

const upload = multer({
    fileFilter: (req, file, cb) => {
        if (!whitelistfile.includes(file.mimetype)) {
            return cb(new Error('file_is_not_allowed'))
        }
        cb(null, true)
    }
})

// get option department
routes.route('/option-department')
    .get(mailBoxController.getOptionDepartment);

routes.route('/option-user')
    .get(mailBoxController.getOptionUser);

// create email
routes.route('/send-new-email')
    .post(upload.any(), mailBoxController.sendNewEmail);

// get list mail send from
routes.route('')
    .get(mailBoxController.getListInbox);

// get count mail not read
routes.route('/not-read')
    .get(mailBoxController.getListMailNotRead);

routes.route('/create-update-mail-box')
    .post(mailBoxController.createOrUpdateMailBox);

// list mail trash
routes.route('/trash')
    .get(mailBoxController.getListMailTrash);

// list mail send 
routes.route('/send')
    .get(mailBoxController.getListMailSendTo);

// get list mail draft
routes.route('/draft')
    .get(mailBoxController.getListMailDraft);

// get list mail flagged
routes.route('/flagged')
    .get(mailBoxController.getListMailFlagged);

// Delete mail
routes.route('/:mailbox_id(\\d+)')
    .delete(mailBoxController.deleteMail);

// xoa vinh vien mail
routes.route('/force-delete/:mailbox_id(\\d+)')
    .delete(mailBoxController.forceDeleteMailSelect);

// get detail 
routes.route('/:mailbox_id(\\d+)')
    .get(mailBoxController.getDetailMailSendTo)

// send mail reply
routes.route('/sendmailreply')
    .post(upload.any(), mailBoxController.sendMailReply)

// get detail mail draft
routes.route('/maildraft/:mailbox_id(\\d+)')
    .get(mailBoxController.getdetailMailDraft);
// xoá mail được chọn
routes.route('/deletemailselect')
    .post(mailBoxController.deleteMailSelect);


// // xoa mail
// routes.route('/delete/:mailbox_id(\\d+)')
//   .put(mailBoxController.deleteMail);

// xoa mail vinh vien
routes.route('/forcedelete/:mailbox_id(\\d+)')
    .put(mailBoxController.forceDeleteMail)
// undo mail
routes.route('/undo/:mailbox_id(\\d+)')
    .put(mailBoxController.undoMail);

// Create new a area
routes.route('/upload-file')
  .post(mailBoxController.uploadFile);

routes.route('/restoremailmany')
  .post(mailBoxController.restoreMailMany);

module.exports = {
    prefix,
    routes,
};