const stocksOutTypeClass = require('../stocks-out-type/stocks-out-type.class');
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

const getListStocksOutType = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const keyword = apiHelper.getSearch(queryParams);
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('PageSize', itemsPerPage)
      .input('PageIndex', currentPage)
      .input('KEYWORD', keyword)
      .input('STOCKSOUTTYPE', apiHelper.getValueFromObject(queryParams, 'stocks_out_type'))
      .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'create_date_from'))
      .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'create_date_to'))
      .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
      .execute('ST_STOCKSOUTTYPE_GetList_AdminWeb');
    const StocksOutTypes = data.recordsets[0];
    const totalItem = data.recordsets[1][0].TOTAL;

    return new ServiceResponse(true, '', {
      'data': stocksOutTypeClass.list(StocksOutTypes),
      'page': currentPage,
      'limit': itemsPerPage,
      'total': totalItem,
    });
  } catch (e) {
    logger.error(e, { 'function': 'StocksOutTypeService.getListStocksOutType' });
    return new ServiceResponse(true, '', {});
  }
};

// detail StocksOutType
const detailStocksOutType = async (stocksOutTypeId) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('STOCKSOUTTYPEID', stocksOutTypeId)
      .execute('ST_STOCKSOUTTYPE_GetById_AdminWeb');

    let stocks_out_type = stocksOutTypeClass.detail(data.recordsets[0][0]) || {}
    let reviews = stocksOutTypeClass.listReviewLevel(data.recordsets[1]) || [];
    let listUser = stocksOutTypeClass.listReviewUser(data.recordsets[2]) || [];

    reviews = (reviews || []).map(p => {
      let users = listUser.filter(x => x.stocks_out_review_level_id == p.stocks_out_review_level_id) || [];
      return {
        ...p,
        users,
      };
    });
    stocks_out_type.stocks_out_review_level_list = reviews;

    let _ids = (reviews || []).map(p => p.stocks_review_level_id).join(',');
    if (_ids) {
      const resUser = await pool
        .request()
        .input('IDS', _ids)
        .execute('ST_STOCKSINTYPE_GetUserBYReviewLevelId_AdminWeb');

      let _dataUsers = stocksOutTypeClass.listReviewUser(resUser.recordset);
      let obj = {};
      for (let i = 0; i < _dataUsers.length; i++) {
        let user = _dataUsers[i];
        obj[user.stocks_review_level_id] = [...(obj[user.stocks_review_level_id] || []), user];
      }
      stocks_out_type.review_users = obj;
    }

    return new ServiceResponse(true, '', stocks_out_type);

  } catch (e) {
    logger.error(e, { 'function': 'StocksOutTypeService.getListStocksOutType' });
    return new ServiceResponse(false, e.message);
  }
};

const deleteStocksOutType = async (bodyParams) => {
  try {
    const pool = await mssql.pool;
    await pool.request()
      .input('STOCKSOUTTYPEIDS', apiHelper.getValueFromObject(bodyParams, 'ids'))
      .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute('ST_STOCKSOUTTYPE_Delete_AdminWeb');
    return new ServiceResponse(true, RESPONSE_MSG.STOCKSOUTTYPE.DELETE_SUCCESS, '');
  } catch (e) {
    logger.error(e, { 'function': 'StocksOutTypeService.deleteStocksOutType' });
    return new ServiceResponse(false, e.message);
  }
}

// create or update StocksOutType 
const createOrUpdateStocksOutType = async (bodyParams) => {
  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);
  try {
    await transaction.begin();
    //check name
    const dataCheck = await pool.request()
      .input('STOCKSOUTTYPEID', apiHelper.getValueFromObject(bodyParams, 'stocks_out_type_id'))
      .input('STOCKSOUTTYPENAME', apiHelper.getValueFromObject(bodyParams, 'stocks_out_type_name'))
      .execute('ST_STOCKSOUTTYPE_CheckName_AdminWeb');
    if (dataCheck.recordset && dataCheck.recordset[0].RESULT == 1) {
      return new ServiceResponse(false, RESPONSE_MSG.STOCKSOUTTYPE.EXISTS_NAME, null);
    }

    const data = await pool.request()
      .input('STOCKSOUTTYPEID', apiHelper.getValueFromObject(bodyParams, 'stocks_out_type_id'))
      .input('STOCKSOUTTYPENAME', apiHelper.getValueFromObject(bodyParams, 'stocks_out_type_name'))
      .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
      .input('ISAUTOREVIEW', apiHelper.getValueFromObject(bodyParams, 'is_auto_review'))

      .input('ISTRANSFER', apiHelper.getValueFromObject(bodyParams, 'is_transfer'))
      .input('ISDESTROY', apiHelper.getValueFromObject(bodyParams, 'is_destroy'))
      .input('ISINVENTORYCONTROL', apiHelper.getValueFromObject(bodyParams, 'is_inventory_control'))
      .input('ISEXCHANGEGOODS', apiHelper.getValueFromObject(bodyParams, 'is_exchange_goods'))
      .input('ISWARRANTY', apiHelper.getValueFromObject(bodyParams, 'is_warranty'))
      .input('ISCOMPONENT', apiHelper.getValueFromObject(bodyParams, 'is_component'))
      .input('ISINTERNAL', apiHelper.getValueFromObject(bodyParams, 'is_internal'))
      .input('ISSELL', apiHelper.getValueFromObject(bodyParams, 'is_sell'))
      .input('ISRETURNSUPPLIER', apiHelper.getValueFromObject(bodyParams, 'is_return_supplier'))
      .input('ISCOMPANY', apiHelper.getValueFromObject(bodyParams, 'is_company'))

      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system'))
      .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute('ST_STOCKSOUTTYPE_CreateOrUpdate_AdminWeb');
    const stocksOutTypeId = data.recordset[0].RESULT;

    // remove table ST_STOCKSOUTTYPE_REVIEWLEVEL
    const requestDeleteReviewLevel = new sql.Request(transaction);
    const dataReviewLevelDelete = await requestDeleteReviewLevel
      .input('STOCKSOUTTYPEID', stocksOutTypeId)
      .execute('ST_STOCKSOUTTYPE_REVIEWLEVEL_Delete_AdminWeb');
    const resultDeleteReviewLevel = dataReviewLevelDelete.recordset[0].RESULT;
    if (resultDeleteReviewLevel <= 0) {
      return new ServiceResponse(false, RESPONSE_MSG.STOCKSOUTTYPE.UPDATE_FAILED);
    }
    // remove table ST_STOCKSOUTTYPE_REVIEWLEVEL
    const requestDeleteReviewUser = new sql.Request(transaction);
    const dataReviewUserDelete = await requestDeleteReviewUser
      .input('STOCKSOUTTYPEID', stocksOutTypeId)
      .execute('ST_STOCKSOUTTYPE_RL_USER_Delete_AdminWeb');
    const resultDeleteReviewUser = dataReviewUserDelete.recordset[0].RESULT;
    if (resultDeleteReviewUser <= 0) {
      return new ServiceResponse(false, RESPONSE_MSG.STOCKSOUTTYPE.UPDATE_FAILED);
    }

    const stocks_out_review_level_list = apiHelper.getValueFromObject(bodyParams, 'stocks_out_review_level_list')
    if (stocks_out_review_level_list && stocks_out_review_level_list.length > 0) {
      for (let i = 0; i < stocks_out_review_level_list.length; i++) {
        let item = stocks_out_review_level_list[i];
        const requestStocksOutTypeListCreate = new sql.Request(transaction);
        const dataStocksOutTypeListCreate = await requestStocksOutTypeListCreate // eslint-disable-line no-await-in-loop
          .input('STOCKSOUTTYPEID', stocksOutTypeId) // hình thức phiếu nhập
          .input('STOCKSOUTTYPEREVIEWLEVELID', apiHelper.getValueFromObject(item, 'stocks_in_type_review_level_id')) // tự sinh
          .input('STOCKSREVIEWLEVELID', apiHelper.getValueFromObject(item, 'stocks_review_level_id')) // mức duyệt
          .input('ISAUTOREVIEWED', apiHelper.getValueFromObject(item, 'is_auto_reviewed', 0))
          .input('ISCOMPLETEDREVIEWED', apiHelper.getValueFromObject(item, 'is_completed_reviewed', 0))
          .execute('ST_STOCKSOUTTYPE_REVIEWLEVEL_Create_AdminWeb');
        const stocksOutTypeReviewLVId = dataStocksOutTypeListCreate.recordset[0].RESULT;
        if (stocksOutTypeReviewLVId <= 0) {
          return new ServiceResponse(false, e.message);
        }

        let usersLength = item.users.length;
        if (usersLength > 0) {
          for (let m = 0; m < usersLength; m++) {
            let itemUser = item.users[m];
            const requestStocksOutTypeListUserCreate = new sql.Request(transaction);
            const dataStocksOutTypeListUserCreate = await requestStocksOutTypeListUserCreate // eslint-disable-line no-await-in-loop
              .input('STOCKSOUTTYPEREVIEWLEVELID', stocksOutTypeReviewLVId)
              .input('STOCKSOUTTYPEID', stocksOutTypeId)
              .input('DEPARTMENTID', apiHelper.getValueFromObject(itemUser, 'department_id'))
              .input('USERNAME', apiHelper.getValueFromObject(itemUser, 'value'))
              .execute('ST_STOCKSOUTTYPE_RL_USER_Create_AdminWeb');
            const itemStocksOutTypeListUserId = dataStocksOutTypeListUserCreate.recordset[0].RESULT;
            if (itemStocksOutTypeListUserId <= 0) {
              return new ServiceResponse(false, e.message);
            }
          }
        }
      }
    }

    if (stocksOutTypeId <= 0) {
      return new ServiceResponse(false, RESPONSE_MSG.STOCKSOUTTYPE.CREATE_FAILED);
    }

    removeCacheOptions();
    await transaction.commit();
    return new ServiceResponse(true, 'update success', stocksOutTypeId);
  } catch (e) {
    await transaction.rollback();
    logger.error(e, { 'function': 'stocksOutType.createOrUpdateStocksOutType' });
    return new ServiceResponse(false, RESPONSE_MSG.STOCKSOUTTYPE.CREATE_FAILED);
  }
};

const removeCacheOptions = () => {
  return cacheHelper.removeByKey(CACHE_CONST.CRM_TASKTYPE_OPTIONS);
};

const getOptionsReviewLevel = async (queryParams) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('STOCKSTYPE', apiHelper.getValueFromObject(queryParams, 'stocks_type'))
      .execute('ST_STOCKSREVIEWLEVEL_GetOption_AdminWeb');
    let stocksIn = stocksOutTypeClass.options(data.recordset);
    return new ServiceResponse(true, '', stocksIn);
  } catch (e) {
    logger.error(e, { 'function': 'stocksOutType.getOptionsReviewLevel' });
    return new ServiceResponse(false, e.message);
  }
};

const getListUserReview = async (queryParams) => {

  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('STOCKSREVIEWLEVELID', apiHelper.getValueFromObject(queryParams, 'stocks_review_level_id'))
      .execute('ST_STOCKSREVIEWLEVEL_GetUserReview_AdminWeb');
    let userReview = stocksOutTypeClass.options(data.recordset);
    return new ServiceResponse(true, '', userReview);
  } catch (e) {
    logger.error(e, { 'function': 'stocksOutType.getListUserReview' });
    return new ServiceResponse(false, e.message);
  }
};

const getOptions = async (queryParams) => {

  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .execute('ST_STOCKSOUTTYPE_GetOptions_AdminWeb');

    const dataSqlStStockOutType = data.recordset;

    const optionTypeStOut = stocksOutTypeClass.optionsStStockOutType(dataSqlStStockOutType);
    return new ServiceResponse(true, '', optionTypeStOut);
  } catch (e) {
    logger.error(e, { 'function': 'stocksOutType.getListUserReview' });
    return new ServiceResponse(false, e.message);
  }
};

module.exports = {
  getListStocksOutType,
  detailStocksOutType,
  deleteStocksOutType,
  createOrUpdateStocksOutType,
  getListUserReview,
  getOptionsReviewLevel,
  getOptions,
};
