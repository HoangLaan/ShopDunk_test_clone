const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const cache = require('../../common/classes/cache.class');
const API_CONST = require('../../common/const/api.const');
const _ = require('lodash');
const fileHelper = require('../../common/helpers/file.helper');
const config = require('../../../config/config');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const payrollTemplateClass = require('./payroll-template.class');

const getList = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'keyword'))
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'created_date_from'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'created_date_to'))
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .execute('SA_PAYROLLTEMPLATE_GetList_AdminWeb');
        const payrollTemplateRecord = data.recordset;
        return new ServiceResponse(true, 'Lấy danh sách mẫu bảng lương thành công', {
            data: payrollTemplateClass.list(payrollTemplateRecord),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(payrollTemplateRecord),
        });
    } catch (e) {
        logger.error(e, { function: 'payrollTemplateService.getSalaryElementList' });
        return new ServiceResponse(true, '', {});
    }
};

const getSalaryElementList = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'keyword'))
            .input('COMPANYID', apiHelper.getValueFromObject(queryParams, 'company_id'))
            .input('ELEMENTTYPE', apiHelper.getValueFromObject(queryParams, 'element_type'))
            .input('PROPERTY', apiHelper.getValueFromObject(queryParams, 'property'))
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'created_date_from'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'created_date_to'))
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .execute('SA_ELEMENT_GetListModal_AdminWeb');
        const salaryElementRecord = data.recordset;
        return new ServiceResponse(true, '', {
            data: payrollTemplateClass.listSalaryElement(salaryElementRecord),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(salaryElementRecord),
        });
    } catch (e) {
        logger.error(e, { function: 'payrollTemplateService.getSalaryElementList' });
        return new ServiceResponse(true, '', {});
    }
};

const createOrUpdate = async (bodyParams = {}) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        await transaction.begin();
        const templateId = apiHelper.getValueFromObject(bodyParams, 'template_id');
        const requestTemplate = new sql.Request(transaction);
        const resTemplate = await requestTemplate
            .input('TEMPLATEID', templateId)
            .input('TEMPLATENAME', apiHelper.getValueFromObject(bodyParams, 'template_name'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active', 1))
            .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system', 0))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('SA_PAYROLLTEMPLATE_CreateOrUpdate_AdminWeb');

        const templateIdCreated = resTemplate.recordset[0].id;

        if (!templateIdCreated || templateIdCreated <= 0) {
            return new ServiceResponse(false, 'Tạo mẫu bảng lương thất bại', null);
        }

        bodyParams.template_id = templateIdCreated ?? templateId;
        // Nếu là update thì xóa các table map
        if (templateId) {
            // SalaryElement
            const requestSalaryElementDel = new sql.Request(transaction);
            const resSalaryElementDel = await deletePTSalaryElement(bodyParams, requestSalaryElementDel);
            if (resSalaryElementDel.isFailed()) {
                await transaction.rollback();
                return new ServiceResponse(false, resSalaryElementDel.getMessage());
            }
        }

        // SalaryElement
        const elements = apiHelper.getValueFromObject(bodyParams, 'elements', []);
        const requestPTSalaryElement = new sql.Request(transaction);
        for (const element of elements) {
            bodyParams.element_id = element.element_id;
            bodyParams.is_show = element.is_show;
            bodyParams.display_name = element.display_name;
            const resPTSalaryElement = await createOrUpdatePTSalaryElement(bodyParams, requestPTSalaryElement);
            if (resPTSalaryElement.isFailed()) {
                await transaction.rollback();
                return new ServiceResponse(true, resPTSalaryElement.getMessage());
            }
        }

        await transaction.commit();
        removeCacheOptions();
        return new ServiceResponse(true, 'Tạo thành công mẫu bảng lương');
    } catch (error) {
        await transaction.rollback();
        logger.error(error, { function: 'payrollTemplateService.createOrUpdate' });

        return new ServiceResponse(false, error?.message);
    }
};

const detail = async (bodyParams = {}) => {
    try {
        const template_id = apiHelper.getValueFromObject(bodyParams, 'template_id');
        const pool = await mssql.pool;
        const resData = await pool
            .request()
            .input('TEMPLATEID', template_id)
            .execute('SA_PAYROLLTEMPLATE_GetById_AdminWeb');

        const payroll = resData.recordset[0];
        if (!payroll) {
            return new ServiceResponse(false, 'Lấy chi tiết mẫu bảng lương thất bại');
        }

        const payrollDetail = payrollTemplateClass.detail(payroll);
        payrollDetail.position_id = payrollDetail.position_list?.split(',')?.map((item) => parseInt(item)) ?? [];
        delete payrollDetail.position_list;

        payrollDetail.position_level_id =
            payrollDetail.position_level_list?.split(',')?.map((item) => parseInt(item)) ?? [];
        delete payrollDetail.position_level_list;

        const salaryElement = await getSalaryElementByPayrollTemplateId(template_id);
        if (salaryElement.isFailed()) {
            return new ServiceResponse(false, salaryElement.getMessage(), payrollDetail);
        }
        payrollDetail.salary_element = salaryElement.getData();

        return new ServiceResponse(true, 'Lấy chi tiết mẫu bảng lương thành công', payrollDetail);
    } catch (e) {
        logger.error(e, { function: 'payrollTemplateService.detail' });

        return new ServiceResponse(false, e.message);
    }
};

const createOrUpdatePTSalaryElement = async (bodyParams = {}, reqTrans) => {
    try {
        const resPTPositionLevel = await reqTrans
            .input('TEMPLATEID', apiHelper.getValueFromObject(bodyParams, 'template_id'))
            .input('ELEMENTID', apiHelper.getValueFromObject(bodyParams, 'element_id'))
            .input('ISSHOW', apiHelper.getValueFromObject(bodyParams, 'is_show', 0))
            .input('DISPLAYNAME', apiHelper.getValueFromObject(bodyParams, 'display_name', ''))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('SA_PAYROLLTEMPLATE_ELEMENT_CreateOrUpdate_AdminWeb');

        const templateId = resPTPositionLevel.recordset[0].id;

        if (!templateId || templateId <= 0) {
            return new ServiceResponse(false, 'Tạo thành phần lương thất bại');
        }

        return new ServiceResponse(true, 'Tạo thành phần lương thành công');
    } catch (error) {
        logger.error(error, { function: 'payrollTemplateService.createOrUpdatePTSalaryElement' });

        return new ServiceResponse(false, error.message);
    }
};

const deletePTSalaryElement = async (bodyParams = {}, reqTrans) => {
    try {
        const resDelete = await reqTrans
            .input('TEMPLATEID', apiHelper.getValueFromObject(bodyParams, 'template_id'))
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('SA_PAYROLLTEMPLATE_ELEMENT_Delete_AdminWeb');

        return new ServiceResponse(true, 'Xóa thành phần lương thành công');
    } catch (error) {
        logger.error(error, { function: 'payrollTemplateService.deletePTSalaryElement' });
        return new ServiceResponse(false, error.message);
    }
};

const getSalaryElementByPayrollTemplateId = async (template_id) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('TEMPLATEID', template_id)
            .execute('SA_ELEMENT_GetByPayrollTemplateId_AdminWeb');
        return new ServiceResponse(
            true,
            'Lấy thành phần lương thất bại',
            payrollTemplateClass.listSEByPayrollTemplate(data.recordset),
        );
    } catch (e) {
        logger.error(e, { function: 'payrollTemplateService.getSalaryElementByPayrollTemplateId' });
        return new ServiceResponse(true, e.message);
    }
};

const remove = async (bodyParams = {}) => {
    const pool = await mssql.pool;
    try {
        const data = await pool
            .request()
            .input('LISTID', apiHelper.getValueFromObject(bodyParams, 'list_id', []))
            .input('NAMEID', 'TEMPLATEID')
            .input('TABLENAME', 'SA_PAYROLLTEMPLATE')
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('CBO_COMMON_SOFTDELETE');

        removeCacheOptions();
        return new ServiceResponse(true, 'Xóa mẫu bảng lương thành công');
    } catch (e) {
        logger.error(e, { function: 'payrollTemplateService.remove' });
        return new ServiceResponse(false, e.message);
    }
};

const removeCacheOptions = () => {
    return cacheHelper.removeByKey(CACHE_CONST.SA_PAYROLLTEMPLATE_OPTIONS);
};

module.exports = {
    getSalaryElementList,
    createOrUpdate,
    detail,
    getList,
    remove,
};
