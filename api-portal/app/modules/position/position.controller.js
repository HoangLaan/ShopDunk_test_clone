const positionService = require('./position.service');
const SingleResponse = require('../../common/responses/single.response');
const ErrorResponse = require('../../common/responses/error.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');

/**
 * Get list options position
 */
const getOptions = async (req, res, next) => {
    try {
        const serviceRes = await optionService('MD_POSITION', req.query);

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

/**
 * Get list position
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getListPosition = async (req, res, next) => {
    try {
        const serviceRes = await positionService.getListPosition(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * detail a position
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
/**
 * Get detail
 */
const detailPosition = async (req, res, next) => {
    try {
        const serviceRes = await positionService.detailPosition(req.params.positionId);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

/**
 * Delete
 */
const deletePosition = async (req, res, next) => {
    try {
        const positionId = req.params.positionId;
        // Check
        const serviceResDetail = await positionService.detailPosition(positionId);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }

        // Delete
        const serviceRes = await positionService.deletePosition(positionId, req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.POSITION.DELETE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

/**
 * Change status
 */
const changeStatusPosition = async (req, res, next) => {
    try {
        const positionId = req.params.positionId;
        const serviceResDetail = await positionService.detailPosition(positionId);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }
        // Update status
        const serviceRes = await positionService.changeStatusPosition(positionId, req.body);
        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.POSITION.CHANGE_STATUS_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

/**
 * Create
 */
const createPosition = async (req, res, next) => {
    try {
        req.body.position = null;
        const serviceRes = await positionService.createOrUpdatePosition(req.body, req.files, req.auth);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.POSITION.CREATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

/**
 * Update
 */
const updatePosition = async (req, res, next) => {
    try {
        const positionId = req.params.positionId;
        req.body.positionId = positionId;
        const serviceResDetail = await positionService.detailPosition(positionId);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }

        const serviceRes = await positionService.createOrUpdatePosition(req.body, req.files, req.auth);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.POSITION.UPDATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

const exportExcel = async (req, res, next) => {
    try {
        const serviceRes = await positionService.exportExcel(req.query);
        const wb = serviceRes.getData();
        wb.write('POSITION.xlsx', res);
    } catch (error) {
        return next(error);
    }
};
const getOptionByDepartmentId = async (req, res, next) => {
    try {
        const serviceRes = await positionService.getOptionByDepartmentId(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * Get list position
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */

const deleteArrayPostion = async (req, res, next) => {
    try {
        const serviceRes = await positionService.deleteArrayPostion(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(true, 'Xoá vị trí thành công'));
    } catch (error) {
        return next(error);
    }
};

const downloadJdFile = async (req, res, next) => {
    try {
        const serviceRes = await positionService.downloadAttachment(req.params.position_level_id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { file_path, file_name } = serviceRes.getData();

        const axios = require('axios');
        const response = await axios({
            method: 'get',
            url: file_path,
            responseType: 'stream',
        });

        res.attachment(file_name);
        response.data.pipe(res);
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getOptions,
    getListPosition,
    detailPosition,
    deletePosition,
    changeStatusPosition,
    createPosition,
    updatePosition,
    exportExcel,
    getOptionByDepartmentId,
    deleteArrayPostion,
    downloadJdFile,
};
