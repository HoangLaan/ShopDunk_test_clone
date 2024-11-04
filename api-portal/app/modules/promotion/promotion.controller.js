const promotionService = require('./promotion.service');
const promotionOfferApplyService = require('../promotion_offer_apply/promotion_offer_apply.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const apiHelper = require('../../common/helpers/api.helper');
/**
 * Get list PROMOTIONS
 */
// Chinh sua: chi lay cac promtion ap dung cho cong ty va co so ma nhan vien dang nhap duoc phan cong
const getList = async (req, res, next) => {
  try {
    const username = req.body.auth_name;
    const serviceRes = await promotionService.getListPromotion(req.query, username);
    const { data, total, page, limit } = serviceRes.getData();
    if (data && apiHelper.getValueFromObject(req.query, 'get_offer') === '1') {
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        // eslint-disable-next-line no-await-in-loop
        const serviceRes2 = await promotionOfferApplyService.getListByPromotionId(item.promotion_id);
        if (serviceRes2.isFailed()) {
          return next(serviceRes2);
        }
        item.list_offer = serviceRes2.getData();
      }
    }
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

/**
 * Get detail PROMOTIONS
 */
const detail = async (req, res, next) => {
  try {
    // Check company exists
    const serviceRes = await promotionService.detail(req.params.promotionId);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

/**
 * Create new a SM_PROMOTION
 */
const createPromotion = async (req, res, next) => {
  try {
    req.body.promotion_id = null;
    const serviceRes = await promotionService.createPromotionOrUpdates(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.PROMOTION.CREATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Update a SM_PROMOTION
 */
const updatePromotion = async (req, res, next) => {
  try {
    const promotionId = req.params.promotionId;
    req.body.promotion_id = promotionId;

    // Check segment exists
    const serviceResDetail = await promotionService.detail(promotionId);
    if (serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Update segment
    const serviceRes = await promotionService.createPromotionOrUpdates(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.PROMOTION.UPDATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Change status SM_PROMOTION
 */
const changeStatusPromotion = async (req, res, next) => {
  try {
    const promotionId = req.params.promotionId;

    // Check userGroup exists
    const serviceResDetail = await promotionService.detail(promotionId);
    if (serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Update status
    await promotionService.changeStatusPromotion(promotionId, req.body);
    return res.json(new SingleResponse(null, RESPONSE_MSG.PROMOTION.CHANGE_STATUS_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

const approvePromotion = async (req, res, next) => {
  try {
    const promotionId = req.params.promotionId;

    // Check userGroup exists
    const serviceResDetail = await promotionService.detail(promotionId);
    if (serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Update status
    await promotionService.approvePromotion(promotionId, req.body);
    return res.json(new SingleResponse(null, RESPONSE_MSG.PROMOTION.APPROVE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete PROMOTIONS
 */
const deletePromotion = async (req, res, next) => {
  try {
    const list_id = apiHelper.getValueFromObject(req.body, 'list_id', []);
    if(list_id?.length > 0) {
      for(let i = 0; i < list_id.length; i++) {
      // Check area exists
        const parseIdPromotion = parseInt(list_id[i]);
        const serviceResDetail = await promotionService.detail(parseIdPromotion);
        if (serviceResDetail.isFailed()) {
          return next(serviceResDetail);
        }
      }
    }
    // Delete area
    const serviceRes = await promotionService.deletePromotion(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(null, RESPONSE_MSG.PROMOTION.DELETE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

const stopPromotion = async (req, res, next) => {
  try {
    const promotionId = req.params.promotionId;
    // Check userGroup exists
    const serviceResDetail = await promotionService.detail(promotionId);
    if (serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Update status
    await promotionService.stopPromotion(promotionId, req.body);
    return res.json(new SingleResponse(null, 'Dừng chương trình khuyến mại thành công.'));
  } catch (error) {
    return next(error);
  }
};

const getTotalPromotion = async (req, res, next) => {
  try {
    const username = req.body.auth_name;
    const serviceRes = await promotionService.getTotalPromotion(req.query, username);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData(), 'Lấy tổng trình khuyến mại thành công.'));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getList,
  detail,
  createPromotion,
  updatePromotion,
  changeStatusPromotion,
  approvePromotion,
  deletePromotion,
  stopPromotion,
  getTotalPromotion,
};
