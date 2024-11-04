const express = require('express');
const validate = require('express-validation');
const documentTypeController = require('./document-type.controller');
const rules = require('./document-type.rule');
const routes = express.Router();
const prefix = '/document-type';


// List options education level
routes.route('/get-options')
  .get(documentTypeController.getOptions);

// List doctument type
routes.route('')
  .get(documentTypeController.getListDocumentType);

// Detail a doctument type
routes.route('/:document_type_id(\\d+)')
  .get(documentTypeController.detailDocumentType);

// Create new a doctument type
routes.route('')
  .post(validate(rules.createDocumentType), documentTypeController.createDocumentType);
  
// Update a doctument type
routes.route('/:document_type_id(\\d+)')
  .put(validate(rules.updateDocumentType), documentTypeController.updateDocumentType);

// Delete a doctument type
routes.route('/:document_type_id(\\d+)')
  .delete(documentTypeController.deleteDocumentType);

// routes.route('/type-document')
//   .get(fileManagerController.getListDocumentType) // Lấy danh sách loại tài liệu 
//   .post(validate(rules.createDocumentType), fileManagerController.createDocumentType) // Thêm loại tài liệu
//   .put(validate(rules.updateDocumentType), fileManagerController.UpdateDocumentType) // Thay đổi tên loại tài liệu

// routes.route('/type-document/:document_type_id(\\d+)').delete(fileManagerController.deleteDocumentType); // Xóa loại tài liệu



module.exports = {
  prefix,
  routes,
};
