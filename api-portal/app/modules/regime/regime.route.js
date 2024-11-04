const express = require('express');
const validate = require('express-validation');
const regimeController = require('./regime.controller');
const routes = express.Router();
const rules = require('./regime.rule');
const prefix = '/regime';
const multer = require('multer');

const upload = multer({
  fileFilter: (req, file, cb) => {
    // console.log(req)
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.doc', '.docx', '.xls', '.xlsx', '.pdf'];
    const fileExtension = file.originalname.substring(file.originalname.lastIndexOf('.')).toLowerCase();
    if (allowedExtensions.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error('Only image, Word, Excel, and PDF files are allowed!'), false);
    }
  }
});

routes.route('')
  .get(regimeController.getListRegime)
  .post(upload.array("file"), regimeController.createRegime);

routes.route('/:regime_id(\\d+)')
  .get(regimeController.detailRegime)
  .put(upload.array("file"),validate(rules.updateRegime),regimeController.updateRegime)
  .delete(regimeController.deleteRegime)

routes.route('/get-list_review')
  .get(regimeController.getListReviewRegime)


module.exports = {
  prefix,
  routes,
};
