const businessUserClass = require('../business-user/business-user.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');

const getList = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getSearch(queryParams);
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('KEYWORD', keyword)
            .input('COMPANYID', apiHelper.getValueFromObject(queryParams, 'company_id', null))
            .input('CLUSTERID', apiHelper.getValueFromObject(queryParams, 'cluster_id', null))
            .input('STOREID', apiHelper.getValueFromObject(queryParams, 'store_id', null))
            .input('GENDER', apiHelper.getValueFromObject(queryParams, 'gender', null))
            .execute('SYS_BUSINESS_USER_GetList_AdminWeb');

        const listResult = data.recordset;
        return new ServiceResponse(true, '', {
            data: businessUserClass.list(listResult),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(listResult),
        });
    } catch (e) {
        logger.error(e, { function: 'business-user.service.getList' });
        return new ServiceResponse(true, '', {});
    }
};

const detail = async (bodyParams) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('BUSINESSID', apiHelper.getValueFromObject(bodyParams, 'business_id'))
            .input('USERID', apiHelper.getValueFromObject(bodyParams, 'user_id'))
            .execute('SYS_BUSINESS_USER_GetById_AdminWeb');

        let result = data.recordset;
        if (result && result.length > 0) {
            result = businessUserClass.detail(result[0]);
            return new ServiceResponse(true, '', result);
        }

        return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
    } catch (e) {
        logger.error(e, { function: 'businessUserService.detail' });
        return new ServiceResponse(false, e.message);
    }
};

const create = async (bodyParams) => {
    try {
        const items = apiHelper.getValueFromObject(bodyParams, 'items').join('|');
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('BUSINESSID', apiHelper.getValueFromObject(bodyParams, 'business_id'))
            .input('STOREID', apiHelper.getValueFromObject(bodyParams, 'store_id'))
            .input('USERIDS', items)
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('SYS_BUSINESS_USER_CreateOrUpdate_AdminWeb');
        const businessId = data.recordset[0].RESULT;
        return new ServiceResponse(true, '', businessId);
    } catch (e) {
        logger.error(e, { function: 'business-user.service.create' });
        return new ServiceResponse(false, 'Lỗi phân nhân viên - miền');
    }
};

const deleteBU = async (bodyParams) => {
    try {
        const pool = await mssql.pool;
        let { items = [] } = bodyParams || {};
        for (let index = 0; index < items.length; index++) {
            const _item = items[index];
            await pool
                .request()
                .input('BUSINESSID', apiHelper.getValueFromObject(_item, 'business_id'))
                .input('USERID', apiHelper.getValueFromObject(_item, 'user_id'))
                .input('STOREID', apiHelper.getValueFromObject(_item, 'store_id'))
                .execute('SYS_BUSINESS_USER_Delete_AdminWeb');
        }
        return new ServiceResponse(true, RESPONSE_MSG.BUSINESSUSER.DELETE_SUCCESS);
    } catch (e) {
        logger.error(e, { function: 'business-user.service.deleteBU' });
        return new ServiceResponse(false, e.message);
    }
};

const getListAllUser = async (queryParams = {}) => {
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
            .execute('SYS_BUSINESS_USER_GetAllUser_AdminWeb');

        const listResult = data.recordset;
        return new ServiceResponse(true, '', {
            data: businessUserClass.listAllUser(listResult),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(listResult),
        });
    } catch (e) {
        logger.error(e, { function: 'business-user.service.getListAllUser' });
        return new ServiceResponse(true, '', {});
    }
};

const getUserOfBus = async (store_id) => {
    try {
        const pool = await mssql.pool;
        const resUser = await pool
            .request()
            .input('STOREID', store_id)
            .execute('SYS_BUSINESS_USER_GetUserOfBus_AdminWeb');

        let userSeleted = resUser.recordset;
        userSeleted = (userSeleted || []).reduce((o, v) => {
            o[v.user_id] = v;
            return o;
        }, {});

        return new ServiceResponse(true, '', userSeleted);
    } catch (e) {
        logger.error(e, { function: 'business-user.service.getUserOfBus' });
        return new ServiceResponse(true, '', {});
    }
};

const getStores = async (body) => {
    try {
        const pool = await mssql.pool;
        const dataRes = await pool
            .request()
            .input('USERID', body.auth_id)
            .execute('SYS_BUSINESS_USER_GetStores_AdminWeb');

        return new ServiceResponse(true, '', dataRes.recordset || []);
    } catch (e) {
        logger.error(e, { function: 'business-user.service.getUserOfBus' });
        return new ServiceResponse(true, '', []);
    }
};

module.exports = {
    getList,
    detail,
    create,
    deleteBU,
    getListAllUser,
    getUserOfBus,
    getStores,
};
