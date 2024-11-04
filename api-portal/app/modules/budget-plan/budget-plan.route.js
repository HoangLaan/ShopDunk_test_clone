const express = require('express');
const controller = require('./budget-plan.controller');
const validate = require('express-validation');
const rules = require('./budget-plan.rule');
const routes = express.Router();
const prefix = '/budget-plan';
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

routes.route('').get(controller.getListBudgetPlan);

routes.route('').post(validate(rules.createBudgetPlan), controller.createBudgetPlan);
routes.route('/:budget_plan_id(\\d+)').put(validate(rules.createBudgetPlan), controller.updateBudgetPlan);


routes.route('/total').get(controller.getTotalBudgetPlan);

routes.route('/:id(\\d+)').get(controller.getById);

routes.route('/detail/:id').get(controller.getBudgetPlanDetail);

routes.route('/:id/department')
    .get(controller.getBudgetByDepartment)

routes.route('/distribution/month')
    .get(controller.getBudgetDetailPerMonth)

routes.route('/transfer')
    .post(controller.transferBudgetPlan)

// Export excel
routes.route('/export-excel').get(controller.exportExcelBudgetPlan);

// Download excel template
routes.route('/download-excel-template').get(controller.downloadTemplateBudgetPlan);

// Import excel
routes.route('/import-excel').post(upload.single('import_file'), controller.importExcelBudgetPlan);
// Delete
routes.route('').delete(controller.deleteBudgetPlan);

// Get options  for create
routes.route('/get-options-tree-view')
    .get(controller.getOptionTreeView);

//Update
routes.route('/detail')
    .put(validate(rules.createBudgetPlan), controller.updateBudgetPlanDetail);

//Options Company
routes.route('/company/options')
    .get(controller.getListCompanyOptions);

//Options BudgetPlan
routes.route('/options')
    .get(controller.getListBudgetPlanOptions);

//Options Department
routes.route('/department/options')
    .get(controller.getListDepartmentOptions);

//List budget plan options
routes.route('/list')
    .get(controller.getListBudgetPlanList)
    .delete(controller.deleteBudgetPlanList)

//Update review
routes.route('/review').put(controller.updateReview);

//update budget-plan-distribution
routes.route('/budget-plan-distribution-detail').put(controller.updateBudgetPlanDistributionDetail);

//Detail Budget plan
routes.route('/detail/:budget_plan_id(\\d+)').get(controller.getDetailBudgetPlan);

module.exports = {
    prefix,
    routes,
};
