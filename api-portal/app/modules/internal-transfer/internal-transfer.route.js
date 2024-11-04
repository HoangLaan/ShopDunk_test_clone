const express = require('express');
const validate = require('express-validation');
const internalTransferController = require('./internal-transfer.controller');
const routes = express.Router();
const rules = require('./internal-transfer.rule');
const prefix = '/internal-transfer';
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

// done
routes.route('').get(internalTransferController.getListInternalTransfer);

// done
routes.route('/:id(\\d+)').get(internalTransferController.detailInternalTransfer);

// done
routes.route('/gen-code').get(internalTransferController.genCode);

// done
routes.route('/store-options').get(internalTransferController.getStoreOptions);

// done
routes.route('/bank-account-options').get(internalTransferController.getBankAccountOptions);

// done
routes.route('/internal-transfer-type-options').get(internalTransferController.getInternalTransferTypeOptions);

// done
routes
    .route('/internal-transfer-type/review-level')
    .get(internalTransferController.getInternalTransferTypeReviewLevelList);

// done
routes
    .route('')
    .post(internalTransferController.createInternalTransfer)
    .put(internalTransferController.updateInternalTransfer)
    .delete(internalTransferController.deleteInternalTransfer);

// done
routes.route('/review-level').put(internalTransferController.updateReviewLevel);

// done
routes.route('/review-status/count').get(internalTransferController.countReviewStatus);

// Upload
routes.route('/upload').post(uploadCDN.any(), internalTransferController.upload);

module.exports = {
    prefix,
    routes,
};
