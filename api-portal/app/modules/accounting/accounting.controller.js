const httpStatus = require('http-status');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');

const service = require('./accounting.service');

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

const detail = async (req, res, next) => {
    try {
        const serviceRes = await service.getDetail(req.params.installment_form_id);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

module.exports = {
    getList,
    detail,
};
