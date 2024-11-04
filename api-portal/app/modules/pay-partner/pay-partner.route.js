const express = require('express');
const validate = require('express-validation');
const rules = require('./pay-partner.rule');
const controller = require('./pay-partner.controller');
const multer = require('multer');
const routes = express.Router();
const path = require('path');
const prefix = '/pay-partner';

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
// List store bank account
routes.route('/get-store-bank-account').get(controller.getListStoreBankAccount);

// List pay-partner
routes.route('').get(controller.getListPayPartner);

// List options
routes.route('/options').get(controller.getListOptions);

// Upload file
routes.route('/upload').post(uploadCDN.any(), controller.upload);

// Create new a pay-partner
routes.route('').post(validate(rules.create), controller.createPayPartner);

// Update a pay-partner
routes.route('/:id').put(validate(rules.update), controller.updatePayPartner);

// Delete a pay-partner
routes.route('').delete(controller.deletePayPartner);

// Detail a pay-partner
routes.route('/:id').get(controller.detailPayPartner);

module.exports = {
    prefix,
    routes,
};
