const apiHelper = require('../../common/helpers/api.helper');
const sql = require('mssql');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const moduleClass = require('./customer-of-task.class');
const xl = require('excel4node');
const API_CONST = require('../../common/const/api.const');
const { getCurrentDateTimeFormat } = require('../../common/helpers/datetime.helper');

const getCustomerOfTaskList = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getValueFromObject(queryParams, 'search');
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('KEYWORD', keyword)
            .input('TASKTYPEID', apiHelper.getValueFromObject(queryParams, 'task_type_id'))
            .input('CUSTOMERTYPEID', apiHelper.getValueFromObject(queryParams, 'customer_type_id'))
            .input('SOURCEID', apiHelper.getValueFromObject(queryParams, 'source_id'))
            .input('TASKID', apiHelper.getValueFromObject(queryParams, 'task_id'))
            .input('STOREID', apiHelper.getValueFromObject(queryParams, 'store_id'))
            .input('TASKWORKFLOWID', apiHelper.getValueFromObject(queryParams, 'task_work_flow_id'))
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'created_date_from'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'created_date_to'))
            .input('BIRTHDAYDATEFROM', apiHelper.getValueFromObject(queryParams, 'birthday_date_from'))
            .input('BIRTHDAYDATETO', apiHelper.getValueFromObject(queryParams, 'birthday_date_to'))
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('USERNAME', apiHelper.getValueFromObject(queryParams, 'auth_name')) 
            .input('ISACTIVE', apiHelper.getValueFromObject(queryParams, 'is_active'))
            .execute('CRM_CUSTOMEROFTASK_GetList_AdminWeb');

        const totalItem = data.recordset ? data.recordset[0].TotalRecords : 0; 

        const items = data.recordset.map((item) => {
            const taskWorkflowJson = JSON.parse(`[${item.TASKWORKFLOW}]`);
            const transformedTaskWorkflow = taskWorkflowJson.map((workflow) => ({
                value: workflow.TASKWORKFLOWID,
                label: workflow.WORKFLOWNAME,
            }));
            return {
                ...item,
                TASKWORKFLOW: transformedTaskWorkflow,
            };
        });

        return new ServiceResponse(true, '', {
            data: moduleClass.customerOfTaskList(items),
            page: currentPage,
            limit: itemsPerPage,
            total: totalItem,
        });
    } catch (e) {
        console.log(e);
        logger.error(e, { function: 'TaskService.getCustomerOfTaskList' });
        return new ServiceResponse(true, '', {});
    }
};

const createCustomerOfTask = async (bodyParams) => {
    const pool = await mssql.pool;
    const transaction = new sql.Transaction(pool);
    try {
        await transaction.begin();
        const request = new sql.Request(transaction);
        const storeId = apiHelper.getValueFromObject(bodyParams, 'store_id');
        const authname = apiHelper.getValueFromObject(bodyParams, 'auth_name');
        const fullname = apiHelper.getValueFromObject(bodyParams, 'full_name');

        let transferdate = null;
        let transferuser = null;
        if (storeId) {
            const getCurrentTime = getCurrentDateTimeFormat();
            if (getCurrentTime) {
                transferdate = getCurrentTime;
            }
            // transferuser = `${authname} - ${fullname}`;
            transferuser = authname;
        }

        const res = await request
            .input('TASKDETAILID', apiHelper.getValueFromObject(bodyParams, 'task_detail_id'))
            .input('DATALEADSID', apiHelper.getValueFromObject(bodyParams, 'dataleads_id'))
            .input('MEMBERID', apiHelper.getValueFromObject(bodyParams, 'member_id'))
            .input('INTERESTCONTENT', apiHelper.getValueFromObject(bodyParams, 'description'))
            .input('TASKWORKFLOWID', apiHelper.getValueFromObject(bodyParams, 'task_work_flow_id'))
            .input('STOREID', apiHelper.getValueFromObject(bodyParams, 'store_id'))
            .input('SOURCEID', apiHelper.getValueFromObject(bodyParams, 'source_id'))
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('CREATEDUSER', authname)
            .input('TRANSFERDATE', transferdate)
            .input('TRANSFERUSER', transferuser)
            .execute('CRM_CUSTOMEROFTASK_Create_AdminWeb');
        const task_detail_id = res.recordset[0].RESULT;

        if (!task_detail_id) {
            await transaction.rollback();
            return ServiceResponse(false, 'failed');
        }

        const createCareComment = new sql.Request(transaction);
        const createCareCommentResData = await createCareComment
            .input('TASKDETAILID', apiHelper.getValueFromObject(bodyParams, 'task_detail_id') || task_detail_id)
            .input('MEMBERID', apiHelper.getValueFromObject(bodyParams, 'member_id'))
            .input('DATALEADSID', apiHelper.getValueFromObject(bodyParams, 'dataleads_id'))
            .input('WORKFLOWID', apiHelper.getValueFromObject(bodyParams, 'task_work_flow_id'))
            .input('CONTENTCOMMENT', '')
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('CRM_TASKDETAILCOMMENT_CreateOrUpdate_AdminWeb');

        const careCommentId = createCareCommentResData.recordset[0].RESULT;

        if (!careCommentId || careCommentId <= 0) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Tạo comment thất bại', null);
        }

        const careProductList = apiHelper.getValueFromObject(bodyParams, 'care_product_list', []);

        if (careProductList.length > 0) {
            const createCareProduct = new sql.Request(transaction);
            for (let i = 0; i < careProductList.length; i++) {
                const createCareProductResData = await createCareProduct
                    .input('TASKDETAILID', apiHelper.getValueFromObject(bodyParams, 'task_detail_id') || task_detail_id)
                    .input('PRODUCTID', careProductList[i].value)
                    .input('COMMENTID', careCommentId)
                    .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                    .execute('CRM_FAVORITEPRODUCT_Create_AdminWeb');
                const careProductId = createCareProductResData.recordset[0].RESULT;
                if (!careProductId || careProductId <= 0) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Thêm sản phẩm quan tâm thất bại', null);
                }
            }
        }

        await transaction.commit();
        return new ServiceResponse(true, '', task_detail_id);
    } catch (error) {
        await transaction.rollback();
        logger.error(error, { Task: 'TaskService.createCustomerOfTask' });

        return new ServiceResponse(false, error.message);
    }
};

const getDetailCustomerOfTask = async (TASKDETAILID) => {
    try {
        const pool = await mssql.pool;
        const responseData = await pool
            .request()
            .input('TASKDETAILID', TASKDETAILID)
            .execute('CRM_CUSTOMEROFTASK_GetById_AdminWeb');
        let data = responseData.recordset[0];
        data.CUSTOMERID = {
            member_id: data.MEMBERID,
            dataleads_id: data.DATALEADSID,
            value: Boolean(+data.MEMBERID) ? `KH${data.MEMBERID}` : `TN${data.DATALEADSID}`,
            label: data.CUSTOMERCODE + '-' + data.CUSTOMERNAME,
        };
        data.STOREID = {
            value: data.STOREID,
            label: data.STORENAME,
        };
        data.SOURCEID = {
            value: data.SOURCEID,
            label: data.SOURCENAME,
        };
        data.TASKWORKFLOWID = {
            value: data.TASKWORKFLOWID,
            label: data.WORKFLOWNAME,
        };
        return new ServiceResponse(true, '', moduleClass.customerOfTaskDetail(data));
    } catch (e) {
        console.log(e);
        logger.error(e, { function: 'TaskService.getDetailCustomerOfTask' });
        return new ServiceResponse(true, '', {});
    }
};

const getOptionsTask = async function (queryParams) {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PARENTID', apiHelper.getValueFromObject(queryParams, 'parent_id'))
            .execute('CRM_TASK_GetOption_AdminWeb');

        return new ServiceResponse(true, '', moduleClass.optionsTask(data.recordset));
    } catch (e) {
        logger.error(e, {
            function: 'TaskService.getOptionsTask',
        });
        return new ServiceResponse(false, e.message);
    }
};

const getTaskWorkFlow = async function (queryParams) {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('TASKTYPEID', apiHelper.getValueFromObject(queryParams, 'task_type_id'))
            .execute('CRM_TASKWORKFLOW_GetOption_AdminWeb');

        return new ServiceResponse(true, '', moduleClass.tabTaskWorkFlow(data.recordset));
    } catch (e) {
        logger.error(e, {
            function: 'TaskService.getTaskWorkFlow',
        });
        return new ServiceResponse(false, e.message);
    }
};

const getOptionsTaskWorkFlow = async function (queryParams) {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('TASKTYPEID', apiHelper.getValueFromObject(queryParams, 'task_type_id'))
            .execute('CRM_TASKWORKFLOW_GetOption_AdminWeb');

        return new ServiceResponse(true, '', moduleClass.optionsTaskWorkFlow(data.recordset));
    } catch (e) {
        logger.error(e, {
            function: 'TaskService.getOptionsTaskWorkFlow',
        });
        return new ServiceResponse(false, e.message);
    }
};

const getCustomerOfTaskListForExportExcel = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getValueFromObject(queryParams, 'search');
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('KEYWORD', keyword)
            .input('TASKTYPEID', apiHelper.getValueFromObject(queryParams, 'task_type_id'))
            .input('CUSTOMERTYPEID', apiHelper.getValueFromObject(queryParams, 'customer_type_id'))
            .input('SOURCEID', apiHelper.getValueFromObject(queryParams, 'source_id'))
            .input('TASKID', apiHelper.getValueFromObject(queryParams, 'task_id'))
            .input('STOREID', apiHelper.getValueFromObject(queryParams, 'store_id'))
            .input('TASKWORKFLOWID', apiHelper.getValueFromObject(queryParams, 'task_work_flow_id'))
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'created_date_from'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'created_date_to'))
            .input('BIRTHDAYDATEFROM', apiHelper.getValueFromObject(queryParams, 'birthday_date_from'))
            .input('BIRTHDAYDATETO', apiHelper.getValueFromObject(queryParams, 'birthday_date_to'))
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('USERNAME', apiHelper.getValueFromObject(queryParams, 'auth_name'))
            .input('ISACTIVE', apiHelper.getValueFromObject(queryParams, 'is_active'))
            .execute('CRM_CUSTOMEROFTASK_GetListExportExcel_AdminWeb');
        const items = data.recordset.map((item) => {
            const taskWorkflowJson = JSON.parse(`[${item.TASKWORKFLOW}]`);
            const transformedTaskWorkflow = taskWorkflowJson.map((workflow) => ({
                value: workflow.TASKWORKFLOWID,
                label: workflow.WORKFLOWNAME,
            }));
            return {
                ...item,
                TASKWORKFLOW: transformedTaskWorkflow,
            };
        });
        const his = moduleClass.customerOfTaskHisExportExcel(data.recordsets[1]);
        const totalItem = items ? items.length : 0;
        const task = moduleClass.customerOfTaskListExportExcel(items);
        return new ServiceResponse(true, '', {
            task: task,
            his: his,
            page: currentPage,
            limit: itemsPerPage,
            total: totalItem,
        });
    } catch (e) {
        console.log(e);
        logger.error(e, { function: 'TaskService.getCustomerOfTaskList' });
        return new ServiceResponse(true, '', {});
    }
};

const exportExcel = async (body) => {
    try {
        const params = {
            ...body,
            itemsPerPage: API_CONST.MAX_EXPORT_EXCEL,
        };
        const serviceRes = await getCustomerOfTaskListForExportExcel(params);
        const data = serviceRes.getData().task;
        const his = serviceRes.getData().his;
        const wb = new xl.Workbook();
        addSheet({
            workbook: wb,
            sheetName: 'DATA',
            header: {
                created_date: 'NGÀY TẠO',
                his_change_date: 'NGÀY CHUYỂN DATA',
                full_name_so: 'TÊN SALE ONLINE',
                customer_name: 'KHÁCH HÀNG',
                phone_number: 'SĐT',
                favorite_product_name: 'SẢN PHẨM QUAN TÂM',
                address: 'ĐỊA CHỈ KH',
                source_name: 'NGUỒN',
                store_name: 'CHI NHÁNH CHUYỂN',
                brand_name: 'THƯƠNG HIỆU',
                favorite_category_name: 'NGÀNH HÀNG(Chọn ban đầu S2)',
                description: 'NỘI DUNG QUAN TÂM',
                work_flow_name: 'PHÂN LOẠI KH',
                order_no: 'MÃ ĐƠN HÀNG ĐÃ MUA',
                store_name_order: 'CHI NHÁNH MUA',
                model_name: 'NHÓM SẢN PHẨM',
                order_date: 'NGÀY MUA',
                order_note: 'GHI CHÚ ĐƠN HÀNG',
                order_category_name: 'NGÀNH HÀNG BÁN(S4)',
            },
            data: data,
        });

        addSheet({
            workbook: wb,
            sheetName: 'Lịch sử chuyển bước',
            header: {
                id_lienhe: 'ID liên hệ',
                ngay_tao: 'NGÀY TẠO',
                khach_hang: 'KHÁCH HÀNG',
                sdt: 'SĐT',
                buoc_cu: 'TRẠNG THÁI CŨ',
                buoc_moi: 'TRẠNG THÁI MỚI',
                ngay_chuyen: 'THỜI GIAN CHUYỂN',
                nguoi_chuyen: 'NGƯỜI CHUYỂN',
            },
            data: his,
        });

        return new ServiceResponse(true, '', wb);
    } catch (e) {
        logger.error(e, { function: 'customer_info_sale.exportExcel' });
        return new ServiceResponse(true, '', {});
    }
};

const addSheet = ({ workbook, sheetName, header, data = [], isIndex = true, headerStyle = excelHeaderStyle }) => {
    if (isIndex) {
        header = { index: 'STT', ...header };
        data = data.map((item, index) => ({ ...item, index: index + 1 }));
    }

    const worksheet = workbook.addWorksheet(sheetName, {});
    const _headerStyle = workbook.createStyle(headerStyle);
    data.unshift(header);

    const columnKeys = Object.keys(header);
    for (let indexCol = 1; indexCol <= columnKeys.length; indexCol++) {
        const width = columnKeys[indexCol - 1] === 'index' ? 5 : 20;
        worksheet.column(indexCol).setWidth(width);
        worksheet.cell(1, indexCol).style(_headerStyle);
    }
    data.forEach((item, indexRow) => {
        columnKeys.forEach((key, indexCol) => {
            worksheet.cell(indexRow + 1, indexCol + 1).string((item[key] || '').toString());
        });
    });
};

const excelHeaderStyle = {
    font: {
        bold: true,
        color: '#FFFFFF',
    },
    fill: {
        type: 'pattern',
        patternType: 'solid',
        fgColor: '#0b2447',
    },
};

module.exports = {
    getCustomerOfTaskList,
    createCustomerOfTask,
    getDetailCustomerOfTask,
    getOptionsTask,
    getTaskWorkFlow,
    getOptionsTaskWorkFlow,
    exportExcel,
};
