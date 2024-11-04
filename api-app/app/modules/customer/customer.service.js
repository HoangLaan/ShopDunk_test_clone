// @ts-nocheck
const customerClass = require('./customer.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const _ = require('lodash');
const stringHelper = require('../../common/helpers/string.helper');
const fileHelper = require('../../common/helpers/file.helper');
const folderName = 'customer';

/**
 * Get list
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListCustomer = async (queryParams = {}) => {
    const pool = await mssql.pool;
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = queryParams['search'];

        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('KEYWORD', keyword)
            .execute(PROCEDURE_NAME.CRM_CUSTOMER_GETLIST_APP);

        const listCustomer = customerClass.list(data.recordsets[0]);
        return new ServiceResponse(true, '', {
            data: listCustomer,
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordset),
        });
    } catch (e) {
        logger.error(e, {function: 'customerService.getListCustomer'});
        return new ServiceResponse(true, '', {});
    }
};

const getListCustomerPersonal = async (queryParams = {}) => {
    const pool = await mssql.pool;
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = queryParams['search'];

        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('KEYWORD', keyword)
            .execute('CRM_CUSTOMER_PERSONAL_GETLIST_APP');

        const listCustomer = customerClass.list(data.recordsets[0]);
        return new ServiceResponse(true, '', {
            data: listCustomer,
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordset),
        });
    } catch (e) {
        logger.error(e, {function: 'customerService.getListCustomer'});
        return new ServiceResponse(true, '', {});
    }
};

const createOrUpdateCustomer = async (bodyParams = {}) => {
    const pool = await mssql.pool;
    try {
        const customerId = apiHelper.getValueFromObject(bodyParams, 'customer_id');

        let avatar = apiHelper.getValueFromObject(bodyParams, 'avatar');
        if (avatar) {
            const path_avatar = await fileHelper.saveFile(avatar, folderName);
            if (path_avatar) {
                avatar = path_avatar;
            }
        }

        let password = apiHelper.getValueFromObject(bodyParams, 'password');
        password = password ? stringHelper.hashPassword(password) : null;

        const resultPhone = await pool
            .request()
            .input('CUSTOMERID', customerId)
            .input('PHONENUMBER', apiHelper.getValueFromObject(bodyParams, 'phone_number'))
            .input('EMAIL', apiHelper.getValueFromObject(bodyParams, 'email'))
            .input('TAXCODE', apiHelper.getValueFromObject(bodyParams, 'tax_code'))
            .execute(PROCEDURE_NAME.CRM_CUSTOMER_CHECKISEXIST_APP);
        if (resultPhone.recordset && resultPhone.recordset[0].RESULT) {
            switch (resultPhone.recordset[0].RESULT) {
                case 'EMAIL':
                    return new ServiceResponse(false, 'Email đã tồn tại', null);
                case 'PHONENUMBER':
                    return new ServiceResponse(false, 'Số điện thoại đã tồn tại', null);
                case 'TAXCODE':
                    return new ServiceResponse(false, 'Tax code đã tồn tại', null);
            }
        }

        const data = await pool
            .request()

            // phần này là của cá nhân
            .input('GENDER', apiHelper.getValueFromObject(bodyParams, 'gender'))
            .input('BIRTHDAY', apiHelper.getValueFromObject(bodyParams, 'birth_day'))
            .input('PASSWORD', password)

            // phần này là của doanh nghiệp
            .input('TAXCODE', apiHelper.getValueFromObject(bodyParams, 'tax_code'))
            .input('REPRESENTATIVENAME', apiHelper.getValueFromObject(bodyParams, 'representative_name'))
            .input('REPRESENTATIVEPHONE', apiHelper.getValueFromObject(bodyParams, 'representative_phone'))

            // phần dùng chung cho cả 2
            .input('TYPE', apiHelper.getValueFromObject(bodyParams, 'type'))
            .input('CUSTOMERID', customerId)
            .input('AVATARIMAGE', avatar)
            .input('CUSTOMERNAME', apiHelper.getValueFromObject(bodyParams, 'full_name'))
            .input('PHONENUMBER', apiHelper.getValueFromObject(bodyParams, 'phone_number'))
            .input('EMAIL', apiHelper.getValueFromObject(bodyParams, 'email'))
            .input('ADDRESS', apiHelper.getValueFromObject(bodyParams, 'address'))
            .input('PROVINCEID', apiHelper.getValueFromObject(bodyParams, 'province_id'))
            .input('DISTRICTID', apiHelper.getValueFromObject(bodyParams, 'district_id'))
            .input('WARDID', apiHelper.getValueFromObject(bodyParams, 'ward_id'))
            .input('SOURCEID', apiHelper.getValueFromObject(bodyParams, 'source_id'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .input('MEMBERREFID', apiHelper.getValueFromObject(bodyParams, 'member_ref_id'))
            .input('RELATIONSHIPMEMBERID', apiHelper.getValueFromObject(bodyParams, 'relationship_member_id'))
            .input('PRESENTERID', apiHelper.getValueFromObject(bodyParams, 'presenter_id'))
            .execute(PROCEDURE_NAME.CRM_CUSTOMER_CREATEORUPDATE_APP);
        const result = data.recordset[0]?.RESULT;

        if (!result) {
            return new ServiceResponse(false, RESPONSE_MSG.CUSTOMER.CREATE_FAILED);
        }
        return new ServiceResponse(true, '', result);
    } catch (error) {
        logger.error(error, {function: 'CustomerService.createCustomerOrUpdate'});
        return new ServiceResponse(false, error.message);
    }
};

const getDetail = async queryParams => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('CUSTOMERID', apiHelper.getValueFromObject(queryParams, 'id'))
            .input('TYPE', apiHelper.getValueFromObject(queryParams, 'type'))
            .execute(PROCEDURE_NAME.CRM_CUSTOMER_GETBYID_APP);
        return new ServiceResponse(true, '', {
            ...(customerClass.detail(data.recordset)?.[0] || {}),
            total_money: data.recordsets[1]?.[0]?.TOTALMONEY || 0,
            total_order: data.recordsets[2]?.[0]?.TOTALORDER || 0,
        });
    } catch (error) {
        logger.error(error, {function: 'CustomerService.getDetail'});
        return new ServiceResponse(false, error.message);
    }
};

const getPurchaseHistory = async queryParams => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const pool = await mssql.pool;
        const res = await pool
            .request()
            .input('MEMBERID', apiHelper.getValueFromObject(queryParams, 'member_id'))
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .execute('CRM_ACCOUNT_GetPurchaseHistory_App');

        let listOrder = customerClass.listOrder(res.recordsets[0]);
        let listProduct = customerClass.listProduct(res.recordsets[1]);

        listOrder = (listOrder || []).map(order => ({
            ...order,
            products: _.filter(listProduct || [], product => product.order_id === order.order_id),
        }));
        return new ServiceResponse(true, '', {
            data: listOrder,
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(res.recordset),
        });
    } catch (error) {
        logger.error(error, {function: 'CustomerService.getPurchaseHistory'});
        return new ServiceResponse(false, error.message);
    }
};

const getTaskHistory = async queryParams => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const pool = await mssql.pool;
        const res = await pool
            .request()
            .input('MEMBERID', apiHelper.getValueFromObject(queryParams, 'member_id'))
            //.input('PAGESIZE', itemsPerPage)
            //.input('PAGEINDEX', currentPage)
            .execute('CRM_TASK_GetListWithCustomer_AdminWeb');

        return new ServiceResponse(true, '', {
            data: res.recordset,
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(res.recordset),
        });
    } catch (error) {
        logger.error(error, {function: 'CustomerService.getTaskHistory'});
        return new ServiceResponse(false, error.message);
    }
};

const getSourceOptions = async queryParams => {
    try {
        const keyword = apiHelper.getSearch(queryParams);
        const pool = await mssql.pool;
        const data = await pool.request().input('KEYWORD', keyword).execute(`MD_SOURCE_GetOptions_App`);
        return new ServiceResponse(true, '', customerClass.sourceOptions(data.recordset));
    } catch (error) {
        logger.error(error, {function: 'CustomerService.getSourceOptions'});
        return new ServiceResponse(false, error.message);
    }
};

module.exports = {
    getListCustomer,
    getListCustomerPersonal,
    createOrUpdateCustomer,
    getDetail,
    getPurchaseHistory,
    getTaskHistory,
    getSourceOptions,
};
