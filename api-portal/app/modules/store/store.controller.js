const storeService = require('./store.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');

const getOptions = async (req, res, next) => {
    try {
        const serviceRes = await storeService.getOptions(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

/**
 * Get list store
 */
const getListStore = async (req, res, next) => {
    try {
        const serviceRes = await storeService.getListStore(req.query);
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

/**
 * Get detail store
 */
const detailStore = async (req, res, next) => {
    try {
        // Check company exists
        const serviceRes = await storeService.detailStore(req.params.storeId);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

/**
 * Create new a store
 */
const createStore = async (req, res, next) => {
    try {
        req.body.store_id = null;
        const serviceRes = await storeService.createStoreOrUpdate(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.CRUD.CREATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

/**
 * Update a store
 */
const updateStore = async (req, res, next) => {
    try {
        const storeId = req.params.storeId;
        req.body.store_id = storeId;

        // Check store exists
        const serviceResDetail = await storeService.detailStore(storeId);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }

        // Update store
        const serviceRes = await storeService.createStoreOrUpdate(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.CRUD.UPDATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

/**
 * Delete store
 */
const deleteStore = async (req, res, next) => {
    try {
        // Delete store
        const serviceRes = await storeService.deleteStore(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.DELETE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

/**
 * Get list store with deboune
 */
const getListStoreWithDeboune = async (req, res, next) => {
    try {
        const serviceRes = await storeService.getListStoreWithDeboune(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};
const getOptionsByUser = async (req, res, next) => {
    //
    try {
        const serviceRes = await storeService.getOptionsByUser(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getOptsByUserHaveStocksWarranty = async (req, res, next) => {
    //
    try {
        const serviceRes = await storeService.getOptsByUserHaveStocksWarranty(req.query);
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
    getListStore,
    detailStore,
    createStore,
    updateStore,
    deleteStore,
    getListStoreWithDeboune,
    getOptionsByUser,
    getOptsByUserHaveStocksWarranty,
};
