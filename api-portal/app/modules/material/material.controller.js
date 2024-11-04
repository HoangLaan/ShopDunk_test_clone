const materialService = require('./material.service');
const SingleResponse = require('../../common/responses/single.response');
const ErrorResponse = require('../../common/responses/error.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const httpStatus = require('http-status');
// const optionService = require('../../common/services/options.service');

/**
 * Get list material
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getListMaterial = async (req, res, next) => {
    try {
        const serviceRes = await materialService.getListMaterial(req.query);
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
 * detail a material
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
/**
 * Get detail
 */
const detailMaterial = async (req, res, next) => {
    try {
        const serviceRes = await materialService.detailMaterial(req.params.materialId);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

/**
 * Delete
 */
const deleteMaterial = async (req, res, next) => {
    try {
        // Delete
        const serviceRes = await materialService.deleteMaterial(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.MATERIAL.DELETE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

/**
 * Create
 */
const createMaterial = async (req, res, next) => {
    try {
        req.body.material = null;
        const serviceRes = await materialService.createOrUpdateMaterial(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.MATERIAL.CREATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

/**
 * Update
 */
const updateMaterial = async (req, res, next) => {
    try {
        const materialId = req.params.materialId;
        req.body.materialId = materialId;
        const serviceResDetail = await materialService.detailMaterial(materialId);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }

        const serviceRes = await materialService.createOrUpdateMaterial(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.MATERIAL.UPDATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

const getOptionsProAttrMaterial = async (req, res, next) => {
    try {
        const serviceRes = await materialService.getOptionsProAttrMaterial(req.params);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getProAttrMateValue = async (req, res, next) => {
    try {
        const serviceRes = await materialService.getProAttrMateValue(req.params);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getListAttributes = async (req, res, next) => {
    try {
        const serviceRes = await materialService.getListAttributes(req.query);
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

const createAttribute = async (req, res, next) => {
    try {
        const serviceRes = await materialService.createAttribute(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), 'ok'));
    } catch (error) {
        return next(error);
    }
};

const exportExcel = async (req, res, next) => {
    try {
        const serviceRes = await materialService.exportExcel(req.query);
        const wb = serviceRes.getData();
        wb.write('exportExcel.xlsx', res);
    } catch (error) {
        return next(error);
    }
};

const downloadTemplate = async (req, res, next) => {
    try {
        let serviceRes = await materialService.downloadTemplate(req.query);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        let data = serviceRes.getData();
        data.write('downloadTemplate.xlsx', res);
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const importExcel = async (req, res, next) => {
    try {
        if (!Boolean(req.file))
            return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, {}, 'Vui lòng chọn file để tải lên.'));

        let serviceRes = await materialService.importExcel(req.body, req.file, req.auth);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        console.log(error);
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getListByProduct = async (req, res, next) => {
    try {
        const serviceRes = await materialService.getListByProduct(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const gencode = async (req, res, next) => {
    try {
        const serviceRes = await materialService.gencode();
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

module.exports = {
    getListMaterial,
    detailMaterial,
    deleteMaterial,
    createMaterial,
    updateMaterial,
    getOptionsProAttrMaterial,
    getProAttrMateValue,
    getListAttributes,
    createAttribute,
    exportExcel,
    downloadTemplate,
    importExcel,
    getListByProduct,
    gencode,
};
