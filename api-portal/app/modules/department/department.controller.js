const departmentService = require('./department.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');

/**
 * Get list
 */
const getListDepartment = async (req, res, next) => {
    try {
        const serviceRes = await departmentService.getListDepartment(req.query);
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

/**
 * Get detail
 */
const detailDepartment = async (req, res, next) => {
    try {
        const departmentId = req.params.department_id;
        const serviceRes = await departmentService.detailDepartment(departmentId);
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
const createDepartment = async (req, res, next) => {
    try {
        req.body.department_id = null;
        const serviceRes = await departmentService.createDepartmentOrUpdate(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.DEPARTMENT.CREATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

/**
 * Update
 */
const updateDepartment = async (req, res, next) => {
    try {
        const departmentId = req.params.department_id;
        req.body.department_id = departmentId;

        // Check exists
        const serviceResDetail = await departmentService.detailDepartment(departmentId);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }

        // Update
        const serviceRes = await departmentService.createDepartmentOrUpdate(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.DEPARTMENT.UPDATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

/**
 * Change status
 */
const changeStatusDepartment = async (req, res, next) => {
    try {
        const departmentId = req.params.department_id;

        // Check exists
        const serviceResDetail = await departmentService.detailDepartment(departmentId);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }

        // Update status
        await departmentService.changeStatusDepartment(departmentId, req.body);
        return res.json(new SingleResponse(null, RESPONSE_MSG.DEPARTMENT.CHANGE_STATUS_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

/**
 * Delete CRM_Department
 */
const deleteDepartment = async (req, res, next) => {
    try {
        const departmentId = req.params.department_id;
        // Check exists
        const serviceResDetail = await departmentService.detailDepartment(departmentId);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }

        // Delete
        const serviceRes = await departmentService.deleteDepartment(departmentId, req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.DEPARTMENT.DELETE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

/**
 * Get list options department
 */
const getOptions = async (req, res, next) => {
    try {
        const serviceRes = await optionService('MD_DEPARTMENT', req.query);

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

/**
 * Get department by company
 */
const getDepartmentByCompany = async (req, res, next) => {
    try {
        const companyId = req.query.company_id;
        const serviceRes = await departmentService.getDepartmentByCompany(companyId);

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

/**
 * Get list options department
 */
const getOptionsUserByDepartment = async (req, res, next) => {
    try {
        const serviceRes = await departmentService.getOptionsUserByDepartmentBusinees(req.params);

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getListDepartment,
    detailDepartment,
    createDepartment,
    updateDepartment,
    changeStatusDepartment,
    deleteDepartment,
    getOptions,
    getOptionsUserByDepartment,
    getDepartmentByCompany,
};
