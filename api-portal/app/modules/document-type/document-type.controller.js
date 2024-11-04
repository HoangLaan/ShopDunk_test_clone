
const documentTypeService = require('./document-type.service');
const SingleResponse = require('../../common/responses/single.response');
const ErrorResponse = require('../../common/responses/error.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');

/**
 * Get list options education level
 */
const getOptions = async (req, res, next) => {
    try {
        const serviceRes = await documentTypeService.getOptions(req.query);
        if (serviceRes.isFailed()) return next(serviceRes)
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

/**
 * Get list
 */
const getListDocumentType = async (req, res, next) => {
    try {
        const serviceRes = await documentTypeService.getListDocumentType(req.body, req.query);
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
 * Get detail
 */
const detailDocumentType = async (req, res, next) => {
    try {
        const serviceRes = await documentTypeService.detailDocumentType(req.params.document_type_id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData(), serviceRes.getMessage()));
    } catch (error) {
        return next(error);
    }
};

/**
 * Create
 */
const createDocumentType = async (req, res, next) => {
    try {
        const serviceRes = await documentTypeService.createOrUpdateDocumentType(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), serviceRes.getMessage()));
    } catch (error) {
        return next(error);
    }
};

/**
 * Update
 */
const updateDocumentType = async (req, res, next) => {
    try {
        const serviceRes = await documentTypeService.createOrUpdateDocumentType(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), serviceRes.getMessage()));
    } catch (error) {
        return next(error);
    }
};


/**
 * Delete
 */
const deleteDocumentType = async (req, res, next) => {
    try {
        let document_type_id = req.params.document_type_id;
        const serviceRes = await documentTypeService.deleteDocumentType(document_type_id, req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), serviceRes.getMessage()));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getOptions,
    getListDocumentType,
    detailDocumentType,
    createDocumentType,
    updateDocumentType,
    deleteDocumentType,
};
