const Queue = require('bull');
const mssql = require('../models/mssql');
const sql = require('mssql');
const apiHelper = require('../../app/common/helpers/api.helper');
const ServiceResponse = require('../../app/common/responses/service.response');
const logger = require('../common/classes/logger.class'); 
const xl = require('excel4node');
const { addSheet } = require('../modules/customer-lead/utils');
const customerLeadClass = require('../modules/customer-lead/customer-lead.class');

const CONFIG = {
    redis: {
        host: process.env.REDIS_URL,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PWD,
        connectTimeout: 30000 
    }
}
// Tạo hàng đợi
const insertExcelCustomerQueue = new Queue('insertExcelCustomerQueue', CONFIG);

// Worker xử lý công việc từ hàng đợi
insertExcelCustomerQueue.process(async (job, done) => {
    try {
        const res = await insertRecord(job.data);
        done(null, res)

    } catch (error) {
        done(new Error(`Error processing job: ${error.message}`));
    }
});

const getList = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);

        let taskStatus = apiHelper.getFilterBoolean(queryParams, 'task_status');
        if (!['ASSIGNED', 'IN_PROCESS', 'NOT_ASSIGNED'].includes(taskStatus)) {
            taskStatus = null;
        }

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('GENDER', apiHelper.getValueFromObject(queryParams, 'gender'))
            .input('SOURCEID', apiHelper.getValueFromObject(queryParams, 'source_id'))
            .input('WFLOWID', apiHelper.getValueFromObject(queryParams, 'wflow_id'))
            .input('INTERESTCONTENT', apiHelper.getValueFromObject(queryParams, 'interest_content'))
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'created_date_from'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'created_date_to'))
            .input('ISEXISTSEMAIL', apiHelper.getValueFromObject(queryParams, 'is_exists_email'))
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .input('CUSTOMERTYPEID', apiHelper.getValueFromObject(queryParams, 'customer_type_id'))
            .input('TASKSTATUS', taskStatus)
            .execute('CRM_CUSTOMERDATALEADS_GetList_AdminWeb');

        const customerLeads = data.recordset;

        return new ServiceResponse(true, '', {
            data: customerLeadClass.list(customerLeads),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(customerLeads),
        });
    } catch (error) {
        logger.error(error, { function: 'customerLeadService.getList' });
        return new ServiceResponse(true, '', {});
    }
};

const insertRecord = async (params) => {
    try {
        const serviceRes = await getList(params);
        const { data } = serviceRes.getData();

        const wb = new xl.Workbook();
        addSheet({
            workbook: wb,
            sheetName: 'Danh sách khách hàng tiềm năng',
            header: {
                data_leads_code: 'Mã khách hàng',
                full_name: 'Tên khách hàng tiềm năng',
                gender: 'Giới tính',
                birthday: 'Ngày sinh',
                phone_number: 'Số điện thoại',
                email: 'Email',
                address: 'Địa chỉ',
                zalo_id: 'Zalo ID',
                facebook_id: 'Facebook ID',
                affiliate: 'Affiliate',
            },
            data,
        });
        return wb.write('danh-sach-khach-hang-tiem-nang.xlsx');
        
    } catch (error) {
        logger.error(e, { function: 'queueCustomerLead.exportExcel' });
        return new ServiceResponse(true, '', {});
    }
}

module.exports = {
    insertExcelCustomerQueue
}