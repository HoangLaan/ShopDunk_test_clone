const express = require('express');
const announceController = require('./announce.controller');
const schemaMiddleWare = require('../../middlewares/schema.middleware');
const validate = require('express-validation');
const rules = require('./announce.rule');
const routes = express.Router();
const prefix = '/announce';
const multer = require('multer');

const whitelistfile = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp',
    'video/mp4',
    'video/3gpp',
    'video/quicktime',
    // 'application/pdf',
    // 'application/msword',
    // 'application/x-zip-compressed',
    // 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    // 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

const upload = multer({
    fileFilter: (req, file, cb) => {
        if (!whitelistfile.includes(file.mimetype)) {
            return cb(new Error('Chỉ có thể upload ảnh hoặc video'));
        }

        cb(null, true);
    },
});

// List
routes.route('').get(schemaMiddleWare(rules.getList), announceController.getListAnnounce);

// Detail
routes.route('/:announce_id(\\d+)').get(schemaMiddleWare(rules.getDetail), announceController.getById);

// List user view
routes
    .route('/:announce_id(\\d+)/user-view')
    .get(schemaMiddleWare(rules.getDetail), announceController.getListUserView);

// Total unread by username
routes.route('/total-unread').get(schemaMiddleWare(rules.global), announceController.getTotalUnreadByUsername);

//create announcer_userview
routes.route('/view').put(schemaMiddleWare(rules.getDetail), announceController.createUserView);

//comment

// Get List comment
routes.route('/comment').get(schemaMiddleWare(rules.getCommentList), announceController.getListAnnounceComment);

// Get reply comment list
routes.route('/comment/reply').get(schemaMiddleWare(rules.getReplyCommentList), announceController.getListReplyComment);

// Create new a announce comment
routes
    .route('/comment')
    .post(upload.single('image'), validate(rules.createAnnounceComment), announceController.createAnnounceComment);

// Like or dislike announce Comment
routes
    .route('/comment/like-dislike')
    .post(schemaMiddleWare(rules.likeDislikeComment), announceController.likeOrDisLikeAnnounceComment);

routes
    .route('/update-isread-announce')
    .get(announceController.updateStatusAllAnnounceRead);

module.exports = {
    prefix,
    routes,
};
