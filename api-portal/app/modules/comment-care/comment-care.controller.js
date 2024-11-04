const service = require('./comment-care.service');
const SingleResponse = require('../../common/responses/single.response');
const ErrorResponse = require('../../common/responses/error.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const httpStatus = require('http-status');
const apiHelper = require('../../common/helpers/api.helper');
/**
 * Get list
 */
const getListComment = async (req, res, next) => {
    try {
        req.query.user_id = req.auth.user_id;
        req.query.user_name = req.auth.user_name;
        const serviceRes = await service.getListComment(req.query, req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();

        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * Get details
 */
const details = async (req, res, next) => {
    try {
        const serviceRes = await service.details(req.params.id, null);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

/**
 * Change status
 */
const changeStatus = async (req, res, next) => {
    try {
        const customer_comment_id = req.params.customer_comment_id;
        console.log('======================customer_comment_id', customer_comment_id);
        const authId = apiHelper.getAuthId(req);
        const isApproved = apiHelper.getValueFromObject(req.body, 'is_approved');

        console.log('======================isApproved', isApproved);
        // Check function exists
        const result = await service.changeStatus(customer_comment_id, authId, isApproved);
        if (result.isFailed()) {
            return next(result);
        }

        return res.json(new SingleResponse(null, RESPONSE_MSG.CUSTOMERCOMMENTCARE.CHANGE_STATUS_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const exportExcel = async (req, res, next) => {
    try {
        const serviceRes = await service.exportExcel(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const dataRes = serviceRes.getData();
        dataRes.write('customer_comment.xlsx', res);
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getListComment,
    details,
    changeStatus,
    exportExcel,
};
