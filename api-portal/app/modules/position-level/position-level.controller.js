const positionLevelService = require('./position-level.service');
const SingleResponse = require('../../common/responses/single.response');
const ErrorResponse = require('../../common/responses/error.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');

const getListPositionLevel = async (req, res, next) => {
    try {
        const serviceRes = await positionLevelService.getListPositionLevel(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const deletePositionLevel = async (req, res, next) => {
    try {
        const serviceRes = await positionLevelService.deletePositionLevel(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(null, 'Xoá cấp bậc nhân viên thành công.'));
    } catch (error) {
        return next(error);
    }
};

const createPositionLevel = async (req, res, next) => {
    try {
        const serviceRes = await positionLevelService.createPositionLevel(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(null, 'Thêm mới cấp bậc nhân viên thành công.'));
    } catch (error) {
        return next(error);
    }
};

const updatePositionLevel = async (req, res, next) => {
    try {
        const serviceRes = await positionLevelService.updatePositionLevel(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(null, 'Cập nhật cấp bậc nhân viên thành công.'));
    } catch (error) {
        return next(error);
    }
};

const getOptions = async (req, res, next) => {
    try {
        const serviceRes = await optionService('MD_POSITIONLEVEL', req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getOptionsByPositionId = async (req, res, next) => {
    try {
        const serviceRes = await positionLevelService.getOptionsByPositionId(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const detailPositionLevel = async (req, res, next) => {
    try {
        const serviceRes = await positionLevelService.detailPositionLevel(req.params.id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getListPositionLevel,
    deletePositionLevel,
    createPositionLevel,
    getOptions,
    getOptionsByPositionId,
    updatePositionLevel,
    detailPositionLevel,
};
