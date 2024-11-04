const ServiceResponse = require('../../common/responses/service.response');
const globalClass = require('./global.class');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const logger = require('../../common/classes/logger.class');
const { tableDatabaseType } = require('./utils/constants');
const _ = require('lodash');
const config = require('../../../config/config');

const optionsType = {
    mail: 'SYS_MAILBOX_GetNotifyMailInbox_AdminWeb',
    announce: 'SYS_ANNOUNCE_GetListForNotify_AdminWeb ',
};

/**
 * Get list inbox for notify
 * @param {Object} params
 * @returns {Promise<ServiceResponse>}
 */
const getListNotify = async (queryParams) => {
    try {
        const type = apiHelper.getValueFromObject(queryParams, 'type')?.toLowerCase();
        if (!optionsType[type]) {
            return new ServiceResponse(false, 'Type không hợp lệ');
        }

        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('USERNAME', apiHelper.getValueFromObject(queryParams, 'auth_name'))
            .execute(optionsType[type]);
        const result = globalClass.listNotify(data.recordsets[0]);

        return new ServiceResponse(true, '', {
            items: result,
            page: currentPage,
            itemsPerPage: itemsPerPage,
            totalItems: apiHelper.getTotalData(data.recordset),
        });
    } catch (error) {
        logger.error(error, {
            function: 'globalService.getListInboxForNotify',
        });
        return new ServiceResponse(false, error.message);
    }
};

/**
 * Get options common
 * @param {Object} queryParams
 * @returns {Promise<ServiceResponse>}
 */

const getOptionsCommon = async (queryParams, bodyParams) => {
    try {
        const type = apiHelper.getValueFromObject(queryParams, 'type');
        const tableName = tableDatabaseType[type];
        if (!tableName) {
            throw Error('Type không hợp lệ');
        } else {
            delete queryParams.type;
            const pool = await mssql.pool;
            const initRequest = await pool.request();
            initRequest.input('TABLENAME', tableName);
            initRequest.input('USERNAME', apiHelper.getValueFromObject(bodyParams, 'auth_name'));
            _.forOwn(queryParams, function (value, key) {
                initRequest.input(key.toUpperCase()?.replace(/_/g, ''), value);
            });
            const data = await initRequest.execute('CBO_COMMON_GetAll');
            const result = globalClass.optionsGlobal(data.recordset);
            return new ServiceResponse(true, '', result);
        }
    } catch (error) {
        logger.error(error, {
            function: 'globalService.getOptionsCommon',
        });
        return new ServiceResponse(false, error.message);
    }
};

/**
 * Get full name
 * @param {Object} queryParams
 * @returns {Promise<ServiceResponse>}
 */

const getFullName = async (queryParams) => {
    try {
        const type = apiHelper.getValueFromObject(queryParams, 'type');
        const value = apiHelper.getValueFromObject(queryParams, 'value_query');
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('TYPE', type)
            .input('VALUEQUERY', value)
            .execute('SYS_USERS_GetName_AdminWeb');
        const result = data.recordset[0];
        const dataRes = {
            ...result,
            icon_url: result?.icon_url ? `${config.domain_cdn}${result.icon_url}` : undefined,
            image_avatar: result?.image_avatar ? `${config.domain_cdn}${result.image_avatar}` : undefined
        }
        return new ServiceResponse(true, '', dataRes);
    } catch (error) {
        logger.error(error, {
            function: 'globalService.getFullName',
        });
        return new ServiceResponse(false, error.message);
    }
};

const checkExistsValue = async ({ tableName, fieldCheck, fieldCheckValue, fieldIdUpdate, fieldIdUpdateValue }) => {
    try {
        const existsNameRes = await (await mssql.pool)
            .request()
            .input('TABLENAME', tableName)
            .input('FIELDCHECK', fieldCheck)
            .input('FIELDCHECKVALUE', fieldCheckValue)
            .input('FIELDIDUPDATE', fieldIdUpdate)
            .input('FIELDIDUPDATEVALUE', fieldIdUpdateValue)
            .execute('CBO_COMMON_CheckExistsValue');
        return existsNameRes.recordsets[1][0].RESULT === 1;
    } catch (error) {
        logger.error(error, { function: 'globalService.checkExistsValue' });
        return false;
    }
};

module.exports = {
    getListNotify,
    getOptionsCommon,
    getFullName,
    checkExistsValue,
};
