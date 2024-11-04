const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const excelHelper = require('../../common/helpers/excel.helper');
const readXlsxFile = require('read-excel-file/node');
const stringHelper = require('../../common/helpers/string.helper');
const { stockInRequestDataKey, orderDataKey, receiveSlipDataKey } = require('./utils/constants');
const { getDataValue, clearData, clearInput } = require('./utils/helpers');
const {
    createOrUpdateStocksInRequest,
    createStocksDetail,
    detailStocksInRequest,
} = require('../stocks-in-request/stocks-in-request.service');
const { createOrUpdateOrder } = require('../order/order.service');
const moment = require('moment');

const checkStockInRequestImport_ = (stockInRequest, data) => {
    let errmsg = [];
    let {
        created_date,
        auth_name,
        stocks_in_code,
        request_code,
        stocks_in_type,
        stocks_code,
        department_request,
        business_request,
        stocks_in_status,
        review_status,
        products_list,
        store_code,
    } = stockInRequest || {};

    // if (!material_code) errmsg.push('Mã túi bao bì là bắt buộc');
    const store_id = getDataValue(data, stockInRequestDataKey.store, store_code);
    const stocks_id = getDataValue(data, stockInRequestDataKey.stocks, stocks_code);

    if (!store_id) throw new Error(`Mã cửa hàng ${store_code} không tồn tại`);
    if (!stocks_id) throw new Error(`Mã kho ${stocks_code} không tồn tại`);

    products_list = products_list
        .reduce((acc, curr) => {
            if (!curr.imei) throw new Error(`Mã hàng ${curr.product_code} thuộc phiếu ${stocks_in_code} không có IMEI`);

            const findIndex = acc.findIndex((item) => clearInput(item.product_code) === clearInput(curr.product_code));
            if (findIndex === -1) {
                acc.push({
                    ...curr,
                    quantity: 1,
                    skus: [{ sku: curr.imei }],
                });
            }
            if (findIndex > -1) {
                acc[findIndex].skus.push({ sku: curr.imei });
                acc[findIndex].quantity = acc[findIndex].skus.length;
            }
            return acc;
        }, [])
        .map((product) => {
            let {
                created_date,
                stocks_in_code,
                imei,
                product_code,
                product_name,
                unit,
                is_auto_gen_imei,
                product_category,
                model,
                quantity,
                cost_price,
                total_cost_price,
                skus,
            } = product;

            const product_id = getDataValue(data, stockInRequestDataKey.product, product_code);

            if (!product_id) throw new Error(`Mã hàng ${product_code} không tồn tại`);

            cost_price = parseFloat(cost_price) ?? 0;
            total_cost_price = parseFloat(total_cost_price) ?? 0;

            return {
                created_date,
                stocks_in_code,
                imei,
                product_code,
                product_id,
                product_name,
                unit,
                unit_id: getDataValue(data, stockInRequestDataKey.unit, unit),
                is_auto_gen_imei: is_auto_gen_imei === 'Có' ? 1 : 0,
                product_category,
                product_category_id: getDataValue(data, stockInRequestDataKey.productCategory, product_category), //
                model,
                model_id: getDataValue(data, stockInRequestDataKey.productModel, model), //
                quantity,
                cost_price,
                total_cost_price,
                total_price_cost: total_cost_price,
                skus,
                total_cost_basic_imei: 0,
            };
        });

    let item = {
        created_date,
        auth_name,
        stocks_in_code,
        request_code,
        stocks_in_type,
        stocks_in_type_id: getDataValue(data, stockInRequestDataKey.stockInType, stocks_in_type),
        stocks_code,
        stocks_id,
        department_request,
        department_request_id: getDataValue(data, stockInRequestDataKey.department, department_request),
        business_request,
        business_request_id: getDataValue(data, stockInRequestDataKey.business, business_request),
        stocks_in_status,
        review_status,
        store_code,
        store_id,
        products_list,
        review_level_list: [],
        is_imported: 0,
        is_reviewed: 1,
        is_auto_review: 1,
    };

    return { errmsg, item };
};

const importStockInRequest = async (body, file, auth) => {
    try {
        // const auth_name = apiHelper.getValueFromObject(auth, 'user_name');
        const stockInRequests = await readXlsxFile(file.buffer);
        const stockInRequestDetails = await readXlsxFile(file.buffer, { sheet: 2 });

        const stockInRequestColumns = {
            created_date: 'Ngày tạo',
            auth_name: 'Nhân viên',
            stocks_in_code: 'Số phiếu nhập',
            request_code: 'Số phiếu mua hàng',
            stocks_in_type: 'Hình thức phiếu nhập',
            stocks_code: 'Mã kho nhập',
            department_request: 'Phòng ban',
            business_request: 'Chi nhánh',
            stocks_in_status: 'Trạng thái nhập kho',
            review_status: 'Trạng thái duyệt',
            store_code: 'Mã cửa hàng',
        };
        const stockInRequestDetailColumns = {
            created_date: 'Ngày tạo',
            stocks_in_code: 'Số phiếu nhập',
            imei: 'IMEI',
            product_code: 'Mã hàng',
            product_name: 'Tên hàng',
            unit: 'Đơn vị tính',
            is_auto_gen_imei: 'Tự động gen imei',
            product_category: 'Ngành hàng',
            model: 'Model',
            quantity: 'Số lượng',
            cost_price: 'Đơn giá nhập',
            total_cost_price: 'Thành tiền',
        };

        let stockInRequestList = excelHelper.getValueExcel(stockInRequests, stockInRequestColumns, false);
        let stockInRequestDetailList = excelHelper.getValueExcel(
            stockInRequestDetails,
            stockInRequestDetailColumns,
            false,
        );

        // Loại bỏ dòng title
        if (stockInRequestList.length > 0) stockInRequestList.shift();
        if (stockInRequestDetailList.length > 0) stockInRequestDetailList.shift();

        for (let i = 0; i < stockInRequestList.length; i++) {
            const products_list = stockInRequestDetailList.filter(
                (item) => item.stocks_in_code === stockInRequestList[i].stocks_in_code,
            );
            stockInRequestList[i].products_list = products_list;
        }

        let pool = await mssql.pool;
        let import_data = [];
        let import_errors = [];
        let import_total = 0;

        const resData = await pool.request().execute('ST_STOCKSINREQUEST_GetImportExcelData_AdminWeb');

        const data = clearData(resData.recordsets);

        for (let i = 0; i < stockInRequestList.length; i++) {
            import_total += 1;
            let stockInRequest = stockInRequestList[i];
            let { errmsg, item } = checkStockInRequestImport_(stockInRequest, data);

            if (errmsg && errmsg.length > 0) {
                import_errors.push({
                    stockInRequest,
                    errmsg,
                    i,
                });
            } else {
                try {
                    // tạo phiếu nhập kho
                    const createRes = await createOrUpdateStocksInRequest({ ...item });
                    if (createRes.isFailed()) {
                        import_errors.push({
                            stockInRequest,
                            errmsg: [createRes.getMessage()],
                            i,
                        });
                    }
                    import_data.push(createRes.getData());

                    const newStockInRequestRes = await detailStocksInRequest(createRes.getData());
                    if (newStockInRequestRes.isFailed()) {
                        import_errors.push({
                            stockInRequest,
                            errmsg: [newStockInRequestRes.getMessage()],
                            i,
                        });
                    }
                    const newStockInRequest = newStockInRequestRes.getData();

                    //nhập kho
                    const stockOutRes = await createStocksDetail({
                        products_list: newStockInRequest.products_list,
                        stocks_id: newStockInRequest.stocks_id,
                        is_reviewed: newStockInRequest.is_reviewed,
                        is_imported: newStockInRequest.is_imported,
                        request_code: newStockInRequest.request_code,
                        // request_id: item.request_id,
                        is_transfer: 0,
                        auth_name: item.auth_name,
                    });
                    if (stockOutRes.isFailed()) {
                        import_errors.push({
                            stockInRequest,
                            errmsg: [stockOutRes.getMessage()],
                            i,
                        });
                    }
                } catch (error) {
                    import_errors.push({
                        stockInRequest,
                        errmsg: [error.message],
                        i,
                    });
                    throw error;
                }
            }
        }

        return new ServiceResponse(true, '', { import_data, import_total });
    } catch (e) {
        logger.error(e, { function: 'godOfImport.importStockInRequest' });
        return new ServiceResponse(false, e);
    }
};

const checkOrderImport_ = async (order, data, pool) => {
    let errmsg = [];
    let {
        created_date,
        order_no,
        order_type,
        order_status,
        receiving_date,
        store_code,
        customer_code,
        customer_name,
        phone_number,
        email,
        invoice_full_name,
        invoice_tax,
        invoice_address,
        invoice_company_name,
        invoice_email,
        products,
        auth_name,
    } = order || {};

    // if (!material_code) errmsg.push('Mã túi bao bì là bắt buộc');
    const order_type_id = getDataValue(data, orderDataKey.orderType, order_type);
    const order_status_id = getDataValue(data, orderDataKey.orderStatus, order_status);
    const store_id = getDataValue(data, orderDataKey.store, store_code);

    if (!order_type_id) throw new Error(`Loại đơn hàng ${order_type} không tồn tại`);
    if (!order_status_id) throw new Error(`Trạng thái đơn hàng ${order_status} không tồn tại`);
    if (!store_id) throw new Error(`Mã cửa hàng ${store_code} không tồn tại`);

    receiving_date = moment(new Date(receiving_date)).isValid()
        ? moment(new Date(receiving_date)).format('DD/MM/YYYY')
        : null;
    const order_date = moment(new Date(created_date)).isValid()
        ? moment(new Date(created_date)).format('DD/MM/YYYY')
        : null;

    products = products.map((product) => {
        let {
            created_date,
            order_no,
            imei_code,
            product_code,
            product_name,
            product_category,
            model,
            stocks_code,
            quantity,
            price,
            discount_value,
            vat,
            unit,
            product_output_type,
        } = product;

        if (!imei_code) throw new Error(`Mã hàng ${product_code} thuộc đơn hàng ${order_no} không có IMEI`);

        const product_id = getDataValue(data, orderDataKey.product, product_code);
        const stock_id = getDataValue(data, orderDataKey.stocks, stocks_code);
        const product_output_type_id = getDataValue(data, orderDataKey.outputType, product_output_type);

        if (!product_id) throw new Error(`Mã hàng ${product_code} không tồn tại`);
        if (!stock_id) throw new Error(`Mã kho ${stocks_code} không tồn tại`);
        if (!product_output_type_id) throw new Error(`Hình thức xuất ${product_output_type} không tồn tại`);

        vat = parseFloat(vat) ?? 0;
        price = parseFloat(price) ?? 0;
        quantity = parseInt(quantity) ?? 0;
        discount_value = parseFloat(discount_value) ?? 0;
        const vat_amount = (vat * price * quantity) / 100;

        return {
            created_date,
            order_no,
            imei_code,
            product_code,
            product_id,
            product_name,
            product_category,
            model,
            stocks_code,
            stock_id,
            quantity,
            price,
            total_price: price,
            discount_value,
            is_discount_percent: 0,
            total_discount: discount_value,
            vat,
            vat_amount,
            product_unit_id: getDataValue(data, orderDataKey.unit, unit),
            product_output_type_id,
            auth_name,
        };
    });

    const resData = await pool
        .request()
        .input('ISACTIVE', 1)
        .input('EMAIL', email)
        .input('PHONENUMBER', phone_number)
        .input('FULLNAME', customer_name)
        .input('CREATEDUSER', auth_name)
        .execute('CRM_CUSTOMERDATALEADS_CREATEORUPDATE_WEBAPP');

    const { DATALEADSID: dataleads_id, MEMBERID: member_id } = resData.recordset[0];

    const total_money = products.reduce((acc, curr) => acc + curr.total_price, 0);
    const total_vat = products.reduce((acc, curr) => acc + curr.vat_amount, 0);
    const total_discount = products.reduce((acc, curr) => acc + curr.total_discount, 0);
    const discount_value = total_discount;
    const discount_coupon = 0;
    const expoint_value = 0;

    let item = {
        created_date,
        order_date,
        order_no,
        order_type,
        order_type_id,
        order_status,
        order_status_id,
        receiving_date,
        store_code,
        store_id,
        customer_code,
        customer_name,
        phone_number,
        email,
        dataleads_id,
        member_id,
        is_invoice: 1,
        invoice_full_name,
        invoice_tax,
        invoice_address,
        invoice_company_name,
        invoice_email,
        products,
        total_money,
        total_vat,
        total_discount,
        discount_value,
        discount_coupon,
        expoint_value,
    };

    return { errmsg, item };
};

const importOrder = async (body, file, auth) => {
    try {
        // const auth_name = apiHelper.getValueFromObject(auth, 'user_name');
        const orders = await readXlsxFile(file.buffer);
        const orderDetails = await readXlsxFile(file.buffer, { sheet: 2 });

        const orderColumns = {
            created_date: 'Ngày tạo',
            order_no: 'Mã đơn hàng',
            order_type: 'Loại đơn hàng',
            order_status: 'Trạng thái đơn hàng',
            receiving_date: 'Ngày nhận hàng',
            store_code: 'Cửa Hàng',
            customer_code: 'Mã Khách Hàng',
            customer_name: 'Tên Khách Hàng',
            phone_number: 'Số Điện Thoại',
            email: 'Email',
            invoice_full_name: 'Tên trên hoá đơn',
            invoice_tax: 'MST',
            invoice_address: 'Địa chỉ xuất hóa đơn',
            invoice_company_name: 'Tên đơn vị',
            invoice_email: 'Email nhận hoá đơn',
            auth_name: 'User tạo phiếu',
        };

        const orderDetailColumns = {
            created_date: 'Ngày tạo',
            order_no: 'Mã đơn hàng',
            imei_code: 'IMEI',
            product_code: 'Mã hàng',
            product_name: 'Tên hàng',
            product_category: 'Ngành hàng',
            model: 'Model',
            stocks_code: 'Kho',
            quantity: 'Số lượng',
            price: 'Đơn giá (VNĐ)',
            vat: 'VAT',
            discount_value: 'Chiết khấu',
            unit: 'Đơn vị tính',
            product_output_type: 'Hình thức xuất',
        };

        let orderList = excelHelper.getValueExcel(orders, orderColumns, false);
        let orderDetailList = excelHelper.getValueExcel(orderDetails, orderDetailColumns, false);

        // Loại bỏ dòng title
        if (orderList.length > 0) orderList.shift();
        if (orderDetailList.length > 0) orderDetailList.shift();

        for (let i = 0; i < orderList.length; i++) {
            const products = orderDetailList.filter((item) => item.order_no === orderList[i].order_no);
            orderList[i].products = products;
        }

        let pool = await mssql.pool;
        let import_data = [];
        let import_errors = [];
        let import_total = 0;

        const resData = await pool.request().execute('SL_ORDER_GetImportExcelData_AdminWeb');

        const data = clearData(resData.recordsets);

        for (let i = 0; i < orderList.length; i++) {
            import_total += 1;
            let order = orderList[i];
            let { errmsg, item } = await checkOrderImport_(order, data, pool);

            if (errmsg && errmsg.length > 0) {
                import_errors.push({
                    order,
                    errmsg,
                    i,
                });
            } else {
                try {
                    // tạo đơn hàng
                    const createRes = await createOrUpdateOrder({ ...item });
                    if (createRes.isFailed()) {
                        import_errors.push({
                            order,
                            errmsg: [createRes.getMessage()],
                            i,
                        });
                    }
                    import_data.push(createRes.getData());
                } catch (error) {
                    import_errors.push({
                        order,
                        errmsg: [error.message],
                        i,
                    });
                    throw error;
                }
            }
        }

        return new ServiceResponse(true, '', { import_data, import_total });
    } catch (e) {
        logger.error(e, { function: 'godOfImport.importOrder' });
        return new ServiceResponse(false, e);
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
            .input('EXPLAIN', apiHelper.getValueFromObject(accountingData, 'description'))
            .input('MONEY', apiHelper.getValueFromObject(accountingData, 'money'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(accountingData, 'auth_name'))
            .execute('AC_ACCOUNTING_CreateOrUpdate_AdminWeb');

        const childId = resultChild.recordset[0].RESULT;

        return childId > 0;
    } catch (error) {
        throw error;
    }
};

const checkReceiveSlipImport_ = async (receiveSlip, data, transaction) => {
    let errmsg = [];
    let {
        created_date,
        receive_sip_code,
        order_no,
        store_code,
        customer_code,
        customer_name,
        phone_number,
        receive_type,
        auth_name,
        payment_form,
        description,
        amount,
    } = receiveSlip || {};

    created_date = moment(new Date(created_date)).isValid()
        ? moment(new Date(created_date)).format('DD/MM/YYYY')
        : null;

    amount = parseFloat(amount) ?? 0;
    const store_id = getDataValue(data, receiveSlipDataKey.store, store_code);
    const receive_type_id = getDataValue(data, receiveSlipDataKey.receiveType, receive_type);
    payment_form = clearInput(payment_form);
    payment_form = data[receiveSlipDataKey.paymentForm].find((item) => item.label === payment_form);

    if (!store_id) throw new Error(`Cửa hàng ${store_code} không tồn tại`);
    if (!receive_type_id) throw new Error(`Loại thu ${receive_type} không tồn tại`);
    if (!payment_form) throw new Error(`Hình thức thanh toán ${payment_form} không tồn tại`);

    const { value: payment_form_id, type: payment_type } = payment_form;

    const reqDataOrderByOrderNo = new sql.Request(transaction);
    const dataOrder = await reqDataOrderByOrderNo
        .input('ORDERNO', order_no)
        .execute('SL_ORDER_GetByOrderNoPayment_App');

    const order_id = dataOrder?.recordset[0]?.ORDERID;

    if (!order_id) throw new Error(`Đơn hàng ${order_no} không tồn tại`);

    let business_id = dataOrder?.recordset[0]?.BUSINESSID;
    let member_id = dataOrder?.recordset[0]?.MEMBERID;
    let company_id = dataOrder?.recordset[0]?.COMPANYID;

    let item = {
        created_date,
        receive_sip_code,
        order_no,
        store_code,
        customer_code,
        customer_name,
        phone_number,
        receive_type,
        auth_name,
        description,
        amount,
        store_id,
        receive_type_id,
        payment_form_id,
        payment_type,
        order_id,
        business_id,
        member_id,
        company_id,
    };

    return { errmsg, item };
};

const importReceiveSlip = async (body, file, auth) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    await transaction.begin();
    try {
        // const auth_name = apiHelper.getValueFromObject(auth, 'user_name');
        const receiveSlips = await readXlsxFile(file.buffer);

        const receiveSlipColumns = {
            created_date: 'Ngày chứng từ',
            receive_sip_code: 'Mã phiếu thu',
            order_no: 'Mã đơn hàng',
            store_code: 'Mã cửa hàng',
            customer_code: 'Mã khách hàng',
            customer_name: 'Tên Khách Hàng',
            phone_number: 'Số điện thoại',
            receive_type: 'Loại thu',
            auth_name: 'Mã NV',
            payment_form: 'Hình thức thanh toán',
            description: 'Nội dung thu',
            amount: 'Tổng tiền',
        };

        let receiveSlipList = excelHelper.getValueExcel(receiveSlips, receiveSlipColumns, false);

        // Loại bỏ dòng title
        if (receiveSlipList.length > 0) receiveSlipList.shift();

        let import_data = [];
        let import_errors = [];
        let import_total = 0;

        const reqGetImportExcelData = new sql.Request(transaction);
        const resData = await reqGetImportExcelData.execute('SL_RECEIVESLIP_GetImportExcelData_AdminWeb');

        const data = clearData(resData.recordsets);

        for (let i = 0; i < receiveSlipList.length; i++) {
            import_total += 1;
            let receiveSlip = receiveSlipList[i];
            let { errmsg, item } = await checkReceiveSlipImport_(receiveSlip, data, transaction);

            if (errmsg && errmsg.length > 0) {
                import_errors.push({
                    receiveSlip,
                    errmsg,
                    i,
                });
            } else {
                try {
                    //Tạo phiếu thu tiền và thanh toán luôn
                    const reqCreateReceive = new sql.Request(transaction);
                    const data = await reqCreateReceive
                        .input('COMPANYID', item.company_id)
                        .input('BUSINESSID', item.business_id)
                        .input('STOREID', item.store_id)
                        .input('RECEIVETYPEID', item.receive_type_id)
                        // .input('BANKACCOUNTID', item.bank_account_id)
                        .input('CASHIERID', item.auth_name)
                        .input('MEMBERID', item.member_id)
                        .input('PAYMENTFORMID', item.payment_form_id)
                        .input('DESCRIPTIONS', item.description)
                        .input('TOTALMONEY', item.amount)
                        .input('NOTES', item.description)
                        .input('CREATEDUSER', item.auth_name)
                        .input('ISACTIVE', 1)
                        .input('ISREVIEW', 1)
                        .input('PAYMENTSTATUS', 1) // trạng thái đã thanh toán
                        .input('PAYMENTTYPE', item.payment_type)
                        .input('ORDERID', item.order_id) //Đơn hàng
                        .input('CREATEDDATE', item.created_date)
                        .execute('SL_RECEIVESLIP_CreateOrUpdateForOrder_App');
                    const receiveslipId = data.recordset[0].RESULT;

                    if (receiveslipId <= 0) {
                        throw new Error(`Lỗi tạo phiếu thu ${item.receive_sip_code} !`);
                    }

                    // Tạo hạch toán
                    const accountingData = {
                        auth_name: item.auth_name,
                        receiveslip_id: receiveslipId,
                        money: item.amount,
                        descriptions: item.description,
                        order_id: item.order_id,
                        payment_form_id: item.payment_form_id,
                    };
                    const result = await _createAccounting(accountingData, transaction);
                    if (!result) {
                        throw new Error(`Lỗi tạo hoạch toán ${item.receive_sip_code} !`);
                    }

                    const requestCreateReceiveslipOrder = new sql.Request(transaction);
                    const dataCreateReceiveslipOrder = await requestCreateReceiveslipOrder
                        .input('RECEIVESLIPID', receiveslipId)
                        .input('ORDERID', item.order_id)
                        .input('TOTALMONEY', item.amount)
                        .input('CREATEDUSER', item.auth_name)
                        .execute('SL_RECEIVESLIP_ORDER_CreateOrUpdate_App');

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
                        PAYMENTSTATUS,
                    } = targetResult;

                    if (!isValid) {
                        throw new Error(`Đơn hàng ${orderNo} đã thu đủ tiền.`);
                    }
                    if (receiveslipOrder <= 0) {
                        throw new Error(`Lỗi tạo phiếu thu ${item.receive_sip_code} !!`);
                    }

                    import_data.push(receiveslipId);
                } catch (error) {
                    import_errors.push({
                        receiveSlip,
                        errmsg: [error.message],
                        i,
                    });
                    throw error;
                }
            }
        }

        // await transaction.rollback();
        await transaction.commit();

        return new ServiceResponse(true, '', { import_data, import_total });
    } catch (e) {
        logger.error(e, { function: 'godOfImport.importReceiveSlip' });
        await transaction.rollback();
        return new ServiceResponse(false, e);
    }
};

module.exports = {
    importStockInRequest,
    importOrder,
    importReceiveSlip,
};
