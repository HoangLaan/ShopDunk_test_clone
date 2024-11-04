const timeKeepingClaimService = require('./time-keeping-claim.service');
const SingleResponse = require('../../common/responses/single.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const mailController = require('../mail/mail.controller');

/**
 * Get detail CRM_SEGMENT
 */
const detailTimeKeepingClaim = async (req, res, next) => {
  try {
    // Check company exists
    req.body.time_keeping_claim_id = req.params.id;
    const serviceRes = await timeKeepingClaimService.detailTimeKeepingClaim(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

/**
 * Create new a MD_AREA
 */
const createTimeKeepingClaim = async (req, res, next) => {
  try {
    const serviceRes = await timeKeepingClaimService.createOrUpdateTimeKeepingClaim({...req.body, auth: req.auth});
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    const dataMail = serviceRes.getData();
    if(dataMail.send_to_qc){
      req.body = dataMail;
      req.messageSuccess = serviceRes.getMessage()
      await mailController.createMail(req, res, next);
    }
  
    return res.json(new SingleResponse(serviceRes.getData(), serviceRes.getMessage()));
  } catch (error) {
    return next(error);
  }
};


const getDetailTimeKeepingClaimByScheduleId = async (req, res, next) => {
  try {
    // Check company exists
    req.body.schedule_id = req.params.id;
    const serviceRes = await timeKeepingClaimService.getDetailTimeKeepingClaimByScheduleId({...req.body, ...req.query});
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData(), serviceRes.getMessage()));
  } catch (error) {
    return next(error);
  }
};


module.exports = {
  createTimeKeepingClaim,
  detailTimeKeepingClaim,
  getDetailTimeKeepingClaimByScheduleId
};
