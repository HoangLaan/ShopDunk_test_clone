const customerOfTaskService = require('./customer-of-task.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const optionsService = require('../../common/services/options.service');
const httpStatus = require('http-status');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const axios = require('axios');
const config = require('../../../config/config');

const getOptionsSource = async (req, res, next) => {
    try {
        const serviceRes = await optionsService('MD_SOURCE', req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getOptionsStore = async (req, res, next) => {
    try {
        const serviceRes = await optionsService('MD_STORE', req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getOptionsCustomerType = async (req, res, next) => {
    try {
        const serviceRes = await optionsService('CRM_CUSTOMERTYPE', req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getOptionsTaskType = async (req, res, next) => {
    try {
        const serviceRes = await optionsService('CRM_TASKTYPE', req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getOptionsTaskWorkFlow = async (req, res, next) => {
    try {
        const serviceRes = await customerOfTaskService.getOptionsTaskWorkFlow(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getConfig = async (req, res, next) => {
    try {
        const serviceRes = await optionsService('SYS_APPCONFIG_CUSTOMEROFTASK', req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getOptionsTask = async (req, res, next) => {
    try {
        const serviceRes = await customerOfTaskService.getOptionsTask(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getTaskWorkFlow = async (req, res, next) => {
    try {
        const serviceRes = await customerOfTaskService.getTaskWorkFlow(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getCustomerOfTaskList = async (req, res, next) => {
    try {
        const serviceRes = await customerOfTaskService.getCustomerOfTaskList({ ...req.query, ...req.body });
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const createCustomerOfTask = async (req, res, next) => {
    try {
        // Insert
        const serviceRes = await customerOfTaskService.createCustomerOfTask(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        axios({
            method: 'post',
            url: `${config.domain_service}/customer-of-task`,
            data: {
                ...req.body,
                task_detail_id: serviceRes.getData(),
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

const detailCustomerOfTask = async (req, res, next) => {
    try {
        const serviceRes = await customerOfTaskService.getDetailCustomerOfTask(req.params.task_detail_id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const exportExcel = async (req, res, next) => {
    try {
        const serviceRes = await customerOfTaskService.exportExcel(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const dataRes = serviceRes.getData();
        dataRes.write('danh-sach-khach-hang.xlsx', res);
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getConfig,
    getOptionsTask,
    getOptionsSource,
    getOptionsStore,
    getOptionsCustomerType,
    getOptionsTaskType,
    getCustomerOfTaskList,
    createCustomerOfTask,
    detailCustomerOfTask,
    getTaskWorkFlow,
    getOptionsTaskWorkFlow,
    exportExcel,
};
