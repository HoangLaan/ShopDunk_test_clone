const httpStatus = require('http-status');
const partnerService = require('./customerContact.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const apiHelper = require('../../common/helpers/api.helper');

const getListCustomerContact = async (req, res, next) => {
    try {
        const { list, total } = await partnerService.getList(req.query);
        return res.json(new ListResponse(list, total, req.query.page, req.query.itemsPerPage));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const createCustomerContact = async (req, res, next) => {
    try {
        const result = await partnerService.create(req.body);
        if (result.isFailed()) {
            return next(result);
        }
        return res.json(result);
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

module.exports = {
    createCustomerContact,
    getListCustomerContact,
};
