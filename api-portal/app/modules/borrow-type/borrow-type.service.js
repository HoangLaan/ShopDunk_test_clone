const mssql = require('../../models/mssql');
const sql = require('mssql');
const apiHelper = require('../../common/helpers/api.helper');
const API_CONST = require('../../common/const/api.const');
const logger = require('../../common/classes/logger.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const BorrowTypeClass = require('./borrow-type.class')
const ServiceResponse = require('../../common/responses/service.response');


const createOrUpdateHandler = async (idUpdate, bodyParams = {}) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    const isAutoReview = apiHelper.getValueFromObject(bodyParams, 'is_auto_review', null)
    const listReviewLevel = apiHelper.getValueFromObject(bodyParams, 'borrow_type_review_list', [])
    try {
      await transaction.begin();
      const request = new sql.Request(transaction);
      const borrowTypeID = await request
        .input('BORROWTYPEID', idUpdate)
        .input('BORROWTYPENAME', apiHelper.getValueFromObject(bodyParams, 'borrow_type_name', null))
        .input('BORROWTYPE', apiHelper.getValueFromObject(bodyParams, 'borrow_type', null))
        .input('ISAUTOREVIEW', isAutoReview)
        .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description', null))
        .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active', API_CONST.ISACTIVE.ALL))
        .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system', API_CONST.ISSYSTEM.ALL))
        .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'updated_user', null))
        .execute(PROCEDURE_NAME.SL_BORROWTYPE_CREATEORUPDATE_ADMINWEB);
      if (!isAutoReview && !listReviewLevel.length) {
        throw  new Error("Lỗi! Không có thông tin duyệt");
      } else {
        if (!isAutoReview) {
          if (idUpdate) {
            //Xóa tham chiếu
            const requestDel = new sql.Request(transaction);
            await requestDel
              .input('BORROWTYPEID', idUpdate)
              .execute(PROCEDURE_NAME.SL_BORROWTYPE_REVIEWLEVEL_DELETE_ADMINWEB);
          }
          for (let i = 0; i < listReviewLevel.length; i++) {
            const request2 = new sql.Request(transaction);
            const borrowTypeRvLvId = await request2
              .input('BORROWTYPEID', borrowTypeID.recordset[0]['RESULT'])
              .input('BORROWREVIEWLEVELID', listReviewLevel[i]?.borrow_review_level_id)
              .input('ISAUTOREVIEW', listReviewLevel[i]?.is_auto_review)
              .input('ISCOMPLETE', listReviewLevel[i]?.is_complete_review)
              .execute(PROCEDURE_NAME.SL_BORROWTYPE_REVIEWLEVEL_CREATEORUPDATE_ADMINWEB);
            const userReview = listReviewLevel[i]?.user
            if (!listReviewLevel[i]?.is_auto_review && !userReview)
              throw  new Error("Lỗi! Không có thông tin người duyệt");
            else {
              if (!listReviewLevel[i]?.is_auto_review) {
                const request3 = new sql.Request(transaction);
                await request3
                  .input('BORROWTYPEREVIEWLEVELID', borrowTypeRvLvId.recordset[0]['RESULT'])
                  .input('USERNAME', listReviewLevel[i]?.user?.id || listReviewLevel[i]?.user)
                  .execute(PROCEDURE_NAME.SL_BORROWTYPE_REVIEWLEVEL_USER_CREATEORUPDATE_ADMINWEB);
              }
            }
          }
        }
      }
      await transaction.commit();
      return new ServiceResponse(true, 'Thêm hình thức mượn hàng thành công', {});

    } catch (error) {
      await transaction.rollback();
      logger.error(error, {function: 'BorrowTypeService.createOrUpdate'});
      return new ServiceResponse(false, error.message);
    }
  }
;

const getListBorrowType = async (params = {}) => {
  try {

    const pool = await mssql.pool;
    const borrowTypes = await pool
      .request()
      .input('KEYWORD', apiHelper.getValueFromObject(params, 'search', null))
      .input('ISACTIVE', apiHelper.getValueFromObject(params, 'is_active', API_CONST.ISACTIVE.ALL))
      .input('ISSYSTEM', apiHelper.getValueFromObject(params, 'is_system', null))
      .input('CREATEDDATEFROM', apiHelper.getValueFromObject(params, 'created_date_from', null))
      .input('CREATEDDATETO', apiHelper.getValueFromObject(params, 'created_date_to', null))
      .input('PAGESIZE', apiHelper.getValueFromObject(params, 'itemsPerPage', null))
      .input('PAGEINDEX', apiHelper.getValueFromObject(params, 'page', null))
      .execute(PROCEDURE_NAME.SL_BORROWTYPE_GETLIST_ADMINWEB);
    return {
      list: BorrowTypeClass.list(borrowTypes.recordsets[0]),
      total: borrowTypes.recordsets[0][0]['TOTALITEMS'],
    };
  } catch (error) {
    logger.error('BorrowTypeService.getList', error);
    return [];
  }
};

const getById = async borrowTypeId => {
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('BORROWTYPEID', borrowTypeId)
      .execute(PROCEDURE_NAME.SL_BORROWTYPE_GETBYID_ADMINWEB);
    if (!data.recordsets[0]) {
      return new ServiceResponse(false, 'Không tìm thấy loại công việc');
    }
    const result = {
      ...BorrowTypeClass.detail(data.recordsets[0][0]),
      borrow_type_review_list: BorrowTypeClass.listReviewLevel(data.recordsets[1]) || []
    }
    return new ServiceResponse(true, '', result);
  } catch (error) {
    logger.error(error, {function: 'BorrowTypeService.getById'});
    return new ServiceResponse(false, error.message);
  }
};

const deleteBorrowType = async (borrowTypeId, bodyParams) => {
  try {
    const pool = await mssql.pool;
    await pool
      .request()
      .input('BORROWTYPEID', borrowTypeId)
      .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'deleted_user', null))
      .execute(PROCEDURE_NAME.SL_BORROWTYPE_DELETE_ADMINWEB);
    return new ServiceResponse(true, 'delete borrow type successfully!');
  } catch (e) {
    logger.error(e, {function: 'BorrowTypeService.deleteBorrowType'});
    return new ServiceResponse(false, e.message);
  }
};

const deleteListBorrowType = async bodyParams => {
  try {
    let list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []);
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('LISTID', list_id)
      .input('NAMEID', 'BORROWTYPEID')
      .input('TABLENAME', 'SL_BORROWTYPE')
      .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute('CBO_COMMON_SOFTDELETE');
    return new ServiceResponse(true, '', true);
  } catch (e) {
    logger.error(e, {function: 'BorrowTypeService.deleteListBorrowType'});
    return new ServiceResponse(false, 'Lỗi xoá danh sách hình thức mượn');
  }
};

module.exports = {
  createOrUpdateHandler,
  getListBorrowType,
  getById,
  deleteBorrowType,
  deleteListBorrowType
}
