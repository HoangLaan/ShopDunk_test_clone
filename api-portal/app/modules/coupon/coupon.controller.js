const httpStatus = require('http-status');
const couponService = require('./coupon.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const ErrorResponse = require('../../common/responses/error.response');

/**
 * Get list options coupon
 */
const getOptions = async (req, res, next) => {
    try {
        const serviceRes = await couponService.getOptions(req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getCouponOptions = async (req, res, next) => {
    try {
        const serviceRes = await couponService.getCouponOptions(req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

/**
 * Create or update coupon
 */
const createOrUpdateCoupon = async (req, res, next) => {
    try {
        const serviceRes = await couponService.createOrUpdateCoupon(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getListCoupon = async (req, res, next) => {
    try {
        const serviceRes = await couponService.getListCoupon(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const {data, total, page, limit} = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getCouponDetail = async (req, res, next) => {
    try {
        const coupon_id = req.params.coupon_id;

        const serviceRes = await couponService.getCouponDetail(coupon_id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const deleteCoupon = async (req, res, next) => {
    try {
        const serviceRes = await couponService.deleteCoupon(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getListDetailCouponCode = async (req, res, next) => {
    try {
        const coupon_id = req.params.coupon_id;

        const serviceRes = await couponService.getListDetailCouponCode(coupon_id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getListDetailAutoGenCouponCode = async (req, res, next) => {
    try {
        const coupon_id = req.params.coupon_id;

        const serviceRes = await couponService.getListDetailAutoGenCouponCode(coupon_id,{...req.body,...req.query});
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const {data, total, page, limit, meta} = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit ,meta));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};


const exportExcel = async (req, res, next) => {
    try {
        const coupon_id = req.params.coupon_id;
        const serviceRes = await couponService.exportExcel(coupon_id,req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const dataRes = serviceRes.getData();
        dataRes.write('Danh sách mã giảm tự động.xlsx', res);
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    getOptions,
    getCouponOptions,
    createOrUpdateCoupon,
    getListCoupon,
    getCouponDetail,
    deleteCoupon,
    getListDetailCouponCode,
    getListDetailAutoGenCouponCode,
    exportExcel
};
