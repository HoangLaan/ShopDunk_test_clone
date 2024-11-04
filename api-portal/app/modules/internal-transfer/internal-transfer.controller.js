const internalTransferService = require('./internal-transfer.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');
const ErrorResponse = require('../../common/responses/error.response');
const httpStatus = require('http-status');
const fileHelper = require('../../common/helpers/file.helper');

/**
 * Get list CRM_SEGMENT
 */
const getListInternalTransfer = async (req, res, next) => {
    try {
        const serviceRes = await internalTransferService.getListInternalTransfer(req.query);
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

/**
 * Get detail CRM_SEGMENT
 */
const detailInternalTransfer = async (req, res, next) => {
    try {
        // Check company exists
        req.body.internal_transfer_id = req.params.id;
        const serviceRes = await internalTransferService.detailInternalTransfer(req.body);
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
const createInternalTransfer = async (req, res, next) => {
    try {
        const serviceRes = await internalTransferService.createOrUpdateInternalTransfer(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData(), serviceRes.getMessage()));
    } catch (error) {
        return next(error);
    }
};

/**
 * Update a MD_AREA
 */
const updateInternalTransfer = async (req, res, next) => {
    try {
        const serviceRes = await internalTransferService.createOrUpdateInternalTransfer(req.body);
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
const deleteInternalTransfer = async (req, res, next) => {
    try {
        // Delete timeKeepingClaim
        const serviceRes = await internalTransferService.deleteInternalTransfer({ ...req.body, ...req.query });
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(null, RESPONSE_MSG.AREA.DELETE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

const genCode = async (req, res, next) => {
    try {
        const serviceRes = await internalTransferService.genCode();
        if (serviceRes.isFailed()) return next(serviceRes);
        return res.json(new SingleResponse(serviceRes.getData(), serviceRes.getMessage()));
    } catch (error) {
        return next(error);
    }
};

const getStoreOptions = async (req, res, next) => {
    try {
        const serviceRes = await internalTransferService.getStoreOptions(req.body);
        if (serviceRes.isFailed()) return next(serviceRes);
        return res.json(new SingleResponse(serviceRes.getData(), serviceRes.getMessage()));
    } catch (error) {
        return next(error);
    }
};

const getBankAccountOptions = async (req, res, next) => {
    try {
        const serviceRes = await internalTransferService.getBankAccountOptions(req.query);
        if (serviceRes.isFailed()) return next(serviceRes);
        return res.json(new SingleResponse(serviceRes.getData(), serviceRes.getMessage()));
    } catch (error) {
        return next(error);
    }
};

const getInternalTransferTypeOptions = async (req, res, next) => {
    try {
        const serviceRes = await internalTransferService.getInternalTransferTypeOptions(req.query);
        if (serviceRes.isFailed()) return next(serviceRes);
        return res.json(new SingleResponse(serviceRes.getData(), serviceRes.getMessage()));
    } catch (error) {
        return next(error);
    }
};

const getInternalTransferTypeReviewLevelList = async (req, res, next) => {
    try {
        const serviceRes = await internalTransferService.getInternalTransferTypeReviewLevelList(req.query);
        if (serviceRes.isFailed()) return next(serviceRes);
        return res.json(new SingleResponse(serviceRes.getData(), serviceRes.getMessage()));
    } catch (error) {
        return next(error);
    }
};

const updateReviewLevel = async (req, res, next) => {
    try {
        const serviceRes = await internalTransferService.updateReviewLevel({ ...req.query, ...req.body });
        if (serviceRes.isFailed()) return next(serviceRes);
        return res.json(new SingleResponse(serviceRes.getData(), serviceRes.getMessage()));
    } catch (error) {
        return next(error);
    }
};

const countReviewStatus = async (req, res, next) => {
    try {
        const serviceRes = await internalTransferService.countReviewStatus(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const upload = async (req, res, next) => {
    try {
        if (!req.files || !req.files[0])
            return next(
                new ErrorResponse(
                    httpStatus.NOT_IMPLEMENTED,
                    RESPONSE_MSG.REQUEST_FAILED,
                    'Tải tệp lên không thành công !',
                ),
            );

        const file = req.files[0];
        if (file.buffer || !file.includes(config.domain_cdn)) {
            url = await fileHelper.saveFileV2(file);
        } else {
            url = file.split(config.domain_cdn)[1];
        }
        return res.json(
            new SingleResponse({
                attachment_name: file.originalname,
                attachment_path: `${url}`,
            }),
        );
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    detailInternalTransfer,
    getStoreOptions,
    createInternalTransfer,
    updateInternalTransfer,
    deleteInternalTransfer,
    getListInternalTransfer,
    genCode,
    getBankAccountOptions,
    getInternalTransferTypeOptions,
    getInternalTransferTypeReviewLevelList,
    updateReviewLevel,
    countReviewStatus,
    upload,
};
