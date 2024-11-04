const returnPolicyService = require('./return-policy.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');

const getProductDetails = async (req, res, next) => {
    try {
        const serviceRes = await returnPolicyService.getProductDetails(req.params.product_imei_code);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const {data, message} = serviceRes;
        return res.json(new SingleResponse(data, message));
    } catch (error) {
        return next(error);
    }
};

const getProductsByOrderNo = async (req, res, next) => {
    try {
        const serviceRes = await returnPolicyService.getProductsByOrderNo(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const {data, message} = serviceRes;
        return res.json(new SingleResponse(data, message));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getProductDetails,
    getProductsByOrderNo,
};
