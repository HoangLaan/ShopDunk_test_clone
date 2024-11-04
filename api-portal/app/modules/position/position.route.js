const express = require('express');
const validate = require('express-validation');
const rules = require('./position.rule');
const positionController = require('./position.controller');
const routes = express.Router();
const prefix = '/position';
const multer = require('multer');
const path = require('path');
const appRoot = require('app-root-path');
const uploadCDN = multer({
    fileFilter: (req, file, cb) => {
        if (!file) return cb(null, false);
        // Allowed ext
        const filetypes = /doc|docx|pdf|xlsx|xls|jpg|png/;
        // Check ext
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        // Check mime
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            return cb(null, false);
        }
    },
});

// List position
routes.route('').get(positionController.getListPosition);

// List options position
routes.route('/get-options').get(positionController.getOptions);

// Create new a position
routes.route('').post(validate(multer().any(), rules.createPosition), positionController.createPosition);

// Change status a position
routes
    .route('/:positionId(\\d+)/change-status')
    .put(validate(rules.changeStatusPosition), positionController.changeStatusPosition);

// Update a position
routes
    .route('/:positionId(\\d+)')
    .put(multer().any(), validate(rules.updatePosition), positionController.updatePosition);

// Delete a position
routes.route('/').delete(positionController.deleteArrayPostion);

// Detail a position
routes.route('/:positionId(\\d+)').get(positionController.detailPosition);

// Export excel
routes.route('/export-excel').get(positionController.exportExcel);

// List options position by department id
routes.route('/get-option-by-department').get(positionController.getOptionByDepartmentId);

// download jd file
routes.route('/jd-file/download/:position_level_id(\\d+)').get(positionController.downloadJdFile);

module.exports = {
    prefix,
    routes,
};
