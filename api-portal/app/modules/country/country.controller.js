const SingleResponse = require('../../common/responses/single.response');
const optionService = require('../../common/services/options.service');

/**
 * Get list options country
 */
const getOptions = async (req, res, next) => {
    try {
        const serviceRes = await optionService('MD_COUNTRY', req.query);

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getOptions,
};
