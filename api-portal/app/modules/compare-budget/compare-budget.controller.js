const httpStatus = require('http-status');
const ErrorResponse = require('../../common/responses/error.response');
const SingleResponse = require('../../common/responses/single.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');

const service = require('./compare-budget.service');

const getList = async (req, res, next) => {
    try {
        const serviceRes = await service.getList(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit, sum } = serviceRes.getData();

        return res.json({
            data: {
                items: data,
                itemsPerPage: limit,
                page,
                totalItems: total,
                totalPages: Math.ceil(total / limit),
                sum,
            },
        });
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getBudgetPlanOptions = async (req, res, next) => {
    try {
        const serviceRes = await service.getBudgetPlanOptions(req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const exportExcel = async (req, res, next) => {
    try {
        const serviceRes = await service.exportExcel(req.query);
        const wb = serviceRes.getData();
        wb.write('item.xlsx', res);
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getList,
    exportExcel,
    getBudgetPlanOptions,
};
