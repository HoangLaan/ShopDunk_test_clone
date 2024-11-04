const database = require('../../models');
const taskWorkFlowClass = require('./task-work-flow.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const API_CONST = require('../../common/const/api.const');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const mssql = require('../../models/mssql');
const apiHelper = require('../../common/helpers/api.helper');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
let xl = require('excel4node');
const readXlsxFile = require('read-excel-file/node');
const { changeToSlug } = require('../../common/helpers/string.helper');
const getList = async (params = {}) => {
    try {
        const pool = await mssql.pool;
        const taskWorkFlow = await pool
            .request()
            .input('KEYWORD', apiHelper.getValueFromObject(params, 'keyword', null))
            .input('ISACTIVE', apiHelper.getValueFromObject(params, 'is_active', API_CONST.ISACTIVE.ALL))
            .input('ISSYSTEM', apiHelper.getValueFromObject(params, 'is_system', null))
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(params, 'created_date_from', null))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(params, 'created_date_to', null))
            .input('PAGESIZE', apiHelper.getValueFromObject(params, 'itemsPerPage', null))
            .input('PAGEINDEX', apiHelper.getValueFromObject(params, 'page', null))
            .execute(PROCEDURE_NAME.CRM_TASKWORKFLOW_GETLIST_ADMINWEB);
        return {
            list: taskWorkFlowClass.list(taskWorkFlow.recordsets[0]),
            total: apiHelper.getTotalData(taskWorkFlow.recordsets[0]),
        };
    } catch (error) {
        logger.error(error, { function: 'taskWorkFlowService.getList' });
        return [];
    }
};

const create = async (params = {}) => {
    try {
        await createOrUpdateHandler(null, params);
        return true;
    } catch (error) {
        logger.error(error, { function: 'taskWorkFlowService.create' });
        return false;
    }
};

const update = async (id, params = {}) => {
    try {
        await createOrUpdateHandler(id, params);
        return true;
    } catch (error) {
        logger.error(error, { function: 'taskWorkFlowService.update' });
        return false;
    }
};

const createOrUpdateHandler = async (id = null, params = {}) => {
    try {
        const pool = await mssql.pool;
        const taskWorkFlow = await pool
            .request()
            .input('TASKWORKFLOWID', id)
            .input('WORKFLOWNAME', apiHelper.getValueFromObject(params, 'work_flow_name', null))
            .input('WORKFLOWCODE', apiHelper.getValueFromObject(params, 'work_flow_code', null))
            .input('COLOR', apiHelper.getValueFromObject(params, 'color', null))
            .input('DESCRIPTION', apiHelper.getValueFromObject(params, 'description', null))
            .input('ISACTIVE', apiHelper.getValueFromObject(params, 'is_active', API_CONST.ISACTIVE.ALL))
            .input('ISSYSTEM', apiHelper.getValueFromObject(params, 'is_system', API_CONST.ISSYSTEM.ALL))
            .input('TYPEPURCHASE', apiHelper.getValueFromObject(params, 'type_purchase', null))
            .input('CREATEDUSER', apiHelper.getValueFromObject(params, 'auth_name'))
            .execute(PROCEDURE_NAME.CRM_TASKWORKFLOW_CREATEORUPDATE_ADMINWEB);
        removeCacheOptions();
        const taskWordFlowId = taskWorkFlow.recordset[0].id;
        if (!taskWordFlowId || taskWordFlowId <= 0) {
            return new ServiceResponse(false, 'Tạo hoặc cập nhật bước xử lý thất bại', null);
        }
        return taskWordFlowId;
    } catch (error) {
        logger.error(error, { function: 'TaskWorkFlowService.createOrUpdateHandler' });
    }
};

const detail = async (id) => {
    try {
        const pool = await mssql.pool;
        const taskWorkFlow = await pool
            .request()
            .input('TASKWORKFLOWID', id)
            .execute(PROCEDURE_NAME.CRM_TASKWORKFLOW_GETBYID_ADMINWEB);
        return {
            ...taskWorkFlowClass.detail(taskWorkFlow.recordset[0]),
        };
    } catch (error) {
        logger.error(error, { function: 'taskWorkFlowService.detail' });
        return null;
    }
};

const remove = async (bodyParams) => {
    try {
        const pool = await mssql.pool;
        let list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []);
        const data = await pool
            .request()
            .input('LISTID', list_id)
            .input('NAMEID', 'TASKWORKFLOWID')
            .input('TABLENAME', 'CRM_TASKWORKFLOW')
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('CBO_COMMON_SOFTDELETE');
        removeCacheOptions();
        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, { function: 'ManufacturerService.deleteManufacturer' });
        return new ServiceResponse(false, e.message);
    }
};

const removeCacheOptions = () => {
    return cacheHelper.removeByKey(CACHE_CONST.CRM_TASKWORKFLOW_OPTIONS);
};

const exportExcel = async (queryParams = {}) => {
    try {
        const serviceRes = await getList(queryParams);
        const { list } = serviceRes;
        // Create a new instance of a Workbook class
        const wb = new xl.Workbook();
        // Add Worksheets to the workbook
        const ws = wb.addWorksheet('Danh sách bước xử lý công việc', {});
        // Set width
        ws.column(1).setWidth(15);
        ws.column(2).setWidth(50);
        ws.column(2).setWidth(50);
        ws.column(3).setWidth(40);
        ws.column(5).setWidth(50);
        ws.column(6).setWidth(50);

        const header = {
            work_flow_code: 'Mã bước',
            work_flow_name: 'Tên bước xử lý công việc',
            color: 'Màu',
            description: 'Mô tả',
            create_date: 'Ngày tạo',
            is_active: 'Kích hoạt',
        };
        list.unshift(header);

        list.forEach((item, index) => {
            let indexRow = index + 1;
            let indexCol = 0;
            ws.cell(indexRow, ++indexCol).string((item.work_flow_code || '').toString());
            ws.cell(indexRow, ++indexCol).string((item.work_flow_name || '').toString());
            ws.cell(indexRow, ++indexCol).string((item.color || '').toString());
            ws.cell(indexRow, ++indexCol).string((item.description || '').toString());
            ws.cell(indexRow, ++indexCol).string((item.create_date || '').toString());
            ws.cell(indexRow, ++indexCol).string(index === 0 ? item.is_active : item.is_active ? 'Có' : 'Không');
        });
        return new ServiceResponse(true, '', wb);
    } catch (error) {
        logger.error(error, { function: 'taskWorkFlowService.exportExcel' });
    }
};

const downloadExcel = async () => {
    try {
        const wb = new xl.Workbook();
        const headerStyle = wb.createStyle({
            font: {
                bold: true,
                color: '262626',
            },
            alignment: {
                horizontal: 'center',
                vertical: 'center',
            },
            border: {
                left: {
                    style: 'thin',
                    color: 'black',
                },
                right: {
                    style: 'thin',
                    color: 'black',
                },
                top: {
                    style: 'thin',
                    color: 'black',
                },
                bottom: {
                    style: 'thin',
                    color: 'black',
                },
            },
            fill: {
                type: 'pattern',
                patternType: 'solid',
                bgColor: '#e4e5e6',
                fgColor: '#e4e5e6',
            },
        });

        let styleBorder = {
            border: {
                left: {
                    style: 'thin',
                    color: 'black',
                },
                right: {
                    style: 'thin',
                    color: 'black',
                },
                top: {
                    style: 'thin',
                    color: 'black',
                },
                bottom: {
                    style: 'thin',
                    color: 'black',
                },
            },
        };
        const ws_taskWorkFlow = wb.addWorksheet('Danh sách bước xử lý');
        for (let index = 1; index < 8; index++) {
            ws_taskWorkFlow.column(index).setWidth(index == 1 ? 15 : 40);
            ws_taskWorkFlow.cell(2, index).string('').style(styleBorder);
        }
        ws_taskWorkFlow.cell(1, 1).string('STT').style(headerStyle);
        ws_taskWorkFlow.cell(1, 2).string('Mã bước').style(headerStyle);
        ws_taskWorkFlow.cell(1, 3).string('Màu').style(headerStyle);
        ws_taskWorkFlow.cell(1, 4).string('Tên bước xử lý công việc').style(headerStyle);
        ws_taskWorkFlow.cell(1, 5).string('Mô tả').style(headerStyle);
        ws_taskWorkFlow.cell(1, 6).string('Đồng ý mua').style(headerStyle);
        ws_taskWorkFlow.cell(1, 7).string('Kích hoạt').style(headerStyle);

        // Vi du
        ws_taskWorkFlow.cell(2, 1).string('1').style(styleBorder);
        ws_taskWorkFlow.cell(2, 2).string('buoc1').style(styleBorder);
        ws_taskWorkFlow.cell(2, 3).string('#892424').style(styleBorder);
        ws_taskWorkFlow.cell(2, 4).string('bước 1').style(styleBorder);
        ws_taskWorkFlow.cell(2, 5).string('bước 1').style(styleBorder);
        ws_taskWorkFlow.cell(2, 6).string('Có').style(styleBorder);
        ws_taskWorkFlow.cell(2, 7).string('Có').style(styleBorder);
        return new ServiceResponse(true, '', wb);
    } catch (error) {
        logger.error(error, { function: 'taskWorkFlowService.downloadExcel' });
    }
};

const isColor = (strColor) => {
    let colorRegex = /^#[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}$/;
    return colorRegex.test(strColor);
};

const checkTaskWorkCode = async (code) => {
    try {
        const pool = await mssql.pool;
        const res = await pool
            .request()
            .input('TASKWORKFLOWCODE', code)
            .execute(PROCEDURE_NAME.CRM_TASKWORKFLOW_CHECKWORKFLOWCODE_ADMINWEB);
        let { check_code = 0 } = res.recordset[0] || {};
        return check_code;
    } catch (error) {
        logger.error(error, { function: 'TaskWorkFlowService.checkTaskWorkCode' });
    }
};

const checkTaskWorkFlowImport = async (taskWorkFlow) => {
    let errmsg = [];
    try {
        let arrVal = ['co', 'khong', '1', '0'];
        //Bắt buộc nhập
        let { work_flow_code, color, work_flow_name, argee_to_buy, is_active } = taskWorkFlow || {};
        if (!work_flow_code) {
            errmsg.push('Mã bước là bắt buộc');
        }
        if (!work_flow_name) {
            errmsg.push('Tên bước xử lý công việc là bắt buộc');
        }
        if (!color) {
            errmsg.push('Tên màu là bắt buộc');
        } else {
            if (!isColor(color)) {
                errmsg.push('Tên màu không tồn tại');
            }
        }
        if (!is_active) {
            errmsg.push('Kích hoạt là bắt buộc.');
        } else {
            if (!arrVal.includes(changeToSlug(is_active))) {
                errmsg.push('Kích hoạt vui lòng nhập có/không hoặc 1/0.');
            } else {
                if (['co', '1'].includes(changeToSlug(is_active))) {
                    taskWorkFlow.is_active = 1;
                } else {
                    taskWorkFlow.is_active = 0;
                }
            }
        }
        let arr = ['co', 'khong', '1', '0', ''];
        if (arr.includes(changeToSlug(argee_to_buy))) {
            if (['co', '1'].includes(changeToSlug(argee_to_buy))) {
                taskWorkFlow.type_purchase = 1;
            } else if (['khong', '0'].includes(changeToSlug(argee_to_buy))) {
                taskWorkFlow.type_purchase = 0;
            } else taskWorkFlow.type_purchase = null;
        }
        if (work_flow_code) {
            // Kiểm tra trùng mã bước
            let check_code = await checkTaskWorkCode(work_flow_code);
            if (check_code > 0) {
                errmsg.push('Mã bước đã tồn tại.');
            }
        }
    } catch (error) {
        logger.error(error, { function: 'taskWorkFlowService.checkTaskWorkFlowImport' });
        errmsg.push(error.message);
    }
    return { errmsg, taskWorkFlow };
};

const importExcel = async (bodyParams = {}) => {
    try {
        const pathUpload = apiHelper.getValueFromObject(bodyParams, 'path_upload');
        const auth_name = apiHelper.getValueFromObject(bodyParams, 'auth_name', 'administrator');
        const rows = await readXlsxFile(pathUpload);
        let import_data = [];
        let import_errors = [];
        let import_total = 0;
        for (let i in rows) {
            // Bỏ qua dòng tiêu đề đầu
            if (i > 0 && rows[i]) {
                import_total += 1;
                //STT
                let stt = rows[i][0] || '';
                let work_flow_code = `${rows[i][1] || ''}`.trim();
                let color = `${rows[i][2] || ''}`.trim();
                let work_flow_name = `${rows[i][3] || ''}`.trim();
                let description = `${rows[i][4] || ''}`.trim();
                let argee_to_buy = `${rows[i][5] || ''}`.trim();
                let is_active = '';
                if (rows[i][6] === null || rows[i][6] === '') {
                } else is_active = `${rows[i][6]}`.trim();
                const taskWorkFlow_import = {
                    stt,
                    work_flow_code,
                    color,
                    work_flow_name,
                    description,
                    argee_to_buy,
                    is_active,
                };

                let { errmsg = [], taskWorkFlow = {} } = await checkTaskWorkFlowImport(taskWorkFlow_import);

                if (errmsg && errmsg.length > 0) {
                    import_errors.push({
                        taskWorkFlow,
                        errmsg,
                        i,
                    });
                } else {
                    //Inser Product
                    try {
                        let res = await createOrUpdateHandler(null, { ...taskWorkFlow, auth_name });
                        import_data.push(res);
                    } catch (error) {
                        import_errors.push({
                            taskWorkFlow,
                            errmsg: [error.message],
                            i,
                        });
                    }
                }
            }

            if (rows.length < 2) {
                return new ServiceResponse(false, 'Tập tin chưa có dữ liệu!', null);
            }
        }
        return new ServiceResponse(true, '', {
            import_data,
            import_total,
            import_errors,
        });
    } catch (error) {
        logger.error(error, { function: 'taskWorkFlowService.importExcel' });
    }
};
module.exports = {
    getList,
    create,
    detail,
    update,
    remove,
    exportExcel,
    downloadExcel,
    importExcel,
    checkTaskWorkCode,
};
