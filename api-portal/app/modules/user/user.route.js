const express = require('express');
const validate = require('express-validation');
const rules = require('./user.rule');
const userController = require('./user.controller');
const multer = require('multer');
const path = require('path');
const appRoot = require('app-root-path');
const fileDir = path.normalize(`${appRoot}/storage/file`);
const { v4: uuidv4 } = require('uuid');

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, fileDir);
        },
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            cb(null, uuidv4().toString() + ext);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
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

const routes = express.Router();
const prefix = '/user';

// List user
routes.route('').get(userController.getListUser);

routes.route('/export-excel').get(userController.exportExcel);

routes.route('/user-shift').get(userController.getListUserShift);
// List user option
routes.route('/get-by-option').get(userController.getListUserByOption);

// Create new a user
routes.route('').post(validate(rules.createUser), userController.createUser);
// Generate username
routes.route('/gen-username').get(userController.generateUsername);

routes.route('/shift-info').get(userController.getShiftInfo);

// List options function
routes.route('/get-options').get(userController.getOptions);

// Reset password a user -- admin
routes.route('/:userId/change-password').put(validate(rules.resetPassword), userController.resetPassword);

// Change password a user
routes
    .route('/:userId/change-password-user')
    .put(validate(rules.changePasswordUser), userController.changePasswordUser);

// Change password a user check theo token
routes.route('/change-password').put(validate(rules.changePasswordUser), userController.changePassword);

// Delete a user
routes.route('/delete').post(validate(rules.deleteUser), userController.deleteUser);

routes.route('/get-ip-address').get(userController.getIpAddress);

// List user DIVISON
routes.route('/business-user/divison').get(userController.getListUserDivison);

// List skill
routes.route('/skill/get-data').get(userController.getListSkill);

// Upload document
routes.route('/upload').post(upload.any(), userController.upload);

// List salary history
routes.route('/salary-history/:username').get(userController.getListSalaryHistory);

// List position history
routes.route('/position-history/:username').get(userController.getListPositionHistory);

// Detail a user
routes.route('/:userId').get(userController.detailUser);

// Update a user
routes.route('/:userId').put(validate(rules.updateUser), userController.updateUser);

module.exports = {
    prefix,
    routes,
};
