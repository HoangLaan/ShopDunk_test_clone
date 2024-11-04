const orderService = require('./order.service');
const SingleResponse = require('../../common/responses/single.response');
const ErrorResponse = require('../../common/responses/error.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const httpStatus = require('http-status');

// Lấy danh sách đơn hàng có phân quyền
// Có quyền xem tất cả hoặc quyền xem phòng ban hoạc chỉ xem được do cá nhân tạo
const getListOrder = async (req, res, next) => {
    try {
        req.query.user_id = req.auth.user_id;
        req.query.user_name = req.auth.user_name;
        const serviceRes = await orderService.getListOrder(Object.assign({}, req.query, req.body));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const {data, total, page, limit} = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

// Lấy danh sách trạng thái đơn hàng 1
const getOrderStatusOptions = async (req, res, next) => {
    try {
        const serviceRes = await orderService.getOrderStatusOptions(Object.assign({}, req.query, req.body));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new ListResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const detailOrder = async (req, res, next) => {
    try {
        const serviceRes = await orderService.detailOrder(req.params.orderId);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

// Get detail order by order no
const getDetailOrderByOrderNo = async (req, res, next) => {
    try {
        const {order_id = null} = req.query;
        const serviceRes = await orderService.detailOrder(order_id, req.params.order_no);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const createOrder = async (req, res, next) => {
    try {
        const serviceRes = await orderService.createOrUpdateOrder(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        // //Gửi SMS hoặc ZaloOA
        // const serviceResCheck = await orderService.checkSendSmsOrZaloOA({
        //     order_status_id: req.body.order_status_id,
        //     order_type_id: req.body.order_type_id
        // });

        // if (serviceRes.isSuccess() && !_.isNil(serviceResCheck.getData())) {

        //     const { ISSENDSMS, ISSENDZALOOA, CONTENTSMS, BRANDNAME } = serviceResCheck.getData()

        //     if (ISSENDSMS) {
        //         const serviceResSendSmsOrZaloOA = await orderService.sendMultipleMessage_V4_post_json({
        //             phone: req.body.phone_number_receive,
        //             content: CONTENTSMS,
        //             brandname: BRANDNAME
        //         })

        //         if (serviceResSendSmsOrZaloOA.isFailed()) {
        //             return next(new ErrorResponse(httpStatus.OK, null, 'Tạo đơn thành công nhưng gửi SMS lỗi !'));
        //         }
        //     }
        // }

        // // push notify
        // const orderId = serviceRes.getData();
        // if (orderId) {
        //     const orderRes = await orderService.detailOrder(orderId);
        //     if (orderRes.isSuccess()) {
        //         const { order_no } = orderRes.getData();
        //         notification.add({
        //             type: 'create_notification',
        //             source_type: NOTIFY_CONST.ORDER_CREATED,
        //             params: {
        //                 order_no,
        //                 source_id: orderId,
        //                 created_user: req.auth.full_name,
        //                 created_date: moment().format('hh:mm A'),
        //             },
        //             users: [req.body.auth_name],
        //         });
        //     }
        // }

        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.ORDER.CREATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const updateOrder = async (req, res, next) => {
    try {
        req.body.order_id = req.params.orderId;
        const serviceRes = await orderService.createOrUpdateOrder(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        // //Gửi SMS hoặc ZaloOA
        // const serviceResCheck = await orderService.checkSendSmsOrZaloOA({
        //     order_status_id: req.body.order_status_id,
        //     order_type_id: req.body.order_type_id
        // });
        // if (serviceRes.isSuccess() && !_.isNil(serviceResCheck.getData())) {
        //     const { ISSENDSMS, ISSENDZALOOA, CONTENTSMS, BRANDNAME } = serviceResCheck.getData()
        //     if (ISSENDSMS) {
        //         const serviceResSendSmsOrZaloOA = await orderService.sendMultipleMessage_V4_post_json({
        //             phone: req.body.phone_number_receive,
        //             content: CONTENTSMS,
        //             brandname: BRANDNAME
        //         })

        //         if (serviceResSendSmsOrZaloOA.isFailed()) {
        //             return next(serviceResSendSmsOrZaloOA);
        //         }
        //     }
        // }

        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.ORDER.UPDATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

const deleteOrder = async (req, res, next) => {
    try {
        const orderId = req.query.order_id;
        const serviceResDetail = await orderService.checkOrderExist(orderId);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }

        const serviceRes = await orderService.deleteOrder(orderId, req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        //
        return res.json(new SingleResponse(null, RESPONSE_MSG.ORDER.DELETE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

/**
 * Delete
 */
const cancelOrder = async (req, res, next) => {
    try {
        const orderId = req.params.orderId;

        const serviceResDetail = await orderService.detailOrder(orderId);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }

        const serviceRes = await orderService.cancelOrder(orderId, req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        // // push notify
        // if (orderId) {
        //     const { order_no } = serviceResDetail.getData();
        //     notification.add({
        //         type: 'create_notification',
        //         source_type: NOTIFY_CONST.ORDER_CANCELLED,
        //         params: {
        //             order_no,
        //             source_id: orderId,
        //             created_user: req.auth.full_name,
        //             cancelled_date: moment().format('hh:mm A'),
        //         },
        //         users: [req.body.auth_name],
        //     });
        // }

        return res.json(new SingleResponse(null, serviceRes.message));
    } catch (error) {
        return next(error);
    }
};

const exportPDF = async (req, res, next) => {
    try {
        const serviceRes = await orderService.exportPDF(Object.assign({}, req.body, req.params));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const createOrderNo = async (req, res, next) => {
    try {
        const serviceRes = await orderService.createOrderNo();
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

// lay don hang de lap phieu tu
const getDetailOrderForReceiveslip = async (req, res, next) => {
    try {
        const orderId = req.params.order_id;
        const serviceRes = await orderService.getDetailOrderForReceiveslip(Object.assign({}, req.query, {orderId}));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getListPromotion = async (req, res, next) => {
    try {
        const serviceRes = await orderService.getListPromotion(Object.assign(req.body, req.query));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

// Lấy danh sách sản phẩm trong kho
const getListProductByStore = async (req, res, next) => {
    try {
        const serviceRes = await orderService.getListProductByStore(Object.assign({}, req.params, req.query));

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        const {data, total, page, limit} = serviceRes.getData();

        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        console.log(error);
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getOptionUser = async (req, res, next) => {
    try {
        const serviceRes = await orderService.getOptionUser({auth_name: req.body.auth_name, ...req.query});
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

// Lay danh sach tai khoan cua ngan hang
const getBankAccountOptions = async (req, res, next) => {
    try {
        let serviceRes = await orderService.getBankAccountOptions(Object.assign({}, req.params, req.body));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

// Lay danh sach tai khoan cua ngan hang
const getListStoreByUser = async (req, res, next) => {
    try {
        let serviceRes = await orderService.getListStoreByUser(Object.assign({}, req.query, req.body, req.auth));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

// Ds loai don hang
const getOrderTypeOptions = async (req, res, next) => {
    try {
        let serviceRes = await orderService.getOrderTypeOptions(Object.assign(req.body, req.auth));

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getDetailProductByImei = async (req, res, next) => {
    try {
        let serviceRes = await orderService.getDetailProductByImei(Object.assign({}, req.body, req.query));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getShiftInfo = async (req, res, next) => {
    try {
        let serviceRes = await orderService.getShiftInfo(Object.assign({}, req.body, req.query));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const paymentOrder = async (req, res, next) => {
    try {
        req.body.order_id = req.params.orderId;
        const serviceRes = await orderService.paymentOrder(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), serviceRes.message));
    } catch (error) {
        return next(error);
    }
};

const getCoupon = async (req, res, next) => {
    try {
        let serviceRes = await orderService.getCoupon(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData(), serviceRes.message));
    } catch (error) {
        return next(error);
    }
};

const getExchangePoint = async (req, res, next) => {
    try {
        let serviceRes = await orderService.getExchangePoint(Object.assign({}, req.body, req.query));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData(), serviceRes.message));
    } catch (error) {
        return next(error);
    }
};

const updateSignature = async (req, res, next) => {
    try {
        const orderId = req.params.orderId;
        req.query.order_id = orderId;
        const serviceResDetail = await orderService.detailOrder(orderId);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }

        let serviceRes = await orderService.updateSignature(Object.assign({}, req.body, req.query));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData(), serviceRes.message));
    } catch (error) {
        return next(error);
    }
};

const sendMultipleMessage_V4_post_json = async (req, res, next) => {
    try {
        const serviceRes = await orderService.sendMultipleMessage_V4_post_json(req.body);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const updateOrderStatus = async (req, res, next) => {
    try {
        const orderId = req.params.order_id;
        req.body.order_id = orderId;
        const serviceRes = await orderService.updateOrderStatus(req.body);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData(), serviceRes.message));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const checkReceiveSlip = async (req, res, next) => {
    try {
        const serviceRes = await orderService.checkReceiveSlip(Object.assign(req.body, req.query));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), serviceRes.message));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const paymentOrderPos = async (req, res, next) => {
    try {
        const serviceRes = await orderService.paymentOrderPos(Object.assign(req.body, req.query));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), serviceRes.message));
    } catch (error) {
        return next(error);
    }
};

const exportPreOrderPdf = async (req, res, next) => {
    try {
        const serviceRes = await orderService.exportPreOrderPdf(Object.assign(req.query, req.body));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getPreOrderCoupon = async (req, res, next) => {
    try {
        const serviceRes = await orderService.getPreOrderCoupon(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const checkOrderExistFromPreOrder = async (req, res, next) => {
    try {
        const serviceRes = await orderService.checkOrderExistFromPreOrder(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getListOrder,
    getOrderStatusOptions,
    detailOrder,
    createOrder,
    deleteOrder,
    exportPDF,
    createOrderNo,
    updateOrder,
    cancelOrder,
    getDetailOrderByOrderNo,
    getDetailOrderForReceiveslip,
    getListPromotion,
    getListProductByStore,
    getOptionUser,
    getBankAccountOptions,
    getListStoreByUser,
    getOrderTypeOptions,
    getDetailProductByImei,
    getShiftInfo,
    paymentOrder,
    getCoupon,
    getExchangePoint,
    updateSignature,
    sendMultipleMessage_V4_post_json,
    updateOrderStatus,
    checkReceiveSlip,
    paymentOrderPos,
    exportPreOrderPdf,
    getPreOrderCoupon,
    checkOrderExistFromPreOrder,
};
