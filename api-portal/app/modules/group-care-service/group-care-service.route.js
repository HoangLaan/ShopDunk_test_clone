const express = require('express');
const validate = require('express-validation');
const groupCareServiceController = require('./group-care-service.controller');
const routes = express.Router();
const rules = require('./group-care-service.rule');
const prefix = '/group-care-service';
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

// Get list product
routes
    .route('')
    .get(groupCareServiceController.getListGroupCareService)
    .post(validate(rules.createGroupCareService), groupCareServiceController.createGroupCareService);

// Get options
routes.route('/get-options').get(groupCareServiceController.getOptionsGroup);
routes.route('/origin/get-options').get(groupCareServiceController.getOptionsOrigin);
routes.route('/manufacture/get-options').get(groupCareServiceController.getOptionsManufacture);
routes.route('/store/get-options').get(groupCareServiceController.getOptionsStore);
routes.route('/stock-type/get-options').get(groupCareServiceController.getOptionsStockType);
routes.route('/stock/get-options').get(groupCareServiceController.getOptionsStock);
routes.route('/area/get-options').get(groupCareServiceController.getOptionsArea);
routes.route('/output-type/get-options').get(groupCareServiceController.getOptionsOutputType);
routes.route('/business/get-options').get(groupCareServiceController.getOptionsBusiness);
routes.route('/get-options').get(groupCareServiceController.getOptionsProduct);

// Delete many product
routes.route('/delete').post(groupCareServiceController.deleteGroupCareService);

// Export excel
routes.route('/export-excel').get(groupCareServiceController.exportExcel);

// Download template
routes.route('/download-excel').get(groupCareServiceController.downloadExcel);

// Import excel
routes.route('/import-excel').post(upload.single('productimport'), groupCareServiceController.importExcel);

// Detail and update
routes
    .route('/:group_service_code(\\w+)')
    .get(groupCareServiceController.detailGroupCareService)
    .put(validate(rules.updateGroupCareService), groupCareServiceController.updateGroupCareService);

routes.route('/generate-group-code').get(groupCareServiceController.generateGroupCode);


module.exports = {
    prefix,
    routes,
};
