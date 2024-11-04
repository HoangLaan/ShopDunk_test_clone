const httpStatus = require('http-status');
const SingleResponse = require('../../common/responses/single.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const service = require('./onepay.service');

const getListInstallmentBank = async (req, res, next) => {
    try {
        const serviceRes = await service.getListInstallmentBank(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), 'success'));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.INTERNAL_SERVER_ERROR, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

module.exports = {
    getListInstallmentBank,
};
