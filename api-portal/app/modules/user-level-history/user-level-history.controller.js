const ULHistoryService = require('./user-level-history.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
/**
 * Get list user level history 
 */
const getListULHistory = async (req, res, next) => {
    try {
        const serviceRes = await ULHistoryService.getListULHistory(req.query);
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

/**
 * Get detail user level history 
 */
const detailULHistory = async (req, res, next) => {
    try {
        const serviceRes = await ULHistoryService.detailULHistory(req.params.ulhistoryId);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

/**
 * Create new a user level history 
 */
const createULHistory = async (req, res, next) => {
    try {
        req.body.user_level_history_id = null;
        const serviceRes = await ULHistoryService.createULHistoryOrUpdate(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.CRUD.CREATE_SUCCESS));
    } catch (error) {
        console.log(error);
        return next(error);
    }
};

/**
 * Update a user level history 
 */
const updateULHistory = async (req, res, next) => {
    try {
        const ulhistoryId = req.params.ulhistoryId;
        req.body.user_level_history_id = ulhistoryId;

        // Check user level history  exists
        const serviceResDetail = await ULHistoryService.detailULHistory(ulhistoryId);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }

        // Update user level history 
        const serviceRes = await ULHistoryService.createULHistoryOrUpdate(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.CRUD.UPDATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

/**
 * Delete user level shitory 
 */
const deleteULHistory = async (req, res, next) => {
    try {
        
        const serviceRes = await ULHistoryService.deleteULHistory(Object.assign(req.body,req.query));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.DELETE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

const getUserOptions = async (req, res, next) => {
    try {
        const serviceRes = await ULHistoryService.getUserOptions(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), 'ok'));
    } catch (error) {
        return next(error);
    }
};

const detailUser = async (req, res, next) => {
    try {
        const serviceRes = await ULHistoryService.detailUser(req.params);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), 'ok'));
    } catch (error) {
        return next(error);
    }
};


module.exports = {
    getListULHistory,
    detailULHistory,
    createULHistory,
    updateULHistory,
    deleteULHistory,
    getUserOptions,
    detailUser
};
