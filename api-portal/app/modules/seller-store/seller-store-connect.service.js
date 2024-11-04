var moment = require('moment');
const { default: axios } = require('axios');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const { set, get, getByHash, delHash, del, setV2 } = require('../../common/helpers/redis.helper');
const sellerStoreConnectClass = require('./seller-store-connect.class');


const getListShopProfile = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const keyword = apiHelper.getSearch(queryParams);
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('PageSize', itemsPerPage)
      .input('PageIndex', currentPage)
      .execute('MD_SHOPPROFILE_GetList_AdminWeb');
    const listProfile = data && data.recordsets && data.recordsets.length > 0 && data.recordsets[0] ? sellerStoreConnectClass.list(data.recordsets[0]) : [];

    let listShopee = (listProfile || []).filter(item => item.shop_type == 1)
    let listLazada = (listProfile || []).filter(item => item.shop_type == 2)
    return new ServiceResponse(true, '', {
      'data': {
        listShopee,
        listLazada
      },
      'page': currentPage,
      'limit': itemsPerPage,
      'total': apiHelper.getTotalData(listProfile),
    });
  } catch (e) {
    logger.error(e, { function: 'sellectStoreServices.getListShopProfile' });
    return new ServiceResponse(true, '', {});
  }
};

const getOptsStocks = async (queryParams = {}) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('ISACTIVE', 1)
      .input('ORDERID', null)
      .input('STOREID', null)
      .execute("ST_STOCKSOUTREQUEST_GetStocks_AdminWeb");
    return new ServiceResponse(true, '', data.recordset && data.recordset.length ? sellerStoreConnectClass.option(data.recordset) : [])
  } catch (e) {
    logger.error(e, { 'function': 'sellectStoreServices.getOptsStocks' });
    return new ServiceResponse(true, '', []);
  }
}

const updateStocks = async (body = {}) => {
  try {
    let shop_id = apiHelper.getValueFromObject(body, 'shop_id');
    let stock_id = apiHelper.getValueFromObject(body, 'stock_id');
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('STOCKID', stock_id)
      .input('SHOPID', shop_id)
      .execute("MD_SHOPPROFILE_UpdateStock_AdminWeb");
    return new ServiceResponse(true, 'Cập nhật thành công', {})
  } catch (e) {
    logger.error(e, { 'function': 'sellectStoreServices.updateStocksID' });
    return new ServiceResponse(false, '', []);
  }
}

module.exports = {
  getListShopProfile,
  getOptsStocks,
  updateStocks
};
