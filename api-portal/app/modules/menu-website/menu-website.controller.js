const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const service = require('./menu-website.service');
const config = require('../../../config/config');
const axios = require('axios');

/**
 * Get list
 */
const getListAsync = async (req, res, next) => {
    try {
        const serviceRes = await service.getListAsync(req.query);
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

/**
 * Create
 */
const createAsync = async (req, res, next) => {
    let next_code;
    try {
        req.body.object_id = null;
        const { object_id, object_code } = req.body;
        const foundData = await service.findByCodeAndId(object_id, object_code);

        if (foundData) {
            let num = object_code.match(/\d+/g);
            let key = object_code.match(/[a-zA-Z]+/g);
            let newNum = parseInt(num) + 1;
            next_code = key + newNum.toString();
            req.body.menu_website_code = next_code;
        }

        const serviceRes = await service.createOrUpdateAsync(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        // eslint-disable-next-line promise/catch-or-return
        axios({
            method: 'post',
            url: `${config.domain_service}/menu-website`,
            data: {
                ...req.body,
                static_id: serviceRes.getData() || '',
            },
            headers: { Authorization: `APIKEY ${config.service_apikey}` },
        })
            .then(() => {})
            .catch(() => {})
            .finally(() => {});

        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.NEWS.CREATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

/**
 * Update
 */
const updateAsync = async (req, res, next) => {
    try {
        const id = req.params.id;
        req.body.id = id;

        const serviceResDetail = await service.getDetailAsync(id);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }
        const serviceRes = await service.createOrUpdateAsync(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.NEWS.UPDATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

/**
 * Get detail
 */
const getDetailAsync = async (req, res, next) => {
    try {
        const serviceRes = await service.getDetailAsync(req.params.id, req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

/**
 * Delete
 */
const deleteAsync = async (req, res, next) => {
    try {
        const serviceRes = await service.deleteAsync(Object.assign({}, req.body, req.query));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(null, RESPONSE_MSG.NEWS.DELETE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

/**
 * Export excel
 */
const exportExcelAsync = async (req, res, next) => {
    try {
        const serviceRes = await service.exportExcelAsync(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const dataRes = serviceRes.getData();
        dataRes.write('menu_website.xlsx', res);
    } catch (error) {
        return next(error);
    }
};

/**
 * Generate next code
 */
const generateNextCodeAsync = async (req, res, next) => {
    try {
        const serviceRes = await service.generateNextCode();
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

// eslint-disable-next-line no-undef
module.exports = {
    getListAsync,
    getDetailAsync,
    deleteAsync,
    exportExcelAsync,
    generateNextCodeAsync,
    createAsync,
    updateAsync,
};
