const httpStatus = require('http-status');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const ValidationResponse = require('../../common/responses/validation.response');
const optionService = require('../../common/services/options.service');
const apiHelper = require('../../common/helpers/api.helper');
const service = require('./business.service');
/**
 * Get list business
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getBusinessList = async (req, res, next) => {
    try {
        const serviceRes = await service.getBusinessList(req.query);
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
 * Create new a AM_Business
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const createBusiness = async (req, res, next) => {
    try {
        // Insert Business
        const serviceRes = await service.createOrUpdateBusiness(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.AMBUSINESS.CREATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * Update a AM_Business
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const updateBusiness = async (req, res, next) => {
    try {
        // Check exists
        const serviceResDetail = await service.businessDetail(req.body.business_id);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }

        // Update
        const serviceRes = await service.createOrUpdateBusiness(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(null, RESPONSE_MSG.AMBUSINESS.UPDATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * delete a AM_BUSINESS
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const deleteBusiness = async (req, res, next) => {
    try {
        // Delete AMBUSINESS
        const serviceRes = await service.deleteBusiness(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.AMBUSINESS.DELETE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * detail a AM_BUSINESS
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const businessDetail = async (req, res, next) => {
    try {
        const business_id = req.params.business_id;

        // Check AMBUSINESS exists
        const serviceRes = await service.businessDetail(business_id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * Get option
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getOptions = async (req, res, next) => {
    try {
        const serviceRes = await optionService('AM_BUSINESS', req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

/**
 * change status a AM_BUSINESS
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
// const changeStatusBusiness = async (req, res, next) => {
//     try {
//         const business_id = req.params.business_id;
//         const auth_id = apiHelper.getAuthId(req);
//         const is_active = apiHelper.getValueFromObject(req.body, 'is_active');

//         // Check function exists
//         const serviceResDetail = await service.detailBusiness(business_id);
//         if (serviceResDetail.isFailed()) {
//             return next(serviceResDetail);
//         }
//         const serviceRes = await service.changeStatusBusiness(business_id, auth_id, is_active);
//         if (serviceRes.isFailed()) {
//             return next(serviceRes);
//         }
//         return res.json(new SingleResponse(null, RESPONSE_MSG.AMBUSINESS.CHANGE_STATUS_SUCCESS));
//     } catch (error) {
//         return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
//     }
// };

// const getOptionsByAreaList = async (req, res, next) => {
//     try {
//         const serviceRes = await service.getOptionsByAreaList(req.query);
//         return res.json(new SingleResponse(serviceRes.getData()));
//     } catch (error) {
//         return next(error);
//     }
// };

// const getOptionsByUser = async (req, res, next) => {
//     try {
//         if (Number(req.auth.isAdministrator) === 1) {
//             const serviceRes = await optionService('AM_BUSINESS', req.query);
//             return res.json(new SingleResponse(serviceRes.getData()));
//         } else {
//             req.query.auth_id = req.body.auth_id;
//             const serviceRes = await service.getOptionsAll(req.query);
//             return res.json(new SingleResponse(serviceRes.getData()));
//         }
//     } catch (error) {
//         return next(error);
//     }
// };

// const getOptionsByAreaId = async (req, res, next) => {
//     try {
//         const serviceRes = await service.getOptionsByAreaId(req.query);
//         return res.json(new SingleResponse(serviceRes.getData()));
//     } catch (error) {
//         return next(error);
//     }
// };

const getOptionV2 = async (req, res, next) => {
    try {
        const serviceRes = await service.getOptions(req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getBusinessList,
    createBusiness,
    updateBusiness,
    deleteBusiness,
    businessDetail,
    getOptions,
    getOptionV2,
    // changeStatusBusiness,
    // getOptionsByAreaList,
    // getOptionsByUser,
    // getOptionsByAreaId,
};
