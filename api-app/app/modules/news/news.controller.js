const newsService = require('./news.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');

const getListNews = async (req, res, next) => {
    try {
        const serviceRes = await newsService.getListNews(req.query);
        const {data, total, page, limit} = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

/**
 * Get top 4 news
 */
const getTopNews = async (req, res, next) => {
    try {
        const serviceRes = await newsService.getTopNews(Object.assign(req.body, req.query));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

/**
 * Get detail
 */
const detailNews = async (req, res, next) => {
    try {
        const {user_name} = req.auth;
        const serviceRes = await newsService.detailNews(req.params.newsId, user_name);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getListUserView = async (req, res, next) => {
    try {
        const serviceRes = await newsService.getListUserView(req.params.news_id);
        if (serviceRes.isFailed()) return next(serviceRes);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getTotalUnreadByUsername = async (req, res, next) => {
    const {user_name} = req.auth;
    try {
        const serviceRes = await newsService.getTotalUnreadByUsername(user_name);
        if (serviceRes.isFailed()) return next(serviceRes);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const createUserView = async (req, res, next) => {
    const {user_name} = req.auth;
    const {news_id} = req.body;
    try {
        const serviceRes = await newsService.createUserView(user_name, news_id);
        if (serviceRes.isFailed()) return next(serviceRes);
        return res.json(new SingleResponse(serviceRes.message));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getListNews,
    detailNews,
    getTopNews,
    getListUserView,
    getTotalUnreadByUsername,
    createUserView,
};
