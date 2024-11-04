const BudgetPlanService = require('./budget-plan.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const httpStatus = require('http-status');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');

const createBudgetPlan = async (req, res, next) => {
    try {
        req.body.updated_user = req.auth.user_name;
        const serviceRes = await BudgetPlanService.createBudgetPlan(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), serviceRes.message));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const updateBudgetPlan = async (req, res, next) => {
    try {
        const budget_plan_id = req.params.budget_plan_id;
        req.body.budget_plan_id = budget_plan_id;
        req.body.updated_user = req.auth.user_name;
        // Check  exists
        const serviceResDetail = await BudgetPlanService.getDetailBudgetPlan(budget_plan_id);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }

        // Update
        const serviceRes = await BudgetPlanService.createBudgetPlan(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData(), serviceRes.message));
    } catch (error) {
        return next(error);
    }
};

const getById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const serviceRes = await BudgetPlanService.getById(id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getTotalBudgetPlan = async (req, res, next) => {
    try {
        const serviceRes = await BudgetPlanService.getTotalBudgetPlan(Object.assign({}, req.query, req.body));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const exportExcelBudgetPlan = async (req, res, next) => {
    try {
        let serviceRes = await BudgetPlanService.exportExcelBudgetPlan(req.query);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        let data = serviceRes.getData();
        data.write('exportExcel.xlsx', res);
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const downloadTemplateBudgetPlan = async (req, res, next) => {
    try {
        let serviceRes = await BudgetPlanService.downloadTemplateBudgetPlan(req.query);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        let data = serviceRes.getData();
        data.write('downloadTemplate.xlsx', res);
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const importExcelBudgetPlan = async (req, res, next) => {
    try {
        if (!Boolean(req.file))
            return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, {}, 'Vui lòng chọn file để tải lên.'));

        let serviceRes = await BudgetPlanService.importExcelBudgetPlan(req.body, req.file, req.auth);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        console.log(error);
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getListBudgetPlan = async (req, res, next) => {
    try {
        const serviceRes = await BudgetPlanService.getListBudgetPlan(Object.assign(req.query, req.body));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit, total_not_yet_review } = serviceRes.getData();
        let value = new ListResponse(data, total, page, limit)
        value.data.totalNotYetReview = total_not_yet_review
        return res.json(value);

    } catch (error) {
        return next(error);
    }
};

const deleteBudgetPlan = async (req, res, next) => {
    try {

        // Delete
        const serviceRes = await BudgetPlanService.deleteBudgetPlan(Object.assign({}, req.query, req.body));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(null, serviceRes.message));
    } catch (error) {
        return next(error);
    }
};

const getOptionTreeView = async (req, res, next) => {
    try {
        const serviceRes = await BudgetPlanService.getOptionTreeView(Object.assign(req.query, req.body));
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const updateBudgetPlanDetail = async (req, res, next) => {
    try {
        const serviceRes = await BudgetPlanService.updateBudgetPlanDetail(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getBudgetPlanDetail = async (req, res, next) => {
    try {
        const id = req.params.id
        const serviceRes = await BudgetPlanService.getBudgetPlanDetail(id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getBudgetByDepartment = async (req, res, next) => {
    try {
        const id = req.params.id
        const serviceRes = await BudgetPlanService.getBudgetByDepartment(id, req.query.department);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getBudgetDetailPerMonth = async (req, res, next) => {
    try {
        const serviceRes = await BudgetPlanService.getBudgetDetailPerMonth(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const transferBudgetPlan = async (req, res, next) => {
    try {
        const serviceRes = await BudgetPlanService.transferBudgetPlan(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
}
const getListCompanyOptions = async (req, res, next) => {
    try {
        const serviceRes = await BudgetPlanService.getListCompanyOptions(req.body);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getListBudgetPlanOptions = async (req, res, next) => {
    try {
        const serviceRes = await BudgetPlanService.getListBudgetPlanOptions(req.body);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getListDepartmentOptions = async (req, res, next) => {
    try {
        const serviceRes = await BudgetPlanService.getListDepartmentOptions(Object.assign(req.body, req.query));
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getListBudgetPlanList = async (req, res, next) => {
    try {
        const serviceRes = await BudgetPlanService.getListBudgetPlanList(Object.assign(req.query, req.body));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));

    } catch (error) {
        return next(error);
    }
};

const updateReview = async (req, res, next) => {
    try {
        const serviceRes = await BudgetPlanService.updateReview(Object.assign({}, req.body, req.query));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), serviceRes.message));
    } catch (error) {
        return next(error);
    }
};

const deleteBudgetPlanList = async (req, res, next) => {
    try {
        // Delete
        const serviceRes = await BudgetPlanService.deleteBudgetPlanList(Object.assign({}, req.query, req.body));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(null, serviceRes.message));
    } catch (error) {
        return next(error);
    }
};

const updateBudgetPlanDistributionDetail = async (req, res, next) => {
    try {
        const serviceRes = await BudgetPlanService.updateBudgetPlanDistributionDetail(Object.assign({}, req.body, req.query));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData(), serviceRes.message));
    } catch (error) {
        return next(error);
    }
};

const getDetailBudgetPlan = async (req, res, next) => {
    try {
        const serviceRes = await BudgetPlanService.getDetailBudgetPlan(req.params.budget_plan_id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    createBudgetPlan,
    getById,
    getTotalBudgetPlan,
    exportExcelBudgetPlan,
    downloadTemplateBudgetPlan,
    importExcelBudgetPlan,
    getBudgetPlanDetail,
    getBudgetByDepartment,
    getBudgetDetailPerMonth,
    transferBudgetPlan,
    getListBudgetPlan,
    deleteBudgetPlan,
    getOptionTreeView,
    updateBudgetPlanDetail,
    getListCompanyOptions,
    getListBudgetPlanOptions,
    getListDepartmentOptions,
    getListBudgetPlanList,
    updateReview,
    deleteBudgetPlanList,
    updateBudgetPlanDistributionDetail,
    getDetailBudgetPlan,
    updateBudgetPlan
};
