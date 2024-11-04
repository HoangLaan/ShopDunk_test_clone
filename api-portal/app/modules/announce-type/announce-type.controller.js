const SingleResponse = require('../../common/responses/single.response');
const announceTypeService = require('./announce-type.service');

const getCompanyOptions = async (req, res, next) => {
    try {
        const serviceRes = await announceTypeService.getCompanyOptions(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};
const getDepartmentOptions = async (req, res, next) => {
    try {
        const serviceRes = await announceTypeService.getDepartmentOptions(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getCompanyOptions,
    getDepartmentOptions,
};
