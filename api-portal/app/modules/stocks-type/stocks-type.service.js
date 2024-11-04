const stocksTypeClass = require('../stocks-type/stocks-type.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const API_CONST = require('../../common/const/api.const');
var xl = require('excel4node');
const { changeToSlug } = require('../../common/helpers/string.helper');
/**
 * Get list MD_STOCKSTYPE
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListStocksType = async (queryParams = {}) => {
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
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'start_date'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'end_date'))
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .input('ISNOTFORSALE', apiHelper.getFilterBoolean(queryParams, 'is_not_for_sale'))
            .execute(PROCEDURE_NAME.ST_STOCKSTYPE_GETLIST_ADMINWEB);
        const StocksTypes = data.recordsets[0];
        const totalItem = data.recordsets[1][0].TOTAL;
        return new ServiceResponse(true, '', {
            data: stocksTypeClass.list(StocksTypes),
            page: currentPage,
            limit: itemsPerPage,
            total: totalItem,
        });
    } catch (e) {
        logger.error(e, { function: 'stocksTypeService.getListStocksType' });
        return new ServiceResponse(true, '', {});
    }
};

// detail StocksType
const detailStocksType = async (stocksTypeId) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('STOCKSTYPEID', stocksTypeId)
            .execute(PROCEDURE_NAME.ST_STOCKSTYPE_GETBYID_ADMINWEB);
        let stocksType = data.recordset; // If exists
        if (stocksType && stocksType.length > 0) {
            stocksType = stocksTypeClass.detail(stocksType[0]);
            return new ServiceResponse(true, '', stocksType);
        }
        return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
    } catch (e) {
        logger.error(e, { function: 'stocksTypeService.getListStocksType' });
        return new ServiceResponse(false, e.message);
    }
};

//Delete stocksType
const deleteStocksType = async (stocksTypeId, bodyParams) => {
    try {
        const pool = await mssql.pool;
        await pool
            .request()
            .input('STOCKSTYPEID', stocksTypeId)
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute(PROCEDURE_NAME.ST_STOCKSTYPE_DELETE_ADMINWEB);
        return new ServiceResponse(true, RESPONSE_MSG.STOCKSTYPE.DELETE_SUCCESS, '');
    } catch (e) {
        logger.error(e, { function: 'stocksTypeService.deleteStocksType' });
        return new ServiceResponse(false, e.message);
    }
};

// change Status StocksType
const changeStatusStocksType = async (stocksTypeId, bodyParams) => {
    try {
        const pool = await mssql.pool;
        await pool
            .request()
            .input('STOCKSTYPEID', stocksTypeId)
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name')) // return administrator
            .execute(PROCEDURE_NAME.ST_STOCKSTYPE_UPDATESTATUS_ADMINWEB);
        return new ServiceResponse(true, 'change status success', { isSuccess: true });
    } catch (e) {
        logger.error(e, { function: 'stocksTypeService.changeStatusStocksType' });
        return new ServiceResponse(false);
    }
};

// create or update StocksType
const createOrUpdateStocksType = async (bodyParams) => {
    try {
        const codeRes = await genCode(bodyParams.stocks_type_name);
        if (codeRes.isFailed()) {
            return new ServiceResponse(false, RESPONSE_MSG.STOCKSTYPE.CREATE_FAILED);
        }
        // bodyParams.stocks_type_code = codeRes.getData();

        const pool = await mssql.pool;
        //check name
        const dataCheck = await pool
            .request()
            .input('STOCKSTYPEID', apiHelper.getValueFromObject(bodyParams, 'stocks_type_id'))
            .input('STOCKSTYPECODE', apiHelper.getValueFromObject(bodyParams, 'stocks_type_code'))
            .input('STOCKSTYPENAME', apiHelper.getValueFromObject(bodyParams, 'stocks_type_name'))
            .execute(PROCEDURE_NAME.ST_STOCKSTYPE_CHECKNAME_ADMINWEB);

        if (dataCheck.recordset && dataCheck.recordset[0].RESULT == 1) {
            return new ServiceResponse(false, RESPONSE_MSG.STOCKSTYPE.EXISTS_NAME, null);
        }

        console.log('result', apiHelper.getValueFromObject(bodyParams, 'stocks_type_code'));
        console.log('exist result ===> ', dataCheck.recordset[0].RESULT == 1);

        const data = await pool
            .request()
            .input('STOCKSTYPEID', apiHelper.getValueFromObject(bodyParams, 'stocks_type_id'))
            .input('STOCKSTYPECODE', apiHelper.getValueFromObject(bodyParams, 'stocks_type_code'))
            .input('STOCKSTYPENAME', apiHelper.getValueFromObject(bodyParams, 'stocks_type_name'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
            .input('ISCOMPANY', apiHelper.getValueFromObject(bodyParams, 'is_company', 0))
            .input('ISWARRANTY', apiHelper.getValueFromObject(bodyParams, 'is_warranty'))
            .input('ISBROKEN', apiHelper.getValueFromObject(bodyParams, 'is_broken'))
            .input('ISSTORE', apiHelper.getValueFromObject(bodyParams, 'is_store'))
            .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system'))
            .input('ISNOTFORSALE', apiHelper.getValueFromObject(bodyParams, 'is_not_for_sale', 0))
            // bỏ is_accessory giữ is_component
            .input('ISCOMPONENT', apiHelper.getValueFromObject(bodyParams, 'is_component'))
            .input('TYPE', apiHelper.getValueFromObject(bodyParams, 'type'))
            .input('ISEXPORTTO', apiHelper.getValueFromObject(bodyParams, 'is_export_to'))
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute(PROCEDURE_NAME.ST_STOCKSTYPE_CREATEORUPDATE_ADMINWEB);
        const stocksTypeId = data.recordset[0].RESULT;

        if (stocksTypeId <= 0) {
            return new ServiceResponse(false, RESPONSE_MSG.STOCKSTYPE.CREATE_FAILED);
        }

        return new ServiceResponse(true, 'update success', stocksTypeId);
    } catch (e) {
        logger.error(e, { function: 'stocksTypeService.createOrUpdateStocksType' });
        return new ServiceResponse(false, RESPONSE_MSG.STOCKSTYPE.CREATE_FAILED);
    }
};

// gen code
const genCode = async (stocks_name = 'MLK') => {
    try {
        const prefixCode = changeToSlug(stocks_name)
            .split('-')
            .slice(0, 6)
            .map((item) => item[0].toUpperCase())
            .join('');
        const pool = await mssql.pool;
        const data = await pool.request().input('PREFIX', prefixCode).execute('ST_STOCKSTYPE_GenCode_AdminWeb');

        return new ServiceResponse(true, '', data.recordset[0]?.stocks_code);
    } catch (error) {
        logger.error(error, {
            function: 'stocksTypeService.genCode',
        });

        return new ServiceResponse(false, error.message);
    }
};

const deleteListStocksType = async (bodyParams) => {
    try {
        let list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []);

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('LISTID', list_id)
            .input('NAMEID', 'STOCKSTYPEID')
            .input('TABLENAME', 'ST_STOCKSTYPE')
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('CBO_COMMON_SOFTDELETE');
        return new ServiceResponse(true, '', true);
    } catch (e) {
        logger.error(e, { function: 'StocksTypeService.deleteListStocksType' });
        return new ServiceResponse(false, 'Lỗi xoá danh sách loại kho');
    }
};

module.exports = {
    getListStocksType,
    detailStocksType,
    deleteStocksType,
    changeStatusStocksType,
    createOrUpdateStocksType,
    deleteListStocksType,
};
