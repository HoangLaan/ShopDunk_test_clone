const customerTypeClass = require('./customer-type.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const { saveFile } = require('../../common/helpers/file.helper');
const folderName = 'customer-type';

const CUSTOMER_TYPE = {
    INDIVIDUAL: 1,
    ENTERPRISE: 2,
    LEADS: 3
}

const getListCustomerType = async (queryParams = {}) => {
    try {

        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getValueFromObject(queryParams, 'keyword');

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('KEYWORD', keyword)
            .input('BUSINESSID', apiHelper.getValueFromObject(queryParams, 'business_id'))
            .input('COMPANYID', apiHelper.getValueFromObject(queryParams, 'company_id'))
            .input('OBJECTYPE', apiHelper.getValueFromObject(queryParams, 'object_type'))
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active') || '2')
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'create_date_from'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'create_date_to'))
            .execute(PROCEDURE_NAME.CRM_CUSTOMERTYPE_GETLIST);

        const customerTypes = data.recordset;
        return new ServiceResponse(true, '', {
            data: customerTypeClass.list(customerTypes),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(customerTypes),
        });
    } catch (e) {
        logger.error(e, { function: 'customerTypeService.getListcustomerType' });

        return new ServiceResponse(true, '', {});
    }
};

const createCustomerTypeOrUpdate = async (body = {}) => {
    const pool = await mssql.pool;
    try {
        let icon_url = apiHelper.getValueFromObject(body, 'icon_url');
        if (icon_url) {
            const path_icon = await saveFile(icon_url, folderName);
            if (path_icon) {
                icon_url = path_icon;
            }
        }

        const customer_type = apiHelper.getValueFromObject(body, 'customer_type');

        const customer_type_id = apiHelper.getValueFromObject(body, 'customer_type_id')
        const data = await pool
            .request()
            .input('CUSTOMERTYPEID', customer_type_id)
            .input('BUSINESSID', apiHelper.getValueFromObject(body, 'business_id'))
            .input('COLOR', apiHelper.getValueFromObject(body, 'color'))
            .input('COMPANYID', apiHelper.getValueFromObject(body, 'company_id'))
            .input('CONDITION1', apiHelper.getValueFromObject(body, 'condition_1'))
            .input('CONDITION2', apiHelper.getValueFromObject(body, 'condition_2'))
            .input('ISMEMBERTYPE', customer_type === 1)
            .input('ISBUSSINESS', customer_type === 2)
            .input('ISCUSTOMERLEAD', customer_type === 3)
            .input('CUSTOMERTYPENAME', apiHelper.getValueFromObject(body, 'customer_type_name'))
            .input('DEBTTIME', Number(apiHelper.getValueFromObject(body, 'debt_time')))
            .input('DESCRIPTION', apiHelper.getValueFromObject(body, 'description'))
            .input('ISACTIVE', apiHelper.getValueFromObject(body, 'is_active'))
            .input('ISSYSTEM', apiHelper.getValueFromObject(body, 'is_system'))
            .input('NOTECOLOR', apiHelper.getValueFromObject(body, 'note_color'))
            .input('ORDERINDEX', apiHelper.getValueFromObject(body, 'order_index'))
            .input('TIMELIMIT', apiHelper.getValueFromObject(body, 'time_limit'))
            .input('TIMETOTALBUYFROM', apiHelper.getValueFromObject(body, 'time_total_buy_from'))
            .input('TIMETOTALBUYTO', apiHelper.getValueFromObject(body, 'time_total_buy_to'))
            .input('TIMETOTALPAIDFROM', apiHelper.getValueFromObject(body, 'time_total_paid_from'))
            .input('TIMETOTALPAIDTO', apiHelper.getValueFromObject(body, 'time_total_paid_to'))
            .input('TIMETOTALPOINTFROM', apiHelper.getValueFromObject(body, 'time_total_point_from'))
            .input('TIMETOTALPOINTTO', apiHelper.getValueFromObject(body, 'time_total_point_to'))
            .input('TIMETYPE', apiHelper.getValueFromObject(body, 'time_type'))
            .input('TIMETYPETOTALBUY', apiHelper.getValueFromObject(body, 'time_type_total_buy'))
            .input('TIMETYPETOTALPAID', apiHelper.getValueFromObject(body, 'time_type_total_paid'))
            .input('TIMETYPETOTALPOINT', apiHelper.getValueFromObject(body, 'time_type_total_point'))
            .input('TOTALBUYFROM', apiHelper.getValueFromObject(body, 'total_buy_from'))
            .input('TOTALBUYTO', apiHelper.getValueFromObject(body, 'total_buy_to'))
            .input('TOTALPAIDFROM', apiHelper.getValueFromObject(body, 'total_paid_from'))
            .input('TOTALPAIDTO', apiHelper.getValueFromObject(body, 'total_paid_to'))
            .input('TOTALPOINTFROM', apiHelper.getValueFromObject(body, 'total_point_from'))
            .input('TOTALPOINTTO', apiHelper.getValueFromObject(body, 'total_point_to'))
            .input('ICONURL', icon_url)
            .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
            .execute(PROCEDURE_NAME.CRM_CUSTOMERTYPE_CREATEORUPDATE);

        if (!data.recordset[0].RESULT) {
            return new ServiceResponse(false, `${customer_type_id ? 'Cập nhật' : 'Tạo mới'} loại khách hàng thất bại !`, null);
        }

        removeCacheOptions();
        return new ServiceResponse(true, `${customer_type_id ? 'Cập nhật' : 'Tạo mới'} loại khách hàng thành công`, data.recordset[0].RESULT);
    } catch (error) {
        logger.error(error, { customerType: 'customerTypeService.createCustomerTypeOrUpdate' });
        return new ServiceResponse(false, e.message);
    }
};

const detailCustomerType = async (customer_type_id) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('CUSTOMERTYPEID', customer_type_id)
            .execute(PROCEDURE_NAME.CRM_CUSTOMERTYPE_GETBYID);
        const customerType = data.recordset[0] || {};
        if (customerType) {
            let _customerType = customerTypeClass.detail(customerType);
            let _customer_type = null;

            if(_customerType?.is_member_type){
                _customerType.customer_type = CUSTOMER_TYPE.INDIVIDUAL
            } else if (_customerType?.is_business){
                _customerType.customer_type = CUSTOMER_TYPE.ENTERPRISE
            } else if (_customerType?.is_customer_lead){
                _customerType.customer_type = CUSTOMER_TYPE.LEADS
            }
            return new ServiceResponse(true, '', _customerType);
        }
        return new ServiceResponse(false, '', null);
    } catch (e) {
        logger.error(e, { function: 'customerTypeService.detailcustomerType' });

        return new ServiceResponse(false, e.message);
    }
};

const deleteCustomerType = async (bodyParams) => {
    try {
        const pool = await mssql.pool;
        let list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []);
        await pool
            .request()
            .input('LISTID', list_id)
            .input('NAMEID', 'CUSTOMERTYPEID')
            .input('TABLENAME', 'CRM_CUSTOMERTYPE')
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('CBO_COMMON_SOFTDELETE');

        removeCacheOptions();

        // Return ok
        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, { function: 'customerTypeService.deletecustomerType' });

        // Return failed
        return new ServiceResponse(false, e.message);
    }
};

const checkUsedCustomerType = async (customer_type_id) => {
    const pool = await mssql.pool;
    try {
        // Delete user group
        const data = await pool
            .request()
            .input('CUSTOMERTYPEID', customer_type_id)
            .execute(PROCEDURE_NAME.CRM_CUSTOMERTYPE_CHECKUSED);
        return new ServiceResponse(true, '', data.recordset[0].RESULT);
    } catch (e) {
        logger.error(e, { function: 'customerTypeService.checkUsedCustomerType' });
        // Return failed
        return new ServiceResponse(false, e.message);
    }
};
const changeStatusCustomerType = async (customer_type_id, bodyParams) => {
    try {
        const pool = await mssql.pool;
        await pool
            .request()
            .input('CUSTOMERTYPEID', customer_type_id)
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute(PROCEDURE_NAME.CRM_CUSTOMERTYPE_UPDATESTATUS);
        removeCacheOptions();
        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, { function: 'customerTypeService.changeStatuscustomerType' });

        return new ServiceResponse(false);
    }
};
const removeCacheOptions = () => {
    return cacheHelper.removeByKey(CACHE_CONST.CRM_CUSTOMERTYPE_OPTIONS);
};

module.exports = {
    getListCustomerType,
    createCustomerTypeOrUpdate,
    detailCustomerType,
    deleteCustomerType,
    changeStatusCustomerType,
    checkUsedCustomerType,
};
