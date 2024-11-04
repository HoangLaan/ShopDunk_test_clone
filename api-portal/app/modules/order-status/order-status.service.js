const orderStatusClass = require('../order-status/order-status.class');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const config = require('../../../config/config');
const fileHelper = require('../../common/helpers/file.helper');

const getListOrderStatus = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getSearch(queryParams);
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('KEYWORD', keyword)
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'created_date_from', null))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'created_date_to', null))
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .input('COMPANYID', apiHelper.getValueFromObject(queryParams, 'company_id'))
            .input('ORDERTYPEID', apiHelper.getValueFromObject(queryParams, 'order_type_id'))
            .execute('SL_ORDERSTATUS_GetList_AdminWeb');
        const orderStatusList = data.recordset;
        return new ServiceResponse(true, '', {
            data: orderStatusClass.list(orderStatusList),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(orderStatusList),
        });
    } catch (e) {
        logger.error(e, { function: 'orderStatusService.getListOrderStatus' });
        return new ServiceResponse(false, RESPONSE_MSG.REQUEST_FAILED);
    }
};

const detailOrderStatus = async (orderStatusId) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('ORDERSTATUSID', orderStatusId)
            .execute('SL_ORDERSTATUS_GetById_AdminWeb');
        let orderStatus = data.recordset;
        if (orderStatus && orderStatus.length > 0) {
            return new ServiceResponse(true, '', orderStatusClass.detail(orderStatus[0]));
        }
        return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
    } catch (e) {
        logger.error(e, { function: 'orderStatusService.detailOrderStatus' });
        return new ServiceResponse(false, e.message);
    }
};

const createOrderStatusOrUpdate = async (bodyParams) => {
    let url_icon = '';
    let icon = apiHelper.getValueFromObject(bodyParams, 'icon');
    if (icon) {
        url_icon = await saveFile(icon);
    }
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('ORDERSTATUSID', apiHelper.getValueFromObject(bodyParams, 'order_status_id'))
            .input('ORDERSTATUSNAME', apiHelper.getValueFromObject(bodyParams, 'order_status_name'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))

            .input('ISNEWORDER', apiHelper.getValueFromObject(bodyParams, 'formality') === '0')
            .input('ISCONFIRM', apiHelper.getValueFromObject(bodyParams, 'formality') === '1')
            .input('ISPROCESS', apiHelper.getValueFromObject(bodyParams, 'formality') === '2')
            .input('ISCOMPLETE', apiHelper.getValueFromObject(bodyParams, 'formality') === '3')
            .input('ISCANCEL', apiHelper.getValueFromObject(bodyParams, 'formality') === '4')

            .input('ADDFUNCTIONID', apiHelper.getValueFromObject(bodyParams, 'add_function_id'))
            .input('DELETEFUNCTIONID', apiHelper.getValueFromObject(bodyParams, 'delete_function_id'))
            .input('EDITFUNCTIONID', apiHelper.getValueFromObject(bodyParams, 'edit_function_id'))
            .input('VIEWFUNCTIONID', apiHelper.getValueFromObject(bodyParams, 'view_function_id'))

            .input('ICONURL', url_icon)
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('SL_ORDERSTATUS_CreateOrUpdate_AdminWeb');

        const orderStatusId = data.recordset[0].RESULT;
        return new ServiceResponse(true, '', orderStatusId);
    } catch (e) {
        logger.error(e, { function: 'orderStatusService.createOrderStatusOrUpdate' });
        return new ServiceResponse(false, e.message, '');
    }
};

const deleteOrderStatus = async (bodyParams) => {
    try {
        const pool = await mssql.pool;
        let list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []);
        await pool
            .request()
            .input('LISTID', list_id)
            .input('NAMEID', 'ORDERSTATUSID')
            .input('TABLENAME', 'SL_ORDERSTATUS')
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('CBO_COMMON_SOFTDELETE');
        return new ServiceResponse(true, '', true);
    } catch (e) {
        logger.error(e, { function: 'orderStatusService.deleteOrderStatus' });
        return new ServiceResponse(false, e.message);
    }
};

const getOptions = async (orderStatusId, bodyParams) => {
    try {
        const pool = await mssql.pool;
        const res = await pool.request().execute('SL_ORDERSTATUS_GetOption_AdminWeb');
        return new ServiceResponse(true, '', orderStatusClass.option(res.recordset));
    } catch (e) {
        logger.error(e, { function: 'orderStatusService.getOptions' });
        return new ServiceResponse(false, e.message);
    }
};

const saveFile = async (base64) => {
    let url = null;

    try {
        if (fileHelper.isBase64(base64)) {
            url = await fileHelper.saveBase64('', base64);
        } else {
            url = base64.split(config.domain_cdn)[1];
        }
    } catch (e) {
        logger.error(e, {
            function: 'modelRadService.saveFile',
        });
    }
    return url;
};

const getInformationWithOrder = async (queryParams) => {
    try {
        const pool = await mssql.pool;
        const keyword = apiHelper.getSearch(queryParams);

        const res = await pool
            .request()
            .input('KEYWORD', keyword?.trim())
            .input('DELIVERYTYPE', apiHelper.getValueFromObject(queryParams, 'is_delivery_type'))
            .input('PROVINCEID', apiHelper.getValueFromObject(queryParams, 'provice_id'))
            .input('DISTRICTID', apiHelper.getValueFromObject(queryParams, 'district_id'))
            .input('ORDERTYPEID', apiHelper.getValueFromObject(queryParams, 'order_type_id'))
            .input('PAYMENTSTATUS', apiHelper.getValueFromObject(queryParams, 'payment_status'))
            .input('VATEXPORTSTATUS', apiHelper.getValueFromObject(queryParams, 'vat_export_status'))
            //.input('ORDERSTATUSID', apiHelper.getValueFromObject(queryParams, 'order_status'))
            //.input('ORDERSOURCE', apiHelper.getValueFromObject(queryParams, 'order_source'))
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'date_from'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'date_to'))
            //.input('COMPANYID', apiHelper.getValueFromObject(queryParams, 'company_id'))
            .input('BUSINESSID', apiHelper.getValueFromObject(queryParams, 'business_id'))
            .input('STOREID', apiHelper.getValueFromObject(queryParams, 'store_id'))
            .input('AUTHNAME', apiHelper.getValueFromObject(queryParams, 'auth_name'))
            .execute('SL_ORDERSTATUS_GetInformationWithOrder_AdminWeb');
        return new ServiceResponse(true, '', orderStatusClass.informationWithOrders(res.recordset));
    } catch (e) {
        logger.error(e, { function: 'orderStatusService.getInformationWithOrder' });
        return new ServiceResponse(false, e.message);
    }
};

module.exports = {
    getListOrderStatus,
    detailOrderStatus,
    createOrderStatusOrUpdate,
    deleteOrderStatus,
    getOptions,
    getInformationWithOrder,
};
