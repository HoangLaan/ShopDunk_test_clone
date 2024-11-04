const express = require('express');
const controller = require('./god-of-import.controller');
const routes = express.Router();
const prefix = '/god-of-import';
const multer = require('multer');
const path = require('path');

const upload = multer({
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (!file) return cb(new Error('Vui lòng chọn file!'));
        // Allowed ext
        const filetypes = /xlsx|application\/vnd.openxmlformats-officedocument.spreadsheetml.sheet/;
        // Check ext
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        // Check mime
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            return cb(new Error('File không đúng định dạng!'));
        }
    },
});

// Import excel
routes.route('/import-stock-in-request').post(upload.single('file'), controller.importStockInRequest);

routes.route('/import-order').post(upload.single('file'), controller.importOrder);

routes.route('/import-receive-slip').post(upload.single('file'), controller.importReceiveSlip);

module.exports = {
    prefix,
    routes,
};
