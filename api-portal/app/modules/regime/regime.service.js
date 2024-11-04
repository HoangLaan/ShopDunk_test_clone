const RegimeClass = require('./regime.class');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require("mssql");
const API_CONST = require('../../common/const/api.const');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const _ = require('lodash');
const PROCEDURE_NAME = require("../../common/const/procedureName.const");
const fileHelper = require("../../common/helpers/file.helper")

const getListRegime = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const keyword = apiHelper.getSearch(queryParams);
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('PAGESIZE', itemsPerPage)
      .input('PAGEINDEX', currentPage)
      .input('REGIMETYPEID', apiHelper.getValueFromObject(queryParams, 'regime_type_id'))
      .input('USERNAME', apiHelper.getValueFromObject(queryParams, 'user_filter'))
      .input('ISACTIVE', apiHelper.getValueFromObject(queryParams, 'is_active'))
      .input('KEYWORD', keyword)
      .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'create_date_from'))
      .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'create_date_to'))
      .execute(PROCEDURE_NAME.HR_REGIME_GETLIST_ADMINWEB);

    const regimeData = RegimeClass.listRegime(data.recordset);
    const resDataTrans = (regimeData.map((item) => {
      return {...item, review_info: RegimeClass.detailInfoReview(JSON.parse(item?.review_info))}
    }))
    return new ServiceResponse(true, '', {
      'data': resDataTrans,
      'page': currentPage,
      'limit': itemsPerPage,
      'total': apiHelper.getTotalData(data.recordset),
    });
  } catch (e) {
    logger.error(e, {'function': 'regimeService.getListRegime'});
    return new ServiceResponse(true, '', {});
  }
};


const createOrUpdateRegime = async (bodyParams = {}, files = [], {user_name}) => {
  const pool = await mssql.pool;
  let allFile = [];
  const idUpdate = apiHelper.getValueFromObject(bodyParams, 'regime_id')
  const transaction = await new sql.Transaction(pool);
  try {
    if (files && files.length) {
      for (let i = 0; i < files.length; i++) {
        const resFile = await fileHelper.uploadFile(files[i]);
        resFile.data.fileName=files[i].originalname;
        if (!resFile || Object.keys(resFile).length === 0)
          return new ServiceResponse(false, "Upload file attachment failed!",);
        allFile = allFile.concat(resFile.data);
      }
    }
    await transaction.begin();
    const requestCreateRegime = new sql.Request(transaction);
    const resultCreateRegime = await requestCreateRegime
      .input('REGIMEID', idUpdate)
      .input('REGIMETYPEID', apiHelper.getValueFromObject(bodyParams, 'regime_type_id'))
      .input('REGIMENAME', apiHelper.getValueFromObject(bodyParams, 'regime_name'))
      .input('STARTTIME', apiHelper.getValueFromObject(bodyParams, 'from_date'))
      .input('ENDTIME', apiHelper.getValueFromObject(bodyParams, 'to_date'))
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active', API_CONST.ISACTIVE.ALL))
      .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system', API_CONST.ISSYSTEM.ALL))
      .input('CREATEDUSER', user_name)
      .execute(PROCEDURE_NAME.HR_REGIME_CREATEORUPDATE_ADMINWEB);

    const regimeId = resultCreateRegime.recordset[0]?.RESULT;
    if (!regimeId) {
      throw new Error('Create or update regime failed!');
    }

    if (idUpdate && idUpdate != '') {
      const requestDeleteFile = new sql.Request(transaction);
      const resultFile = await requestDeleteFile
        .input('REGIMEID', idUpdate)
        .input('UPDATEDUSER', user_name)
        .execute(PROCEDURE_NAME.HR_REGIME_ATTACHMENT_DELETEBYREGIMEID_ADMINWEB);

      if (!resultFile.recordset[0].RESULT) {
        await transaction.rollback();
        return new ServiceResponse(false, 'Delete attachment  failed!');
      }
    }
    if (allFile.length > 0) {
      const reqInsertAttachment = new sql.Request(transaction);
      for (const item of allFile) {
        const resInsertAttachment = await reqInsertAttachment
          .input("REGIMEID", regimeId)
          .input(
            "ATTACHMENTPATH",
            item.file || item.attachment_path
          )
          .input(
            "ATTACHMENTNAME",
            item.fileName || item.attachment_name || "file name"
          )
          .input("CREATEDUSER", user_name)
          .execute(PROCEDURE_NAME.HR_REGIME_ATTACHMENT_CRETAE_ADMINWEB);
        if (!resInsertAttachment.recordset[0].RESULT) {
          await transaction.rollback();
          return new ServiceResponse(false, "Insert attachment regime failed!",);
        }
      }
    }

    if (idUpdate && idUpdate != '') {
      const requestReviewListDelete = new sql.Request(transaction);
      const resultDelReviewList = await requestReviewListDelete
        .input('REGIMEID', idUpdate)
        .input('UPDATEDUSER', user_name)
        .execute(PROCEDURE_NAME.HR_REGIMEREVIEWLIST_DELETEBYREGIMEID_ADMINWEB);

      if (!resultDelReviewList.recordset[0].RESULT) {
        await transaction.rollback();
        return new ServiceResponse(false, 'Delete regime review list failed!');
      }
    }
    const dataReviewLists = apiHelper.getValueFromObject(bodyParams, 'regime_review', []);
    if (dataReviewLists && dataReviewLists.length) {
      const listCheckReview = _.uniqBy(dataReviewLists, 'user_review');
      if (listCheckReview.length !== dataReviewLists.length) {
        await transaction.rollback();
        return new ServiceResponse(false, 'Double user review.');
      }

      for (let i = 0; i < dataReviewLists.length; i++) {
        let {regime_review_level_id: regimeReviewLevelId, user_review: userReview = null} = dataReviewLists[i];
        if (regimeReviewLevelId) {
          let requestAddReviewList = new sql.Request(transaction);
          let resultAddReviewList = await requestAddReviewList
            .input('REGIMEID', regimeId)
            .input('REGIMEREVIEWLEVELID', regimeReviewLevelId)
            .input('USERREVIEW', userReview)
            .input('CREATEDUSER', user_name)
            .execute(PROCEDURE_NAME.HR_REGIMEREVIEWLIST_CREATE_ADMINWEB);

          if (!resultAddReviewList.recordset[0].RESULT) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Create regime review list failed!')
          }
        }
      }
    }
    await transaction.commit();
    return new ServiceResponse(true, 'ok', 1);
  } catch (e) {
    await transaction.rollback();
    logger.error(e, {'function': 'regimeService.createUserOrUpdate'});
    return new ServiceResponse(false, e);
  }
};

const getListReviewRegime = async (queryParams = {}) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('REGIMETYPEID', apiHelper.getValueFromObject(queryParams, 'regime_code'))
      .execute(PROCEDURE_NAME.HR_REGIMETYPE_GETLISTREVIEW_ADMINWEB);

    const resData = (RegimeClass.list(data.recordset));
    const resDataTrans = (resData.map((item) => {
      return {...item, users: item.users ? RegimeClass.detailUser(JSON.parse(item.users)) : []}
    }))
    return new ServiceResponse(true, '', { 'data': resDataTrans || [],});
  } catch (e) {
    logger.error(e, {'function': 'regimeService.getListReviewRegime'});
    return new ServiceResponse(true, '', {});
  }
};

const detailRegime = async regime_id => {
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('REGIMEID', regime_id)
      .execute(PROCEDURE_NAME.HR_REGIME_GETBYID_ADMINWEB);
    let dataRes = RegimeClass.detailRegime(data.recordsets[0][0]);
    dataRes.regime_review = RegimeClass.detailListInfoReview(data.recordsets[1])
    dataRes.attached_files = RegimeClass.detailAttachment(data.recordsets[2])
    return new ServiceResponse(true, '', dataRes);
  } catch (e) {
    logger.error(e, {function: 'regimeService.detailRegime'});
    return new ServiceResponse(false, e.message);
  }
};

const deleteRegime = async (regimeId, body) => {
  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);
  try {
    await transaction.begin();
    const requestDeleteRegime = new sql.Request(transaction);
    await requestDeleteRegime
      .input('REGIMEID', regimeId)
      .input('UPDATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
      .execute(PROCEDURE_NAME.HR_REGIME_DELETEBYID_ADMINWEB);

    const requestDeleteAttachment = new sql.Request(transaction);
    await requestDeleteAttachment
      .input('REGIMEID', regimeId)
      .input('UPDATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
      .execute(PROCEDURE_NAME.HR_REGIME_ATTACHMENT_DELETEBYREGIMEID_ADMINWEB);

    const requestDeleteReviewList = new sql.Request(transaction);
    await requestDeleteReviewList
      .input('REGIMEID', regimeId)
      .input('UPDATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
      .execute(PROCEDURE_NAME.HR_REGIMEREVIEWLIST_DELETEBYREGIMEID_ADMINWEB);

    await transaction.commit();
    return new ServiceResponse(true, 'ok', 1);
  } catch (error) {
    logger.error(error, {function: 'regimeService.deleteRegime'});
    await transaction.rollback();
    return new ServiceResponse(false, error.message);
  }
}

module.exports = {
  getListRegime,
  createOrUpdateRegime,
  getListReviewRegime,
  detailRegime,
  deleteRegime
};
