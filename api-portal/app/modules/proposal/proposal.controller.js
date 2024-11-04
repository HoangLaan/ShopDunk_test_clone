const httpStatus = require('http-status');
const service = require('./proposal.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
/**
 * Get list
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getListProposal = async (req, res, next) => {
    try {
        const result = await service.getList({ ...req.query, ...req.body });
        if (result.isFailed()) {
            return next(result);
        }
        const { list, total, page, itemsPerPage, total_review } = result.getData();
        return res.json(
            new SingleResponse({ ...new ListResponse(list, total, page, itemsPerPage), total_review: total_review }),
        );
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * Create
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const createProposal = async (req, res, next) => {
    try {
        const result = await service.createOrUpdate(null, req.body);
        if (result.isFailed()) {
            return next(new ErrorResponse(null, null, RESPONSE_MSG.CRUD.CREATE_FAILED));
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.CREATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * Update
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */

const updateProposal = async (req, res, next) => {
    try {
        // Check  exists
        const data = await service.detail(req.params.id);
        if (data.isFailed()) {
            return next(new ErrorResponse(httpStatus.NOT_FOUND, null, RESPONSE_MSG.NOT_FOUND));
        }
        // Update
        const result = await service.createOrUpdate(req.params.id, req.body);
        if (result.isFailed()) {
            return next(new ErrorResponse(null, null, RESPONSE_MSG.CRUD.UPDATE_FAILED));
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.UPDATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const deleteProposal = async (req, res, next) => {
    try {
        // Delete
        const serviceRes = await service.remove(req.body);
        //
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.DELETE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const detailProposal = async (req, res, next) => {
    try {
        const result = await service.detail({ id: req.params.id, ...req.body });
        if (result.isFailed()) {
            return next(new ErrorResponse(httpStatus.NOT_FOUND, null, RESPONSE_MSG.NOT_FOUND));
        }
        return res.json(new SingleResponse(result.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const updateReviewProposal = async (req, res, next) => {
    try {
        const result = await service.updateReview(req.body);
        if (result.isFailed()) {
            return next(new ErrorResponse(null, null, RESPONSE_MSG.CRUD.UPDATE_FAILED));
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.UPDATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getUserInformation = async (req, res, next) => {
    try {
        const result = await service.getUserInformation(req.query);
        if (result.isFailed()) {
            return next(result);
        }
        return next(new SingleResponse(result.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getListReview = async (req, res, next) => {
    try {
        const result = await service.getListReview(req.query);
        if (result.isFailed()) {
            return next(result);
        }
        return next(new SingleResponse(result.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const exportPDF = async (req, res, next) => {
    try {
        const serviceRes = await service.exportPDF({ ...req.body, ...req.query });
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getListProposal,
    createProposal,
    updateProposal,
    deleteProposal,
    detailProposal,
    updateReviewProposal,
    getUserInformation,
    getListReview,
    exportPDF,
};
