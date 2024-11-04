const orderClass = require('./comment-care.class');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const { formatCurrency } = require('../../common/helpers/numberFormat');
const { convertErrorCode, checkMinMax, getValueInArrayInArray, getValueAndConcatInArrayByField } = require('./ultils');
const { orderType, PAYMENT_STATUS, PAYMENT_TYPE } = require('./ultils/constants');
const { checkJsonByArrayKey } = require('./utils');
const { description } = require('joi');
let xl = require('excel4node');
const API_CONST = require('../../common/const/api.const');

// Listing
const getListComment = async (queryParams = {}, bodyParams) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = 20;
        const keyword = apiHelper.getSearch(queryParams);
        const pool = await mssql.pool;
        console.log('keyword', keyword)
        console.log('itemsPerPage', itemsPerPage)
        console.log('currentPage', currentPage)
        console.log('comment_status', apiHelper.getValueFromObject(queryParams, 'comment_status'))
        console.log('from_date', apiHelper.getValueFromObject(queryParams, 'from_date'))
        console.log('to_date', apiHelper.getValueFromObject(queryParams, 'to_date'))
        const data = await pool
            .request()
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('KEYWORD', keyword?.trim())
            .input('COMMENTSTATUS', apiHelper.getValueFromObject(queryParams, 'comment_status'))
            .input('EXPECTEDSTARTTIMEFROM', apiHelper.getValueFromObject(queryParams, 'from_date'))
            .input('EXPECTEDSTARTTIMETO', apiHelper.getValueFromObject(queryParams, 'to_date'))
            .input('RATING', apiHelper.getValueFromObject(queryParams, 'rating'))
            .execute('SL_COMMENT_GetList_AdminWeb');

        return new ServiceResponse(true, '', {
            //data: orderClass.list(comment),
            data: data.recordset,
            page: currentPage,
            limit: itemsPerPage,
            //total: totalItem,
            total: data.recordset.length,
        });
    } catch (e) {
        logger.error(e, { function: 'listing' });
        return new ServiceResponse(true, '', {});
    }
};

// Detail
const details = async (id) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().input('CUSTOMERCOMMENTID', id).execute('SL_COMMENT_GetById_AdminWeb');

        return new ServiceResponse(true, '', data.recordsets[0][0]);
    } catch (e) {
        logger.error(e, { function: 'workScheduleService.detail' });
        return new ServiceResponse(false, e.message);
    }
};

// Change status
const changeStatus = async (customerCommentId, authId, isApproved) => {
    try {
        const pool = await mssql.pool;
        await pool
            .request()
            .input('CUSTOMERCOMMENTID', customerCommentId)
            .input('ISAPPROVED', isApproved)
            .input('UPDATEDUSER', authId)
            .execute('SL_COMMENT_UpdateStatus_AdminWeb');

        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, { function: 'changeStatus' });

        return new ServiceResponse(false);
    }
};

const exportExcel = async (body) => {
    try {
        const params = {
            ...body,
            itemsPerPage: API_CONST.MAX_EXPORT_EXCEL,
        };
        const serviceRes = await getListComment(params);
        const { data } = serviceRes.getData();

        // Create a new instance of a Workbook class
        const wb = new xl.Workbook();

        // Add Worksheets to the workbook
        const ws = wb.addWorksheet('Danh sách đánh giá', {});

        // Set width
        ws.column(1).setWidth(20);
        ws.column(2).setWidth(20);
        ws.column(3).setWidth(20);
        ws.column(4).setWidth(20);
        ws.column(5).setWidth(20);
        ws.column(6).setWidth(20);

        const header = {
            FULLNAME: 'Tên khách hàng',
            PHONENUMBER: 'Số điện thoại',
            CARESERVICENAME: 'Dịch vụ sử dụng',
            APPROVALSTATUS: 'Trạng thái duyệt',
            RATING: 'Rating',
            CREATEDDATE: 'Ngày đánh giá',
            APPOINTMENTSCHEDULENO: 'Mã đặt hẹn',
            APPROVALUSER: 'Người xét duyệt',
            APPROVALDATE: 'Ngày xét duyệt',
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

        data.forEach((item, index) => {
            let indexRow = index + 1;
            let indexCol = 0;
            ws.cell(indexRow, ++indexCol).string((item.FULLNAME || '').toString());
            ws.cell(indexRow, ++indexCol).string((item.PHONENUMBER || '').toString());
            ws.cell(indexRow, ++indexCol).string((item.CARESERVICENAME || '').toString());
            ws.cell(indexRow, ++indexCol).string((item.APPROVALSTATUS || '').toString());
            ws.cell(indexRow, ++indexCol).string((item.RATING || '').toString());
            ws.cell(indexRow, ++indexCol).string((item.CREATEDDATE || '').toString());
            ws.cell(indexRow, ++indexCol).string((item.APPOINTMENTSCHEDULENO || '').toString());
            ws.cell(indexRow, ++indexCol).string((item.APPROVALUSER || '').toString());
            ws.cell(indexRow, ++indexCol).string((item.APPROVALDATE || '').toString());
        });

        return new ServiceResponse(true, '', wb);
    } catch (e) {
        logger.error(e, { function: 'customerCareService.exportExcel' });
        return new ServiceResponse(true, '', {});
    }
};

module.exports = {
    getListComment,
    details,
    changeStatus,
    exportExcel,
};
