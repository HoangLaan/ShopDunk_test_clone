const service = require('./lock-shift-report.service');
const httpStatus = require('http-status');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
// const SingleResponse = require('../../common/responses/single.response');
// const ValidationResponse = require('../../common/responses/validation.response');
// const optionService = require('../../common/services/options.service');
// const apiHelper = require('../../common/helpers/api.helper');

/**
 * Get list
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getLockShiftReportList = async (req, res, next) => {
    try {
        const serviceRes = await service.getLockShiftReportList(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

module.exports = {
    getLockShiftReportList,
};
