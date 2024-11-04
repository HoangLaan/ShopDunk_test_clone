const orderClass = require('./order.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const moment = require('moment');
const pdfHelper = require('../../common/helpers/pdf.helper');
const qrHelper = require('../../common/helpers/qr.helper');
let xl = require('excel4node');
const API_CONST = require('../../common/const/api.const');
const _ = require('lodash');
const { getListByStore } = require('../payment-form/payment-form.service');
const { formatCurrency } = require('../../common/helpers/numberFormat');
const { convertErrorCode, checkMinMax, getValueInArrayInArray, getValueAndConcatInArrayByField } = require('./ultils');
const { orderType, PAYMENT_STATUS, PAYMENT_TYPE } = require('./ultils/constants');
const { checkJsonByArrayKey, convertPaymentStatus, convertPaymentType, addLeadingZero } = require('./utils');
const fileHelper = require('../../common/helpers/file.helper');

const {
    createOrUpdate: createOtherAccVoucher,
    genCode: genOtherVoucherCode,
} = require('../other-voucher/other-voucher.service');
const { VOUCHER_TYPE, OBJECT_TYPE } = require('../other-voucher/constant');
const { error } = require('console');
const config = require('../../../config/config');
const { getListCoupon } = require('../coupon/coupon.service');

/**
 * Get list
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListOrder = async (queryParams = {}, bodyParams) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = 10;
        const keyword = apiHelper.getSearch(queryParams);
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('KEYWORD', keyword?.trim())
            .input('DELIVERYTYPE', apiHelper.getValueFromObject(queryParams, 'is_delivery_type'))
            .input('PROVINCEID', apiHelper.getValueFromObject(queryParams, 'provice_id'))
            .input('DISTRICTID', apiHelper.getValueFromObject(queryParams, 'district_id'))
            .input('PAYMENTSTATUS', apiHelper.getValueFromObject(queryParams, 'payment_status'))
            .input('VATEXPORTSTATUS', apiHelper.getValueFromObject(queryParams, 'vat_export_status'))
            .input('ORDERTYPEID', apiHelper.getValueFromObject(queryParams, 'order_type_id'))
            .input('ORDERSTATUSID', apiHelper.getValueFromObject(queryParams, 'order_status'))
            // .input('ORDERSOURCE', apiHelper.getValueFromObject(queryParams, 'order_source'))
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'date_from'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'date_to'))
            // .input('COMPANYID', apiHelper.getValueFromObject(queryParams, 'company_id'))
            .input('BUSINESSID', apiHelper.getValueFromObject(queryParams, 'business_id'))
            .input('STOREID', apiHelper.getValueFromObject(queryParams, 'store_id'))
            .input('USERNAME', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('SL_ORDER_GetList_V1_AdminWeb');

        const Orders = data.recordsets[0];

        const totalItem = data.recordset && data.recordset.length ? data.recordset[0].TOTAL : 0;
        let order = orderClass.list(Orders);
        order = order.map((ele) => {
            if (ele.order_type === 2 && ele.order_status_id != 28) {
                ele.total_amount = 0;
            }
            return ele;
        });

        const calPrices = {
            cal_total_apply_discount: data.recordsets[1][0].CALTOTALAPPLYDISCOUNT ?? 0,
            cal_total_paid: data.recordsets[2][0].CALTOTALPAID ?? 0,
            cal_total_amount: data.recordsets[3][0].CALTOTALAMOUNT ?? 0,
        };

        return new ServiceResponse(true, '', {
            data: order,
            page: currentPage,
            limit: itemsPerPage,
            total: totalItem,
            dataCalPrices: calPrices,
        });
    } catch (e) {
        logger.error(e, { function: 'orderService.getListOrder' });
        return new ServiceResponse(true, '', {});
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
            .execute('SL_ORDERDETAIL_GetByIdForSTORQ_AdminWeb');

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
                products[i].product_business = business.map((bus) => ({
                    ...bus,
                    ...{ value: bus.id, label: bus.name },
                }));
                products[i].product_area = area.map((area) => ({
                    ...area,
                    ...{ value: area.id, label: area.name },
                }));
                products[i].product_output_type = output_type.map((outputtype) => ({
                    ...outputtype,
                    ...{ value: outputtype.id, label: outputtype.name },
                }));
                products[i].product_unit = unit.map((u) => ({
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
        order.customer = Boolean(+order.member_id) ? `KH${order.member_id}` : `TN${order.dataleads_id}`;
        order.stock = `${order.stocks_id}-${order.is_stocks}`;
        order.items = products;
        return new ServiceResponse(true, '', order);
    } catch (e) {
        logger.error(e, { function: 'orderService.getListOrder' });
        return new ServiceResponse(false, e.message);
    }
};

const checkOrderExist = async (orderId) => {
    try {
        const pool = await mssql.pool;

        const dataCheck = await pool.request().input('ORDERID', orderId).execute('SL_ORDER_checkExistsOrder_AdminWeb');

        if (dataCheck.recordset && dataCheck.recordset[0].RESULT == 0) {
            return new ServiceResponse(false, 'Order not exists');
        }

        return new ServiceResponse(true, '');
    } catch (e) {
        logger.error(e, { function: 'orderService.createReasonCancel' });
        return new ServiceResponse(false, 'Order not exists');
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

        products = products.map((product) => {
            return {
                ...product,
                attribute_list: attributeValue
                    .filter((v) => v.model_id == product.model_id)
                    .reduce((acc, cur) => {
                        const {
                            product_attribute_id,
                            attribute_name,
                            attribute_value,
                            attribute_value_id,
                            is_checked,
                        } = cur;
                        const index = acc.findIndex((v) => v.product_attribute_id === product_attribute_id);

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

const detailOrder = async (orderId, orderNo, is_out_stocks = 0, view_detail = 0) => {
    try {
        const pool = await mssql.pool;
        // kiem tra neu k co orderId ma co orderNo thi se lay orderId tu orderNo
        if (!orderId && orderNo) {
            const orderNoReq = await pool
                .request()
                .input('ORDERNO', orderNo)
                .execute('SL_ORDER_GETIDBYORDERNO_AdminWeb');
            if (orderNoReq.recordset.length) {
                orderId = orderNoReq.recordset[0].ORDERID;
            }
        }
        // order
        const data = await pool.request().input('ORDERID', orderId).execute('SL_ORDER_GetById_AdminWeb');
        if (!data.recordset || !data.recordset.length) {
            return new ServiceResponse(
                false,
                'Đơn hàng không tồn tại hoặc số đơn hàng truyền vào không hợp lệ. Vui lòng chọn kho xuất và thử lại!',
            );
        }
        let order = orderClass.detail(data.recordset[0]);
        order.presenter = order?.presenter_member_id
            ? {
                  value: `CN_${order?.presenter_member_id}`,
                  label: data.recordset[0]?.PRESENTERMEMBERLABEL,
              }
            : order?.presenter_dataleads_id
              ? {
                    value: `TN_${order?.presenter_dataleads_id}`,
                    label: data.recordset[0]?.PRESENTERDATALEADSLABEL,
                }
              : null;

        order.stocks_out_request_ids = order?.stocks_out_request_ids?.split('|') || [];
        const commissions = orderClass.commision(data.recordsets[1]);

        order.is_valid_order = true;
        delete order.coupon;
        order.coupon = orderClass.detaiCoupon(data.recordsets[2]) ?? [];
        let total_discount = 0;
        if (order && order?.coupon_code && order?.discount_money) {
            const discountMoney = order?.discount_money;
            if (discountMoney && discountMoney > 0) {
                let parInDiscount = parseInt(discountMoney) ?? 0;
                total_discount += parInDiscount;
            }
        }
        if (order.coupon && order.coupon?.length > 0) {
            for (let i = 0; i < order.coupon?.length; i++) {
                if (order.coupon[i].total_discount) {
                    const checkNumber = parseInt(order.coupon[i].total_discount) ?? 0;
                    total_discount += checkNumber;
                }
            }
        }
        // ĐÃ TÍNH Ở FRONTEND
        // const discount_coupon = total_discount;
        // order.discount_coupon = discount_coupon;

        // detail order
        const productReq = await pool.request().input('ORDERID', orderId).execute('SL_ORDERDETAIL_GetById_AdminWeb');
        let products = orderClass.product(productReq.recordset);
        const giftImeis = orderClass.giftImei(productReq.recordsets[6]);

        const output_type = orderClass.optionsInit(productReq.recordsets[1]) || [];
        const area = orderClass.optionsInit(productReq.recordsets[2]) || [];
        const store = orderClass.optionsInit(productReq.recordsets[3]) || [];

        let materials = orderClass.material(productReq.recordsets[4]) || [];
        const salesassistant = orderClass.salesassistant(productReq.recordsets[7]) || [];
        order.salesassistant = salesassistant[0].salesassistant;

        const checkedDataPayment = orderClass.checkedDataPayment(productReq.recordsets[5]) || [];

        // map lại danh sách túi, bao bì
        materials = materials.reduce((acc, cur) => {
            const findIndex = acc.findIndex((v) => v.material_id === cur.material_id);
            if (findIndex === -1) {
                acc = [
                    ...acc,
                    {
                        material_id: cur.material_id,
                        material_name: cur.material_name,
                        material_code: cur.material_code,
                        material_group_name: cur.material_group_name,
                        manufacturer_name: cur.manufacturer_name,
                        quantity: 1,
                        imei_codes: [
                            {
                                value: cur.material_imei_code,
                                label: cur.material_imei_code,
                                imei: cur.material_imei_code,
                            },
                        ],
                    },
                ];
            } else {
                acc[findIndex].imei_codes = [
                    ...acc[findIndex].imei_codes,
                    {
                        value: cur.material_imei_code,
                        label: cur.material_imei_code,
                        imei: cur.material_imei_code,
                    },
                ];

                acc[findIndex].quantity = acc[findIndex].imei_codes.length;
            }

            return acc;
        }, []);

        let total_length = 0,
            total_quantity = 0;

        if (order.order_type == orderType.PREORDER) {
            products = (products || []).reduce((acc, curr) => {
                const findIndex = acc.findIndex((p) => p.product_id == curr.product_id);
                if (findIndex == -1) {
                    acc = [
                        ...acc,
                        {
                            ...curr,
                            imei_codes: Boolean(curr.imei_code)
                                ? [
                                      {
                                          imei: curr.imei_code,
                                          value: curr.imei_code,
                                          label: curr.imei_code,
                                      },
                                  ]
                                : [],
                            quantity: 1,
                        },
                    ];
                } else {
                    acc[findIndex] = {
                        ...acc[findIndex],
                        quantity: acc[findIndex].quantity + 1,
                        imei_codes: Boolean(curr.imei_code)
                            ? [...acc[findIndex].imei_codes, { value: curr.imei_code, label: curr.imei_code }]
                            : acc[findIndex].imei_codes,
                    };
                }
                return acc;
            }, []);
        }

        // map lấy danh sách hình thức xuất
        for (let i = 0; i < products.length; i++) {
            // Tính tổng các thông số
            const {
                product_id,
                product_code,
                product_name,
                quantity = 0,
                store_name = '',
                area_name = '',
                unit_name = '',
                total_price: total_money,
                vat_amount: total_vat = 0,
                price,
                area_id,
                store_id,
                output_type_name = '',
                vat_value,
                change_price,
                output_type_id,
                component_id,
                imei_code,
                product_type,
                base_price,
                total_price_base,
            } = products[i];
            total_quantity += 1 * quantity;

            products[i] = {
                ...products[i],
                ...{
                    total_vat,
                    vat_value,
                    total_length,
                    product_id,
                    product_name,
                    product_code,
                    component_id,
                    imei_code,
                    product_type,
                    price,
                    quantity: quantity,
                    total_money,
                    product_output_type_id: output_type_id * 1,
                    area_id: area_id + '',
                    store_id: store_id + '',
                    change_price,
                    product_unit_name: unit_name,
                    price_default: {
                        price,
                        change_price,
                        vat_value,
                        price_unit_name: unit_name,
                    },
                    // total_price_base: base_price * quantity,
                    total_price_base: total_price_base || base_price * quantity,
                },
            };

            products[i].product_store = store
                .filter((x) => x.product_id === products[i].product_id)
                .map((bus) => ({
                    ...bus,
                    ...{ value: bus.id, label: bus.name },
                }));
            products[i].product_area = area
                .filter((y) => y.product_id === products[i].product_id)
                .map((area) => ({
                    ...area,
                    ...{ value: area.id, label: area.name },
                }));
            products[i].product_output_type = output_type
                .filter(
                    (outputType) =>
                        outputType.product_id == products[i].product_id &&
                        (outputType.imei_code == null || products[i].imei_code == outputType.imei_code),
                )
                .map((outputtype) => ({
                    ...outputtype,
                    ...{ value: outputtype.id, label: outputtype.name },
                }));

            // Kiem tra neu trong danh sach HTX, Co so va khu vuc khong co ton tai sau khi da tao don hang thi them vao
            const order_output_type_idx = (products[i].product_output_type || []).findIndex(
                (v) => v.value == output_type_id,
            );
            if (order_output_type_idx < 0) {
                // Neu khong co thi them vao
                products[i].product_output_type = [
                    ...products[i].product_output_type,
                    ...[
                        {
                            value: parseInt(output_type_id),
                            label: output_type_name,
                            output_type_id,
                            output_type_name,
                            id: output_type_id,
                            name: output_type_name,
                        },
                    ],
                ];
            }
            // Khu vuc
            const order_area_idx = (products[i].product_area || []).findIndex((v) => v.value == area_id);
            if (order_area_idx < 0) {
                // Neu khong co thi them vao
                products[i].product_area = [
                    ...products[i].product_area,
                    ...[
                        {
                            value: area_id,
                            label: area_name,
                            area_id,
                            area_name,
                            id: area_id,
                            name: area_name,
                        },
                    ],
                ];
            }
            // Co so
            const order_store_idx = (products[i].product_store || []).findIndex((v) => v.value == store_id);
            if (order_store_idx < 0) {
                // Neu khong co thi them vao
                products[i].product_store = [
                    ...products[i].product_store,
                    ...[
                        {
                            value: store_id,
                            label: store_name,
                            store_id,
                            store_name,
                            id: store_id,
                            name: store_name,
                        },
                    ],
                ];
            }
            // kiem tra neu k co du lieu lam gia thi set default cac gia tri truoc do
            // co so lam gia
            if (!products[i].product_store || !products[i].product_store.length) {
                products[i].product_store = [
                    {
                        value: store_id,
                        label: store_name,
                        store_id,
                        store_name,
                    },
                ];
            }
            // khu vuc lam gia
            if (!products[i].product_area || !products[i].product_area.length) {
                products[i].product_area = [{ value: area_id, label: area_name, area_id, area_name }];
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
        }
        // Lấy khuyến mãi đã áp dụng cho đơn hàng
        order.promotion_apply = (await getListPromotionApplied(orderId)).getData();
        const getDiscountPromotion = getValueInArrayInArray(order.promotion_apply, 'offers', 'discount', 0);
        total_discount = parseInt(total_discount) ?? 0;
        total_discount = total_discount + getDiscountPromotion;
        order.discount_value = total_discount;
        order.total_discount = total_discount;
        // Cập nhật giá trị cho order
        order.total_quantity = total_quantity;
        order.customer = {
            value: Boolean(+order.member_id) ? `KH${order.member_id}` : `TN${order.dataleads_id}`,
            label: order.customer_code + '-' + order.customer_name,
        };
        order.stock = `${order.stocks_id}-${order.is_stocks}`;

        order.commissions = commissions || [];

        order.gifts = products
            .filter((v) => Boolean(v.is_promotion_gift))
            .reduce((a, v) => {
                const findIndex = a.findIndex(
                    (x) =>
                        x.promotion_id === v.promotion_id && x.promotion_offer_apply_id === v.promotion_offer_apply_id,
                );

                // nếu chưa có thì thêm mới cùng ds imei và imei options
                if (findIndex < 0) {
                    if (v.imei_code) {
                        v.imei_codes = [
                            {
                                value: v.imei_code,
                                label: v.imei_code,
                            },
                        ];
                    }

                    // options quà tặng
                    v.imei_code_options = giftImeis
                        .filter((giftImei) => +giftImei.product_id === +v.product_id && giftImei.product_imei_code)
                        .map((giftImei) => ({
                            value: giftImei.product_imei_code,
                            label: giftImei.product_imei_code,
                            stock_id: giftImei.stock_id,
                        }));

                    return [...a, v];
                }

                // nếu có rồi thì thêm imei vào ds imei
                if (v.imei_code) {
                    a[findIndex].imei_codes = [
                        ...a[findIndex].imei_codes,
                        {
                            value: v.imei_code,
                            label: v.imei_code,
                        },
                    ];
                }

                return a;
            }, []);

        if (order.order_type == orderType.PREORDER) {
            order.products = products
                .filter((v) => !Boolean(v.is_promotion_gift))
                .reduce((a, v) => {
                    if (v.product_id) {
                        return { ...a, [v.product_id]: v };
                    }

                    return a;
                }, {});
        } else {
            order.products = products
                .filter((v) => !Boolean(v.is_promotion_gift))
                .reduce((a, v) => {
                    if (v.imei_code) {
                        return { ...a, [v.imei_code]: v };
                    }

                    return a;
                }, {});
        }

        order.materials = materials;

        const res = await getListByStore(order.store_id);

        if (res.isFailed()) {
            return res;
        }

        let data_payment = res.getData();
        data_payment = data_payment.map((item) => {
            const savedPayment = checkedDataPayment.find((x) => x.payment_form_id == item.payment_form_id);
            if (savedPayment) {
                return {
                    ...item,
                    is_checked: 1,
                    payment_value: savedPayment.payment_value,
                };
            }

            return item;
        });

        order.data_payment = data_payment;

        // Lấy thông tin khách hàng và xuất hàng với khách hàng là business khi là loại đơn hàng nội bộ
        if (parseInt(order.order_type) === orderType.INTERNAL) {
            const businessRes = await getBusinessInfo({ order_id: order.order_id });
            if (businessRes.isFailed()) return new ServiceResponse(false, businessRes.getMessage(), order);
            order = {
                ...order,
                ...businessRes.getData(),
            };
        }
        return new ServiceResponse(true, '', order);
    } catch (e) {
        logger.error(e, { function: 'orderService.getListOrder' });
        return new ServiceResponse(false, e.message);
    }
};

const getBusinessInfo = async (bodyParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('ORDERID', apiHelper.getValueFromObject(bodyParams, 'order_id'))
            .execute('SL_ORDER_GetBusinessInfo_AdminWeb');
        const [bussinessReiceiveRecord, bussinessTransferRecord] = data.recordsets;

        return new ServiceResponse(true, 'Lấy thông tin chi nhánh thành công', {
            business_receive: orderClass.businessInfo(bussinessReiceiveRecord[0]),
            business_transfer: orderClass.businessInfo(bussinessTransferRecord[0]),
        });
    } catch (e) {
        logger.error(e, { function: 'orderService.checkSendSmsOrZaloOA' });
        return new ServiceResponse(false, 'Lấy thông tin chi nhánh thất bại', {});
    }
};

const validatePromotionApply = (promotionApply, products) => {
    const pickedPromotion = promotionApply.filter((v) => v?.offers?.findIndex((x) => x?.is_picked) > -1);
    const isApplyWithOtherPromotion = pickedPromotion?.map((v) => v?.is_apply_with_other_promotion);

    // check khuyến mãi có được áp dụng cùng với khuyến mãi khác hay không
    const flag = isApplyWithOtherPromotion?.[0];
    isApplyWithOtherPromotion?.forEach((v) => {
        if (v !== flag) {
            throw new Error('001');
        }
    });
};

const createOrUpdateOrder = async (bodyParams) => {
    const pool = await mssql.pool;
    const transaction = new sql.Transaction(pool);
    await transaction.begin();
    const order_id = apiHelper.getValueFromObject(bodyParams, 'order_id');

    try {
        const order_type = apiHelper.getValueFromObject(bodyParams, 'order_type');
        let products = apiHelper.getValueFromObject(bodyParams, 'products', {});
        let gifts = apiHelper.getValueFromObject(bodyParams, 'gifts', []);
        gifts = gifts.reduce((acc, value) => {
            const giftByImei =
                value?.imei_codes.map((imei) => {
                    const stock_id = value.imei_code_options?.find((x) => x.value == imei.value)?.stock_id;

                    return { ...value, imei_code: imei.value, is_promotion_gift: 1, stock_id };
                }) || [];

            acc = acc.concat(giftByImei);

            return acc;
        }, []);

        let giftsCoupon = [];
        giftsCoupon = gifts.reduce((acc, value) => {
            const giftByImei =
                value?.imei_codes.map((imei) => {
                    const stock_id = value.imei_code_options?.find((x) => x.value == imei.value)?.stock_id;

                    return { ...value, imei_code: imei.value, is_promotion_gift: 2, stock_id };
                }) || [];

            acc = acc.concat(giftByImei);

            return acc;
        }, []);

        products = Object.values(products || {});

        if (order_type == orderType.PREORDER) {
            products = (products || []).reduce((acc, curr) => {
                if (curr.imei_codes?.length) {
                    acc = [
                        ...acc,
                        ...curr.imei_codes.map((p) => ({
                            ...curr,
                            imei_code: p.value,
                        })),
                    ];
                } else {
                    acc = [...acc, curr];
                }
                return acc;
            }, []);
        }

        let materials = apiHelper.getValueFromObject(bodyParams, 'materials', []);
        materials = materials.reduce((acc, value) => {
            for (let i = 0; i < value.imei_codes?.length; i++) {
                acc = [
                    ...acc,
                    {
                        ...value,
                        imei_code: value.imei_codes[i].value,
                        stock_id: value.imei_codes[i].stock_id,
                    },
                ];
            }
            return acc;
        }, []);

        let shipping_fee = apiHelper.getValueFromObject(bodyParams, 'shipping_fee');

        let member_id = apiHelper.getValueFromObject(bodyParams, 'member_id');
        let dataleads_id = apiHelper.getValueFromObject(bodyParams, 'dataleads_id');
        let auth_name = apiHelper.getValueFromObject(bodyParams, 'auth_name');

        let promotion_apply = apiHelper.getValueFromObject(bodyParams, 'promotion_apply', []);

        validatePromotionApply(promotion_apply, products);

        const store_id = apiHelper.getValueFromObject(bodyParams, 'store_id');
        const total_a_mount = apiHelper.getValueFromObject(bodyParams, 'total_a_mount');
        let payment_status = apiHelper.getValueFromObject(bodyParams, 'payment_status');
        const button_type = apiHelper.getValueFromObject(bodyParams, 'button_type');

        let data_payment = apiHelper.getValueFromObject(bodyParams, 'data_payment', []);

        const presenter = apiHelper.getValueFromObject(bodyParams, 'presenter');
        let presenter_dataleads_id = null;
        let presenter_member_id = null;
        if (presenter) {
            const [prefix, id] = presenter.value.split('_');
            if (prefix === 'CN') {
                presenter_member_id = id;
            } else {
                presenter_dataleads_id = id;
            }
        }

        // Gọi store để insrert vào bảng SL_Order_detail
        const requestCreateOrUpdateOrder = new sql.Request(transaction);
        const data = await requestCreateOrUpdateOrder
            .input('ORDERID', order_id)
            .input('ORDERNO', apiHelper.getValueFromObject(bodyParams, 'order_no'))
            .input('ORDERTYPEID', apiHelper.getValueFromObject(bodyParams, 'order_type_id'))
            .input('INSTALLMENTFORMID', apiHelper.getValueFromObject(bodyParams, 'installment_form_id'))
            .input('INSTALLMENTTYPE', apiHelper.getValueFromObject(bodyParams, 'installment_type'))

            .input('MEMBERID', member_id)
            .input('DATALEADSID', dataleads_id)
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
            .input('CREATEDUSER', auth_name)
            // .input('PAYMENTSTATUS', apiHelper.getValueFromObject(bodyParams, 'payment_status'))
            .input('ORDERSTATUSID', apiHelper.getValueFromObject(bodyParams, 'order_status_id'))
            .input('STOREID', store_id)

            .input('EXPOINTID', apiHelper.getValueFromObject(bodyParams, 'expoint_id'))
            .input('USEPOINT', apiHelper.getValueFromObject(bodyParams, 'use_point'))
            .input('ISPLUSPOINT', apiHelper.getValueFromObject(bodyParams, 'is_plus_point'))

            .input('ISDELIVERYTYPE', apiHelper.getValueFromObject(bodyParams, 'is_delivery_type'))
            .input('RECEIVINGDATE', apiHelper.getValueFromObject(bodyParams, 'receiving_date'))
            .input('ORDERDATE', apiHelper.getValueFromObject(bodyParams, 'order_date'))
            .input('RECEIVEADDRESSID', apiHelper.getValueFromObject(bodyParams, 'address_id'))

            .input('TOTALMONEY', apiHelper.getValueFromObject(bodyParams, 'total_money')) //  Tổng tiền có VAT
            .input('TOTALVAT', apiHelper.getValueFromObject(bodyParams, 'total_vat')) //  Tổng tiền có VAT
            .input('TOTALDISCOUNT', apiHelper.getValueFromObject(bodyParams, 'total_discount')) //Tổng tiền giảm ( khuyến mãi + mã giảm giá)
            .input('DISCOUNTVALUE', apiHelper.getValueFromObject(bodyParams, 'discount_value')) //Tiền giảm của khuyến mãi
            .input('DISCOUNTCOUPON', apiHelper.getValueFromObject(bodyParams, 'discount_coupon')) //Tiền giảm của mã coupou
            .input('DISCOUNTPOINT', apiHelper.getValueFromObject(bodyParams, 'expoint_value')) // Tiền tiêu điểm
            .input('TOTALAMOUNT', total_a_mount)

            .input('ISINVOICE', apiHelper.getValueFromObject(bodyParams, 'is_invoice'))
            .input('INVOICECOMPANYNAME', apiHelper.getValueFromObject(bodyParams, 'invoice_company_name'))
            .input('INVOICEEMAIL', apiHelper.getValueFromObject(bodyParams, 'invoice_email'))
            .input('INVOICEFULLNAME', apiHelper.getValueFromObject(bodyParams, 'invoice_full_name'))
            .input('INVOICETAX', apiHelper.getValueFromObject(bodyParams, 'invoice_tax'))
            .input('INVOICEPRICE', apiHelper.getValueFromObject(bodyParams, 'invoice_price'))
            .input('INVOICEADDRESS', apiHelper.getValueFromObject(bodyParams, 'invoice_address'))

            .input('ACPOINTID', apiHelper.getValueFromObject(bodyParams, 'acpoint_id'))
            .input('PRESENTERDATALEADSID', presenter_dataleads_id)
            .input('PRESENTERMEMBERID', presenter_member_id)
            .input('ACCUMULATEPOINT', apiHelper.getValueFromObject(bodyParams, 'accumulate_point'))
            .input('PRESENTERPOINT', apiHelper.getValueFromObject(bodyParams, 'presenter_point'))
            .input('ISAGREEPOLICY', apiHelper.getValueFromObject(bodyParams, 'is_agree_policy'))
            .input('BUSINESSRECEIVEID', apiHelper.getValueFromObject(bodyParams, 'business_receive_id'))
            .input('BUSINESSTRANSFERID', apiHelper.getValueFromObject(bodyParams, 'business_transfer_id'))
            .input('STOCKSTRANSFERID', apiHelper.getValueFromObject(bodyParams, 'stocks_transfer_id'))
            .input('TASKDETAILID', apiHelper.getValueFromObject(bodyParams, 'task_detail_id'))
            .input('SALESASSISTANT', apiHelper.getValueFromObject(bodyParams, 'salesassistant'))
            .execute('SL_ORDER_CreateOrUpdate_AdminWeb');
        const orderId = data.recordset[0].RESULT;
        const orderNo = data.recordset[0].ORDERNO?.trim();
        const out_stock_status = data.recordset[0].OUTSTOCKSTATUS;
        payment_status = data.recordset[0].PAYMENTSTATUS;

        if (orderId <= 0) {
            throw new Error(RESPONSE_MSG.ORDER.CREATE_FAILED);
        }

        if (order_id) {
            // xoá coupon
            const requestCouponDelete = new sql.Request(transaction);
            const data = await requestCouponDelete
                .input('LISTID', [order_id])
                .input('NAMEID', 'ORDERID')
                .input('TABLENAME', 'SM_COUPON_ORDER')
                .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .execute('CBO_COMMON_SOFTDELETE');

            // remove table map SL_ORDERDETAIL
            const requestOrderDetailDelete = new sql.Request(transaction);
            const dataOrderDetailDelete = await requestOrderDetailDelete
                .input('ORDERID', order_id)
                .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .execute(PROCEDURE_NAME.SL_ORDERDETAIL_DELETED_BYORDERID_ADMINWEB);
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
                .execute('SM_PROMOTION_ORDER_Delete_AdminWeb');
            const resultPromotionOrderDelete = dataPromotionOrderDelete.recordset[0].RESULT;
            if (resultPromotionOrderDelete <= 0) {
                await transaction.rollback();
                return new ServiceResponse(false, RESPONSE_MSG.ORDER.UPDATE_FAILED);
            }

            // Xóa coupon pre order của ORDER
            const requestCouponPreOrderDelete = new sql.Request(transaction);
            const dataCouponPreOrderDelete = await requestCouponPreOrderDelete
                .input('ORDERID', order_id)
                .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .execute('SM_COUPON_PREORDER_ORDER_Delete_AdminWeb');

            // xoá danh sách nhân viên nhận hoa hồng
            const reqDeleteCommission = new sql.Request(transaction);
            const resDeleteCommission = await reqDeleteCommission
                .input('ORDERID', order_id)
                .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .execute('SL_ORDER_COMMISSION_Delete_AdminWeb');
            const resultDeleteCommisstion = resDeleteCommission.recordset[0].RESULT;

            if (resultDeleteCommisstion <= 0) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Lỗi lưu nhân viên nhận chiết khấu.');
            }

            // xoá ds hình thức thanh toán
            const requestPaymentFormDelete = new sql.Request(transaction);
            const requestPaymentFormDeleteRes = await requestPaymentFormDelete
                .input('ORDERID', order_id)
                .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .execute('SL_RECEIVESLIP_ORDER_DeleteByOrderId_AdminWeb');
        }

        // insert coupon
        // if (order_type != orderType.PREORDER) {
        const coupon = apiHelper.getValueFromObject(bodyParams, 'coupon', []);

        if (coupon) {
            const requestCouponCreate = new sql.Request(transaction);
            for (let i = 0; i < coupon.length; i++) {
                let item = coupon[i];
                const dataCouponCreate = await requestCouponCreate
                    .input('ORDERID', orderId)
                    .input('COUPONID', apiHelper.getValueFromObject(item, 'coupon_id'))
                    .input('COUPONCONDITIONID', apiHelper.getValueFromObject(item, 'coupon_condition_id'))
                    .input('COUPONCODE', apiHelper.getValueFromObject(item, 'coupon_code'))
                    .input('DISCOUNTMONEY', apiHelper.getValueFromObject(item, 'total_discount', 0))
                    .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                    .execute('SM_COUPON_ORDER_CreateOrUpdate_AdminWeb');

                const { RESULT } = dataCouponCreate.recordset[0];

                if (RESULT <= 0) {
                    throw new Error('002');
                }
            }
        }
        // } else {
        const coupon_code = apiHelper.getValueFromObject(bodyParams, 'coupon_code', '');
        if (coupon_code) {
            const requestCouponCreate = new sql.Request(transaction);
            await requestCouponCreate
                .input('ORDERID', orderId)
                .input('COUPONCODE', coupon_code.trim())
                .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .execute('SL_PREORDER_ApplyCoupon_AdminWeb');

            if (giftsCoupon && Array.isArray(giftsCoupon) && giftsCoupon.length > 0) {
                const requestCouponDetailCreate = new sql.Request(transaction);
                for (let k = 0; k < giftsCoupon.length; k++) {
                    const dataCouponDetailCreate = await requestCouponDetailCreate
                        .input('ORDERID', orderId)
                        .input('PRODUCTID', apiHelper.getValueFromObject(giftsCoupon[k], 'product_id'))
                        .input('IMEICODE', apiHelper.getValueFromObject(giftsCoupon[k], 'imei_code'))
                        .input('TOTALPRICE', sql.Money, 0)
                        .input('TOTALAMOUNT', sql.Money, 0)
                        .input('VATAMOUNT', 0)
                        // .input('OUTPUTTYPEID', apiHelper.getValueFromObject(gifts_[k], 'product_output_type_id'))
                        .input('UNITID', apiHelper.getValueFromObject(giftsCoupon[k], 'product_unit_id'))
                        .input('QUANTITY', 1)
                        .input('NOTE', apiHelper.getValueFromObject(giftsCoupon[k], 'note'))
                        .input('PRICE', 1 * apiHelper.getValueFromObject(giftsCoupon[k], 'price'))
                        // .input('CHANGEPRICE', apiHelper.getValueFromObject(gifts_[k], 'change_price', 0))
                        .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                        .input('ISDISCOUNTPERCENT', 0)
                        .input('DISCOUNTVALUE', 0)
                        .input('TOTALDISCOUNT', 0)
                        .input('PRICEID', 0)
                        .input('STOCKSID', apiHelper.getValueFromObject(giftsCoupon[k], 'stock_id'))
                        .input('STOREID', store_id)
                        .input('ISPROMOTIONGIFT', 1)
                        .input('ISCOUPONGIFT', 1)
                        .execute('SL_ORDERDETAIL_CreateOrUpdate_AdminWeb');

                    let { ISVALID, RESULT, ORDERNO } = dataCouponDetailCreate.recordset[0];

                    const orderDetailId = RESULT;
                    if (!ISVALID) {
                        if (ORDERNO) {
                            throw new Error('007', {
                                cause: {
                                    imei_code: apiHelper.getValueFromObject(item, 'imei_code'),
                                    product_code: apiHelper.getValueFromObject(item, 'product_code'),
                                    product_name: apiHelper.getValueFromObject(item, 'product_name'),
                                    order_no: ORDERNO,
                                },
                            });
                        } else {
                            throw new Error('003', {
                                cause: {
                                    imei_code: apiHelper.getValueFromObject(item, 'imei_code'),
                                    product_code: apiHelper.getValueFromObject(item, 'product_code'),
                                    product_name: apiHelper.getValueFromObject(item, 'product_name'),
                                },
                            });
                        }
                    } else if (orderDetailId <= 0) {
                        throw new Error('008');
                    }
                }
            }
        }
        // }

        // insert products
        // if (order_type != orderType.PREORDER) {
        const requestOrderDetailCreate = new sql.Request(transaction);
        for (let i = 0; i < products.length; i++) {
            let item = products[i];

            const dataOrderDetailCreate = await requestOrderDetailCreate
                .input('ORDERID', orderId)
                .input('PRODUCTID', apiHelper.getValueFromObject(item, 'product_id'))
                .input('IMEICODE', apiHelper.getValueFromObject(item, 'imei_code'))
                .input('TOTALPRICE', sql.Money, 1 * apiHelper.getValueFromObject(item, 'total_price', 0))
                .input('TOTALAMOUNT', sql.Money, 1 * apiHelper.getValueFromObject(item, 'total_price', 0))
                .input('VATAMOUNT', 1 * apiHelper.getValueFromObject(item, 'vat_amount', 0))
                .input('OUTPUTTYPEID', apiHelper.getValueFromObject(item, 'product_output_type_id'))
                .input('UNITID', apiHelper.getValueFromObject(item, 'product_unit_id'))
                .input('QUANTITY', 1)
                .input('NOTE', apiHelper.getValueFromObject(item, 'note'))
                .input('PRICE', 1 * apiHelper.getValueFromObject(item, 'price'))
                // .input('CHANGEPRICE', apiHelper.getValueFromObject(item, 'change_price', 0))
                .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .input('ISDISCOUNTPERCENT', apiHelper.getValueFromObject(item, 'is_discount_percent', 0))
                .input('DISCOUNTVALUE', apiHelper.getValueFromObject(item, '_total_discount'))
                .input('TOTALDISCOUNT', apiHelper.getValueFromObject(item, '_total_discount'))
                .input('PRICEID', apiHelper.getValueFromObject(item, 'price_id'))
                .input('STOCKSID', apiHelper.getValueFromObject(item, 'stock_id'))
                .input('STOREID', store_id)
                .input('ISPROMOTIONGIFT', 0)
                .input('REVENUEACCOUNTID', apiHelper.getValueFromObject(item, 'revenue_account_id'))
                .input('DEBTACCOUNTID', apiHelper.getValueFromObject(item, 'debt_account_id'))
                .input('TAXACCOUNTID', apiHelper.getValueFromObject(item, 'tax_account_id'))
                .input('TOTALPRICEBASE', apiHelper.getValueFromObject(item, 'total_price_base'))
                .execute('SL_ORDERDETAIL_CreateOrUpdate_AdminWeb');

            const { ISVALID, RESULT, ORDERNO } = dataOrderDetailCreate.recordset[0];

            const orderDetailId = RESULT;
            if (!ISVALID) {
                if (ORDERNO) {
                    throw new Error('007', {
                        cause: {
                            imei_code: apiHelper.getValueFromObject(item, 'imei_code'),
                            product_code: apiHelper.getValueFromObject(item, 'product_code'),
                            product_name: apiHelper.getValueFromObject(item, 'product_name'),
                            order_no: ORDERNO,
                        },
                    });
                } else {
                    throw new Error('003', {
                        cause: {
                            imei_code: apiHelper.getValueFromObject(item, 'imei_code'),
                            product_code: apiHelper.getValueFromObject(item, 'product_code'),
                            product_name: apiHelper.getValueFromObject(item, 'product_name'),
                        },
                    });
                }
            } else if (orderDetailId <= 0) {
                throw new Error('004');
            }
        }
        // }

        // lưu túi bao bì
        const requestMaterial = new sql.Request(transaction);
        for (let i = 0; i < materials.length; i++) {
            let item = materials[i];

            const dataOrderDetailCreate = await requestMaterial
                .input('ORDERID', orderId)
                .input('MATERIALID', apiHelper.getValueFromObject(item, 'material_id'))
                .input('STOCKSID', apiHelper.getValueFromObject(item, 'stock_id'))
                .input('IMEICODE', apiHelper.getValueFromObject(item, 'imei_code'))
                .input('STOREID', store_id)
                .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .execute('SL_ORDERDETAIL_CreateOrUpdateMaterial_AdminWeb');

            const { RESULT } = dataOrderDetailCreate.recordset[0];

            const orderDetailId = RESULT;

            if (orderDetailId <= 0) {
                throw new Error('005');
            }
        }

        if (order_type != orderType.PREORDER) {
            const commissions = apiHelper.getValueFromObject(bodyParams, 'commissions', {});
            const requestCommission = new sql.Request(transaction);
            // const requestCommissionLog = new sql.Request(transaction);
            for (let commission of Object.values(commissions)) {
                // const dataCommissionLog = await requestCommissionLog
                //     .input('ORDERID', orderId)
                //     .input('USERNAME', apiHelper.getValueFromObject(commission, 'user_commission') || null)
                //     .input('COMMISSIONVALUE', apiHelper.getValueFromObject(commission, 'commission_value'))
                //     .input('COMMISSIONTYPE', apiHelper.getValueFromObject(commission, 'commission_type'))
                //     .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                //     .execute('SL_ORDER_COMMISSION_LOG_Create_AdminWeb');
                // const resultLogs = dataCommissionLog.recordset[0].RESULT;

                // if (resultLogs <= 0) {
                //     await transaction.rollback();
                //     return new ServiceResponse(false, 'Lỗi lưu logs nhân viên nhận hoa hồng.');
                // }

                const dataCommission = await requestCommission
                    .input('ORDERID', orderId)
                    .input('USERNAME', apiHelper.getValueFromObject(commission, 'user_commission') || null)
                    .input('COMMISSIONVALUE', apiHelper.getValueFromObject(commission, 'commission_value'))
                    .input('COMMISSIONTYPE', apiHelper.getValueFromObject(commission, 'commission_type'))
                    .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                    .execute('SL_ORDER_COMMISSION_Create_AdminWeb');
                const resultCommission = dataCommission.recordset[0].RESULT;

                if (resultCommission <= 0) {
                    throw new Error('006');
                }
            }
        }

        // Luu khuyen mai ap dung
        // if (order_type != orderType.PREORDER) {
        if (promotion_apply && Array.isArray(promotion_apply) && promotion_apply.length > 0) {
            for (let j = 0; j < promotion_apply.length; j++) {
                const promotion_offers = promotion_apply[j].offers?.filter((o) => o.is_picked);

                if (promotion_offers && promotion_offers.length) {
                    for (let i = 0; i < promotion_offers.length; i++) {
                        // lấy danh sách quà tặng của khuyến mãi
                        let gifts_ = gifts.filter(
                            (g) =>
                                g.promotion_id == promotion_offers[i].promotion_id &&
                                g.promotion_offer_id == promotion_offers[i].promotion_offer_id,
                        );

                        // lưu quà tặng nếu có
                        if (gifts_.length) {
                            for (let k = 0; k < gifts.length; k++) {
                                // lưu quà tặng vào chi tiết đơn hàng
                                const dataOrderDetailCreate = await requestOrderDetailCreate
                                    .input('ORDERID', orderId)
                                    .input('PRODUCTID', apiHelper.getValueFromObject(gifts_[k], 'product_id'))
                                    .input('IMEICODE', apiHelper.getValueFromObject(gifts_[k], 'imei_code'))
                                    .input('TOTALPRICE', sql.Money, 0)
                                    .input('TOTALAMOUNT', sql.Money, 0)
                                    .input('VATAMOUNT', 0)
                                    // .input('OUTPUTTYPEID', apiHelper.getValueFromObject(gifts_[k], 'product_output_type_id'))
                                    .input('UNITID', apiHelper.getValueFromObject(gifts_[k], 'product_unit_id'))
                                    .input('QUANTITY', 1)
                                    .input('NOTE', apiHelper.getValueFromObject(gifts_[k], 'note'))
                                    .input('PRICE', 1 * apiHelper.getValueFromObject(gifts_[k], 'price'))
                                    // .input('CHANGEPRICE', apiHelper.getValueFromObject(gifts_[k], 'change_price', 0))
                                    .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                                    .input('ISDISCOUNTPERCENT', 0)
                                    .input('DISCOUNTVALUE', 0)
                                    .input('TOTALDISCOUNT', 0)
                                    .input('PRICEID', 0)
                                    .input('STOCKSID', apiHelper.getValueFromObject(gifts_[k], 'stock_id'))
                                    .input('STOREID', store_id)
                                    .input('ISPROMOTIONGIFT', 1)
                                    .execute('SL_ORDERDETAIL_CreateOrUpdate_AdminWeb');

                                let { ISVALID, RESULT, ORDERNO } = dataOrderDetailCreate.recordset[0];

                                const orderDetailId = RESULT;
                                if (!ISVALID) {
                                    if (ORDERNO) {
                                        throw new Error('007', {
                                            cause: {
                                                imei_code: apiHelper.getValueFromObject(item, 'imei_code'),
                                                product_code: apiHelper.getValueFromObject(item, 'product_code'),
                                                product_name: apiHelper.getValueFromObject(item, 'product_name'),
                                                order_no: ORDERNO,
                                            },
                                        });
                                    } else {
                                        throw new Error('003', {
                                            cause: {
                                                imei_code: apiHelper.getValueFromObject(item, 'imei_code'),
                                                product_code: apiHelper.getValueFromObject(item, 'product_code'),
                                                product_name: apiHelper.getValueFromObject(item, 'product_name'),
                                            },
                                        });
                                    }
                                } else if (orderDetailId <= 0) {
                                    throw new Error('008');
                                }

                                const requestPromotionCreate = new sql.Request(transaction);
                                const dataPromotionCreate = await requestPromotionCreate
                                    .input('ORDERID', orderId)
                                    .input('PRODUCTID', apiHelper.getValueFromObject(gifts_[k], 'product_id'))
                                    .input(
                                        'PROMOTIONID',
                                        apiHelper.getValueFromObject(promotion_offers[i], 'promotion_id'),
                                    )
                                    .input(
                                        'PROMOTIONOFFERAPPLYID',
                                        apiHelper.getValueFromObject(promotion_offers[i], 'promotion_offer_id'),
                                    )
                                    .input('QUANTITY', 1)
                                    .input('ORDERDETAILID', orderDetailId)
                                    .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                                    .execute('SM_PROMOTION_ORDER_CreateOrUpdate_AdminWeb');

                                RESULT = dataPromotionCreate.recordset[0]?.RESULT;
                                if (!RESULT) {
                                    throw new Error('009');
                                }
                            }
                        }
                        // trường họp không có quà tặng thì lưu khuyến mãi
                        else {
                            const requestPromotionCreate = new sql.Request(transaction);
                            const dataPromotionCreate = await requestPromotionCreate
                                .input('ORDERID', orderId)
                                .input('PROMOTIONID', apiHelper.getValueFromObject(promotion_offers[i], 'promotion_id'))
                                .input(
                                    'PROMOTIONOFFERAPPLYID',
                                    apiHelper.getValueFromObject(promotion_offers[i], 'promotion_offer_id'),
                                )
                                .input(
                                    'DISCOUNTVALUE',
                                    promotion_offers[i]?.is_transport === 1
                                        ? apiHelper.getValueFromObject(promotion_offers[i], 'shipping_discount', 0)
                                        : apiHelper.getValueFromObject(promotion_offers[i], 'discount', 0),
                                )
                                .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                                .execute('SM_PROMOTION_ORDER_CreateOrUpdate_AdminWeb');
                            const { RESULT } = dataPromotionCreate.recordset[0];
                            if (!RESULT) {
                                throw new Error('010');
                            }
                        }
                    }
                }
            }
        }

        // update 28/09/2023 -> cập nhật lại phương thức thanh toán cho preorder
        data_payment = data_payment.filter(
            (item) =>
                item.is_checked &&
                // thanh toán bằng tiền mặt và (đã có phiếu thu hoặc đã thanh toán) thì ko cập nhật lại
                ((item.payment_type == PAYMENT_TYPE.CASH && (!item.receive_slip_code || !item.payment_status)) ||
                    // thanh toán bằng hình thức khác thì cập nhật lại
                    item.payment_type != PAYMENT_TYPE.CASH),
        );

        // lưu lại thông tin thanh toán
        if (data_payment && data_payment.length > 0 && payment_status != PAYMENT_STATUS.PAID) {
            //Lấy loại phiếu thu từ AppConfig
            const dataAppConfig = await new sql.Request(transaction)
                .input('KEYCONFIG', 'SL_ORDER_RECEIVETYPE')
                .execute('SYS_APPCONFIG_GetByKeyConfig_App');
            const value_config = dataAppConfig.recordset[0].VALUECONFIG;
            if (!value_config) {
                throw new Error('011');
            }

            const description = apiHelper.getValueFromObject(bodyParams, 'description', '')?.replace('{MDH}', orderNo);
            const requestReceiveslip = new sql.Request(transaction);
            const requestCreateReceiveslipOrder = new sql.Request(transaction);
            const requestCreateTempReceiveslipOrder = new sql.Request(transaction);
            for (let i = 0; i < data_payment.length; i++) {
                let itemPayment = data_payment[i];
                const payment_type = apiHelper.getValueFromObject(itemPayment, 'payment_type');

                // nếu là thanh toán bằng tiền mặt, có lệnh thanh toán thì tạo phiếu thu
                if (
                    +itemPayment.payment_value > 0 &&
                    [PAYMENT_TYPE.CASH, PAYMENT_TYPE.PARTNER].includes(payment_type) &&
                    button_type == 'save_&_payment'
                ) {
                    //tạo phiếu thu
                    const totalMoney = apiHelper.getValueFromObject(itemPayment, 'payment_value', 0);

                    const receiveslipData = await requestReceiveslip
                        .input('RECEIVETYPEID', value_config)
                        .input('RECEIVESLIPID', apiHelper.getValueFromObject(itemPayment, 'receive_slip_id'))
                        .input('BANKACCOUNTID', apiHelper.getValueFromObject(itemPayment, 'bank_id'))
                        .input('CASHIERID', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                        .input('MEMBERID', member_id)
                        .input('PAYMENTFORMID', apiHelper.getValueFromObject(itemPayment, 'payment_form_id'))
                        .input('DESCRIPTIONS', description)
                        .input('TOTALMONEY', totalMoney)
                        .input('NOTES', description)
                        .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                        .input('ISACTIVE', 1)
                        .input('ISREVIEW', 1)
                        .input('PAYMENTSTATUS', 1) // trạng thái đã thanh toán
                        .input('PAYMENTTYPE', payment_type === PAYMENT_TYPE.CASH ? 1 : 2) // 1 là tiền mặt 2 là tiền gửi ngân hàng
                        // .input('PAYMENTTYPE', 3) // Khách hàng
                        .input('ORDERID', orderId) //Đơn hàng

                        .execute('SL_RECEIVESLIP_CreateOrUpdateForOrder_AdminWeb');
                    const receiveslipId = receiveslipData.recordset[0].RESULT;

                    if (receiveslipId <= 0) {
                        throw new Error(RESPONSE_MSG.RECEIVESLIP.CREATE_FAILED);
                    }

                    // Tạo hạch toán
                    const accountingData = {
                        auth_name,
                        receiveslip_id: receiveslipId,
                        money: totalMoney,
                        descriptions: description,
                        order_id: orderId,
                        payment_form_id: apiHelper.getValueFromObject(itemPayment, 'payment_form_id'),
                    };
                    const result = await _createAccounting(accountingData, transaction);
                    if (!result) {
                        throw new Error(RESPONSE_MSG.RECEIVESLIP.CREATE_FAILED);
                    }

                    //cập nhật trạng thái đơn hàng
                    const dataCreateReceiveslipOrder = await requestCreateReceiveslipOrder
                        .input('RECEIVESLIPID', receiveslipId)
                        .input('RECEIVESLIPORDERID', apiHelper.getValueFromObject(itemPayment, 'receiveslip_order_id'))
                        .input('ORDERID', orderId)
                        .input('TOTALMONEY', totalMoney)
                        .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                        .execute('SL_RECEIVESLIP_ORDER_CreateOrUpdate_AdminWeb');

                    const targetResult =
                        dataCreateReceiveslipOrder?.recordsets?.find(
                            (recordset) =>
                                recordset?.[0]?.RESULT &&
                                recordset?.[0]?.ISVALIDRECEIVESLIPORDER &&
                                recordset?.[0]?.ORDERNO &&
                                recordset?.[0]?.PAYMENTSTATUS,
                        )?.[0] || {};

                    const {
                        RESULT: receiveslipOrder,
                        ISVALIDRECEIVESLIPORDER: isValid,
                        ORDERNO: orderNo,
                        PAYMENTSTATUS: newPaymentStatus,
                    } = targetResult;

                    if (!isValid) {
                        throw new Error('012', { cause: { orderNo } });
                    }
                    if (receiveslipOrder <= 0) {
                        throw new Error('013');
                    }

                    // đã tạo trong trigger
                    // if (newPaymentStatus == PAYMENT_STATUS.PAID) {
                    //     const createCrmAccountRequest = new sql.Request(transaction);
                    //     const createCrmAccountData = await createCrmAccountRequest
                    //         .input('ORDERID', orderId)
                    //         .execute('CRM_ACCOUNT_CreateByOrderId_AdminWeb');
                    // }

                    // cập nhật lại trạng thái thanh toán
                    payment_status = newPaymentStatus;
                }
                // lưu lại các hình thức thanh toán khác
                else {
                    const dataCreateTempReceiveslipOrder = await requestCreateTempReceiveslipOrder
                        .input('RECEIVESLIPORDERID', apiHelper.getValueFromObject(itemPayment, 'receiveslip_order_id'))
                        // .input('RECEIVESLIPID', receiveslipId)
                        .input('PAYMENTFORMID', apiHelper.getValueFromObject(itemPayment, 'payment_form_id'))
                        .input('ORDERID', orderId)
                        // .input('TOTALMONEY', apiHelper.getValueFromObject(itemPayment, 'payment_value'))
                        .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                        .execute('SL_RECEIVESLIP_ORDER_CreateOrUpdateTemp_AdminWeb');

                    const { RESULT: receiveslipOrder } = dataCreateTempReceiveslipOrder.recordset[0];

                    if (receiveslipOrder <= 0) {
                        throw new Error('014');
                    }
                }
            }

            if (order_type == orderType.PREORDER) {
                const updateOrderStatus = new sql.Request(transaction);
                await updateOrderStatus
                    .input('ORDERID', orderId)
                    .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                    .execute('SL_ORDER_UpdatePreOrderStatus_AdminWeb');
            }
        }

        // await transaction.rollback();
        await transaction.commit();
        return new ServiceResponse(
            true,
            +payment_status === PAYMENT_STATUS.PAID
                ? 'Thanh toán đơn hàng thành công'
                : order_id
                  ? 'Cập nhật thành công'
                  : 'Thêm mới thành công',
            { orderId, orderNo, paymentStatus: payment_status, out_stock_status },
            orderId,
        );
    } catch (e) {
        logger.error(e, { function: 'orderService.createOrUpdateOrder' });
        await transaction.rollback();

        return new ServiceResponse(
            false,
            convertErrorCode(e, order_id ? RESPONSE_MSG.ORDER.UPDATE_FAILED : RESPONSE_MSG.ORDER.CREATE_FAILED),
        );
    }
};

// create or update
const createCustomerDelivery = async (bodyParams) => {
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

// export
const exportPDF = async (queryParams = {}) => {
    try {
        const order_id = apiHelper.getValueFromObject(queryParams, 'order_id');

        const result = await detailOrder(order_id);

        if (result.isFailed()) {
            return new ServiceResponse(false, 'Lỗi không thể in hoá đơn.', []);
        }

        if (result.getData()) {
            let order = result.getData();

            order.products = Object.values(order.products);
            order.products = order.products
                ?.map((item) => ({
                    ...item,
                    price: formatCurrency(item.price, 0),
                    total_money: formatCurrency(item.total_money, 0),
                    discount_value: formatCurrency(item.discount_value, 0),
                    product_name: item.product_display_name,
                }))
                ?.reduce((acc, item) => {
                    if (item?.imei_codes?.length > 0) {
                        for (let i = 0; i < item.imei_codes.length; i++) {
                            acc = [...acc, { ...item, imei_code: item.imei_codes[i].value }];
                        }
                    } else {
                        acc = [...acc, { ...item }];
                    }
                    return acc;
                }, []);

            order.gifts = order.gifts
                ?.reduce((acc, item) => {
                    if (item?.imei_codes?.length > 0) {
                        for (let i = 0; i < item.imei_codes.length; i++) {
                            acc = [...acc, { ...item, imei_code: item.imei_codes[i].value }];
                        }
                    } else {
                        acc = [...acc, { ...item }];
                    }
                    return acc;
                }, [])
                ?.map((item) => ({
                    ...item,
                    price: 0,
                    total_money: 0,
                    product_name: `${item.product_display_name} (Hàng khuyến mại, không thu tiền)`,
                }));

            order.products = [...order.products, ...order.gifts];

            const fileName = `Don_hang_${moment().format('DDMMYYYY_HHmmss')}_${order_id}`;

            order.created_date = moment().format('DD/MM/YYYY');
            let total_a_mount = order.total_money - order.total_discount - order.total_paid;
            console.log(total_a_mount);
            order.total_a_mount = formatCurrency(total_a_mount <= 0 ? 0 : total_a_mount, 0);
            order.total_money = formatCurrency(order.total_money, 0);
            order.total_discount = formatCurrency(order.total_discount, 0);
            order.total_paid = formatCurrency(order.total_paid, 0);
            order.qr_code = await qrHelper.createQR({
                data: order.order_no,
                qr_width: 200,
                img_width: 35,
            });
            const print_params = {
                template: 'viewOrders.ejs',
                data: order,
                filename: fileName,
                format: 'A5',
                landscape: true,
                // isOnlyFirstPage: true,
                pageBreak: false,
            };
            await pdfHelper.printPDF(print_params);

            return new ServiceResponse(true, '', { path: `pdf/${fileName}.pdf` });
        }

        return new ServiceResponse(false, 'Không tìm thấy đơn hàng.');
    } catch (e) {
        logger.error(e, { function: 'order.service.exportPDF' });
        return new ServiceResponse(false, 'Lỗi không thể in đơn hàng.', []);
    }
};

// detail StocksInRequest

const createOrderNo = async () => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().execute(PROCEDURE_NAME.SL_ORDER_GETORDERNO_ADMINWEB);
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
        await pool
            .request()
            .input('ORDERID', orderId)
            .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute(PROCEDURE_NAME.SL_ORDER_CANCEL_ADMINWEB);
        return new ServiceResponse(true, RESPONSE_MSG.ORDER.CANCEL_SUCCESS, '');
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
            .execute('SL_ORDER_GetProductInit_AdminWeb');

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

const getListPromotion = async (bodyParams = {}) => {
    try {
        const pool = await mssql.pool;
        // Lay danh sach khuyen mai con han su dung
        let order_details = apiHelper.getValueFromObject(bodyParams, 'products', []);
        const productListString = getValueAndConcatInArrayByField(order_details, 'product_id', ',');
        const businessId = apiHelper.getValueFromObject(bodyParams, 'business_id', 0);
        const orderStatusId = apiHelper.getValueFromObject(bodyParams, 'order_status_id', 0);

        const dataPromotion = await pool
            .request()
            .input('MEMBERID', apiHelper.getValueFromObject(bodyParams, 'member_id'))
            .input('PRODUCTIDS', productListString)
            .input('BUSINESSIDIN', businessId)
            .input('ORDERSTATUSID', orderStatusId)
            .input('DATALEADSID', apiHelper.getValueFromObject(bodyParams, 'dataleads_id'))
            .input('PARTNERID', apiHelper.getValueFromObject(bodyParams, 'partner_id'))
            .input('STOREID', apiHelper.getValueFromObject(bodyParams, 'store_id'))
            // .input('USERNAME', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('SL_ORDER_GetListPromotion_AdminWeb');

        const promotions = orderClass.promotions(dataPromotion.recordset);
        const productApply = orderClass.productApplyPromotion(dataPromotion.recordsets[1]);
        const offers = orderClass.offers(dataPromotion.recordsets[2]);
        let gifts = orderClass.gift(dataPromotion.recordsets[3]);
        const productCategoryApply = orderClass.productCategoryApplyPromotion(dataPromotion.recordsets[4]);
        const giftImeis = orderClass.giftImei(dataPromotion.recordsets[5]);
        const paymentFormApply = orderClass.paymentFormApplyPromotion(dataPromotion.recordsets[6]);
        const productGiftApply = orderClass.productApplyPromotion(dataPromotion.recordsets[7]);

        // đưa imei vào gift
        gifts = gifts.map((gift) => ({
            ...gift,
            imei_code_options: giftImeis
                .filter((giftImei) => +giftImei.product_id === +gift.product_id)
                .map((giftImei) => ({
                    value: giftImei.product_imei_code,
                    label: giftImei.product_imei_code,
                    stock_id: giftImei.stock_id,
                })),
        }));

        // Filter cap nhat lai danh sach san pham, nganh hang, hinh thuc thanh toan ap dung tren tung ct khuyen mai neu co
        for (let i = 0; i < promotions.length; i++) {
            let promotion = promotions[i];
            let product_apply = (productApply || []).filter((p) => p.promotion_id == promotion.promotion_id);
            let product_gift_apply = (productGiftApply || []).filter((p) => p.promotion_id == promotion.promotion_id);
            let product_category_apply = (productCategoryApply || []).filter(
                (p) => p.promotion_id == promotion.promotion_id,
            );
            let payment_form_apply = (paymentFormApply || []).filter((p) => p.promotion_id == promotion.promotion_id);
            promotions[i].product_apply = product_apply || [];
            promotions[i].product_gift_apply = product_gift_apply || [];
            promotions[i].product_category_apply = product_category_apply || [];
            promotions[i].payment_form_apply = payment_form_apply || [];
        }

        // Filter cap nhat lai danh sach uu dai tren khuyen mai
        for (let i = 0; i < promotions.length; i++) {
            let promotion = promotions[i];
            let _offers = (offers || []).filter((p) => p.promotion_id == promotion.promotion_id);
            for (let j = 0; j < _offers.length; j++) {
                const { is_fixed_gift, promotion_offer_id } = _offers[j];
                // Neu co qua tang thi lay danh sach qua tang
                if (is_fixed_gift) {
                    _offers[j].gifts = (gifts || []).filter((v) => v.promotion_offer_id == promotion_offer_id);
                }
            }
            promotions[i].offers = _offers || [];
        }

        let data_payment = apiHelper.getValueFromObject(bodyParams, 'data_payment', []);
        data_payment = data_payment.filter((v) => v.is_checked);

        // Tinh tong so tien cua tung san pham trong don hang
        // Chi lay cac san pham trong don hang co gia

        // order_details = order_details.reduce((acc, cur) => {
        //     const findIndex = acc.findIndex((item) => item.product_id === cur.product_id);

        //     if (findIndex === -1) {
        //         acc.push(cur);
        //     } else {
        //         acc[findIndex].quantity += cur.quantity;
        //     }

        //     return acc;
        // }, []);
        let sub_total = 0;
        let total_quantity = 0;
        // Bỏ qua các sản phẩm là quà tặng
        (order_details || [])
            .filter((v) => v.price && !v.is_gift)
            .forEach((item) => {
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
                payment_form_apply = [],
                product_gift_apply = [],
                is_promotion_by_product,
                is_promotion_any_product,
                is_promotion_appoint_product,
            } = promotion || {};

            let categoryCheck = true;
            // Danh sach nganh hang ap dung va co check combo hay khong
            if (is_apply_product_category) {
                if (!product_category_apply.length) categoryCheck = false;

                // Check xem co san pham nao thuoc nganh hang ap dung khong
                const checkProductCategory = order_details
                    .filter((v) => !v.is_gift)
                    .filter((x) => {
                        return product_category_apply.find((y) => x.product_category_id == y.product_category_id);
                    });

                if (!checkProductCategory.length) {
                    categoryCheck = false;
                }
            }

            let productCheck = true;
            if (is_promotion_by_product) {
                if (is_promotion_appoint_product) {
                    let product_apply_combo = (product_gift_apply || []).filter((v) => {
                        return _.uniqBy(
                            (order_details || []).filter((v) => !v.is_gift),
                            (obj) => obj.product_id,
                        ).find((x) => x.product_id == v.product_id);
                    });
                    if (product_apply_combo.length != product_gift_apply.length) {
                        productCheck = false;
                    }
                } else if (is_promotion_any_product) {
                    const checkProduct = order_details
                        .filter((v) => !v.is_gift)
                        .filter((x) => {
                            return product_gift_apply.find((y) => x.product_id == y.product_id);
                        });
                    if (!checkProduct.length) {
                        productCheck = false;
                    }
                } else {
                    productCheck = false;
                }
            } else {
                if (!is_apply_all_product) {
                    //Danh sách sản phẩm áp dụng va co ap dung combo haykhong
                    if (!product_apply.length) productCheck = false;
                    if (is_apply_appoint_product) {
                        let product_apply_combo = (product_apply || []).filter((v) => {
                            return _.uniqBy(
                                (order_details || []).filter((v) => !v.is_gift),
                                (obj) => obj.product_id,
                            ).find((x) => x.product_id == v.product_id);
                        });
                        if (product_apply_combo.length != product_apply.length) {
                            productCheck = false;
                        }
                    } else if (is_apply_any_product) {
                        const checkProduct = order_details
                            .filter((v) => !v.is_gift)
                            .filter((x) => {
                                return product_apply.find((y) => x.product_id == y.product_id);
                            });
                        if (!checkProduct.length) {
                            productCheck = false;
                        }
                    } else {
                        productCheck = false;
                    }
                }
            }
            //pass 1/2 là ok
            if (!categoryCheck || !productCheck) continue;

            // Kiem tra số tiền Khuyến mại theo mức giá
            if (is_promotion_by_price) {
                const checkProduct = order_details
                    .filter((v) => !v.is_gift)
                    .filter((x) => {
                        return checkMinMax(from_price, to_price, x.price);
                    });
                if (!checkProduct.length) {
                    continue;
                }
            }

            // Kiểm tra Khuyến mại trên tổng tiền
            if (
                is_promotion_by_total_money &&
                !checkMinMax(min_promotion_total_money, max_promotion_total_money, sub_total)
            ) {
                continue;
            }

            //Kiểm tra số lượng tối thiểu
            if (
                is_promotion_by_total_quantity &&
                !checkMinMax(min_promotion_total_quantity, max_promotion_total_quantity, total_quantity)
            ) {
                continue;
            }

            // Kiểm tra hình thức thanh toán
            if (!promotion.is_all_payment_form) {
                let payment_form_ = (payment_form_apply || []).filter((v) => {
                    return (data_payment || []).find((x) => x.payment_form_id == v.payment_form_id);
                });
                // if (payment_form_.length != payment_form_apply.length) {
                //     continue;
                // }
                if (!payment_form_.length) {
                    continue;
                }
            }

            promotionApply.push(promotion);
        }
        const shipping_fee = apiHelper.getValueFromObject(bodyParams, 'shipping_fee');

        // Tính giá trị được uu đãi trên từng promotion
        const promotionApplyOffer = calcPromotionDiscount(order_details, promotionApply, shipping_fee)?.map(
            (promotion) => {
                return {
                    ...promotion,
                    total_discount: promotion.offers?.reduce((acc, cur) => acc + cur.discount, 0),
                };
            },
        );
        return new ServiceResponse(true, '', _.orderBy(promotionApplyOffer, 'total_discount', 'desc'));
    } catch (e) {
        logger.error(e, { function: 'orderService.getListPromotion' });
        return new ServiceResponse(true, '', []);
    }
};

// Tính số tiền được giảm trên từng ưu đãi trong các chương trình khuyến mãi
const calcPromotionDiscount = (items, promotionApply, shippingFee) => {
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

            promotionApply[i]['offers'][j].defend_key = promotionApply[i]?.defend_key;
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

                promotionApply[i]['offers'][j].shipping_discount = shippingDiscount;
                promotionApply[i]['offers'][j].discount = shippingDiscount;
                continue;
            }

            // Tính giá được khuyên mãi trên tổng đơn hàng hay tren từng sản phẩm
            // Nếu km áp dụng trên đơn hàng thì tính giá trị discount
            // Ngược lại nếu không tính trên đơn hàng thì tính offer discoung trên từng sản phẩm xem giá tri được bao nhiêu
            // promotionApply[i]['offers'][j].discount = is_apply_order
            //     ? calcPromotionApplyOrder(offer, items, promotionApply[i])
            //     : 0;
            if (is_apply_order) {
                promotionApply[i]['offers'][j].discount = calcPromotionApplyOrder(offer, items, promotionApply[i]);
            } else {
                promotionApply[i]['offers'][j].discount = 0;
                promotionApply[i]['offers'][j].offer_product = calcPromotionApplyProduct(
                    offer,
                    items,
                    promotionApply[i],
                );
                promotionApply[i]['offers'][j].discount = promotionApply[i]['offers'][j].offer_product?.reduce(
                    (acc, cur) => acc + cur.discount,
                    0,
                );
            }
        }

        //sắp xếp lại theo giá trị ưu đãi
        promotionApply[i]['offers'] = _.orderBy(promotionApply[i]['offers'], 'discount', 'desc');
    }
    return promotionApply;
};

// Tính giảm giá trên đơn hàng
const calcPromotionApplyOrder = (offer, products, promotion = {}) => {
    const {
        is_fix_price = 0,
        is_percent_discount = 0,
        is_discount_by_set_price = 0,
        discount_value = 0,
        max_value_reduce,
        max_total_money,
        min_total_money,
        promotion_offer_name,
    } = offer;

    // tính lại tổng giá trị đơn hàng theo các sản phẩm thoả mãn điều kiện
    let totalMoney = 0;
    const {
        is_apply_all_product,
        from_price,
        to_price,
        is_promotion_by_price,
        is_apply_product_category,
        product_apply = [],
        product_category_apply = [],
    } = promotion;
    // Sẽ trả về offer theo từng sản phẩm hình thức xuất trong đơn hàng
    for (let i = 0; i < products.length; i++) {
        const { quantity = 0, price = 0, product_id, product_category_id } = products[i];
        if (is_fix_price || is_percent_discount || is_discount_by_set_price) {
            // Kiểm tra xem sản phẩm nào thỏa điều kiện thì sẽ tính tổng tiền
            if (
                (is_apply_all_product ||
                    (is_apply_product_category &&
                        product_category_apply.findIndex((x) => x.product_category_id == product_category_id) >= 0) ||
                    product_apply.findIndex((k) => k.product_id == product_id) >= 0) &&
                (!is_promotion_by_price || (is_promotion_by_price && checkMinMax(from_price, to_price, price)))
            ) {
                //nếu là giảm theo phần trăm thì kiểm tra điều kiện của giảm theo phần trăm
                totalMoney += price * quantity;
            }
        }
    }

    let discount = 0;
    // Nếu là giảm giá trực tiếp là giá được km
    if (is_discount_by_set_price) {
        discount += discount_value;
    }
    // Nếu giảm giá % thì sẽ tính giá trị giảm trên % tổng đơn hàng
    else if (is_percent_discount) {
        if (checkBetweenNumber(min_total_money, max_total_money, totalMoney)) {
            discount += Math.round((totalMoney * discount_value * 1) / 100);

            if (max_value_reduce) {
                discount = discount > max_value_reduce ? max_value_reduce : discount;
            }
        }
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
const calcPromotionApplyProduct = (offer, products, promotion = {}) => {
    const {
        is_apply_all_product,
        from_price,
        to_price,
        is_promotion_by_price,
        is_apply_product_category,
        product_apply = [],
        product_category_apply = [],
    } = promotion;
    const {
        is_fix_price = 0,
        is_percent_discount = 0,
        is_discount_by_set_price = 0,
        discount_value = 0,
        max_value_reduce,
        max_total_money,
        min_total_money,
    } = offer;

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
            imei_code,
        } = products[i];
        if (is_fix_price || is_percent_discount || is_discount_by_set_price) {
            let discount = 0;
            // Kiểm tra xem sản phẩm nào thỏa điều kiện thì sẽ tính giảm giá cho sp đó
            if (
                (is_apply_all_product ||
                    (is_apply_product_category &&
                        product_category_apply.findIndex((x) => x.product_category_id == product_category_id) >= 0) ||
                    product_apply.findIndex((k) => k.product_id == product_id) >= 0) &&
                (!is_promotion_by_price || (is_promotion_by_price && checkBetweenNumber(from_price, to_price, price)))
            ) {
                // Nếu là giảm giá trực tiếp là giá được km
                if (is_discount_by_set_price) {
                    discount = discount_value * quantity * 1;
                }
                // Nếu giảm giá % thì sẽ tính giá trị giảm trên % tổng đơn hàng
                else if (is_percent_discount) {
                    if (checkBetweenNumber(min_total_money, max_total_money, price * quantity)) {
                        let totalMoney = Math.round((price * quantity * discount_value) / 100);
                        discount = totalMoney;

                        if (max_value_reduce) {
                            discount = totalMoney > max_value_reduce ? max_value_reduce : totalMoney;
                        }
                    }
                }
                // Giảm giá cứng: KM = tổng giá trị đơn hàng - giảm giá cứng
                else if (is_fix_price) {
                    const fixDiscountPrice = price - discount_value;
                    if (fixDiscountPrice <= 0) discount += 0;
                    else discount = (fixDiscountPrice * quantity * 100) / 100;
                }
                discount = discount * 1;
                // Set gia tri khuyen mai cho san pham do
                offer_product.push({
                    discount,
                    product_id,
                    product_category_id,
                    product_output_type_id,
                    product_unit_id,
                    imei_code,
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

const checkBetweenNumber = (numberOne, numberTow, value) => {
    if (value) {
        if (numberOne && numberTow) {
            if (numberOne < value && value < numberTow) {
                return true;
            } else {
                return false;
            }
        } else if (numberOne) {
            if (numberOne < value && !numberTow) {
                return true;
            } else {
                return false;
            }
        } else if (numberTow) {
            if (numberTow > value && !numberOne) {
                return true;
            } else {
                return false;
            }
        }
        return true;
    }
    return false;
};

const TYPECOUPON = {
    shopdunk_pre_order: 1,
    coupon_order: 2,
};

const getCoupon = async (bodyParams = {}) => {
    try {
        const pool = await mssql.pool;
        const coupon_code_auto = apiHelper.getValueFromObject(bodyParams, 'coupon_code_auto', '');
        const order_id = apiHelper.getValueFromObject(bodyParams, 'order_id', null);
        const store_id = apiHelper.getValueFromObject(bodyParams, 'store_id', null);
        const coupon_code = apiHelper.getValueFromObject(bodyParams, 'coupon_code', '').trim();

        let dataDiscountPreOrder = null;
        let dataGift = null;
        if (!coupon_code_auto) {
            const data = await pool
                .request()
                .input('ORDERID', order_id)
                .input('STOREID', store_id)
                .input('COUPONCODE', coupon_code)
                .execute('SL_PREORDER_getCouponPreOrder_AdminWeb');

            dataDiscountPreOrder = data?.recordset?.[0].DISCOUNTVALUE;
            dataGift = data?.recordsets[1];
        }

        let gifts = orderClass.gift(dataGift, true);
        if (dataDiscountPreOrder == '-1') {
            if (!(gifts && Array.isArray(gifts) && gifts.length > 0)) {
                dataDiscountPreOrder = null;
            }
        }

        if (dataDiscountPreOrder) {
            let couponCode = {
                coupon_name: coupon_code,
                type: TYPECOUPON.shopdunk_pre_order,
                total_discount: dataDiscountPreOrder,
            };

            if (dataDiscountPreOrder == '-1') {
                if (gifts && Array.isArray(gifts) && gifts.length > 0) {
                    let cloneGifts = { ...gifts[0] };
                    cloneGifts.imei_code_options = gifts;
                    gifts = [cloneGifts];
                }
                couponCode.gifts = gifts;
            }
            return new ServiceResponse(true, '', couponCode);
        } else {
            const products = apiHelper.getValueFromObject(bodyParams, 'products', []);
            const productIds = _.uniq(products.map((product) => product.product_id));
            const totalMoney = apiHelper.getValueFromObject(bodyParams, 'total_money', 0);
            const promotions = apiHelper.getValueFromObject(bodyParams, 'promotions', []);
            let promotionsIds = _.uniq(promotions.map((promotion) => promotion.promotion_id));
            const coupons = apiHelper.getValueFromObject(bodyParams, 'coupons', []);
            // const couponsIds = _.uniq(coupons.map((promotion) => promotion.coupon));
            let strProductIds = '';
            let strCouponsIds = '';
            let lenProduct = 1;
            let lenghtCoupon = 0;
            const couponList = apiHelper.getValueFromObject(bodyParams, 'coupon_list', []);
            let arrCoupon = [];
            if (couponList) {
                const defendKey = ['coupon_id'];
                if (Array.isArray(couponList)) {
                    for (let i = 0; i < couponList.length; i++) {
                        const checkCoupon = checkJsonByArrayKey(couponList[i], defendKey);
                        if (checkCoupon) {
                            arrCoupon.push(couponList[i].coupon_id);
                            lenghtCoupon++;
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

            if (promotionsIds && Array.isArray(promotionsIds) && promotionsIds.length > 0) {
                promotionsIds = promotionsIds.join(',');
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
                .input('PAYPARNER', apiHelper.getValueFromObject(bodyParams, 'pay_parner', ''))
                .input('ORDERID', order_id)
                .input('CUSTOMERID', apiHelper.getValueFromObject(bodyParams, 'customer_id', ''))
                .input('TYPECUSTOMER', apiHelper.getValueFromObject(bodyParams, 'type_customer', ''))
                .input('PARTNERID', apiHelper.getValueFromObject(bodyParams, 'partner_id', ''))
                .input('ORDERTYPEID', apiHelper.getValueFromObject(bodyParams, 'order_type_id', ''))
                .input('COUPONCODE', coupon_code)
                .execute('SL_ORDER_GetCouponByCode_App');

            if (dataCoupon.recordset.length) {
                let coupon = orderClass.coupon(dataCoupon.recordset[0]);
                coupon.type = TYPECOUPON.coupon_order;

                coupon.apply_products = orderClass.couponProducts(dataCoupon.recordsets[1]);
                if (coupon.code_type === CODE_TYPE.MONEY) {
                    coupon.total_discount = coupon.code_value;
                } else if (coupon.code_type === CODE_TYPE.PERCENT) {
                    const percentValue = (coupon.budget * coupon.code_value) / 100;
                    const maxReduceValue = coupon.max_value_reduce;

                    coupon.total_discount = !maxReduceValue
                        ? percentValue
                        : maxReduceValue > percentValue
                          ? percentValue
                          : maxReduceValue > totalMoney
                            ? totalMoney
                            : maxReduceValue;
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

const indexOf = (array, unit, value) => {
    return array.findIndex((el) => el[value] === unit);
};

const handleMergeData = (arr) => {
    const res = [];
    let listTag = [];

    for (let i = 0; i < arr.length; i++) {
        const ind = indexOf(res, arr[i].product_id, 'product_id');
        if (ind !== -1) {
            res[ind].quantity += arr[i].quantity;
        } else {
            res.push(arr[i]);
        }
    }
    return res;
};

// Lay danh sach khuyen mai da apply
const getListPromotionApplied = async (orderId) => {
    try {
        const pool = await mssql.pool;
        // Lay danh sach khuyen mai con han su dung
        const dataPromotion = await pool
            .request()
            .input('ORDERID', orderId)
            .execute('SL_ORDER_GetListPromotionApply_AdminWeb');
        let promotions = orderClass.promotions(dataPromotion.recordset, true);
        let productApply = orderClass.productApplyPromotion(dataPromotion.recordsets[1], true);
        let offers = orderClass.offers(dataPromotion.recordsets[2], true);
        let gifts = orderClass.gift(dataPromotion.recordsets[3], true);

        let giftsMerge = handleMergeData(gifts);

        gifts = giftsMerge;

        if (!promotions || !promotions.length) return new ServiceResponse(true, 'ok', []);
        // Filter cap nhat lai danh sach san pham ap dung tren tung ct khuyen mai neu co
        for (let i = 0; i < promotions.length; i++) {
            let promotion = promotions[i];
            let product_apply = (productApply || []).filter((p) => p.promotion_id == promotion.promotion_id);
            promotions[i].product_apply = product_apply || [];
        }
        // Filter cap nhat lai danh sach uu dai tren khuyen mai
        for (let i = 0; i < promotions.length; i++) {
            let promotion = promotions[i];
            let _offers = (offers || []).filter((p) => p.promotion_id == promotion.promotion_id && p.is_picked);
            _offers = _offers.map((item) => {
                return { ...item };
            });

            for (let j = 0; j < _offers.length; j++) {
                const { is_fixed_gift, promotion_offer_id } = _offers[j];
                // Neu co qua tang thi lay danh sach qua tang
                if (is_fixed_gift) {
                    _offers[j].gifts = (gifts || []).filter((v) => v.promotion_offer_id == promotion_offer_id);
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
const getListProductInStock = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const pool = await mssql.pool;
        // Đơn hàng bình thường
        const data = await pool
            .request()
            .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'inputValue'))
            .input('STOCKSID', sql.Int, apiHelper.getValueFromObject(queryParams, 'stocks_id', null))
            .input('STOREID', sql.Int, apiHelper.getValueFromObject(queryParams, 'store_id', null))
            .input('ISACTIVE', 1)
            .input('ISREVIEW', 1)
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .execute('MD_PRODUCT_getList_ForOrder_AdminWeb');

        let products = orderClass.listProductInStock(data.recordsets[0]);
        const outputTypes = orderClass.optionsInit(data.recordsets[1]);
        const areas = orderClass.optionsInit(data.recordsets[2]);
        const stores = orderClass.optionsInit(data.recordsets[3]);

        products = (products || []).map((x) => {
            let product_output_type = (outputTypes || []).filter((m) => m.product_id == x.product_id);
            let product_store = (stores || []).filter((l) => l.product_id == x.product_id);
            let product_area = (areas || []).filter((n) => n.product_id == x.product_id);
            return {
                ...x,
                product_output_type,
                product_store,
                product_area,
                area_id: product_area.length ? product_area[0].value : null,
                store_id: product_store.length ? product_store[0].value : null,
                product_output_type_id: product_output_type.length ? product_output_type[0].value : null,
            };
        });

        return new ServiceResponse(true, '', {
            data: products,
            page: currentPage,
            limit: itemsPerPage,
            total: data.recordset.length ? data.recordset[0].TOTAL : 0,
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
            .execute('SL_ORDER_GetOptionUser_AdminWeb');
        const res = orderClass.userOption(data.recordset);
        return new ServiceResponse(true, '', { data: res });
    } catch (e) {
        logger.error(e, { function: 'order.getOptionUser' });
        return new ServiceResponse(false, '', {});
    }
};

const exportExcel = async (queryParams = {}) => {
    queryParams.itemsPerPage = String(API_CONST.MAX_EXPORT_EXCEL);
    let serviceRes = await getListOrder(queryParams);

    const { data } = serviceRes.getData();

    let wb = new xl.Workbook({
        defaultFont: {
            name: 'Times New Roman',
        },
    });

    // Add Worksheets to the workbook
    const ws = wb.addWorksheet('ĐƠN HÀNG', {});

    // Set height header
    ws.row(1).setHeight(10);
    ws.row(2).setHeight(23);
    ws.row(3).setHeight(23);
    ws.row(4).setHeight(23);
    ws.row(5).setHeight(23);
    ws.row(6).setHeight(23);
    ws.row(7).setHeight(23);
    ws.row(8).setHeight(23);
    ws.row(9).setHeight(23);
    ws.row(10).setHeight(23);
    ws.row(11).setHeight(23);

    // Set width data
    ws.column(1).setWidth(10);
    ws.column(2).setWidth(20);
    ws.column(3).setWidth(20);
    ws.column(4).setWidth(20);
    ws.column(5).setWidth(30);
    ws.column(6).setWidth(20);
    ws.column(7).setWidth(20);
    ws.column(8).setWidth(20);
    ws.column(9).setWidth(20);
    ws.column(10).setWidth(20);
    ws.column(11).setWidth(20);

    // Khai báo header
    let header = {
        order_no: 'Mã đơn hàng',
        full_name: 'Khách hàng',
        stocks_name: 'Xuất tại kho',
        order_type_name: 'Loại đơn hàng',
        order_status_name: 'Trạng thái đơn hàng',
        payment_status_name: 'Trạng thái thanh toán',
        order_source: 'Nguồn',
        created_date: 'Ngày tạo',
        total_money: 'Thành tiền',
        created_user: 'Người tạo',
    };

    const countHeader = 11;

    data.unshift(header);

    //options style
    const ColumnsRows = wb.createStyle({
        font: {
            color: 'black',
            size: 16,
            bold: true,
        },
        fill: {
            type: 'pattern',
            patternType: 'solid',
            bgColor: '#FFFFFF',
            fgColor: '#FFFFFF',
        },
        alignment: {
            wrapText: true,
            horizontal: 'center',
        },
    });

    const ColumnsRowDate = wb.createStyle({
        font: {
            color: 'black',
            size: 12,
            bold: true,
        },
        alignment: {
            wrapText: true,
            horizontal: 'center',
            vertical: 'center',
        },
    });

    const ColumnsRowValueDate = wb.createStyle({
        font: {
            color: 'black',
            size: 12,
        },
        alignment: {
            wrapText: true,
            horizontal: 'center',
        },
    });

    const ColumnsRowTotalMoney = wb.createStyle({
        font: {
            color: 'black',
            size: 12,
        },
        alignment: {
            wrapText: true,
            horizontal: 'center',
        },
    });

    const borderThin = {
        border: {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
        },
    };

    ws.cell(1, 1, 1, countHeader, true);
    ws.cell(2, 1, 2, countHeader, true).string('ĐƠN HÀNG').style(ColumnsRows);
    ws.cell(3, 1, 3, countHeader, true)
        .string(
            (
                moment().format('h:mm A') +
                ' - ' +
                ' Ngày ' +
                moment().format('DD') +
                ' tháng ' +
                moment().format('MM') +
                ' năm ' +
                moment().format('YYYY')
            ).toString(),
        )
        .style(ColumnsRowTotalMoney);

    data.forEach((item, index) => {
        let indexRow = index + 4;
        let indexCol = 0;
        if (index === 0) {
            ws.row(indexRow).setHeight(30);
            ws.cell(indexRow, ++indexCol).string('STT').style(ColumnsRowDate).style(borderThin);

            ws.cell(indexRow, ++indexCol)
                .string((item.order_no || '').toString())
                .style(ColumnsRowDate)
                .style(borderThin);

            ws.cell(indexRow, ++indexCol)
                .string((item.full_name || '').toString())
                .style(ColumnsRowDate)
                .style(borderThin);

            ws.cell(indexRow, ++indexCol)
                .string((item.stocks_name || '').toString())
                .style(ColumnsRowDate)
                .style(borderThin);

            ws.cell(indexRow, ++indexCol)
                .string((item.order_type_name || '').toString())
                .style(ColumnsRowDate)
                .style(borderThin);

            ws.cell(indexRow, ++indexCol)
                .string((item.order_status_name || '').toString())
                .style(ColumnsRowDate)
                .style(borderThin);

            ws.cell(indexRow, ++indexCol)
                .string((item.payment_status_name || '').toString())
                .style(ColumnsRowDate)
                .style(borderThin);

            ws.cell(indexRow, ++indexCol)
                .string((item.order_source || '').toString())
                .style(ColumnsRowDate)
                .style(borderThin);

            ws.cell(indexRow, ++indexCol)
                .string((item.created_date || '').toString())
                .style(ColumnsRowDate)
                .style(borderThin);

            ws.cell(indexRow, ++indexCol)
                .string((item.total_money || '').toString())
                .style(ColumnsRowDate)
                .style(borderThin);

            ws.cell(indexRow, ++indexCol)
                .string((item.created_user || '').toString())
                .style(ColumnsRowDate)
                .style(borderThin);
            return;
        }
        ws.row(indexRow).setHeight(40);
        ws.cell(indexRow, ++indexCol).number(index).style(ColumnsRowValueDate).style(borderThin);

        ws.cell(indexRow, ++indexCol)
            .string((item.order_no || '').toString())
            .style(ColumnsRowValueDate)
            .style(borderThin)
            .style({ alignment: { horizontal: 'left' } });

        ws.cell(indexRow, ++indexCol)
            .string((item.full_name || '').toString())
            .style(ColumnsRowValueDate)
            .style(borderThin)
            .style({ alignment: { horizontal: 'left' } });

        ws.cell(indexRow, ++indexCol)
            .string((item.stocks_name || '').toString())
            .style(ColumnsRowValueDate)
            .style(borderThin)
            .style({ alignment: { horizontal: 'left' } });

        ws.cell(indexRow, ++indexCol)
            .string((item.order_type_name || '').toString())
            .style(ColumnsRowValueDate)
            .style(borderThin)
            .style({ alignment: { horizontal: 'left' } });

        ws.cell(indexRow, ++indexCol)
            .string((item.order_status_name || '').toString())
            .style(ColumnsRowValueDate)
            .style(borderThin)
            .style({ alignment: { horizontal: 'left' } });

        ws.cell(indexRow, ++indexCol)
            .string((item.payment_status_name || '').toString())
            .style(ColumnsRowValueDate)
            .style(borderThin)
            .style({ alignment: { horizontal: 'left' } });

        ws.cell(indexRow, ++indexCol)
            .string((item.order_source || '').toString())
            .style(ColumnsRowValueDate)
            .style(borderThin)
            .style({ alignment: { horizontal: 'left' } });

        ws.cell(indexRow, ++indexCol)
            .string((item.created_date || '').toString())
            .style(ColumnsRowValueDate)
            .style(borderThin)
            .style({ alignment: { horizontal: 'left' } });
        ws.cell(indexRow, ++indexCol)
            .string((`${item.total_money} đ ` || '').toString())
            .style(ColumnsRowValueDate)
            .style(borderThin)
            .style({ alignment: { horizontal: 'left' } });

        ws.cell(indexRow, ++indexCol)
            .string((item.created_user || '').toString())
            .style(ColumnsRowValueDate)
            .style(borderThin)
            .style({ alignment: { horizontal: 'left' } });
    });

    return new ServiceResponse(true, '', wb);
};

const getBankAccountOptions = async (params = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('CASHIERID', apiHelper.getValueFromObject(params, 'auth_id'))
            .execute('AM_COMPANY_BANKACCOUNT_GetOptionsOrder_AdminWeb');
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
            .execute('SYS_BUSINESS_USER_GetListStoreByUser_AdminWeb');

        return new ServiceResponse(true, '', { items: orderClass.optionStore(data.recordset) });
    } catch (e) {
        logger.error(e, { function: 'orderyService.getListStoreByUser' });
        return new ServiceResponse(true, '', []);
    }
};

const getProduct = async (queryParams = {}, bodyParams = {}) => {
    try {
        const pool = await mssql.pool;
        const keyword = apiHelper.getValueFromObject(queryParams, 'keyword', '').trim();
        const order_type_id = apiHelper.getValueFromObject(queryParams, 'order_type_id');
        const store_id = apiHelper.getValueFromObject(queryParams, 'store_id');

        let resData = await pool
            .request()
            .input('IMEI', keyword)
            .input('ORDERTYPEID', order_type_id)
            .input('STOREID', store_id)
            .execute('MD_PRODUCT_GetByIMEI_AdminWeb');

        if (!resData.recordset[0]) {
            const currentPage = apiHelper.getCurrentPage(queryParams);
            const itemsPerPage = apiHelper.getItemsPerPage(queryParams);

            resData = await pool
                .request()
                .input('KEYWORD', keyword)
                .input('ORDERTYPEID', order_type_id)
                .input('STOREID', store_id)
                .input('PageSize', itemsPerPage || 15)
                .input('PageIndex', currentPage)
                .execute('MD_PRODUCT_GetByKeyword_AdminWeb');

            if (!resData.recordset[0]) {
                return new ServiceResponse(false, 'Không tìm thấy sản phẩm', null);
            }

            let products = orderClass.productByImei(resData.recordset);
            const outputTypes = orderClass.outputTypeOptions(resData.recordsets[1]);

            products = products.map((item) => {
                return {
                    ...item,
                    product_output_type: outputTypes.filter(
                        (outputType) =>
                            outputType.product_id == item.product_id &&
                            (outputType.imei_code == null || item.imei_code == outputType.imei_code),
                    ),
                };
            });

            return new ServiceResponse(true, '', {
                data: products,
                page: currentPage,
                limit: itemsPerPage,
                total: resData.recordset[0].TOTALITEMS,
            });
        }

        const product = orderClass.productByImei(resData.recordset[0]);
        const outputTypes = orderClass.outputTypeOptions(resData.recordsets[1]);

        if (!outputTypes || outputTypes.length == 0) {
            return new ServiceResponse(false, 'Không tìm thấy sản phẩm', null);
        }

        product.product_output_type = outputTypes;

        return new ServiceResponse(true, '', product);
    } catch (e) {
        logger.error(e, { function: 'orderyService.getProduct' });
        return new ServiceResponse(false, e.message, []);
    }
};

const paymentOrder = async (bodyParams) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    await transaction.begin();

    try {
        const order_id = apiHelper.getValueFromObject(bodyParams, 'order_id');

        const data_payment = apiHelper
            .getValueFromObject(bodyParams, 'data_payment', [])
            .filter((item) => item.payment_type == 1);

        const requestReceiveslip = new sql.Request(transaction);
        const requestCreateReceiveslipOrder = new sql.Request(transaction);

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

            for (let i = 0; i < data_payment.length; i++) {
                let itemPayment = data_payment[i];
                if (1 * itemPayment.payment_value > 0) {
                    const data = await requestReceiveslip
                        .input('RECEIVETYPEID', value_config)
                        .input('BANKACCOUNTID', apiHelper.getValueFromObject(itemPayment, 'bank_id'))
                        .input('CASHIERID', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                        .input('MEMBERID', apiHelper.getValueFromObject(bodyParams, 'customer_id'))
                        .input('PAYMENTFORMID', apiHelper.getValueFromObject(itemPayment, 'payment_form_id'))
                        .input('DESCRIPTIONS', apiHelper.getValueFromObject(itemPayment, 'descriptions', ''))
                        .input('TOTALMONEY', apiHelper.getValueFromObject(itemPayment, 'payment_value'))
                        .input('NOTES', apiHelper.getValueFromObject(itemPayment, 'note', ''))
                        .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                        .input('ISACTIVE', 1)
                        .input('ISREVIEW', 1)
                        .input('PAYMENTSTATUS', 1) // trạng thái đã thanh toán
                        .input('PAYMENTTYPE', 3) // Khách hàng
                        .input('ORDERID', order_id) //Đơn hàng

                        .execute('SL_RECEIVESLIP_CreateOrUpdateForOrder_AdminWeb');
                    const receiveslipId = data.recordset[0].RESULT;

                    if (receiveslipId <= 0) {
                        await transaction.rollback();
                        return new ServiceResponse(false, RESPONSE_MSG.RECEIVESLIP.CREATE_FAILED);
                    }

                    const dataCreateReceiveslipOrder = await requestCreateReceiveslipOrder
                        .input('RECEIVESLIPID', receiveslipId)
                        .input('ORDERID', order_id)
                        .input('TOTALMONEY', apiHelper.getValueFromObject(itemPayment, 'payment_value'))
                        .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                        .execute('SL_RECEIVESLIP_ORDER_CreateOrUpdate_AdminWeb');

                    const targetResult =
                        dataCreateReceiveslipOrder?.recordsets?.find(
                            (recordset) =>
                                recordset?.[0]?.RESULT &&
                                recordset?.[0]?.ISVALIDRECEIVESLIPORDER &&
                                recordset?.[0]?.ORDERNO &&
                                recordset?.[0]?.PAYMENTSTATUS,
                        )?.[0] || {};

                    const {
                        RESULT: receiveslipOrder,
                        ISVALIDRECEIVESLIPORDER: isValid,
                        ORDERNO: orderNo,
                    } = targetResult;

                    if (!isValid) {
                        await transaction.rollback();
                        return new ServiceResponse(false, `Đơn hàng ${orderNo} đã thu đủ tiền.`);
                    }
                    if (receiveslipOrder <= 0) {
                        await transaction.rollback();
                        return new ServiceResponse(false, 'Tạo phiếu thu với đơn hàng thất bại');
                    }
                }
            }
        }

        await transaction.commit();
        return new ServiceResponse(true, 'Thanh toán thành công ', { order_id });
    } catch (e) {
        logger.error(e, { function: 'orderService.paymentOrder' });
        await transaction.rollback();
        return new ServiceResponse(false, 'Thanh toán thất bại !');
    }
};

const getListOrderType = async (queryParams, bodyParams) => {
    try {
        const pool = await mssql.pool;

        const resData = await pool
            .request()
            .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'search')?.trim())
            .input('ACTION', apiHelper.getValueFromObject(queryParams, 'action')) // add, edit, view, delete
            .input('USERNAME', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('SL_ORDER_GetListOrderTypeByAction_AdminWeb');

        if (!resData || !resData.recordset) {
            return new ServiceResponse(false, 'Lấy danh sách loại đơn hàng thất bại !');
        }

        const data = resData.recordset;
        return new ServiceResponse(true, '', orderClass.orderType(data));
    } catch (e) {
        logger.error(e, { function: 'orderService.getListOrderType' });
        return new ServiceResponse(false, 'Lấy danh sách loại đơn hàng thất bại !');
    }
};

const cashPayment = async (bodyParams) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    await transaction.begin();
    try {
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
        const order_id = apiHelper.getValueFromObject(bodyParams, 'order_id');
        const auth_name = apiHelper.getValueFromObject(bodyParams, 'auth_name');
        const totalMoney = apiHelper.getValueFromObject(bodyParams, 'payment_value');
        const description = apiHelper.getValueFromObject(bodyParams, 'description');
        const payment_type = apiHelper.getValueFromObject(bodyParams, 'payment_type');

        //tạo phiếu thu
        const receiveslipData = await requestReceiveslip
            .input('RECEIVETYPEID', value_config)
            // .input('RECEIVESLIPID', apiHelper.getValueFromObject(itemPayment, 'receive_slip_id'))
            // .input('BANKACCOUNTID', apiHelper.getValueFromObject(itemPayment, 'bank_id'))
            .input('CASHIERID', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .input('MEMBERID', apiHelper.getValueFromObject(bodyParams, 'member_id'))
            .input('PAYMENTFORMID', apiHelper.getValueFromObject(bodyParams, 'payment_form_id'))
            .input('DESCRIPTIONS', description)
            .input('TOTALMONEY', totalMoney)
            .input('NOTES', apiHelper.getValueFromObject(bodyParams, 'description'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .input('ISACTIVE', 1)
            .input('ISREVIEW', 1)

            .input('PAYMENTSTATUS', 1) // trạng thái đã thanh toán

            .input('PAYMENTTYPE', payment_type === PAYMENT_TYPE.CASH ? 1 : 2)
            .input('ORDERID', order_id) //Đơn hàng

            .execute('SL_RECEIVESLIP_CreateOrUpdateForOrder_AdminWeb');
        const receiveslipId = receiveslipData.recordset[0].RESULT;

        if (receiveslipId <= 0) {
            await transaction.rollback();
            return new ServiceResponse(false, RESPONSE_MSG.RECEIVESLIP.CREATE_FAILED);
        }

        // Tạo hạch toán
        const accountingData = {
            auth_name,
            receiveslip_id: receiveslipId,
            money: totalMoney,
            descriptions: description,
            order_id,
            payment_form_id: apiHelper.getValueFromObject(bodyParams, 'payment_form_id'),
        };
        const result = await _createAccounting(accountingData, transaction);
        if (!result) {
            await transaction.rollback();
            return new ServiceResponse(false, RESPONSE_MSG.RECEIVESLIP.CREATE_FAILED);
        }

        //cập nhật trạng thái đơn hàng
        const dataCreateReceiveslipOrder = await requestCreateReceiveslipOrder
            .input('RECEIVESLIPID', receiveslipId)
            // .input('RECEIVESLIPORDERID', apiHelper.getValueFromObject(bodyParams, 'receiveslip_order_id'))
            .input('ORDERID', order_id)
            .input('TOTALMONEY', totalMoney)
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('SL_RECEIVESLIP_ORDER_CreateOrUpdate_AdminWeb');

        const targetResult =
            dataCreateReceiveslipOrder?.recordsets?.find(
                (recordset) =>
                    recordset?.[0]?.RESULT &&
                    recordset?.[0]?.ISVALIDRECEIVESLIPORDER &&
                    recordset?.[0]?.ORDERNO &&
                    recordset?.[0]?.PAYMENTSTATUS,
            )?.[0] || {};

        const {
            RESULT: receiveslipOrder,
            ISVALIDRECEIVESLIPORDER: isValid,
            ORDERNO: orderNo,
            PAYMENTSTATUS: paymentStatus,
        } = targetResult;
        if (!isValid) {
            await transaction.rollback();
            return new ServiceResponse(false, `Đơn hàng ${orderNo} đã thu đủ tiền.`);
        }
        if (receiveslipOrder <= 0) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Tạo phiếu thu với đơn hàng thất bại');
        }

        // if (paymentStatus == PAYMENT_STATUS.PAID) {
        //     const createCrmAccountRequest = new sql.Request(transaction);
        //     const createCrmAccountData = await createCrmAccountRequest
        //         .input('ORDERID', order_id)
        //         .execute('CRM_ACCOUNT_CreateByOrderId_AdminWeb');
        // }

        const updateOrderStatus = new sql.Request(transaction);
        const t = await updateOrderStatus
            .input('ORDERID', order_id)
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('SL_ORDER_UpdatePreOrderStatus_AdminWeb');

        await transaction.commit();
        return new ServiceResponse(true, 'Thanh toán thành công', { paymentStatus, orderId: order_id });
    } catch (e) {
        logger.error(e, { function: 'orderService.cashPayment' });
        await transaction.rollback();
        return new ServiceResponse(false, 'Thanh toán đơn hàng thất bại');
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

const getPaymentHistory = async (order_id) => {
    try {
        const pool = await mssql.pool;

        const request = await pool
            .request()
            .input('ORDERID', order_id)
            .execute('SL_ORDERDETAIL_GetPaymentHisory_AdminWeb');

        return new ServiceResponse(true, '', orderClass.paymentHistory(request.recordset));
    } catch (error) {
        logger.error(error, { function: 'orderService.getPaymentHistory' });
        return new ServiceResponse(false, 'Lấy lịch sử thanh toán thất bại');
    }
};

const getListMaterial = async (queryParams) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const pool = await mssql.pool;

        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('STOREID', apiHelper.getValueFromObject(queryParams, 'store_id'))
            .execute('SL_MATERIAL_GetListByStoreId_AdminWeb');

        return new ServiceResponse(true, '', {
            data: orderClass.materialList(data.recordset),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordset),
        });
    } catch (error) {
        logger.error(error, { function: 'orderService.getListMaterial' });
        return new ServiceResponse(false, 'Lấy danh sách nguyên vật liệu thất bại');
    }
};

const checkSendSmsOrZaloOA = async (bodyParams = {}) => {
    try {
        const pool = await mssql.pool;
        //Kiểm tra xem trạng thái đơn hàng có được gửi SMS hay ZaloOA hay không ?
        const dataOrderSendSMS = await pool
            .request()
            .input('ORDERID', apiHelper.getValueFromObject(bodyParams, 'order_id'))
            .input('ORDERSTATUSID', apiHelper.getValueFromObject(bodyParams, 'order_status_id'))
            .input('ORDERTYPEID', apiHelper.getValueFromObject(bodyParams, 'order_type_id'))
            .execute('SL_ORDER_CheckSendSmsOrZaloOA_AdminWeb');

        const result = {
            ...orderClass.checkSendSmsOrZaloOA(dataOrderSendSMS.recordset[0]),
            dataSend: orderClass.checkSendData(dataOrderSendSMS.recordsets[1][0]),
        };

        return new ServiceResponse(true, 'ok', result);
    } catch (e) {
        logger.error(e, { function: 'orderService.checkSendSmsOrZaloOA' });
        return new ServiceResponse(false, '', {});
    }
};

const getListCustomer = async (queryParams) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams, 50);
        const keyword = apiHelper.getSearch(queryParams).trim();
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('KEYWORD', keyword)
            .input('CUSTOMERID', apiHelper.getValueFromObject(queryParams, 'customer_id'))
            .input('CUSTOMERTYPE', apiHelper.getValueFromObject(queryParams, 'customer_type'))
            .execute('SL_ORDER_getListCustomer_AdminWeb');

        // const Account = data.recordsets[0];
        const customers = data.recordset;
        return new ServiceResponse(true, '', {
            data: orderClass.customerList(customers),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(customers),
        });
    } catch (e) {
        logger.error(e, {
            function: 'orderService.getListCustomer',
        });
        return new ServiceResponse(true, '', {});
    }
};

const checkOrderStatusToNotify = async (bodyParams = {}) => {
    try {
        const pool = await mssql.pool;
        //Kiểm tra xem trạng thái đơn hàng có được gửi SMS hay ZaloOA hay không ?
        const dataOrderSendSMS = await pool
            .request()
            .input('ORDERID', apiHelper.getValueFromObject(bodyParams, 'order_id'))
            .input('ORDERSTATUSID', apiHelper.getValueFromObject(bodyParams, 'order_status_id'))
            .input('ORDERTYPEID', apiHelper.getValueFromObject(bodyParams, 'order_type_id'))
            .execute('SL_ORDER_CheckSendSmsOrZaloOA_AdminWeb');

        const result = {
            ...orderClass.checkSendSmsOrZaloOA(dataOrderSendSMS.recordset[0]),
            dataSend: orderClass.checkSendData(dataOrderSendSMS.recordsets[1][0]),
        };

        return new ServiceResponse(true, 'ok', result);
    } catch (e) {
        logger.error(e, { function: 'orderService.checkSendSmsOrZaloOA' });
        return new ServiceResponse(false, '', {});
    }
};

const exportPreOrderPdf = async (queryParams = {}) => {
    try {
        const order_id = apiHelper.getValueFromObject(queryParams, 'order_id');
        const pool = await mssql.pool;

        const data = await pool.request().input('ORDERID', order_id).execute('SL_ORDER_GetPreOrderById_AdminWeb');

        if (data?.recordset?.[0]) {
            let order = orderClass.preOrderDetail(data?.recordset?.[0]);

            order.total_money = formatCurrency(order.total_money, 0);
            order.pre_money = formatCurrency(order.pre_money, 0);
            order.total_amount = formatCurrency(order.total_amount, 0);

            const fileName = `Don_hang_pre_${moment().format('DDMMYYYY_HHmmss')}_${order_id}`;

            const print_params = {
                // template:
                //      moment(order.created_date, 'DD-MM-YYYY').diff(moment('29/09/2023', 'DD-MM-YYYY'), 'seconds') >=
                //             0 && order.product_name?.includes('iPhone 15 Pro Max')
                //       ? 'viewPreOrder1.ejs'
                //       : 'viewPreOrder.ejs',
                template:
                    moment(order.created_date, 'DD-MM-YYYY').diff(moment('20/09/2024', 'DD-MM-YYYY'), 'seconds') >= 0
                        ? // &&
                          //     order.product_name?.includes('Samsung Galaxy S24')
                          'viewPreOrderShopDunk.ejs'
                        : 'viewPreOrder.ejs',
                data: order,
                filename: fileName,
                format: 'A4',
                landscape: false,
                isOnlyFirstPage: true,
            };
            await pdfHelper.printPDF(print_params);

            return new ServiceResponse(true, '', { path: `pdf/${fileName}.pdf` });
        }

        return new ServiceResponse(false, 'Không tìm thấy đơn hàng.');
    } catch (e) {
        logger.error(e, { function: 'order.service.exportPreOrderPdf' });
        return new ServiceResponse(false, 'Lỗi không thể in đơn hàng.', []);
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

const getProductReport = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const order_type_ids = apiHelper.getValueFromObject(queryParams, 'order_type_ids');
        const company_id = apiHelper.getValueFromObject(queryParams, 'company_id');
        const area_id = apiHelper.getValueFromObject(queryParams, 'area_id');
        const business_ids = apiHelper.getValueFromObject(queryParams, 'business_id');
        const created_date_from = apiHelper.getValueFromObject(queryParams, 'created_date_from');
        const created_date_to = apiHelper.getValueFromObject(queryParams, 'created_date_to');
        const pool = await mssql.pool;

        const data = await pool
            .request()
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('ORDERTYPEIDS', order_type_ids)
            .input('COMPANYID', company_id)
            .input('AREAID', area_id)
            .input('BUSINESSID', business_ids?.map((_) => _.id)?.join(',') || null)
            .input('CREATEDDATEFROM', created_date_from)
            .input('CREATEDDATETO', created_date_to)
            .execute('SL_ORDER_GetProductReport_AdminWeb');

        let result1 = orderClass.productReport(data.recordset);
        const result2 = orderClass.storeReport(data.recordsets[1]);
        const result3 = orderClass.orderReport(data.recordsets[2]);

        const storeList = result2.reduce((acc, record) => {
            const isPushed = acc.find((_) => _.store_id === record.store_id);
            if (!isPushed) {
                acc.push({
                    store_id: record.store_id,
                    store_name: record.store_name,
                    store_code: record.store_code,
                });
            }
            return acc;
        }, []);

        result1 = result1.map((product) => {
            product.stores = storeList.map((store) => {
                const quantity = result2.find(
                    (_) => _.store_id === store.store_id && _.product_id === product.product_id,
                );
                return {
                    store_id: store.store_id,
                    store_name: store.store_name,
                    store_code: store.store_code,
                    quantity: quantity?.quantity || 0,
                };
            });
            return product;
        });

        return new ServiceResponse(true, 'Lấy danh sách sản phẩm theo đơn hàng thành công', {
            data: result1,
            stores: storeList,
            orders: result3,
        });
    } catch (e) {
        logger.error(e, { function: 'order.service.getProductReport' });
        return new ServiceResponse(false, e.message, null);
    }
};

const getReportChart = async (queryParams = {}) => {
    try {
        const order_type_ids = apiHelper.getValueFromObject(queryParams, 'order_type_ids');
        const company_id = apiHelper.getValueFromObject(queryParams, 'company_id');
        const area_id = apiHelper.getValueFromObject(queryParams, 'area_id');
        const business_ids = apiHelper.getValueFromObject(queryParams, 'business_id');
        const created_date_from = apiHelper.getValueFromObject(queryParams, 'created_date_from');
        const created_date_to = apiHelper.getValueFromObject(queryParams, 'created_date_to');
        const model_id = apiHelper.getValueFromObject(queryParams, 'model_id');
        const pool = await mssql.pool;

        const data = await pool
            .request()
            .input('ORDERTYPEIDS', order_type_ids)
            .input('COMPANYID', company_id)
            .input('AREAID', area_id)
            .input('BUSINESSID', business_ids?.map((_) => _.id)?.join(',') || null)
            .input('CREATEDDATEFROM', created_date_from)
            .input('CREATEDDATETO', created_date_to)
            .input('MODELID', model_id)
            .execute('SL_ORDER_GetProductReportForChart_AdminWeb');

        const reportRecode = data.recordset;
        const report = orderClass.productChart(reportRecode);

        report.forEach((item) => {
            item.level = model_id ? 2 : 1;
        });

        return new ServiceResponse(true, 'success', report);
    } catch (e) {
        logger.error(e, { function: 'order.service.getReportChart' });
        return new ServiceResponse(false, e.message, null);
    }
};

const countByCustomer = async (queryParams = {}) => {
    try {
        let member_id = isNaN(queryParams.member_id) ? null : Number(queryParams.member_id);
        let dataleads_id = isNaN(queryParams.dataleads_id) ? null : Number(queryParams.dataleads_id);

        let query;

        if (member_id) {
            query = `SELECT COUNT(*) AS RESULT FROM SL_ORDER WHERE ISDELETED = 0 AND MEMBERID = ${member_id}`;
        } else if (dataleads_id) {
            query = `SELECT COUNT(*) AS RESULT FROM SL_ORDER WHERE ISDELETED = 0 AND DATALEADSID = ${dataleads_id}`;
        } else {
            return new ServiceResponse(true, 'ok', -1);
        }

        const pool = await mssql.pool;
        const dataRes = await pool.request().query(query);
        const dataResult = dataRes?.recordset[0]?.RESULT;

        return new ServiceResponse(true, 'ok', dataResult);
    } catch (e) {
        logger.error(e, { function: 'orderService.countByCustomer' });
        return new ServiceResponse(false, '', {});
    }
};

const updateOrderInstallmentStatus = async (bodyParam = {}) => {
    try {
        const order_id = bodyParam.order_id;
        const order_data = bodyParam.order_data;

        const pool = await mssql.pool;
        await pool.request().input('ORDERID', order_id).execute('SL_ORDER_UpdateInstallmentStatus_AdminWeb');

        // create other voucher
        if (order_data) {
            await _createOtherAccVoucher(order_data, bodyParam.auth_name);
        }

        return new ServiceResponse(true, 'ok', order_id);
    } catch (e) {
        logger.error(e, { function: 'orderService.updateOrderInstallmentStatus' });
        return new ServiceResponse(false, '', {});
    }
};

const _createOtherAccVoucher = async (orderData, auth_name) => {
    const codeRes = await genOtherVoucherCode();
    const otherVoucherCode = await codeRes.getData()?.code;

    const orderId = orderData.order_id;

    const pool = await mssql.pool;
    const otherDataRes = await pool
        .request()
        .input('ORDERID', orderId)
        .input('INSTALLMENTFORMID', orderData.installment_form_id)
        .execute('SL_ORDER_GetOtherVoucherData_AdminWeb');

    const receiveTypeId = otherDataRes.recordset[0]?.RECEIVETYPEID;
    const expiredDays = otherDataRes.recordset[0]?.INSTALLMENTPARTNERPAYMENTID || null;
    const accountingId = otherDataRes.recordset[0]?.ACCOUNTINGACCOUNT;
    const installmentPartnerId = otherDataRes.recordset[0]?.INSTALLMENTPARTNERID;
    const installmentPartnerName = otherDataRes.recordset[0]?.INSTALLMENTPARTNERNAME;

    if (otherVoucherCode && orderData.total_a_mount > 0 && receiveTypeId) {
        const otherAccVoucher = {
            created_date: moment().format('DD/MM/YYYY'),
            invoice_date: orderData.created_date,
            payment_expired_date: expiredDays ? null : moment().add(expiredDays, 'days').format('DD/MM/YYYY'),
            is_merge_invoice: 0,
            not_declare_tax: 0,
            other_acc_voucher_code: otherVoucherCode,
            voucher_type: `${receiveTypeId}_${VOUCHER_TYPE.RECEIVE}`,
            store_id: orderData.store_id,
            business_id: orderData.business_id,
            total_money: orderData.total_a_mount,
            bookeeping_status: 2,
            accounting_list: [
                {
                    note: `hạch toán trả góp với ${orderData.installment_form_name} + ${orderData.order_no?.trim()}`,
                    debt_acc_id: accountingId,
                    credit_acc_id: accountingId,
                    money: orderData.total_a_mount,
                    voucher_type: `${receiveTypeId}_${VOUCHER_TYPE.RECEIVE}`,
                    debt_object_type: OBJECT_TYPE.PARTNER,
                    credit_object_type: OBJECT_TYPE.INDIVIDUAL_CUSTOMER,
                    debt_object_id: installmentPartnerId,
                    credit_object_id: orderData.member_id,
                    debt_object_name: installmentPartnerName,
                    credit_object_name: orderData.customer_name,
                },
            ],
        };

        const createRes = await createOtherAccVoucher({ ...otherAccVoucher, auth_name });

        if (createRes.isSuccess()) {
            const otherAccVoucherId = createRes.getData();

            if (otherAccVoucherId) {
                await pool
                    .request()
                    .query(`UPDATE SL_ORDER SET OTHERACCVOUCHERID = ${otherAccVoucherId} WHERE ORDERID = ${orderId}`);
            }
        } else {
            throw new Error('Thêm mới chứng từ khác xảy ra lỗi !');
        }
    } else {
        throw new Error('Dữ liệu đơn hàng không đủ !');
    }
};

const getPaymentPolicy = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;

        const data = await pool
            .request()
            .input('KEYCONFIG', 'PAYMENT_POLICY')
            .execute('SYS_APPCONFIG_GetByKeyConfig_AdminWeb');

        return new ServiceResponse(true, '', data.recordset[0].VALUECONFIG);
    } catch (e) {
        logger.error(e, { function: 'order.service.getPaymentPolicy' });
        return new ServiceResponse(false, e.message, null);
    }
};

const getDataExportOrder = async () => {
    const pool = await mssql.pool;
    const res = await pool.request().execute('SL_ORDER_GetList_Export_AdminWeb');
    // console.log('res', res);

    return new ServiceResponse(true, '', res.recordsets);
};

const exportExcelOrder = async (queryParams = {}) => {
    try {
        const dataRes = await getDataExportOrder();

        //logic get data export
        if (dataRes.isFailed()) return new ServiceResponse(false, dataRes.getErrors());
        const data_response = dataRes.getData();
        const styles = {
            bold_center: {
                alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
                font: { bold: true },
                border: {
                    top: {
                        style: 'thin',
                    },
                    left: {
                        style: 'thin',
                    },
                    right: {
                        style: 'thin',
                    },
                },
                fill: {
                    type: 'pattern', // the only one implemented so far.
                    patternType: 'solid', // most common.
                    fgColor: '#0e99cd',
                },
            },
            header: {
                alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
                font: { bold: true },
                border: {
                    top: {
                        style: 'thin',
                    },
                    left: {
                        style: 'thin',
                    },
                    bottom: {
                        style: 'thin',
                    },
                },
            },
            row: {
                border: {
                    bottom: { style: 'dashed' },
                    left: { style: 'thin' },
                },
            },
            last_row: {
                border: {
                    bottom: { style: 'thin' },
                    left: { style: 'thin' },
                },
            },
            row_last_column: {
                bottom: { style: 'thin' },
                left: { style: 'thin' },
            },
            border: {
                line: {
                    top_right: {
                        border: {
                            top: {
                                style: 'thin',
                            },
                            right: {
                                style: 'thin',
                            },
                        },
                    },
                    right: {
                        border: {
                            right: {
                                style: 'thin',
                            },
                        },
                    },
                    left_top_right: {
                        left: { style: 'thin' },
                        top: { style: 'thin' },
                        right: { style: 'thin' },
                    },
                    all: {
                        left: { style: 'thin' },
                        top: { style: 'thin' },
                        right: { style: 'thin' },
                        bottom: { style: 'thin' },
                    },
                },
                line_top_left: {
                    border: {
                        top: {
                            style: 'thick',
                            colo: 'black',
                        },
                        left: {
                            style: 'thick',
                            colo: 'black',
                        },
                    },
                },
            },
            body_center: {
                alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
                border: {
                    top: {
                        style: 'thin',
                    },
                    left: {
                        style: 'thin',
                    },
                    bottom: {
                        style: 'thin',
                    },
                    right: {
                        style: 'thin',
                    },
                },
            },
        };

        let work_book = new xl.Workbook({
            defaultFont: {
                name: 'Times New Roman',
            },
        });

        let work_sheet = null;
        work_sheet = work_book.addWorksheet('Danh sách đơn hàng');

        work_sheet.row(1).setHeight(40);
        work_sheet.column(1).freeze();
        work_sheet.column(3).setWidth(25);
        const obj_short = [1, 2, 4, 5, 6, 8, 10, 12, 11, 13, 18, 20, 21, 25, 26, 27, 28, 29, 31];
        const obj_long = [7, 9, 14, 16, 17, 19, 22, 23, 24];

        obj_short.map((item, index) => work_sheet.column(item).setWidth(20));
        obj_long.map((item, index) => work_sheet.column(item).setWidth(30));

        //startRow, startColumn, endRow, endColumn, applyToRow
        /**
         * startRow: Số hàng của ô bắt đầu.
          startColumn: Số cột của ô bắt đầu.
          endRow: Số hàng của ô kết thúc.
          endColumn: Số cột của ô kết thúc.
         */
        //Header file excel
        work_sheet.cell(1, 1, 1, 1, true).string('Ngày').style(styles.bold_center);
        work_sheet.cell(1, 2, 1, 2, true).string('Mã đơn hàng').style(styles.bold_center);
        work_sheet.cell(1, 3, 1, 3, true).string('Loại đơn hàng').style(styles.bold_center);
        work_sheet.cell(1, 4, 1, 4, true).string('Trạng thái đơn hàng').style(styles.bold_center);
        work_sheet.cell(1, 5, 1, 5, true).string('Trạng thái thanh toán').style(styles.bold_center);
        work_sheet.cell(1, 6, 1, 6, true).string('Mã cửa hàng').style(styles.bold_center);
        work_sheet.cell(1, 7, 1, 7, true).string('Tên Khách Hàng').style(styles.bold_center);
        work_sheet.cell(1, 8, 1, 8, true).string('Số điện thoại').style(styles.bold_center);
        work_sheet.cell(1, 9, 1, 9, true).string('Email').style(styles.bold_center);
        work_sheet.cell(1, 10, 1, 10, true).string('Hình thức thanh toán').style(styles.bold_center);
        work_sheet.cell(1, 11, 1, 11, true).string('Số tiền thanh toán').style(styles.bold_center);
        work_sheet.cell(1, 12, 1, 12, true).string('Thời gian thanh toán').style(styles.bold_center);
        work_sheet.cell(1, 13, 1, 13, true).string('Mã NV').style(styles.bold_center);
        work_sheet.cell(1, 14, 1, 14, true).string('Nhân viên').style(styles.bold_center);
        work_sheet.cell(1, 15, 1, 15, true).string('Đã xuất hóa đơn chưa').style(styles.bold_center);
        work_sheet.cell(1, 16, 1, 16, true).string('Tên trên hoá đơn').style(styles.bold_center);
        work_sheet.cell(1, 17, 1, 17, true).string('Email xuất hóa đơn').style(styles.bold_center);
        work_sheet.cell(1, 18, 1, 18, true).string('MST').style(styles.bold_center);
        work_sheet.cell(1, 19, 1, 19, true).string('Địa chỉ xuất hóa đơn').style(styles.bold_center);
        // work_sheet.cell(1, 20, 1, 20, true).string('Khách hàng').style(styles.bold_center);
        work_sheet.cell(1, 20, 1, 20, true).string('Ngành hàng').style(styles.bold_center);
        work_sheet.cell(1, 21, 1, 21, true).string('Nhóm hàng').style(styles.bold_center);
        work_sheet.cell(1, 22, 1, 22, true).string('Mã hàng').style(styles.bold_center);
        work_sheet.cell(1, 23, 1, 23, true).string('Tên hàng').style(styles.bold_center);
        work_sheet.cell(1, 24, 1, 24, true).string('Kho').style(styles.bold_center);
        work_sheet.cell(1, 25, 1, 25, true).string('IMEI').style(styles.bold_center);
        work_sheet.cell(1, 26, 1, 26, true).string('Số lượng').style(styles.bold_center);
        work_sheet.cell(1, 27, 1, 27, true).string('Đơn giá(VNĐ)').style(styles.bold_center);
        work_sheet.cell(1, 28, 1, 28, true).string('Chiết khấu').style(styles.bold_center);
        work_sheet.cell(1, 29, 1, 29, true).string('Thành tiền').style(styles.bold_center);
        work_sheet.cell(1, 30, 1, 30, true).string('Thời gian bảo hành').style(styles.bold_center);
        work_sheet.cell(1, 31, 1, 31, true).string('Mã PREORDER').style(styles.bold_center);

        //BODY excel
        let row_position = 2;
        const data_body = data_response[0];
        for (let i = 0; i < data_body.length; i++) {
            let _index = 0;
            work_sheet
                .cell(row_position, 1)
                .string(`${moment(data_body[i]?.order_date, 'DD/MM/YYYY').format('DD/MM/YYYY')}`);
            work_sheet.cell(row_position, 2).string(`${data_body[i]?.order_code || ''}`);
            work_sheet.cell(row_position, 3).string(`${data_body[i]?.order_type_name || ''}`);
            work_sheet.cell(row_position, 4).string(`${data_body[i]?.status_name || ''}`);
            work_sheet.cell(row_position, 5).string(`${convertPaymentStatus(data_body[i]?.payment_status) || ''}`);
            work_sheet.cell(row_position, 6).string(`${data_body[i]?.store_name || ''}`);
            work_sheet.cell(row_position, 7).string(`${data_body[i]?.full_name || ''}`);
            work_sheet
                .cell(row_position, 8)
                .string(`${data_body[i]?.phone_number ? addLeadingZero(data_body[i]?.phone_number) : ''}`);
            work_sheet.cell(row_position, 9).string(`${data_body[i]?.email || ''}`);
            work_sheet.cell(row_position, 10).string(`${convertPaymentType(data_body[i]?.payment_type) || ''}`);
            work_sheet
                .cell(row_position, 11)
                .number(Number(`${data_body[i]?.total_money || ''}`))
                .style({
                    numberFormat: '#,##0',
                });
            work_sheet
                .cell(row_position, 12)
                .string(
                    `${
                        data_body[i].payment_time
                            ? moment(data_body[i]?.payment_time, 'DD/MM/YYYY').format('HH:mm, DD/MM/YYYY')
                            : ''
                    }`,
                );
            work_sheet.cell(row_position, 13).string(`${data_body[i]?.user_name}`);
            work_sheet.cell(row_position, 14).string(`${data_body[i]?.user_full_name}`);
            work_sheet.cell(row_position, 15).string(`${data_body[i]?.is_invoice ? 'Có' : 'Không'}`);
            work_sheet.cell(row_position, 16).string(`${data_body[i]?.invoice_fullname || ''}`);
            work_sheet.cell(row_position, 17).string(`${data_body[i]?.invoice_email || ''}`);
            work_sheet.cell(row_position, 18).string(`${data_body[i]?.invoice_tax || ''}`);
            work_sheet.cell(row_position, 19).string(`${data_body[i]?.invoice_address || ''}`);
            // work_sheet.cell(row_position, 20).string(`${data_body[i]?.order_date}`);
            work_sheet.cell(row_position, 20).string(`${data_body[i]?.category_name || ''}`);
            work_sheet.cell(row_position, 21).string(`${data_body[i]?.model_name || ''}`);
            work_sheet.cell(row_position, 22).string(`${data_body[i]?.product_code || ''}`);
            work_sheet.cell(row_position, 23).string(`${data_body[i]?.product_name || ''}`);
            work_sheet.cell(row_position, 24).string(`${data_body[i]?.stocks_name || ''}`);
            work_sheet.cell(row_position, 25).string(`${data_body[i]?.imei_code || ''}`);
            work_sheet.cell(row_position, 26).number(Number(`${data_body[i]?.quantity || ''}`));
            work_sheet
                .cell(row_position, 27)
                .number(Number(`${data_body[i]?.price || ''}`))
                .style({
                    numberFormat: '#,##0',
                });
            work_sheet
                .cell(row_position, 28)
                .number(Number(`${data_body[i]?.discount_value || ''}`))
                .style({
                    numberFormat: '#,##0',
                });
            work_sheet
                .cell(row_position, 29)
                .number(Number(`${data_body[i]?.total_price || ''}`))
                .style({
                    numberFormat: '#,##0',
                });
            work_sheet.cell(row_position, 30).string(`${data_body[i]?.description || ''}`);
            work_sheet.cell(row_position, 31).string(`${data_body[i]?.pre_order_no || ''}`);
            // ws.cell(row_position, 32).string(`${dataRes[i]?.order_date}`).style(styles.body_center);
            row_position += 1;
        }

        return new ServiceResponse(true, '', work_book);
    } catch (error) {
        logger.error(error, { function: 'order.service.getDataExport' });
        return new ServiceResponse(false, error.message, null);
    }
};

const updateInvoiceLink = async (queryParams = {}) => {
    try {
        const order_id = apiHelper.getValueFromObject(queryParams, 'order_id');
        const invoice_url = apiHelper.getValueFromObject(queryParams, 'invoice_url');
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('ORDERID', order_id)
            .input('INVOICEURL', invoice_url)
            .execute('SL_ORDER_Update_InvoiceLink_AdminWeb');

        const result = data.recordset;
        return new ServiceResponse(true, 'success', result);
    } catch (error) {
        logger.error(error, { function: 'orderService.updateInvoiceLink' });
        return new ServiceResponse(false, '', error.message);
    }
};

const getListStoreBySale = async (bodyParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('STOREID', apiHelper.getValueFromObject(bodyParams, 'store_id'))
            .execute('SYS_BUSINESS_USER_GetListStoreBySale_AdminWeb');

        const result = orderClass.getSaleInfo(data.recordset);

        return new ServiceResponse(true, '', result);
    } catch (e) {
        logger.error(e, { function: 'orderyService.getListStoreBySale' });
        return new ServiceResponse(false, '', []);
    }
};

const getUserReviewOptions = async (params = {}) => {
    try {
        const pool = await mssql.pool;
        const reviewLevel = await pool
            .request()
            .input('STOREID', apiHelper.getValueFromObject(params, 'store_id'))
            .execute('SL_ORDER_GetUserReview_AdminWeb');

        return new ServiceResponse(true, 'Lấy danh sách user review thành công', reviewLevel.recordset);
    } catch (error) {
        logger.error(error, { function: 'orderyService.getUserReviewOptions' });
        return new ErrorResponse(false, error.message);
    }
};

const createOderReview = async (bodyParams = {}) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        await transaction.begin();
        const is_review = apiHelper.getValueFromObject(bodyParams, 'is_review');

        // Nếu là update thì xóa hình ảnh
        if (apiHelper.getValueFromObject(bodyParams, 'order_detail_id')) {
            const requestImagesDel = new sql.Request(transaction);
            const resImagesDel = await deleteTKCImages(bodyParams, requestImagesDel);
            if (resImagesDel.isFailed()) {
                await transaction.rollback();
                return new ServiceResponse(false, resImagesDel.getMessage());
            }
        }

        const user_name = apiHelper.getValueFromObject(bodyParams.auth, 'user_name');
        const full_name = apiHelper.getValueFromObject(bodyParams.auth, 'full_name');
        const user_full_name = `${user_name} - ${full_name}`;

        if (is_review === 1) {
            let total_money;
            const price_old = apiHelper.getValueFromObject(bodyParams, 'price_old');
            const voucherName = apiHelper.getValueFromObject(bodyParams, 'voucher_request');
            const value_vat = apiHelper.getValueFromObject(bodyParams, 'value_vat');
            const quantity = apiHelper.getValueFromObject(bodyParams, 'quantity');
            const order_detail_id = apiHelper.getValueFromObject(bodyParams, 'order_detail_id');
            const order_id = apiHelper.getValueFromObject(bodyParams, 'order_id');
            const debt_account_id = apiHelper.getValueFromObject(bodyParams, 'debt_account_id');
            const revenue_account_id = apiHelper.getValueFromObject(bodyParams, 'revenue_account_id');
            const tax_account_id = apiHelper.getValueFromObject(bodyParams, 'tax_account_id');

            // Lấy tổng Tiền giảm của voucher
            const resCoupon = await getListCoupon({ search: voucherName });
            //Tính lại tổng tiền (Giá bao gôm VAT)
            if (resCoupon.data.data[0].code_value >= price_old) {
                total_money = 0;
            } else {
                total_money = price_old - resCoupon.data.data[0].code_value; //47,490,000
            }

            //Tính tiền thuế (Tiền thuế VAT)
            const vat_amount = Math.round(quantity * (total_money - total_money / (1 + value_vat / 100))); //4,317,273
            //Tính thành tiền (Giá chwua bào gồm VAT)
            const total_price_base = total_money - vat_amount; //43,172,727

            //Cập nhật SL_ORDERDETAIL ( Duyệt )
            try {
                const requestCreateOrUpdateOrderDetail = new sql.Request(transaction);
                const data = await requestCreateOrUpdateOrderDetail
                    .input('ORDERDETAILID', order_detail_id)
                    .input('VOUCHERREQUEST', voucherName)
                    .input('ISREVIEW', is_review)
                    .input('PRICEOLD', price_old)
                    .input('VATAMOUNT', vat_amount)
                    .input('TOTALPRICE', total_money)
                    .input('PRICE', total_money)
                    .input('TOTALAMOUNT', total_money)
                    .input('TOTALPRICEBASE', total_price_base)
                    .input('ERRORDES', apiHelper.getValueFromObject(bodyParams, 'error_des'))
                    .input('REVIEWUSER', apiHelper.getValueFromObject(bodyParams, 'review_user'))
                    .input('ERRORNOTE', apiHelper.getValueFromObject(bodyParams, 'error_note'))
                    .execute('SL_ORDERDETAIL_CreateOrderReview_AdminWeb');

                const orderDetailId = data.recordset[0].RESULT;
                if (orderDetailId <= 0) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Duyệt đơn hàng thất bại!');
                }
            } catch (error) {
                console.log(e.message);
                return new ServiceResponse(false, 'Duyệt đơn hàng thất bại!');
            }

            if (order_id) {
                let total_money_order;
                let receiveslipId;
                let res_acc_id;
                let total_price_base;
                let total_vat;

                const data = await pool.request().input('ORDERID', order_id).execute('SL_ORDER_GetById_AdminWeb');
                if (!data.recordset || !data.recordset.length) {
                    return new ServiceResponse(false, 'Không tìm thấy đơn hàng!');
                }

                let order = orderClass.detail(data.recordset[0]);

                //Tính lại tổng tiền trừ tiền voucher (Giá bao gôm VAT)
                if (resCoupon.data.data[0].code_value >= order.total_money) {
                    total_money_order = 0;
                } else {
                    total_money_order = order.total_money - resCoupon.data.data[0].code_value;
                }
                if (order) {
                    //Tính giá trị thuế
                    const value_vat = Math.round((order.total_money - order.total_vat) / order.total_vat); //10%
                    //Tính tiền thuế (Tiền thuế VAT)
                    total_vat = Math.round(total_money_order - total_money_order / (1 + value_vat / 100));
                    //thành tiền
                    total_price_base = total_money_order - total_vat;
                    //tính số tiền còn lại (có thể âm)
                    const cal_total_amount = total_money_order - order?.total_paid;

                    // Cập nhật đơn hàng SL_ORDER
                    try {
                        const requestCreateOrUpdateOrder = new sql.Request(transaction);
                        const resOrder = await requestCreateOrUpdateOrder
                            .input('ORDERID', order_id)
                            .input('TOTALMONEY', total_money_order)
                            .input('TOTALVAT', total_vat)
                            .input('TOTALAMOUNT', cal_total_amount)
                            .input('ISINVOICE', apiHelper.getValueFromObject(bodyParams, 'is_invoice'))
                            .input(
                                'INVOICECOMPANYNAME',
                                apiHelper.getValueFromObject(bodyParams, 'invoice_company_name'),
                            )
                            .input('INVOICEEMAIL', apiHelper.getValueFromObject(bodyParams, 'invoice_email'))
                            .input('INVOICEFULLNAME', apiHelper.getValueFromObject(bodyParams, 'invoice_full_name'))
                            .input('INVOICETAX', apiHelper.getValueFromObject(bodyParams, 'invoice_tax'))
                            .input('INVOICEPRICE', apiHelper.getValueFromObject(bodyParams, 'invoice_price'))
                            .input('INVOICEADDRESS', apiHelper.getValueFromObject(bodyParams, 'invoice_address'))
                            .input('RECEIVINGDATE', apiHelper.getValueFromObject(bodyParams, 'receiving_date'))
                            .input('ISDELIVERYTYPE', apiHelper.getValueFromObject(bodyParams, 'is_delivery_type'))
                            .input('STOREID', apiHelper.getValueFromObject(bodyParams, 'store_id'))
                            .input('SALESASSISTANT', apiHelper.getValueFromObject(bodyParams, 'salesassistant'))
                            .input('RECEIVEADDRESSID', apiHelper.getValueFromObject(bodyParams, 'address_id'))
                            .execute('SL_ORDER_CreateOrUpdate_AdminWeb');
                        const orderId = resOrder.recordset[0].RESULT;
                        if (orderId <= 0) {
                            await transaction.rollback();
                            return new ServiceResponse(false, 'Cập nhật đơn hàng thất bại!');
                        }
                    } catch (error) {
                        console.log(e.message);
                        return new ServiceResponse(false, 'Cập nhật đơn hàng thất bại!');
                    }
                }

                //Cập nhật hạch toán AC_ACCOUNTING
                if (revenue_account_id && debt_account_id) {
                    try {
                        const accountingRequest = new sql.Request(transaction);
                        const resultAccounting = await accountingRequest
                            .input('DEBTACCOUNT', debt_account_id)
                            .input('CREDITACCOUNT', revenue_account_id)
                            .input('ORDERID', order_id)
                            .input('MONEY', total_money_order)
                            .input('CREDITMONEY', total_price_base)
                            .input('TAXMONEY', total_vat)
                            .execute('AC_ACCOUNTING_UpdateTotalMoney_AdminWeb');

                        const resAccId = resultAccounting.recordset[0].RESULT;
                        res_acc_id = resAccId;

                        if (resAccId <= 0) {
                            await transaction.rollback();
                            return new ServiceResponse(false, 'Cập nhật hạch toán thất bại!');
                        }
                    } catch (error) {
                        console.log(e.message);
                        return new ServiceResponse(false, 'Cập nhật hạch toán thất bại!');
                    }

                    if (res_acc_id) {
                        try {
                            const accountingRequest = new sql.Request(transaction);
                            const resultAccounting = await accountingRequest
                                .input('DEBTACCOUNT', debt_account_id) //21
                                .input('CREDITACCOUNT', revenue_account_id) //199
                                .input('TAXACCOUNTID', tax_account_id) //116
                                .input('ACCOUNTINGID', res_acc_id)
                                .input('TOTALPRICEBASE', total_price_base)
                                .input('TOTALVAT', total_vat)
                                .execute('AC_ACCOUNTING_DETAIL_UpdateTotalMoney_AdminWeb');

                            const resAccDetailId = resultAccounting.recordset[0].RESULT;

                            if (resAccDetailId <= 0) {
                                await transaction.rollback();
                                return new ServiceResponse(false, 'Cập nhật hạch toán thất bại!');
                            }
                        } catch (error) {
                            console.log(e.message);
                            return new ServiceResponse(false, 'Cập nhật hạch toán thất bại!');
                        }
                    }
                }

                //Cập nhật phiếu thu SL_RECEIVESLIP
                // try {
                //     const requestReceiveslip = new sql.Request(transaction);
                //     const receiveslipData = await requestReceiveslip
                //         .input('TOTALMONEY', total_money_order)
                //         .input('ORDERID', order_id)
                //         .execute('SL_RECEIVESLIP_UpdateTotalMoney_AdminWeb');

                //     const id = receiveslipData.recordset[0].RESULT;

                //     if (id) {
                //         receiveslipId = id
                //     }

                //     if (id <= 0) {
                //         await transaction.rollback();
                //         return new ServiceResponse(false, 'Cập nhật phiếu thu thất bại!');
                //     }
                // } catch (error) {
                //     console.log(e.message);
                //     return new ServiceResponse(false, 'Cập nhật phiếu thu thất bại!');
                // }

                // if (receiveslipId) {
                //     //Cập nhật hạch toán AC_ACCOUNTING
                //     try {
                //         const accountingRequest = new sql.Request(transaction);
                //         const resultAccounting = await accountingRequest
                //             .input('RECEIVESLIPID', receiveslipId)
                //             .input('MONEY', total_money_order)
                //             .execute('AC_ACCOUNTING_UpdateTotalMoney_AdminWeb');

                //         const resAccId = resultAccounting.recordset[0].RESULT;

                //         if (resAccId <= 0) {
                //             await transaction.rollback();
                //             return new ServiceResponse(false, 'Cập nhật hạch toán thất bại!');
                //         }
                //     } catch (error) {
                //         console.log(e.message);
                //         return new ServiceResponse(false, 'Cập nhật hạch toán thất bại!');
                //     }

                //     // Cập nhật phiếu thu trên đơn hàng
                //     try {
                //         const requestCreateReceiveslipOrder = new sql.Request(transaction);
                //         const dataCreateReceiveslipOrder = await requestCreateReceiveslipOrder
                //             .input('RECEIVESLIPID', receiveslipId)
                //             .input('ORDERID', order_id)
                //             .input('TOTALMONEY', total_money_order)
                //             .execute('SL_RECEIVESLIP_ORDER_UpdateTotalMoney_AdminWeb');

                //         const receiveslipOrderId = dataCreateReceiveslipOrder.recordset[0].RESULT;

                //         if (receiveslipOrderId <= 0) {
                //             await transaction.rollback();
                //             return new ServiceResponse(false, 'Cập nhật phiếu thu trên đơn hàng thất bại!');
                //         }
                //     } catch (error) {
                //         console.log(e.message);
                //         return new ServiceResponse(false, 'Cập nhật phiếu thu trên đơn hàng thất bại!');
                //     }
                // }
            }

            // update or thêm mới hình ảnh minh chứng.
            const requestImages = new sql.Request(transaction);
            const images = apiHelper.getValueFromObject(bodyParams, 'images', []);
            for (const image of images) {
                let picture_url;
                if (!image.picture_url) {
                    if (fileHelper.isBase64(image)) {
                        picture_url = await fileHelper.saveBase64(null, image);
                    }
                }
                picture_url = picture_url || image.picture_url?.replace(config.domain_cdn, '');
                bodyParams.image_url = picture_url;
                const resImages = await createOrUpdateOderReviewImages(bodyParams, requestImages);
                if (resImages.isFailed()) {
                    await transaction.rollback();
                    return new ServiceResponse(true, resImages.getMessage());
                }
            }
        } else if (is_review === 2) {
            try {
                const requestCreateOrUpdateOrderDetail = new sql.Request(transaction);
                const data = await requestCreateOrUpdateOrderDetail
                    .input('ORDERDETAILID', apiHelper.getValueFromObject(bodyParams, 'order_detail_id'))
                    .input('ERRORDES', apiHelper.getValueFromObject(bodyParams, 'error_des'))
                    .input('REVIEWUSER', apiHelper.getValueFromObject(bodyParams, 'review_user'))
                    .input('VOUCHERREQUEST', apiHelper.getValueFromObject(bodyParams, 'voucher_request') || '')
                    .input('ISREVIEW', is_review)
                    .input('ERRORNOTE', apiHelper.getValueFromObject(bodyParams, 'error_note'))
                    .execute('SL_ORDERDETAIL_CreateOrderReview_AdminWeb');

                const orderDetailId = data.recordset[0].RESULT;
                if (!orderDetailId) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Tạo duyệt đơn hàng thất bại!');
                }
            } catch (error) {
                console.log(e.message);
                return new ServiceResponse(false, 'Tạo duyệt đơn hàng thất bại!');
            }

            // update or thêm mới hình ảnh minh chứng.
            const requestImages = new sql.Request(transaction);
            const images = apiHelper.getValueFromObject(bodyParams, 'images', []);
            for (const image of images) {
                let picture_url;
                if (!image.picture_url) {
                    if (fileHelper.isBase64(image)) {
                        picture_url = await fileHelper.saveBase64(null, image);
                    }
                }
                picture_url = picture_url || image.picture_url?.replace(config.domain_cdn, '');
                bodyParams.image_url = picture_url;
                const resImages = await createOrUpdateOderReviewImages(bodyParams, requestImages);
                if (resImages.isFailed()) {
                    await transaction.rollback();
                    return new ServiceResponse(true, resImages.getMessage());
                }
            }
        } else {
            // Gọi store để Update vào bảng SL_ORDERDETAIL ( tạo mới review )
            try {
                const requestCreateOrUpdateOrderDetail = new sql.Request(transaction);
                const data = await requestCreateOrUpdateOrderDetail
                    .input('ORDERDETAILID', apiHelper.getValueFromObject(bodyParams, 'order_detail_id'))
                    .input('ERRORDES', apiHelper.getValueFromObject(bodyParams, 'error_des'))
                    .input('REVIEWUSER', apiHelper.getValueFromObject(bodyParams, 'review_user'))
                    .input('VOUCHERREQUEST', apiHelper.getValueFromObject(bodyParams, 'voucher_request') || '')
                    .input('ISREVIEW', is_review ?? 0)
                    .input('ERRORNOTE', apiHelper.getValueFromObject(bodyParams, 'error_note'))
                    .input('USERREQUEST', user_full_name)
                    .execute('SL_ORDERDETAIL_CreateOrderReview_AdminWeb');

                const orderDetailId = data.recordset[0].RESULT;
                if (!orderDetailId) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Tạo duyệt đơn hàng thất bại!');
                }
            } catch (error) {
                console.log(e.message);
                return new ServiceResponse(false, 'Tạo duyệt đơn hàng thất bại!');
            }

            // update or thêm mới hình ảnh minh chứng.
            const requestImages = new sql.Request(transaction);
            const images = apiHelper.getValueFromObject(bodyParams, 'images', []);
            for (const image of images) {
                let picture_url;
                if (!image.picture_url) {
                    if (fileHelper.isBase64(image)) {
                        picture_url = await fileHelper.saveBase64(null, image);
                    }
                }
                picture_url = picture_url || image.picture_url?.replace(config.domain_cdn, '');
                bodyParams.image_url = picture_url;
                const resImages = await createOrUpdateOderReviewImages(bodyParams, requestImages);
                if (resImages.isFailed()) {
                    await transaction.rollback();
                    return new ServiceResponse(true, resImages.getMessage());
                }
            }
        }

        await transaction.commit();
        return new ServiceResponse(true, 'Tạo duyệt đơn hàng thành công');
    } catch (e) {
        await transaction.rollback();
        logger.error(e, { function: 'orderyService.createOderReview' });
        return new ServiceResponse(false, e.message);
    }
};

const deleteTKCImages = async (bodyParams = {}, reqTrans) => {
    try {
        await reqTrans
            .input('ORDERDETAILID', apiHelper.getValueFromObject(bodyParams, 'order_detail_id'))
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams.auth, 'user_name'))
            .execute('SL_ORDERACCEPTIMAGE_Delete_AdminWeb');

        return new ServiceResponse(true, 'Xóa ảnh thành công');
    } catch (error) {
        logger.error(error, { function: 'orderyService.deleteTKCImages' });
        return new ServiceResponse(false, error.message);
    }
};

const createOrUpdateOderReviewImages = async (bodyParams = {}, reqTrans) => {
    try {
        const resCreateOrUpdate = await reqTrans
            .input('ORDERDETAILID', apiHelper.getValueFromObject(bodyParams, 'order_detail_id'))
            .input('IMAGEURL', apiHelper.getValueFromObject(bodyParams, 'image_url'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams.auth, 'user_name'))
            .execute('SL_ORDERACCEPTIMAGE_CreateOrUpdate_AdminWeb');

        const templateId = resCreateOrUpdate.recordset[0].id;

        if (!templateId || templateId <= 0) {
            return new ServiceResponse(false, 'Thêm ảnh thất bại');
        }

        return new ServiceResponse(true, 'Thêm ảnh thành công');
    } catch (error) {
        logger.error(error, { function: 'orderService.createOrUpdateOderReviewImages' });

        return new ServiceResponse(false, error.message);
    }
};

const getListImageOrderReview = async (bodyParams = {}) => {
    try {
        const pool = await mssql.pool;
        const reviewLevel = await pool
            .request()
            .input('ORDERDETAILID', apiHelper.getValueFromObject(bodyParams, 'order_detail_id'))
            .execute('SL_ORDERACCEPTIMAGE_GetList_AdminWeb');

        return new ServiceResponse(
            true,
            'Lấy danh sách user review thành công',
            orderClass.imagesExplain(reviewLevel.recordset),
        );
    } catch (error) {
        logger.error(error, { function: 'orderService.getListImageOrderReview' });
        return new ErrorResponse(false, error.message);
    }
};

module.exports = {
    getListOrder,
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
    getCoupon,
    getListProductInStock,
    exportExcel,
    checkOrderExist,
    getOptionUser,
    getBankAccountOptions,
    getListStoreByUser,
    getProduct,
    paymentOrder,
    getListOrderType,
    cashPayment,
    getPaymentHistory,
    getListMaterial,
    checkSendSmsOrZaloOA,
    getListCustomer,
    checkOrderStatusToNotify,
    exportPreOrderPdf,
    getPreOrderCoupon,
    getProductReport,
    countByCustomer,
    getReportChart,
    getBusinessInfo,
    updateOrderInstallmentStatus,
    getPaymentPolicy,
    exportExcelOrder,
    updateInvoiceLink,
    getListStoreBySale,
    getUserReviewOptions,
    createOderReview,
    getListImageOrderReview,
};
