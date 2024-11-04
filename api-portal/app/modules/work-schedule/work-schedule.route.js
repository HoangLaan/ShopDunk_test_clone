const express = require('express');
const validate = require('express-validation');
const controller = require('./work-schedule.controller');
const routes = express.Router();
const rules = require('./work-schedule.rule');
const prefix = '/work-schedule';
const multer = require('multer');

const upload = multer({
    fileFilter: (req, file, cb) => {
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.doc', '.docx', '.xls', '.xlsx', '.pdf'];
        const fileExtension = file.originalname.substring(file.originalname.lastIndexOf('.')).toLowerCase();
        if (allowedExtensions.includes(fileExtension)) {
            cb(null, true);
        } else {
            cb(new Error('Only image, Word, Excel, and PDF files are allowed!'), false);
        }
    },
});

routes.route('').get(controller.getList).post(upload.array('file'), validate(rules.create), controller.create);

routes
    .route('/:work_schedule_id(\\d+)')
    .get(controller.detail)
    .put(upload.array('file'), validate(rules.update), controller.update)
    .delete(controller.deleteWorkSchedule);

routes.route('/get-list_review').get(controller.getListReview);

routes.route('/review-level').put(controller.updateReviewLevel);

routes.route('/order-apply').get(controller.getOrderApply);

module.exports = {
    prefix,
    routes,
};
