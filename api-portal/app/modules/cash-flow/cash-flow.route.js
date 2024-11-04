const express = require('express');
const validate = require('express-validation');
const controller = require('./cash-flow.controller');
const routes = express.Router();
const prefix = '/cash-flow';
const rules = require('./cash-flow.rule');
const multer = require('multer');
const path = require('path');
const appRoot = require('app-root-path');
// const fileDir = path.normalize(`${appRoot}/storage/file`);
// const { v4: uuidv4 } = require('uuid');
// const fs = require('fs');

const upload = multer({
    // storage: multer.diskStorage({
    //     destination: async (req, file, cb) => {
    //         if (!fs.existsSync(fileDir)) {
    //             await fs.mkdirSync(fileDir);
    //         }
    //         cb(null, fileDir);
    //     },
    //     filename: (req, file, cb) => {
    //         const ext = path.extname(file.originalname);
    //         cb(null, uuidv4().toString() + ext);
    //     },
    // }),
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

// Get list, create. update, delete
routes
    .route('')
    .get(controller.getCashFlowList)
    .post(validate(rules.create), controller.createCashFlow)
    .put(validate(rules.update), controller.updateCashFlow)
    .delete(controller.deleteCashFlow);

// Get detail
routes.route('/:cash_flow_id(\\d+)').get(controller.cashFlowDetail);

// Export excel
routes.route('/export-excel').get(controller.exportExcelCashFlow);

// Download excel template
routes.route('/download-excel-template').get(controller.downloadTemplateCashFlow);

// Import excel
routes.route('/import-excel').post(upload.single('import_file'), controller.importExcelCashFlow);

module.exports = {
    prefix,
    routes,
};
