const SingleResponse = require('../../common/responses/single.response');
const service = require('./homepage.service');

/**
 * Get data
 */
const getHomepageStatisticalData = async (req, res, next) => {
    try {
        const serviceRes = await service.getHomepageStatisticalData(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getHomepageMailboxData = async (req, res, next) => {
    try {
        const serviceRes = await service.getHomepageMailboxData(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getHomepageAnnounceData = async (req, res, next) => {
    try {
        const serviceRes = await service.getHomepageAnnounceData(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getHomepageNewsData = async (req, res, next) => {
    try {
        const serviceRes = await service.getHomepageNewsData(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getHomepageStatisticalData,
    getHomepageMailboxData,
    getHomepageAnnounceData,
    getHomepageNewsData,
};
