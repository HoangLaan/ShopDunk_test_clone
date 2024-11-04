const express = require('express');
const validate = require('express-validation');
const rules = require('./receive-slip.rule');
const receiveslipController = require('./receive-slip.controller');
const multer = require('multer');
const path = require('path');

const uploadCDN = multer({
    fileFilter: (req, file, cb) => {
        if (!file) return cb(null, false);
        // Allowed ext
        const filetypes = /doc|docx|pdf|xlsx|xls|jpg|png|image\/jpeg/;
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

const routes = express.Router();
const prefix = '/receive-slip';

// Detail
routes.route('/:receive_slip_id(\\d+)').get(receiveslipController.detailReceiveSlip);

// Create
routes.route('').post(validate(rules.createReceiveslip), receiveslipController.createReceiveSlip);

routes.route('/create-list').post(receiveslipController.createListReceiveSlip);

//update
routes.route('').put(validate(rules.updateReceiveslip), receiveslipController.updateReceiveSlip);

// get code
routes.route('/gen-code').get(receiveslipController.genReceiveSlipCode);

// List cashier
routes.route('/get-cashier').get(receiveslipController.getCashierByCompanyId);

// Upload
routes.route('/upload').post(uploadCDN.any(), receiveslipController.upload);

// Export PdexportPDF
routes.route('/export-pdf').get(receiveslipController.exportPDF);

routes.route('/confirm-receive-money').post(receiveslipController.confirmReceiveMoney);

module.exports = {
    prefix,
    routes,
};
