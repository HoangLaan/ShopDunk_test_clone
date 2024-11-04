const timeKeepingClaimService = require('./time-keeping-claim.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');
const ErrorResponse = require('../../common/responses/error.response');
const httpStatus = require('http-status');
/**
 * Get list CRM_SEGMENT
 */
const getListTimeKeepingClaim = async (req, res, next) => {
    try {
        const serviceRes = await timeKeepingClaimService.getListTimeKeepingClaim({ ...req.query, ...req.body });
        if (serviceRes.isFailed()) return next(serviceRes);
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

/**
 * Get detail TimeKeepingClaim
 */
const detailTimeKeepingClaim = async (req, res, next) => {
    try {
        // Check company exists
        req.body.time_keeping_claim_id = req.params.id;
        const serviceRes = await timeKeepingClaimService.detailTimeKeepingClaim(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

/**
 * Create new a MD_AREA
 */
const createTimeKeepingClaim = async (req, res, next) => {
    try {
        const serviceRes = await timeKeepingClaimService.createOrUpdateTimeKeepingClaim({
            ...req.body,
            auth: req.auth,
        });
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.AREA.CREATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

/**
 * Update a MD_AREA
 */
const updateTimeKeepingClaim = async (req, res, next) => {
    try {
        const serviceRes = await timeKeepingClaimService.createOrUpdateTimeKeepingClaim(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.AREA.UPDATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

/**
 * Delete CRM_SEGMENT
 */
const deleteTimeKeepingClaim = async (req, res, next) => {
    try {
        // Delete timeKeepingClaim
        const serviceRes = await timeKeepingClaimService.deleteTimeKeepingClaim({ ...req.body, ...req.query });
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(null, RESPONSE_MSG.AREA.DELETE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

const updateReview = async (req, res, next) => {
    try {
        const serviceRes = await timeKeepingClaimService.updateReview(req.body);
        if (serviceRes.isFailed()) return next(serviceRes);
        return res.json(new SingleResponse(serviceRes.getData(), serviceRes.getMessage()));
    } catch (error) {
        return next(error);
    }
};

const getDetailTimeKeepingClaimByScheduleId = async (req, res, next) => {
    try {
        // Check company exists
        req.body.schedule_id = req.params.id;
        const serviceRes = await timeKeepingClaimService.getDetailTimeKeepingClaimByScheduleId({
            ...req.body,
            ...req.query,
        });
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const countTimesExplained = async (req, res, next) => {
    try {
        // Check company exists
        const serviceRes = await timeKeepingClaimService.countTimesExplained({ ...req.query, ...req.body });
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const ExportExcelTimeKeepingClaim = async (req, res, next) => {
    try {
        const serviceRes = await timeKeepingClaimService.ExportExcelTimeKeepingClaim({ ...req.query });
        if (serviceRes.isFailed()) {
            return next(
                new ErrorResponse(httpStatus.NOT_IMPLEMENTED, serviceRes.getErrors(), 'Xuất file không thành công.'),
            );
        }
        const wb = serviceRes.getData();
        wb.write('DS_Giai_Trinh.xlsx', res);
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    updateReview,
    // done
    createTimeKeepingClaim,
    updateTimeKeepingClaim,
    deleteTimeKeepingClaim,
    getListTimeKeepingClaim,
    detailTimeKeepingClaim,
    getDetailTimeKeepingClaimByScheduleId,
    countTimesExplained,
    ExportExcelTimeKeepingClaim
};
