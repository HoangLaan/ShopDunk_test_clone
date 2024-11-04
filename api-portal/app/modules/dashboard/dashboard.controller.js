const dashboardService = require('./dashboard.service');
const SingleResponse = require('../../common/responses/single.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const ListResponse = require('../../common/responses/list.response');

/**
 * Get list
 */
const getSummary = async (req, res, next) => {
    try {
        const serviceRes = await dashboardService.getSummary(Object.assign(req.query, req.body));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getReceiveslipChart = async (req, res, next) => {
    try {
        const serviceRes = await dashboardService.getReceiveslipChart(req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getListAnnounce = async (req, res, next) => {
    try {
        const serviceRes = await dashboardService.getListAnnounce(req.body);
        const { data, count_announce } = serviceRes.getData();
        return res.json(new ListResponse({ data: data, count_announce: count_announce }));
    } catch (error) {
        return next(error);
    }
};

const getListNews = async (req, res, next) => {
    try {
        const serviceRes = await dashboardService.getListNews(req.body);
        return res.json(new ListResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getListMail = async (req, res, next) => {
    try {
        const serviceRes = await dashboardService.getListMail(req.body);
        const { data, total, count_read } = serviceRes.getData();
        return res.json(new ListResponse(data, total, count_read));
    } catch (error) {
        return next(error);
    }
};

const getListStock = async (req, res, next) => {
    try {
        const serviceRes = await dashboardService.getListStocks();
        if (serviceRes.isFailed()) {
            return next(error);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getDebit = async (req, res, next) => {
    try {
        const serviceRes = await dashboardService.getDebit();
        if (serviceRes.isFailed()) {
            return next(error);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getSummary,
    getReceiveslipChart,
    getListAnnounce,
    getListNews,
    getListMail,
    getListStock,
    getDebit,
};
