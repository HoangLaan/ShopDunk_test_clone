const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');
const service = require('./contract-type.service');

const contractTypeDetail = async (req, res, next) => {
    try {
        // Check exists
        const serviceRes = await service.contractTypeDetail(req.params.contract_type_id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * Get option
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getOptions = async (req, res, next) => {
    try {
        const serviceRes = await optionService('HR_CONTRACTTYPE', req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    contractTypeDetail,
    getOptions,
};
