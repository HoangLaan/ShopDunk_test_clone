const service = require('./member-point.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');

/**
 * Get list
 */
const getPointByUser = async (req, res, next) => {
    try {
        const serviceRes = await service.getPointByUser(req.params.customer_id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

/**
 * Get list exchange point apply on order
 */
const getExchangePointApplyOnOrder = async (req, res, next) => {
    try {
        const serviceRes = await service.getListExchangePointApplyOnOrder(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};
/**
 * Get list by user
 */
const getListOfUser = async (req, res, next) => {
    try {
        const serviceRes = await service.getListOfUser(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit, totalPoint } = serviceRes.getData();
        return res.json(new SingleResponse({ totalPoint: totalPoint, ...new ListResponse(data, total, page, limit) }));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getPointByUser,
    getExchangePointApplyOnOrder,
    getListOfUser,
};
