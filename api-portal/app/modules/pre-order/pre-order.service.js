const preOrderClass = require('./pre-order.class');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const { addSheetGetList } = require('../../common/helpers/excel.helper');
const xl = require('excel4node');
const API_CONST = require('../../common/const/api.const');

const getCustomerHisBuyIphone = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getSearch(queryParams);
        const type = apiHelper.getValueFromObject(queryParams, 'type', 'ip12');
        const is_update_14 = apiHelper.getValueFromObject(queryParams, 'is_update_14', false);
        const is_buy_accessory = apiHelper.getValueFromObject(queryParams, 'is_buy_accessory', false);
        const is_all = apiHelper.getValueFromObject(queryParams, 'is_all', 0);

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('KEYWORD', keyword?.trim())
            .input('TYPE', type)
            .input('ISUPDATEDIP14', is_update_14)
            .input('ISBUYACCESSORY', is_buy_accessory)
            .input('ISALL', is_all)
            .execute('CRM_CUSTOMER_HISBUYIP_GetList_AdminWeb');

        const lists = data.recordset;
        return new ServiceResponse(true, '', {
            data: preOrderClass.customers(lists),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(lists),
        });
    } catch (error) {
        logger.error(e, { function: 'pre-order.service.getCustomerBuyHisIp' });
        return new ServiceResponse(true, '', {});
    }
};

const getCustomerHisBuyIphone15 = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getSearch(queryParams);
        const type = apiHelper.getValueFromObject(queryParams, 'tab_active', 4);

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('KEYWORD', keyword)
            .input('TYPE', type)
            .execute('SL_PREORDER_GetList_AdminWeb');

        const lists = data.recordset;
        return new ServiceResponse(true, '', {
            data: preOrderClass.customersBuy15(lists),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(lists),
        });
    } catch (error) {
        logger.error(e, { function: 'pre-order.service.getCustomerHisBuyIphone15' });
        return new ServiceResponse(true, '', {});
    }
};

const getInterestCustomer = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getSearch(queryParams);
        const date_from = apiHelper.getValueFromObject(queryParams, 'date_from');
        const date_true = apiHelper.getValueFromObject(queryParams, 'date_to');
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('KEYWORD', keyword)
            .input('DATEFROM', date_from)
            .input('DATETO', date_true)
            .input('TASKSTATUS', apiHelper.getValueFromObject(queryParams, 'task_status'))
            .input('USERNAME', apiHelper.getValueFromObject(queryParams, 'staff_user'))
            .input('SUPERVISORNAME', apiHelper.getValueFromObject(queryParams, 'supervisor_user'))
            .input('INTERESTCONTENT', apiHelper.getValueFromObject(queryParams, 'interest_content'))
            .input('WFLOWID', apiHelper.getValueFromObject(queryParams, 'wflow_id'))
            .execute('CRM_ACCOUNT_INTEREST_GetList_AdminWeb');
        const lists = data.recordset;
        return new ServiceResponse(true, '', {
            data: preOrderClass.intertest_customers(lists),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(lists),
            meta: {
                all: data.recordsets[1][0]?.COUNTALL,
                count_assigned: data.recordsets[1][0]?.COUNTASSIGNED,
                count_in_process: data.recordsets[1][0]?.COUNTINPROCESS,
                count_completed: data.recordsets[1][0]?.COUNTCOMPLETED,
                count_not_assigned: data.recordsets[1][0]?.COUNTNOTASSIGNED,
            },
        });
    } catch (error) {
        logger.error(e, { function: 'pre-order.service.getCustomerInterest' });
        return new ServiceResponse(true, '', {});
    }
};

const exportExcel = async (queryParams = {}) => {
    try {
        const funcsGetListExport = {
            1: getCustomerHisBuyIphone,
            2: getInterestCustomer,
        };
        const typeExport = queryParams.type;
        queryParams.itemsPerPage = API_CONST.MAX_EXPORT_EXCEL;

        const serviceRes = await funcsGetListExport[typeExport](queryParams);
        if (serviceRes.isFailed()) {
            return new ServiceResponse(false, 'Lỗi xuất file excel.');
        }

        const { data } = serviceRes.getData();

        const dataExport = data.map((item) => ({
            ...item,
            gender: item.gender === 1 ? 'Nam' : item.gender === 0 ? 'Nữ' : '-',
        }));

        const headerDefault = {
            customer_code: 'Mã khách hàng',
            full_name: 'Tên khách hàng',
            phone_number: 'Số điện thoại',
            email: 'Email',
        };
        const objExcel = {
            1: {
                header: {
                    ...headerDefault,
                    gender: 'Giới tính',
                    birthday: 'Ngày sinh',
                },
                sheetName: 'mua Iphone',
            },
            2: {
                header: headerDefault,
                sheetName: 'quan tâm chương trình',
            },
        };
        const typeObjExcel = objExcel[typeExport];

        const wb = new xl.Workbook();
        addSheetGetList({
            workbook: wb,
            sheetName: `Danh sách khách hàng ${typeObjExcel.sheetName}`,
            header: typeObjExcel.header,
            data: dataExport,
        });

        return new ServiceResponse(true, '', wb);
    } catch (e) {
        logger.error(e, { function: 'preOrderService.exportPDF' });
        return new ServiceResponse(false, e.message || e);
    }
};

module.exports = {
    getCustomerHisBuyIphone,
    getInterestCustomer,
    getCustomerHisBuyIphone15,
    exportExcel,
};
