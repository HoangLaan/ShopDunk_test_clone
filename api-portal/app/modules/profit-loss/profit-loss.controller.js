const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const profitLossService = require('./profit-loss.service');

const getList = async (req, res, next) => {
    try {
        const serviceRes = await profitLossService.getList(req.query);
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

const getListHistory = async (req, res, next) => {
    try {
        const serviceRes = await profitLossService.getHistoryList(req.query);
        const { data, total, page, limit, programs } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit, programs));
    } catch (error) {
        return next(error);
    }
};

const create = async (req, res, next) => {
    try {
        const serviceRes = await profitLossService.createOrUpdate(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(null, 'success'));
    } catch (error) {
        return next(error);
    }
};

const exportExcel = async (req, res, next) => {
    try {
        const serviceRes = await profitLossService.exportExcel(req.body);
        const wb = serviceRes.getData();
        wb.write('model_calculation.xlsx', res);
    } catch (error) {
        return next(error);
    }
};

const exportHistoryExcel = async (req, res, next) => {
    try {
        const serviceRes = await profitLossService.exportHistoryExcel(req.query);
        const wb = serviceRes.getData();
        wb.write('model_history_calculation.xlsx', res);
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getList,
    create,
    exportExcel,
    getListHistory,
    exportHistoryExcel,
};
