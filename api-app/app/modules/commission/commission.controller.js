const commissionService = require('./commission.service');
const ListResponse = require('../../common/responses/list.response');
const SingleResponse = require('../../common/responses/single.response');
const optionService = require('../../common/services/options.service');


/**
 * Get list commission by user
 */
const getCommission = async (req, res, next) => {

  try {
      const serviceRes = await commissionService.getCommission(req.query, req.body);
      if (serviceRes.isFailed()) {
          return next(serviceRes);
      }
      const {data, total, page, limit} = serviceRes.getData();
      return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
      return next(error);
  }
};

/**
 * Get detail commission by user
 */
const getDetailCommission = async (req, res, next) => {
  try {
    const orderCommissionId = req.params.order_commission_id;
    const serviceRes = await commissionService.getDetailCommission(orderCommissionId);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getCommission,
  getDetailCommission,
};
