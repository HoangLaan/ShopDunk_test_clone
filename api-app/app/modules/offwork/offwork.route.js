const express = require('express');
const validate = require('express-validation');
const schemaMiddleWare = require('../../middlewares/schema.middleware');
const offWorkController = require('./offwork.controller');
const routes = express.Router();
const rules = require('./offwork.rule');
const prefix = '/off-work';
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
  }
});

// routes
//     .route('/')
//     .get(schemaMiddleWare(rules.getListOffWork), offWorkController.getListOffWork)
//     .post(upload.array("files"),validate(rules.createOffWork), offWorkController.createOffWork);

routes.route('')
    .get(offWorkController.getListOffWork)
    .post(upload.array("files"),validate(rules.createOffWork), offWorkController.createOffWork);

// Get detail offwork
routes.route('/:offWorkId(\\d+)/review').get(offWorkController.detailOffWorkReview);

// Get total day offwork
routes.route('/me/total-day-offwork').get(offWorkController.getTotalDayOffWork);

// Lay danh sach đăng ký nghỉ phép để duyệt tới người duyệt
routes.route('/review').get(offWorkController.getListOffWorkReview);

// Duyet phep
routes.route('/:offWorkId(\\d+)/approved-review-list').put(offWorkController.approvedOffWorkReviewList);

// Lay nhan su thay the thuoc phong ban cua nhan vien
routes.route('/user-refuse').get(offWorkController.getListUserRefuse);

// Get detail offwork
routes.route('/:offWorkId(\\d+)').get(offWorkController.detailOffWork);

routes.route('/confirm/:offWorkId(\\d+)').put(offWorkController.updateConfirm);

module.exports = {
    prefix,
    routes,
};
