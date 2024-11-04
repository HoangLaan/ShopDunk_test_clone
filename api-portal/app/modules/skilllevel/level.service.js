const levelClass = require('../skilllevel/level.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');


const getListLevel = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);

    const pool = await mssql.pool;
    const data = await pool.request()
      .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'keyword'))
      .input('PAGESIZE', itemsPerPage)
      .input('PAGEINDEX', currentPage)
      .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'create_date_from'))
      .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'create_date_to'))
      .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
      .execute("MD_SKILLLEVEL_GETLIST_ADMINWEB");
    const stores = data.recordset;

    return new ServiceResponse(true, '', {
      'data': levelClass.list(stores),
      'page': currentPage,
      'limit': itemsPerPage,
      'total': apiHelper.getTotalData(stores),
    });
  } catch (e) {
    logger.error(e, {'function': 'levelService.getListLevel'});
    return new ServiceResponse(true, '', {});
  }
};

const detailLevel = async (levelid) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('LEVELID', levelid)
      .execute("MD_LEVEL_GETBYID_ADMINWEB");

    let level = data.recordset;

    if (level && level.length>0) {
        level = levelClass.detail(level[0]);
      return new ServiceResponse(true, '', level);
    }

    return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, {'function': 'levelService.detailLevel'});
    return new ServiceResponse(false, e.message);
  }
};
const createLevelOrUpdate = async (bodyParams) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
    .input('LEVELID', apiHelper.getValueFromObject(bodyParams, 'level_id'))
    .input('LEVELNAME', apiHelper.getValueFromObject(bodyParams, 'level_name'))
    .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
    .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
    .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
    .execute("MD_SKILLLEVER_CREATEORUPDATE_ADMINWEB");
    const level_id = data.recordset[0].RESULT;
    return new ServiceResponse(true, '', {
        level_id,
        status : 'success',
        message : 'Lưu thành công!'
      });
  } catch (e) {
    logger.error(e, {'function': 'levelService.createLevelOrUpdate'});
    return new ServiceResponse(false, e.message);
  }
};

const deleteLevel = async (level_id, bodyParams) => {
  try {

    const pool = await mssql.pool;
    await pool.request()
      .input('LEVELID', level_id)
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute("MD_SKILLLEVEL_Delete_AdminWeb");
    return new ServiceResponse(true, RESPONSE_MSG.BANNER.DELETE_SUCCESS,true);
  } catch (e) {
    logger.error(e, {'function': 'levelService.deleteLevel'});
    return new ServiceResponse(false, e.message);
  }
};
// const saveFile = async (base64, folderName) => {
//   let url = null;

//   try {
//     if (fileHelper.isBase64(base64)) {
//       const extension = fileHelper.getExtensionFromBase64(base64);
//       const guid = createGuid();
//       url = await fileHelper.saveBase64(folderName, base64, `${guid}.${extension}`);
//     } else {
//       url = base64.split(config.domain_cdn)[1];
//     }
//   } catch (e) {
//     logger.error(e, {
//       'function': 'bannerService.saveFile',
//     });
//   }
//   return url;
// };
// const createGuid = () => {
//   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
//     var r = Math.random() * 16 | 0,
//       v = c === 'x' ? r : (r & 0x3 | 0x8);
//     return v.toString(16);
//   });
// };


const getOptions = async () => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .execute("MD_SKILLLEVEL_GetOptions_AdminWeb");
    const skill = levelClass.options(data.recordset) ;
    return new ServiceResponse(true, '',skill);
  } catch (e) {
    logger.error(e, {'function': 'levelService.getOptions'});
    return new ServiceResponse(true, '', {});
  }
};


module.exports = {
  getListLevel,
  detailLevel,
  deleteLevel,
  createLevelOrUpdate,
  getOptions,
};
