const purchaseOrdersClass = require('./purchase-orders.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
let xl = require('excel4node');
const sql = require('mssql');
const moment = require('moment');
const { spName, INVOCIE_STATUS } = require('./constants');
const rpoService = require('../request-purchase-order/request-purchase-order.service');
const uniqBy = require('lodash/uniqBy');

const getStoreListByBusiness = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('BUSINESSID', apiHelper.getValueFromObject(queryParams, 'business_id'))
            .execute('PURCHASEORDERS_GetStoreOptions_AdminWeb');
        let dataRecord = data.recordset;
        dataRecord = purchaseOrdersClass.options(dataRecord);
        return new ServiceResponse(true, '', dataRecord);
    } catch (e) {
        logger.error(e, { function: 'purchaseOrders.getStoreListByBusiness' });
        return [];
    }
};
const getPurchaseOrderId = async () => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().execute('SL_PURCHASEORDER_GenPurchaseOrderNo_AdminWeb');
        let dataRecord = data.recordset[0].PURCHASEORDERNO;

        return new ServiceResponse(true, '', dataRecord);
    } catch (e) {
        logger.error(e, { function: 'purchaseOrders.getPurchaseOrderId' });
        return [];
    }
};

const getListCustomerDeboune = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'keyword'))
            .execute('SL_PURCHASEORDERS_DebouneSearch');
        return new ServiceResponse(true, '', purchaseOrdersClass.customerListDeboune(data.recordset));
    } catch (e) {
        logger.error(e, { function: 'purchaseOrderService.getListCustomerDeboune' });
        return new ServiceResponse(true, '', []);
    }
};

const getListPurchaseOrder = async (queryParams) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getSearch(queryParams);
        const expectedDateFrom = apiHelper.getValueFromObject(queryParams, 'expected_date_from');
        const expectedDateTo = apiHelper.getValueFromObject(queryParams, 'expected_date_to');
        const createdDateFrom = apiHelper.getValueFromObject(queryParams, 'created_date_from');
        const createdDateTo = apiHelper.getValueFromObject(queryParams, 'created_date_to');
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('KEYWORD', keyword)
            .input('COMPANYID', apiHelper.getValueFromObject(queryParams, 'company_id'))
            .input('BUSINESSID', apiHelper.getValueFromObject(queryParams, 'business_id'))
            .input('STOREID', apiHelper.getValueFromObject(queryParams, 'store_id'))
            .input('SUPPLIERID', apiHelper.getValueFromObject(queryParams, 'supplier_id'))
            .input('PAYMENTSTATUS', apiHelper.getValueFromObject(queryParams, 'payment_status'))
            .input('ORDERSTATUS', apiHelper.getValueFromObject(queryParams, 'order_status'))
            .input('EXPECTEDDATEFROM', expectedDateFrom)
            .input('EXPECTEDDATETO', expectedDateTo)
            .input('CREATEDDATEFROM', createdDateFrom)
            .input('CREATEDDATETO', createdDateTo)
            .input('PURCHASERORDERID', apiHelper.getValueFromObject(queryParams, 'purchase_order_id'))
            .input('INVOICESTATUS', apiHelper.getValueFromObject(queryParams, 'invoice_status'))
            .execute(spName.getList);

        let list = purchaseOrdersClass.list(data.recordsets[1]);

        // pare data
        list.forEach((purchaseOrder) => {
            purchaseOrder.invoice_list = purchaseOrder.invoice_list ? JSON.parse(purchaseOrder.invoice_list) : [];
        });

        for (let i = 0; i < list.length; i++) {
            if (!list[i].request_purchase_code) {
                const select = await pool
                    .request()
                    .input('PURCHASEORDERID', list[i].purchase_order_id)
                    .execute('SL_PURCHASEORDER_PO_GetInfoByID_AdminWeb');
                const rs = select.recordset;
                const info = purchaseOrdersClass.informapping(rs);
                const _infor = info.map((x) => x.request_purchase_code).join(', ');
                list[i].request_purchase_code = _infor;
            }
        }

        return new ServiceResponse(true, '', {
            data: list,
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordsets[0]),
        });
    } catch (e) {
        logger.error(e, { function: 'purchaseOrderService.getListPurchaseOrder' });
        return new ServiceResponse(true, '', {});
    }
};

const countOrderStatus = async () => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().execute(spName.countOrderStatus);

        return new ServiceResponse(
            true,
            'Lấy tổng số lượng thành công',
            purchaseOrdersClass.countOrderStatus(data.recordset),
        );
    } catch (e) {
        logger.error(e, { function: 'purchaseRequisitionService.countOrderStatus' });
        return new ServiceResponse(false, e.message);
    }
};

const detailPurchaseOrder = async (purchase_order_id) => {
    try {
        const pool = await mssql.pool;

        const data = await pool.request().input('PURCHASEORDERID', purchase_order_id).execute(spName.getById);
        let purchaseOrder = data.recordset;

        // If exists MD_PURCHASEREQUISITION
        let total_returned_quantity = 0;
        if (purchaseOrder && purchaseOrder.length > 0) {
            purchaseOrder = purchaseOrdersClass.detail(purchaseOrder[0]);
            purchaseOrder.payment_status = purchaseOrder.payment_status ?? (NOT_PAID = 0);
            let productList = data.recordsets[1];
            if (productList && productList.length) {
                purchaseOrder = {
                    ...purchaseOrder,
                    product_list: purchaseOrdersClass.productList(productList)?.map((product) => {
                        total_returned_quantity += product.quantity;
                        const imeis = product.imeis?.split('|')?.map((item) => ({ value: item, label: item }));
                        return {
                            ...product,
                            purchase_order_code: purchaseOrder.purchase_order_code,
                            purchase_order_id: purchaseOrder.purchase_order_id,
                            returned_quantity: product.quantity,
                            imeis: imeis,
                            imei_options: imeis,
                        };
                    }),
                };
            }

            const po_division_list = purchaseOrdersClass.purchaseOrderDivisionList(data.recordsets[3]);

            const payment_slip_list = purchaseOrdersClass.paymentSlipList(data.recordsets[2]);
            let total_quantity_stocks_in = 0;
            const stocks_in_request_list = purchaseOrdersClass.stocksInRequestList(data.recordsets[4])?.map((_) => {
                const product_list = _.product_list
                    ? JSON.parse(_.product_list)?.map((_) => ({
                          purchase_order_id: Number(purchaseOrder?.purchase_order_id),
                          stocks_in_detail_id: _.STOCKSINDETAILID,
                          product_imei_code: _.PRODUCTIMEICODE,
                          product_id: _.PRODUCTID,
                          total_cost_price: _.TOTALCOSTPRICE,
                      }))
                    : [];
                total_quantity_stocks_in += product_list.length;
                return {
                    ..._,
                    product_list,
                };
            });

            purchaseOrder.payment_slip_list = payment_slip_list;
            purchaseOrder.po_division_list = po_division_list;

            purchaseOrder.stocks_in_request_list = stocks_in_request_list?.map((item) => {
                item.product_list = item.product_list?.reduce((acc, product) => {
                    const targetItem = acc?.find((_) => _.product_id === product.product_id);
                    if (targetItem) {
                        targetItem.product_imei_codes?.push(product.product_imei_code);
                    } else {
                        product.product_imei_codes = [product.product_imei_code];
                        product.total_cost_price = product.total_cost_price || 0;
                        delete product.product_imei_code;
                        acc.push(product);
                    }
                    return acc;
                }, []);
                return item;
            });

            const totalPriceAll = (purchaseOrder?.product_list || []).reduce((total, item) => {
                return total + (purchaseOrder?.discount_program_id ? item.discount_total_price : item.total_price) || 0;
            }, 0);

            purchaseOrder.total_price_all = totalPriceAll;
            if (!purchaseOrder.request_purchase_code) {
                const select = await pool
                    .request()
                    .input('PURCHASEORDERID', purchaseOrder.purchase_order_id)
                    .execute('SL_PURCHASEORDER_PO_GetInfoByID_AdminWeb');
                const rs = select.recordset;
                const info = purchaseOrdersClass.informapping(rs);
                purchaseOrder.request_purchase_code = uniqBy(info, 'id');
            }

            // calculate invoice status
            const invoiceList = purchaseOrdersClass.invoiceList(data.recordsets[5]) || [];
            let invoice_status = INVOCIE_STATUS.NOT_HAVE;
            if (invoiceList?.length > 0) {
                const productCount = invoiceList?.reduce((total, item) => total + item.product_count, 0);

                const productCountOrigin = purchaseOrder?.product_list?.reduce(
                    (total, item) => total + item.quantity,
                    0,
                );

                if (productCount >= productCountOrigin) {
                    invoice_status = INVOCIE_STATUS.ENOUGH;
                } else {
                    invoice_status = INVOCIE_STATUS.NOT_ENOUGH;
                }
            }
            purchaseOrder.invoice_status = invoice_status;
            purchaseOrder.is_enough_stocks_in_returned = total_returned_quantity === total_quantity_stocks_in ? 1 : 0;

            if (purchaseOrder?.customer_type) {
                const dataMember = await pool
                    .request()
                    .input('MEMBERID', purchaseOrder.member_id)
                    .execute('SL_PURCHASEORDER_GetCustomerOptions_AdminWeb');
                purchaseOrder.receiver_name = dataMember.recordset?.[0]?.label;
            }
            return new ServiceResponse(true, '', purchaseOrder);
        }

        return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
    } catch (e) {
        logger.error(e, { function: 'purchaseRequisitionService.detailPurchaseRequisition' });
        return new ServiceResponse(false, e.message);
    }
};

const getTotalPrice = async (purchase_order_id) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().input('PURCHASEORDERID', purchase_order_id).execute(spName.getById);
        let purchaseOrder = data.recordset;

        if (purchaseOrder && purchaseOrder.length > 0) {
            purchaseOrder = purchaseOrdersClass.detail(purchaseOrder[0]);
            purchaseOrder.payment_status = purchaseOrder.payment_status ?? (NOT_PAID = 0);
            let productList = data.recordsets[1];
            if (productList && productList.length) {
                purchaseOrder = {
                    ...purchaseOrder,
                    product_list: purchaseOrdersClass.productList(productList)?.map((product) => ({
                        ...product,
                        purchase_order_code: purchaseOrder.purchase_order_code,
                        purchase_order_id: purchaseOrder.purchase_order_id,
                    })),
                };
            }

            const totalPriceAll = (purchaseOrder?.product_list || []).reduce((total, product) => {
                return total + _calTotalMoney(product) || 0;
            }, 0);

            return totalPriceAll;
        }
    } catch (e) {
        return new ServiceResponse(false, e.message ?? 'Get total money of purchase order failed !');
    }
};

const _calTotalMoney = (product) => {
    const vatValue = product.vat_value || 0;
    const discountTotalPrice = product.discount_total_price || 0;
    let totalMoney = Math.floor(discountTotalPrice + (discountTotalPrice * vatValue) / 100);

    // Trường hợp chưa có chiết khấu
    if (discountTotalPrice === 0) {
        const totalPrice = product.total_price || product.quantity * product.rpo_price;
        totalMoney = Math.floor(totalPrice + (totalPrice * vatValue) / 100);
    }
    return totalMoney || 0;
};

const getDoAndPo = async (purchase_order_id) => {
    try {
        const pool = await mssql.pool;

        const data = await pool.request().input('PURCHASEORDERID', purchase_order_id).execute(spName.getById);
        let purchaseOrder = data.recordset;

        // If exists MD_PURCHASEREQUISITION
        if (purchaseOrder && purchaseOrder.length > 0) {
            purchaseOrder = purchaseOrdersClass.detail(purchaseOrder[0]);

            let productList = data.recordsets[1];
            if (productList && productList.length) {
                purchaseOrder = {
                    ...purchaseOrder,
                    product_list: purchaseOrdersClass.productList(productList),
                };
            }

            const totalPriceAll = (purchaseOrder?.product_list || []).reduce((total, item) => {
                return total + (purchaseOrder?.discount_program_id ? item.discount_total_price : item.total_price) || 0;
            }, 0);
            purchaseOrder.total_price_all = totalPriceAll;

            if (purchaseOrder?.request_purchase_id) {
                const serviceRes = await rpoService.detail(purchaseOrder?.request_purchase_id);
                purchaseOrder.rpoData = serviceRes.getData();
            }

            return new ServiceResponse(true, '', purchaseOrder);
        }

        return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
    } catch (e) {
        logger.error(e, { function: 'purchaseRequisitionService.detailPurchaseRequisition' });
        return new ServiceResponse(false, e.message);
    }
};

const exportExcelPerformanceReport = async (queryParams = {}) => {
    try {
        const serviceRes = await getUserList(queryParams);
        const { data } = serviceRes.getData();

        // Create a new instance of a Workbook class
        const wb = new xl.Workbook();

        // Add Worksheets to the workbook
        const ws = wb.addWorksheet('Performance Report', {});

        // Set width
        ws.column(1).setWidth(20);

        ws.column(2).setWidth(20);
        // ws.column(2).setWidth(17);
        ws.column(3).setWidth(30);
        ws.column(4).setWidth(50);
        ws.column(5).setWidth(50);

        const header = {
            // no: 'STT',
            user_assigned: 'Mã nhân viên',
            fullname: 'Tên nhân viên',
            estimate_total_time: 'Tổng thời gian dự kiến',
            actual_total_time: 'Tổng thời gian làm thực tế',
            // department_name: 'Phòng ban',
            performance: 'Chất lượng công việc',
        };
        data.unshift(header);

        data.forEach((item, index) => {
            let indexRow = index + 1;
            let indexCol = 0;
            // ws.cell(indexRow, ++indexCol).string(indexRow).toString();
            ws.cell(indexRow, ++indexCol).string((item.user_assigned || '').toString());
            ws.cell(indexRow, ++indexCol).string((item.fullname || '').toString());
            // ws.cell(indexRow, ++indexCol).string((item.department_name || '').toString());
            ws.cell(indexRow, ++indexCol).string((item.estimate_total_time || 0).toString());
            ws.cell(indexRow, ++indexCol).string((item.actual_total_time || 0).toString());
            ws.cell(indexRow, ++indexCol).string((item.performance || 0).toString());
        });

        return new ServiceResponse(true, '', wb);
    } catch (e) {
        logger.error(e, { function: 'performanceService.exportExcelPerformanceReport' });
        return new ServiceResponse(true, '', {});
    }
};

const createOrUpdatePurchaseOrder = async (bodyParams) => {
    const pool = await mssql.pool;
    const transaction = new sql.Transaction(pool);

    try {
        await transaction.begin();
        const purchase_order_id = parseInt(apiHelper.getValueFromObject(bodyParams, 'purchase_order_id'));
        const productList = apiHelper.getValueFromObject(bodyParams, 'product_list', []);
        const isReturnedGoods = apiHelper.getValueFromObject(bodyParams, 'is_returned_goods', []);

        let expectedDate = null;
        if (productList?.length && !isReturnedGoods) {
            const maxDate = Math.max(...productList.map((item) => moment(item.expected_date, 'DD/MM/YYYY')));
            if (maxDate) {
                expectedDate = moment(maxDate).format('DD/MM/YYYY');
            }
        }

        const creatOrUpdateRes = await new sql.Request(transaction)
            .input('PURCHASEORDERID', purchase_order_id)
            .input('COMPANYID', parseInt(apiHelper.getValueFromObject(bodyParams, 'company_id')))
            .input('BUSINESSID', parseInt(apiHelper.getValueFromObject(bodyParams, 'business_id')))
            .input('STOREID', apiHelper.getValueFromObject(bodyParams, 'store_id'))
            .input('SUPPLIERID', apiHelper.getValueFromObject(bodyParams, 'supplier_id'))
            .input('DISCOUNTPROGRAMID', apiHelper.getValueFromObject(bodyParams, 'discount_program_id'))
            // .input('REQUESTPURCHASECODE', apiHelper.getValueFromObject(bodyParams, 'request_purchase_code'))
            .input('ISPOSTATUSID', apiHelper.getValueFromObject(bodyParams, 'order_status'))
            .input('ISPAYMENTSSTATUSID', apiHelper.getValueFromObject(bodyParams, 'is_payments_status_id'))
            .input('PAYMENTTYPE', apiHelper.getValueFromObject(bodyParams, 'payment_type'))
            .input('ORDERNOTE', apiHelper.getValueFromObject(bodyParams, 'order_note'))
            .input('LOTNUMBER', apiHelper.getValueFromObject(bodyParams, 'lot_number'))
            .input('PURCHASEORDERCODE', apiHelper.getValueFromObject(bodyParams, 'purchase_order_code'))
            .input('ISOLDPRODUCT', apiHelper.getValueFromObject(bodyParams, 'is_old_product'))
            .input('TOTALAMOUNT', apiHelper.getValueFromObject(bodyParams, 'total_amount'))
            .input('EXPECTEDDATE', expectedDate)
            .input('EXPECTEDIMPORTEDSTOCKID', apiHelper.getValueFromObject(bodyParams, 'expected_imported_stock_id'))
            .input('TOTALMONEY', String(+apiHelper.getValueFromObject(bodyParams, 'total_price_all', 0)))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('EDITABLE', apiHelper.getValueFromObject(bodyParams, 'editable'))

            .input(
                'PURCHASEREQUISITIONTYPEID',
                apiHelper.getValueFromObject(bodyParams, 'purchase_requisition_type_id'),
            )
            .input('ORDERID', apiHelper.getValueFromObject(bodyParams, 'order_id'))
            .input('COGSOPTION', apiHelper.getValueFromObject(bodyParams, 'cogs_option'))
            .input('CUSTOMERTYPE', apiHelper.getValueFromObject(bodyParams, 'customer_type'))
            .input('MEMBERID', apiHelper.getValueFromObject(bodyParams, 'member_id'))
            .execute(spName.createOrUpdate);
        const purchaseOrderId = creatOrUpdateRes.recordset[0].RESULT;
        if (purchaseOrderId <= 0) {
            await transaction.rollback();
            throw new ServiceResponse(false, 'Lỗi tạo đơn mua hàng');
        }

        //delete old purchase requisition product
        const deleteOldDetail = new sql.Request(transaction);
        await deleteOldDetail
            .input('LISTID', [purchaseOrderId])
            .input('NAMEID', 'PURCHASEORDERID')
            .input('TABLENAME', 'SL_PURCHASEORDERDETAIL')
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('CBO_COMMON_SOFTDELETE');

        for (let i = 0; i < productList.length; i++) {
            const createOrUpdateDetail = new sql.Request(transaction);
            const createOrUpdateDetailRes = await createOrUpdateDetail
                .input(
                    'PURCHASEORDERREQUESTDETAILID',
                    apiHelper.getValueFromObject(productList[i], 'purchase_order_detail_id', null),
                )
                .input('PURCHASEORDERID', purchaseOrderId)
                .input('PRODUCTID', apiHelper.getValueFromObject(productList[i], 'product_id'))
                .input('QUANTITY', apiHelper.getValueFromObject(productList[i], 'quantity', 1))
                .input('ORIGINQUANTITY', apiHelper.getValueFromObject(productList[i], 'origin_quantity'))
                .input('VATVALUE', apiHelper.getValueFromObject(productList[i], 'vat_value', 1))
                .input('COSTPRICE', (productList[i].cost_price || '').toString())
                .input('TOTALPRICE', (productList[i].total_price || '').toString())
                .input('DISCOUNTPRICE', (productList[i].discount_price || '').toString())
                .input('DISCOUNTTOTALPRICE', (productList[i].discount_total_price || '').toString())
                .input('DISCOUNTPERCENT', (productList[i].discount_percent || '').toString())
                .input('EXPECTEDDATE', (productList[i].expected_date || '').toString())
                .input('VATVALUE', +(productList[i].vat_value ?? 0))
                .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .input('IMEIS', productList[i]?.imeis?.map((item) => item.id ?? item.value ?? item).join('|'))
                .execute(spName.createOrUpdateDetail);

            const purchaseRequisitionDetailId = createOrUpdateDetailRes.recordset[0].RESULT;
            if (purchaseRequisitionDetailId <= 0) {
                await transaction.rollback();
                throw new ServiceResponse(false, 'Lỗi tạo chi tiết đơn mua hàng');
            }
        }

        //delete mapping PURCHASEORDER_PO
        const _request_purchase_list = apiHelper.getValueFromObject(bodyParams, 'request_purchase_code', []);
        const _request_purchase_string_list = _request_purchase_list.map((x) => x.id ?? x.value).join('|');
        const request_purchase_id_list = _request_purchase_list.map((x) => x.id ?? x.value);
        const deleteMappingPO = new sql.Request(transaction);
        await deleteMappingPO
            .input('REQUESTPURCHASEIDLIST', _request_purchase_string_list)
            .input('PURCHASEORDERID', purchaseOrderId)
            .execute('SL_PURCHASEORDER_PO_DeleteMaping_AdminWeb');
        for (let i = 0; i < _request_purchase_list.length; i++) {
            const createOrUpdatePO = new sql.Request(transaction);
            const res = await createOrUpdatePO
                .input('PURCHASEORDERID', purchaseOrderId)
                .input('REQUESTPURCHASEID', request_purchase_id_list[i])
                .execute('SL_PURCHASEORDER_PO_CreateOrUpdate_AdminWeb');

            // Cập nhật trạng thái đặt hàng -> Đã đặt hàng
            const po = new sql.Request(transaction);
            await po
                .input('REQUESTPURCHASEID', request_purchase_id_list[i])
                .execute(`SL_REQUESTPURCHASEORDER_UpdateStatus_AdminWeb`);
        }

        // tạm ẩn tạo công nợ cho đơn mua hàng -> chuyển sang tạo công nợ cho hóa đơn trong đơn mua hàng
        // Tạo phiếu công nợ
        // if (!purchase_order_id) {
        //     const total_money = bodyParams.total_price_all || '';
        //     const total_amount = apiHelper.getValueFromObject(bodyParams, 'total_amount');
        //     const createDebit = new sql.Request(transaction);
        //     const res = await createDebit
        //         .input('TOTALMONEY', total_money)
        //         .input('TOTALAMOUNT', total_money)
        //         .input('TOTALPAID', 0)
        //         .input('PURCHASEORDERID', purchaseOrderId)
        //         .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
        //         .execute('SL_DEBIT_CreateOrUpdate_AdminWeb');
        //     const debitId = res.recordset[0].RESULT;
        //     if (debitId <= 0) {
        //         await transaction.rollback();
        //         throw new ServiceResponse(false, 'Lỗi tạo công nợ ');
        //     }
        //     // Tạo chi tiết phiếu công nợ
        //     const createDebitDetail = new sql.Request(transaction);
        //     const res1 = await createDebitDetail
        //         .input('DEBITID', debitId)
        //         .input('TOTALAMOUNT', total_money)
        //         .input('TOTALMONEY', total_money)
        //         .input('TOTALPAID', 0)
        //         .input('PAYMENTSTATUS', apiHelper.getValueFromObject(bodyParams, 'order_status')) // 1: đã thanh toán, 2: chưa thanh toán, 3: thanh toán 1 phần
        //         .input('PAYMENTSLIPID', null)
        //         .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
        //         .execute('SL_DEBITDETAIL_CreateOrUpdate_AdminWeb');

        //     const debitDetailId = res1.recordset[0].RESULT;
        //     if (debitDetailId <= 0) {
        //         await transaction.rollback();
        //         throw new ServiceResponse(false, 'Lỗi tạo chi tiết công nợ ');
        //     }
        // }

        await transaction.commit();
        return new ServiceResponse(true, '', purchaseOrderId);
    } catch (error) {
        logger.error(error, { function: 'purchaseOrderService.createOrUpdate' });
        await transaction.rollback();
        return new ServiceResponse(false, error.message);
    }
};

const deletePurchaseOrder = async (bodyParams) => {
    try {
        const pool = await mssql.pool;
        let list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []);
        await pool
            .request()
            .input('LISTID', list_id)
            .input('NAMEID', 'PURCHASEORDERID')
            .input('TABLENAME', 'SL_PURCHASEORDER')
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('CBO_COMMON_SOFTDELETE');

        return new ServiceResponse(true, '', true);
    } catch (e) {
        logger.error(e, { function: 'purchaseOrderService.deletePurchaseOrder' });
        return new ServiceResponse(false, e.message);
    }
};

const detailListPurchaseOrder = async (body = {}) => {
    try {
        let list_purchase = apiHelper.getValueFromObject(body, 'list_purchase');
        let list_purchase_string = (Array.isArray(list_purchase) ? list_purchase : [list_purchase])
            .map((item) => {
                return item;
            })
            .join(',');
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PURCHASEORDERID', list_purchase_string)
            .input('STOCKSID', apiHelper.getValueFromObject(body, 'stocks_id'))
            .execute(spName.getByListId);
        let purchaseOrder = data.recordset;
        let productList = purchaseOrdersClass.productList(
            data && data.recordsets && data.recordsets.length > 0 && data.recordsets[1],
        );
        // If exists MD_PURCHASEREQUISITION
        if (purchaseOrder && purchaseOrder.length > 0) {
            purchaseOrder = purchaseOrdersClass.detail(purchaseOrder);
            return new ServiceResponse(true, '', {
                purchaseOrder,
                productList,
            });
        }
        return new ServiceResponse(true, '', []);
    } catch (e) {
        logger.error(e, { function: 'purchaseRequisitionService.detailPurchaseRequisition' });
        return new ServiceResponse(false, e.message);
    }
};

const getListRequestPurchaseOrderOptions = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('SUPPLIERID', apiHelper.getValueFromObject(queryParams, 'supplier_id'))
            .execute('PURCHASEORDERS_RequestPurchaseOrderOptions_AdminWeb');
        let dataRecord = data.recordset;
        dataRecord = purchaseOrdersClass.options(dataRecord);
        return new ServiceResponse(true, '', { data: dataRecord });
    } catch (e) {
        logger.error(e, { function: 'purchaseOrders.getListRequestPurchaseOrderOptions' });
        return new ServiceResponse(false, e.message);
    }
};

const getDoAndPoMulti = async (bodyParams = {}) => {
    try {
        const po_ids = apiHelper.getValueFromObject(bodyParams, 'po_ids', []);
        const pool = await mssql.pool;

        const data = await pool.request().input('PURCHASEORDERIDS', po_ids?.join(',')).execute(spName.getByIdMulti);
        let purchaseOrder = data.recordset;

        // If exists MD_PURCHASEREQUISITION
        if (purchaseOrder && purchaseOrder.length > 0) {
            purchaseOrder = purchaseOrdersClass.detail(purchaseOrder[0]);

            let productList = data.recordsets[1];
            if (productList && productList.length) {
                purchaseOrder = {
                    ...purchaseOrder,
                    // Ko lấy những sản phẩm đã chia đủ
                    product_list: purchaseOrdersClass
                        .productList(productList)
                        ?.filter((p) => p.divided_quantity < p.quantity),
                };
            }

            const totalPriceAll = (purchaseOrder?.product_list || []).reduce((total, item) => {
                return total + (purchaseOrder?.discount_program_id ? item.discount_total_price : item.total_price) || 0;
            }, 0);
            purchaseOrder.total_price_all = totalPriceAll;

            if (purchaseOrder?.request_purchase_id) {
                const serviceRes = await rpoService.detail(purchaseOrder?.request_purchase_id);
                purchaseOrder.rpoData = serviceRes.getData();
            }

            return new ServiceResponse(true, '', purchaseOrder);
        }

        return new ServiceResponse(true, RESPONSE_MSG.NOT_FOUND, []);
    } catch (e) {
        logger.error(e, { function: 'purchaseRequisitionService.detailPurchaseRequisition' });
        return new ServiceResponse(false, e.message);
    }
};

const getCustomerOptions = async (bodyParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('CUSTOMERTYPE', apiHelper.getValueFromObject(bodyParams, 'customer_type'))
            .input('KEYWORD', apiHelper.getValueFromObject(bodyParams, 'search'))
            .execute(`SL_PURCHASEORDER_GetCustomerOptions_AdminWeb`);

        return new ServiceResponse(true, '', data.recordset);
    } catch (e) {
        logger.error(e, {
            function: 'purchaseOrderService.getCustomerOptions',
        });
        return new ServiceResponse(false, e.message);
    }
};

const getOrderOptions = async (bodyParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('MEMBERID', apiHelper.getValueFromObject(bodyParams, 'member_id'))
            .input('KEYWORD', apiHelper.getValueFromObject(bodyParams, 'search'))
            .execute(`SL_PURCHASEORDER_GetOrderOptions_AdminWeb`);

        return new ServiceResponse(true, '', data.recordset);
    } catch (e) {
        logger.error(e, {
            function: 'purchaseOrderService.getOrderOptions',
        });
        return new ServiceResponse(false, e.message);
    }
};

const getProductsOfOrder = async (bodyParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('ORDERID', apiHelper.getValueFromObject(bodyParams, 'order_id'))
            .input('COGSOPTION', apiHelper.getValueFromObject(bodyParams, 'cogs_option'))
            .execute(`SL_PURCHASEORDER_GetProductsOfOrder_AdminWeb`);
        const [list_product_record, list_imei_record] = data.recordsets;
        const list_imei = purchaseOrdersClass.productsOfOrder(list_imei_record);
        return new ServiceResponse(
            true,
            '',
            purchaseOrdersClass.productsOfOrder(list_product_record).map((item) => {
                const imei_options = list_imei
                    .filter((im) => im.product_id === item.product_id)
                    .map((d) => ({ value: d.imei_code, label: d.imei_code }));
                return { ...item, imei_options, imeis: imei_options };
            }),
        );
    } catch (e) {
        logger.error(e, {
            function: 'purchaseOrderService.getProductOfOrder',
        });
        return new ServiceResponse(false, e.message);
    }
};

const getListPurchaseOrderReturned = async (queryParams) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getSearch(queryParams);
        const expectedDateFrom = apiHelper.getValueFromObject(queryParams, 'expected_date_from');
        const expectedDateTo = apiHelper.getValueFromObject(queryParams, 'expected_date_to');
        const createdDateFrom = apiHelper.getValueFromObject(queryParams, 'created_date_from');
        const createdDateTo = apiHelper.getValueFromObject(queryParams, 'created_date_to');
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('KEYWORD', keyword)
            .input('COMPANYID', apiHelper.getValueFromObject(queryParams, 'company_id'))
            .input('BUSINESSID', apiHelper.getValueFromObject(queryParams, 'business_id'))
            .input('STOREID', apiHelper.getValueFromObject(queryParams, 'store_id'))
            .input('SUPPLIERID', apiHelper.getValueFromObject(queryParams, 'supplier_id'))
            .input('PAYMENTSTATUS', apiHelper.getValueFromObject(queryParams, 'payment_status'))
            .input('ORDERSTATUS', apiHelper.getValueFromObject(queryParams, 'order_status'))
            .input('EXPECTEDDATEFROM', expectedDateFrom)
            .input('EXPECTEDDATETO', expectedDateTo)
            .input('CREATEDDATEFROM', createdDateFrom)
            .input('CREATEDDATETO', createdDateTo)
            .input('PURCHASERORDERID', apiHelper.getValueFromObject(queryParams, 'purchase_order_id'))
            .input('INVOICESTATUS', apiHelper.getValueFromObject(queryParams, 'invoice_status'))
            .input('MEMBERID', apiHelper.getValueFromObject(queryParams, 'member_id'))
            .execute(spName.getListReturned);

        let list = purchaseOrdersClass.list(data.recordsets[1]);

        // pare data
        list.forEach((purchaseOrder) => {
            purchaseOrder.invoice_list = purchaseOrder.invoice_list ? JSON.parse(purchaseOrder.invoice_list) : [];
        });

        for (let i = 0; i < list.length; i++) {
            if (!list[i].request_purchase_code) {
                const select = await pool
                    .request()
                    .input('PURCHASEORDERID', list[i].purchase_order_id)
                    .execute('SL_PURCHASEORDER_PO_GetInfoByID_AdminWeb');
                const rs = select.recordset;
                const info = purchaseOrdersClass.informapping(rs);
                const _infor = info.map((x) => x.request_purchase_code).join(', ');
                list[i].request_purchase_code = _infor;
            }
        }

        return new ServiceResponse(true, '', {
            data: list,
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordsets[0]),
        });
    } catch (e) {
        logger.error(e, { function: 'purchaseOrderService.getListPurchaseOrder' });
        return new ServiceResponse(true, '', {});
    }
};

module.exports = {
    getListPurchaseOrder,
    getStoreListByBusiness,
    exportExcelPerformanceReport,
    getPurchaseOrderId,
    getListCustomerDeboune,
    detailPurchaseOrder,
    createOrUpdatePurchaseOrder,
    deletePurchaseOrder,
    detailListPurchaseOrder,
    getDoAndPo,
    countOrderStatus,
    getListRequestPurchaseOrderOptions,
    getDoAndPoMulti,
    getTotalPrice,
    getCustomerOptions,
    getOrderOptions,
    getProductsOfOrder,
    getListPurchaseOrderReturned,
};
