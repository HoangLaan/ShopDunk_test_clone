const httpStatus = require('http-status');
const requestUsingBudgetService = require('./request-using-budget.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const path = require('path');
const appRootPath = require('app-root-path');
const pathMediaUpload = path.normalize(`${appRootPath}/storage/uploads/request_using_budget`);
const formidable = require('formidable');
const mkdirp = require('mkdirp-promise');
const fs = require('fs');
/**
 * Get list Partner
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getList = async (req, res, next) => {
    try {
        const serviceRes = await requestUsingBudgetService.getList({ ...req.query, ...req.body });
        if (serviceRes.isFailed()) {
            return serviceRes;
        }
        const { list, total, total_not_browse, total_browsed, total_item } = serviceRes.getData();
        const data = new ListResponse(list, total, req.query.page, req.query.itemsPerPage);
        return res.json(new SingleResponse({ total_not_browse, total_browsed, total_item, ...data }));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**F
 * Create new a Partner
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const create = async (req, res, next) => {
    try {
        const serviceRes = await requestUsingBudgetService.createOrUpdate(null, req.body);
        if (serviceRes.isFailed()) {
            return next(new ErrorResponse(null, null, RESPONSE_MSG.CRUD.CREATE_FAILED));
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.CREATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * Update a Partner
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const update = async (req, res, next) => {
    try {
        // Check Partner exists
        const serviceResDetail = await requestUsingBudgetService.detail(req.params.id);
        if (serviceResDetail.isFailed()) {
            return next(new ErrorResponse(httpStatus.NOT_FOUND, null, RESPONSE_MSG.NOT_FOUND));
        }
        // Update Partner
        const serviceRes = await requestUsingBudgetService.createOrUpdate(req.params.id, req.body);
        if (serviceRes.isFailed()) {
            return next(new ErrorResponse(null, null, RESPONSE_MSG.CRUD.UPDATE_FAILED));
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.UPDATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const remove = async (req, res, next) => {
    try {
        // Delete Partner
        const serviceRes = await requestUsingBudgetService.remove(req.body);
        //
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.DELETE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const detail = async (req, res, next) => {
    try {
        // Check Partner exists
        const serviceRes = await requestUsingBudgetService.detail({ ...req.params, ...req.body });
        if (serviceRes.isFailed()) {
            return next(new ErrorResponse(httpStatus.NOT_FOUND, null, RESPONSE_MSG.NOT_FOUND));
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * @func createRequestUsingBudgetCode
 * @description 'Tạo mã đề nghị sử dụng ngân sách'
 * @param req
 * @param res
 * @param next
 */
const createRequestUsingBudgetCode = async (req, res, next) => {
    try {
        const serviceRes = await requestUsingBudgetService.createRequestUsingBudgetCode();
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * @func getRemainingAllocationBudget
 * @description 'Lấy ngân sách được phân bổ theo phòng ban đề nghị'
 * @param req
 * @param res
 * @param next
 */
const getRemainingAllocationBudget = async (req, res, next) => {
    try {
        const serviceRes = await requestUsingBudgetService.getTotalRemainingAllocationBudget(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * @func getListReview
 * @description 'Lấy các khoảng quy định hạn mức theo loại ngân sách'
 * @param req
 * @param res
 * @param next
 */
const getListReview = async (req, res, next) => {
    try {
        const serviceRes = await requestUsingBudgetService.getListReview(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getRequestPurchase = async (req, res, next) => {
    try {
        const serviceRes = await requestUsingBudgetService.getAllRequestPurchase();
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const updateReview = async (req, res, next) => {
    try {
        const serviceRes = await requestUsingBudgetService.updateReview(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const exportExcel = async (req, res, next) => {
    try {
        const serviceRes = await requestUsingBudgetService.exportExcel(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const dataRes = serviceRes.getData();
        dataRes.write('RequestUsingBudget.xlsx', res);
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const exportPDF = async (req, res, next) => {
    try {
        const serviceRes = await requestUsingBudgetService.exportPDF(req.params.request_using_budget_id);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const data = serviceRes?.getData()?.path;
        return res.json(new SingleResponse(data));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const importExcel = async (req, res, next) => {
    try {
        if (!fs.existsSync(pathMediaUpload)) {
            await mkdirp(pathMediaUpload);
        }

        const form = formidable({
            multiples: false,
            uploadDir: pathMediaUpload,
            maxFileSize: 4 * 1024 * 1024 * 1024,
            hash: true,
            keepExtensions: true,
        });
        form.onPart = function (part) {
            if (!part.filename || part.filename.match(/\.(xlsx)$/i)) {
                this.handlePart(part);
            } else {
                return next(
                    new ErrorResponse(
                        httpStatus.BAD_REQUEST,
                        null,
                        `Tập tin “${part.filename}” tải lên không đúng định dạng.`,
                    ),
                );
            }
        };

        form.parse(req, (err, fields, files) => {
            if (err) {
                next(err);
                return;
            }
            let { path: path_upload = null } =
                files && files.requestusingbudgetimport ? files.requestusingbudgetimport : {};
            if (!path_upload)
                return next(new ErrorResponse(httpStatus.BAD_REQUEST, null, 'Vui lòng chọn tập tin tải lên.'));
            requestUsingBudgetService
                .importExcel(Object.assign(req.body, req.query, req.params, { path_upload }))
                .then((serviceRes) => {
                    if (serviceRes.isFailed()) {
                        return next(serviceRes);
                    }
                    return res.json(new SingleResponse(serviceRes.getData()));
                });
        });
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};
const downloadTemplate = async (req, res, next) => {
    try {
        let resService = await requestUsingBudgetService.downloadTemplate();
        if (resService.isFailed()) {
            return next(resService);
        }
        let wb = resService.getData();
        wb.write('Template_Request_Using_Budget.xlsx', res);
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getTree = async (req, res, next) => {
    try {
        const serviceRes = await requestUsingBudgetService.getTree(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};
module.exports = {
    getList,
    create,
    update,
    remove,
    detail,
    createRequestUsingBudgetCode,
    getRemainingAllocationBudget,
    getListReview,
    getRequestPurchase,
    updateReview,
    exportExcel,
    exportPDF,
    downloadTemplate,
    importExcel,
    getTree,
};
