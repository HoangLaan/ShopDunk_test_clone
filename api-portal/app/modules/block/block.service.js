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
const moduleClass = require('./block.class');

/**
 * Get list
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getBlockList = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getValueFromObject(queryParams, 'keyword');
        const createDateFrom = apiHelper.getValueFromObject(queryParams, 'created_date_from');
        const createDateTo = apiHelper.getValueFromObject(queryParams, 'created_date_to');

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('KEYWORD', keyword)
            .input('CREATEDDATEFROM', createDateFrom)
            .input('CREATEDDATETO', createDateTo)
            .input('COMPANYID', apiHelper.getValueFromObject(queryParams, 'company_id'))
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .execute('MD_BLOCK_GetList_AdminWeb');

        return new ServiceResponse(true, '', {
            data: moduleClass.list(data.recordsets[1]),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordset),
        });
    } catch (e) {
        logger.error(e, { function: 'BlockService.getBlockList' });

        return new ServiceResponse(true, '', {});
    }
};

const createOrUpdateBlock = async (bodyParams = {}) => {
    const pool = await mssql.pool;
    try {
        // Save
        const resCreateOrUpdateBlock = await pool
            .request()
            .input('BLOCKID', apiHelper.getValueFromObject(bodyParams, 'block_id'))
            .input('BLOCKCODE', apiHelper.getValueFromObject(bodyParams, 'block_code'))
            .input('BLOCKNAME', apiHelper.getValueFromObject(bodyParams, 'block_name'))
            .input('COMPANYID', apiHelper.getValueFromObject(bodyParams, 'company_id'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))

            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system')) //
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('MD_BLOCK_CreateOrUpdate_AdminWeb');

        const blockId = resCreateOrUpdateBlock.recordset[0].RESULT;

        if (!blockId || blockId <= 0) {
            return new ServiceResponse(false, 'Tạo khối thất bại', null);
        }

        removeCacheOptions();

        return new ServiceResponse(true);
    } catch (error) {
        logger.error(error, { Block: 'BlockService.createOrUpdateBlock' });

        return new ServiceResponse(false, error.message);
    }
};

const blockDetail = async (blockId) => {
    try {
        const pool = await mssql.pool;

        const resData = await pool.request().input('BLOCKID', blockId).execute('MD_BLOCK_GetById_AdminWeb');

        let block = resData.recordset[0];

        if (block) {
            block = moduleClass.detail(block);

            block.department_list = moduleClass.departmentList(resData.recordsets[1]);

            return new ServiceResponse(true, '', block);
        }

        return new ServiceResponse(false, '', null);
    } catch (e) {
        logger.error(e, { function: 'BlockService.blockDetail' });

        return new ServiceResponse(false, e.message);
    }
};

const deleteBlock = async (bodyParams) => {
    const pool = await mssql.pool;
    try {
        let list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []);

        const data = await pool
            .request()
            .input('LISTID', list_id)
            .input('NAMEID', 'BLOCKID')
            .input('TABLENAME', 'MD_BLOCK')
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('CBO_COMMON_SOFTDELETE');

        removeCacheOptions();

        // Return ok
        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, { function: 'BlockService.deleteBlock' });

        // Return failed
        return new ServiceResponse(false, e.message);
    }
};

const removeCacheOptions = () => {
    return cacheHelper.removeByKey(CACHE_CONST.AM_BLOCK_OPTIONS);
};

module.exports = {
    getBlockList,
    createOrUpdateBlock,
    blockDetail,
    deleteBlock,
};
