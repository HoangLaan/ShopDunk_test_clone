const apiHelper = require('../../common/helpers/api.helper');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const API_CONST = require('../../common/const/api.const');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const taskTypeClass = require('./task-type.class');
const { addSheet, transformObjHasArrayPrefix, convertIntegerToTime, convertTimeToInteger } = require('./utils');
const { excelHeaderStyle, exampleImportData, exampleImportDataHeader, transformDataHeader } = require('./constants');
const xl = require('excel4node');
const readXlsxFile = require('read-excel-file/node');
const rules = require('./task-type.rule');
const Joi = require('joi');
const axios = require('axios');
const moment = require('moment');
const config = require('../../../config/config');

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
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .execute(PROCEDURE_NAME.CRM_TASKTYPE_GETLIST_ADMINWEB);

        const result = data.recordset;

        return new ServiceResponse(true, '', {
            data: taskTypeClass.list(result),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(result),
        });
    } catch (error) {
        logger.error(error, { function: 'taskTypeService.getList' });
        return new ServiceResponse(true, '', {});
    }
};

const getTaskWorkflow = async (params = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(params);
        const itemsPerPage = apiHelper.getItemsPerPage(params);
        const keyword = apiHelper.getSearch(params);

        const pool = await mssql.pool;
        const taskWorkFlow = await pool
            .request()
            .input('ISACTIVE', apiHelper.getValueFromObject(params, 'is_active', API_CONST.ISACTIVE.ALL))
            .input('ISSYSTEM', apiHelper.getValueFromObject(params, 'is_system'))
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(params, 'created_date_from'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(params, 'created_date_to'))
            .input('KEYWORD', keyword)
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .execute(PROCEDURE_NAME.CRM_TASKTYPE_WFLOW_GETLIST_ADMINWEB);

        const result = taskWorkFlow.recordsets[0];

        return new ServiceResponse(true, '', {
            data: taskTypeClass.listTaskWorkflow(result),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(result),
        });
    } catch (error) {
        logger.error(error, { function: 'taskTypeService.getTaskWorkflow' });
        return new ServiceResponse(true, '', {});
    }
};

const getById = async (taskTypeId) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('TASKTYPEID', taskTypeId)
            .execute(PROCEDURE_NAME.CRM_TASKTYPE_GETBYID_ADMINWEB);

        if (!data.recordsets[0]) {
            return new ServiceResponse(false, 'Không tìm thấy loại công việc');
        }

        const task_wflow_list = taskTypeClass.listTaskWorkflow(data.recordsets[1]);
        const condition_list = taskTypeClass.listCondition(data.recordsets[2]);
        const send_email_list = taskTypeClass.wflowSendEmail(data.recordsets[5]);
        const send_sms_list = taskTypeClass.wflowSendSMS(data.recordsets[6]);
        const send_zalo_list = taskTypeClass.wflowSendZalo(data.recordsets[7]);

        for (let i = 0; i < task_wflow_list.length; i++) {
            const { task_work_flow_id } = task_wflow_list[i];
            task_wflow_list[i].condition_list = condition_list.filter((c) => c.task_work_flow_id === task_work_flow_id);
            const send_email = send_email_list.find((c) => c.task_work_flow_id === task_work_flow_id);
            if (send_email) {
                task_wflow_list[i].send_email = send_email;
                task_wflow_list[i].is_send_email = 1;
            }
            const send_sms = send_sms_list.find((c) => c.task_work_flow_id === task_work_flow_id);
            if (send_sms) {
                task_wflow_list[i].send_sms = send_sms;
                task_wflow_list[i].is_send_sms = 1;
            }
            const send_zalo = send_zalo_list.find((c) => c.task_work_flow_id === task_work_flow_id);
            if (send_sms) {
                task_wflow_list[i].send_zalo = send_zalo;
                task_wflow_list[i].is_send_zalo_oa = 1;
            }
        }

        const result = {
            ...taskTypeClass.getById(data.recordsets[0][0]),
            task_wflow_list,
            receiver_list: taskTypeClass.listUser(data.recordsets[3]),
            model_list: taskTypeClass.listModel(data.recordsets[4]),
            send_email_list,
            send_sms_list,
            send_zalo_list,
        };

        return new ServiceResponse(true, '', result);
    } catch (error) {
        logger.error(error, { function: 'taskTypeService.getById' });
        return new ServiceResponse(false, error.message);
    }
};

const createOrUpdate = async (body) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);

    try {
        await transaction.begin();

        const authName = apiHelper.getValueFromObject(body, 'auth_name', 'administrator');
        const idUpdate = apiHelper.getValueFromObject(body, 'task_type_id');

        // create or update task type
        const result = await new sql.Request(transaction)
            .input('TASKTYPEID', apiHelper.getValueFromObject(body, 'task_type_id'))
            .input('TYPENAME', apiHelper.getValueFromObject(body, 'type_name'))
            .input('OBJECTTYPE', apiHelper.getValueFromObject(body, 'object_type'))
            .input('CUSTOMERTYPEID', apiHelper.getValueFromObject(body, 'customer_type_id'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(body, 'description'))
            .input('ADDFUNCTIONID', apiHelper.getValueFromObject(body, 'add_function_id'))
            .input('EDITFUNCTIONID', apiHelper.getValueFromObject(body, 'edit_function_id'))
            .input('EDITALLFUNCTIONID', apiHelper.getValueFromObject(body, 'edit_all_function_id'))
            .input('DELETEFUNCTIONID', apiHelper.getValueFromObject(body, 'delete_function_id'))
            .input('DELETEALLFUNCTIONID', apiHelper.getValueFromObject(body, 'delete_all_function_id'))
            .input('ISBIRTHDAY', apiHelper.getValueFromObject(body, 'is_birthday'))
            .input('ISWEDDINGANNIVERSARY', apiHelper.getValueFromObject(body, 'is_wedding_anniversary'))
            .input('ISTIMENOTBUYING', apiHelper.getValueFromObject(body, 'is_time_not_buying'))
            .input('VALUETIMENOTBUYING', apiHelper.getValueFromObject(body, 'value_time_not_buying'))
            .input('ISFINALBUY', apiHelper.getValueFromObject(body, 'is_final_buy'))
            .input('TIMEFINALBUYFROM', apiHelper.getValueFromObject(body, 'time_final_buy_from'))
            .input('ISFILTERDAILY', apiHelper.getValueFromObject(body, 'is_filter_daily'))
            .input('ISFILTERMONTHLY', apiHelper.getValueFromObject(body, 'is_filter_monthly'))
            .input('TIMEVALUE', apiHelper.getValueFromObject(body, 'time_value'))
            .input('DATEVALUE', apiHelper.getValueFromObject(body, 'date_value'))
            .input('RECEIVERID', apiHelper.getValueFromObject(body, 'receiver_id'))
            .input('ISBIRTHDAYRELATIVES', apiHelper.getValueFromObject(body, 'is_birthday_relatives'))
            .input('ISNUMBEROFBUYING', apiHelper.getValueFromObject(body, 'is_number_of_buying'))
            .input('VALUENUMBEROFBUYINGFROM', apiHelper.getValueFromObject(body, 'value_number_of_buying_from'))
            .input('TYPETIMENOTBUYING', apiHelper.getValueFromObject(body, 'type_time_not_buying'))
            .input('ISAFTERTHELASTCARE', apiHelper.getValueFromObject(body, 'is_after_the_last_care'))
            .input('VALUEAFTERTHELASTCARE', apiHelper.getValueFromObject(body, 'value_after_the_last_care'))
            .input('TYPEAFTERTHELASTCARE', apiHelper.getValueFromObject(body, 'type_after_the_last_care'))
            .input('ISTOTALMONEYSPENDING', apiHelper.getValueFromObject(body, 'is_total_money_spending'))
            .input('VALUENUMBEROFBUYINGTO', apiHelper.getValueFromObject(body, 'value_number_of_buying_to'))
            .input('VALUETOTALMONEYSPENDINGFROM', apiHelper.getValueFromObject(body, 'value_total_money_spending_from'))
            .input('VALUETOTALMONEYSPENDINGTO', apiHelper.getValueFromObject(body, 'value_total_money_spending_to'))
            .input('ISTOTALCURRENTPOINT', apiHelper.getValueFromObject(body, 'is_total_current_point'))
            .input('VALUETOTALCURRENTPOINTFROM', apiHelper.getValueFromObject(body, 'value_total_current_point_from'))
            .input('VALUETOTALCURRENTPOINTTO', apiHelper.getValueFromObject(body, 'value_total_current_point_to'))
            .input('ISAFTERUPGRADE', apiHelper.getValueFromObject(body, 'is_after_upgrade'))
            .input('VALUEDATEAFTERUPGRADE', apiHelper.getValueFromObject(body, 'value_date_after_upgrade'))
            .input('ISCURRENTWORKFLOW', apiHelper.getValueFromObject(body, 'is_current_workflow'))
            .input('TASKWORKFLOWID', apiHelper.getValueFromObject(body, 'task_workflow_id'))
            .input('ISPRODUCTHOBBIES', apiHelper.getValueFromObject(body, 'is_product_hobbies'))
            .input('ISTASKTYPEAUTO', apiHelper.getValueFromObject(body, 'is_task_type_auto'))
            .input('TIMEFINALBUYTO', apiHelper.getValueFromObject(body, 'time_final_buy_to'))
            .input('ISEQUALDIVIDE', apiHelper.getValueFromObject(body, 'is_equal_divide'))
            .input('ISRATIODIVIDE', apiHelper.getValueFromObject(body, 'is_ratio_divide'))
            .input('ISGETDATA', apiHelper.getValueFromObject(body, 'is_get_data'))
            .input('ISFILTERONCE', apiHelper.getValueFromObject(body, 'is_filter_once'))

            .input('ISACTIVE', apiHelper.getValueFromObject(body, 'is_active'))
            .input('CREATEDUSER', authName)
            .execute(PROCEDURE_NAME.CRM_TASKTYPE_CREATEORUPDATE_ADMINWEB);

        const idResult = result.recordset[0].RESULT;
        if (!idResult) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Lỗi lưu loại công việc');
        }

        if (idUpdate) {
            await new sql.Request(transaction)
                .input('TASKTYPEID', idUpdate)
                .input('DELETEDUSER', authName)
                .execute(PROCEDURE_NAME.CRM_TASKTYPE_DELETEMAPPING_ADMINWEB);
        }

        // #region CRM_TASKTYPE_WFLOW
        const task_wflow_list = apiHelper.getValueFromObject(body, 'task_wflow_list', []);
        for (let i = 0; i < task_wflow_list.length; i++) {
            const item = task_wflow_list[i];
            const requestWorkflow = new sql.Request(transaction);
            const requestWorkflowRes = await requestWorkflow
                .input('TASKTYPEID', idResult)
                .input('TASKWORKFLOWID', apiHelper.getValueFromObject(item, 'task_work_flow_id'))
                .input('TYPEPURCHASE', apiHelper.getValueFromObject(item, 'type_purchase'))
                .input('ISCOMPLETE', apiHelper.getValueFromObject(item, 'is_complete'))
                .input('TYPEREPEAT', apiHelper.getValueFromObject(item, 'type_repeat'))
                .input('MINIMUMTIME', apiHelper.getValueFromObject(item, 'minimum_time'))
                .input('ORDERINDEX', i)
                .execute(PROCEDURE_NAME.CRM_TASKTYPE_WFLOW_CREATE_ADMINWEB);
            const task_type_workflow_id = requestWorkflowRes.recordset[0].RESULT;
            if (!task_type_workflow_id) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Lỗi lưu bước xử lý');
            }
            const itemConditionList = item.condition_list || [];
            for (let j = 0; j < itemConditionList.length; j++) {
                const condition_value_list = apiHelper.getValueFromObject(
                    itemConditionList[j],
                    'condition_value_list',
                    [],
                );
                for (let k = 0; k < condition_value_list.length; k++) {
                    await new sql.Request(transaction)
                        .input('TASKTYPEID', idResult)
                        .input('TASKTYPEWORKFLOWID', task_type_workflow_id)
                        .input('CONDITIONID', apiHelper.getValueFromObject(itemConditionList[j], 'condition_id'))
                        .input('CONDITIONVALUE', condition_value_list[k])
                        .execute(PROCEDURE_NAME.CRM_TASKTYPE_WFLOW_CREATELISTCONDITION_ADMINWEB);
                }
            }
            if (item.is_send_sms && item.send_sms) {
                let send_schedule_time = apiHelper.getValueFromObject(item.send_sms, 'send_schedule_time');
                if (send_schedule_time) {
                    send_schedule_time = convertTimeToInteger(send_schedule_time);
                }

                await new sql.Request(transaction)
                    .input('TASKTYPEID', idResult)
                    .input('TASKWORKFLOWID', apiHelper.getValueFromObject(item, 'task_work_flow_id'))
                    .input('BRANDNAME', apiHelper.getValueFromObject(item.send_sms, 'brandname'))
                    .input('SMSTEMPLATEID', apiHelper.getValueFromObject(item.send_sms, 'sms_template_id'))
                    .input('CONTENTSMS', apiHelper.getValueFromObject(item.send_sms, 'content_sms'))
                    .input('SENDSCHEDULETIME', send_schedule_time)
                    .input(
                        'SENDSCHEDULEAFTERDAYS',
                        apiHelper.getValueFromObject(item.send_sms, 'send_schedule_after_days', 0),
                    )
                    .input('CREATEDUSER', authName)
                    .execute('CRM_TASKTYPE_WFLOW_CreateListSendSMS_AdminWeb');
            }
            if (item.is_send_email && item.send_email) {
                let send_schedule_time = apiHelper.getValueFromObject(item.send_email, 'send_schedule_time');
                if (send_schedule_time) {
                    send_schedule_time = convertTimeToInteger(send_schedule_time);
                }

                await new sql.Request(transaction)
                    .input('TASKTYPEID', idResult)
                    .input('TASKWORKFLOWID', apiHelper.getValueFromObject(item, 'task_work_flow_id'))
                    .input('MAILSUPPLIERID', apiHelper.getValueFromObject(item.send_email, 'mail_supplier_id'))
                    .input('MAILFROM', apiHelper.getValueFromObject(item.send_email, 'mail_from'))
                    .input('MAILSUBJECT', apiHelper.getValueFromObject(item.send_email, 'mail_subject'))
                    .input('MAILFROMNAME', apiHelper.getValueFromObject(item.send_email, 'mail_from_name'))
                    .input('MAILREPLY', apiHelper.getValueFromObject(item.send_email, 'mail_reply'))
                    .input('EMAILTEMPLATEID', apiHelper.getValueFromObject(item.send_email, 'email_template_id'))
                    .input('SENDSCHEDULETIME', send_schedule_time)
                    .input(
                        'SENDSCHEDULEAFTERDAYS',
                        apiHelper.getValueFromObject(item.send_email, 'send_schedule_after_days', 0),
                    )
                    .input('CREATEDUSER', authName)
                    .execute('CRM_TASKTYPE_WFLOW_CreateListSendEmail_AdminWeb');
            }
            if (item.is_send_zalo_oa && item.send_zalo) {
                let send_schedule_time = apiHelper.getValueFromObject(item.send_zalo, 'send_schedule_time');
                if (send_schedule_time) {
                  send_schedule_time = convertTimeToInteger(send_schedule_time);
                }

                await new sql.Request(transaction)
                    .input('TASKTYPEID', idResult)
                    .input('TASKWORKFLOWID', apiHelper.getValueFromObject(item, 'task_work_flow_id'))
                    .input('ZALOTEMPLATECONTENT', apiHelper.getValueFromObject(item.send_zalo, 'zalo_sms_content_complied'))
                    .input('IMAGEURL', apiHelper.getValueFromObject(item.send_zalo, 'zalo_sms_image_url'))
                    .input('SENDSCHEDULETIME', send_schedule_time)
                    .input(
                        'SENDSCHEDULEAFTERDAYS',
                        apiHelper.getValueFromObject(item.send_zalo, 'send_schedule_after_days', 0),
                    )
                    .input('CREATEDUSER', authName)
                    .execute('CRM_TASKTYPE_WFLOW_CreateListSendZalo_AdminWeb');
            }
        }
        // #endregion CRM_TASKTYPE_WFLOW

        // #region model_list
        const model_list = apiHelper.getValueFromObject(body, 'model_list', []);
        if (model_list.length > 0) {
            await new sql.Request(transaction)
                .input('TASKTYPEID', idResult)
                .input('MODELLIST', model_list.join('|'))
                .input('CREATEDUSER', authName)
                .execute(PROCEDURE_NAME.CRM_TASKTYPE_MODEL_CREATELIST_ADMINWEB);
        }
        // #endregion model_list

        // #region CRM_TASKTYPE_RECEIVER
        const receiver_list = apiHelper.getValueFromObject(body, 'receiver_list', []);
        for (let i = 0; i < receiver_list.length; i++) {
            const item = receiver_list[i];
            const requestReceiver = new sql.Request(transaction);
            await requestReceiver
                .input('TASKTYPEID', idResult)
                .input('USERNAME', apiHelper.getValueFromObject(item, 'user_name'))
                .input('VALUERATIO', apiHelper.getValueFromObject(item, 'value_ratio'))
                .input('CREATEDUSER', authName)
                .execute(PROCEDURE_NAME.CRM_TASKTYPE_RECEIVER_CREATE_ADMINWEB);
        }
        // #endregion CRM_TASKTYPE_RECEIVER
        if (body.is_task_type_auto) {
            console.log(config.service_apikey);
            axios({
                method: 'post',
                url: `${config.domain_service}/task-type`,
                data: {
                    ...body,
                    task_type_id: idResult,
                },
                headers: { Authorization: `APIKEY ${config.service_apikey}` },
            }).catch((err) => { });
        }

        await transaction.commit();
        return new ServiceResponse(true, 'Lưu đơn loại công việc thành công', {});
    } catch (error) {
        await transaction.rollback();
        logger.error(error, { function: 'taskTypeService.createOrUpdate' });
        return new ServiceResponse(false, error.message);
    }
};

const _delete = async (bodyParams) => {
    try {
        let list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []);

        const pool = await mssql.pool;
        await pool
            .request()
            .input('LISTID', list_id)
            .input('NAMEID', 'TASKTYPEID')
            .input('TABLENAME', 'CRM_TASKTYPE')
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('CBO_COMMON_SOFTDELETE');
        return new ServiceResponse(true, '', true);
    } catch (e) {
        logger.error(e, { function: 'taskTypeService.delete' });
        return new ServiceResponse(false, '', {});
    }
};

const exportExcel = async (body) => {
    try {
        const params = {
            ...body,
            itemsPerPage: API_CONST.MAX_EXPORT_EXCEL,
        };
        const serviceRes = await getList(params);
        const { data } = serviceRes.getData();

        const wb = new xl.Workbook();
        addSheet({
            workbook: wb,
            sheetName: 'Danh sách loại công việc',
            header: {
                task_type_id: 'Mã loại công việc',
                type_name: 'Tên loại công việc',
                description: 'Mô tả',
                created_date: 'Ngày tạo',
            },
            data,
        });

        return new ServiceResponse(true, '', wb);
    } catch (e) {
        logger.error(e, { function: 'taskTypeService.exportExcel' });
        return new ServiceResponse(true, '', {});
    }
};

const getTemplateImport = async () => {
    try {
        const pool = await mssql.pool;
        const res = await pool.request().execute(PROCEDURE_NAME.CRM_TASKTYPE_GETTEMPLATEIMPORT_ADMINWEB);

        const wb = new xl.Workbook();
        const headerStyle = wb.createStyle(excelHeaderStyle);

        addSheet({
            workbook: wb,
            sheetName: 'Nhập loại công việc',
            header: exampleImportDataHeader,
            data: exampleImportData,
        });

        const ws_note = wb.addWorksheet('Lưu ý');
        ws_note.column(1).setWidth(30);
        ws_note.column(2).setWidth(80);

        ws_note.cell(1, 1).string('Cột').style(headerStyle);
        ws_note.cell(1, 2).string('Lưu ý').style(headerStyle);
        ws_note.cell(2, 1).string('Kích hoạt');
        ws_note.cell(2, 2).string('Nhập có/không hoặc 1/0');

        addSheet({
            workbook: wb,
            sheetName: 'Danh sách quyền',
            header: {
                id: 'Mã quyền',
                name: 'Tên quyền',
            },
            data: res.recordsets[0],
        });
        addSheet({
            workbook: wb,
            sheetName: 'Bước xử lý',
            header: {
                id: 'Mã bước xử lý',
                name: 'Tên bước xử lý',
            },
            data: res.recordsets[1],
        });

        return new ServiceResponse(true, '', wb);
    } catch (error) {
        logger.error(error, {
            function: 'taskTypeService.getTemplateImport',
        });
        return new ServiceResponse(false, error.message);
    }
};

const importExcel = async (bodyParams = {}) => {
    try {
        const pathUpload = apiHelper.getValueFromObject(bodyParams, 'path_upload');
        const rows = await readXlsxFile(pathUpload);
        const auth_name = apiHelper.getValueFromObject(bodyParams, 'auth_name', 'administrator');
        let import_errors = [];

        if (rows?.length <= 1) {
            return new ServiceResponse(false, 'Tập tin chưa có dữ liệu!', null);
        }

        // get max index of task workflow from excel
        const wFlowHeader = rows[0]
            .filter((x) => x.indexOf('Bước xử lý') > -1)
            .map((x) => Number(x.split(' - ')[0].replace('Bước xử lý ', '')));
        const maxIndex = Math.max(...wFlowHeader);
        const _transformDataHeader = { ...transformDataHeader };
        for (let i = 1; i <= maxIndex; i++) {
            _transformDataHeader[`Bước xử lý ${i} - Mã`] = `task_wflow_list.${i}.task_work_flow_id`;
            _transformDataHeader[`Bước xử lý ${i} - Đồng ý?`] = `task_wflow_list.${i}.type_purchase`;
            _transformDataHeader[`Bước xử lý ${i} - Là bước hoàn thành?`] = `task_wflow_list.${i}.is_complete`;
        }

        // transform array excel to valid object to import
        const rowExcelHeader = rows[0],
            rowTransformed = [];
        for (let i = 1; i < rows.length; i++) {
            const rowItem = { auth_name };
            for (let j = 1; j < rowExcelHeader.length; j++) {
                const keyExcel = rowExcelHeader[j];
                const keyTransform = _transformDataHeader[keyExcel];
                const value = rows[i][j];
                if (
                    keyTransform === 'is_active' ||
                    keyTransform.indexOf('.is_complete') !== -1 ||
                    keyTransform.indexOf('.type_purchase') !== -1
                ) {
                    const cellBoolean = (value || '').trim().toLowerCase();
                    rowItem[keyTransform] = cellBoolean === 'có' || cellBoolean === '1' ? 1 : 0;
                } else {
                    rowItem[keyTransform] = (value || '').trim();
                }
            }
            const _rowItem = transformObjHasArrayPrefix(rowItem, 'task_wflow_list');
            rowTransformed.push(_rowItem);
        }

        // start import
        for (let i = 0; i < rowTransformed.length; i++) {
            const rowItem = rowTransformed[i];
            try {
                await Joi.object(rules.create.body).unknown().validate(rowItem);
                await createOrUpdate(rowItem);
            } catch (error) {
                const msg = error?.details?.length ? error?.details[0]?.message : error.message;
                const _error = { ...rowItem, error_message: msg };
                import_errors.push(_error);
            }
        }
        return new ServiceResponse(true, '', {
            import_data: rowTransformed,
            import_errors,
        });
    } catch (error) {
        logger.error(error, { function: 'taskTypeService.importExcel' });
        return new ServiceResponse(false, error.message);
    }
};

const getListUser = async (params = {}) => {
    try {
        const pool = await mssql.pool;
        const dataList = await pool
            .request()
            .input('KEYWORD', apiHelper.getValueFromObject(params, 'keyword', null))
            .input('DEPARTMENTID', apiHelper.getValueFromObject(params, 'department_id', null))
            .input('POSITIONID', apiHelper.getValueFromObject(params, 'position_id', null))
            .input('STATUS', apiHelper.getValueFromObject(params, 'is_active', API_CONST.ISACTIVE.ALL))
            .input('PAGESIZE', apiHelper.getValueFromObject(params, 'itemsPerPage', API_CONST.PAGINATION.LIMIT))
            .input('PAGEINDEX', apiHelper.getValueFromObject(params, 'page', null))
            .execute(PROCEDURE_NAME.SYS_USER_GETLIST_ADMINWEB);
        return new ServiceResponse(true, '', {
            list: taskTypeClass.listUser(dataList.recordset),
            total: apiHelper.getTotalData(dataList.recordset),
        });
    } catch (error) {
        logger.error(error, { function: 'customerCareTypeService.getListUser' });
        return new ServiceResponse(false, error.message);
    }
};

const createOrUpdateCondition = async (body) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);

    try {
        await transaction.begin();

        const authName = apiHelper.getValueFromObject(body, 'auth_name', 'administrator');

        // create or update task type
        const result = await new sql.Request(transaction)
            .input('CONDITIONID', apiHelper.getValueFromObject(body, 'condition_id'))
            .input('CONDITIONNAME', apiHelper.getValueFromObject(body, 'condition_name'))
            .input('ISDATABASE', apiHelper.getValueFromObject(body, 'is_database'))
            .input('ISACTIVE', apiHelper.getValueFromObject(body, 'is_active'))
            .input('CREATEDUSER', authName)
            .execute(PROCEDURE_NAME.CRM_TASKTYPE_CREATEORUPDATECONDITION_ADMINWEB);

        const idResult = result.recordset[0].RESULT;
        if (!idResult) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Lỗi lưu điều kiện chuyển bước xử lý');
        }

        await transaction.commit();
        return new ServiceResponse(true, 'Lưu lưu điều kiện chuyển bước xử lý thành công', {});
    } catch (error) {
        await transaction.rollback();
        logger.error(error, { function: 'taskTypeService.createOrUpdate' });
        return new ServiceResponse(false, error.message);
    }
};

const getListCondition = async (queryParams = {}) => {
    try {
        const keyword = apiHelper.getSearch(queryParams);
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('KEYWORD', keyword)
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .execute(PROCEDURE_NAME.CRM_TASKTYPE_CONDITION_GETLIST_ADMINWEB);
        const result = data.recordset;
        return new ServiceResponse(true, '', taskTypeClass.getListCondition(result));
    } catch (error) {
        logger.error(error, { function: 'taskTypeService.getListCondition' });
        return new ServiceResponse(true, '', {});
    }
};

module.exports = {
    getList,
    getTaskWorkflow,
    getById,
    createOrUpdate,
    delete: _delete,
    exportExcel,
    getTemplateImport,
    importExcel,
    getListUser,
    createOrUpdateCondition,
    getListCondition,
};
