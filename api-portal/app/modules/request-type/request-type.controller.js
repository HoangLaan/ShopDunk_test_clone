const SingleResponse = require('../../common/responses/single.response');
const optionService = require('../../common/services/options.service');
const ListResponse = require('../../common/responses/list.response');
const RequestTypeService = require('./request-type.service');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
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
        const serviceRes = await RequestTypeService.getOptions();
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getOptions,
};
