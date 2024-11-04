const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const customerSubscriberReportClass = require('./customer-subscriber-report.class');
const xl = require('excel4node');
const { addSheetGetList } = require('../../common/helpers/excel.helper');
const API_CONST = require('../../common/const/api.const');

const spName = {
    getList: 'CRM_EMAILSUBSCRIBER_GetList_AdminWeb',
    getListV2: 'CRM_CUS_SUBSCRIBER_REPORT_GetList_AdminWeb',
};

const getList = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getSearch(queryParams)?.trim();
        let is_use_voucher = apiHelper.getFilterBoolean(queryParams, 'is_use_voucher');
        if (is_use_voucher != 0 && is_use_voucher != 1) {
            is_use_voucher = null;
        }

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('KEYWORD', keyword)
            .input('TYPESEARCH', apiHelper.getValueFromObject(queryParams, 'type_search'))
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'created_date_from'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'created_date_to'))
            .input('ISORDERRED', apiHelper.getValueFromObject(queryParams, 'is_orderred'))
            .input('WFLOWID', apiHelper.getValueFromObject(queryParams, 'wflow_id'))
            .input('STAFFUSER', apiHelper.getValueFromObject(queryParams, 'staff_user'))
            .input('SUPERVISORNAME', apiHelper.getValueFromObject(queryParams, 'supervisor_user'))
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .input('ISUSED', is_use_voucher)
            .execute(spName.getListV2);

        const result = data.recordset;

        return new ServiceResponse(true, '', {
            data: customerSubscriberReportClass.list(data.recordset),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(result),
        });
    } catch (error) {
        logger.error(error, { function: 'customerSubscriberReportService.getList' });
        return new ServiceResponse(true, '', {});
    }
};

const exportExcel = async (queryParams = {}) => {
    try {
        const serviceRes = await getList({ ...queryParams, itemsPerPage: API_CONST.MAX_EXPORT_EXCEL });
        if (serviceRes.isFailed()) {
            return new ServiceResponse(false, 'Lỗi xuất file excel.');
        }

        const { data } = serviceRes.getData();
        const dataExport = data.map((item) => ({
            ...item,
            gender: item.gender === 1 ? 'Nam' : item.gender === 0 ? 'Nữ' : '-',
            is_active: item.is_active ? 'Kích hoạt' : 'Ẩn',
        }));

        const wb = new xl.Workbook();
        addSheetGetList({
            workbook: wb,
            sheetName: 'Danh sách khách hàng đăng kí nhận tin',
            header: {
                customer_name: 'Khách hàng nhận tin',
                email: 'Email',
                phone_number: 'Số điện thoại',
                gender: 'Giới tính',
                coupon_code: 'Mã giảm giá',
                created_user: 'Người tạo',
                created_date: 'Ngày tạo',
                is_active: 'Kích hoạt',
            },
            data: dataExport,
        });

        return new ServiceResponse(true, '', wb);
    } catch (error) {
        logger.error(error, { function: 'customerSubscriberReportService.exportExcel' });
        return new ServiceResponse(true, '', {});
    }
};

module.exports = {
    getList,
    exportExcel,
};
