const httpStatus = require('http-status');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const ValidationResponse = require('../../common/responses/validation.response');
const optionService = require('../../common/services/options.service');
const apiHelper = require('../../common/helpers/api.helper');
const service = require('./task.service');
const config = require('../../../config/config');
const axios = require('axios');
/**
 * Get list
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getTaskList = async (req, res, next) => {
    try {
        const serviceRes = await service.getTaskList(req.query);
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
 * Create
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const createTask = async (req, res, next) => {
    try {
        // Insert
        const serviceRes = await service.createOrUpdateTask(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.CONTRACT.CREATE_SUCCESS));
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
const updateTask = async (req, res, next) => {
    try {
        // Check exists
        const serviceResDetail = await service.taskDetail(req.body.task_id);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }

        // Update
        const serviceRes = await service.createOrUpdateTask(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(null, RESPONSE_MSG.CONTRACT.UPDATE_SUCCESS));
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
const deleteTask = async (req, res, next) => {
    try {
        // Delete
        const serviceRes = await service.deleteTask(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.CONTRACT.DELETE_SUCCESS));
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
const taskDetail = async (req, res, next) => {
    try {
        const serviceRes = await service.taskDetail(req.params.task_id);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const taskCareDetail = async (req, res, next) => {
    try {
        const serviceRes = await service.taskCareDetail(req.params);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const createCareComment = async (req, res, next) => {
    try {
        const serviceRes = await service.createCareComment(req.body);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        axios({
            method: 'post',
            url: `${config.domain_service}/task/comment`,
            data: {
                ...req.body,
            },
            headers: { Authorization: `APIKEY ${config.service_apikey}` },
        })
            .then((response) => {})
            .catch((error) => {})
            .finally(() => {});
        return res.json(new SingleResponse(serviceRes, RESPONSE_MSG.CONTRACT.CREATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const updateInterestContent = async (req, res, next) => {
    try {
        const serviceRes = await service.updateInterestContent(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.CONTRACT.UPDATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getCareCommentList = async (req, res, next) => {
    try {
        const serviceRes = await service.getCareCommentList(req.query);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getCareProductList = async (req, res, next) => {
    try {
        const serviceRes = await service.getCareProductList(req.query);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const changeWorkFlow = async (req, res, next) => {
    try {
        const serviceRes = await service.changeWorkFlow(req.body);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        axios({
            method: 'post',
            url: `${config.domain_service}/task/change-work-flow`,
            data: {
                ...req.body,
            },
            headers: { Authorization: `APIKEY ${config.service_apikey}` },
        })
            .then((response) => {})
            .catch((error) => {})
            .finally(() => {});
        return res.json(new SingleResponse(null, RESPONSE_MSG.CONTRACT.UPDATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getCareHistoryList = async (req, res, next) => {
    try {
        const serviceRes = await service.getCareHistoryList(Object.assign(req.params, req.query));

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
 * Get options
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getOptions = async (req, res, next) => {
    try {
        const serviceRes = await service.getOptions(req.query);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getTaskTypeOptions = async (req, res, next) => {
    try {
        const serviceRes = await optionService('CRM_TASKTYPE', req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getStoreOptionsByCompany = async (req, res, next) => {
    try {
        const serviceRes = await optionService('MD_STORE', req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getDepartmentOptionsByCompany = async (req, res, next) => {
    try {
        const serviceRes = await optionService('MD_DEPARTMENT', req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getUserOptionsByDepartmentStore = async (req, res, next) => {
    try {
        const serviceRes = await service.getUserOptionsByDepartmentStore(req.query);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getProductOptions = async (req, res, next) => {
    try {
        const serviceRes = await optionService('MD_PRODUCT', req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getMemberList = async (req, res, next) => {
    try {
        const serviceRes = await service.getMemberList(req.query);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        const { data, total, page, limit } = serviceRes.getData();

        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const createSMSCustomer = async (req, res, next) => {
    try {
        const serviceRes = await service.createSMSCustomer(req.body);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(null, RESPONSE_MSG.CONTRACT.CREATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const updateSMSStatus = async (req, res, next) => {
    try {
        const serviceRes = await service.updateSMSStatus(req.query);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(null, RESPONSE_MSG.CONTRACT.UPDATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const createCallCustomer = async (req, res, next) => {
    try {
        const serviceRes = await service.createCallCustomer(req.body);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(null, RESPONSE_MSG.CONTRACT.CREATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const createMeetingCustomer = async (req, res, next) => {
    try {
        const serviceRes = await service.createMeetingCustomer(req.body);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        axios({
            method: 'post',
            url: `${config.domain_service}/meeting`,
            data: {
                ...req.body,
                announce_id: serviceRes.getData()?.id || '',
            },
            headers: { Authorization: `APIKEY ${config.service_apikey}` },
        })
            .then((response) => {})
            .catch((error) => {})
            .finally(() => {});

        return res.json(new SingleResponse(null, RESPONSE_MSG.CONTRACT.CREATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getCustomerList = async (req, res, next) => {
    try {
        const serviceRes = await service.getCustomerList(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit, meta } = serviceRes.getData();
        const listRes = new ListResponse(data, total, page, limit);
        listRes.data.meta = meta;
        return res.json(listRes);
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getCustomerListByUser = async (req, res, next) => {
    try {
        const serviceRes = await service.getCustomerListByUser(req.query, req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit, meta } = serviceRes.getData();
        const listRes = new ListResponse(data, total, page, limit);
        listRes.data.meta = meta;
        return res.json(listRes);
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getBrandnameOptions = async (req, res, next) => {
    try {
        const serviceRes = await service.getBrandnameOptions();

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getSmsTemplateOptions = async (req, res, next) => {
    try {
        const serviceRes = await service.getSmsTemplateOptions(req.query);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getTaskTypeAutoOptions = async (req, res, next) => {
    try {
        const serviceRes = await service.getTaskTypeAutoOptions(req.query);
        let result = [];
        if (serviceRes.getData()) {
            result = serviceRes.getData()?.data;
        }
        return res.json(new SingleResponse(result));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * Get task detail with Voip
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getTaskWithVoip = async (req, res, next) => {
    try {
        const serviceRes = await service.getTaskWithVoip(req.query);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};
module.exports = {
    getTaskList,
    createTask,
    updateTask,
    deleteTask,
    taskDetail,
    taskCareDetail,
    createCareComment,
    getCareCommentList,
    changeWorkFlow,
    getCareHistoryList,
    getOptions,
    getTaskTypeOptions,
    getStoreOptionsByCompany,
    getDepartmentOptionsByCompany,
    getUserOptionsByDepartmentStore,
    getProductOptions,
    getMemberList,

    createSMSCustomer,
    updateSMSStatus,
    createCallCustomer,
    createMeetingCustomer,
    getCustomerList,
    getCustomerListByUser,

    getBrandnameOptions,
    getSmsTemplateOptions,
    getTaskTypeAutoOptions,

    getTaskWithVoip,
    updateInterestContent,
    getCareProductList
};
