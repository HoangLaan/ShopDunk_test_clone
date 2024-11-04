const orderClass = require('./order.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const fileHelper = require('../../common/helpers/file.helper');
const config = require('../../../config/config');
const pdfHelper = require('../../common/helpers/pdf.helper');
const moment = require('moment');
const folderName = 'signature';
const { uniqBy } = require('lodash');
const stocksOutRequestClass = require('../stocks-out-request/stocks-out-request.class');
const httpClient = require('./utils/httpClient');
const { handleCheckValueArrayAndToString } = require('./utils/utils');
const qrHelper = require('../../common/helpers/qr.helper');
const appRoot = require('app-root-path');
const ejs = require('ejs');
const { paymentType } = require('./utils/constants');
const { formatCurrency } = require('../../common/helpers/numberFormat');
const { calculatePoint } = require('../cumulate-point-type/cumulate-point-type.service');

const {
    checkJsonByArrayKey,
    checkArray,
    getArrValueByIf,
    getValueInArrayInArray,
    getValueAndConcatInArrayByField,
} = require('./utils/utils');
// const { push: publisMessage } = require('../../common/helpers/mqtt.helper');

const getListOrder = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getSearch(queryParams);
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('KEYWORD', keyword)
            .input('ORDERSTATUSIDS', apiHelper.getValueFromObject(queryParams, 'order_status_ids', null))
            .input('ORDERTYPEIDS', apiHelper.getValueFromObject(queryParams, 'order_type_ids', null))
            .input('ISCANCEL', apiHelper.getValueFromObject(queryParams, 'is_cancel', null))
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'created_date_from', null))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'created_date_to', null))
            .input('TYPESEARCH', apiHelper.getValueFromObject(queryParams, 'type_search', null))
            .execute('SL_ORDER_GetList_App');

        let orders = orderClass.list(data.recordset);
        const totalItem = data.recordset && data.recordset.length ? data.recordset[0].TOTAL : 0;

        const orderProducts = orderClass.products(data.recordsets[1]);

        orders = (orders || []).map(order => {
            const products = (orderProducts || []).filter(p => p.order_id == order.order_id);
            return {
                ...order,
                order_products: products,
            };
        });

        return new ServiceResponse(true, '', {
            data: orders,
            page: currentPage,
            limit: itemsPerPage,
            total: totalItem,
        });
    } catch (e) {
        console.log(e);
        logger.error(e, { function: 'orderService.getListOrder' });
        return new ServiceResponse(true, '', {});
    }
};

const getOrderStatusOptions = async bodyParams => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('TYPESTATUS', apiHelper.getValueFromObject(bodyParams, 'type_status')) //1: Lấy tất cả , 2: Lấy theo từng loại đơn hàng
            .input('ORDERTYPEID', apiHelper.getValueFromObject(bodyParams, 'order_type_id'))
            .execute('SL_ORDERSTATUS_GetOption_App');
        const orderStatus = orderClass.options(data.recordset);
        return new ServiceResponse(true, '', orderStatus);
    } catch (e) {
        logger.error(e, { function: 'orderService.getOrderStatusOptions' });
        return new ServiceResponse(false, RESPONSE_MSG.ERROR_OCCURED);
    }
};

const detailOrderByOrderNo = async (orderId, orderNo, is_out_stocks = 0, stocks_id = null) => {
    try {
        const pool = await mssql.pool;
        // kiem tra neu k co orderId ma co orderNo thi se lay orderId tu orderNo
        if (!orderId && orderNo) {
            const orderNoReq = await pool
                .request()
                .input('ORDERNO', orderNo)
                .execute(PROCEDURE_NAME.SL_ORDER_GETIDBYORDERNO_ADMINWEB);
            if (orderNoReq.recordset.length) {
                orderId = orderNoReq.recordset[0].ORDERID;
            }
        }
        // order
        const data = await pool
            .request()
            .input('ORDERID', orderId)
            .input('ISOUTSTOCKS', is_out_stocks)
            .input('STOCKSID', stocks_id)
            .execute(PROCEDURE_NAME.SL_ORDER_GETBYID_ADMINWEB);
        if (!data.recordset || !data.recordset.length) {
            return new ServiceResponse(false, 'Dơn hàng không tồn tại.');
        }
        let order = orderClass.detail(data.recordset[0]);
        order.is_valid_order = data.recordsets[1][0].ISVALIDORDER;
        // detail order
        const productReq = await pool
            .request()
            .input('ORDERID', orderId)
            .input('ISOUTSTOCKS', is_out_stocks)
            .input('STOCKSID', stocks_id)
            .execute('SL_ORDERDETAIL_GetByIdForSTORQ_App');

        let products = orderClass.product(productReq.recordset);

        order.items = [];
        let total_quantity = 0;
        for (let i = 0; i < products.length; i++) {
            let {
                unit_name,
                total_quantity,
                output_type_name,
                output_type_id,
                product_unit_id,
                area_name,
                area_id,
                business_name,
                business_id,
                quantity,
                product_id,
            } = products[i];
            total_quantity += 1 * quantity;
            // Nếu >= tồn tại thì thêm danh sách product imei . nếu không có thì push cái hiện tại vào
            // Tính toán các thông số cần thiết trên product đó
            const optReq = await pool
                .request()
                .input('PRODUCTID', product_id)
                .execute(PROCEDURE_NAME.SL_ORDER_GETLISTUNITSUBUNIT_ADMINWEB);
            const inititalReq = await getProductInit({ product_id });
            if (inititalReq.isSuccess()) {
                const { business = [], area = [], unit = [], output_type = [] } = inititalReq.getData();
                products[i].product_business = business.map(bus => ({
                    ...bus,
                    ...{ value: bus.id, label: bus.name },
                }));
                products[i].product_area = area.map(area => ({
                    ...area,
                    ...{ value: area.id, label: area.name },
                }));
                products[i].product_output_type = output_type.map(outputtype => ({
                    ...outputtype,
                    ...{ value: outputtype.id, label: outputtype.name },
                }));
                products[i].product_unit = unit.map(u => ({
                    ...u,
                    ...{ value: u.id, label: u.name },
                }));
            }

            // kiem tra neu k co du lieu lam gia thi set default cac gia tri truoc do
            // co so lam gia
            if (!products[i].product_business || !products[i].product_business.length) {
                products[i].product_business = [
                    {
                        value: business_id,
                        label: business_name,
                        business_id,
                        business_name,
                    },
                ];
            }
            // khu vuc lam gia
            if (!products[i].product_area || !products[i].product_area.length) {
                products[i].product_area = [{ value: area_id, label: area_name, area_id, area_name }];
            }
            // don vi tinh
            if (!products[i].product_unit || !products[i].product_unit.length) {
                products[i].product_unit = [
                    {
                        value: product_unit_id,
                        label: unit_name,
                        unit_id: product_unit_id,
                        unit_name,
                    },
                ];
            }
            // hinh thuc xuat
            if (!products[i].product_output_type || !products[i].product_output_type.length) {
                products[i].product_output_type = [
                    {
                        value: output_type_id,
                        label: output_type_name,
                        output_type_id,
                        output_type_name,
                    },
                ];
            }

            products[i] = {
                ...products[i],
                ...{
                    product_unit: orderClass.listUnitOpts(optReq.recordset),
                    product_unit_name: unit_name,
                    max_total_quantity: total_quantity,
                    product_output_type_name: output_type_name,
                    product_output_type_id: output_type_id,
                },
            };
        }
        order.total_quantity = total_quantity;
        order.customer = `${order.customer_id}|${order.customer_code}`;
        order.stock = `${order.stocks_id}-${order.is_stocks}`;
        order.items = products;
        return new ServiceResponse(true, '', order);
    } catch (e) {
        logger.error(e, { function: 'orderService.getListOrder' });
        return new ServiceResponse(false, e.message);
    }
};

const checkOrderExist = async orderId => {
    try {
        const pool = await mssql.pool;

        const dataCheck = await pool.request().input('ORDERID', orderId).execute('SL_ORDER_checkExistsOrder_App');

        if (dataCheck.recordset && dataCheck.recordset[0].RESULT == 0) {
            return new ServiceResponse(false, 'Order not exists');
        }

        return new ServiceResponse(true, '');
    } catch (e) {
        logger.error(e, { function: 'orderService.createReasonCancel' });
        return new ServiceResponse(false, 'Order not exists');
    }
};

const detailOrder = async (orderId, orderNo) => {
    try {
        const pool = await mssql.pool;
        // kiem tra neu k co orderId ma co orderNo thi se lay orderId tu orderNo
        if (!orderId && orderNo) {
            const orderNoReq = await pool.request().input('ORDERNO', orderNo).execute('SL_ORDER_GETIDBYORDERNO_App');
            if (orderNoReq.recordset.length) {
                orderId = orderNoReq.recordset[0].ORDERID;
            }
        }

        // order
        const data = await pool.request().input('ORDERID', orderId).execute('SL_ORDER_GetById_App');
        if (!data.recordset || !data.recordset.length) {
            return new ServiceResponse(false, 'Đơn hàng không tồn tại hoặc số đơn hàng truyền vào không hợp lệ !');
        }
        let order = orderClass.detail(data.recordset[0]);
        let order_receive_slip = orderClass.orderReceiveSlip(data.recordsets[1]);

        const productReq = await pool.request().input('ORDERID', orderId).execute('SL_ORDERDETAIL_GetById_App');
        let products = orderClass.product(productReq.recordset);

        //Lấy tổng hình thức thanh toán của đơn hàng
        order.data_payment_total = [
            {
                payment_name: 'Thanh toán tiền mặt',
                payment_value: order.cash || 0,
                payment_type: 1,
            },
            {
                payment_name: 'Thanh toán ngân hàng',
                payment_value: order.bank || 0,
                payment_type: 2,
            },
            {
                payment_name: 'Thanh toán đổi tác',
                payment_value: order.transfer || 0,
                payment_type: 3,
            },
            {
                payment_name: 'Thanh toán máy pos',
                payment_value: order.pos || 0,
                payment_type: 4,
            },
        ];

        order.coupon_list = orderClass.detaiCoupon(data.recordsets[2]) ?? [];
        let total_discount = 0;
        if (order && order?.coupon_code && order?.discount_money) {
            let jsonCoupon = {
                coupon_code: order?.coupon_code,
                total_discount: order?.discount_money,
                type: 2,
            };
            order.coupon_list.push(jsonCoupon);

            const discountMoney = order?.discount_money;
            if (discountMoney && discountMoney > 0) {
                let parInDiscount = parseInt(discountMoney) ?? 0;
                total_discount += parInDiscount;
            }
        }
        if (order.coupon_list && order.coupon_list?.length > 0) {
            for (let i = 0; i < order.coupon_list?.length; i++) {
                if (order.coupon_list[i].total_discount) {
                    const checkNumber = parseInt(order.coupon_list[i].total_discount) ?? 0;
                    total_discount += checkNumber;
                }
            }
        }

        // Lấy khuyến mãi đã áp dụng cho đơn hàng
        order.promotion_apply = (await getListPromotionApplied(orderId)).getData();
        const getDiscountPromotion = getValueInArrayInArray(order.promotion_apply, 'offers', 'discount', 0);
        total_discount = parseInt(total_discount) ?? 0;
        total_discount = total_discount + getDiscountPromotion;
        order.total_discount = total_discount;
        order.products = products;
        order.order_receive_slip = order_receive_slip;

        return new ServiceResponse(true, '', order);
    } catch (e) {
        logger.error(e, { function: 'orderService.detailOrder' });
        return new ServiceResponse(false, e.message);
    }
};

const createOrUpdateOrder = async bodyParams => {
    const pool = await mssql.pool;

    let products = apiHelper.getValueFromObject(bodyParams, 'products');
    let member_id = apiHelper.getValueFromObject(bodyParams, 'member_id');
    let promotions = apiHelper.getValueFromObject(bodyParams, 'promotions', []);
    const order_type = apiHelper.getValueFromObject(bodyParams, 'order_type');
    const acpoint_id = apiHelper.getValueFromObject(bodyParams, 'acpoint_id');
    const total_money = apiHelper.getValueFromObject(bodyParams, 'total_money', 0);
    let accumulate_point = 0;

    // calculate accumulate point
    if (acpoint_id && acpoint_id > 0) {
        const resData = await calculatePoint({ acpoint_id, total_money }, pool);
        if (resData.isSuccess()) {
            const { customer_point } = resData.getData();
            accumulate_point = customer_point ?? 0;
        }
    }
    const transaction = await new sql.Transaction(pool);
    await transaction.begin();
    try {
        const order_id = apiHelper.getValueFromObject(bodyParams, 'order_id');

        const requestCreateOrUpdateOrder = new sql.Request(transaction);
        const data = await requestCreateOrUpdateOrder
            .input('ORDERID', apiHelper.getValueFromObject(bodyParams, 'order_id'))
            .input('ORDERNO', apiHelper.getValueFromObject(bodyParams, 'order_no')?.trim())
            .input('ORDERTYPEID', apiHelper.getValueFromObject(bodyParams, 'order_type_id'))
            .input('MEMBERID', member_id)
            .input('MEMBERTYPE', apiHelper.getValueFromObject(bodyParams, 'member_type'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .input('STOREID', apiHelper.getValueFromObject(bodyParams, 'store_id'))
            .input('BUSINESSID', apiHelper.getValueFromObject(bodyParams, 'business_id'))
            .input('ORDERSOURCE', 2) // Đơn hàng từ App
            .input('PAYMENTSTATUS', 0)
            .input('FULLNAMERECEIVE', apiHelper.getValueFromObject(bodyParams, 'full_name_receive'))
            .input('PHONENUMBERRECEIVE', apiHelper.getValueFromObject(bodyParams, 'phone_number_receive'))
            .input('RECEIVINGDATE', apiHelper.getValueFromObject(bodyParams, 'receiving_date'))
            .input('OUTPUTTYPEID', apiHelper.getValueFromObject(bodyParams, 'output_type_id'))
            .input('ORDERSTATUSID', apiHelper.getValueFromObject(bodyParams, 'order_status_id'))

            //Tư vấn điểm thưởng
            .input('ISADVISEBONUSPOINT', apiHelper.getValueFromObject(bodyParams, 'is_advise_bonus_point'))
            .input('ISADVISENEWMEMBER', apiHelper.getValueFromObject(bodyParams, 'is_advise_new_member'))
            .input('ISADVISEPROMOTION', apiHelper.getValueFromObject(bodyParams, 'is_advise_promotion'))
            .input('ISADVISEACCESSORY', apiHelper.getValueFromObject(bodyParams, 'is_advise_accessory'))
            .input('ISADVISEUSERPOINT', apiHelper.getValueFromObject(bodyParams, 'is_advise_use_point'))

            //Giữ liệu thanh toán
            .input('TOTALMONEY', total_money) //  Tổng tiền có VAT
            .input('TOTALDISCOUNT', apiHelper.getValueFromObject(bodyParams, 'total_discount')) //Tổng tiền giảm ( khuyến mãi + mã giảm giá)

            .input('DISCOUNTVALUE', apiHelper.getValueFromObject(bodyParams, 'discount_value')) //Tiền giảm của khuyến mãi
            .input('DISCOUNTCOUPON', apiHelper.getValueFromObject(bodyParams, 'discount_coupon')) //Tiền giảm của mã coupou
            .input('DISCOUNTPOINT', apiHelper.getValueFromObject(bodyParams, 'discount_point')) //Tiền giảm của chương trình tiêu điểm

            .input('ISPLUSPOINT', apiHelper.getValueFromObject(bodyParams, 'is_plus_point')) //Check xem có được tích điểm hay không

            .input('EXPOINTID', apiHelper.getValueFromObject(bodyParams, 'expoint_id')) //Chương trình tiêu điểm áp dụng
            .input('USEPOINT', apiHelper.getValueFromObject(bodyParams, 'use_point')) //Số diểm đã sửa dụng

            //VAT
            .input('ISINVOICE', apiHelper.getValueFromObject(bodyParams, 'is_invoice'))
            .input('INVOICEFULLNAME', apiHelper.getValueFromObject(bodyParams, 'invoice_full_name'))
            .input('INVOICETAX', apiHelper.getValueFromObject(bodyParams, 'invoice_tax'))
            .input('INVOICECOMPANYNAME', apiHelper.getValueFromObject(bodyParams, 'invoice_company_name'))
            .input('INVOICEEMAIL', apiHelper.getValueFromObject(bodyParams, 'invoice_email'))
            .input('INVOICEADDRESS', apiHelper.getValueFromObject(bodyParams, 'invoice_address'))

            .input('ACPOINTID', acpoint_id)
            .input('ACCUMULATEPOINT', accumulate_point)

            .execute('SL_ORDER_CreateOrUpdate_App');

        const orderId = data.recordset[0].RESULT;
        const orderNo = data.recordset[0].ORDERNO;

        if (orderId <= 0) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Tạo đơn hàng thất bại !');
        }

        if (order_id) {
            const requestOrderDetailDelete = new sql.Request(transaction);
            const dataOrderDetailDelete = await requestOrderDetailDelete
                .input('ORDERID', order_id)
                .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .execute('SL_ORDERDETAIL_DeleteByOrderId_App');
            const resultOrderDetailDelete = dataOrderDetailDelete.recordset[0].RESULT;
            if (resultOrderDetailDelete <= 0) {
                await transaction.rollback();
                return new ServiceResponse(false, RESPONSE_MSG.ORDER.UPDATE_FAILED);
            }

            // Xóa promotion của ORDER
            const requestPromotionOrderDelete = new sql.Request(transaction);
            const dataPromotionOrderDelete = await requestPromotionOrderDelete
                .input('ORDERID', order_id)
                .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .execute('SM_PROMOTION_ORDER_Delete_App');
            const resultPromotionOrderDelete = dataPromotionOrderDelete.recordset[0].RESULT;
            if (resultPromotionOrderDelete <= 0) {
                await transaction.rollback();
                return new ServiceResponse(false, RESPONSE_MSG.ORDER.UPDATE_FAILED);
            }

            // Xóa coupon của ORDER
            const requestCouponOrderDelete = new sql.Request(transaction);
            const dataCouponOrderDelete = await requestCouponOrderDelete
                .input('ORDERID', orderId)
                .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .execute('SM_COUPON_ORDER_Delete_App');
            const resultCouponOrderDelete = dataCouponOrderDelete.recordset[0].RESULT;
            if (resultCouponOrderDelete <= 0) {
                await transaction.rollback();
                return new ServiceResponse(false, RESPONSE_MSG.ORDER.UPDATE_FAILED);
            }

            // Xóa coupon pre order của ORDER
            const requestCouponPreOrderDelete = new sql.Request(transaction);
            const dataCouponPreOrderDelete = await requestCouponPreOrderDelete
                .input('ORDERID', order_id)
                .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .execute('SM_COUPON_PREORDER_ORDER_Delete_AdminWeb');

            //Xoá người nhận hoa hồng
            const requestCommisionOrderDelete = new sql.Request(transaction);
            const dataCommisionOrderDelete = await requestCommisionOrderDelete
                .input('ORDERID', orderId)
                .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .execute('SM_COUPON_ORDER_Delete_App');

            const resultCommisionOrderDelete = dataCommisionOrderDelete.recordset[0].RESULT;
            if (resultCommisionOrderDelete <= 0) {
                await transaction.rollback();
                return new ServiceResponse(false, RESPONSE_MSG.ORDER.UPDATE_FAILED);
            }
        }

        const requestOrderDetailCreate = new sql.Request(transaction);
        for (let i = 0; i < products.length; i++) {
            const item = products[i];

            const product_id = apiHelper.getValueFromObject(item, 'product_id', null);
            const product_name = apiHelper.getValueFromObject(item, 'product_name', null);
            const product_imei_code = apiHelper.getValueFromObject(item, 'product_imei_code', null);

            const material_id = apiHelper.getValueFromObject(item, 'material_id', null);
            const material_name = apiHelper.getValueFromObject(item, 'material_name', null);
            const material_imei_code = apiHelper.getValueFromObject(item, 'material_imei_code', null);

            const dataOrderDetailCreate = await requestOrderDetailCreate
                .input('ORDERID', orderId)
                .input('PRODUCTID', product_id)
                .input('PRODUCTIMEICODE', product_imei_code)
                .input('OUTPUTTYPEID', apiHelper.getValueFromObject(item, 'output_type_id'))
                .input('STOREID', apiHelper.getValueFromObject(bodyParams, 'store_id'))
                .input('UNITID', apiHelper.getValueFromObject(item, 'unit_id'))
                .input('QUANTITY', apiHelper.getValueFromObject(item, 'quantity'))
                .input('PRICE', 1 * apiHelper.getValueFromObject(item, 'price', null))
                .input('PRICEID', apiHelper.getValueFromObject(item, 'price_id', null))
                .input('STOCKSID', apiHelper.getValueFromObject(bodyParams, 'stock_id'))
                .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                //Materal
                .input('MATERIALID', material_id)
                .input('MATERIALIMEICODE', material_imei_code)

                .execute('SL_ORDERDETAIL_CreateOrUpdate_App');
            const { ISVALID, RESULT, ORDERNO } = dataOrderDetailCreate.recordset[0];

            const orderDetailId = RESULT;
            if (!ISVALID) {
                await transaction.rollback();

                if (ORDERNO) {
                    return new ServiceResponse(
                        false,
                        product_id
                            ? `IMEI : ${product_imei_code} - ${product_name} tồn tại ở đơn hàng ${ORDERNO}!`
                            : `IMEI : ${material_imei_code} - ${material_name} tồn tại ở đơn hàng ${ORDERNO}!`,
                        null,
                    );
                }

                return new ServiceResponse(
                    false,
                    product_id
                        ? `IMEI : ${product_imei_code} - ${product_name} đã xuất kho!`
                        : `IMEI : ${material_imei_code} - ${material_name} đã xuất kho!`,
                    null,
                );
            } else if (orderDetailId <= 0) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Lỗi thêm sản phẩm trong đơn hàng');
            }
        }

        // if (order_type != orderType.PREORDER) {
        const coupon = apiHelper.getValueFromObject(bodyParams, 'coupon_list', []);
        const checkCoupon = coupon && Array.isArray(coupon) && coupon.length > 0;
        if (checkCoupon) {
            const requestCouponCreate = new sql.Request(transaction);
            for (let i = 0; i < coupon.length; i++) {
                const item = coupon[i];
                const responseCouponCreate = await requestCouponCreate
                    .input('ORDERID', orderId)
                    .input('COUPONID', apiHelper.getValueFromObject(item, 'coupon_id', ''))
                    .input('COUPONCONDITIONID', apiHelper.getValueFromObject(item, 'coupon_condition_id', ''))
                    .input('COUPONCODE', apiHelper.getValueFromObject(item, 'coupon_code', ''))
                    .input('DISCOUNTMONEY', apiHelper.getValueFromObject(item, 'discount', 0))
                    .input('MEMBERID', apiHelper.getValueFromObject(bodyParams, 'member_id', 0))
                    .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                    .execute('SM_COUPON_ORDER_Create_App');
                if (!responseCouponCreate.recordset[0].RESULT) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Lỗi thêm mã coupon trong đơn hàng');
                }
            }
        }
        // } else {
        if (checkCoupon) {
            const getValueByTwoif = getArrValueByIf(coupon, 'coupon_id', null);
            const coupon_code = apiHelper.getValueFromObject(getValueByTwoif, 'coupon_code', '');
            if (coupon_code) {
                const requestCouponCreate = new sql.Request(transaction);
                await requestCouponCreate
                    .input('ORDERID', orderId)
                    .input('COUPONCODE', coupon_code?.trim())
                    .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                    .execute('SL_PREORDER_ApplyCoupon_AdminWeb');
            }
        }
        // }

        // Luu gia khuyen mai ap dung
        // if (order_type != orderType.PREORDER) {
        if (promotions && promotions.length) {
            for (let i = 0; i < promotions.length; i++) {
                let { offers = [] } = promotions[i];
                if (offers.length) {
                    for (let j = 0; j < offers.length; j++) {
                        let { gifts_apply = [] } = offers[j];
                        if (gifts_apply.length) {
                            for (let k = 0; k < gifts_apply.length; k++) {
                                const requestOrderDetailCreate = new sql.Request(transaction);
                                const dataOrderDetailCreate = await requestOrderDetailCreate
                                    .input('ORDERID', orderId)
                                    .input('PRODUCTID', apiHelper.getValueFromObject(gifts_apply[k], 'product_id'))
                                    .input(
                                        'PRODUCTIMEICODE',
                                        apiHelper.getValueFromObject(gifts_apply[k], 'product_imei_code'),
                                    )
                                    .input('STOREID', apiHelper.getValueFromObject(bodyParams, 'store_id'))
                                    .input('PRICE', 0)
                                    .input('QUANTITY', 1)
                                    .input('PRICEID', null)
                                    .input('STOCKSID', apiHelper.getValueFromObject(bodyParams, 'stock_id'))
                                    .input('DISCOUNTVALUE', 0)
                                    .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                                    .input('ISPROMOTIONGIFT', 1) // Là quà tặng
                                    .execute('SL_ORDERDETAIL_CreateOrUpdate_App');
                                const { ISVALID, RESULT: orderDetailId, ORDERNO } = dataOrderDetailCreate.recordset[0];
                                if (!ISVALID) {
                                    await transaction.rollback();

                                    if (ORDERNO) {
                                        return new ServiceResponse(
                                            false,
                                            `IMEI : ${apiHelper.getValueFromObject(
                                                gifts_apply[k],
                                                'product_imei_code',
                                            )} - ${apiHelper.getValueFromObject(
                                                gifts_apply[k],
                                                'product_name',
                                            )} tồn tại ở đơn hàng ${ORDERNO}!`,
                                            null,
                                        );
                                    }

                                    return new ServiceResponse(
                                        false,
                                        `IMEI : ${apiHelper.getValueFromObject(
                                            gifts_apply[k],
                                            'product_imei_code',
                                        )} - ${apiHelper.getValueFromObject(
                                            gifts_apply[k],
                                            'product_name',
                                        )} đã xuất kho!`,
                                        null,
                                    );
                                } else if (orderDetailId <= 0) {
                                    await transaction.rollback();
                                    return new ServiceResponse(false, 'Lỗi thêm sản phẩm quà tặng trong đơn hàng !');
                                }

                                const requestPromotionCreate = new sql.Request(transaction);
                                const dataPromotionCreate = await requestPromotionCreate
                                    .input('ORDERID', orderId)
                                    .input('PRODUCTID', apiHelper.getValueFromObject(gifts_apply[k], 'product_id'))
                                    .input('PROMOTIONID', apiHelper.getValueFromObject(offers[j], 'promotion_id'))
                                    .input(
                                        'PROMOTIONOFFERAPPLYID',
                                        apiHelper.getValueFromObject(offers[j], 'promotion_offer_id'),
                                    )
                                    .input('QUANTITY', 1)
                                    .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                                    .input('ORDERDETAILID', orderDetailId)
                                    .execute('SM_PROMOTION_ORDER_CreateOrUpdate_App');
                                const { RESULT } = dataPromotionCreate.recordset[0];
                                if (!RESULT) {
                                    await transaction.rollback();
                                    return new ServiceResponse(false, 'Thêm mới khuyến mãi thất bại.');
                                }
                            }
                        } else {
                            const requestPromotionCreate = new sql.Request(transaction);
                            const dataPromotionCreate = await requestPromotionCreate
                                .input('ORDERID', orderId)
                                .input('PROMOTIONID', apiHelper.getValueFromObject(offers[j], 'promotion_id'))
                                .input(
                                    'PROMOTIONOFFERAPPLYID',
                                    apiHelper.getValueFromObject(offers[j], 'promotion_offer_id'),
                                )
                                .input('DISCOUNTVALUE', apiHelper.getValueFromObject(offers[j], 'discount', 0))
                                .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                                .execute('SM_PROMOTION_ORDER_CreateOrUpdate_App');
                            const { RESULT } = dataPromotionCreate.recordset[0];
                            if (!RESULT) {
                                await transaction.rollback();
                                return new ServiceResponse(false, 'Thêm mới khuyến mãi thất bại.');
                            }
                        }
                    }
                }
            }
        }
        // }

        await transaction.commit();
        return new ServiceResponse(true, orderId ? 'Cập nhật thành công' : 'Thêm mới thành công', { orderId, orderNo });
    } catch (e) {
        logger.error(e, { function: 'orderService.createOrUpdateOrder' });
        await transaction.rollback();
        return new ServiceResponse(false, RESPONSE_MSG.ORDER.CREATE_FAILED);
    }
};

// create or update
const createCustomerDelivery = async bodyParams => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('DRIVERNAME', apiHelper.getValueFromObject(bodyParams, 'driver_name'))
            .input('PHONENUMBER', apiHelper.getValueFromObject(bodyParams, 'phone_number'))
            .input('VEHICLESNAME', apiHelper.getValueFromObject(bodyParams, 'vehicles_name'))
            .input('ISPARTNER', apiHelper.getValueFromObject(bodyParams, 'is_partner'))
            .input('CUSTOMERID', apiHelper.getValueFromObject(bodyParams, 'customer_id'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute(PROCEDURE_NAME.SL_CUSTOMERDELIVERY_CREATE_APP);
        const customerDeliveryId = data.recordset[0].RESULT;
        if (customerDeliveryId <= 0) {
            return new ServiceResponse(false, RESPONSE_MSG.ORDERS.CREATE_CUSTOMERDELIVERY_SUCCESS);
        }
        return new ServiceResponse(true, 'update success', customerDeliveryId);
    } catch (e) {
        ``;
        logger.error(e, { function: 'orderService.createCustomerDelivery' });
        return new ServiceResponse(false, RESPONSE_MSG.ORDERS.CREATE_CUSTOMERDELIVERY_FAILED);
    }
};

const formatMoney = value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

// export
const exportPDF = async (queryParams = {}) => {
    try {
        const order_id = apiHelper.getValueFromObject(queryParams, 'order_id');
        const result = await detailOrder(order_id);
        if (result.isFailed()) {
            return new ServiceResponse(false, 'Lỗi không thể in hoá đơn !.', []);
        }

        if (result.getData()) {
            let order = result.getData();

            order.products = Object.values(order.products);

            const fileName = `Don_hang_${moment().format('DDMMYYYY_HHmmss')}_${order_id}`;
            order.created_date = moment().format('DD/MM/YYYY');

            let total_a_mount = order.total_money - order.total_discount - order.total_paid;
            order.total_a_mount = total_a_mount <= 0 ? 0 : total_a_mount;

            order = {
                ...order,
                total_money: formatMoney(order.total_money || 0),
                total_discount: formatMoney(order.total_discount || 0),
                total_a_mount: formatMoney(order.total_a_mount || 0),
                total_paid: formatMoney(order.total_paid || 0),
                products: order?.products.map(item => {
                    return {
                        ...item,
                        price: formatMoney(item.price || 0),
                        product_name: item.product_display_name,
                        total_money: formatMoney(item.price * item.quantity || 0),
                        discount_value: formatMoney(item.discount_value || 0),
                    };
                }),
            };

            order.qr_code = await qrHelper.createQR({
                data: order.order_no,
                qr_width: 200,
                img_width: 35,
            });

            const print_params = {
                template: 'viewOrdersUser.html',
                data: order,
                filename: fileName,
                format: 'A5',
                landscape: true,
                isOnlyFirstPage: true,
                pageBreak: false,
            };
            await pdfHelper.printPDF(print_params);

            return new ServiceResponse(true, '', { path: `${config.domain_cdn}/app-pdf/${fileName}.pdf` });
        }

        return new ServiceResponse(false, 'Không tìm thấy đơn hàng.');
    } catch (e) {
        logger.error(e, { function: 'order.service.exportPDF' });
        return new ServiceResponse(false, e, []);
    }
};
const createOrderNo = async () => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().execute('SL_ORDER_GenOrderNo_App');
        return new ServiceResponse(true, '', data.recordset[0].ORDERNO);
    } catch (e) {
        logger.error(e, { function: 'orderService.createOrderNo' });
        return new ServiceResponse(true, '', '');
    }
};

//delete deleteOrder
const deleteOrder = async (orderId, bodyParams) => {
    try {
        const pool = await mssql.pool;
        await pool
            .request()
            .input('ORDERID', orderId)
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute(PROCEDURE_NAME.SL_ORDER_DELETE_ADMINWEB);
        return new ServiceResponse(true, RESPONSE_MSG.ORDER.DELETE_SUCCESS, '');
    } catch (e) {
        logger.error(e, { function: 'orderService.deleteOrder' });
        return new ServiceResponse(false, e.message);
    }
};

//delete cancelOrder
const cancelOrder = async (orderId, bodyParams) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('ORDERID', orderId)
            .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('SL_ORDER_CancelById_App');

        if (!data.recordset[0].RESULT) {
            return new ServiceResponse(false, 'Huỷ đơn hàng thất bại !');
        }
        return new ServiceResponse(true, 'Huỷ đơn hàng thành công', null);
    } catch (e) {
        logger.error(e, { function: 'orderService.cancelOrder' });
        return new ServiceResponse(false, e.message);
    }
};

const getProductInit = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PRODUCTID', apiHelper.getValueFromObject(queryParams, 'product_id'))
            .input('USERNAME', apiHelper.getValueFromObject(queryParams, 'auth_name'))
            .execute('SL_ORDER_GetProductInit_App');

        const res = {
            unit: orderClass.options(data.recordsets[0]),
            output_type: orderClass.options(data.recordsets[1]),
            area: orderClass.options(data.recordsets[2]),
            business: orderClass.options(data.recordsets[3]),
            densities: orderClass.options(data.recordsets[4]),
        };
        return new ServiceResponse(true, '', res);
    } catch (e) {
        logger.error(e, { function: 'orderService.getProductInit' });
        return new ServiceResponse(true, '', {
            output_type: [],
            area: [],
            business: [],
            store: [],
        });
    }
};

const getDetailOrderForReceiveslip = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('ORDERID', apiHelper.getValueFromObject(queryParams, 'orderId'))
            .input('TYPE', apiHelper.getValueFromObject(queryParams, 'type'))
            .execute(PROCEDURE_NAME.SL_ORDER_GETDETAILFORCREATERECEIVESLIP_ADMINWEB);
        return new ServiceResponse(
            true,
            '',
            data.recordset && data.recordset.length
                ? orderClass.detailOrderForCreateReceiveslip(data.recordset[0])
                : {},
        );
    } catch (e) {
        logger.error(e, { function: 'orderService.getDetailOrderForReceiveslip' });
        return new ServiceResponse(false, e.message);
    }
};

const indexOf = (array, unit, value) => {
    return array.findIndex(el => el[value] === unit);
};

const handleMergeData = arr => {
    const res = [];
    let listTag = [];

    for (let i = 0; i < arr.length; i++) {
        const ind = indexOf(res, arr[i].product_id, 'product_id');
        // console.log(arr[i].);
        if (ind !== -1) {
            res[ind].quantity += arr[i].quantity;
        } else {
            res.push(arr[i]);
        }
    }
    return res;
};

// Lay danh sach khuyen mai da apply
const getListPromotionApplied = async orderId => {
    try {
        const pool = await mssql.pool;
        // Lay danh sach khuyen mai con han su dung
        const dataPromotion = await pool
            .request()
            .input('ORDERID', orderId)
            .execute('SL_ORDER_GetListPromotionApply_App');
        let promotions = orderClass.promotions(dataPromotion.recordset, true);
        let productApply = orderClass.productApplyPromotion(dataPromotion.recordsets[1], true);
        let offers = orderClass.offers(dataPromotion.recordsets[2], true);
        let gifts = orderClass.gift(dataPromotion.recordsets[3], true);
        if (!promotions || !promotions.length) return new ServiceResponse(true, 'ok', []);
        // Filter cap nhat lai danh sach san pham ap dung tren tung ct khuyen mai neu co
        for (let i = 0; i < promotions.length; i++) {
            let promotion = promotions[i];
            let product_apply = (productApply || []).filter(p => p.promotion_id == promotion.promotion_id);
            promotions[i].product_apply = product_apply || [];
        }
        // Filter cap nhat lai danh sach uu dai tren khuyen mai
        for (let i = 0; i < promotions.length; i++) {
            let promotion = promotions[i];
            let _offers = (offers || []).filter(p => p.promotion_id == promotion.promotion_id);
            for (let j = 0; j < _offers.length; j++) {
                const { is_fixed_gift, promotion_offer_id } = _offers[j];
                // Neu co qua tang thi lay danh sach qua tang
                if (is_fixed_gift) {
                    let gifts_all = (gifts || []).filter(v => v.promotion_offer_id == promotion_offer_id);
                    _offers[j].gifts = uniqBy(gifts_all, 'product_gift_id');
                    _offers[j].gifts_apply = gifts_all.filter(item => item.is_picked === 1);
                }
            }
            promotions[i].offers = _offers || [];
        }
        return new ServiceResponse(true, '', promotions);
    } catch (e) {
        logger.error(e, { function: 'orderService.getListPromotion' });
        return new ServiceResponse(true, '', []);
    }
};

// Lay danh sach san pham trong kho
const getListProductByStore = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const pool = await mssql.pool;
        // Đơn hàng bình thường
        const data = await pool
            .request()
            .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'keyword'))
            .input('STOREID', sql.Int, apiHelper.getValueFromObject(queryParams, 'store_id', null))
            .input('OUTPUTTYPEID', sql.Int, apiHelper.getValueFromObject(queryParams, 'output_type_id', null))
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .execute('MD_PRODUCT_getList_ForOrder_App');

        let products = orderClass.listProductByStore(data.recordset);
        const attributeValue = orderClass.listAttributeValue(data.recordsets[1]);

        products = products.map(product => {
            return {
                ...product,
                attribute_list: attributeValue
                    .filter(v => v.model_id == product.model_id)
                    .reduce((acc, cur) => {
                        const { product_attribute_id, attribute_name, attribute_value, attribute_value_id, is_checked } =
                            cur;
                        const index = acc.findIndex(v => v.product_attribute_id === product_attribute_id);

                        if (index === -1) {
                            acc.push({
                                product_attribute_id,
                                attribute_name,
                                attribute_value_list: [{ attribute_value_id, attribute_value, is_checked }],
                            });
                        } else {
                            acc[index].attribute_value_list.push({ attribute_value_id, attribute_value, is_checked });
                        }

                        return acc;
                    }, []),
            };
        });

        return new ServiceResponse(true, '', {
            data: products,
            page: currentPage,
            limit: itemsPerPage,
            total: data.recordset.length ? data.recordset[0].TOTALITEMS : 0,
        });
    } catch (e) {
        logger.error(e, { function: 'orderService.getProductInStock' });
        return new ServiceResponse(false, 'Không tìm thấy sản phẩm.');
    }
};

const getOptionUser = async (bodyParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('AUTHNAME', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .input('KEYWORD', apiHelper.getValueFromObject(bodyParams, 'search'))
            .execute('SL_ORDER_GetOptionUser_App');
        const res = orderClass.userOption(data.recordset);
        return new ServiceResponse(true, '', { data: res });
    } catch (e) {
        logger.error(e, { function: 'order.getOptionUser' });
        return new ServiceResponse(false, '', {});
    }
};

const getBankAccountOptions = async (params = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('CASHIERID', apiHelper.getValueFromObject(params, 'auth_id'))
            .execute('AM_COMPANY_BANKACCOUNT_GetOptionsOrder_App');
        return new ServiceResponse(true, '', orderClass.bankAccountOptions(data.recordset));
    } catch (e) {
        logger.error(e, { function: 'companyService.getBankAccountOptions' });
        return new ServiceResponse(true, '', []);
    }
};

const getListStoreByUser = async (bodyParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(bodyParams);
        const itemsPerPage = apiHelper.getItemsPerPage(bodyParams);

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('USERID', apiHelper.getValueFromObject(bodyParams, 'auth_id'))
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('ISADMIN', apiHelper.getValueFromObject(bodyParams, 'isAdministrator'))
            .input('KEYWORD', apiHelper.getValueFromObject(bodyParams, 'search'))
            .execute('SYS_BUSINESS_USER_GetListStoreByUser_App');

        return new ServiceResponse(true, '', { items: orderClass.optionStore(data.recordset) });
    } catch (e) {
        logger.error(e, { function: 'orderyService.getListStoreByUser' });
        return new ServiceResponse(true, '', []);
    }
};

const getOrderTypeOptions = async bodyParams => {
    try {
        const pool = await mssql.pool;
        let user_group_ids = apiHelper.getValueFromObject(bodyParams, 'user_groups').join('|');

        const data = await pool
            .request()
            .input('ISADMIN', apiHelper.getValueFromObject(bodyParams, 'isAdministrator'))
            .input('USERGROUPIDS', user_group_ids)
            .execute('SL_ORDERTYPE_GetOptions_App');

        let order_type_list =
            data && data.recordsets && data.recordsets.length > 0
                ? orderClass.optionsOrderType(data.recordsets[0])
                : [];
        let outputTypeList =
            data && data.recordsets && data.recordsets.length > 0
                ? orderClass.optionsOutPutType(data.recordsets[1])
                : [];

        if (order_type_list.length > 0) {
            order_type_list = order_type_list.map(x => {
                let order_type_list = outputTypeList.filter(y => y.order_type_id == x.order_type_id);
                return {
                    ...x,
                    order_type_list,
                };
            });
        }

        return new ServiceResponse(true, '', order_type_list);
    } catch (e) {
        logger.error(e, { function: 'orderyService.getOrderTypeOptions' });
        return new ServiceResponse(true, '', []);
    }
};

const getDetailProductByImei = async bodyParams => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('STOREID', apiHelper.getValueFromObject(bodyParams, 'store_id'))
            .input('OUTPUTTYPEID', apiHelper.getValueFromObject(bodyParams, 'output_type_id'))
            .input('PRODUCTIMEICODE', apiHelper.getValueFromObject(bodyParams, 'product_imei_code'))
            .execute('MD_PRODUCT_GetDetailByImei_App');

        const check_store = data.recordsets[0][0].STOREID;
        const stocks_detail_status = data.recordsets[0][0].STOCKSDETAILSTATUS;

        if (check_store != apiHelper.getValueFromObject(bodyParams, 'store_id')) {
            return new ServiceResponse(false, 'Sản phẩm này không thuộc cửa hàng . Vui lòng kiểm tra lại !.');
        }

        if (stocks_detail_status == 1) {
            return new ServiceResponse(false, 'Sản phẩm này đang thuộc đơn hàng khác . Vui lòng kiểm tra lại !.');
        }

        if (stocks_detail_status == 2) {
            return new ServiceResponse(false, 'Sản phẩm này đã xuất kho . Vui lòng kiểm tra lại !.');
        }

        const product = orderClass.optionsProductImei(data.recordsets[0][0]);
        const material = orderClass.optionsMaterial(data.recordsets[1][0]);

        return new ServiceResponse(true, '', { product, material });
    } catch (e) {
        logger.error(e, { function: 'orderyService.getDetailProductByImei' });
        return new ServiceResponse(false, e.message);
    }
};

const getShiftInfo = async bodyParams => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('USERNAME', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('HR_USER_TIMEKEEPING_GetShiftInfo_App');
        return new ServiceResponse(true, '', orderClass.optionsShift(data.recordset[0]));
    } catch (e) {
        logger.error(e, { function: 'orderyService.getShiftInfo' });
        return new ServiceResponse(false, '', {});
    }
};

const getListPromotion = async (bodyParams = {}) => {
    try {
        const businessId = apiHelper.getValueFromObject(bodyParams, 'business_id', null);
        const orderTypeId = apiHelper.getValueFromObject(bodyParams, 'order_type_id', null);
        let order_details = apiHelper.getValueFromObject(bodyParams, 'products', []);
        const productListString = getValueAndConcatInArrayByField(order_details, 'product_id', ',');

        const pool = await mssql.pool;
        // Lay danh sach khuyen mai con han su dung
        const dataPromotion = await pool
            .request()
            .input('BUSINESSIDIN', businessId)
            .input('ORDERTYPEID', orderTypeId)
            .input('PRODUCTIDS', productListString)
            .input('MEMBERID', apiHelper.getValueFromObject(bodyParams, 'member_id'))
            .input('PARTNERID', apiHelper.getValueFromObject(bodyParams, 'partner_id'))
            .input('STOREID', apiHelper.getValueFromObject(bodyParams, 'store_id'))
            .input('USERNAME', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('SL_ORDER_GetListPromotion_App');
        let promotions = orderClass.promotions(dataPromotion.recordset);

        const productApply = orderClass.productApplyPromotion(dataPromotion.recordsets[1]);
        const offers = orderClass.offers(dataPromotion.recordsets[2]);
        const gifts = orderClass.gift(dataPromotion.recordsets[3]);
        const productCategoryApply = orderClass.productCategoryApplyPromotion(dataPromotion.recordsets[4]);
        const paymentApply = orderClass.paymentFormApply(dataPromotion.recordsets[5]);

        // Filter cap nhat lai danh sach san pham ap dung tren tung ct khuyen mai neu co
        for (let i = 0; i < promotions.length; i++) {
            let promotion = promotions[i];
            let product_apply = (productApply || []).filter(p => p.promotion_id == promotion.promotion_id);
            let product_category_apply = (productCategoryApply || []).filter(
                p => p.promotion_id == promotion.promotion_id,
            );
            let payment_form_apply = (paymentApply || []).filter(x => x.promotion_id == promotion.promotion_id);
            promotions[i].product_apply = product_apply || [];
            promotions[i].product_category_apply = product_category_apply || [];
            promotions[i].payment_form_apply = payment_form_apply || [];
        }

        const payment_form_list_id = apiHelper.getValueFromObject(bodyParams, 'payment_form_list_id', []);
        //Filter các promotions không đủ điều kiện thanh toán
        promotions = promotions.filter(x => {
            let checkPayment = payment_form_list_id.some(a =>
                (x.payment_form_apply || []).some(b => b.payment_form_id == a.payment_form_id),
            );
            if (x.is_all_payment_form == 1 || checkPayment) {
                return x;
            }
        });

        // Filter cap nhat lai danh sach uu dai tren khuyen mai
        for (let i = 0; i < promotions.length; i++) {
            let promotion = promotions[i];
            let _offers = (offers || []).filter(p => p.promotion_id == promotion.promotion_id);
            for (let j = 0; j < _offers.length; j++) {
                const { is_fixed_gift, promotion_offer_id } = _offers[j];
                // Neu co qua tang thi lay danh sach qua tang
                if (is_fixed_gift) {
                    _offers[j].gifts = (gifts || []).filter(v => v.promotion_offer_id == promotion_offer_id);
                }
            }
            promotions[i].offers = _offers || [];
        }
        // Tinh tong so tien cua tung san pham trong don hang
        // Chi lay cac san pham trong don hang co gia

        let sub_total = 0;
        let total_quantity = 0;
        // Bỏ qua các sản phẩm là quà tặng
        (order_details || [])
            .filter(v => v.price && !v.is_gift)
            .forEach(item => {
                sub_total += item.quantity * item.price;
                total_quantity += 1 * item.quantity;
            });
        //Duyêt danh sách khuyến mãi để check điều kiện
        let promotionApply = [];
        for (let k = 0; k < promotions.length; k++) {
            let promotion = promotions[k];
            let {
                is_apply_all_product,
                is_apply_any_product,
                is_apply_appoint_product,
                is_apply_product_category,
                is_promotion_by_price,
                from_price,
                to_price,
                is_promotion_by_total_money,
                min_promotion_total_money,
                max_promotion_total_money,
                is_promotion_by_total_quantity,
                min_promotion_total_quantity,
                max_promotion_total_quantity,
                product_apply = [],
                product_category_apply = [],
            } = promotion || {};

            // Danh sach nganh hang ap dung
            if (is_apply_product_category) {
                // console.log({product_category_apply})
                if (!product_category_apply.length) continue;

                // Check xem co san pham nao thuoc nganh hang ap dung khong
                const checkProductCategory = order_details
                    .filter(v => !v.is_gift)
                    .filter(x => {
                        return product_category_apply.find(y => x.product_category_id == y.product_category_id);
                    });

                if (!checkProductCategory.length) {
                    continue;
                }
            } else if (!is_apply_all_product) {
                //Danh sách sản phẩm áp dụng va co ap dung combo haykhong
                if (!product_apply.length) continue;
                if (is_apply_appoint_product) {
                    let product_apply_combo = (product_apply || []).filter(v => {
                        return (order_details || []).filter(v => !v.is_gift).find(x => x.product_id == v.product_id);
                    });
                    if (product_apply_combo.length != product_apply.length) {
                        continue;
                    }
                } else if (is_apply_any_product) {
                    const checkProduct = order_details
                        .filter(v => !v.is_gift)
                        .filter(x => {
                            return product_apply.find(y => x.product_id == y.product_id);
                        });
                    if (!checkProduct.length) {
                        continue;
                    }
                } else {
                    continue;
                }
            }

            // Kiem tra số tiền Khuyến mại theo mức giá
            if (is_promotion_by_price) {
                const checkProduct = order_details
                    .filter(v => !v.is_gift)
                    .filter(x => {
                        return x.price < from_price || x.price > to_price;
                    });
                if (checkProduct.length) {
                    continue;
                }
            }
            // Kiểm tra Khuyến mại trên tổng tiền
            if (
                is_promotion_by_total_money &&
                (sub_total < min_promotion_total_money || sub_total > max_promotion_total_money)
            ) {
                continue;
            }

            //Kiểm tra số lượng tối thiểu
            if (
                is_promotion_by_total_quantity &&
                (total_quantity < min_promotion_total_quantity || total_quantity > max_promotion_total_quantity)
            ) {
                continue;
            }

            promotionApply.push(promotion);
        }
        const shipping_fee = apiHelper.getValueFromObject(bodyParams, 'shipping_fee');

        // Tính giá trị được uu đãi trên từng promotion
        const promotionApplyOffer = calcPromotionDiscount(order_details, sub_total, promotionApply, shipping_fee);
        return new ServiceResponse(true, '', promotionApplyOffer);
    } catch (e) {
        console.log(e);
        logger.error(e, { function: 'orderService.getListPromotion' });
        return new ServiceResponse(true, '', []);
    }
};

// Tính số tiền được giảm trên từng ưu đãi trong các chương trình khuyến mãi
const calcPromotionDiscount = (items, totalMoney, promotionApply, shippingFee) => {
    // Duyệt các chương trình thỏa điều kiện
    for (let i = 0; i < promotionApply.length; i++) {
        const { offers, is_apply_order } = promotionApply[i];
        for (let j = 0; j < offers.length; j++) {
            const offer = offers[j];
            const {
                is_transport = 0,
                shipping_promotion = 1, //1: Miễn phí vận chuyển 2: Số tiền phí vận chuyển hỗ trợ 3: Phần trăm phí vận chuyển hỗ trợ
                discount_shipping_fee = 0,
                percent_shipping_fee = 0,
                discount_max = 0, // giam toi da phi van chuyen
            } = offer;

            // Giảm giá vận chuyển
            if (is_transport) {
                let shippingDiscount = 0;
                // Nếu là miễn phí vận chuyển
                if (shipping_promotion == 1) {
                    shippingDiscount += shippingFee;
                }
                // Nếu là giảm phí vận chuyển theo số tiền
                else if (shipping_promotion == 2) {
                    shippingDiscount += discount_shipping_fee;
                }
                // Nếu là giảm phí vận chuyển theo %
                else if (shipping_promotion == 3) {
                    shippingDiscount += (shippingFee * percent_shipping_fee * 1) / 100;
                }

                // Nếu giảm giá vận chuyển thì sẽ kiểm tra xem có giới hạn giảm giá vận chuyển hay không
                if (discount_max > 0 && shippingDiscount > discount_max) {
                    shippingDiscount = discount_max;
                }

                promotionApply[i]['offers'][j].discount = shippingDiscount;
                continue;
            }

            // Tính giá được khuyên mãi trên tổng đơn hàng hay tren từng sản phẩm
            // Nếu km áp dụng trên đơn hàng thì tính giá trị discount
            // Ngược lại nếu không tính trên đơn hàng thì tính offer discoung trên từng sản phẩm xem giá tri được bao nhiêu
            promotionApply[i]['offers'][j].discount = is_apply_order ? calcPromotionApplyOrder(offer, totalMoney) : 0;
            if (!is_apply_order) {
                promotionApply[i]['offers'][j].offer_product = calcPromotionApplyProduct(
                    offer,
                    items,
                    promotionApply[i],
                );
            }
        }
    }

    return promotionApply;
};

// Tính giảm giá trên đơn hàng
const calcPromotionApplyOrder = (offer, totalMoney) => {
    let discount = 0;
    const { is_fix_price = 0, is_percent_discount = 0, is_discount_by_set_price = 0, discount_value = 0 } = offer;
    // Nếu là giảm giá trực tiếp là giá được km
    if (is_discount_by_set_price) {
        discount += discount_value;
    }
    // Nếu giảm giá % thì sẽ tính giá trị giảm trên % tổng đơn hàng
    else if (is_percent_discount) {
        discount += ((totalMoney * discount_value * 1) / 100).toFixed(2);
    }
    // Giảm giá cứng: KM = tổng giá trị đơn hàng - giảm giá cứng
    else if (is_fix_price) {
        const fixDiscountPrice = totalMoney - discount_value;
        if (fixDiscountPrice <= 0) discount = 0;
        else discount = fixDiscountPrice;
    }
    return discount * 1;
};

// Tính giảm giá trên từng sản phẩm trong đơn hàng
const calcPromotionApplyProduct = (offer, products = [], promotion = {}) => {
    const {
        is_apply_all_product,
        // is_apply_any_product,
        // is_apply_appoint_product,
        is_all_product_category,
        product_apply = [],
        product_category_apply = [],
    } = promotion;
    // Sẽ trả về offer theo từng sản phẩm hình thức xuất trong đơn hàng
    let offer_product = [];
    for (let i = 0; i < products.length; i++) {
        const {
            quantity = 0,
            price = 0,
            product_output_type_id,
            product_unit_id,
            product_id,
            product_category_id,
        } = products[i];
        const { is_fix_price = 0, is_percent_discount = 0, is_discount_by_set_price = 0, discount_value = 0 } = offer;
        if (is_fix_price || is_percent_discount || is_discount_by_set_price) {
            let discount = 0;
            // Kiểm tra xem sản phẩm nào thỏa điều kiện thì sẽ tính giảm giá cho sp đó
            if (
                is_apply_all_product ||
                is_all_product_category ||
                product_category_apply.findIndex(x => x.product_category_id == product_category_id) >= 0 ||
                product_apply.findIndex(k => k.product_id == product_id) >= 0
            ) {
                // Nếu là giảm giá trực tiếp là giá được km
                if (is_discount_by_set_price) {
                    discount = discount_value * quantity * 1;
                }
                // Nếu giảm giá % thì sẽ tính giá trị giảm trên % tổng đơn hàng
                else if (is_percent_discount) {
                    discount = parseFloat(`${(((price * discount_value * 1) / 100) * quantity).toFixed(2)}`);
                }
                // Giảm giá cứng: KM = tổng giá trị đơn hàng - giảm giá cứng
                else if (is_fix_price) {
                    const fixDiscountPrice = price - discount_value;
                    if (fixDiscountPrice <= 0) discount += 0;
                    else discount = parseFloat(`${(fixDiscountPrice * quantity * 1).toFixed(2)}`);
                }
                discount = discount * 1;
                // Set gia tri khuyen mai cho san pham do
                offer_product.push({
                    discount,
                    product_id,
                    product_category_id,
                    product_output_type_id,
                    product_unit_id,
                });
            }
        }
    }
    return offer_product;
};
const CODE_TYPE = {
    MONEY: 1,
    PERCENT: 2,
};

const TYPECOUPON = {
    shopdunk_pre_order: 1,
    coupon_order: 2,
};

const getCoupon = async (bodyParams = {}) => {
    try {
        const pool = await mssql.pool;
        const couponList = apiHelper.getValueFromObject(bodyParams, 'coupon_list', []);
        const order_id = apiHelper.getValueFromObject(bodyParams, 'order_id', null);
        const coupon_code = apiHelper.getValueFromObject(bodyParams, 'coupon_code', '').trim();
        const getValueByTwoif = getArrValueByIf(couponList, 'coupon_id', null);

        let dataDiscountPreOrder = null;
        if (!getValueByTwoif) {
            const data = await pool
                .request()
                .input('ORDERID', order_id)
                .input('COUPONCODE', coupon_code)
                .execute('SL_PREORDER_getCouponPreOrder_AdminWeb');

            dataDiscountPreOrder = data?.recordset?.[0].DISCOUNTVALUE;
        }

        if (dataDiscountPreOrder) {
            const couponCode = {
                coupon_code: coupon_code,
                type: TYPECOUPON.shopdunk_pre_order,
                discount: dataDiscountPreOrder,
            };

            return new ServiceResponse(true, '', couponCode);
        } else {
            const products = apiHelper.getValueFromObject(bodyParams, 'products', []);
            const productIds = uniqBy(products.map(product => product.product_id));
            const totalMoney = apiHelper.getValueFromObject(bodyParams, 'total_discount', 0);
            const promotions = apiHelper.getValueFromObject(bodyParams, 'promotion_apply', []);
            let promotionsIds = uniqBy(promotions.map(promotion => promotion.promotion_id));
            // const coupons = apiHelper.getValueFromObject(bodyParams, 'coupons', []);
            const listPayment = apiHelper.getValueFromObject(bodyParams, 'list_payment_method', []);

            let strProductIds = '';
            let strCouponsIds = '';
            let lenProduct = 1;
            let lenghtCoupon = 0;
            let strPayment = '';
            if (listPayment && Array.isArray(listPayment) && listPayment.length > 0) {
                strPayment = handleCheckValueArrayAndToString(listPayment, ',', '', 'pay_partner_id', '');
            }

            let arrCoupon = [];
            if (couponList) {
                const defendKey = ['coupon_id'];
                if (Array.isArray(couponList)) {
                    for (let i = 0; i < couponList.length; i++) {
                        if (couponList[i] && couponList[i]?.[defendKey]) {
                            const checkCoupon = checkJsonByArrayKey(couponList[i], defendKey);
                            if (checkCoupon) {
                                arrCoupon.push(couponList[i].coupon_id);
                                lenghtCoupon++;
                            }
                        }
                    }
                } else {
                    const checkCoupon = checkJsonByArrayKey(couponList, defendKey);
                    if (checkCoupon) {
                        arrCoupon.push(couponList?.coupon_id);
                        lenghtCoupon++;
                    }
                }
            }
            strCouponsIds = arrCoupon.join(',');

            if (productIds && productIds.length > 0) {
                strProductIds = productIds.join(',');
                lenProduct = products.length;
            }

            if (promotionsIds && promotionsIds.length > 0) {
                promotionsIds = promotionsIds.join(',');
            }

            let type_customer = 1;
            const getTypeCustomer = apiHelper.getValueFromObject(bodyParams, 'type_customer', '');
            if (getTypeCustomer == 'LEADS') {
                type_customer = 2;
            }
            const dataCoupon = await pool
                .request()
                .input('TOTALMONEY', totalMoney)
                .input('PRODUCTIDS', strProductIds)
                .input('PROMOTIONIDS', promotionsIds)
                .input('COUPONIDS', strCouponsIds)
                .input('COUPONIDLENGTH', lenghtCoupon)
                .input('PRODUCTLENGTH', lenProduct)
                .input('MEMBERID', apiHelper.getValueFromObject(bodyParams, 'member_id', ''))
                .input('PAYPARNER', strPayment)
                .input('ORDERID', apiHelper.getValueFromObject(bodyParams, 'order_id', ''))
                .input('CUSTOMERID', apiHelper.getValueFromObject(bodyParams, 'member_id', ''))
                .input('TYPECUSTOMER', type_customer)
                .input('PARTNERID', apiHelper.getValueFromObject(bodyParams, 'partner_id', ''))
                .input('ORDERTYPEID', apiHelper.getValueFromObject(bodyParams, 'order_type_id', ''))
                .input('COUPONCODE', coupon_code)
                .execute('SL_ORDER_GetCouponByCode_App');
            if (dataCoupon.recordset.length) {
                let coupon = orderClass.coupon(dataCoupon.recordset[0]);
                coupon.type = TYPECOUPON.coupon_order;
                coupon.apply_products = orderClass.couponProducts(dataCoupon.recordsets[1]);
                if (coupon.code_type === CODE_TYPE.MONEY) {
                    coupon.discount = coupon.code_value;
                } else if (coupon.code_type === CODE_TYPE.PERCENT) {
                    const parCodeValue = parseInt(totalMoney * coupon.code_value);
                    const percentValue = Math.round(parCodeValue / 100);
                    const maxReduceValue = coupon.max_value_reduce;
                    if (!maxReduceValue) {
                        coupon.discount = percentValue;
                    } else {
                        coupon.discount = percentValue > maxReduceValue ? maxReduceValue : percentValue;
                    }
                }
                return new ServiceResponse(true, '', coupon);
            }
        }

        return new ServiceResponse(true, 'Không tìm thấy coupon', null);
    } catch (e) {
        logger.error(e, { function: 'orderService.getCoupon' });
        return new ServiceResponse(true, '', []);
    }
};

const getUnique = (arr, comp) => {
    const unique = arr
        .map(e => e[comp])

        // store the keys of the unique objects
        .map((e, i, final) => final.indexOf(e) === i && i)

        // eliminate the dead keys & store unique objects
        .filter(e => arr[e])
        .map(e => arr[e]);

    return unique;
};

const checkCouponApply = async (bodyParam = {}) => {
    try {
        const code = apiHelper.getValueFromObject(bodyParam, 'coupon_code', null);
        const customer_id = apiHelper.getValueFromObject(bodyParam, 'member_id', 0);
        const products = apiHelper.getValueFromObject(bodyParam, 'products', []);
        const total_discount = apiHelper.getValueFromObject(bodyParam, 'total_discount', 0);
        const order_id = apiHelper.getValueFromObject(bodyParam, 'order_id', null);
        const order_type_id = apiHelper.getValueFromObject(bodyParam, 'order_type_id', null);

        if (!code) {
            return new ServiceResponse(false, 'Vui lòng nhập mã khuyến mãi');
        }

        if (!products || products.length == 0) {
            return new ServiceResponse(false, 'Mã khuyến mãi không hợp lệ.');
        }

        let sub_total = 0;
        let total_money = 0;
        products.forEach(item => {
            total_money += item.price || 0;
        });
        sub_total = (total_money || 0) - (total_discount || 0) >= 0 ? total_money - total_discount : 0;

        const pool = await mssql.pool;
        const resCoupon = await pool
            .request()
            .input('COUPONCODE', code ? code.replace(/<[^>]*>?/gm, '') : '')
            .input('MEMBERID', customer_id)
            .input('ORDERTYPEID', order_type_id)
            .execute('SM_COUPON_CheckApply_App');

        let coupon = orderClass.coupon(resCoupon.recordsets[0][0]) || null;
        let product_apply = orderClass.productApply(resCoupon.recordsets[1]) || [];
        let customer_type_apply = orderClass.customerTypeApply(resCoupon.recordsets[2]) || [];
        let customer_type_member = resCoupon.recordsets[3] || [];

        if (!coupon) {
            return new ServiceResponse(false, 'Mã khuyến mãi không hợp lệ.');
        }

        let {
            coupon_id,
            coupon_code,
            is_appoint_product,
            is_all_customer_type,
            is_any_product,
            code_type,
            max_total_money,
            min_total_money,
            code_value: discount_value,
            max_value_reduce,
            coupon_condition_id,
        } = coupon || {};

        // //Check điều kiện áp dụng sản phẩm
        // //Sản phẩm chỉ định(Mua toàn bộ SP trong danh sách dưới đây)
        if (is_appoint_product) {
            let checkProduct = products.filter(x => {
                return product_apply.find(y => x.product_id == y.product_id);
            });

            checkProduct = getUnique(checkProduct, 'product_id');
            if (checkProduct.length != product_apply.length) {
                return new ServiceResponse(false, 'Mã khuyến mãi không áp dụng cho sản phẩm này.');
            }
        }

        // //Sản phẩm bất kỳ((Mua bất kỳ SP trong danh sách dưới đây)
        if (is_any_product) {
            const checkProduct = products.filter(x => {
                return product_apply.find(y => x.product_id == y.product_id);
            });
            if (!checkProduct.length) {
                return new ServiceResponse(false, 'Mã khuyến mãi không áp dụng cho sản phẩm này.');
            }
        }

        //Check điều kiện áp dụng loại khách hàng
        if (!is_all_customer_type) {
            const checkCustomerType = customer_type_member.filter(x => {
                return customer_type_apply.find(y => x.customer_type_id == y.customer_type_id);
            });

            if (checkCustomerType.length != customer_type_apply.length) {
                return new ServiceResponse(false, 'Mã khuyến mãi chỉ áp dụng cho 1 số loại khách hàng.');
            }
        }

        //Check điều kiện giá trị đơn hàng min và max
        if (min_total_money && max_total_money) {
            if (min_total_money > sub_total || max_total_money < sub_total) {
                return new ServiceResponse(false, 'Giá trị đơn hàng không thể áp dụng mã giảm giá này');
            }
        }

        //Danh sach san pham thoa dieu kien
        let listProductApply =
            products.filter(x => {
                return product_apply.find(y => x.product_id == y.product_id);
            }) || [];

        // Lấy danh sách khuyến mãi đã tick sau khi nhập mã khuyến mãi
        const promotionApply = apiHelper.getValueFromObject(bodyParam, 'promotion_apply', []);

        let promotionApplyCal = calcPromotionDiscount(products, sub_total, promotionApply);

        let promotionPicked = !order_id ? promotionApply : promotionApplyCal;

        let offer_product = [];
        for (let i = 0; i < promotionPicked.length; i++) {
            const { offers = [], is_apply_order } = promotionPicked[i];
            for (let j = 0; j < offers.length; j++) {
                offer_product = offers[j].offer_product;
                offer_product = (offer_product || []).filter(
                    x => (listProductApply || []).findIndex(k => k.product_id == x.product_id) >= 0,
                );
            }
        }

        // Sau khi có danh sách chương trình khuyến mãi và danh sách sản phẩm được khuyến mãi
        // Map 2 mảng lại để tính giá của sản phẩm tại thời điểm nhập mã khuyến mãi
        let arrayProductMapOffer = [];
        if (offer_product && offer_product.length > 0) {
            for (let i = 0; i < listProductApply.length; i++) {
                for (let j = 0; j < offer_product.length; j++) {
                    if (listProductApply[i].product_id == offer_product[j].product_id) {
                        arrayProductMapOffer.push({
                            ...listProductApply[i],
                            price: listProductApply[i].price - offer_product[j].discount,
                            total_money: listProductApply[i].total_money - offer_product[j].discount,
                            change_price: listProductApply[i].change_price - offer_product[j].discount,
                        });
                    }
                }
            }
            listProductApply = arrayProductMapOffer;
        }

        // // Dùng để lọc các sản phẩm có cùng id detail
        // // Do quá trình map sẽ bị duplicate nên dùng hàm này lọc các giá trị bị trùng khi có mã sản phẩm và ID chi tiết kho giống nhau
        if (!order_id) {
            listProductApply = uniqBy(listProductApply, 'product_id') || [];
        } else {
            listProductApply = listProductApply.reduce((acc, current) => {
                const x = acc.find(item => item.order_detail_id === current.order_detail_id);
                if (!x) {
                    return acc.concat([current]);
                } else {
                    return acc;
                }
            }, []);
        }

        let offers = [];

        // Tính giá khi nhập mã khuyến mãi (Coupon)
        let discount = 0;
        if (code_type === 2) {
            if (is_any_product) {
                //Tính tren sản phẩm mua bất kỳ thoả mua bất kỳ
                //Tính trên giá khuyến mãi

                (listProductApply || []).forEach(p => {
                    let price = p.price_discount ? p.price_discount : p.price;
                    discount += ((discount_value * (1 * price)) / 100) * p.quantity;

                    offers.push({
                        product_id: p.product_id,
                        discount: ((discount_value * (1 * price)) / 100) * p.quantity,
                        discount_value: (discount_value * (1 * price)) / 100,
                        quantity: p.quantity,
                    });
                });
            } else {
                //Tính trên tổng đơn hàng
                if (max_value_reduce) {
                    discount =
                        (discount_value * (1 * sub_total)) / 100 > max_value_reduce * 1
                            ? max_value_reduce * 1
                            : (discount_value * (1 * sub_total)) / 100;
                } else {
                    discount = (discount_value * (1 * sub_total)) / 100;
                }
            }
        } else {
            if (is_any_product) {
                //Tính tren sản phẩm mua bất kỳ thoả mua bất kỳ
                (listProductApply || []).forEach(p => {
                    let price = discount_value > p.price ? p.price : discount_value;
                    discount += price * p.quantity;
                    offers.push({
                        product_id: p.product_id,
                        discount: price * p.quantity,
                        discount_value: price,
                        quantity: p.quantity,
                    });
                });
            } else {
                //Tính trên tổng đơn hàng
                discount = discount_value;
            }
        }
        return new ServiceResponse(true, 'Khởi tạo thành công', {
            discount,
            coupon_code: coupon_code,
            id: coupon_id,
            is_any_product: is_any_product,
            offers: offers,
            coupon_condition_id: coupon_condition_id * 1,
        });
    } catch (error) {
        logger.error(error, {
            function: 'order.service.checkCouponApply',
        });
        return new ServiceResponse(false, error.message, {});
    }
};

const _createAccounting = async (accountingData, transaction) => {
    try {
        // get default debt account
        const getAccountRq = new sql.Request(transaction);
        const accountRes = await getAccountRq
            .input('PAYMENTFORMID', apiHelper.getValueFromObject(accountingData, 'payment_form_id'))
            .input('AMOUNT', apiHelper.getValueFromObject(accountingData, 'money'))
            .input('ORDERID', apiHelper.getValueFromObject(accountingData, 'order_id'))
            .execute('AC_ACCOUNTING_GetAccountForOrder_Global');

        const { DEBTACCOUNT: debt_account_id, CREDITACCOUNT: credit_account_id } = accountRes?.recordset[0];

        const accountingRequest = new sql.Request(transaction);
        const resultChild = await accountingRequest
            .input('RECEIVESLIPID', apiHelper.getValueFromObject(accountingData, 'receiveslip_id'))
            .input('DEBTACCOUNT', debt_account_id ?? null)
            .input('CREDITACCOUNT', credit_account_id ?? null)
            .input('EXPLAIN', apiHelper.getValueFromObject(accountingData, 'descriptions'))
            .input('MONEY', apiHelper.getValueFromObject(accountingData, 'money'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(accountingData, 'auth_name'))
            .execute('AC_ACCOUNTING_CreateOrUpdate_AdminWeb');

        const childId = resultChild.recordset[0].RESULT;

        return childId > 0;
    } catch (error) {
        throw error;
    }
};

//Thanh toán bằng tiền mặt
const paymentOrder = async bodyParams => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    await transaction.begin();

    try {
        const order_id = apiHelper.getValueFromObject(bodyParams, 'order_id');
        const data_payment = apiHelper
            .getValueFromObject(bodyParams, 'data_payment', [])
            .filter(item => item.payment_type != 4);
        let payment_status = 0;

        if (data_payment && data_payment.length > 0) {
            //Lấy loại phiếu thu từ AppConfig
            const dataAppConfig = await new sql.Request(transaction)
                .input('KEYCONFIG', 'SL_ORDER_RECEIVETYPE')
                .execute('SYS_APPCONFIG_GetByKeyConfig_App');
            const value_config = dataAppConfig.recordset[0].VALUECONFIG;
            if (!value_config) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Lỗi lấy loại thu của phiếu thu trong đơn hàng !');
            }

            const description = apiHelper.getValueFromObject(bodyParams, 'description', '');
            const auth_name = apiHelper.getValueFromObject(bodyParams, 'auth_name', '');
            const requestReceiveslip = new sql.Request(transaction);
            const requestCreateReceiveslipOrder = new sql.Request(transaction);

            for (let i = 0; i < data_payment.length; i++) {
                const itemPayment = data_payment[i];
                const totalMoney = apiHelper.getValueFromObject(itemPayment, 'payment_value', 0);

                const data = await requestReceiveslip
                    .input('COMPANYID', apiHelper.getValueFromObject(bodyParams, 'company_id'))
                    .input('BUSINESSID', apiHelper.getValueFromObject(bodyParams, 'business_id'))
                    .input('STOREID', apiHelper.getValueFromObject(bodyParams, 'store_id'))
                    .input('RECEIVETYPEID', value_config)
                    .input('BANKACCOUNTID', apiHelper.getValueFromObject(itemPayment, 'bank_id'))
                    .input('CASHIERID', auth_name)
                    .input('MEMBERID', apiHelper.getValueFromObject(bodyParams, 'member_id'))
                    .input('PAYMENTFORMID', apiHelper.getValueFromObject(itemPayment, 'payment_form_id'))
                    .input('DESCRIPTIONS', description)
                    .input('TOTALMONEY', totalMoney)
                    .input('NOTES', description)
                    .input('CREATEDUSER', auth_name)
                    .input('ISACTIVE', 1)
                    .input('ISREVIEW', 1)
                    .input('PAYMENTSTATUS', 1) // trạng thái đã thanh toán
                    .input('PAYMENTTYPE', itemPayment.payment_type === 1 ? 1 : 2) // 1 phiếu thu tiền mặt 2 phiếu thu ngân hàng
                    .input('ORDERID', order_id) //Đơn hàng

                    .execute('SL_RECEIVESLIP_CreateOrUpdateForOrder_App');
                const receiveslipId = data.recordset[0].RESULT;

                if (receiveslipId <= 0) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Lỗi khi tạo phiếu thu');
                }

                // Tạo hạch toán
                const accountingData = {
                    auth_name,
                    receiveslip_id: receiveslipId,
                    money: totalMoney,
                    descriptions: description,
                    order_id,
                    payment_form_id: apiHelper.getValueFromObject(itemPayment, 'payment_form_id'),
                };

                const result = await _createAccounting(accountingData, transaction);
                if (!result) {
                    throw new Error('Lỗi khi tạo hoạch toán');
                }

                console.log(
                    receiveslipId,
                    order_id,
                    apiHelper.getValueFromObject(itemPayment, 'payment_value'),
                    auth_name,
                    apiHelper.getValueFromObject(itemPayment, 'payment_form_id'),
                );

                const dataCreateReceiveslipOrder = await requestCreateReceiveslipOrder
                    .input('RECEIVESLIPID', receiveslipId)
                    .input('ORDERID', order_id)
                    .input('TOTALMONEY', apiHelper.getValueFromObject(itemPayment, 'payment_value'))
                    .input('CREATEDUSER', auth_name)
                    .input('PAYMENTFORMID', apiHelper.getValueFromObject(itemPayment, 'payment_form_id'))
                    .execute('SL_RECEIVESLIP_ORDER_CreateOrUpdate_App');

                const targetResult =
                    dataCreateReceiveslipOrder?.recordsets?.find(
                        recordset =>
                            recordset?.[0]?.RESULT &&
                            recordset?.[0]?.ISVALIDRECEIVESLIPORDER &&
                            recordset?.[0]?.ORDERNO &&
                            recordset?.[0]?.PAYMENTSTATUS,
                    )?.[0] || {};

                const {
                    RESULT: receiveslipOrder,
                    ISVALIDRECEIVESLIPORDER: isValid,
                    ORDERNO: orderNo,
                    OPAYMENTSTATUS,
                } = targetResult;

                if (!isValid) {
                    await transaction.rollback();
                    return new ServiceResponse(false, `Đơn hàng ${orderNo} đã thu đủ tiền.`);
                }
                if (receiveslipOrder <= 0) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Tạo phiếu thu với đơn hàng thất bại');
                }

                if (OPAYMENTSTATUS == 1) {
                    payment_status = OPAYMENTSTATUS;
                }
            }
        }

        // đã xuất kho trong trigger
        //Tạo phiếu xuất kho cho đơn hàng và xuất kho luôn
        // if (payment_status == 1) {
        //     // Xóa phiếu đã có trước đó theo đơn hàng
        //     const reqDeleteStocksOutRequest = new sql.Request(transaction);
        //     const resDeleteStocksOutRequest = await reqDeleteStocksOutRequest
        //         .input('ORDERID', order_id)
        //         .input('DELETEDUSER', created_user)
        //         .execute('ST_STOCKSOUTREQUEST_DeleteByOrder_App');
        //     if (!apiHelper.getResult(resDeleteStocksOutRequest.recordset)) {
        //         await transaction.rollback();
        //         return new ServiceResponse(false, 'Có lỗi xảy ra');
        //     }
        //     const reqDeleteStocksOutRequestDetail = new sql.Request(transaction);
        //     const resDeleteStocksOutRequestDetail = await reqDeleteStocksOutRequestDetail
        //         .input('ORDERID', order_id)
        //         .input('DELETEDUSER', created_user)
        //         .execute('ST_STOCKSOUTREQUESTDETAIL_DeleteByOrder_App');
        //     if (!apiHelper.getResult(resDeleteStocksOutRequestDetail.recordset)) {
        //         await transaction.rollback();
        //         return new ServiceResponse(false, 'Có lỗi xảy ra');
        //     }
        //     //Lấy danh sách kho và sản phẩm trong đơn hàng
        //     const reqGetProductByOrderID = new sql.Request(transaction);
        //     const resGetProductByOrderID = await reqGetProductByOrderID
        //         .input('ORDERID', order_id)
        //         .execute('SL_ORDERDETAIL_GetByOrderID_App');
        //     const list_stock = stocksOutRequestClass.listStock(resGetProductByOrderID.recordsets[0]);
        //     const list_order_detail = stocksOutRequestClass.listStock(resGetProductByOrderID.recordsets[1]);

        //     if (list_stock?.length > 0) {
        //         const reqCreateStocksOutRequest = new sql.Request(transaction);
        //         const reqCreateStocksOutRequestDetail = new sql.Request(transaction);
        //         const reqStocksDetail = new sql.Request(transaction);

        //         for (const element of list_stock) {
        //             const resCreateStocksOutRequest = await reqCreateStocksOutRequest
        //                 .input('ORDERID', order_id)
        //                 .input('STOCKSID', element.stocks_id)
        //                 .input('CREATEDUSER', created_user)
        //                 .execute('ST_STOCKSOUTREQUEST_CreateByOrder_App');
        //             const result = apiHelper.getResult(resCreateStocksOutRequest.recordset);
        //             if (!result) {
        //                 await transaction.rollback();
        //                 return new ServiceResponse(false, 'Có lỗi xảy ra');
        //             }

        //             const resCreateStocksOutRequestDetail = await reqCreateStocksOutRequestDetail
        //                 .input('ORDERID', order_id)
        //                 .input('STOCKSOUTREQUESTID', result)
        //                 .input(
        //                     'LISTORDERDETAIL',
        //                     list_order_detail
        //                         .filter(x => x.stocks_id === element.stocks_id)
        //                         .map(x => x.order_detail_id)
        //                         .join(','),
        //                 )
        //                 .input('CREATEDUSER', created_user)
        //                 .execute('ST_STOCKSOUTREQUESTDETAIL_CreateByOrder_App');
        //             if (!apiHelper.getResult(resCreateStocksOutRequestDetail.recordset)) {
        //                 await transaction.rollback();
        //                 return new ServiceResponse(false, 'Có lỗi xảy ra');
        //             }

        //             //Xuất kho luôn ở chỗ này
        //             const dataStocksDetail = await reqStocksDetail
        //                 .input('STOCKSOUTREQUESTID', result)
        //                 .input('USERNAME', created_user)
        //                 .execute('ST_STOCKSOUTREQUEST_Outputted_App');
        //             if (!dataStocksDetail.recordset[0].RESULT) {
        //                 await transaction.rollback();
        //                 return new ServiceResponse(false, 'Xuất kho thất bại !');
        //             }
        //         }
        //     } else {
        //         await transaction.rollback();
        //         return new ServiceResponse(false, 'Không tìm thấy sản phẩm trong đơn hàng');
        //     }
        // }

        await transaction.commit();
        return new ServiceResponse(true, 'Thanh toán thành công ', { order_id });
    } catch (e) {
        logger.error(e, { function: 'orderService.paymentOrder' });
        await transaction.rollback();
        return new ServiceResponse(false, 'Thanh toán thất bại !');
    }
};

const getExchangePoint = async (bodyParams = {}) => {
    try {
        const pool = await mssql.pool;
        let products = apiHelper.getValueFromObject(bodyParams, 'products', []);
        if (products) {
            products = JSON.parse(products);
        }
        const productIds = uniqBy(products.map(product => product?.product_id));
        const data = await pool
            .request()
            .input('PRODUCTIDS', productIds)
            .input('CUSTOMERID', apiHelper.getValueFromObject(bodyParams, 'member_id'))
            .input('STOREID', apiHelper.getValueFromObject(bodyParams, 'store_id'))
            .execute('PT_EXCHANGEPOINT_GetListApplyOnOrder_App');

        let exchange_point_list = orderClass.exChangePoint(data.recordsets[0]);

        if (exchange_point_list.length > 0) {
            return new ServiceResponse(true, '', exchange_point_list);
        }

        return new ServiceResponse(true, 'Không có chương trình tích điểm áp dụng ', null);
    } catch (e) {
        logger.error(e, { function: 'orderService.getExchangePoint' });
        return new ServiceResponse(true, '', []);
    }
};

//Tạo chữ ký cho đơn hàng
const updateSignature = async bodyParams => {
    try {
        let signature = apiHelper.getValueFromObject(bodyParams, 'signature');
        if (signature) {
            const path_signature = await fileHelper.saveFile(signature, folderName);
            if (path_signature) {
                signature = path_signature;
            } else {
                signature = null;
            }
        }

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('ORDERID', apiHelper.getValueFromObject(bodyParams, 'order_id'))
            .input('SIGNATURE', signature)

            .execute('SL_ORDER_UpdateSignature_App');
        if (!data.recordset[0].RESULT) {
            return new ServiceResponse(false, 'Tạo chữ ký thất bại !');
        }
        return new ServiceResponse(true, 'Tạo chữ ký thành công', null);
    } catch (e) {
        logger.error(e, { function: 'orderService.updateSignature' });
        return new ServiceResponse(false, e.message);
    }
};

const sendMultipleMessage_V4_post_json = async (bodyParams = {}) => {
    try {
        const res = await httpClient.post(`/SendMultipleMessage_V4_post_json`, {
            ApiKey: config.smsBrandname.ApiKey,
            SecretKey: config.smsBrandname.SecretKey,
            Phone: apiHelper.getValueFromObject(bodyParams, 'phone'), // Số điện thoại nhận tin
            Content: apiHelper.getValueFromObject(bodyParams, 'content'), // Nội dung tin nhắn
            Brandname: apiHelper.getValueFromObject(bodyParams, 'brandname'), // Tên Brandname (tên công ty hay tổ chức khi gửi tin sẽ hiển thị trên tin nhắn đó).
            SmsType: 2,
            IsUnicode: apiHelper.getValueFromObject(bodyParams, 'is_unicode', 0), // Gửi nội dung có dấu
            Sandbox: apiHelper.getValueFromObject(bodyParams, 'sandbox', config.smsBrandname.Sandbox), // 1: Tin thử nghiệm, không gửi tin nhắn, chỉ trả về kết quả SMS, tin không lưu hệ thống và không trừ tiền. 0: Không thử nghiệm, tin đi thật.
            campaignid: apiHelper.getValueFromObject(bodyParams, 'campaign_id'), // Tên chiến dịch gửi tin.
            RequestId: apiHelper.getValueFromObject(bodyParams, 'request_id'), // ID Tin nhắn của đối tác, dùng để kiểm tra ID này đã được hệ thống esms tiếp nhận trước đó hay chưa.
            CallbackUrl: apiHelper.getValueFromObject(
                bodyParams,
                'callback_url',
                config.appUrl + '/task/care/sms/update-status',
            ), // Kết quả tin nhắn eSMS trả về
        });

        if ((res && res.status === 200) || +res.data.CodeResult === 100) {
            return new ServiceResponse(true, '', res.data);
        }

        return new ServiceResponse(false, responseCodes[res.data.CodeResult] || RESPONSE_MSG.REQUEST_FAILED);
    } catch (e) {
        logger.error(e, { function: 'SmsBrandnameService.sendMultipleMessage_V4_post_json' });

        return new ServiceResponse(false, e.message);
    }
};

const checkSendSmsOrZaloOA = async (bodyParams = {}) => {
    try {
        const pool = await mssql.pool;
        //Kiểm tra xem trạng thái đơn hàng có được gửi SMS hay ZaloOA hay không ?
        const dataOrderSendSMS = await pool
            .request()
            .input('ORDERSTATUSID', apiHelper.getValueFromObject(bodyParams, 'order_status_id'))
            .input('ORDERTYPEID', apiHelper.getValueFromObject(bodyParams, 'order_type_id'))
            .execute('SL_ORDER_CheckSendSmsOrZaloOA_App');

        return new ServiceResponse(true, 'ok', dataOrderSendSMS.recordset[0]);
    } catch (e) {
        logger.error(e, { function: 'orderService.checkSendSmsOrZaloOA' });
        return new ServiceResponse(false, '', {});
    }
};

//Cập nhật trạng thái đơn hàng
const updateOrderStatus = async bodyParams => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('ORDERID', apiHelper.getValueFromObject(bodyParams, 'order_id'))
            .input('ORDERSTATUSID', apiHelper.getValueFromObject(bodyParams, 'order_status_id'))
            .execute('SL_ORDER_UpdateOrderStatus_App');
        const order_id = data.recordset[0].RESULT;
        if (!order_id) {
            return new ServiceResponse(false, 'Cập nhật trạng thái thất bại !');
        }
        let dataOrderSendSMS = await checkSendSmsOrZaloOA({
            order_status_id: apiHelper.getValueFromObject(bodyParams, 'order_status_id'),
            order_type_id: apiHelper.getValueFromObject(bodyParams, 'order_type_id'),
        });
        if (dataOrderSendSMS.isFailed()) {
            return new ServiceResponse(false, 'Lỗi lấy thông tin gửi SMS và ZaloOA !');
        }

        const { ISSENDSMS, ISSENDZALOOA, CONTENTSMS, BRANDNAME } = dataOrderSendSMS.getData();
        if (ISSENDSMS) {
            const serviceResSendSmsOrZaloOA = await sendMultipleMessage_V4_post_json({
                phone: apiHelper.getValueFromObject(bodyParams, 'phone_number_receive'),
                content: CONTENTSMS,
                brandname: BRANDNAME,
            });
        }

        return new ServiceResponse(true, 'Cập nhật trạng thái thành công', order_id);
    } catch (e) {
        logger.error(e, { function: 'orderService.updateOrderStatus' });
        return new ServiceResponse(false, e.message);
    }
};

const checkReceiveSlip = async bodyParams => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('ORDERID', apiHelper.getValueFromObject(bodyParams, 'order_id'))
            .input('PAYMENTFORMID', apiHelper.getValueFromObject(bodyParams, 'payment_form_id')) // Hình thức thanh toán
            .input('BANKID', apiHelper.getValueFromObject(bodyParams, 'bank_id')) //Id của ngân hàng thanh toán
            .input('TOTALMONEY', apiHelper.getValueFromObject(bodyParams, 'payment_value')) //Tổng tiền đã thanh toán khi quét QR
            .input('TOTALBANK', apiHelper.getValueFromObject(bodyParams, 'total_bank')) //Tổng tiền đã thanh toán qua ngân hàng
            .execute('SL_ORDER_CheckReceiveSlip_App');
        if (data.recordset[0].ISPAYMENTSTATUS == 0) {
            return new ServiceResponse(false, 'Chưa thanh toán!', { status: 1, message: 'Chưa thanh toán!' });
        } else if (data.recordset[0].ISPAYMENTSTATUS == 1) {
            return new ServiceResponse(true, 'Thanh toán thành công ', { status: 1, message: 'Thanh toán thành công' });
        }
    } catch (e) {
        logger.error(e, { function: 'orderService.checkReceiveSlip' });
        return new ServiceResponse(false, e.message);
    }
};

//Thanh toán bằng máy pos
const paymentOrderPos = async bodyParams => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    await transaction.begin();

    try {
        let order_id = apiHelper.getValueFromObject(bodyParams, 'order_id');
        let pre_order_no = apiHelper.getValueFromObject(bodyParams, 'pre_order_no');
        let receive_slip_id = null;

        if (pre_order_no) {
            //Nếu có pre_order_no thì lấy ra order no
            const dataPreOrder = await new sql.Request(transaction)
                .input('PREORDERNO', pre_order_no)
                .execute('SL_PREORDER_GetByPreOrderNo_App');
            const result = dataPreOrder.recordset[0]?.ORDERID;
            if (!result) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Không tìm thấy đơn hàng !');
            }
            order_id = result;
        }

        const data_payment = apiHelper
            .getValueFromObject(bodyParams, 'data_payment', [])
            .filter(item => item.payment_type == paymentType.POS);
        const created_user = apiHelper.getValueFromObject(bodyParams, 'auth_name');
        let payment_status = 0;

        if (data_payment && data_payment.length > 0) {
            //Lấy loại phiếu thu từ AppConfig
            const dataAppConfig = await new sql.Request(transaction)
                .input('KEYCONFIG', 'SL_ORDER_RECEIVETYPE')
                .execute('SYS_APPCONFIG_GetByKeyConfig_App');
            const value_config = dataAppConfig.recordset[0].VALUECONFIG;
            if (!value_config) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Lỗi lấy loại thu của phiếu thu trong đơn hàng !');
            }

            const requestReceiveslip = new sql.Request(transaction);
            const requestCreateReceiveslipOrder = new sql.Request(transaction);
            const requestCreatePos = new sql.Request(transaction);
            const description = apiHelper.getValueFromObject(bodyParams, 'description', '');
            const auth_name = apiHelper.getValueFromObject(bodyParams, 'auth_name', '');

            for (let i = 0; i < data_payment.length; i++) {
                const itemPayment = data_payment[i];
                const totalMoney = apiHelper.getValueFromObject(itemPayment, 'payment_value', 0);
                const data = await requestReceiveslip
                    .input('COMPANYID', apiHelper.getValueFromObject(bodyParams, 'company_id'))
                    .input('BUSINESSID', apiHelper.getValueFromObject(bodyParams, 'business_id'))
                    .input('STOREID', apiHelper.getValueFromObject(bodyParams, 'store_id'))
                    .input('RECEIVETYPEID', value_config)
                    .input('BANKACCOUNTID', apiHelper.getValueFromObject(itemPayment, 'bank_id', null))
                    .input('CASHIERID', auth_name)
                    .input('MEMBERID', apiHelper.getValueFromObject(bodyParams, 'member_id'))
                    .input('PAYMENTFORMID', apiHelper.getValueFromObject(itemPayment, 'payment_form_id'))
                    .input('DESCRIPTIONS', description)
                    .input('TOTALMONEY', totalMoney)
                    .input('NOTES', description)
                    .input('CREATEDUSER', auth_name)
                    .input('ISACTIVE', 1)
                    .input('ISREVIEW', 1)
                    .input('PAYMENTSTATUS', 1) // trạng thái đã thanh toán
                    .input('PAYMENTTYPE', paymentType.POS) // Khách hàng
                    .input('ORDERID', order_id) //Đơn hàng

                    .execute('SL_RECEIVESLIP_CreateOrUpdateForOrder_App');
                const receiveslipId = data.recordset[0].RESULT;
                receive_slip_id = receiveslipId;

                if (receiveslipId <= 0) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Lỗi khi tạo phiếu thu');
                }

                // Tạo hạch toán
                const accountingData = {
                    auth_name,
                    receiveslip_id: receiveslipId,
                    money: totalMoney,
                    descriptions: description,
                    order_id,
                    payment_form_id: apiHelper.getValueFromObject(itemPayment, 'payment_form_id'),
                };
                const result = await _createAccounting(accountingData, transaction);
                if (!result) {
                    throw new Error('Lỗi khi tạo hoạch toán');
                }

                const dataCreateReceiveslipOrder = await requestCreateReceiveslipOrder
                    .input('RECEIVESLIPID', receiveslipId)
                    .input('ORDERID', order_id)
                    .input('TOTALMONEY', apiHelper.getValueFromObject(itemPayment, 'payment_value'))
                    .input('CREATEDUSER', auth_name)
                    .input('PAYMENTFORMID', apiHelper.getValueFromObject(itemPayment, 'payment_form_id'))
                    .execute('SL_RECEIVESLIP_ORDER_CreateOrUpdate_App');

                const targetResult =
                    dataCreateReceiveslipOrder?.recordsets?.find(
                        recordset =>
                            recordset?.[0]?.RESULT &&
                            recordset?.[0]?.ISVALIDRECEIVESLIPORDER &&
                            recordset?.[0]?.ORDERNO &&
                            recordset?.[0]?.PAYMENTSTATUS,
                    )?.[0] || {};

                const {
                    RESULT: receiveslipOrder,
                    ISVALIDRECEIVESLIPORDER: isValid,
                    ORDERNO: orderNo,
                    OPAYMENTSTATUS,
                } = targetResult;

                if (!isValid) {
                    await transaction.rollback();
                    return new ServiceResponse(false, `Đơn hàng ${orderNo} đã thu đủ tiền.`);
                }
                if (receiveslipOrder <= 0) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Tạo phiếu thu với đơn hàng thất bại');
                }

                if (OPAYMENTSTATUS == 1) {
                    payment_status = OPAYMENTSTATUS;
                }

                //Lưu Transaction từ máy pos
                const dataCreatePos = await requestCreatePos
                    .input('RECEIVESLIPID', receiveslipId)
                    .input('ORDERID', order_id)

                    .input('AMOUNT', apiHelper.getValueFromObject(itemPayment, 'AMOUNT'))
                    .input('APPV_CODE', apiHelper.getValueFromObject(itemPayment, 'APPV_CODE'))
                    .input('CARD_TYPE', apiHelper.getValueFromObject(itemPayment, 'CARD_TYPE'))
                    .input('DATE', apiHelper.getValueFromObject(itemPayment, 'DATE'))
                    .input('INVOICE', apiHelper.getValueFromObject(itemPayment, 'INVOICE'))

                    .input('MERCHANT_CODE', apiHelper.getValueFromObject(itemPayment, 'MERCHANT_CODE'))
                    .input('NAME', apiHelper.getValueFromObject(itemPayment, 'NAME'))
                    .input('PAN', apiHelper.getValueFromObject(itemPayment, 'PAN'))
                    .input('PROC_CODE', apiHelper.getValueFromObject(itemPayment, 'PROC_CODE'))
                    .input('REF_NO', apiHelper.getValueFromObject(itemPayment, 'REF_NO'))

                    .input('RESPONSE_CODE', apiHelper.getValueFromObject(itemPayment, 'RESPONSE_CODE'))
                    .input('SEND', apiHelper.getValueFromObject(itemPayment, 'SEND'))
                    .input('TERMINAL_ID', apiHelper.getValueFromObject(itemPayment, 'TERMINAL_ID'))
                    .input('TIME', apiHelper.getValueFromObject(itemPayment, 'TIME'))
                    .input('APP', apiHelper.getValueFromObject(itemPayment, 'APP'))

                    .input('TXN_TYPE', apiHelper.getValueFromObject(itemPayment, 'TXN_TYPE'))
                    .input('CREATEDUSER', auth_name)

                    .execute('PM_POSMACHINE_Create_App');
                const posmachineId = dataCreatePos.recordset[0].RESULT;
                if (posmachineId <= 0) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Lỗi lưu thông tin máy POS !');
                }
            }
        }

        // đã xuất kho trong trigger
        //Tạo phiếu xuất kho cho đơn hàng và xuất kho luôn
        // if (payment_status == 1) {
        //     // Xóa phiếu đã có trước đó theo đơn hàng
        //     const reqDeleteStocksOutRequest = new sql.Request(transaction);
        //     const resDeleteStocksOutRequest = await reqDeleteStocksOutRequest
        //         .input('ORDERID', order_id)
        //         .input('DELETEDUSER', created_user)
        //         .execute('ST_STOCKSOUTREQUEST_DeleteByOrder_App');
        //     if (!apiHelper.getResult(resDeleteStocksOutRequest.recordset)) {
        //         await transaction.rollback();
        //         return new ServiceResponse(false, 'Có lỗi xảy ra');
        //     }
        //     const reqDeleteStocksOutRequestDetail = new sql.Request(transaction);
        //     const resDeleteStocksOutRequestDetail = await reqDeleteStocksOutRequestDetail
        //         .input('ORDERID', order_id)
        //         .input('DELETEDUSER', created_user)
        //         .execute('ST_STOCKSOUTREQUESTDETAIL_DeleteByOrder_App');
        //     if (!apiHelper.getResult(resDeleteStocksOutRequestDetail.recordset)) {
        //         await transaction.rollback();
        //         return new ServiceResponse(false, 'Có lỗi xảy ra');
        //     }
        //     //Lấy danh sách kho và sản phẩm trong đơn hàng
        //     const reqGetProductByOrderID = new sql.Request(transaction);
        //     const resGetProductByOrderID = await reqGetProductByOrderID
        //         .input('ORDERID', order_id)
        //         .execute('SL_ORDERDETAIL_GetByOrderID_App');
        //     const list_stock = stocksOutRequestClass.listStock(resGetProductByOrderID.recordsets[0]);
        //     const list_order_detail = stocksOutRequestClass.listStock(resGetProductByOrderID.recordsets[1]);

        //     if (list_stock?.length > 0) {
        //         const reqCreateStocksOutRequest = new sql.Request(transaction);
        //         const reqCreateStocksOutRequestDetail = new sql.Request(transaction);
        //         const reqStocksDetail = new sql.Request(transaction);

        //         for (const element of list_stock) {
        //             const resCreateStocksOutRequest = await reqCreateStocksOutRequest
        //                 .input('ORDERID', order_id)
        //                 .input('STOCKSID', element.stocks_id)
        //                 .input('CREATEDUSER', created_user)
        //                 .execute('ST_STOCKSOUTREQUEST_CreateByOrder_App');
        //             const result = apiHelper.getResult(resCreateStocksOutRequest.recordset);
        //             if (!result) {
        //                 await transaction.rollback();
        //                 return new ServiceResponse(false, 'Có lỗi xảy ra');
        //             }

        //             const resCreateStocksOutRequestDetail = await reqCreateStocksOutRequestDetail
        //                 .input('ORDERID', order_id)
        //                 .input('STOCKSOUTREQUESTID', result)
        //                 .input(
        //                     'LISTORDERDETAIL',
        //                     list_order_detail
        //                         .filter(x => x.stocks_id === element.stocks_id)
        //                         .map(x => x.order_detail_id)
        //                         .join(','),
        //                 )
        //                 .input('CREATEDUSER', created_user)
        //                 .execute('ST_STOCKSOUTREQUESTDETAIL_CreateByOrder_App');
        //             if (!apiHelper.getResult(resCreateStocksOutRequestDetail.recordset)) {
        //                 await transaction.rollback();
        //                 return new ServiceResponse(false, 'Có lỗi xảy ra');
        //             }

        //             //Xuất kho luôn ở chỗ này
        //             const dataStocksDetail = await reqStocksDetail
        //                 .input('STOCKSOUTREQUESTID', result)
        //                 .input('USERNAME', created_user)
        //                 .execute('ST_STOCKSOUTREQUEST_Outputted_App');
        //             if (!dataStocksDetail.recordset[0].RESULT) {
        //                 await transaction.rollback();
        //                 return new ServiceResponse(false, 'Xuất kho thất bại !');
        //             }
        //         }
        //     } else {
        //         await transaction.rollback();
        //         return new ServiceResponse(false, 'Không tìm thấy sản phẩm trong đơn hàng');
        //     }
        // }

        await transaction.commit();
        return new ServiceResponse(true, 'Thanh toán thành công ', { order_id, receive_slip_id });
    } catch (e) {
        logger.error(e, { function: 'orderService.paymentOrderPos' });
        await transaction.rollback();
        return new ServiceResponse(false, 'Thanh toán thất bại !');
    }
};

const exportPreOrderPdf = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;

        let order_id;
        const pre_order_no = apiHelper.getValueFromObject(queryParams, 'pre_order_no');

        const dataPreOrder = await pool
            .request()
            .input('PREORDERNO', pre_order_no)
            .execute('SL_PREORDER_GetByPreOrderNo_App');
        const result = dataPreOrder.recordset[0]?.ORDERID;
        if (!result) {
            return new ServiceResponse(false, 'Không tìm thấy đơn hàng !');
        }
        order_id = result;

        const data = await pool.request().input('ORDERID', order_id).execute('SL_ORDER_GetPreOrderById_AdminWeb');

        if (data?.recordset?.[0]) {
            let order = orderClass.preOrderDetail(data?.recordset?.[0]);

            order.total_money = formatCurrency(order.total_money, 0);
            order.pre_money = formatCurrency(order.pre_money, 0);
            order.total_amount = formatCurrency(order.total_amount, 0);

            const fileName = `Don_hang_pre_${moment().format('DDMMYYYY_HHmmss')}_${order_id}`;

            // const html = await ejs.renderFile(`${appRoot}/app/templates/pdf/print-file/${'viewPreOrder.ejs'}`, {
            //     data: order,
            // });

            // return new ServiceResponse(true, '', {html: html});
            const print_params = {
                template:
                    moment(order.created_date, 'DD-MM-YYYY').diff(moment('29/09/2021', 'DD-MM-YYYY'), 'seconds') >= 0 &&
                        order.product_name?.includes('iPhone 15 Pro Max')
                        ? 'viewPreOrder1.ejs'
                        : 'viewPreOrder.ejs',
                data: order,
                filename: fileName,
                format: 'A4',
                landscape: false,
                isOnlyFirstPage: true,
            };
            await pdfHelper.printPDF(print_params);

            return new ServiceResponse(true, '', { path: `${config.domain_cdn}/app-pdf/${fileName}.pdf` });
        }

        return new ServiceResponse(false, 'Không tìm thấy đơn hàng.');
    } catch (e) {
        logger.error(e, { function: 'order.service.exportPreOrderPdf' });
        return new ServiceResponse(false, e.message || e);
    }
};

const getPreOrderCoupon = async (queryParams = {}) => {
    try {
        const order_id = apiHelper.getValueFromObject(queryParams, 'order_id');
        const coupon_code = apiHelper.getValueFromObject(queryParams, 'coupon_code');
        const pool = await mssql.pool;

        const data = await pool
            .request()
            .input('ORDERID', order_id)
            .input('COUPONCODE', coupon_code)
            .execute('SL_PREORDER_getCoupon_AdminWeb');

        return new ServiceResponse(true, '', { discount_value: data?.recordset?.[0].DISCOUNTVALUE });
    } catch (e) {
        logger.error(e, { function: 'order.service.getPreOrderCoupon' });
        return new ServiceResponse(false, e.message, null);
    }
};

const checkOrderExistFromPreOrder = async (queryParams = {}) => {
    try {
        const pre_order_id = apiHelper.getValueFromObject(queryParams, 'pre_order_id');
        const pool = await mssql.pool;

        const data = await pool.request().input('PREORDERID', pre_order_id).execute('SL_PREORDER_CheckCreateOrder_App');

        if (data?.recordset?.[0]?.RESULT) {
            return new ServiceResponse(true, '');
        }

        return new ServiceResponse(false, 'Không tìm thấy đơn hàng.');
    } catch (e) {
        logger.error(e, { function: 'order.service.checkOrderExistFromPreOrder' });
        return new ServiceResponse(false, e.message, null);
    }
};

module.exports = {
    getListOrder,
    getOrderStatusOptions,
    detailOrder,
    detailOrderByOrderNo,
    createOrUpdateOrder,
    createCustomerDelivery,
    exportPDF,
    createOrderNo,
    deleteOrder,
    cancelOrder,
    getDetailOrderForReceiveslip,
    getListPromotion,
    getListProductByStore,
    checkOrderExist,
    getOptionUser,
    getBankAccountOptions,
    getListStoreByUser,
    getOrderTypeOptions,
    getDetailProductByImei,
    getShiftInfo,
    getCoupon,
    paymentOrder,
    getListPromotionApplied,
    getExchangePoint,
    checkCouponApply,
    updateSignature,
    sendMultipleMessage_V4_post_json,
    checkSendSmsOrZaloOA,
    updateOrderStatus,
    checkReceiveSlip,
    paymentOrderPos,
    exportPreOrderPdf,
    getPreOrderCoupon,
    checkOrderExistFromPreOrder,
    _createAccounting,
};
