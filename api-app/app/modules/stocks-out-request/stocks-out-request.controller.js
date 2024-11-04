const httpStatus = require('http-status');
const stocksOutRequestService = require('./stocks-out-request.service');
const ErrorResponse = require('../../common/responses/error.response');
const SingleResponse = require('../../common/responses/single.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');

const exportPDFByOrder = async (req, res, next) => {
    try {
        const services = await stocksOutRequestService.exportPDF({ ...req.params, ...req.body })
        if (services.isFailed()) {
            return next(services)
        }
        return res.json(new SingleResponse(services.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
}

module.exports = {
    exportPDFByOrder
};
