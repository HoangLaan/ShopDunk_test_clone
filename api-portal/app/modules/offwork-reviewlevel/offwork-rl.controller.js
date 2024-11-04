const OffWorkRLService = require('./offwork-rl.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
/**
 * Get list AM_COMPANY
 */
const getListOffWorkRL = async (req, res, next) => {
    try {
        const serviceRes = await OffWorkRLService.getListOffWorkRL(Object.assign({}, req.query, req.body));
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

const createOffWorkRL = async (req, res, next) => {
    try {
        //   req.body.campaign_id = null;
        const serviceRes = await OffWorkRLService.createOffWorkRL(req.body, req.auth);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.OFFWORKRL.CREATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

const detailOffWorkRL = async (req, res, next) => {
    try {
        const serviceRes = await OffWorkRLService.detailOffWorkRL(req.params.offWorkRlId, req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const updateOffWorkRL = async (req, res, next) => {
    try {
        const serviceRes = await OffWorkRLService.updateOffWorkRL(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(RESPONSE_MSG.OFFWORKRL.UPDATE_SUCCESS));
    } catch (error) {

        return next(error);
    }
};

const deleteOffWorkRL = async (req, res, next) => {
    try {
        
        const serviceRes = await OffWorkRLService.deleteOffWorkRL(req.query.off_work_review_level_id, req.auth);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(RESPONSE_MSG.OFFWORKRL.DELETE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

const getListUserReview = async (req, res, next) => {
    try {
        const serviceRes = await OffWorkRLService.getListUserReview(req.params.offWorkRlId);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getOffworkRLOptions = async (req, res, next) => {
    try {
        const serviceRes = await OffWorkRLService.getOffworkRLOptions(req.query.company_id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getListOffWorkRL,
    createOffWorkRL,
    detailOffWorkRL,
    updateOffWorkRL,
    deleteOffWorkRL,
    getListUserReview,
    getOffworkRLOptions
};
