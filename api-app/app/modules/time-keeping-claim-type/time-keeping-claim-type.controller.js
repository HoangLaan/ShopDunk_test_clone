const timeKeepingClaimTypeService = require('./time-keeping-claim-type.service');
const SingleResponse = require('../../common/responses/single.response');


const getOptions = async (req, res, next) => {
  try {
    const serviceRes = await timeKeepingClaimTypeService.getOptions({...req.query, ...req.body});
    if(serviceRes.isFailed()) return next(serviceRes)
    return res.json(new SingleResponse(serviceRes.getData(), serviceRes.getMessage()));
  } catch (error) {
      return next(error);
  }
};

const getReviewLevels = async (req, res, next) => {
  try {
    const serviceRes = await timeKeepingClaimTypeService.getReviewLevels({...req.query, ...req.body});
    if(serviceRes.isFailed()) return next(serviceRes)
    return res.json(new SingleResponse(serviceRes.getData(), serviceRes.getMessage()));
  } catch (error) {
      return next(error);
  }
};

const getTotalExplainAllTimeKeepingClaimType = async (req, res, next) => {
  try {
    const serviceRes = await timeKeepingClaimTypeService.getTotalExplainAllTimeKeepingClaimType({...req.query, ...req.body});
    if(serviceRes.isFailed()) return next(serviceRes)
    return res.json(new SingleResponse(serviceRes.getData(), serviceRes.getMessage()));
  } catch (error) {
      return next(error);
  }
};


module.exports = {
  getOptions,
  getReviewLevels,
  getTotalExplainAllTimeKeepingClaimType
};
