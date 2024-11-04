const lodash = require('lodash');
const sql = require('mssql');
const mssql = require('../../models/mssql');
const apiHelper = require('../../common/helpers/api.helper');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const moduleClass = require('./purchase-invoice.class');
const purchaseOrderService = require('../purchase-orders/purchase-orders.service');
const moment = require('moment');
const { PAYMENT_DUE_STATUS } = require('./constant');

const getList = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('PURCHASEORDERID', apiHelper.getValueFromObject(queryParams, 'purchase_order_id'))
            .execute('SL_INVOICE_GetList_AdminWeb');

        const dataList = moduleClass.list(data.recordset) || [];

        dataList.forEach((invoice) => {
            invoice.purchase_order_list = invoice.purchase_order_list ? JSON.parse(invoice.purchase_order_list) : [];
            invoice.invoice_payments = invoice.invoice_payments ? JSON.parse(invoice.invoice_payments) : [];
            // handle due date

            let due_status = PAYMENT_DUE_STATUS.NONE;

            // calculate pay debit status
            if (invoice.payment_expire_date) {
                if (invoice.paid_time) {
                    if (
                        moment(invoice.paid_time, 'DD/MM/YYYY').diff(
                            moment(invoice.payment_expire_date, 'DD/MM/YYYY'),
                        ) <= 0
                    ) {
                        due_status = PAYMENT_DUE_STATUS.DONE;
                    } else {
                        due_status = PAYMENT_DUE_STATUS.DONE_BUT_EXPIRED;
                    }
                } else {
                    if (moment().startOf('day').diff(moment(invoice.payment_expire_date, 'DD/MM/YYYY')) <= 0) {
                        due_status = PAYMENT_DUE_STATUS.NOT_EXPIRED;
                    } else {
                        due_status = PAYMENT_DUE_STATUS.EXPIRED;
                    }
                }
            }

            invoice.payment_due_status = due_status;
        });

        return new ServiceResponse(true, '', dataList);
    } catch (e) {
        logger.error(e, { function: 'PurchaseInvoice.getList' });
        return new ServiceResponse(true, '', []);
    }
};

const createOrUpdate = async (bodyParams) => {
    let invoiceId = apiHelper.getValueFromObject(bodyParams, 'invoice_id');
    const isAdd = !invoiceId;
    const createdUser = apiHelper.getValueFromObject(bodyParams, 'auth_name');
    const totalMoney = apiHelper.getValueFromObject(bodyParams, 'sum_final_payment_price');

    const productList = apiHelper.getValueFromObject(bodyParams, 'product_list', []);

    const purchaseOrderIds = lodash.uniq(
        productList?.filter((_) => _)?.map((product) => Number(product.purchase_order_id)),
    );

    const pool = await mssql.pool;
    const transaction = new sql.Transaction(pool);

    try {
        await transaction.begin();
        const request = new sql.Request(transaction);
        const resCreateOrUpdateBudget = await request
            .input('INVOICEID', invoiceId)
            .input('INVOICENO', apiHelper.getValueFromObject(bodyParams, 'invoice_no'))
            .input('INVOICEFORMNO', apiHelper.getValueFromObject(bodyParams, 'invoice_form_no'))
            .input('INVOICESERIAL', apiHelper.getValueFromObject(bodyParams, 'invoice_serial'))
            .input('INVOICETRANSACTION', apiHelper.getValueFromObject(bodyParams, 'invoice_transaction'))
            .input('INVOICEURL', apiHelper.getValueFromObject(bodyParams, 'invoice_url'))
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('INVOICENOTE', apiHelper.getValueFromObject(bodyParams, 'invoice_note'))
            .input('INVOICEDATE', apiHelper.getValueFromObject(bodyParams, 'invoice_date') || null)
            .input('PAYMENTEXPIREDATE', apiHelper.getValueFromObject(bodyParams, 'payment_expire_date') || null)
            .input('PAYMENTSTATUS', apiHelper.getValueFromObject(bodyParams, 'payment_status', 0))
            .input('CREATEDUSER', createdUser)
            .input('SUMINTOMONEY', sql.Decimal(18, 2), apiHelper.getValueFromObject(bodyParams, 'sum_into_money'))
            .input('SUMVATPRICE', sql.Decimal(18, 2), apiHelper.getValueFromObject(bodyParams, 'sum_vat_price'))
            .input('SUMPURCHASECOST', sql.Decimal(18, 2), apiHelper.getValueFromObject(bodyParams, 'sum_purchase_cost'))
            .input('SUMPAYMENTPRICE', sql.Decimal(18, 2), apiHelper.getValueFromObject(bodyParams, 'sum_payment_price'))
            .input('SUMTOTALPRICE', sql.Decimal(18, 2), apiHelper.getValueFromObject(bodyParams, 'sum_total_price'))
            .input(
                'SUMDISCOUNTPRICE',
                sql.Decimal(18, 2),
                apiHelper.getValueFromObject(bodyParams, 'sum_discount_price'),
            )
            .input(
                'SUMTOTALAFTERDISCOUNT',
                sql.Decimal(18, 2),
                apiHelper.getValueFromObject(bodyParams, 'sum_total_after_discount'),
            )
            .input('SUMFINALPAYMENTPRICE', sql.Decimal(18, 2), totalMoney)
            .input('PURCHASEORDERID', purchaseOrderIds[0])
            .input('SUPPLIERID', apiHelper.getValueFromObject(bodyParams, 'supplier_id'))
            .input('COMPANYID', apiHelper.getValueFromObject(bodyParams, 'company_id'))
            .input('ISINVOICEPURCHASE', apiHelper.getValueFromObject(bodyParams, 'is_invoice_purchase'))
            .execute('SL_INVOICE_CreateOrUpdate_AdminWeb');
        invoiceId = resCreateOrUpdateBudget.recordset[0].RESULT;
        if (!invoiceId) {
            await transaction.rollback();
            return ServiceResponse(false, 'failed');
        }

        //tạo hạch toán của đơn mua
        await _createInvoiceProducts(invoiceId, createdUser, productList, transaction);

        // create mapping between purchase and invoice

        if (purchaseOrderIds && purchaseOrderIds.length > 0) {
            await _createPurchaseInvoiceRelationship(invoiceId, createdUser, purchaseOrderIds, transaction);
        }

        // thêm công nợ
        if (isAdd) {
            await _createDebits(totalMoney, invoiceId, createdUser, transaction);
        }

        await transaction.commit();
        return new ServiceResponse(true, '', invoiceId);
    } catch (e) {
        await transaction.rollback();
        logger.error(e, { function: 'PurchaseInvoiceService.CreateOrUpdate' });
        return new ServiceResponse(false, e.message);
    }
};

const _createDebits = async (totalMoney, invoiceId, authUser, transaction) => {
    const createDebit = new sql.Request(transaction);

    const res = await createDebit
        .input('TOTALMONEY', sql.Decimal(18, 2), totalMoney)
        .input('TOTALAMOUNT', sql.Decimal(18, 2), totalMoney)
        .input('TOTALPAID', 0)
        .input('INVOICEID', invoiceId)
        .input('CREATEDUSER', authUser)
        .execute('SL_DEBIT_CreateOrUpdate_AdminWeb');
    const debitId = res.recordset[0].RESULT;

    if (debitId <= 0) {
        throw new Error('Lỗi tạo công nợ !');
    }
};

const _createInvoiceProducts = async (invoiceId, createdUser, data, transaction) => {
    // delete
    const request = new sql.Request(transaction);
    await request
        .input('INVOICEID', invoiceId)
        .input('DELETEDUSER', createdUser)
        .execute('SL_INVOICEDETAIL_DeleteByInvoiceId_AdminWeb');
    // insert
    for (const product of data) {
        const request = new sql.Request(transaction);
        await request
            .input('INVOICEDETAILID', apiHelper.getValueFromObject(product, 'invoice_detail_id'))
            .input('PURCHASEORDERDETAILID', apiHelper.getValueFromObject(product, 'purchase_order_detail_id'))
            .input('INVOICEID', invoiceId)
            .input('PRODUCTID', apiHelper.getValueFromObject(product, 'product_id'))
            .input('DEBTACCID', apiHelper.getValueFromObject(product, 'debt_account_id'))
            .input('STOCKSACCID', apiHelper.getValueFromObject(product, 'stocks_account_id'))
            .input('TAXACCID', apiHelper.getValueFromObject(product, 'tax_account_id'))
            .input('PRODUCTPRICE', apiHelper.getValueFromObject(product, 'product_price'))
            .input('VATVALUE', apiHelper.getValueFromObject(product, 'vat_value'))
            .input('QUANTITY', apiHelper.getValueFromObject(product, 'product_quantity'))
            .input('INTOMONEY', apiHelper.getValueFromObject(product, 'into_money'))
            .input('DISCOUNTPERCENT', apiHelper.getValueFromObject(product, 'discount_percent'))
            .input('PURCHASECOST', apiHelper.getValueFromObject(product, 'purchase_cost'))
            .input('VATPRICE', apiHelper.getValueFromObject(product, 'vat_price'))
            .input('PAYMENTPRICE', apiHelper.getValueFromObject(product, 'payment_price'))
            .input('DISCOUNTPRICE', apiHelper.getValueFromObject(product, 'discount_price'))
            .input('TOTALAFTERDISCOUNT', apiHelper.getValueFromObject(product, 'total_after_discount'))
            .input('FINALPAYMENTPRICE', apiHelper.getValueFromObject(product, 'final_payment_price'))
            .input('STOCKSINREQUESTLIST', JSON.stringify(product?.stocks_in_request_list || []))
            .input('CREATEDUSER', createdUser)
            .execute('SL_INVOICEDETAIL_CreateOrUpdate_AdminWeb');
    }

    // delete accounting list
    const reqDelAccounting = new sql.Request(transaction);
    await reqDelAccounting
        .input('INVOICEID', invoiceId)
        .input('DELETEDUSER', createdUser)
        .execute('SL_INVOICE_DeleteAccountingByInvoiceId_AdminWeb');

    // insert or update accounting list
    const listDebtCredit = [],
        listCreditTax = [];
    for (const item of data) {
        listDebtCredit.push({
            debt_account: item.stocks_account_id,
            credit_account: item.debt_account_id,
            money: item.into_money,
        });
        listCreditTax.push({
            debt_account: item.tax_account_id,
            credit_account: item.debt_account_id,
            money: item.vat_price,
        });
    }
    // Tạo TK Nợ + Có
    // await createOrUpdateAccountingList(listDebtCredit, invoiceId, createdUser, transaction); 

    // Tạo TK Có + Thuế
    await createOrUpdateAccountingList(listCreditTax, invoiceId, createdUser, transaction);
};

const createOrUpdateAccountingList = async (accountingList, invoice_id, authName, transaction) => {
    const accountingIds = accountingList
        .filter((accounting) => accounting.accounting_id)
        ?.map((accounting) => accounting.accounting_id);

    try {
        // delete unnessary accounting
        if (accountingIds.length > 0) {
            const deleteRequest = new sql.Request(transaction);
            const deleteResult = await deleteRequest
                .input('LISTID', accountingIds)
                .input('INVOICEID', invoice_id)
                .input('DELETEDUSER', authName)
                .execute('SL_INVOICE_DeleteAllExceptAccounting_AdminWeb');
            if (!deleteResult.recordset[0]?.RESULT) {
                await transaction.rollback();
                return new ServiceResponse(false, `Xóa hạch toán thất bại !`);
            }
        }

        // insert or update accounting list
        for (let accounting of accountingList) {
            const accountingRequest = new sql.Request(transaction);
            const resultChild = await accountingRequest
                .input('ACCOUNTINGID', apiHelper.getValueFromObject(accounting, 'accounting_id'))
                .input('DEBTACCOUNT', apiHelper.getValueFromObject(accounting, 'debt_account'))
                .input('CREDITACCOUNT', apiHelper.getValueFromObject(accounting, 'credit_account'))
                .input('EXPLAIN', apiHelper.getValueFromObject(accounting, 'explain'))
                .input('INVOICEID', invoice_id)
                .input('MONEY', apiHelper.getValueFromObject(accounting, 'money'))
                .input('CURRENCYTYPE', 1) // VND
                .input('CREATEDUSER', authName)
                .execute('AC_ACCOUNTING_CreateOrUpdate_AdminWeb');

            const childId = resultChild.recordset[0].RESULT;
            if (childId <= 0) {
                await transaction.rollback();
                return new ServiceResponse(false, `Thêm mới hoặc chỉnh sửa hạch toán thất bại !`);
            }
        }
    } catch (error) {
        logger.error(error, { function: 'purchaseCostService.createOrUpdateAccountingList' });
        await transaction.rollback();
        return new ServiceResponse(false, 'Thao tác hạch toán thất bại !');
    }
};

const _createPurchaseInvoiceRelationship = async (invoiceId, createdUser, purchaseIds, transaction) => {
    // delete
    const request = new sql.Request(transaction);
    await request
        .input('INVOICEID', invoiceId)
        .input('DELETEDUSER', createdUser)
        .execute('SL_PURCHASEORDER_INVOICE_DeleteByInvoiceId_AdminWeb');
    // insert
    for (const purchaseId of purchaseIds) {
        const request = new sql.Request(transaction);
        await request
            .input('INVOICEID', invoiceId)
            .input('PURCHASEORDERID', purchaseId)
            .input('CREATEDUSER', createdUser)
            .execute('SL_PURCHASEORDER_INVOICEDETAIL_CreateOrUpdate_AdminWeb');
    }
};

const getDetail = async (id, queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const responseData = await pool
            .request()
            .input('INVOICEID', id)
            .input('ISINVOICEPURCHASE', apiHelper.getValueFromObject(queryParams, 'is_invoice_purchase'))
            .execute('SL_INVOICE_GetById_AdminWeb');

        let invoiceDetail = responseData.recordset[0] || {};
        let products = responseData.recordsets[1];
        let payments = responseData.recordsets[2];
        const paymentList = moduleClass.paymentList(payments);

        const invoiceData = moduleClass.detail(invoiceDetail);
        invoiceData.product_list = moduleClass.productList(products);
        // parse json
        invoiceData.product_list?.forEach((product) => {
            product.stocks_in_request_list = product.stocks_in_request_list
                ? JSON.parse(product.stocks_in_request_list)
                : [];
            product.created_date = product.created_date ? product.created_date[1] : null;
            product.invoice_no = invoiceData.invoice_no;
        });

        invoiceData.sum_product_quantity =
            invoiceData.product_list?.reduce((total, product) => total + product.product_quantity, 0) || 0;

        invoiceData.payment_list = _splitInvoiceByPurchase(invoiceData.product_list, paymentList);
        invoiceData.payment_slip_list = paymentList;

        const purchaseOrderId = lodash.uniq(invoiceData.product_list?.map((product) => product.purchase_order_id))[0];
        const purchaseOrderRes = await purchaseOrderService.detailPurchaseOrder(purchaseOrderId);
        if (purchaseOrderRes.isSuccess()) {
            const purchaseOrder = purchaseOrderRes.getData();

            invoiceData.product_list = invoiceData.product_list?.map((product) => {
                const stocksInProduct = purchaseOrder?.stocks_in_request_list?.filter((_) =>
                    _?.product_list?.find((_product) => _product.product_id == product?.product_id),
                );

                product.payment_price = product.payment_price - (product.purchase_cost || 0);

                const purchaseCostTotal = stocksInProduct?.reduce((acc, stocksIn) => {
                    return (
                        acc +
                            stocksIn?.product_list?.find((_) => _.product_id == product?.product_id)
                                ?.total_cost_price || 0
                    );
                }, 0);

                return {
                    ...product,
                    stocks_in_request_list: stocksInProduct,
                    purchase_cost: Math.round((purchaseCostTotal / product.total_quantity) * product.product_quantity),
                    purchase_cost_total: purchaseCostTotal,
                    payment_price:
                        product.payment_price +
                        Math.round((purchaseCostTotal / product.total_quantity) * product.product_quantity),
                };
            });
        }

        // calculate sum data
        invoiceData.sum_payment_price -= invoiceData.sum_purchase_cost || 0;

        const purchaseCost = invoiceData.product_list.reduce((total, product) => {
            return total + product.purchase_cost;
        }, 0);

        invoiceData.sum_purchase_cost = purchaseCost;
        invoiceData.sum_payment_price += invoiceData.sum_purchase_cost;

        // stocksInRequestList = stocksInRequestList
        //     ?.flat()
        //     ?.map((item) => {
        //         const productList = item.product_list.map((product) => ({
        //             ...product,
        //             stocks_in_code: item?.stocks_in_code,
        //             stocks_in_request_id: item?.stocks_in_request_id,
        //         }));
        //         return productList;
        //     })
        //     ?.flat();

        // const productsInStocks = stocksInRequestList?.reduce((acc, product) => {
        //     const existedProduct = acc?.find(
        //         (_) => _.product_id === product.product_id && _.purchase_order_id === product.purchase_order_id,
        //     );
        //     if (existedProduct) {
        //         existedProduct.total_cost_price += product.total_cost_price;
        //         existedProduct.product_imei_codes = existedProduct.product_imei_codes.concat(
        //             product.product_imei_codes,
        //         );
        //         existedProduct.stocsk_in_list = existedProduct.stocsk_in_list.concat([
        //             {
        //                 stocks_in_detail_id: product.stocks_in_detail_id,
        //                 stocks_in_code: product.stocks_in_code,
        //                 stocks_in_request_id: product.stocks_in_request_id,
        //             },
        //         ]);
        //     } else {
        //         acc.push({
        //             purchase_order_id: product.purchase_order_id,
        //             product_id: product.product_id,
        //             total_cost_price: product.total_cost_price || 0,
        //             product_imei_codes: product.product_imei_codes,
        //             stocsk_in_list: [
        //                 {
        //                     stocks_in_detail_id: product.stocks_in_detail_id,
        //                     stocks_in_code: product.stocks_in_code,
        //                     stocks_in_request_id: product.stocks_in_request_id,
        //                 },
        //             ],
        //         });
        //     }
        //     return acc;
        // }, []);

        return new ServiceResponse(true, '', invoiceData);
    } catch (e) {
        logger.error(e, { function: 'PurchaseInvoiceService.getDetail' });
        return new ServiceResponse(false, e.message);
    }
};

const _splitInvoiceByPurchase = (productList, paymentList) => {
    const invoicePaymentList = productList?.reduce((acc, product) => {
        const existedPayment = acc?.find((_) => _.purchase_order_id == product.purchase_order_id);
        if (existedPayment) {
            existedPayment.total_payment_price =
                existedPayment.total_payment_price + (product?.final_payment_price || 0);
            existedPayment.product_list = existedPayment.product_list.concat([
                {
                    product_id: product.product_id,
                    invoice_detail_id: product.invoice_detail_id,
                    final_payment_price: product.final_payment_price,
                    product_name: product.product_name,
                    product_quantity: product.product_quantity,
                },
            ]);
        } else {
            acc.push({
                created_date: product?.created_date,
                invoice_no: product?.invoice_no,
                purchase_order_code: product?.purchase_order_code,
                total_payment_price: product?.final_payment_price,
                purchase_order_id: product?.purchase_order_id,
                product_list: [
                    {
                        product_id: product.product_id,
                        invoice_detail_id: product.invoice_detail_id,
                        final_payment_price: product.final_payment_price,
                        product_name: product.product_name,
                        product_quantity: product.product_quantity,
                    },
                ],
            });
        }
        return acc;
    }, []);

    // mapping payment slip list
    invoicePaymentList.forEach((payment) => {
        payment.paid_price =
            paymentList
                ?.filter(
                    (_) => _.purchase_order_id == payment.purchase_order_id && _.is_review === 1 && _.is_bookkeeping,
                )
                ?.reduce((acc, _) => acc + _?.payment_value, 0) || 0;

        payment.remaining_price = payment?.total_payment_price - payment.paid_price;
    });

    return invoicePaymentList;
};

const cancelInvoie = async (id) => {
    try {
        const pool = await mssql.pool;
        await pool.request().input('INVOICEID', id).execute('SL_INVOICE_CancelById_AdminWeb');

        return new ServiceResponse(true, 'success', id);
    } catch (e) {
        logger.error(e, { function: 'PurchaseInvoiceService.getDetail' });
        return new ServiceResponse(false, e.message);
    }
};

module.exports = {
    getList,
    createOrUpdate,
    getDetail,
    cancelInvoie,
};
