const BorrowRequestService = require('./borrow-request.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const httpStatus = require('http-status');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');

const createBorrowRequest = async (req, res, next) => {
    try {
        const serviceRes = await BorrowRequestService.createOrUpdateHandler(null, req.body);
        if (serviceRes.isFailed()) {
            return next(new ErrorResponse(httpStatus.INTERNAL_SERVER_ERROR, null, RESPONSE_MSG.CRUD.CREATE_FAILED));
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.CREATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * Get list
 */
const getListBorrowRequest = async (req, res, next) => {
    try {
        const serviceRes = await BorrowRequestService.getListBorrowRequest(Object.assign(req.query, req.body));
        
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

const getDetailBorrowRequest = async (req, res, next) => {
    try {
        // Check detail exists
        const checkIdBorRequest = parseInt(req.params.borrow_request_id) ?? 0;
        const serviceRes = await BorrowRequestService.getDetailBorrowRequest(checkIdBorRequest);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};


const getListReviewByType = async (req, res, next) => {
    try {
        const serviceRes = await BorrowRequestService.getListReviewByType(req.query);
        const { data } = serviceRes.getData();
        return res.json(new SingleResponse(data));
    } catch (error) {
        return next(error);
    }
};

const deleteBorrowRequest = async (req, res, next) => {
    try {
        const serviceRes = await BorrowRequestService.deleteBorrowRequest(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(null, serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const reviewBorrowRequest = async (req, res, next) => {
    try {
        const serviceRes = await BorrowRequestService.reviewBorrowRequest(req.params.borrow_request_id, req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(null, serviceRes.getData()));
    } catch (error) {
        return next(error); 
    }
};

module.exports = {
    createBorrowRequest,
    getListReviewByType,
    getListBorrowRequest,
    getDetailBorrowRequest,
    deleteBorrowRequest,
    reviewBorrowRequest,
};
