const UserLevelService = require('./user-level.service');
const SingleResponse = require('../../common/responses/single.response');
const ErrorResponse = require('../../common/responses/error.response');
const ListResponse = require('../../common/responses/list.response');
const optionService = require('../../common/services/options.service');

const getListUserLevel = async (req, res, next) => {
    try {
        const serviceRes = await UserLevelService.getListUserLevel(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, 'error'));
    }
};

const deleteUserLevel = async (req, res, next) => {
    try {
        const serviceRes = await UserLevelService.deleteUserLevel(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(null, 'ok'));
    } catch (error) {
        return next(error);
    }
};

const createUserLevel = async (req, res, next) => {
    try {
        const serviceRes = await UserLevelService.createUserLevel(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(null, 'ok'));

    } catch (error) {
        return next(error);
    }
};

/**
 * Get list options user level
 */
const getOptions = async (req, res, next) => {
    try {
        const serviceRes = await optionService('HR_USERLEVEL', req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getListUserLevel,
    deleteUserLevel,
    createUserLevel,
    getOptions,
};
