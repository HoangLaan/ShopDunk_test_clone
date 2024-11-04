const httpStatus = require('http-status');
const service = require('./cumulate-point-type.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');

const getListOptions = async (req, res, next) => {
    try {
        const result = await service.getListOptions(req.query);
        if (result.isFailed()) {
            return next(result);
        }
        return res.json(new SingleResponse(result.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const calculatePoint = async (req, res, next) => {
    try {
        const result = await service.calculatePoint(req.query);
        if (result.isFailed()) {
            return next(result);
        }
        return res.json(new SingleResponse(result.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

module.exports = {
    getListOptions,
    calculatePoint,
};
