const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const outputTypeService = require('./output-type.service');

/**
 * Get list
 */
const getListOutputType = async (req, res, next) => {
    try {
        const serviceRes = await outputTypeService.getListOutputType(req.query);
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

/**
 * Get detail
 */
const detailOutputType = async (req, res, next) => {
    try {
        const output_type_id = req.params.output_type_id;
        const serviceRes = await outputTypeService.detailOutputType(output_type_id, true);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

/**
 * Create
 */
const createOutputType = async (req, res, next) => {
    try {
        req.body.output_type_id = null;
        const serviceRes = await outputTypeService.createOutputTypeOrUpdate(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.OUTPUTTYPE.CREATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

/**
 * Update
 */
const updateOutputType = async (req, res, next) => {
    try {
        const output_type_id = req.params.output_type_id;
        req.body.output_type_id = output_type_id;
        // Check exists
        const serviceResDetail = await outputTypeService.detailOutputType(output_type_id);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }

        // Update
        const serviceRes = await outputTypeService.createOutputTypeOrUpdate(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.OUTPUTTYPE.UPDATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

/**
 * Change status
 */
const changeStatusOutputType = async (req, res, next) => {
    try {
        const output_type_id = req.params.output_type_id;
        // Check exists
        const serviceResDetail = await outputTypeService.detailOutputType(output_type_id);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }

        // Update status
        await outputTypeService.changeStatusOutputType(output_type_id, req.body);
        return res.json(new SingleResponse(null, RESPONSE_MSG.OUTPUTTYPE.CHANGE_STATUS_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

const deleteOutputType = async (req, res, next) => {
    try {
        const output_type_id = req.query.output_type_id;
        // Check exists
        // const serviceResDetail = await outputTypeService.detailOutputType(output_type_id);
        // if(serviceResDetail.isFailed()) {
        //   return next(serviceResDetail);
        // }

        console.log(req.query);
        // Delete
        const serviceRes = await outputTypeService.deleteOutputType(output_type_id, req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.OUTPUTTYPE.DELETE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

const getOptions = async (req, res, next) => {
    try {
        const serviceRes = await outputTypeService.getOptions(req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getOptions,
    getListOutputType,
    createOutputType,
    updateOutputType,
    detailOutputType,
    deleteOutputType,
    changeStatusOutputType,
};
