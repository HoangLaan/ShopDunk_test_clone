const BorrowTypeService = require('./borrow-type.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const httpStatus = require('http-status');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');


const createBorrowType = async (req, res, next) => {
  try {
    req.body.updated_user = req.auth.user_name;
    const serviceRes = await BorrowTypeService.createOrUpdateHandler(null,req.body);
    if (serviceRes.isFailed()) {
      return next(new ErrorResponse(httpStatus.INTERNAL_SERVER_ERROR, null, RESPONSE_MSG.CRUD.CREATE_FAILED));
    }
    return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.CREATE_SUCCESS));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};


const updateBorrowType = async (req, res, next) => {
  try {
    req.body.updated_user = req.auth.user_name;
    const id = req.params.id
    const serviceRes = await BorrowTypeService.createOrUpdateHandler(id,req.body);
    if (serviceRes.isFailed()) {
      return next(new ErrorResponse(httpStatus.INTERNAL_SERVER_ERROR, null, RESPONSE_MSG.CRUD.UPDATE_FAILED));
    }
    return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.UPDATE_SUCCESS));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};

const getListBorrowType = async (req, res, next) => {
  try {
    const {list, total} = await BorrowTypeService.getListBorrowType(req.query);
    return res.json(new ListResponse(list, total, req.query.page, req.query.itemsPerPage));
  } catch (error) {
    return next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const id = req.params.id
    const serviceRes = await BorrowTypeService.getById(id);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};


/**
 * Delete borrow type
 */
const deleteBorrowType = async (req, res, next) => {
  try {

    const borrowTypeId = req.params.id
    // Check Borrow Type
    const serviceResDetail = await BorrowTypeService.getById(borrowTypeId);
    if (serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    req.body.deleted_user = req.auth.user_name;
    // Delete borrow type
    const serviceRes = await BorrowTypeService.deleteBorrowType(borrowTypeId,req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(null, RESPONSE_MSG.CUSTOMERTYPE.DELETE_SUCCESS));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }

};

/**
 * Delete list
 */
const deleteListBorrowType = async (req, res, next) => {
  try {
    const serviceRes = await BorrowTypeService.deleteListBorrowType(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(true, 'Xoá danh sách loại ngân sách thành công'));
  } catch (error) {
    return next(error);
  }
};



module.exports = {
  createBorrowType,
  getListBorrowType,
  getById,
  updateBorrowType,
  deleteBorrowType,
  deleteListBorrowType
};
