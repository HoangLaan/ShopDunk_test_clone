const purchaseCostService = require('./purchase-cost.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');

const getPurchaseCostId = async (req, res, next) => {
    try {
        const serviceRes = await purchaseCostService.getPurchaseCostId();
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        const dataRes = serviceRes.getData();
        return res.json(new SingleResponse(dataRes));
    } catch (error) {
        return next(error);
    }
};

const getListPurchaseCost = async (req, res, next) => {
    try {
        const serviceRes = await purchaseCostService.getListPurchaseCost(req.query);
        const {data, total, page, limit} = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

const createPurchaseCost = async (req, res, next) => {
    try {
        const serviceRes = await purchaseCostService.createOrUpdatePurchaseCost(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.PURCHASECOST.CREATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

const detailPurchaseCost = async (req, res, next) => {
    try {
        // detail
        const serviceRes = await purchaseCostService.detailPurchaseCost(req.params.purchase_cost_id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const updatePurchaseCost = async (req, res, next) => {
    try {
        // Check  exists
        const serviceResDetail = await purchaseCostService.detailPurchaseCost(req.body.purchase_cost_id);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }

        // Update
        const serviceRes = await purchaseCostService.createOrUpdatePurchaseCost(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.PURCHASECOST.UPDATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

const deletePurchaseCost = async (req, res, next) => {
    try {
        const serviceRes = await purchaseCostService.deletePurchaseCost(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(null, RESPONSE_MSG.PURCHASECOST.DELETE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getPurchaseCostId,
    getListPurchaseCost,
    detailPurchaseCost,
    updatePurchaseCost,
    createPurchaseCost,
    deletePurchaseCost,
};
