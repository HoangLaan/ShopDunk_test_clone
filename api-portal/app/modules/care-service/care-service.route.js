const express = require('express');
const validate = require('express-validation');
const careServiceController = require('./care-service.controller');
const routes = express.Router();
const rules = require('./care-service.rule');
const prefix = '/care-service';
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
routes.route('/list-product').get(careServiceController.getListProduct);


routes
    .route('')
    .get(careServiceController.getListCareService)
    .post(validate(rules.createCareService), careServiceController.createCareService);

routes.route('/generate-care-code').get(careServiceController.generateCareCode);
routes.route('/get-options').get(careServiceController.getOptionsGroup);
routes.route('/get-period').get(careServiceController.getOptionsPeriod);

// Get options
routes.route('/unit/get-options').get(careServiceController.getOptionsUnit);
routes.route('/origin/get-options').get(careServiceController.getOptionsOrigin);
routes.route('/manufacture/get-options').get(careServiceController.getOptionsManufacture);
routes.route('/store/get-options').get(careServiceController.getOptionsStore);
routes.route('/stock-type/get-options').get(careServiceController.getOptionsStockType);
routes.route('/stock/get-options').get(careServiceController.getOptionsStock);
routes.route('/area/get-options').get(careServiceController.getOptionsArea);
routes.route('/output-type/get-options').get(careServiceController.getOptionsOutputType);
routes.route('/business/get-options').get(careServiceController.getOptionsBusiness);
routes.route('/get-options').get(careServiceController.getOptionsProduct);

// Delete many product
routes.route('/delete').post(careServiceController.deleteCareService);

// Export excel
routes.route('/export-excel').get(careServiceController.exportExcel);

// Download template
routes.route('/download-excel').get(careServiceController.downloadExcel);

// Import excel
routes.route('/import-excel').post(upload.single('productimport'), careServiceController.importExcel);

//
// Detail and update
routes
    .route('/:care_service_code(\\w+)')
    .get(careServiceController.detailCareService)
    .put(validate(rules.updateCareService), careServiceController.updateCareService);

routes.route('/manufacturer-options').get(careServiceController.getManufacturerOptions);

module.exports = {
    prefix,
    routes,
};
