const lockShiftService = require('./shift-user.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');
const httpStatus = require('http-status');
const ErrorResponse = require('../../common/responses/error.response');
/**
 * Get list
 */
const getShiftUserList = async (req, res, next) => {
    try {
        const serviceRes = await lockShiftService.getShiftUserList({...req.body, ...req.query});
        if (serviceRes.isFailed()) return next(serviceRes);
        const {data, total, page, limit} = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getShiftUserList,
};
