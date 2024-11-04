const SingleResponse = require('../../common/responses/single.response');
const provinceServie = require('../province/province.service');
/**
 * Get list options province
 */
const getOptions = async (req, res, next) => {
    try {
        const serviceRes = await provinceServie.getOptions(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), ''));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getOptions,
};
