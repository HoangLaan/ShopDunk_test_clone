const purchaseCostClass = require('./purchase-cost.class');
const stocksInRequestClass = require('../stocks-in-request/stocks-in-request.class');
const apiHelper = require('../../common/helpers/api.helper');
const purchaseCostHelper = require('./helpers');
const purchaseCostContain = require('./contain');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const sql = require('mssql');

const getPurchaseCostId = async () => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().execute('SL_purchaseCost_GenpurchaseCostNo_AdminWeb');
        let dataRecord = data.recordset[0].purchaseCostNO;

        return new ServiceResponse(true, '', dataRecord);
    } catch (e) {
        logger.error(e, { function: 'purchaseCosts.getPurchaseCostId' });
        return [];
    }
};

const getListPurchaseCost = async (queryParams) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getSearch(queryParams);

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('KEYWORD', keyword)
            .input('ISPAYMENTSSTATUSID', apiHelper.getValueFromObject(queryParams, 'is_payments_status_id'))
            .input('SUPPLIERSEARCH', apiHelper.getValueFromObject(queryParams, 'supplier_search'))
            .input('ACCOUNTINGDATEFROM', apiHelper.getValueFromObject(queryParams, 'accounting_date_from'))
            .input('ACCOUNTINGDATETO', apiHelper.getValueFromObject(queryParams, 'accounting_date_to'))
            .input('PAYMENTFORMID', apiHelper.getValueFromObject(queryParams, 'payment_form_id'))
            .execute('SL_PURCHASECOST_GetList_AdminWeb');

        const result = data.recordset;

        return new ServiceResponse(true, '', {
            data: purchaseCostClass.list(result),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(result),
        });
    } catch (e) {
        logger.error(e, { function: 'purchaseCostService.getListPurchaseCost' });
        return new ServiceResponse(true, '', {});
    }
};

const detailPurchaseCost = async (purchase_cost_id) => {
    try {
        const parseIn = parseInt(purchase_cost_id) ?? 0;
        const pool = await mssql.pool;
        const data = await pool.request().input('PURCHASECOSTSID', parseIn).execute('SL_PURCHASECOST_GetById_AdminWeb');
        let purchaseCost = data.recordset;

        if (purchaseCost && purchaseCost.length > 0) {
            purchaseCost = purchaseCostClass.detail(purchaseCost[0]);
            if (purchaseCost?.purchase_order_order_id) {
                purchaseCost.purchase_order_order_id = purchaseCostHelper.stringToArray(
                    purchaseCost?.purchase_order_order_id,
                );
            } else {
                purchaseCost.purchase_order_order_id = [];
            }
            let purchaseCostAccounting = purchaseCostClass.detailAccounting(data.recordsets[1]);

            let detailList = stocksInRequestClass.listProductDetail(data.recordsets[2]);
            const costApplyList = stocksInRequestClass.listCostApply(data.recordsets[3]);

            let productList = [];
            for (let i = 0; i < detailList.length; i++) {
                const {
                    product_id,
                    purchase_order_id,
                    stocks_in_request_id,
                    stocks_in_detail_id,
                    order_index,
                    unit_id,
                    quantity,
                    total_price,
                } = detailList[i];

                detailList[i].cost_apply_list = (costApplyList || []).filter(
                    (v) => v.stocks_in_request_detail_id == stocks_in_detail_id,
                );
                // Gom san pham lai
                const idx = (productList || []).findIndex(
                    (x) =>
                        x.purchase_order_id == purchase_order_id &&
                        x.stocks_in_request_id == stocks_in_request_id &&
                        x.product_id == product_id &&
                        unit_id == x.unit_id &&
                        x.order_index == order_index,
                );
                if (idx >= 0) {
                    productList[idx].quantity += quantity;
                    productList[idx].total_price += total_price;
                } else {
                    productList.push({
                        ...detailList[i],
                        quantity: quantity,
                        order_index,
                        total_price,
                    });
                }
            }

            const containPro = purchaseCostContain.defendFieldMathProduct;
            const containAcc = purchaseCostContain.defendFieldMathAccount;
            const containStrPro = purchaseCostContain.DEFMATHTOTALPRODUCT;
            const containStrAcc = purchaseCostContain.DEFMATHTOTALACCOUNT;
            let objProduct = {};
            let objAccount = {};
            if (purchaseCostAccounting && purchaseCostAccounting.length) {
                purchaseCost.accounting_list = purchaseCostAccounting;
                objAccount = purchaseCostHelper.convertObjArrayMapValue(
                    purchaseCostAccounting,
                    containAcc,
                    containStrAcc,
                );
            }

            if (productList && productList.length) {
                purchaseCost.products_list = productList;
                const DEF_FIELD = 'stocks_in_request_id';
                let arrayParStRequest = purchaseCostHelper.pushValueToArray(productList, DEF_FIELD);
                arrayParStRequest = new Set([...arrayParStRequest]);
                purchaseCost.purchase_order_id = [...arrayParStRequest];
                objProduct = purchaseCostHelper.convertObjArrayMapValue(productList, containPro, containStrPro);
            }

            const payment_slip_list = stocksInRequestClass.paymentSlipList(data.recordsets[4]);

            purchaseCost = {
                ...purchaseCost,
                ...objAccount,
                ...objProduct,
                payment_slip_list,
            };
            return new ServiceResponse(true, '', purchaseCost);
        }

        return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
    } catch (e) {
        logger.error(e, { function: 'purchaseRequisitionService.detailPurchaseRequisition' });
        return new ServiceResponse(false, e.message);
    }
};

const createOrUpdatePurchaseCost = async (bodyParams) => {
    const pool = await mssql.pool;
    const transaction = new sql.Transaction(pool);
    try {
        await transaction.begin();
        let purchaseCostIdParam = parseInt(apiHelper.getValueFromObject(bodyParams, 'purchase_cost_id'));
        const productList = apiHelper.getValueFromObject(bodyParams, 'products_list', []);
        const accountingList = apiHelper.getValueFromObject(bodyParams, 'accounting_list', []);
        const purchaseOrderId = apiHelper.getValueFromObject(bodyParams, 'purchase_order_order_id', []);
        const authName = apiHelper.getValueFromObject(bodyParams, 'auth_name');
        let purchaseOrderIdList = purchaseCostHelper.arrayJoinToString(purchaseOrderId);

        const creatOrUpdateRes = await new sql.Request(transaction)
            .input('PURCHASECOSTSID', purchaseCostIdParam)
            .input('SUPPLIERID', parseInt(apiHelper.getValueFromObject(bodyParams, 'supplier_id')))
            .input('PCDATE', apiHelper.getValueFromObject(bodyParams, 'accounting_date'))
            .input('INVOICEDATE', apiHelper.getValueFromObject(bodyParams, 'payment_date'))
            .input('INVOICENO', apiHelper.getValueFromObject(bodyParams, 'payment_code'))
            .input('ISPOSTATUSID', apiHelper.getValueFromObject(bodyParams, 'payment_form_id'))
            .input('TAXCODE', apiHelper.getValueFromObject(bodyParams, 'tax_code'))
            .input('ORDERSTATUSID', apiHelper.getValueFromObject(bodyParams, 'order_status_id'))
            .input('ADDRESS', apiHelper.getValueFromObject(bodyParams, 'address'))
            .input('EXPENDTYPEID', apiHelper.getValueFromObject(bodyParams, 'cost_type_id'))
            .input('ISPAYMENTSSTATUSID', apiHelper.getValueFromObject(bodyParams, 'is_payments_status_id'))
            .input('EMPLOYEEPURCHASE', apiHelper.getValueFromObject(bodyParams, 'employee_purchase'))
            .input('PURCHASECOSTSNOTE', apiHelper.getValueFromObject(bodyParams, 'purchase_cost_note'))
            .input('PURCHASECOSTACCOUNTID', apiHelper.getValueFromObject(bodyParams, 'purchase_cost_account_id'))
            .input('PURCHASEORDERID', purchaseOrderIdList)
            .input('CREATEDUSER', authName)
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .execute('SL_PURCHASECOST_CreateOrUpdate_AdminWeb');

        const purchaseCostId = creatOrUpdateRes.recordset[0].RESULT;
        if (purchaseCostId <= 0) {
            await transaction.rollback();
            throw new ServiceResponse(false, 'Lỗi tạo chi phí mua hàng');
        }

        // delete old purchase cost detail
        if (purchaseCostIdParam) {
            const deleteOldDetail = new sql.Request(transaction);
            await deleteOldDetail
                .input('LISTID', [purchaseCostId])
                .input('NAMEID', 'PURCHASECOSTSID')
                .input('TABLENAME', 'SL_PURCHASECOSTS_DETAIL')
                .input('DELETEDUSER', authName)
                .execute('CBO_COMMON_SOFTDELETE');
        }
        let totalPurchaseCost = 0;

        const createOrUpdateDetail = new sql.Request(transaction);
        for (let i = 0; i < accountingList.length; i++) {
            const createOrUpdateDetailRes = await createOrUpdateDetail
                .input(
                    'PURCHASECOSTSDETAILID',
                    apiHelper.getValueFromObject(accountingList[i], 'purchase_cost_detail_id'),
                )
                .input('PURCHASECOSTSID', purchaseCostId)
                .input('DEBTACCID', apiHelper.getValueFromObject(accountingList[i], 'debt_account'))
                .input('CREDITACCID', apiHelper.getValueFromObject(accountingList[i], 'credit_account'))
                .input('TAXACCID', apiHelper.getValueFromObject(accountingList[i], 'tax_account'))
                .input('PAYMENTMONEY', apiHelper.getValueFromObject(accountingList[i], 'cost_money'))
                .input('INVOICEVAT', apiHelper.getValueFromObject(accountingList[i], 'vat_money'))
                .input('INVOICEVATMONEY', apiHelper.getValueFromObject(accountingList[i], 'return_vat_money'))
                .input('TOTALMONEY', apiHelper.getValueFromObject(accountingList[i], 'money'))
                .input('DESCRIPTION', apiHelper.getValueFromObject(accountingList[i], 'description'))
                .input('EXPLAIN', apiHelper.getValueFromObject(accountingList[i], 'explain'))
                .input('EXPENDTYPEID', apiHelper.getValueFromObject(accountingList[i], 'cost_type_id'))
                .input('CREATEDUSER', authName)
                .execute('SL_PURCHASECOST_DETAIL_CreateOrUpdate_AdminWeb');
            totalPurchaseCost += parseInt(apiHelper.getValueFromObject(accountingList[i], 'money'));
            const purchaseCostDetailId = createOrUpdateDetailRes.recordset[0].RESULT;
            if (purchaseCostDetailId <= 0) {
                await transaction.rollback();
                throw new ServiceResponse(false, 'Lỗi tạo chi tiết chi phí mua hàng');
            }
        }

        // delete old purchase cost allocation product
        if (purchaseCostIdParam) {
            const deleteOldAllocationDetail = new sql.Request(transaction);
            await deleteOldAllocationDetail
                .input('LISTID', [purchaseCostId])
                .input('NAMEID', 'PURCHASECOSTSID')
                .input('TABLENAME', 'SL_COSTALLOCATION')
                .input('DELETEDUSER', authName)
                .execute('CBO_COMMON_SOFTDELETE');
        }

        const createOrUpdateDetailI = new sql.Request(transaction);
        for (let i = 0; i < productList.length; i++) {
            const createOrUpdateDetailRes = await createOrUpdateDetailI
                .input('COSTALLOCATIONID', apiHelper.getValueFromObject(productList[i], 'cost_allocation_id'))
                .input('PURCHASECOSTSID', purchaseCostId)
                .input('STOCKSINREQUESTID', apiHelper.getValueFromObject(productList[i], 'stocks_in_request_id'))
                .input('PRODUCTID', apiHelper.getValueFromObject(productList[i], 'product_id'))
                .input('VALUEBASEDCA', apiHelper.getValueFromObject(productList[i], 'total_cost_price'))
                .input('VOLUMECA', `${apiHelper.getValueFromObject(productList[i], 'total_cost_st_request_price')}`)
                .input('CREATEDUSER', authName)
                .execute('SL_COSTALLOCATION_CreateOrUpdate_AdminWeb');

            const purchaseCostDetailId = createOrUpdateDetailRes.recordset[0].RESULT;
            if (purchaseCostDetailId <= 0) {
                await transaction.rollback();
                throw new ServiceResponse(false, 'Lỗi tạo chi tiết chi phí mua hàng');
            }
        }

        if (purchaseCostId) {
            const createDebit = new sql.Request(transaction);
            const res = await createDebit
                .input('TOTALMONEY', totalPurchaseCost)
                .input('TOTALAMOUNT', totalPurchaseCost)
                .input('TOTALPAID', 0)
                .input('PURCHASECOSTSID', purchaseCostId)
                .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .execute('SL_DEBIT_CreateOrUpdate_AdminWeb');
            const debitId = res.recordset[0].RESULT;
            if (debitId <= 0) {
                await transaction.rollback();
                throw new ServiceResponse(false, 'Lỗi tạo công nợ ');
            }
            // Tạo chi tiết phiếu công nợ
            const createDebitDetail = new sql.Request(transaction);
            const res1 = await createDebitDetail
                .input('DEBITID', debitId)
                .input('TOTALAMOUNT', totalPurchaseCost)
                .input('TOTALMONEY', totalPurchaseCost)
                .input('TOTALPAID', 0)
                .input('PAYMENTSTATUS', apiHelper.getValueFromObject(bodyParams, 'order_status_id')) // 1: đã thanh toán, 2: chưa thanh toán, 3: thanh toán 1 phần
                .input('PAYMENTSLIPID', null)
                .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .execute('SL_DEBITDETAIL_CreateOrUpdate_AdminWeb');

            const debitDetailId = res1.recordset[0].RESULT;
            if (debitDetailId <= 0) {
                await transaction.rollback();
                throw new ServiceResponse(false, 'Lỗi tạo chi tiết công nợ ');
            }
        }

        // insert or update accounting list
        const accountingListBegin = bodyParams.accounting_list_begin ?? accountingList ?? [];
        const listDebtCredit = [],
            listCreditTax = [];
        for (const item of accountingListBegin) {
            listDebtCredit.push({
                ...item,
                money: item.cost_money,
            });
            listCreditTax.push({
                ...item,
                debt_account: item.tax_account,
                money: item.return_vat_money,
            });
        }
        // Tạo TK Nợ + Có
        await createOrUpdateAccountingList(listDebtCredit, purchaseCostId, authName, transaction);

        // Tạo TK Có + Thuế
        await createOrUpdateAccountingList(listCreditTax, purchaseCostId, authName, transaction);

        await transaction.commit();
        return new ServiceResponse(true, '', purchaseCostId);
    } catch (error) {
        logger.error(error, { function: 'purchaseCostService.createOrUpdate' });
        await transaction.rollback();
        return new ServiceResponse(false, error.message);
    }
};

const createOrUpdateAccountingList = async (accountingList, purchase_cost_id, authName, transaction) => {
    const accountingIds = accountingList
        .filter((accounting) => accounting.accounting_id)
        ?.map((accounting) => accounting.accounting_id);

    try {
        // delete unnessary accounting
        if (accountingIds.length > 0) {
            const deleteRequest = new sql.Request(transaction);
            const deleteResult = await deleteRequest
                .input('LISTID', accountingIds)
                .input('PURCHASECOSTSID', purchase_cost_id)
                .input('DELETEDUSER', authName)
                .execute('SL_PURCHASECOSTS_DeleteAllExceptAccounting_AdminWeb');
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
                .input('PURCHASECOSTSID', purchase_cost_id)
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

const deletePurchaseCost = async (bodyParams) => {
    try {
        const pool = await mssql.pool;
        let list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []);
        await pool
            .request()
            .input('LISTID', list_id)
            .input('NAMEID', 'PURCHASECOSTSID')
            .input('TABLENAME', 'SL_PURCHASECOSTS')
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('CBO_COMMON_SOFTDELETE');

        return new ServiceResponse(true, '', true);
    } catch (e) {
        logger.error(e, { function: 'purchaseCostService.deletePurchaseCost' });
        return new ServiceResponse(false, e.message);
    }
};

module.exports = {
    getListPurchaseCost,
    getPurchaseCostId,
    detailPurchaseCost,
    createOrUpdatePurchaseCost,
    deletePurchaseCost,
};
