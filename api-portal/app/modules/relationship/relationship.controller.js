const relationshipService = require('./relationship.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const httpStatus = require('http-status');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');

/**
 * Get list
 */
const getListRelationship = async (req, res, next) => {
    try {
        const { list, total } = await relationshipService.getListRelationship(req.query);
        return res.json(new ListResponse(list, total, req.query.page, req.query.itemsPerPage));
    } catch (error) {
        return next(error);
    }
};

/**
 * Create new a Relationship
 */
const createRelationship = async (req, res, next) => {
    try {
        req.body.created_user = req.auth.user_name;
        const serviceRes = await relationshipService.createOrUpdateHandler(req.body);
        if (serviceRes.isFailed()) {
            return next(new ErrorResponse(httpStatus.INTERNAL_SERVER_ERROR, null, RESPONSE_MSG.CRUD.CREATE_FAILED));
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.CREATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * Update relationship
 */
const updateRelationship = async (req, res, next) => {
    try {
        req.body.updated_user = req.auth.user_name;
        const serviceRes = await relationshipService.createOrUpdateHandler(req.body);
        if (serviceRes.isFailed()) {
            return next(new ErrorResponse(httpStatus.INTERNAL_SERVER_ERROR, null, RESPONSE_MSG.CRUD.UPDATE_FAILED));
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.UPDATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * Delete relationship
 */
const deleteRelationship = async (req, res, next) => {
    try {
        const relationshipmemberId = req.params.id;
        // Check Relationsip exists
        const serviceResDetail = await relationshipService.getById(relationshipmemberId);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }

        req.body.deleted_user = req.auth.user_name;

        // Delete Relationship
        const serviceRes = await relationshipService.deleteRelationship(relationshipmemberId, req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.RELATIONSHIP.DELETE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const serviceRes = await relationshipService.getById(id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getListRelationship,
    createRelationship,
    getById,
    updateRelationship,
    deleteRelationship,
};
