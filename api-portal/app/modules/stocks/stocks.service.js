const stocksClass = require('../stocks/stocks.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');

const getListStocks = async (queryParams = {}) => {
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
            .input('COMPANYID', apiHelper.getValueFromObject(queryParams, 'company_id'))
            .input('BUSINESSID', apiHelper.getValueFromObject(queryParams, 'business_id'))
            .input('AREAID', apiHelper.getValueFromObject(queryParams, 'area_id'))
            .input('STOREID', apiHelper.getValueFromObject(queryParams, 'store_id'))
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'create_date_from'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'create_date_to'))
            .input('PROVINCEID', apiHelper.getValueFromObject(queryParams, 'province_id'))
            .input('DISTRICTID', apiHelper.getValueFromObject(queryParams, 'district_id'))
            .input('WARDID', apiHelper.getValueFromObject(queryParams, 'ward_id'))
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active') || '2')
            .input('STOCKSTYPEID', apiHelper.getValueFromObject(queryParams, 'stocks_type_id'))
            .input('USERID', apiHelper.getValueFromObject(queryParams, 'auth_id'))

            .execute(PROCEDURE_NAME.ST_STOCKS_GETLIST);

        const stocks = data.recordset;
        return new ServiceResponse(true, '', {
            data: stocksClass.list(stocks),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(stocks),
        });
    } catch (e) {
        logger.error(e, { function: 'stocksService.getListStocks' });

        return new ServiceResponse(true, '', {});
    }
};

const getListStocksType = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().execute(PROCEDURE_NAME.ST_STOCKS_GETLISTSTOCKSTYPE);

        const stocks = data.recordset;
        return new ServiceResponse(true, '', {
            data: stocksClass.listStocksType(stocks),
        });
    } catch (e) {
        logger.error(e, { function: 'stocksService.getListStocksType' });

        return new ServiceResponse(true, '', {});
    }
};

const getListCompany = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().execute(PROCEDURE_NAME.ST_STOCKS_GETLISTCOMPANY);

        const companies = data.recordset;
        return new ServiceResponse(true, '', {
            data: stocksClass.listCompany(companies),
        });
    } catch (e) {
        logger.error(e, { function: 'stocksService.getListCompany' });

        return new ServiceResponse(true, '', {});
    }
};

const getListManufacturer = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().execute(PROCEDURE_NAME.ST_STOCKS_GETLISTMANUFACTURER);

        const manufacturers = data.recordset;
        return new ServiceResponse(true, '', {
            data: stocksClass.listManufacturer(manufacturers),
        });
    } catch (e) {
        logger.error(e, { function: 'stocksService.getListManufacturer' });

        return new ServiceResponse(true, '', {});
    }
};

const getListStockManager = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('STOCKSID', apiHelper.getValueFromObject(queryParams, 'stocks_id'))
            .input('COMPANYID', apiHelper.getValueFromObject(queryParams, 'company_id'))
            .execute(PROCEDURE_NAME.ST_STOCKS_GETSTOCKMANAGER);

        const stockManagers = data.recordset;
        return new ServiceResponse(true, '', {
            data: stocksClass.listStockManager(stockManagers),
        });
    } catch (e) {
        logger.error(e, { function: 'stocksService.getListStockManager' });

        return new ServiceResponse(true, '', {});
    }
};

const getListBusinessByCompanyID = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('COMPANYID', apiHelper.getValueFromObject(queryParams, 'company_id'))
            .execute(PROCEDURE_NAME.ST_STOCKS_GETLISTBUSINESSBYCOMPANYID);

        const businesses = data.recordset;
        return new ServiceResponse(true, '', {
            data: stocksClass.listBusinessByCompanyID(businesses),
        });
    } catch (e) {
        logger.error(e, { function: 'stocksService.getListBusinessByCompanyID' });

        return new ServiceResponse(true, '', {});
    }
};

const detailStocks = async (stocks_id) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().input('STOCKSID', stocks_id).execute('ST_STOCKS_GetById_AdminWeb');
        let stocks = data.recordsets[0];
        const stockManagers = data.recordsets[1];

        if (stocks && stocks.length > 0) {
            stocks = stocksClass.detail(stocks[0]);
            stocks.stocks_user_manage_list = stocksClass.listStockManager(stockManagers);
            return new ServiceResponse(true, '', stocks);
        }

        return new ServiceResponse(false, '', null);
    } catch (e) {
        logger.error(e, { function: 'stocksService.detailStocks' });

        return new ServiceResponse(false, e.message);
    }
};

const createStocksOrUpdate = async (body = {}) => {
    try {
        const pool = await mssql.pool;

        //Check trùng loại kho và cửa hàng
        const checkData = await pool
            .request()
            .input('STOCKSID', apiHelper.getValueFromObject(body, 'stocks_id'))
            .input('STOCKTYPEID', apiHelper.getValueFromObject(body, 'stocks_type_id'))
            .input('STOREID', apiHelper.getValueFromObject(body, 'store_id'))
            .execute('ST_STOCKS_Check_AdminWeb');
        let result = checkData.recordset[0].RESULT;
        if (result == 1) {
            return new ServiceResponse(false, 'Loại kho này đã tồn tại !');
        }

        //Check trùng mã kho
        const checkDataCode = await pool
            .request()
            .input('STOCKSID', apiHelper.getValueFromObject(body, 'stocks_id'))
            .input('STOCKSCODE', apiHelper.getValueFromObject(body, 'stocks_code'))
            .execute('ST_STOCKS_CheckCode_AdminWeb');
        let resultCode = checkDataCode.recordset[0].RESULT;
        if (resultCode == 1) {
            return new ServiceResponse(false, 'Mã kho này đã tồn tại !');
        }

        // Save và update
        const data = await pool
            .request()
            .input('STOCKSID', apiHelper.getValueFromObject(body, 'stocks_id'))
            .input('STOCKSCODE', apiHelper.getValueFromObject(body, 'stocks_code'))
            .input('STOCKSNAME', apiHelper.getValueFromObject(body, 'stocks_name'))
            .input('ALTERNATENAME', apiHelper.getValueFromObject(body, 'alternate_name'))
            .input('PHONENUMBER', apiHelper.getValueFromObject(body, 'phone_number'))
            .input('EMAIL', apiHelper.getValueFromObject(body, 'email'))
            .input('ADDRESS', apiHelper.getValueFromObject(body, 'address'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(body, 'description'))
            .input('AREAID', apiHelper.getValueFromObject(body, 'area_id'))
            .input('COMPANYID', apiHelper.getValueFromObject(body, 'company_id'))
            .input('BUSINESSID', apiHelper.getValueFromObject(body, 'business_id'))
            .input('STOREID', apiHelper.getValueFromObject(body, 'store_id'))
            .input('STOCKTYPEID', apiHelper.getValueFromObject(body, 'stocks_type_id'))
            .input('PROVINCEID', apiHelper.getValueFromObject(body, 'province_id'))
            .input('DISTRICTID', apiHelper.getValueFromObject(body, 'district_id'))
            .input('WARDID', apiHelper.getValueFromObject(body, 'ward_id'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
            .input('ISACTIVE', apiHelper.getFilterBoolean(body, 'is_active'))
            .input('ISSYSTEM', apiHelper.getFilterBoolean(body, 'is_system'))

            .execute('ST_STOCKS_CreateOrUpdate_AdminWeb');
        let storeId = data.recordset[0].RESULT;
        if (!storeId) {
            return new ServiceResponse(false, 'lỗi tạo kho !');
        }

        //Delete User Manage
        if (storeId) {
            const dataDeleteUser = await pool
                .request()
                .input('STOCKSID', storeId)
                .input('UPDATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
                .execute('ST_STOCKS_DeleteStockManager_AdminWeb');
            const resultDelete = dataDeleteUser.recordset[0].RESULT;
            if (!resultDelete) {
                return new ServiceResponse(false, 'lỗi xoá người quản lý kho !');
            }
        }

        let stocks_user_manage_list = apiHelper.getValueFromObject(body, 'stocks_user_manage_list');
        if (stocks_user_manage_list) {
            for (let i = 0; i < stocks_user_manage_list.length; i++) {
                const user = stocks_user_manage_list[i];
                const dataUser = await pool
                    .request()
                    .input('STOCKSID', storeId)
                    .input('STOCKSMANAGERUSER', apiHelper.getValueFromObject(user, 'stocks_manager_user'))
                    .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
                    .execute('ST_STOCKS_CreateOrUpdateStockManager_AdminWeb');
                if (!dataUser.recordset[0].RESULT) {
                    return new ServiceResponse(false, 'lỗi thêm người quản lý kho !');
                }
            }
        }

        return new ServiceResponse(true, '', storeId);
    } catch (error) {
        logger.error(error, { stocks: 'stocksService.createStocksOrUpdate' });
        return new ServiceResponse(false, e.message);
    }
};

const deleteStocks = async (bodyParams) => {
    const pool = await mssql.pool;
    try {
        const dataDel = await pool
            .request()
            .input('STOCKSIDS', apiHelper.getValueFromObject(bodyParams, 'ids'))
            .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('ST_STOCKS_Delete_AdminWeb');

        // Return ok
        return new ServiceResponse(true, 'Xóa kho thành công', dataDel.recordset);
    } catch (e) {
        logger.error(e, { function: 'stocksService.deleteStocks' });

        // Return failed
        return new ServiceResponse(false, e.message);
    }
};

const getOptions = async function (queryParams) {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'keyword', ''))
            .input('TYPESTOCKS', apiHelper.getValueFromObject(queryParams, 'type_stocks'))
            .input('STOREID', apiHelper.getValueFromObject(queryParams, 'store_id'))
            .input('STOREIDS', apiHelper.getValueFromObject(queryParams, 'store_ids'))
            .input('STOCKTYPEID', apiHelper.getValueFromObject(queryParams, 'stock_type_id'))
            .execute(PROCEDURE_NAME.ST_STOCKS_GETOPTIONS);
        return new ServiceResponse(true, '', stocksClass.options(data.recordset));
    } catch (e) {
        logger.error(e, {
            function: 'StocksService.getOptions',
        });
        return new ServiceResponse(false, e.message);
    }
};

const getListStoreOptions = async function (queryParams) {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().execute('MD_STORE_GetOption_AdminWeb');
        return new ServiceResponse(true, '', stocksClass.optionsStore(data.recordset));
    } catch (e) {
        logger.error(e, {
            function: 'StocksService.getListStoreOptions',
        });
        return new ServiceResponse(false, e.message);
    }
};

const getListStocksTypeOptions = async function (queryParams) {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().execute('ST_STOCKSTYPE_GetOption_AdminWeb');
        return new ServiceResponse(true, '', stocksClass.optionsStocksType(data.recordset));
    } catch (e) {
        logger.error(e, {
            function: 'StocksService.getListStocksTypeOptions',
        });
        return new ServiceResponse(false, e.message);
    }
};

const getListUserByStoreIdOptions = async function (queryParams) {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('STOREID', apiHelper.getValueFromObject(queryParams, 'store_id'))
            .execute('SYS_BUSINESS_USER_GetListUserByStoreIdOption_AdminWeb');

        return new ServiceResponse(true, '', stocksClass.optionsUser(data.recordset));
    } catch (e) {
        logger.error(e, {
            function: 'StocksService.getListUserByStoreIdOptions',
        });
        return new ServiceResponse(false, e.message);
    }
};

const getOptionsStocksByStore = async (queryParams) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('STOREID', apiHelper.getValueFromObject(queryParams, 'store_id'))
            .execute('ST_STOCKS_GetOptionsByStoreId_AdminWeb');
        return new ServiceResponse(true, '', stocksClass.options(data.recordset));
    } catch (e) {
        logger.error(e, {
            function: 'StocksService.getListUserByStoreIdOptions',
        });
        return new ServiceResponse(false, e.message);
    }
};

const getListStoreOptionsByParams = async function (queryParams) {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('COMPANYID', apiHelper.getValueFromObject(queryParams, 'company_id', 0))
            .input('AREAID', apiHelper.getValueFromObject(queryParams, 'area_id', 0))
            .input('BUSINESSID', apiHelper.getValueFromObject(queryParams, 'business_id', 0))
            .execute('MD_STORE_GetOptionByParams_AdminWeb');

        return new ServiceResponse(true, '', stocksClass.optionsStore(data.recordset));
    } catch (e) {
        logger.error(e, {
            function: 'StocksService.getListStoreOptions',
        });
        return new ServiceResponse(false, e.message);
    }
};

const getOptionsStocksByStoreBusiness = async (queryParams) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('STOREID', apiHelper.getValueFromObject(queryParams, 'store_id'))
            .input('BUSINESSREQUESTID', apiHelper.getValueFromObject(queryParams, 'business_request_id'))
            .input('STOCKSTYPE', apiHelper.getValueFromObject(queryParams, 'stocks_type'))
            .execute('ST_STOCKS_GetOptionsByStoreBusiness_AdminWeb');
        return new ServiceResponse(true, '', stocksClass.options(data.recordset));
    } catch (e) {
        logger.error(e, {
            function: 'StocksService.getOptionsStocksByStoreBusiness',
        });
        return new ServiceResponse(false, e.message);
    }
};

const checkBelongsToBusiness = async (queryParams) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('STOCKSID', apiHelper.getValueFromObject(queryParams, 'stocks_id'))
            .input('BUSINESSID', apiHelper.getValueFromObject(queryParams, 'business_id'))
            .execute('ST_STOCKS_CheckBelongsToBusiness_AdminWeb');

        return new ServiceResponse(true, '', !!data.recordset[0]?.RESULT);
    } catch (e) {
        logger.error(e, {
            function: 'StocksService.checkBelongsToBusiness',
        });
        return new ServiceResponse(false, e.message);
    }
};

module.exports = {
    getListStocks,
    getListStocksType,
    getListCompany,
    getListManufacturer,
    getListBusinessByCompanyID,
    detailStocks,
    createStocksOrUpdate,
    deleteStocks,
    getOptions,
    getListStoreOptions,
    getListStocksTypeOptions,
    getListUserByStoreIdOptions,
    getOptionsStocksByStore,
    getListStoreOptionsByParams,
    getOptionsStocksByStoreBusiness,
    checkBelongsToBusiness,
};
