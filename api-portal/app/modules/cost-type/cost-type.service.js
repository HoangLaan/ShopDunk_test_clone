const CostTypeClass = require('../cost-type/cost-type.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');

const getOptions = async () => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .execute(PROCEDURE_NAME.MD_COSTTYPE_GETOPTIONS_ADMINWEB);
    return new ServiceResponse(true, RESPONSE_MSG.COSTTYPE.DELETE_SUCCESS, CostTypeClass.options(data.recordset));
  } catch (e) {
    logger.error(e, { 'function': 'CostTypeService.getOptions' });
    return new ServiceResponse(false, e.message);
  }
};

const getListCostType = async (queryParams = {}) => {
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
      .input('FROMDATE', apiHelper.getValueFromObject(queryParams, 'from_date'))
      .input('TODATE', apiHelper.getValueFromObject(queryParams, 'to_date'))
      .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
      .execute(PROCEDURE_NAME.MD_COSTTYPE_GETLIST_ADMINWEB);

    const costTypes = data.recordset;

    return new ServiceResponse(true, '', {
      data: CostTypeClass.list(costTypes),
      page: currentPage,
      limit: itemsPerPage,
      total: apiHelper.getTotalData(costTypes),
    });
  } catch (e) {
    logger.error(e, { function: 'costTypeService.getListCostType' });

    return new ServiceResponse(true, '', {});
  }
};

const createCostTypeOrUpdate = async (bodyParams) => {
  const cost_id = apiHelper.getValueFromObject(bodyParams, 'cost_id');
  const cost_name = apiHelper.getValueFromObject(bodyParams, 'cost_name');

  try {
    const pool = await mssql.pool;

    // Kiem tra loai chi phi co ton tai hay khong
    const dataCheck = await pool
      .request()
      .input('COSTID', cost_id)
      .input('COSTNAME', cost_name)
      .execute(PROCEDURE_NAME.MD_COSTTYPE_CHECKNAME_ADMINWEB);

    if (dataCheck.recordset[0].RESULT) {
      return new ServiceResponse(
        false,
        `Đã tồn tại loại chi phí ${cost_name}.`,
      );
    }

    const data = await pool
      .request()
      .input('COSTID', cost_id)
      .input('COSTNAME', apiHelper.getValueFromObject(bodyParams, 'cost_name'))
      .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
      .input('ISPERCENT', apiHelper.getValueFromObject(bodyParams, 'is_percent'))
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('ISDISCOUNT', apiHelper.getValueFromObject(bodyParams, 'is_discount'))
      .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.MD_COSTTYPE_CREATEORUPDATE_ADMINWEB);

    const costId = data.recordset[0].RESULT;

    return new ServiceResponse(true, '', costId);
  } catch (e) {
    logger.error(e, { function: 'orderTypeService.createOrderTypeOrUpdate' });
    return new ServiceResponse(false, e.message, '');
  }
};

const detailCostType = async (costTypeId) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request().input('COSTID', costTypeId).execute(PROCEDURE_NAME.MD_COSTTYPE_GETBYID_ADMINWEB);

    if (!data.recordset) {
      return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
    }

    let costType = CostTypeClass.detail(data.recordsets[0][0]);

    return new ServiceResponse(true, '', costType);
  } catch (e) {
    logger.error(e, { function: 'costTypeService.detailCostType' });
    return new ServiceResponse(false, e.message);
  }
};

const deleteCostTypes = async bodyParams => {
  try {
    let list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []);
    const pool = await mssql.pool;

    const data = await pool
      .request()
      .input('LISTID', list_id)
      .input('NAMEID', 'COSTID')
      .input('TABLENAME', 'MD_COSTTYPE')
      .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute('CBO_COMMON_SOFTDELETE');

    return new ServiceResponse(true, '', data);
  } catch (e) {
    logger.error(e, {
      function: 'costTypeService.deleteCostTypes',
    });

    return new ServiceResponse(false, '', {});
  }
};


module.exports = {
  getOptions,
  getListCostType,
  deleteCostTypes,
  createCostTypeOrUpdate,
  detailCostType
};
