const service = require('./denomination.service');
const ListResponse = require('../../common/responses/list.response');
// const SingleResponse = require('../../common/responses/single.response');
// const RESPONSE_MSG = require('../../common/const/responseMsg.const');
// const optionService = require('../../common/services/options.service');

/**
 * Get list
 */
const getListDenomination = async (req, res, next) => {
    try {
        const serviceRes = await service.getListDenomination(req.query);
        const {data, total, page, limit} = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getListDenomination,
};
