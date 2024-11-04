const positionClass = require('./position.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const API_CONST = require('../../common/const/api.const');
var xl = require('excel4node');
const skillClass = require('../skill/skill.class');
const fileHelper = require('../../common/helpers/file.helper');
const levelClass = require('../skilllevel/level.class');
/**
 * Get list MD_POSITION
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListPosition = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'search'))
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'create_date_from'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'create_date_to'))
            .input('ISACTIVE', apiHelper.getValueFromObject(queryParams, 'is_active'))
            //.input('DEPARTMENTID', apiHelper.getValueFromObject(queryParams, 'department_id'))
            .execute(PROCEDURE_NAME.MD_POSITION_GETLIST_ADMINWEB);
        let list = positionClass.list(data.recordsets[0]);
        const totalItem = apiHelper.getTotalData(data.recordsets[0]);
        const departments = positionClass.departments(data.recordsets[1]);

        if (list) {
            list.forEach((p) => {
                let department = departments.filter((d) => d.position_id === p.position_id);
                p.department_list = [];
                for (let i = 0; i < department.length; i++) {
                    p.department_list.push(department[i].department_name);
                }
            });
        }
        return new ServiceResponse(true, '', {
            data: list,
            page: currentPage,
            limit: itemsPerPage,
            total: totalItem,
        });
    } catch (e) {
        logger.error(e, { function: 'PositionService.getListPosition' });
        return new ServiceResponse(true, '', {});
    }
};

// detail Position
const detailPosition = async (positionId) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('POSITIONID', positionId)
            .execute(PROCEDURE_NAME.MD_POSITION_GETBYID_ADMINWEB);
        let position = positionClass.detail(data.recordsets[0][0]);
        let department = data.recordsets[1] || [];
        let level = positionClass.level(data.recordsets[2] || []);
        let skill = positionClass.skill(data.recordsets[3] || []);
        let work_type = positionClass.workType(data.recordsets[4] || []);

        if (position.position_id) {
            //lấy tên nhóm của kỹ năng
            let skillGroup = skillClass.optionskillgroup(data.recordsets[5] || []);
            if (skill) {
                skill.forEach((s) => {
                    let group = skillGroup.filter((g) => g.skill_id === s.skill_id);
                    s.skillgroup_name = [];
                    for (let i = 0; i < group.length; i++) {
                        s.skillgroup_name.push(group[i].skillgroup_name);
                    }
                });
            }

            //lấy trình độ của kỹ năng
            let levelSkill = levelClass.options(data.recordsets[6] || []);
            if (skill) {
                skill.forEach((s) => {
                    let level = levelSkill.filter((g) => g.skill_id === s.skill_id);
                    s.skill_level = level;
                });
            }

            if (department) {
                position.department_list = department;
            }

            if (level) {
                for (let i = 0; i < level.length; i++) {
                    let skill_list = skill.filter((_) => _.position_level_id === level[i].position_level_id);
                    let work_type_list = work_type.filter((_) => _.position_level_id === level[i].position_level_id);
                    level[i].skill_list = { ...skill_list };
                    level[i].work_type_list = { ...work_type_list };
                    level[i].key = `${i + 1}`;
                }
            }
            position.level_list = { ...level };

            return new ServiceResponse(true, '', position);
        }

        return new ServiceResponse(false, 'Không tìm thấy vị trí', null);
    } catch (e) {
        logger.error(e, { function: 'positionService.getListPosition' });
        return new ServiceResponse(false, e.message);
    }
};

//Delete position
const deletePosition = async (positionId, bodyParams) => {
    try {
        const pool = await mssql.pool;
        await pool
            .request()
            .input('POSITIONID', positionId)
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute(PROCEDURE_NAME.MD_POSITION_DELETE_ADMINWEB);
        return new ServiceResponse(true, RESPONSE_MSG.POSITION.DELETE_SUCCESS, '');
    } catch (e) {
        logger.error(e, { function: 'positionService.deletePosition' });
        return new ServiceResponse(false, e.message);
    }
};

// change Status Position
const changeStatusPosition = async (positionId, bodyParams) => {
    try {
        const pool = await mssql.pool;
        await pool
            .request()
            .input('POSITIONID', positionId)
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name')) // return administrator
            .execute(PROCEDURE_NAME.MD_POSITION_UPDATESTATUS_ADMINWEB);
        return new ServiceResponse(true, 'change status success', { isSuccess: true });
    } catch (e) {
        logger.error(e, { function: 'positionService.changeStatusPosition' });
        return new ServiceResponse(false);
    }
};

// create or update Position
const createOrUpdatePosition = async (body, files, auth) => {
    body = JSON.parse(JSON.stringify(body));
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        await transaction.begin();
        //check name
        const dataCheck = await pool
            .request()
            .input('POSITIONID', apiHelper.getValueFromObject(body, 'position_id'))
            .input('POSITIONNAME', apiHelper.getValueFromObject(body, 'position_name'))
            .execute(PROCEDURE_NAME.MD_POSITION_CHECKNAME_ADMINWEB);
        if (dataCheck.recordset && dataCheck.recordset[0].RESULT == 1) {
            await transaction.rollback();
            return new ServiceResponse(false, RESPONSE_MSG.POSITION.EXISTS_NAME, null);
        }
        const reqPostion = new sql.Request(transaction);

        const data = await reqPostion
            .input('POSITIONID', parseInt(apiHelper.getValueFromObject(body, 'position_id')))
            .input('POSITIONNAME', apiHelper.getValueFromObject(body, 'position_name', ''))
            .input('DESCRIPTION', apiHelper.getValueFromObject(body, 'description', ''))
            .input('ISACTIVE', parseInt(apiHelper.getValueFromObject(body, 'is_active')))
            .input('ISSYSTEM', parseInt(apiHelper.getValueFromObject(body, 'is_system')))
            .input('ISINTERNS', parseInt(apiHelper.getValueFromObject(body, 'is_interns')))
            .input('ISPROBATIONARYSTAFF', parseInt(apiHelper.getValueFromObject(body, 'is_probationarystaff')))
            .input('ISOFFICIAL', parseInt(apiHelper.getValueFromObject(body, 'is_official')))
            .input('CREATEDUSER', apiHelper.getValueFromObject(auth, 'user_name'))
            .execute(PROCEDURE_NAME.MD_POSITION_CREATEORUPDATE_ADMINWEB);
        const position_id = data.recordset[0].RESULT;

        if (!position_id) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Lỗi thêm vị trí', null);
        }

        // xóa phòng ban
        const reqDelDepartment = new sql.Request(transaction);
        const dataDelDep = await reqDelDepartment
            .input('POSITIONID', position_id)
            .input('DELETEDUSER', apiHelper.getValueFromObject(auth, 'user_name', 'administrator'))
            .execute('MD_DEPARTMENT_POSITION_Delete_AdminWeb');

        const resultDelDepartment = dataDelDep.recordset[0].RESULT;

        if (resultDelDepartment <= 0) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Lỗi xóa phòng ban');
        }

        // tạo phòng ban
        let department_list = JSON.parse(apiHelper.getValueFromObject(body, 'department_list'));
        if (department_list && department_list.length > 0) {
            const reqDepartment = new sql.Request(transaction);
            for (let k = 0; k < department_list.length; k++) {
                const department = department_list[k];
                await reqDepartment
                    .input('POSITIONID', position_id)
                    .input('DEPARTMENTID', department.value)
                    .input('CREATEDUSER', apiHelper.getValueFromObject(auth, 'user_name', 'administrator'))
                    .execute('MD_DEPARTMENT_POSITION_CreateOrUpdate_AdminWeb');
            }
        }

        if (apiHelper.getValueFromObject(body, 'position_id')) {
            // xóa cấp độ
            const reqDelLevel = new sql.Request(transaction);
            const dataDelLevel = await reqDelLevel
                .input('POSITIONID', position_id)
                .input('DELETEDUSER', apiHelper.getValueFromObject(auth, 'user_name', 'administrator'))
                .execute('MD_POSITION_LEVEL_Delete_AdminWeb');
            const resultDelLevel = dataDelLevel.recordset[0].RESULT;

            if (resultDelLevel <= 0) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Lỗi xóa cấp độ');
            }
        }

        // tạo cấp độ
        let level_list = JSON.parse(apiHelper.getValueFromObject(body, 'level_list'));

        if (level_list && level_list.length > 0) {
            const reqLevel = new sql.Request(transaction);
            for (let k = 0; k < level_list.length; k++) {
                const level = level_list[k];

                // lưu file jd
                let jd_file = files?.find((file) => file.fieldname == `jd_file_list[${level.hr_level_id}]`);
                let jd_file_name = null;
                let jd_file_path = null;
                if (jd_file && jd_file.buffer) {
                    jd_file_name = jd_file.originalname;
                    jd_file_path = await fileHelper.saveFileV2(jd_file);
                }

                const dataLevel = await reqLevel
                    .input('POSITIONLEVELID', level.position_level_id)
                    .input('POSITIONID', position_id)
                    .input('USERLEVELID', level.hr_level_id)
                    .input('EXPERIENCEID', level.experience_id)
                    .input('SALARYID', level.salary_id)
                    .input('FILENAME', jd_file_name)
                    .input('FILEPATH', jd_file_path)
                    .input('CREATEDUSER', apiHelper.getValueFromObject(auth, 'user_name', 'administrator'))
                    .execute('MD_POSITION_LEVEL_CreateOrUpdate_AdminWeb');

                let position_level_id = dataLevel.recordset[0].RESULT;
                if (!position_level_id) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Lỗi thêm cấp độ của vị trí', null);
                }

                const { skill_list, work_type_list } = level_list[k];
                // xóa kỹ năng

                const reqDelSkill = new sql.Request(transaction);
                const dataDelSkill = await reqDelSkill
                    .input('POSITIONLEVELID', position_level_id)
                    .input('POSITIONID', position_id)
                    .input('DELETEDUSER', apiHelper.getValueFromObject(auth, 'user_name', 'administrator'))
                    .execute('HR_POSITION_LEVELSKILL_Delete_AdminWeb');

                const resultDelSkill = dataDelSkill.recordset[0].RESULT;
                if (resultDelSkill <= 0) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Lỗi xóa kỹ năng');
                }

                // tạo kỹ năng
                if (skill_list && skill_list.length > 0) {
                    const reqSkill = new sql.Request(transaction);
                    for (let k = 0; k < skill_list.length; k++) {
                        const skill = skill_list[k];
                        await reqSkill
                            .input('POSITIONLEVELID', position_level_id)
                            .input('POSITIONID', position_id)
                            .input('SKILLID', skill.skill_id)
                            .input('LEVELID', skill.skill_level_id)
                            .input('CREATEDUSER', apiHelper.getValueFromObject(auth, 'user_name', 'administrator'))
                            .execute('HR_POSITION_LEVELSKILL_CreateOrUpdate_AdminWeb');
                    }
                }

                //xóa loại cv
                const reqDelWorktype = new sql.Request(transaction);
                const dataDelWorktype = await reqDelWorktype
                    .input('POSITIONLEVELID', position_level_id)
                    .input('POSITIONID', position_id)
                    .input('DELETEDUSER', apiHelper.getValueFromObject(auth, 'user_name', 'administrator'))
                    .execute('HR_POSITION_WORKTYPE_Delete_AdminWeb');
                const resultDelWorktype = dataDelWorktype.recordset[0].RESULT;
                if (resultDelWorktype <= 0) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Lỗi xóa loại công việc');
                }

                //tạo loại cv
                if (work_type_list && work_type_list.length > 0) {
                    const reqWorktype = new sql.Request(transaction);
                    for (let k = 0; k < work_type_list.length; k++) {
                        const work_type = work_type_list[k];
                        await reqWorktype
                            .input('POSITIONLEVELID', position_level_id)
                            .input('POSITIONID', position_id)
                            .input('WORKTYPEID', work_type.work_type_id)
                            .input('ISPROFESSIONAL', work_type.is_proffessional ?? 0)
                            .input('CREATEDUSER', apiHelper.getValueFromObject(auth, 'user_name', 'administrator'))
                            .execute('HR_POSITION_WORKTYPE_CreateOrUpdate_AdminWeb');
                    }
                }
            }
        }

        await transaction.commit();
        return new ServiceResponse(true, 'updated successfully', position_id);
    } catch (e) {
        await transaction.rollback();
        logger.error(e, { function: 'positionService.createOrUpdatePosition' });
        return new ServiceResponse(false);
    }
};

// export Excel
const exportExcel = async (queryParams = {}) => {
    queryParams.itemsPerPage = API_CONST.MAX_EXPORT_EXCEL;
    queryParams.is_active = 2;
    const serviceRes = await getListPosition(queryParams);
    const { data } = serviceRes.getData();

    // Create a new instance of a Workbook class
    const wb = new xl.Workbook();
    // Add Worksheets to the workbook
    const ws = wb.addWorksheet('List Position', {});
    // Set width
    ws.column(1).setWidth(15);
    ws.column(2).setWidth(40);
    ws.column(3).setWidth(40);
    ws.column(12).setWidth(50);
    ws.column(13).setWidth(50);

    const header = {
        position_id: 'Mã chức vụ',
        position_name: 'Tên chức vụ',
        created_user: 'Người tạo',
        created_date: 'Ngày tạo',
        is_active: 'Kích hoạt',
    };
    data.unshift(header);

    data.forEach((item, index) => {
        let indexRow = index + 1;
        let indexCol = 0;
        ws.cell(indexRow, ++indexCol).string(item.position_id.toString());
        ws.cell(indexRow, ++indexCol).string((item.position_name || '').toString());
        ws.cell(indexRow, ++indexCol).string((item.created_user || '').toString());
        ws.cell(indexRow, ++indexCol).string(index === 0 ? item.is_active : item.is_active ? 'Có' : 'Không');
        ws.cell(indexRow, ++indexCol).string((item.created_date || '').toString());
    });
    return new ServiceResponse(true, '', wb);
};
const getOptionByDepartmentId = async (queryParams = {}) => {
    try {
        const department_id = apiHelper.getValueFromObject(queryParams, 'department_id');

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('DEPARTMENTID', department_id)
            .execute('MD_POSITION_GetOptionByDepartmentId_AdminWeb');
        let list = positionClass.options(data.recordset);
        return new ServiceResponse(true, '', list);
    } catch (e) {
        logger.error(e, { function: 'recruitType.service.getListPositionByDepartmentId' });
        return new ServiceResponse(false, e.message);
    }
};

const deleteArrayPostion = async (bodyParams) => {
    try {
        let list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []);
        const pool = await mssql.pool;
        await pool
            .request()
            .input('LISTID', list_id)
            .input('NAMEID', 'POSITIONID')
            .input('TABLENAME', 'MD_POSITION')
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('CBO_COMMON_SOFTDELETE');
        return new ServiceResponse(true, '', true);
    } catch (e) {
        logger.error(e, { function: 'deleteArrayPostion.service.deleteArrayPostion' });
        return new ServiceResponse(false, 'Lỗi xoá vị trí');
    }
};

const downloadAttachment = async (position_level_id) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('POSITIONLEVELID', position_level_id)
            .execute('MD_POSITION_LEVEL_GetFileById_AdminWeb');

        let file = data.recordset;

        if (file && file.length > 0) {
            file = positionClass.file(file[0]);
            return new ServiceResponse(true, '', file);
        }

        return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
    } catch (e) {
        logger.error(e, { function: 'positionServer.downloadFile' });
        return new ServiceResponse(false, e.message);
    }
};

module.exports = {
    getListPosition,
    detailPosition,
    deletePosition,
    changeStatusPosition,
    createOrUpdatePosition,
    exportExcel,
    getOptionByDepartmentId,
    deleteArrayPostion,
    downloadAttachment,
};
