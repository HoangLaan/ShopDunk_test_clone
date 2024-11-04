const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const customerDepositClass = require('./customer-deposit.class');
const { addSheetGetList } = require('../../common/helpers/excel.helper');
const xl = require('excel4node');
const { formatCurrency } = require('../../common/helpers/numberFormat');
const API_CONST = require('../../common/const/api.const');

const getList = async (queryParams = {}) => {
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
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'created_date_from'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'created_date_to'))
            .input('PAYMENTTYPE', apiHelper.getValueFromObject(queryParams, 'payment_type'))
            .input('PAYMENTSTATUS', apiHelper.getValueFromObject(queryParams, 'payment_status'))
            .input('ISDELIVERYTYPE', apiHelper.getValueFromObject(queryParams, 'is_delivery_type'))
            .input('WFLOWID', apiHelper.getValueFromObject(queryParams, 'wflow_id'))
            .input('STAFFUSER', apiHelper.getValueFromObject(queryParams, 'staff_user'))
            .input('SUPERVISORNAME', apiHelper.getValueFromObject(queryParams, 'supervisor_user'))
            .input('INTERESTCONTENT', apiHelper.getValueFromObject(queryParams, 'interest_content'))
            .input('TASKSTATUS', apiHelper.getValueFromObject(queryParams, 'task_status'))
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .input('ISEXPORT', apiHelper.getFilterBoolean(queryParams, 'is_export'))
            .execute('SL_PREORDER_GetListCustomerDeposit_AdminWeb');

        const result = data.recordset;

        const _result = (customerDepositClass.list(result) || []).map((item) => {
            let address;
            if (item?.pre_address_detail) {
                address = item?.pre_address_detail;
            } else if (item?.pre_receive_store_name) {
                address = `ShopDunk - ${item?.pre_receive_store_name}`;
            } else {
                address = item?.address_detail
                    ? `ShopDunk - ${item?.address_detail}`
                    : item?.receive_address || item?.pre_address_detail;
            }
            return {
                ...item,
                address,
            };
        });

        return new ServiceResponse(true, '', {
            data: _result,
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(result),
            meta: {
                all: data.recordsets[1][0]?.COUNTALL,
                count_assigned: data.recordsets[1][0]?.COUNTASSIGNED,
                count_in_process: data.recordsets[1][0]?.COUNTINPROCESS,
                count_completed: data.recordsets[1][0]?.COUNTCOMPLETED,
                count_not_assigned: data.recordsets[1][0]?.COUNTNOTASSIGNED,
            },
        });
    } catch (error) {
        logger.error(error, { function: 'customerDepositService.getList' });
        return new ServiceResponse(true, '', {});
    }
};

const exportExcel = async (queryParams = {}) => {
    try {
        const serviceRes = await getList({
            ...queryParams,
            page: 1,
            is_export: 1,
            itemsPerPage: API_CONST.MAX_EXPORT_EXCEL,
        });
        if (serviceRes.isFailed()) {
            return new ServiceResponse(false, 'Lỗi xuất file excel.');
        }

        const { data } = serviceRes.getData();

        const wb = new xl.Workbook();
        addSheetGetList({
            workbook: wb,
            sheetName: 'Danh sách khách hàng đặt cọc',
            header: {
                customer_name: 'Khách hàng đặt cọc',
                order_no: 'Mã đơn hàng',
                pre_order_no: 'Mã đặt cọc',
                transfer_amount: 'Số tiền đặt cọc',
                pre_created_date_text: 'Ngày đặt cọc',
                product_name: 'Tên sản phẩm',
                phone_number: 'Số điện thoại',
                email: 'Email',
                last_payment_time: 'Thời gian thanh toán cuối cùng',
                payment_type: 'Hình thức',
                store_name: 'Cửa hàng',
                address: 'Địa chỉ nhận hàng',
            },
            data,
        });

        return new ServiceResponse(true, '', wb);
    } catch (error) {
        logger.error(error, { function: 'customerDepositService.exportExcel' });
        return new ServiceResponse(true, '', {});
    }
};

const updateCall = async (body) => {
    try {
        const authName = apiHelper.getValueFromObject(body, 'auth_name', 'administrator');

        const pool = await mssql.pool;
        const createOrUpdateResult = await pool
            .request()
            .input('PREORDERID', apiHelper.getValueFromObject(body, 'pre_order_id'))
            .input('ISCALL', apiHelper.getValueFromObject(body, 'is_call'))
            .execute('SL_PREORDER_UpdateCall_AdminWeb');

        const idResult = createOrUpdateResult.recordset[0].RESULT;
        if (!idResult) {
            return new ServiceResponse(false, 'Lỗi lưu lịch sử chăm sóc');
        }
        return new ServiceResponse(true, 'Lưu lịch sử chăm sóc thành công', {});
    } catch (e) {
        logger.error(e, { function: 'customerDepositService.updateCall' });
        return new ServiceResponse(false, e.message);
    }
};

module.exports = {
    getList,
    exportExcel,
    updateCall,
};
