const httpStatus = require('http-status');
const SingleResponse = require('../../common/responses/single.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const service = require('./denomination.service');
// const ListResponse = require('../../common/responses/list.response');
// const ValidationResponse = require('../../common/responses/validation.response');
// const apiHelper = require('../../common/helpers/api.helper');
/**
 * Get list
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
// const getDenominationList = async (req, res, next) => {
//     try {
//         const serviceRes = await service.getDenominationList(req.query);
//         if (serviceRes.isFailed()) {
//             return next(serviceRes);
//         }
//         const { data, total, page, limit } = serviceRes.getData();
//         return res.json(new ListResponse(data, total, page, limit));
//     } catch (error) {
//         return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
//     }
// };

/**
 * Create
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const createDenomination = async (req, res, next) => {
    try {
        // Insert
        const serviceRes = await service.createOrUpdateDenomination(req.body);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(null, RESPONSE_MSG.BLOCK.CREATE_SUCCESS));
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
const updateDenomination = async (req, res, next) => {
    try {
        // Check exists
        const serviceResDetail = await service.denominationDetail(req.body.denomination_id);

        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }

        // Update
        const serviceRes = await service.createOrUpdateDenomination(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(null, RESPONSE_MSG.BLOCK.UPDATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * delete
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const deleteDenomination = async (req, res, next) => {
    try {
        // Delete
        const serviceRes = await service.deleteDenomination(req.body);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(null, RESPONSE_MSG.BLOCK.DELETE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * detail
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const denominationDetail = async (req, res, next) => {
    try {
        // Check exists
        const serviceRes = await service.denominationDetail(req.params.denomination_id);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

module.exports = {
    // getDenominationList,
    createDenomination,
    updateDenomination,
    deleteDenomination,
    denominationDetail,
};
