const httpStatus = require('http-status');
const taskWorkFlowService = require('./task-work-flow.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const mkdirp = require('mkdirp-promise');
const formidable = require('formidable');
const path = require('path');
const appRootPath = require('app-root-path');
const pathMediaUpload = path.normalize(`${appRootPath}/storage/uploads/taskWorkFlows`);
const fs = require('fs');
const apiConst = require('../../common/const/api.const');

/**
 * Get list Task Work Flow
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getListTaskWorkFlow = async (req, res, next) => {
    try {
        const { list, total } = await taskWorkFlowService.getList(req.query);
        return res.json(new ListResponse(list, total, req.query.page, req.query.itemsPerPage));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * Create new a Task Work Flow
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const createTaskWorkFlow = async (req, res, next) => {
    try {
        const check_code = await taskWorkFlowService.checkTaskWorkCode(req.body.work_flow_code);
        if (check_code > 0) {
            return next(new ErrorResponse(null, null, 'Mã bước đã tồn tại'));
        }
        const result = await taskWorkFlowService.create(req.body);
        if (!result) {
            return next(new ErrorResponse(null, null, RESPONSE_MSG.CRUD.CREATE_FAILED));
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.CREATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * Update a Task Work Flow
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const updateTaskWorkFlow = async (req, res, next) => {
    try {
        // Check Task Work Flow exists
        const taskWorkFlow = await taskWorkFlowService.detail(req.params.id);
        if (!taskWorkFlow) {
            return next(new ErrorResponse(httpStatus.NOT_FOUND, null, RESPONSE_MSG.NOT_FOUND));
        }
        // Update Task Work Flow
        const result = await taskWorkFlowService.update(req.params.id, req.body);
        if (!result) {
            return next(new ErrorResponse(null, null, RESPONSE_MSG.CRUD.UPDATE_FAILED));
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.UPDATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const deleteTaskWorkFlow = async (req, res, next) => {
    try {
        // Delete Task Work Flow
        const serviceRes = await taskWorkFlowService.remove(req.body);
        //
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.DELETE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const detailTaskWorkFlow = async (req, res, next) => {
    try {
        // Check Task Work Flow exists
        const taskWorkFlow = await taskWorkFlowService.detail(req.params.id);
        if (!taskWorkFlow) {
            return next(new ErrorResponse(httpStatus.NOT_FOUND, null, RESPONSE_MSG.NOT_FOUND));
        }
        return res.json(new SingleResponse(taskWorkFlow));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const downloadExcel = async (req, res, next) => {
    try {
        const serviceRq = await taskWorkFlowService.downloadExcel();
        if (serviceRq.isFailed()) {
            return next(serviceRq);
        }
        const wb = serviceRq.getData();
        wb.write('TaskWorkFlow.xlsx', res);
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.NOT_FOUND));
    }
};
const exportExcel = async (req, res, next) => {
    try {
        req.query.itemsPerPage = apiConst.MAX_EXPORT_EXCEL;
        const serviceRq = await taskWorkFlowService.exportExcel(req.query);
        if (serviceRq.isFailed()) {
            return next(serviceRq);
        }
        const wb = serviceRq.getData();
        wb.write('TaskWorkFlow.xlsx', res);
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.NOT_FOUND));
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
            let { path: path_upload = null } = files && files.taskWorkFlowimport ? files.taskWorkFlowimport : {};
            if (!path_upload)
                return next(new ErrorResponse(httpStatus.BAD_REQUEST, null, 'Vui lòng chọn tập tin tải lên.'));
            taskWorkFlowService
                .importExcel(Object.assign(req.body, req.query, req.params, { path_upload }))
                .then((serviceRes) => {
                    if (serviceRes.isFailed()) {
                        return next(serviceRes);
                    }
                    return res.json(new SingleResponse(serviceRes.getData()));
                });
        });
    } catch (error) {
        return next(error);
    }
};
module.exports = {
    getListTaskWorkFlow,
    createTaskWorkFlow,
    updateTaskWorkFlow,
    deleteTaskWorkFlow,
    detailTaskWorkFlow,
    downloadExcel,
    importExcel,
    exportExcel,
};
