const sql = require('mssql');
const commissionClass = require('./commission.class');
const mssql = require('../../models/mssql');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const CACHE_CONST = require('../../common/const/cache.const');
const apiHelper = require('../../common/helpers/api.helper');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');

const getCommission = async (queryParams, body) => {
  try {
    const pool = await mssql.pool;
    const authName = apiHelper.getValueFromObject(body, 'auth_name', 'administrator');
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const keyword = apiHelper.getValueFromObject(queryParams, 'search');
    const from_date = apiHelper.getValueFromObject(queryParams, 'from_date', null);
    const to_date = apiHelper.getValueFromObject(queryParams, 'to_date', null);

    const data = await pool.request()
      .input('USERNAME', authName)
      .input("PageSize", itemsPerPage)
      .input("PageIndex", currentPage)
      .input('FROMDATE', from_date)
      .input('TODATE', to_date)
      .input("KEYWORD", keyword)
      .execute(PROCEDURE_NAME.SYS_USER_COMMISSION_GET_DETAIL_APP);
    const dataRecord = data.recordsets[0];
    if (dataRecord && dataRecord.length > 0) {
      return new ServiceResponse(true, '', {
        'data': commissionClass.list(dataRecord),
        'page': currentPage,
        'limit': itemsPerPage,
        'total': apiHelper.getTotalData(dataRecord),
      });
    }
    return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, { 'function': 'commissionService.litsCommission' });

    return new ServiceResponse(false, e.message);
  }
};

const getDetailCommission = async (order_commission_id) => {
  try {
    const pool = await mssql.pool;

    const data = await pool.request()
      .input('ORDERCOMMISSIONID', order_commission_id)
      .execute(PROCEDURE_NAME.SYS_USER_COMMISSION_GETBYID_APP);

    if (data.recordsets[0] && data.recordsets[0].length > 0) {
      let commissionData = commissionClass.detail(data.recordsets[0][0]);
      commissionData.priorities_products = commissionClass.detailProductOrder(data.recordsets[1]);

      return new ServiceResponse(true, '', commissionData);
    }
    return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, { 'function': 'commissionService.detailCommission' });
    return new ServiceResponse(false, e.message);
  }
};


// const removeCacheOptions = () => {
//   return cacheHelper.removeByKey(CACHE_CONST.CRM_TASK_OPTIONS);
// };


module.exports = {
  getCommission,
  getDetailCommission,
};

