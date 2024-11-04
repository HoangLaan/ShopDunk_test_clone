const httpStatus = require('http-status');
const menuService = require('./menu.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');

/**
 * Get list menu
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getListMenu = async (req, res, next) => {
  try {
    const menus = await menuService.getListMenu(req);

    return res.json(new ListResponse(menus['data'], menus['total'], menus['page'], menus['limit']));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};
/**
 * Get list menu by user
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getListMenuByUser = async (req, res, next) => {
  try {
    const menus = await menuService.getListMenuByUser(req);

    return res.json(new SingleResponse(menus['data']));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};
/**
 * Create new a menu
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const createMenu = async (req, res, next) => {
  try {
    const result = await menuService.createMenu(req);
    if(! result) {
      return next(new ErrorResponse(null, null, RESPONSE_MSG.MENU.CREATE_FAILED));
    }

    return res.json(new SingleResponse(result, RESPONSE_MSG.MENU.CREATE_SUCCESS));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};

/**
 * Update a menu
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const updateMenu = async (req, res, next) => {
  try {
    // Check menu exists
    const func = await menuService.detailMenu(req.params.menuId);
    if(! func) {
      return next(new ErrorResponse(httpStatus.NOT_FOUND, null, RESPONSE_MSG.NOT_FOUND));
    }

    // Update menu
    const result = await menuService.updateMenu(req);

    if(! result) {
      return next(new ErrorResponse(null, null, RESPONSE_MSG.MENU.UPDATE_FAILED));
    }

    return res.json(new SingleResponse(null, RESPONSE_MSG.MENU.UPDATE_SUCCESS));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};

const deleteMenu = async (req, res, next) => {
  try {
    const menuId = req.params.menuId;

    // Check menu exists
    const func = await menuService.detailMenu(menuId);
    if(! func) {
      return next(new ErrorResponse(httpStatus.NOT_FOUND, null, RESPONSE_MSG.NOT_FOUND));
    }

    // Delete menu
    await menuService.deleteMenu(menuId, req);

    return res.json(new SingleResponse(null, RESPONSE_MSG.MENU.DELETE_SUCCESS));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};

const detailMenu = async (req, res, next) => {
  try {
    const menuId = req.params.menuId;

    // Check menu exists
    const func = await menuService.detailMenu(menuId);
    if(! func) {
      return next(new ErrorResponse(httpStatus.NOT_FOUND, null, RESPONSE_MSG.NOT_FOUND));
    }

    return res.json(new SingleResponse(func));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};

const changeStatusMenu = async (req, res, next) => {
  try {
    const menuId = req.params.menuId;

    // Check menu exists
    const func = await menuService.detailMenu(menuId);
    if(! func) {
      return next(new ErrorResponse(httpStatus.NOT_FOUND, null, RESPONSE_MSG.NOT_FOUND));
    }

    // Update password of menu
    await menuService.changeStatusMenu(menuId, req);

    return res.json(new SingleResponse(null, RESPONSE_MSG.MENU.CHANGE_STATUS_SUCCESS));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};

const deleteListMenu = async (req, res, next) => {
  try {
      const serviceRes = await menuService.deleteListMenu(req.body);
      if (serviceRes.isFailed()) {
          return next(serviceRes);
      }
      return res.json(new SingleResponse(true, 'Xoá khu vực thành công'));
  } catch (error) {
      return next(error);
  }
};

module.exports = {
  getListMenu,
  getListMenuByUser,
  createMenu,
  updateMenu,
  deleteMenu,
  detailMenu,
  changeStatusMenu,
  deleteListMenu
};
