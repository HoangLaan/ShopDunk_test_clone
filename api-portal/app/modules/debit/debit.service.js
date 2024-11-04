const debitClass = require('../debit/debit.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const PurchaseOrderService = require('../purchase-orders/purchase-orders.service');
const { DEBIT_STATUS, DEBIT_STATUS_EXPORT, DEBIT_TYPE } = require('./constant');
const moment = require('moment');
const API_CONST = require('../../common/const/api.const');
const { formatCurrency } = require('../../common/helpers/numberFormat');
const xl = require('excel4node');
const { addSheetGetList } = require('../../common/helpers/excel.helper');

const getListDebit = async (queryParams) => {
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
            .input('FROMDATE', apiHelper.getValueFromObject(queryParams, 'from_date'))
            .input('TODATE', apiHelper.getValueFromObject(queryParams, 'to_date'))
            .input('ISOVERDUE', apiHelper.getFilterBoolean(queryParams, 'is_overdue'))
            .input('DEBTTYPE', apiHelper.getValueFromObject(queryParams, 'debt_type'))
            .input('PAYMENTSTATUS', apiHelper.getValueFromObject(queryParams, 'payment_status'))
            // .input('RECEIVERTYPE', apiHelper.getValueFromObject(queryParams, 'receiver_type_id'))
            // .input('RECEIVER', apiHelper.getValueFromObject(queryParams, 'receiver_id'))
            .execute('SL_DEBIT_GetList_AdminWeb');
        const item = data.recordset;

        return new ServiceResponse(true, '', {
            items: debitClass.list(item),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(item),
            statistic:
                data.recordsets[1] && data.recordsets[1].length
                    ? debitClass.statistic(data.recordsets[1][0])
                    : {
                          total_money: 0,
                          total_money_receivable: 0,
                          total_money_pay: 0,
                      },
        });
    } catch (e) {
        logger.error(e, { function: 'debitService.getListDebit' });
        return new ServiceResponse(true, '', {});
    }
};

const deleteDebit = async (params = {}) => {
    try {
        const pool = await mssql.pool;
        await pool
            .request()
            .input('DEBITIDS', apiHelper.getValueFromObject(params, 'list_id'))
            .input('DELETEDUSER', apiHelper.getValueFromObject(params, 'auth_name'))
            .execute('SL_DEBIT_DeleteList_AdminWeb');
        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, { function: 'debitService.deleteDebit' });
        return new ServiceResponse(false, e.message);
    }
};

const getListPayDebit = async (queryParams) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getSearch(queryParams);
        const isOverDue = apiHelper.getValueFromObject(queryParams, 'is_overdue');

        const ids = await _getFilterDebitIds(isOverDue);

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('KEYWORD', keyword)
            .input('PAYMENTSTATUS', apiHelper.getValueFromObject(queryParams, 'payment_status'))
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'from_date'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'to_date'))
            .input('IDS', ids ? ids?.join('|') : null)
            .execute('SL_DEBIT_GetPayDebitList_AdminWeb');
        const item = data.recordset;

        let resultList = debitClass.list(item);

        const totalMoney = data.recordsets[1][0]?.TOTALMONEY || 0;
        const totalAmount = data.recordsets[2][0]?.TOTALAMOUNT || 0;
        const totalPurchaseMoney = data.recordsets[3]?.reduce((total, item) => total + item.TOTALMONEY, 0);

        resultList = await Promise.all(
            resultList?.map(async (debit) => {
                let total_money = null;
                if (debit.purchase_order_invoice_id && Number(debit.purchase_order_invoice_id) > 0) {
                    debit.purchase_order_id = debit.purchase_order_invoice_id;
                    total_money = (await PurchaseOrderService.getTotalPrice(debit.purchase_order_invoice_id)) || 0;
                }

                return {
                    ...debit,
                    purchase_order_total_money: total_money,
                };
            }),
        );

        resultList = _calculateStatus(resultList);

        return new ServiceResponse(true, '', {
            items: resultList,
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(item),
            statistic: {
                total_money: totalMoney, // số tiền trong hóa đơn
                total_purchase_money: totalPurchaseMoney,
                total_amount: totalAmount, // số tiền công nợ
            },
        });
    } catch (e) {
        logger.error(e, { function: 'debitService.getListDebit' });
        return new ServiceResponse(true, '', {});
    }
};

const _getFilterDebitIds = async (isOverDue, queryParams) => {
    if (isOverDue) {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PageSize', apiHelper.getItemsPerPage(queryParams))
            .input('PageIndex', apiHelper.getCurrentPage(queryParams))
            .input('KEYWORD', apiHelper.getSearch(queryParams))
            .input('PAYMENTSTATUS', apiHelper.getValueFromObject(queryParams, 'payment_status'))
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'from_date'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'to_date'))
            .execute('SL_DEBIT_GetPayDebitListNotPagination_AdminWeb');

        let item = data.recordset || [];

        if (item && item.length > 0) {
            item = _calculateStatus(item)
                ?.filter((_) => _.debit_status == isOverDue)
                ?.map((_) => _.debit_id);
        }
        return item;
    }
    return null;
};

const _calculateStatus = (data) => {
    return data.map((debit) => {
        let debit_status = DEBIT_STATUS.NONE;

        // calculate pay debit status
        if (debit.payment_expire_date) {
            if (debit.paid_time) {
                if (moment(debit.paid_time, 'DD/MM/YYYY').diff(moment(debit.payment_expire_date, 'DD/MM/YYYY')) <= 0) {
                    debit_status = DEBIT_STATUS.DONE;
                } else {
                    debit_status = DEBIT_STATUS.DONE_BUT_EXPIRED;
                }
            } else {
                if (moment().startOf('day').diff(moment(debit.payment_expire_date, 'DD/MM/YYYY')) <= 0) {
                    debit_status = DEBIT_STATUS.NOT_EXPIRED;
                } else {
                    debit_status = DEBIT_STATUS.EXPIRED;
                }
            }
        }

        return { ...debit, debit_status };
    });
};

const getById = async (id) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().input('DEPITID', id).execute('SL_DEBITDETAIL_GetList_AdminWeb');
        const item = data.recordset;
        return new ServiceResponse(true, 'oke', {
            items: debitClass.listPaymentSlip(item),
            page: 1,
            limit: 25,
            total: apiHelper.getTotalData(item),
        });
    } catch (e) {
        logger.error(e, { function: 'debitService.getById' });
        return new ServiceResponse(false, '', {});
    }
};

const exportExcel = async (queryParams = {}) => {
    try {
        const serviceRes = await getListPayDebit({
            ...queryParams,
            itemsPerPage: API_CONST.MAX_EXPORT_EXCEL,
        });
        if (serviceRes.isFailed()) {
            return new ServiceResponse(false, 'Lỗi xuất file excel.');
        }

        const { items } = serviceRes.getData();

        const dataExport = items.map((item) => ({
            ...item,
            total_money_by_ref_code: item?.purchase_order_invoice_id
                ? item?.purchase_order_total_money ?? 0
                : item?.purchase_order_id
                  ? item?.total_money ?? 0
                  : 0,
            total_money: item.total_money,
            total_amount: item.total_amount,
            total_paid: item.total_paid,
            debit_status: DEBIT_STATUS_EXPORT[item.debit_status],
            status_pay:
                item?.total_paid - item?.total_money >= 0
                    ? 'Đã thanh toán'
                    : (item?.total_paid ?? 0) === 0
                      ? 'Chưa thanh toán'
                      : 'Thanh toán một phần',
            debit_type: DEBIT_TYPE[item.debit_type ?? 2],
        }));

        const wb = new xl.Workbook();
        addSheetGetList({
            workbook: wb,
            sheetName: 'Danh sach cong no phai tra theo hoa don',
            header: {
                full_name: 'Đối tượng',
                invoice_code: 'Số hóa đơn',
                ref_code: 'Số Phiếu',
                total_money_by_ref_code: 'Số tiền cần trả theo số phiếu (đ)',
                total_money: 'Số tiền cần trả theo hóa đơn (đ)',
                total_paid: 'Đã thanh toán (đ)',
                total_amount: 'Công nợ (đ)',
                created_date: 'Ngày tạo',
                status_pay: 'Trạng thái thanh toán',
                payment_expire_date: 'Thời hạn thanh toán',
                debit_status: 'Trạng thái hạn công nợ',
                debit_type: 'Loại công nợ',
            },
            data: dataExport,
            indexHeaderMustBeNumber: [4, 5, 6, 7],
        });
        console.log('im here');
        return new ServiceResponse(true, '', wb);
    } catch (error) {
        logger.error(error, { function: 'debitService.exportExcel' });
        return new ServiceResponse(true, '', {});
    }
};

module.exports = {
    getListDebit,
    deleteDebit,
    getListPayDebit,
    getById,
    exportExcel,
};
