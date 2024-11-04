const orderService = require('./order.service');
const SingleResponse = require('../../common/responses/single.response');
const ErrorResponse = require('../../common/responses/error.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const { notification } = require('../../common/services/bullmq.service');
const NOTIFY_CONST = require('../../common/const/notify.const');
const moment = require('moment');
const httpStatus = require('http-status');
// const { createStocksoutRequestByOrderID } = require('../stocks-out-request/stocks-out-request.service.js');
const { sendZNSByCusOrderData } = require('../zalo-oa/zalo-oa.service');
const { sendMultipleMessage_V4_post_json } = require('../../common/services/sms.service');
const { compliedTemplate, sendOneMail } = require('./utils');
const { default: axios } = require('axios');
const config = require('../../../config/config');

const getListOrder = async (req, res, next) => {
    try {
        req.query.user_id = req.auth.user_id;
        req.query.user_name = req.auth.user_name;
        const serviceRes = await orderService.getListOrder(req.query, req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit, dataCalPrices } = serviceRes.getData();

        return res.json(new ListResponse(data, total, page, limit, dataCalPrices));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * Get detail
 */
const detailOrder = async (req, res, next) => {
    try {
        const { is_out_stocks = 0, view_detail = 0 } = req.query;
        const serviceRes = await orderService.detailOrder(req.params.orderId, null, is_out_stocks, null, view_detail);
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
        const { is_out_stocks = 0, order_id = null, stocks_id = null } = req.query;
        const serviceRes = await orderService.detailOrderByOrderNo(
            order_id,
            req.params.order_no,
            is_out_stocks,
            stocks_id,
        );
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const PAYMENT_STATUS = {
    UNPAID: 0,
    PAID: 1,
    PARTIALLY_PAID: 2,
};

/**
 * Create
 */
const createOrder = async (req, res, next) => {
    try {
        req.body.order_id = null;
        const serviceRes = await orderService.createOrUpdateOrder(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        // const { orderId, paymentStatus } = serviceRes.getData();
        // push notify
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

        //xuất kho tự động ở trigger
        // néu đã thanh toán thì tạo yêu cầu xuất kho
        // if (paymentStatus === PAYMENT_STATUS.PAID) {
        //     const stocksOutRes = await createStocksoutRequestByOrderID({ ...req.body, order_id: orderId });

        //     if (stocksOutRes.isFailed()) {
        //         return next(stocksOutRes);
        //     }

        //     return res.json(
        //         new SingleResponse({
        //             ...serviceRes.getData(),
        //             message: 'Đơn hàng đã được tạo, thanh toán và xuất kho thành công',
        //         }),
        //     );
        // }

        return res.json(
            new SingleResponse(
                { ...serviceRes.getData(), message: serviceRes.getMessage() },
                RESPONSE_MSG.ORDER.CREATE_SUCCESS,
            ),
        );
    } catch (error) {
        return next(error);
    }
};

/**
 * Update
 */
const updateOrder = async (req, res, next) => {
    try {
        req.body.order_id = req.params.orderId;

        const serviceRes = await orderService.createOrUpdateOrder(req.body);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        // const { orderId, paymentStatus } = serviceRes.getData();

        //xuất kho tự động ở trigger
        // néu đã thanh toán thì tạo yêu cầu xuất kho
        // if (paymentStatus === PAYMENT_STATUS.PAID) {
        //     const stocksOutRes = await createStocksoutRequestByOrderID({ ...req.body, order_id: orderId });

        //     if (stocksOutRes.isFailed()) {
        //         return next(stocksOutRes);
        //     }

        //     return res.json(
        //         new SingleResponse({ ...serviceRes.getData(), message: 'Đơn hàng thanh toán và xuất kho thành công' }),
        //     );
        // }

        return res.json(
            new SingleResponse(
                { ...serviceRes.getData(), message: serviceRes.getMessage() },
                RESPONSE_MSG.ORDER.UPDATE_SUCCESS,
            ),
        );
    } catch (error) {
        return next(error);
    }
};

/**
 * checkOrderStatusToNotify
 */
const checkOrderStatusToNotify = async (req, res, next) => {
    try {
        // Notify when order status change
        // const orderStatusSendRes = await orderService.checkSendSmsOrZaloOA({
        //     order_id: req.body.order_id,
        //     order_status_id: req.body.order_status_id,
        //     order_type_id: req.body.order_type_id,
        // });
        // const orderStatusSendData = orderStatusSendRes.getData();
        // const dataSend = orderStatusSendData?.dataSend || {};

        // await notifyWhenOrderStatusChange({ orderStatusSendData, dataSend });

        return res.json(new SingleResponse(null, 'Service no longer supported'));
    } catch (error) {
        return next(error);
    }
};

const notifyWhenOrderStatusChange = async ({ orderStatusSendData, dataSend }) => {
    console.log('~ notifyWhenOrderStatusChange orderStatusSendData >>>', orderStatusSendData);
    console.log('~ notifyWhenOrderStatusChange dataSend >>>', dataSend);
    // Ưu tiên gửi zalo, nếu trạng thái không gửi zalo thì mới gửi sms
    //   if (orderStatusSendData?.is_send_sms && !orderStatusSendData?.is_send_zalo_oa) {
    //     const sms_content_complied = compliedTemplate(orderStatusSendData.content_sms || '', dataSend, 'SMS');
    //     await sendMultipleMessage_V4_post_json({
    //       phone: dataSend.phone_number,
    //       content: sms_content_complied,
    //       brandname: 'SHOPDUNK',
    //       sandbox: 0
    //     })
    // }

    // // Gửi tin nhắn zalo
    // if (orderStatusSendData?.is_send_zalo_oa) {
    //     const resZalo = await sendZNSByCusOrderData({
    //         phone: dataSend.phone_number,
    //         template_id: orderStatusSendData?.oa_template_id,
    //         sendData: dataSend,
    //     });

    //     // Gửi tin nhắn zalo thất bại, chuyển sang gửi sms
    //     if (resZalo.isFailed()) {
    //         const sms_content_complied = compliedTemplate(orderStatusSendData.content_sms || '', dataSend, 'SMS');
    //         await sendMultipleMessage_V4_post_json({
    //             phone: dataSend.phone_number,
    //             content: sms_content_complied,
    //             brandname: 'SHOPDUNK',
    //             sandbox: 0,
    //         });
    //     }
    // }

    // // Gửi email trạng thái có thì gửi luôn
    // if (orderStatusSendData?.is_send_email && dataSend?.email) {
    //   let template = orderStatusSendData?.email_template_html || '';
    //   template = template.replace(/{{/g, '<%= ').replace(/}}/g, ' %>');

    //   const compliedEmailContent = compliedTemplate(template, { ...dataSend, pre_order_id: 1 }, 'EMAIL');
    //   await sendOneMail({
    //     from_email: orderStatusSendData?.mail_from || 'shopdunk@nondev.tech',
    //     mail_to: dataSend?.email,
    //     from_name: orderStatusSendData?.mail_from_name || 'Shopdunk',
    //     mail_subject: orderStatusSendData?.mail_subject || 'Shopdunk',
    //     mail_reply: orderStatusSendData?.mail_reply || 'shopdunk@nondev.tech',
    //     email_content: compliedEmailContent,
    //   });
    // }
};

/**
 * Delete
 */
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
        // push notify
        if (orderId) {
            const { order_no } = serviceResDetail.getData();
            notification.add({
                type: 'create_notification',
                source_type: NOTIFY_CONST.ORDER_CANCELLED,
                params: {
                    order_no,
                    source_id: orderId,
                    created_user: req.auth.full_name,
                    cancelled_date: moment().format('hh:mm A'),
                },
                users: [req.body.auth_name],
            });
        }

        return res.json(new SingleResponse(null, RESPONSE_MSG.ORDER.CANCEL_SUCCESS));
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
        const serviceRes = await orderService.getDetailOrderForReceiveslip(Object.assign({}, req.query, { orderId }));
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
        const serviceRes = await orderService.getListPromotion(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getCoupon = async (req, res, next) => {
    try {
        const serviceRes = await orderService.getCoupon(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

// Lấy danh sách sản phẩm trong kho
const getListProductInStock = async (req, res, next) => {
    try {
        const serviceRes = await orderService.getListProductInStock(Object.assign({}, req.params, req.query));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        // console.log(error);
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const exportExcel = async (req, res, next) => {
    try {
        const serviceRes = await orderService.exportExcel(req.query);
        const wb = serviceRes.getData();
        wb.write('DON_HANG.xlsx', res);
    } catch (error) {
        return next(error);
    }
};

const getOptionUser = async (req, res, next) => {
    try {
        const serviceRes = await orderService.getOptionUser({ auth_name: req.body.auth_name, ...req.query });
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

const getProduct = async (req, res, next) => {
    try {
        const serviceRes = await orderService.getProduct(req.query, req.body);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        const { data, total, page, limit } = serviceRes.getData();

        if (data && data.length > 0) {
            return res.json(new ListResponse(data, total, page, limit));
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

const getListOrderType = async (req, res, next) => {
    try {
        const serviceRes = await orderService.getListOrderType(req.query, req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), serviceRes.message));
    } catch (error) {
        return next(error);
    }
};

const cashPayment = async (req, res, next) => {
    try {
        const serviceRes = await orderService.cashPayment(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        //xuất kho tự động ở trigger
        // const { orderId, paymentStatus } = serviceRes.getData();

        // if (paymentStatus === PAYMENT_STATUS.PAID) {
        //     const stocksOutRes = await createStocksoutRequestByOrderID({ ...req.body, order_id: orderId });

        //     if (stocksOutRes.isFailed()) {
        //         return next(stocksOutRes);
        //     }

        //     return res.json(new SingleResponse(serviceRes.getData(), 'Đơn hàng đã thanh toán và xuất kho thành công'));
        // }

        return res.json(new SingleResponse(serviceRes.getData(), 'Đơn hàng đã thanh toán thành công'));
    } catch (error) {
        return next(error);
    }
};

const getPaymentHistory = async (req, res, next) => {
    try {
        const serviceRes = await orderService.getPaymentHistory(req.params.order_id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), serviceRes.message));
    } catch (error) {
        return next(error);
    }
};

const getListMaterial = async (req, res, next) => {
    try {
        const serviceRes = await orderService.getListMaterial(req.query, req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

const getListCustomer = async (req, res, next) => {
    try {
        const serviceRes = await orderService.getListCustomer(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();

        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const exportPreOrderPdf = async (req, res, next) => {
    try {
        const serviceRes = await orderService.exportPreOrderPdf(req.params);
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

const getProductReport = async (req, res, next) => {
    try {
        const serviceRes = await orderService.getProductReport({ ...req.query, ...req.body });
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getReportChart = async (req, res, next) => {
    try {
        const serviceRes = await orderService.getReportChart({ ...req.query, ...req.body });
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const countByCustomer = async (req, res, next) => {
    try {
        const serviceRes = await orderService.countByCustomer(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getBusinessInfo = async (req, res, next) => {
    try {
        const serviceRes = await orderService.getBusinessInfo(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const updateInstallmentOrder = async (req, res, next) => {
    try {
        const serviceRes = await orderService.updateOrderInstallmentStatus(Object.assign(req.query, req.body));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getPaymentPolicy = async (req, res, next) => {
    try {
        const serviceRes = await orderService.getPaymentPolicy(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), serviceRes.message));
    } catch (error) {
        return next(error);
    }
};

const ExportExcelOrder = async (req, res, next) => {
    try {
        const serviceRes = await orderService.exportExcelOrder();
        if (serviceRes.isFailed()) {
            return next(
                new ErrorResponse(httpStatus.NOT_IMPLEMENTED, serviceRes.getErrors(), 'Xuất file không thành công.'),
            );
        }
        const wb = serviceRes.getData();
        wb.write('DS_Don_Hang.xlsx', res);
    } catch (error) {
        return next(error);
    }
};

const updateInvoiceLink = async (req, res, next) => {
    try {
        const serviceRes = await orderService.updateInvoiceLink(Object.assign(req.params, req.body));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getListStoreBySale = async (req, res, next) => {
    try {
        let serviceRes = await orderService.getListStoreBySale(Object.assign({}, req.query));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getUserReviewOptions = async (req, res, next) => {
    try {
        const serviceRes = await orderService.getUserReviewOptions(req.query);
        if (serviceRes.isFailed()) return next(serviceRes)
        return res.json(new SingleResponse(serviceRes.getData(), serviceRes.getMessage()));
    } catch (error) {
        return next(error);
    }
};

const createOderReview = async (req, res, next) => {
    try {
        const serviceRes = await orderService.createOderReview({
            ...req.body?.params,
            auth: req.auth,
        });
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        axios({
            method: 'post',
            url: `${config.domain_service}/order/review-user`,
            data: {
                ...req.body?.params,
                auth: req.auth,
            },
            headers: { Authorization: `APIKEY ${config.service_apikey}` },
        })
            .then((response) => {})
            .catch((error) => {})
            .finally(() => {});

        return res.json(new SingleResponse(serviceRes.getData(), serviceRes.getMessage()));
    } catch (error) {
        return next(error);
    }
};

const getListImageOrderReview = async (req, res, next) => {
    try {
        const serviceRes = await orderService.getListImageOrderReview(req.query);
        if (serviceRes.isFailed()) return next(serviceRes)
        return res.json(new SingleResponse(serviceRes.getData(), serviceRes.getMessage()));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getListOrder,
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
    getCoupon,
    getListProductInStock,
    exportExcel,
    getOptionUser,
    getBankAccountOptions,
    getListStoreByUser,
    getProduct,
    paymentOrder,
    getListOrderType,
    cashPayment,
    getPaymentHistory,
    getListMaterial,
    getListCustomer,
    checkOrderStatusToNotify,
    exportPreOrderPdf,
    getPreOrderCoupon,
    getProductReport,
    getReportChart,
    countByCustomer,
    getBusinessInfo,
    updateInstallmentOrder,
    getPaymentPolicy,
    ExportExcelOrder,
    updateInvoiceLink,
    getListStoreBySale,
    getUserReviewOptions,
    createOderReview,
    getListImageOrderReview,
};
