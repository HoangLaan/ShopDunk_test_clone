const SingleResponse = require('../../common/responses/single.response');
const globalService = require('./global.service');

// #region get getlist notify
const getListNotify = async (req, res, next) => {
    try {
        const serviceRes = await globalService.getListNotify(Object.assign(req.body, req.query));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};
// #endregion

// #region get options global
const getOptionsGlobal = async (req, res, next) => {
    try {
        const serviceRes = await globalService.getOptionsCommon(req.query, req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};
// #endregion

// #region get fullname
const getFullName = async (req, res, next) => {
    try {
        const serviceRes = await globalService.getFullName(Object.assign(req.body, req.query));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};
// #endregion

module.exports = {
    getListNotify,
    getOptionsGlobal,
    getFullName,
};
