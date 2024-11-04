const materialGroupService = require('./material-group.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const httpStatus = require('http-status');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');


const createMaterialGroup = async (req, res, next) => {
  try {
    req.body.updated_user = req.auth.user_name;
    const serviceRes = await materialGroupService.createOrUpdateHandler(req.body);
    if (serviceRes.isFailed()) {
      return next(new ErrorResponse(httpStatus.INTERNAL_SERVER_ERROR, null, RESPONSE_MSG.CRUD.CREATE_FAILED));
    }
    return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.CREATE_SUCCESS));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};


const updateMaterialGroup = async (req, res, next) => {
  try {
    req.body.updated_user = req.auth.user_name;
    const serviceRes = await materialGroupService.createOrUpdateHandler(req.body);
    if (serviceRes.isFailed()) {
      return next(new ErrorResponse(httpStatus.INTERNAL_SERVER_ERROR, null, RESPONSE_MSG.CRUD.CREATE_FAILED));
    }
    return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.CREATE_SUCCESS));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};

const getListMaterialGroup = async (req, res, next) => {
  try {
    const {list, total} = await materialGroupService.getListMaterialGroup(req.query);
    return res.json(new ListResponse(list, total, req.query.page, req.query.itemsPerPage));
  } catch (error) {
    return next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const id = req.params.id
    const serviceRes = await materialGroupService.getById(id);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};


/**
 * Delete Material Group
 */
const deleteMaterialGroup = async (req, res, next) => {
  try {

    const materialGroupId = req.params.id
    // Check Material Group
    const serviceResDetail = await materialGroupService.getById(materialGroupId);
    if (serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    req.body.deleted_user = req.auth.user_name;
    // Delete Material Group
    const serviceRes = await materialGroupService.deleteMaterialGroup(materialGroupId, req.body);
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
const deleteListMaterialGroup = async (req, res, next) => {
  try {
    const serviceRes = await materialGroupService.deleteListMaterialGroup(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(true, 'Xoá danh sách nhóm nguyên liệu thành công'));
  } catch (error) {
    return next(error);
  }
};

const getOptionTreeView = async (req, res, next) => {
  try {
    const serviceRes = await materialGroupService.getOptionTreeView(req.query);
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const generateCode = async (req, res, next) => {
  try {
    const serviceRes = await materialGroupService.generateCode(req.query);
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createMaterialGroup,
  getListMaterialGroup,
  getById,
  updateMaterialGroup,
  deleteMaterialGroup,
  deleteListMaterialGroup,
  getOptionTreeView,
  generateCode
};
