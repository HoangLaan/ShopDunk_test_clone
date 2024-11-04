const returnPurchaseClass = require('./return-purchase.class');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const { detailPurchaseOrder } = require('../purchase-orders/purchase-orders.service');
const orderService = require('../order/order.service');

const getPurchaseOrdersOptions = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().execute('SL_PURCHASEORDER_GetPurchaseOrderOptions_AdminWeb');
        return new ServiceResponse(true, '', data.recordset);
    } catch (e) {
        logger.error(e, { function: 'returnPurchaseService.getPurchaseOrdersOptions' });
        return new ServiceResponse(true, '', []);
    }
};

const getProductsOfPurchaseOrders = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'keyword'))
            .input('PURCHASEORDERID', apiHelper.getValueFromObject(queryParams, 'purchase_order_id'))
            .input('STOCKSID', apiHelper.getValueFromObject(queryParams, 'stocks_id'))
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'created_date_from'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'created_date_to'))
            .execute('SL_PURCHASEORDER_GetProductOfPurchaseOrder_AdminWeb');

        const dataRecord = data.recordset;
        return new ServiceResponse(true, '', {
            data: returnPurchaseClass.productsOfPO(dataRecord),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(dataRecord),
        });
    } catch (e) {
        logger.error(e, { function: 'returnPurchaseService.getProductsOfPurchaseOrders' });
        return new ServiceResponse(true, '', []);
    }
};

const getStocksOptions = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PURCHASEORDERID', apiHelper.getValueFromObject(queryParams, 'purchase_order_id'))
            .execute('SL_PURCHASEORDER_GetStocksOptions_AdminWeb');
        return new ServiceResponse(true, '', data.recordset);
    } catch (e) {
        logger.error(e, { function: 'returnPurchaseService.getStocksOptions' });
        return new ServiceResponse(true, '', []);
    }
};

const getPurchaseOrdersDetail = async (queryParams = {}) => {
    try {
        const purchase_order_id = apiHelper.getValueFromObject(queryParams, 'purchase_order_id');
        const dataRes = await detailPurchaseOrder(purchase_order_id);
        if (dataRes.isFailed()) return new ServiceResponse(false, '', {});
        return new ServiceResponse(true, '', dataRes.getData());
    } catch (e) {
        logger.error(e, { function: 'returnPurchaseService.getPurchaseOrdersDetail' });
        return new ServiceResponse(true, '', []);
    }
};

const createInvoice = async (bodyParams = {}) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        const auth_name = apiHelper.getValueFromObject(bodyParams, 'auth_name');
        await transaction.begin();
        const resOrder = await orderService.createOrderNo();

        const reqOrder = new sql.Request(transaction);
        const dataOrder = await reqOrder
            .input('ORDERNO', resOrder.getData())
            .input('CREATEDUSER', auth_name)
            .execute('SL_ORDER_CreateOrUpdate_AdminWeb');
        const orderId = dataOrder.recordset[0].RESULT;
        if (orderId <= 0) {
            throw new Error('Tạo order thất bại');
        }

        const reqOrderInvoice = new sql.Request(transaction);
        const dataInvoice = await reqOrderInvoice
            .input('ORDERID', orderId)
            .input('ORDERINVOICENO', apiHelper.getValueFromObject(bodyParams, 'order_invoice_no'))
            .input('ORDERINVOICETRANSACTION', apiHelper.getValueFromObject(bodyParams, 'order_invoice_transaction'))
            .input('ORDERINVOICEURL', apiHelper.getValueFromObject(bodyParams, 'order_invoice_url'))
            .input('ORDERINVOICENOTE', apiHelper.getValueFromObject(bodyParams, 'order_invoice_note'))
            .input('ORDERINVOICEDATE', apiHelper.getValueFromObject(bodyParams, 'order_invoice_date'))
            .input('CREATEDUSER', auth_name)
            .input('PURCHASEORDERID', apiHelper.getValueFromObject(bodyParams, 'purchase_order_id'))
            .execute('SL_ORDERINVOICE_CreateOrUpdate_AdminWeb');
        const orderInvoiceId = dataInvoice.recordset[0].RESULT;
        if (orderInvoiceId <= 0) {
            throw new Error('Tạo order invoice thất bại');
        }

        const products = Object.values(bodyParams.products ?? {});
        // Tạo sản phẩm invoice
        const reqProduct = new sql.Request(transaction);
        for (const item of products) {
            for (const itemImei of item.list_imei ?? []) {
                await reqProduct
                    .input('ORDERINVOICEID', orderInvoiceId)
                    .input('PRODUCTID', item.product_id)
                    .input('QUANTITY', 1) // Vì đã tách theo imei
                    .input('COSTPRICE', item.cost_price)
                    .input('VATVALUE', item.vat_value)
                    .input('IMEI', itemImei.imei)
                    .input('CREATEDUSER', auth_name)
                    .execute('SL_ORDERINVOICE_PRODUCT_CreateOrUpdate_AdminWeb');
            }
        }

        await transaction.commit();
        return new ServiceResponse(true, 'Tạo hóa đơn thành công');
    } catch (e) {
        await transaction.rollback();
        logger.error(e, { function: 'returnPurchaseService.createInvoice' });
        return new ServiceResponse(false, e.message, []);
    }
};

const getOrderInvoice = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PURCHASEORDERID', apiHelper.getValueFromObject(queryParams, 'purchase_order_id'))
            .execute('SL_ORDERINVOICE_GetByPurchaseOrderId_AdminWeb');
        const [orderInvoiceRecord, productRecord] = data.recordsets;
        const orderInvoice = returnPurchaseClass.orderInvoice(orderInvoiceRecord);
        const productsArr = returnPurchaseClass.products(productRecord);
        const products = {};
        for (const item of productsArr) {
            products[item.product_id] = item;
        }
        return new ServiceResponse(true, '', {
            ...(orderInvoice?.[0] ?? {}),
            products,
        });
    } catch (e) {
        logger.error(e, { function: 'returnPurchaseService.getOrderInvoice' });
        return new ServiceResponse(true, '', []);
    }
};

module.exports = {
    getPurchaseOrdersOptions,
    getProductsOfPurchaseOrders,
    getStocksOptions,
    getPurchaseOrdersDetail,
    createInvoice,
    getOrderInvoice,
};
