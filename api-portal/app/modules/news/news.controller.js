const newsService = require('./news.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const config = require('../../../config/config');
const axios = require('axios');
/**
 * Get list MD_STORE
 */

const getListNews = async (req, res, next) => {
    try {
        const serviceRes = await newsService.getListNews(req.query);
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

/**
 * Get detail
 */
const detailNews = async (req, res, next) => {
    try {
        const serviceRes = await newsService.detailNews(req.params.newsId, req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

/**
 * Create
 */
const createNews = async (req, res, next) => {
    try {
        req.body.news_id = null;
        const serviceRes = await newsService.createNewsOrUpdate(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        axios({
            method: 'post',
            url: `${config.domain_service}/news`,
            data: {
                ...req.body,
                new_id: serviceRes.getData() || '',
            },
            headers: { Authorization: `APIKEY ${config.service_apikey}` },
        })
            .then((response) => {})
            .catch((error) => {})
            .finally(() => {});

        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.NEWS.CREATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

/**
 * Update
 */
const updateNews = async (req, res, next) => {
    try {
        const newsId = req.params.newsId;
        req.body.news_id = newsId;

        const serviceResDetail = await newsService.detailNews(newsId);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }
        const serviceRes = await newsService.createNewsOrUpdate(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.NEWS.UPDATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

/**
 * Delete
 */
const deleteNews = async (req, res, next) => {
    try {
        const serviceRes = await newsService.deleteNews(Object.assign({}, req.body, req.query));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(null, RESPONSE_MSG.NEWS.DELETE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

const deleteNewsRelated = async (req, res, next) => {
    try {
        const newsId = req.params.news_id;
        const relatedId = req.params.related_id;

        const serviceResDetail = await newsService.detailNews(newsId);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }

        const serviceRes = await newsService.deleteNewsRelated(newsId, Object.assign(req.body, { news_id: relatedId }));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(null, RESPONSE_MSG.NEWS.DELETE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

const getListNewsInside = async (req, res, next) => {
    try {
        const serviceRes = await newsService.getListNewsInside(req.query);
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

const detailNewsInside = async (req, res, next) => {
    try {
        const serviceRes = await newsService.detailNewsInside(req.params.newsId);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getListNews,
    detailNews,
    createNews,
    updateNews,
    deleteNews,
    deleteNewsRelated,
    getListNewsInside,
    detailNewsInside,
};
