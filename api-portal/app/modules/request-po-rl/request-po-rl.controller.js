const RequestPoRLService = require('./request-po-rl.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
/**
 * Get list REQUEST_PO
 */
const getListRequestPoRL = async (req, res, next) => {
    try {
        const serviceRes = await RequestPoRLService.getListRequestPoRL(Object.assign({}, req.query, req.body));
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

const createRequestPoRL = async (req, res, next) => {
    try {
        const serviceRes = await RequestPoRLService.createRequestPoRL(req.body, req.auth);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), 'Thêm mức duyệt mua hàng thành công'));
    } catch (error) {
        return next(error);
    }
};

const detailRequestPoRL = async (req, res, next) => {
    try {
        const serviceRes = await RequestPoRLService.detailRequestPoRL(req.params.requestPoRlId, req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const updateRequestPoRL = async (req, res, next) => {
    try {
        const serviceRes = await RequestPoRLService.updateRequestPoRL(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse('Chỉnh sửa mức duyệt mua hàng thành công'));
    } catch (error) {

        return next(error);
    }
};

const deleteRequestPoRL = async (req, res, next) => {
    try {

        const serviceRes = await RequestPoRLService.deleteRequestPoRL(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse('Xoá mức duyệt mua hàng thành công'));
    } catch (error) {
        return next(error);
    }
};

const getListUserReview = async (req, res, next) => {
    try {
        const serviceRes = await RequestPoRLService.getListUserReview(req.params.offWorkRlId);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

// const getRequestPoRLOptions = async (req, res, next) => {
//     try {
//         const serviceRes = await RequestPoRLService.getRequestPoRLOptions(req.query.company_id);
//         if (serviceRes.isFailed()) {
//             return next(serviceRes);
//         }

//         return res.json(new SingleResponse(serviceRes.getData()));
//     } catch (error) {
//         return next(error);
//     }
// };

module.exports = {
    getListRequestPoRL,
    createRequestPoRL,
    detailRequestPoRL,
    updateRequestPoRL,
    deleteRequestPoRL,
    getListUserReview,
    //getRequestPoRLOptions
};
