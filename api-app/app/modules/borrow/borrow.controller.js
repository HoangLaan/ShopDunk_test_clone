const borrowService = require('./borrow.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');

/**
 * Get list stocks borrow
 */
const getListStocks = async (req, res, next) => {
    try {
        const serviceRes = await borrowService.getListStocks(req.query);
        const {data, total, page, limit} = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

const getListBorrowType = async (req, res, next) => {
    try {
        const serviceRes = await borrowService.getListBorrowType();
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData(), ''));
    } catch (error) {
        return next(error);
    }
};

/**
 * Get create borrow
 */
const createBorrow = async (req, res, next) => {
    try {
        const serviceRes = await borrowService.createBorrow(Object.assign(req.body));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData(), 'Thêm mới thành công'));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getListStocks,
    getListBorrowType,
    createBorrow,
};
