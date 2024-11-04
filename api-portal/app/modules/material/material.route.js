const express = require('express');
const materialController = require('./material.controller');
const routes = express.Router();
const validate = require('express-validation');
const rules = require('./material.rule');
const prefix = '/material';
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

// List material
routes.route('').get(materialController.getListMaterial);

// List material by product
routes.route('/get-by-product').get(materialController.getListByProduct);

// List material attribute
routes.route('/pro-attribute-material/:material_category_id(\\d+)').get(materialController.getOptionsProAttrMaterial);

// List material attribute
routes.route('/pro-attr-mate-value/:product_attribute_id(\\d+)').get(materialController.getProAttrMateValue);

// Create new a material
routes.route('').post(validate(rules.createMaterial), materialController.createMaterial);

// Update a material
routes.route('/:materialId(\\d+)').put(validate(rules.updateMaterial), materialController.updateMaterial);

// Delete a material
routes.route('/').delete(materialController.deleteMaterial);

// Detail a material
routes.route('/:materialId(\\d+)').get(materialController.detailMaterial);

// Get list attribute of model (product category)
routes
    .route('/attributes')
    .get(materialController.getListAttributes)
    .post(validate(rules.createAttribute), materialController.createAttribute);

// Export excel
routes.route('/export-excel').get(materialController.exportExcel);

// Download excel template
routes.route('/download-excel-template').get(materialController.downloadTemplate);

// Import excel
routes.route('/import-excel').post(upload.single('import_file'), materialController.importExcel);

// gen code
routes.route('/gen-code').get(materialController.gencode);

module.exports = {
    prefix,
    routes,
};
