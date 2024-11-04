const paymentService = require('./payment-vietinbank.service');
const SingleResponse = require('../../common/responses/single.response');
const ErrorResponse = require('../../common/responses/error.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const { notification } = require('../../common/services/bullmq.service');

const checkReceiveSlip = async (req, res, next) => {
    try {
        const serviceRes = await paymentService.checkReceiveSlip(Object.assign(req.query, req.body));

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData(), serviceRes.message));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    checkReceiveSlip,
};
