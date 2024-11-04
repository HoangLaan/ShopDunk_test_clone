const orderClass = require('./booking-care.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const moment = require('moment');
const pdfHelper = require('../../common/helpers/pdf.helper');
const qrHelper = require('../../common/helpers/qr.helper');
let xl = require('excel4node');
const API_CONST = require('../../common/const/api.const');
const _ = require('lodash');
const { formatCurrency } = require('../../common/helpers/numberFormat');
const { convertErrorCode, checkMinMax, getValueInArrayInArray, getValueAndConcatInArrayByField } = require('./ultils');
const { orderType, PAYMENT_STATUS, PAYMENT_TYPE } = require('./ultils/constants');
const { checkJsonByArrayKey } = require('./utils');
const { description } = require('joi');

/**
 * Get list
 *
 * @param queryParams
 * @returns ServiceResponse
 */
// create or update
const createOrUpdateBooking = async (bodyParams) => {
    const pool = await mssql.pool;
    const transaction = new sql.Transaction(pool);
    await transaction.begin();
    const booking_id_param = apiHelper.getValueFromObject(bodyParams, 'booking_id');

    try {
        const appointment_status = apiHelper.getValueFromObject(bodyParams, 'appointment_status');
        let care_service_id = apiHelper.getValueFromObject(bodyParams, 'care_service_id');
        let care_service_code = apiHelper.getValueFromObject(bodyParams, 'care_service_code');
        let member_id = apiHelper.getValueFromObject(bodyParams, 'member_id');
        let store_id = apiHelper.getValueFromObject(bodyParams, 'store_id');
        let customerdatalead_id = apiHelper.getValueFromObject(bodyParams, 'customerdatalead_id');
        let imei = apiHelper.getValueFromObject(bodyParams, 'imei');
        let product_category_id = apiHelper.getValueFromObject(bodyParams, 'product_category_id');
        let customer_name = apiHelper.getValueFromObject(bodyParams, 'customer_name');
        let customer_phone = apiHelper.getValueFromObject(bodyParams, 'customer_phone');
        let customer_email = apiHelper.getValueFromObject(bodyParams, 'customer_email');
        let created_user = apiHelper.getValueFromObject(bodyParams, 'created_user');
        let approvaluser = apiHelper.getValueFromObject(bodyParams, 'approvaluser');
        let description = apiHelper.getValueFromObject(bodyParams, 'description');
        // convert time
        let expected_start_time_form = apiHelper.getValueFromObject(bodyParams, 'expected_start_time_form');
        let expected_start_time_to = apiHelper.getValueFromObject(bodyParams, 'expected_start_time_to');
        let expected_date = apiHelper.getValueFromObject(bodyParams, 'expected_date');

        expected_start_time_form = moment.utc(expected_start_time_form, 'hh:mm A DD/MM/YYYY').toDate();
        expected_start_time_to = moment.utc(expected_start_time_to, 'hh:mm A DD/MM/YYYY').toDate();
        expected_date = moment.utc(expected_date, 'DD/MM/YYYY').toDate();



        const requestCreateOrUpdateOrder = new sql.Request(transaction);
        const data = await requestCreateOrUpdateOrder
            .input('APPOINTMENTSCHEDULEID', booking_id_param)
            .input('APPOINTMENTSCHEDULENO', apiHelper.getValueFromObject(bodyParams, 'booking_no'))
            .input('CARESERVICEID', care_service_id)
            .input('CARESERVICECODE', care_service_code)
            .input('MEMBERID', member_id)
            .input('STOREID', store_id)
            .input('CUSTOMERDATALEADSID', customerdatalead_id)
            .input('PRODUCTCATEGORYID', product_category_id)
            .input('IMEI', imei)
            .input('APPOINTMENTSTATUS', appointment_status)
            .input('CUSTOMER_NAME', customer_name)
            .input('CUSTOMER_PHONE', customer_phone)
            .input('CUSTOMER_EMAIL', customer_email)
            //.input('CREATEDUSER', created_user)
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .input('APPROVALUSER', approvaluser)
            .input('DESCRIPTION', description)
            .input('EXPECTEDSTARTTIMEFROM', expected_start_time_form)
            .input('EXPECTEDSTARTTIMETO', expected_start_time_to)
            .input('EXPECTEDDATE', expected_date)

            .execute('SL_APOIMENTSCHEDULE_CreateOrUpdate_AdminWeb');
        // const booking_id_result = data.recordset[0].RESULT;
        // const recordset = data.recordset;
        console.log(data);

        await transaction.commit();
        return new ServiceResponse(true, 'thành công', {});
    } catch (e) {
        logger.error(e, {});
        await transaction.rollback();
        return new ServiceResponse(false, RESPONSE_MSG.BOOKING.CREATE_FAILED);
    }
};

//get list
const getListBooking = async (queryParams = {}, bodyParams) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getSearch(queryParams);
        const pool = await mssql.pool;
        // data.expected_start_time_form = moment.utc(data.expected_start_time_form).format('HH:00 A DD/MM/YYYY');
        // data.expected_start_time_to = moment.utc(data.expected_start_time_to).format('HH:00 A DD/MM/YYYY');

        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('KEYWORD', keyword?.trim())
            .input('CARESERVICEID', apiHelper.getValueFromObject(queryParams, 'care_service_id'))
            .input('MEMBERID', apiHelper.getValueFromObject(queryParams, 'member_id'))
            .input('CUSTOMERDATALEADSID', apiHelper.getValueFromObject(queryParams, 'customerdatalead_id'))
            .input('APPOINTMENTSTATUS', apiHelper.getValueFromObject(queryParams, 'appointment_status'))
            .input('CREATEDDATE', apiHelper.getValueFromObject(queryParams, 'created_date'))
            .input('APPOINTMENTSCHEDULENO', apiHelper.getValueFromObject(bodyParams, 'booking_no'))
            .input('STOREID', apiHelper.getValueFromObject(queryParams, 'store_id'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(queryParams, 'description'))
            .input('USERNAME', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('SL_APPOINTMENTSCHEDULE_GetList_AdminWeb');
        let booking = orderClass.list(data.recordset);
        const totalItem = data.recordset && data.recordset.length ? data.recordset[0].TOTAL : 0;
        console.log('tt', totalItem);
        // console.log(booking, "=)))" );

        return new ServiceResponse(true, '', {
            //data: orderClass.list(booking),
            data: booking,
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordset),
            //total: data.recordset.length,
        });

    } catch (e) {
        logger.error(e, { function: 'orderService.getListOrder' });
        return new ServiceResponse(true, '', {});
    }
};

//DETAIL
const detail = async (bookingId) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('APPOINTMENTSCHEDULEID', bookingId)
            .execute('SL_APPOINTMENTSCHEDULE_GetById_AdminWeb');
        let dataRes = orderClass.detail(data.recordsets[0][0]);
        // convert time
        dataRes.expected_start_time_form = moment.utc(dataRes.expected_start_time_form).format('HH:mm A DD/MM/YYYY');
        dataRes.expected_start_time_to = moment.utc(dataRes.expected_start_time_to).format('HH:mm A DD/MM/YYYY');
        dataRes.expected_date = moment.utc(dataRes.expected_date).format('DD/MM/YYYY');
        dataRes.approvaldate = moment.utc(dataRes.approvaldate).format('DD/MM/YYYY');
        return new ServiceResponse(true, '', dataRes);

    } catch (e) {
        logger.error(e, { function: 'workScheduleService.detail' });
        return new ServiceResponse(false, e.message);
    }
};

const getParentsGroupServices = async () => {
    try {
        const pool = await mssql.pool;
        const res = await pool
            .request()
            .execute('[MD_CARESERVICE_GetListByName_ADminWeb]');

        //let result = res.recordsets[0];
        let result = orderClass.GroupServices(res.recordset);

        if (result) {
            return new ServiceResponse(true, '', result);
        } else {
            return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
        }
    } catch (error) {
        logger.error(error, { function: 'getParentsGroupServices' });
        return new ServiceResponse(false, error, []);
    }
}


const getListStoreByUser = async (bodyParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(bodyParams);
        // Set a default value for itemsPerPage if it's not provided in bodyParams
        const itemsPerPage = bodyParams.pageSize || 50; // Adjust the default value as per your requirement
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('KEYWORD', apiHelper.getValueFromObject(bodyParams, 'search'))
            .execute('SL_GetListStore_SDCAREWEB');
        return new ServiceResponse(true, '', { items: orderClass.optionStore(data.recordset) });
    } catch (e) {
        logger.error(e, { function: 'orderyService.getListStoreByUser' });
        return new ServiceResponse(true, '', []);
    }
};


const getListCareService = async (queryParams, bodyParams) => {
    console.log('queryParams:', queryParams);
    try {
        const pool = await mssql.pool;
        const resData = await pool
            .request()
            //.input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'search')?.trim())
            .input('CARESERVICEID', apiHelper.getValueFromObject(queryParams, 'care_service_id')) // add, edit, view, delete
            //.input('USERNAME', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('MD_CARESERVICE_GetListName_AdminWeb');
        if (!resData || !resData.recordset) {
            return new ServiceResponse(false, 'Lấy danh sách CARESERVICE thất bại !');
        }

        const data = resData.recordset;
        return new ServiceResponse(true, '', orderClass.orderType(data));
    } catch (e) {
        logger.error(e, { function: 'orderService.getListOrderType' });
        return new ServiceResponse(false, 'Lấy danh sách CARESERVICE thất bại !');
    }
};

const getListCustomer = async (queryParams) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams, 50);
        const keyword = apiHelper.getSearch(queryParams).trim();
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('KEYWORD', keyword)
            .input('CUSTOMERID', apiHelper.getValueFromObject(queryParams, 'customer_id'))
            .input('CUSTOMERTYPE', apiHelper.getValueFromObject(queryParams, 'customer_type'))
            .execute('SL_ORDER_getListCustomer_AdminWeb');

        // const Account = data.recordsets[0];
        const customers = data.recordset;
        return new ServiceResponse(true, '', {
            data: orderClass.customerList(customers),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(customers),
        });
    } catch (e) {
        logger.error(e, {
            function: 'orderService.getListCustomer',
        });
        return new ServiceResponse(true, '', {});
    }
};

// const createOrderNo = async () => {
//     try {
//         const pool = await mssql.pool;
//         const data = await pool.request().execute('SL_APPOINTMENTSCHEDULE_GenOrderNo_AdminWeb');
//         return new ServiceResponse(true, '', data.recordset[0].ORDERNO);
//     } catch (e) {
//         logger.error(e, { function: 'orderService.createOrderNo' });
//         return new ServiceResponse(true, '', '');
//     }
// };

//Delete
const deleteBooking = async (bookingId, bodyParams) => {
    try {
        const pool = await mssql.pool;
        await pool
            .request()
            .input('APPOINTMENTSCHEDULEID', bookingId)
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('SL_APPOINTMENTSCHEDULE_DeleteById_AdminWeb');
        return new ServiceResponse(true, RESPONSE_MSG.BOOKING.DELETE_SUCCESS, '');
    } catch (e) {
        logger.error(e, { function: 'orderService.deleteBooking' });
        return new ServiceResponse(false, e.message);
    }
};

const exportExcel = async (body) => {
    try {
        const params = {
            ...body,
            itemsPerPage: API_CONST.MAX_EXPORT_EXCEL,
        };
        const serviceRes = await getListBooking(params);
        const { data } = serviceRes.getData();


        // Create a new instance of a Workbook class
        const wb = new xl.Workbook();

        // Add Worksheets to the workbook
        const ws = wb.addWorksheet('Danh sách đặt lịch', {});

        // Set column widths
        ws.column(1).setWidth(30);
        ws.column(2).setWidth(20);
        ws.column(3).setWidth(50);
        ws.column(4).setWidth(20);
        ws.column(5).setWidth(20);
        ws.column(6).setWidth(30);
        ws.column(7).setWidth(30);
        ws.column(8).setWidth(20);
        ws.column(9).setWidth(30);
        ws.column(10).setWidth(20);
        ws.column(11).setWidth(30);

        const header = {
            store_name: 'Trung tâm',
            booking_no: 'Mã đặt lịch',
            care_service_name: 'Tên dịch vụ',
            customer_name: 'Tên khách hàng',
            customer_phone: 'Số điện thoại',
            customer_email: 'Email',
            expected_combined: 'Ngày và giờ dự kiến',
            imei: 'Imei/ Serial',
            description: 'Ghi chú',
            approvaluser: 'Người duyệt',
            created_date: 'Ngày tạo',
            
        };

        // Define header style
        const headerStyle = wb.createStyle({
            font: {
                bold: true,
                color: '#FFFFFF',
            },
            alignment: {
                horizontal: 'center',
            },
            fill: {
                type: 'pattern',
                patternType: 'solid',
                fgColor: '#1A3C40',
            },
        });

        // Set header row values and apply header style
        const headerKeys = Object.keys(header);
        headerKeys.forEach((key, colIndex) => {
            ws.cell(1, colIndex + 1).string(header[key]).style(headerStyle);
        });

        // Add data to worksheet, starting from the second row
        data.forEach((item, index) => {
            const indexRow = index + 2; // Adjusting for header row
            // Convert and combine expected_date, expected_start_time_form, and expected_start_time_to into one string
            const formattedDate = item.expected_date ? moment(item.expected_date).format('DD/MM/YYYY') : '';
            const formattedStartTime = item.expected_start_time_form ? moment.utc(item.expected_start_time_form).format('HH:mm') : '';
            const formattedEndTime = item.expected_start_time_to ? moment.utc(item.expected_start_time_to).format('HH:mm') : '';
            const expectedCombined = `${formattedStartTime} - ${formattedEndTime} - ${formattedDate}`;

                        
            let indexCol = 0;
            ws.cell(indexRow, ++indexCol).string((item.store_name || '').toString());
            ws.cell(indexRow, ++indexCol).string((item.booking_no || '').toString());
            ws.cell(indexRow, ++indexCol).string((item.care_service_name || '').toString());
            ws.cell(indexRow, ++indexCol).string((item.customer_name || '').toString());
            ws.cell(indexRow, ++indexCol).string((item.customer_phone || '').toString());
            ws.cell(indexRow, ++indexCol).string((item.customer_email || '').toString());
            ws.cell(indexRow, ++indexCol).string(expectedCombined.trim());
            ws.cell(indexRow, ++indexCol).string((item.imei || '').toString());
            ws.cell(indexRow, ++indexCol).string((item.description || '').toString());
            ws.cell(indexRow, ++indexCol).string((item.approvaluser || '').toString());
            ws.cell(indexRow, ++indexCol).string(item.created_date ? moment(item.created_date).format('DD/MM/YYYY') : '');

            
        });

        return new ServiceResponse(true, '', wb);
    } catch (e) {
        logger.error(e, { function: 'customerCareService.exportExcel' });
        return new ServiceResponse(false, '', {});
    }
};

module.exports = {
    exportExcel,
    // createOrderNo,
    getListCustomer,
    createOrUpdateBooking,
    getListBooking,
    detail,
    deleteBooking,
    getParentsGroupServices,
    getListCareService,
    getListStoreByUser,
};
