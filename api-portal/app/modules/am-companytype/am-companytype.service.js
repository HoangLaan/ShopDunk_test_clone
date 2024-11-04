const amCompanyTypeClass = require('../am-companytype/am-companytype.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const API_CONST = require('../../common/const/api.const');
var xl = require('excel4node');
/**
 * Get list AM_COMPANYTYPE
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListCompanyType = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const keyword = apiHelper.getSearch(queryParams);
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('PageSize', itemsPerPage)
      .input('PageIndex', currentPage)
      .input('KEYWORD', keyword)
      .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'create_date_from'))
      .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'create_date_to'))
      .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
      .execute(PROCEDURE_NAME.AM_COMPANYTYPE_GETLIST_ADMINWEB);
    // const CompanyTypes = data.recordset;
    
    // return new ServiceResponse(true, '', {
    //   'data': amCompanyTypeClass.list(CompanyTypes),
    //   'page': currentPage,
    //   'limit': itemsPerPage,
    //   'total': apiHelper.getTotalData(CompanyTypes),
    // });
    const CompanyTypes = data.recordsets[0];
    const totalItem = data.recordsets[1][0].TOTAL;
    return new ServiceResponse(true, '', {
      'data': amCompanyTypeClass.list(CompanyTypes),
      'page': currentPage,
      'limit': itemsPerPage,
      'total': totalItem,
    });
  } catch (e) {
    logger.error(e, {'function': 'CompanyTypeService.getListCompanyType'});
    return new ServiceResponse(true, '', {});
  }
};

// detail Company type
const detailCompanyType = async (companyTypeId) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request()
        .input('COMPANYTYPEID', companyTypeId)
        .execute(PROCEDURE_NAME.AM_COMPANYTYPE_GETBYID_ADMINWEB);

        let companyType = data.recordset;

        // If exists 
        if (companyType && companyType.length > 0) {
            companyType = amCompanyTypeClass.detail(companyType[0]);
            return new ServiceResponse(true, '', companyType);
        }
        return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
    } catch (e) {
        logger.error(e, {'function': 'amCompanyTypeService.getListCompanyType'});
        return new ServiceResponse(false, e.message);
    }
};

//Delete company type
const deleteCompanyType = async (companyTypeId, bodyParams) => {
    try {
        const pool = await mssql.pool;
        await pool.request()
            .input('COMPANYTYPEID', companyTypeId)
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute(PROCEDURE_NAME.AM_COMPANYTYPE_DELETE_ADMINWEB);
        return new ServiceResponse(true, RESPONSE_MSG.COMPANY_TYPE.DELETE_SUCCESS,'');
    } catch (e) {
        logger.error(e, {'function': 'amCompanyTypeService.deleteCompanyType'});
        return new ServiceResponse(false, e.message);
    }
}

// change Status
const changeStatusCompanyType = async (companyTypeId, bodyParams) => {
  try {
    const pool = await mssql.pool;
    await pool.request()
      .input('COMPANYTYPEID', companyTypeId)
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name')) // return administrator
      .execute(PROCEDURE_NAME.AM_COMPANYTYPE_UPDATESTATUS_ADMINWEB);
    return new ServiceResponse(true, 'change status success', {isSuccess:true});
  } catch (e) {
    logger.error(e, {'function': 'amCompanyTypeService.changeStatusCompanyType'});
    return new ServiceResponse(false);
  }
};

// create or update CompanyType
const createOrUpdateCompanyType = async (bodyParams) => {
  try {
    const pool = await mssql.pool;
    //check name
    const dataCheck = await pool.request()
      .input('COMPANYTYPEID', apiHelper.getValueFromObject(bodyParams, 'company_type_id'))
      .input('COMPANYTYPENAME', apiHelper.getValueFromObject(bodyParams, 'company_type_name'))
      .execute(PROCEDURE_NAME.AM_COMPANYTYPE_CHECKNAME_ADMINWEB);
    if (dataCheck.recordset && dataCheck.recordset[0].RESULT == 1) {
      return new ServiceResponse(false, RESPONSE_MSG.COMPANY_TYPE.EXISTS_NAME, null);
    }
    const data = await pool.request()
      .input('COMPANYTYPEID', apiHelper.getValueFromObject(bodyParams, 'company_type_id'))
      .input('COMPANYTYPENAME', apiHelper.getValueFromObject(bodyParams, 'company_type_name'))
      .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system',0))
      .input('DESCRIPTIONS', apiHelper.getValueFromObject(bodyParams, 'descriptions'))
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute(PROCEDURE_NAME.AM_COMPANYTYPE_CREATEORUPDATE_ADMINWEB);
      const companyTypeId = data.recordset[0].RESULT;
    return new ServiceResponse(true, 'update success', companyTypeId);
  } catch (e) {
    logger.error(e, {'function': 'amCompanyTypeService.createOrUpdateCompanyType'});
    return new ServiceResponse(false);
  }
};

// export Excel
const exportExcel = async (queryParams = {}) => {
  queryParams.itemsPerPage = API_CONST.MAX_EXPORT_EXCEL;
  queryParams.is_active = 2;
  const serviceRes = await getListCompanyType(queryParams);
  const { data } = serviceRes.getData();

  // Create a new instance of a Workbook class
  const wb = new xl.Workbook();
  // Add Worksheets to the workbook
  const ws = wb.addWorksheet('List Company Type', {});
  // Set width
  ws.column(1).setWidth(15);
  ws.column(2).setWidth(40);
  ws.column(3).setWidth(40);
  ws.column(4).setWidth(50);
  ws.column(12).setWidth(50);
  ws.column(13).setWidth(50);

  const header = {
    company_type_id: 'Mã loại hình công ty',
    company_type_name: 'Tên loại hình công ty',
    created_user: 'Người tạo',
    descriptions: 'Mô tả',
    created_date: 'Ngày tạo',
    is_active: 'Kích hoạt',
  };
  data.unshift(header);
  data.forEach((item, index) => {
    let indexRow = index + 1;
    let indexCol = 0;
    ws.cell(indexRow, ++indexCol).string(item.company_type_id.toString());
    ws.cell(indexRow, ++indexCol).string((item.company_type_name||'').toString());
    // ws.cell(indexRow, ++indexCol).string(index === 0 ? item.gender : (item.gender===1 ? 'Nam' : 'Nữ'));
    ws.cell(indexRow, ++indexCol).string((item.created_user||'').toString());
    ws.cell(indexRow, ++indexCol).string((item.descriptions||'').toString());
    ws.cell(indexRow, ++indexCol).string(index === 0 ? item.is_active : (item.is_active ? 'Có' : 'Không'));
    ws.cell(indexRow, ++indexCol).string((item.created_date||'').toString());
  });

  return new ServiceResponse(true, '', wb);
};

module.exports = {
  getListCompanyType,
  detailCompanyType,
  deleteCompanyType,
  changeStatusCompanyType,
  createOrUpdateCompanyType,
  exportExcel,

};
