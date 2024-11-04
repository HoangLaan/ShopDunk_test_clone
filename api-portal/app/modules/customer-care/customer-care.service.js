const sql = require('mssql');
const mssql = require('../../models/mssql');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const customerCareClass = require('./customer-care.class');
const apiHelper = require('../../common/helpers/api.helper');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const API_CONST = require('../../common/const/api.const');
const xl = require('excel4node');


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
            .input('ISACTIVE', apiHelper.getValueFromObject(queryParams, 'is_active'))
            .input('FROMBIRTHDAY', apiHelper.getValueFromObject(queryParams, 'from_birthday'))
            .input('TOBIRTHDAY', apiHelper.getValueFromObject(queryParams, 'to_birthday'))
            .input('CUSTOMERTYPEID', apiHelper.getValueFromObject(queryParams, 'customer_type_id'))
            .input('GENDER', apiHelper.getValueFromObject(queryParams, 'gender'))
            .input('SOURCEID', apiHelper.getValueFromObject(queryParams, 'source_id'))
            .input('SEARCHTYPE', apiHelper.getValueFromObject(queryParams, 'search_type'))
            .input('NOCAREDAYSFROM', apiHelper.getValueFromObject(queryParams, 'no_care_days_from'))
            .input('NOCAREDAYSTO', apiHelper.getValueFromObject(queryParams, 'no_care_days_to'))
            .input('ORDERCOUNTFROM', apiHelper.getValueFromObject(queryParams, 'order_count_from'))
            .input('ORDERCOUNTTO', apiHelper.getValueFromObject(queryParams, 'order_count_to'))
            .input('TOTALMONEYFROM', apiHelper.getValueFromObject(queryParams, 'total_money_from'))
            .input('TOTALMONEYTO', apiHelper.getValueFromObject(queryParams, 'total_money_to'))
            .input('BUYFROM', apiHelper.getValueFromObject(queryParams, 'buy_from'))
            .input('BUYTO', apiHelper.getValueFromObject(queryParams, 'buy_to'))
            .input('POINTFROM', apiHelper.getValueFromObject(queryParams, 'point_from'))
            .input('POINTTO', apiHelper.getValueFromObject(queryParams, 'point_to'))
            .input('DAYSSINCELASTORDERFROM', apiHelper.getValueFromObject(queryParams, 'days_since_last_order_from'))
            .input('DAYSSINCELASTORDERTO', apiHelper.getValueFromObject(queryParams, 'days_since_last_order_to'))
            .input('TASKSTATUS', apiHelper.getValueFromObject(queryParams, 'task_status'))
            .input('HOBBIESID', apiHelper.getValueFromObject(queryParams, 'hobbies_id'))
            .execute('CRM_CUSTOMERCARE_GetList_AdminWeb');

        const result = data.recordset;

        return new ServiceResponse(true, '', {
            data: customerCareClass.list(result),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(result),
        });
    } catch (e) {
        logger.error(e, { function: 'customerCareService.getList' });
        return new ServiceResponse(true, '', {});
    }
};

const exportExcel = async (body) => {
    try {
        const params = {
          ...body,
          itemsPerPage: API_CONST.MAX_EXPORT_EXCEL,
        }
        const serviceRes = await getList(params);
        const { data } = serviceRes.getData();

        // Create a new instance of a Workbook class
        const wb = new xl.Workbook();

        // Add Worksheets to the workbook
        const ws = wb.addWorksheet('Danh sách chăm sóc khách hàng', {});

        // Set width
        ws.column(1).setWidth(20);
        ws.column(2).setWidth(20);
        ws.column(3).setWidth(20);
        ws.column(4).setWidth(20);
        ws.column(5).setWidth(20);
        ws.column(6).setWidth(20);
        ws.column(7).setWidth(20);
        ws.column(8).setWidth(20);
        ws.column(9).setWidth(20);
        ws.column(10).setWidth(20);

        const header = {
            customer_code: 'Mã khách hàng',
            full_name: 'Tên khách hàng',
            gender_text: 'Giới tính',
            birthday: 'Ngày sinh',
            phone_number: 'Số điện thoại',
            address: 'Địa chỉ',
            customer_type_name: 'Loại khách hàng',
            source_name: 'Nguồn khách hàng',
            order_count: 'Số lần mua',
            product_order_count: 'Số lượng sản phẩm đã mua',
        };

        data.unshift(header);

        // Define header style
        const headerStyle = wb.createStyle({
            font: {
                bold: true,
                color: '#FFFFFF',
            },
            fill: {
                type: 'pattern',
                patternType: 'solid',
                fgColor: '#1A3C40',
            },
        });

        // Set header row values and apply header style
        ws.cell(1, 1).style(headerStyle);
        ws.cell(1, 2).style(headerStyle);
        ws.cell(1, 3).style(headerStyle);
        ws.cell(1, 4).style(headerStyle);
        ws.cell(1, 5).style(headerStyle);
        ws.cell(1, 6).style(headerStyle);
        ws.cell(1, 7).style(headerStyle);
        ws.cell(1, 8).style(headerStyle);
        ws.cell(1, 9).style(headerStyle);
        ws.cell(1, 10).style(headerStyle);

        data.forEach((item, index) => {
            let indexRow = index + 1;
            let indexCol = 0;
            ws.cell(indexRow, ++indexCol).string((item.customer_code || '').toString());
            ws.cell(indexRow, ++indexCol).string((item.full_name || '').toString());
            ws.cell(indexRow, ++indexCol).string((item.gender_text || '').toString());
            ws.cell(indexRow, ++indexCol).string((item.birthday || '').toString());
            ws.cell(indexRow, ++indexCol).string((item.phone_number || '').toString());
            ws.cell(indexRow, ++indexCol).string((item.address || '').toString());
            ws.cell(indexRow, ++indexCol).string((item.customer_type_name || '').toString());
            ws.cell(indexRow, ++indexCol).string((item.source_name || '').toString());
            ws.cell(indexRow, ++indexCol).string((item.order_count || '').toString());
            ws.cell(indexRow, ++indexCol).string((item.product_order_count || '').toString());
        });

        return new ServiceResponse(true, '', wb);
    } catch (e) {
        logger.error(e, { function: 'customerCareService.exportExcel' });
        return new ServiceResponse(true, '', {});
    }
};

module.exports = {
    getList,
    exportExcel,
};
