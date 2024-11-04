const qcService = require('./qc.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const requestIp = require('request-ip');

const getListStoreQC = async (req, res, next) => {
    try {
        const { user_name } = req.auth;
        const serviceRes = await qcService.getListStoreQC(user_name, req.query);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        const { data, total, page, limit } = serviceRes.getData();

        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

const getStoreQCInfo= async (req, res, next) => {
    try {
        const clientIp = requestIp.getClientIp(req);
        const { user_name } = req.auth;
        const serviceRes = await qcService.getStoreQCInfo(clientIp,user_name, req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};
const createOrUpdatestoreQC = async (req, res, next) => {
    try{
        const clientIp = requestIp.getClientIp(req);
        const {user_name} = req.auth;
        const serviceRes = await qcService.createOrUpdatestoreQC(clientIp, user_name, req.body);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    }catch(err){
        return next(err);
    }

}

const finishQCStore = async (req, res, next) => {
    try{
        const clientIp = requestIp.getClientIp(req);
        const {user_name} = req.auth;
        const serviceRes = await qcService.finishQCStore(clientIp, user_name, req.body);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    }catch(err){
        return next(err);
    }

}

module.exports = {
    getListStoreQC,
    getStoreQCInfo,
    createOrUpdatestoreQC,
    finishQCStore
};
