const promotionOfferService = require('./promotion-offer.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');
const apiHelper = require('../../common/helpers/api.helper');
/**
 * Get list SM_PROMOTIONOFFER
 */
const getList = async (req, res, next) => {
  try {
    const serviceRes = await promotionOfferService.getListPromotionOffer(req.query);
    const { data, total, page, limit } = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

/**
 * Get detail SM_PROMOTIONOFFER
 */
const detail = async (req, res, next) => {
  try {
    // Check SM_PROMOTIONOFFER exists
    const serviceRes = await promotionOfferService.detailOffer(req.params.promotionOfferId);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    const offerGist = await promotionOfferService.getListGiftByPromotionOfferId(req.params.promotionOfferId);
    if (offerGist.isFailed()) {
      return next(offerGist);
    }
    let datatemp = serviceRes.getData();
    datatemp.list_offer_gifts = offerGist.getData();
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

/**
 * Create new a SM_PROMOTIONOFFER
 */
const createPromotionOffer = async (req, res, next) => {
  try {
    req.body.promotion_offer_id = null;
    const serviceRes = await promotionOfferService.createPromotionOfferOrUpdate(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.PROMOTIONOFFER.CREATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Update a SM_PROMOTIONOFFER
 */
const updatePromotionOffer = async (req, res, next) => {
  try {
    const promotionOfferId = req.params.promotionOfferId;
    req.body.promotion_offer_id = promotionOfferId;

    // Check SM_PROMOTIONOFFER exists
    const serviceResDetail = await promotionOfferService.detailOffer(promotionOfferId);
    if (serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Update SM_PROMOTIONOFFER
    const serviceRes = await promotionOfferService.createPromotionOfferOrUpdate(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.PROMOTIONOFFER.UPDATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Change status SM_PROMOTIONOFFER
 */
const changeStatusPromotionOffer = async (req, res, next) => {
  try {
    const promotionOfferId = req.params.promotionOfferId;

    // Check userGroup exists
    const serviceResDetail = await promotionOfferService.detailOffer(promotionOfferId);
    if (serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }
    // Update status
    await promotionOfferService.changeStatusPromotionOffer(promotionOfferId, req.body);
    return res.json(new SingleResponse(null, RESPONSE_MSG.PROMOTIONOFFER.CHANGE_STATUS_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete SM_PROMOTIONOFFER
 */
const deletePromotionOffer = async (req, res, next) => {
  try {
    // Check SM_PROMOTIONOFFER exists
    const list_id = apiHelper.getValueFromObject(req.body, 'list_id', []);
    if(list_id?.length > 0) {
      for(let i = 0; i < list_id.length; i++) {
      // Check area exists
        const parseIdPromotionOffer = parseInt(list_id[i]);
        const serviceResDetail = await promotionOfferService.detailOffer(parseIdPromotionOffer);
        if (serviceResDetail.isFailed()) {
          return next(serviceResDetail);
        }
      }
    }

    // Delete SM_PROMOTIONOFFER
    const serviceRes = await promotionOfferService.deletePromotionOffer(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(null, RESPONSE_MSG.PROMOTIONOFFER.DELETE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getList,
  detail,
  createPromotionOffer,
  updatePromotionOffer,
  changeStatusPromotionOffer,
  deletePromotionOffer,
};
