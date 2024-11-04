const requestUsingBudgetClass = require('./request-using-budget.class');
const globalClass = require('../global/global.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const API_CONST = require('../../common/const/api.const');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const mssql = require('../../models/mssql');
const apiHelper = require('../../common/helpers/api.helper');
const serviceGlobal = require('../../modules/global/global.service');
const excelHelper = require('../../common/helpers/excel.helper');
const serviceUser = require('../../modules/user/user.service');
const logger = require('../../common/classes/logger.class');
const ServiceResponse = require('../../common/responses/service.response');
const appConfigService = require('../app-config/app-config.service');
const sql = require('mssql');
const { configKey, columns } = require('./utils/constants');
const config = require('../../../config/config');
const xl = require('excel4node');
const pdfHelper = require('../../common/helpers/pdf.helper');
const moment = require('moment');
const readXlsxFile = require('read-excel-file/node');
const { changeToSlug } = require('../../common/helpers/string.helper');
const getList = async (params = {}) => {
    try {
        const pool = await mssql.pool;
        const res = await pool
            .request()
            .input('KEYWORD', apiHelper.getValueFromObject(params, 'keyword'))
            .input('COMPANYID', apiHelper.getValueFromObject(params, 'company_id'))
            .input('BUDGETTYPEID', apiHelper.getValueFromObject(params, 'budget_type_id'))
            .input('ISACTIVE', apiHelper.getValueFromObject(params, 'is_active', API_CONST.ISACTIVE.ALL))
            .input('ISREVIEW', apiHelper.getValueFromObject(params, 'is_review'))
            .input('PAGESIZE', apiHelper.getValueFromObject(params, 'itemsPerPage', API_CONST.PAGINATION.LIMIT))
            .input('PAGEINDEX', apiHelper.getValueFromObject(params, 'page'))
            .input('USERNAME', apiHelper.getValueFromObject(params, 'auth_name'))
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(params, 'created_date_from'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(params, 'created_date_to'))
            .execute(PROCEDURE_NAME.FI_RQ_USINGBUDGET_GETLIST_ADMINWEB);
        return new ServiceResponse(true, '', {
            list: requestUsingBudgetClass.list(res.recordset),
            total: apiHelper.getTotalData(res.recordset),
            total_not_browse: res.recordsets[1]?.[0]?.TOTALNOTBROWSE || 0,
            total_browsed: res.recordsets[1]?.[0]?.TOTALBROWSED || 0,
            total_item: res.recordsets[1]?.[0]?.TOTALITEMS || 0,
        });
    } catch (error) {
        logger.error(error, { function: 'RequestUsingBudgetService.getList' });
        return new ServiceResponse(false, error);
    }
};

const createOrUpdate = async (id = null, params = {}) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        await transaction.begin();
        const createOrUpdate = new sql.Request(transaction);
        const res = await createOrUpdate
            .input('REQUESTUSINGBUDGETID', id)
            .input('REQUESTUSINGBUDGETCODE', apiHelper.getValueFromObject(params, 'request_using_budget_code'))
            .input('USERREQUEST', apiHelper.getValueFromObject(params, 'user_request'))
            .input('DEPARTMENTID', apiHelper.getValueFromObject(params, 'department_id'))
            .input('COMPANYID', apiHelper.getValueFromObject(params, 'company_id'))
            .input('BUDGETTYPEID', apiHelper.getValueFromObject(params, 'budget_type_id'))
            .input('TOTALREQUESTBUDGET', apiHelper.getValueFromObject(params, 'total_request_budget'))
            .input('ISACTIVE', apiHelper.getValueFromObject(params, 'is_active', API_CONST.ISACTIVE.ACTIVE))
            .input('CREATEDUSER', apiHelper.getValueFromObject(params, 'auth_name'))
            .execute(PROCEDURE_NAME.FI_RQ_USINGBUDGET_CREATEORUPDATE_ADMINWEB);
        if (!apiHelper.getResult(res.recordset)) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Lỗi tạo hoặc cập nhật đề nghị sử dụng ngân sách');
        }
        const idNew = apiHelper.getResult(res.recordset);
        //Cập nhật duyệt khi duyệt tự động
        const reqAutoReview = new sql.Request(transaction);
        const resAutoReview = await reqAutoReview
            .input('REQUESTUSINGBUDGETID', idNew)
            .input('BUDGETTYPEID', apiHelper.getValueFromObject(params, 'budget_type_id'))
            .execute(PROCEDURE_NAME.FI_RQ_USINGBUDGET_UPDATEAUTOREVIEW_ADMINWEB);
        if (!apiHelper.getResult(resAutoReview.recordset)) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Lỗi cập nhật duyệt');
        }
        //Mục tiêu sử dụng ngân sách
        const listBudgetGoal = apiHelper.getValueFromObject(params, 'list_budget_goal');
        if (listBudgetGoal?.length > 0) {
            // Xóa
            if (id) {
                const listBudgetGoalId = listBudgetGoal.map((x) => x.budget_goal_id);
                const deleteBudgetGoal = new sql.Request(transaction);
                const resDeleteBudgetGoal = await deleteBudgetGoal
                    .input('REQUESTUSINGBUDGETID', id)
                    .input('LISTID', listBudgetGoalId.join(','))
                    .execute(PROCEDURE_NAME.FI_BUDGETGOAL_DELETEMANY_ADMINWEB);
                if (!apiHelper.getResult(resDeleteBudgetGoal.recordset)) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Lỗi xóa mục tiêu sử dụng ngân sách');
                }
            }
            //Cập nhật hoặc tạo mới
            const createBudgetGoal = new sql.Request(transaction);
            for (const element of listBudgetGoal) {
                const resBudgetGoal = await createBudgetGoal
                    .input('BUDGETGOALID', apiHelper.getValueFromObject(element, 'budget_goal_id'))
                    .input('DOCUMENTTYPEID', apiHelper.getValueFromObject(element, 'document_type_id'))
                    .input('DOCUMENTCODE', apiHelper.getValueFromObject(element, 'document_code'))
                    .input('ITEMID', apiHelper.getValueFromObject(element, 'item_id'))
                    .input('REQUESTBUDGET', apiHelper.getValueFromObject(element, 'request_budget'))
                    .input('REQUESTBUDGETREVIEW', apiHelper.getValueFromObject(element, 'request_budget_review'))
                    .input('EXPLAIN', apiHelper.getValueFromObject(element, 'explain'))
                    .input('REQUESTUSINGBUDGETID', idNew)
                    .execute(PROCEDURE_NAME.FI_BUDGETGOAL_CRETATEORUPDATE_ADMINWEB);
                if (!apiHelper.getResult(resBudgetGoal.recordset)) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Lỗi tạo hoặc cập nhật mục tiêu sử dụng ngân sách');
                }
            }
        }
        const listReview = apiHelper.getValueFromObject(params, 'list_review');
        // Xoá duyệt đã có của đề nghị sử dung ngân sách
        if (id) {
            const deleteReview = new sql.Request(transaction);
            const resDeleteReview = await deleteReview
                .input('REQUESTUSINGBUDGETID', id)
                .input('DELETEDUSER', apiHelper.getValueFromObject(params, 'auth_name', null))
                .execute(PROCEDURE_NAME.FI_BUDGETREVIEWLIST_DELETEMANY_ADMINWEB);
            if (!apiHelper.getResult(resDeleteReview.recordset)) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Lỗi xóa thông tin duyệt của đề nghị sử dụng ngân sách');
            }
        }
        if (listReview?.length > 0) {
            const createOrUpdateReview = new sql.Request(transaction);
            for (const element of listReview) {
                const resCreateOrUpdateReview = await createOrUpdateReview
                    .input('BUDGETREVIEWLISTID', apiHelper.getValueFromObject(element, 'budget_review_list_id'))
                    .input(
                        'BUDGETTYPEREVIEWLEVELID',
                        apiHelper.getValueFromObject(element, 'budget_type_review_level_id'),
                    )
                    .input('REVIEWUSER', apiHelper.getValueFromObject(element, 'review_user'))
                    .input('BUDGETREVIEWLISTNAME', apiHelper.getValueFromObject(element, 'budget_review_list_name'))
                    .input('REQUESTUSINGBUDGETID', idNew)
                    .input('CREATEDUSER', apiHelper.getValueFromObject(params, 'auth_name', null))
                    .execute(PROCEDURE_NAME.FI_BUDGETREVIEWLIST_CREATEORUPDATE_ADMINWEB);
                if (!apiHelper.getResult(resCreateOrUpdateReview.recordset)) {
                    await transaction.rollback();
                    return new ServiceResponse(
                        false,
                        'Lỗi tạo hoặc cập nhật thông tin duyệt của đề nghị sử dụng ngân sách',
                    );
                }
            }
        }
        removeCacheOptions();
        await transaction.commit();
        return new ServiceResponse(true, '');
    } catch (error) {
        transaction.rollback();
        logger.error(error, { function: 'RequestUsingBudgetService.createOrUpdate' });
        return new ServiceResponse(false, error);
    }
};

const detail = async (params) => {
    try {
        const pool = await mssql.pool;
        const res = await pool
            .request()
            .input('REQUESTUSINGBUDGETID', apiHelper.getValueFromObject(params, 'id'))
            .input('USERNAME', apiHelper.getValueFromObject(params, 'auth_name'))
            .execute(PROCEDURE_NAME.FI_RQ_USINGBUDGET_GETBYID_ADMINWEB);
        let list_review = requestUsingBudgetClass.listReview(res.recordsets[2]);
        let list_user = requestUsingBudgetClass.listUser(res.recordsets[3]);
        list_review = (list_review || []).map((x) => ({
            ...x,
            users: list_user.filter((user) => user.budget_type_review_level_id === x.budget_type_review_level_id),
        }));
        return new ServiceResponse(true, '', {
            ...requestUsingBudgetClass.detail(res.recordset[0]),
            list_budget_goal: requestUsingBudgetClass.listBudgetGoal(res.recordsets[1]),
            list_review: list_review,
        });
    } catch (error) {
        logger.error(error, { function: 'RequestUsingBudgetService.detail' });
        return new ServiceResponse(false, error);
    }
};

const remove = async (bodyParams) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        let list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []);
        await transaction.begin();
        const deleteRequestUsingBudget = new sql.Request(transaction);
        for (const item of list_id) {
            const data = await deleteRequestUsingBudget
                .input('REQUESTUSINGBUDGETID', item)
                .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .execute(PROCEDURE_NAME.FI_RQ_USINGBUDGET_DELETE_ADMINWEB);
            if (!apiHelper.getResult(data.recordset)) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Lỗi xóa đề nghị sử dụng ngân sách');
            }
        }
        await transaction.commit();
        removeCacheOptions();
        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, { function: 'ManufacturerService.deleteManufacturer' });
        return new ServiceResponse(false, e.message);
    }
};

const createRequestUsingBudgetCode = async () => {
    try {
        const pool = await mssql.pool;
        const res = await pool.request().execute(PROCEDURE_NAME.FI_RQ_USINGBUDGET_CREATECODE_ADMINWEB);
        return new ServiceResponse(true, '', apiHelper.getResult(res.recordset));
    } catch (error) {
        logger.error(error, { function: 'RequestUsingBudgetService.createRequestUsingBudgetCode' });
        return new ServiceResponse(false, error);
    }
};

const removeCacheOptions = () => {
    return cacheHelper.removeByKey(CACHE_CONST.MD_SOURCE_OPTIONS);
};

const getTotalRemainingAllocationBudget = async (params) => {
    try {
        const pool = await mssql.pool;
        const res = await pool
            .request()
            .input('DEPARTMENTID', apiHelper.getValueFromObject(params, 'department_id'))
            .execute(PROCEDURE_NAME.FI_BUDGETPLAN_DISTRIBUTION_GETBYDEPARTMENTID_ADMINWEB);
        const result = requestUsingBudgetClass.listBugetPlanDistribution(res.recordset[0]);
        return new ServiceResponse(true, '', {
            ...result,
            total_remaining_allocation_budget: result.total_budget_plan - result.total_budget_used,
        });
    } catch (error) {
        logger.error(error, { function: 'RequestUsingBudgetService.getTotalRemainingAllocationBudget' });
        return new ServiceResponse(false, error);
    }
};
//Lấy mức duyệt theo tổng ngân sách đề nghị
const getListReview = async (params) => {
    try {
        const pool = await mssql.pool;
        const res = await pool
            .request()
            .input('BUDGETTYPEID', apiHelper.getValueFromObject(params, 'budget_type_id'))
            .input('TOTALBUDGET', apiHelper.getValueFromObject(params, 'total_budget'))
            .execute(PROCEDURE_NAME.FI_BUDGETTYPE_REVIEWLEVEL_GETREVIEW_ADMINWEB);
        let result = requestUsingBudgetClass.listReview(res.recordsets[0]);
        const list_user = requestUsingBudgetClass.listUser(res.recordsets[1]);
        const is_auto_review = apiHelper.getResult(res.recordsets[3]);
        result = (result || []).map((x) => ({
            ...x,
            users: list_user.filter((user) => user.budget_type_review_level_id === x.budget_type_review_level_id),
        }));
        if (result.length > 0 || is_auto_review) {
            return new ServiceResponse(true, '', result);
        }
        // Khi không nằm trong ngân sách của loại ngân sách
        const { data } = await appConfigService.getPageConfig({ page: 'FI' });
        const poolUser = await mssql.pool;
        const resUser = await poolUser
            .request()
            .input('DEPARTMENTID', data[configKey.departmentId]?.value)
            .input('POSITIONID', data[configKey.positionId]?.value)
            .execute(PROCEDURE_NAME.SYS_USER_GETUSERDEPARTMENTPOSITION_ADMINWEB);
        return new ServiceResponse(true, '', [
            { users: globalClass.optionsGlobal(resUser.recordset), isLevelOut: true },
        ]);
    } catch (error) {
        logger.error(error, { function: 'RequestUsingBudgetService.getListReview' });
        return new ServiceResponse(false, error);
    }
};

const getAllRequestPurchase = async () => {
    try {
        const pool = await mssql.pool;
        const res = await pool.request().execute(PROCEDURE_NAME.SL_REQUESTPURCHASE_GETALL_ADMINWEB);
        return new ServiceResponse(true, '', requestUsingBudgetClass.listRequestPurchase(res.recordset));
    } catch (error) {
        logger.error(error, { function: 'RequestUsingBudgetService.getAllRequestPurchase' });
        return new ServiceResponse(false, error);
    }
};

const updateReview = async (params) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        await transaction.begin();
        const reqUpdateReview = new sql.Request(transaction);
        const resUpdateReview = await reqUpdateReview
            .input('BUDGETREVIEWLISTID', apiHelper.getValueFromObject(params, 'budget_review_list_id'))
            .input('REQUESTUSINGBUDGETID', apiHelper.getValueFromObject(params, 'request_using_budget_id'))
            .input('ISREVIEW', apiHelper.getValueFromObject(params, 'is_review'))
            .input('REVIEWNOTE', apiHelper.getValueFromObject(params, 'review_note'))
            .execute(PROCEDURE_NAME.FI_BUDGETREVIEWLIST_UPDATEREVIEW_ADMINWEB);
        if (!apiHelper.getResult(resUpdateReview.recordset)) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Lỗi cập nhật duyệt đề nghị sử dụng ngân sách');
        }
        const listBudgetGoal = apiHelper.getValueFromObject(params, 'list_budget_goal');
        if (listBudgetGoal?.length > 0) {
            const createBudgetGoal = new sql.Request(transaction);
            for (const element of listBudgetGoal) {
                const resBudgetGoal = await createBudgetGoal
                    .input('BUDGETGOALID', apiHelper.getValueFromObject(element, 'budget_goal_id'))
                    .input('DOCUMENTTYPEID', apiHelper.getValueFromObject(element, 'document_type_id'))
                    .input('DOCUMENTCODE', apiHelper.getValueFromObject(element, 'document_code'))
                    .input('ITEMID', apiHelper.getValueFromObject(element, 'item_id'))
                    .input('REQUESTBUDGET', apiHelper.getValueFromObject(element, 'request_budget'))
                    .input('REQUESTBUDGETREVIEW', apiHelper.getValueFromObject(element, 'request_budget_review'))
                    .input('EXPLAIN', apiHelper.getValueFromObject(element, 'explain'))
                    .input('REQUESTUSINGBUDGETID', apiHelper.getValueFromObject(params, 'request_using_budget_id'))
                    .execute(PROCEDURE_NAME.FI_BUDGETGOAL_CRETATEORUPDATE_ADMINWEB);
                if (!apiHelper.getResult(resBudgetGoal.recordset)) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Lỗi tạo hoặc cập nhật mục tiêu sử dụng ngân sách');
                }
            }
        }

        await transaction.commit();
        return new ServiceResponse(true, '');
    } catch (error) {
        logger.error(error, { function: 'RequestUsingBudgetService.updateReview' });
        return new ServiceResponse(false, error);
    }
};

const exportExcel = async (params = {}) => {
    try {
        params.itemsPerPage = API_CONST.MAX_EXPORT_EXCEL;
        const res = await getList(params);
        const { list } = res.getData();
        const wb = excelHelper.addWorksheet(
            new xl.Workbook(),
            'Danh sách đề nghị sử dụng ngân sách',
            'DS_DE_NGHI_SU_DUNG_NGAN_SACH',
            [
                {
                    width: 10,
                    title: 'STT',
                    formatter: (_, index) => index + 1,
                },
                {
                    width: 20,
                    title: 'Mã phiếu',
                    field: 'request_using_budget_code',
                },
                {
                    width: 20,
                    title: 'Người đề nghị',
                    field: 'full_name',
                },
                {
                    width: 20,
                    title: 'Phòng ban đề nghị',
                    field: 'department_name',
                },
                {
                    width: 20,
                    title: 'Tổng tiền đề nghị',
                    field: 'total_requset_budget',
                },
                {
                    width: 50,
                    title: 'Công ty áp dụng',
                    field: 'company_name',
                },
                {
                    width: 10,
                    title: 'Ngày tạo',
                    field: 'create_date',
                },
            ],
            list,
        );
        return new ServiceResponse(true, '', wb);
    } catch (error) {
        logger.error(error, { function: 'RequestUsingBudgetService.exportExcel' });
        return new ServiceResponse(false, error);
    }
};

const downloadTemplate = async () => {
    try {
        let resBudgetType = await serviceGlobal.getOptionsCommon({ type: 'budgetType' });
        let dataBudgetType = resBudgetType.getData().map((x) => ({
            ...x,
            full_name: `${x.id}-${x.name}`,
        }));
        let resUser = await serviceGlobal.getOptionsCommon({ type: 'user' });
        let wb = excelHelper.addWorksheet(
            new xl.Workbook(),
            'Danh sách đề nghị sử dụng ngân sách',
            'DS_DE_NGHI_SU_DUNG_NGAN_SACH',
            [
                {
                    width: 10,
                    title: 'STT',
                    formatter: (_, index) => index + 1,
                },
                {
                    width: 20,
                    title: columns.full_name,
                    validate: {
                        type: 'list',
                        allowBlank: true,
                        prompt: 'Chọn giá trị',
                        error: 'Giá trị không hợp lệ',
                        showDropDown: true,
                        sqref: 'B2:B1000',
                        formulas: [`='DS_NGUOI_DUNG'!$C$2:$C$${1 + resUser?.getData().length}`],
                    },
                },
                {
                    width: 20,
                    title: columns.budget_type_id,
                    validate: {
                        type: 'list',
                        allowBlank: true,
                        prompt: 'Chọn giá trị',
                        error: 'Giá trị không hợp lệ',
                        showDropDown: true,
                        sqref: 'C2:C1000',
                        formulas: [`='DS_LOAI_NGAN_SACH'!$C$2:$C$${1 + resBudgetType?.getData().length}`],
                    },
                },
                {
                    width: 20,
                    title: columns.is_active,
                },
            ],
        );
        wb = excelHelper.addWorksheet(
            wb,
            'Danh sách người dùng',
            'DS_NGUOI_DUNG',
            [
                {
                    width: 10,
                    title: 'STT',
                    formatter: (_, index) => index + 1,
                },
                {
                    width: 20,
                    title: 'Id',
                    field: 'id',
                },
                {
                    width: 20,
                    title: 'Người dùng',
                    field: 'name',
                },
            ],
            resUser.getData(),
        );
        wb = excelHelper.addWorksheet(
            wb,
            'Danh sách loại ngân sách',
            'DS_LOAI_NGAN_SACH',
            [
                {
                    width: 10,
                    title: 'STT',
                    formatter: (_, index) => index + 1,
                },
                {
                    width: 20,
                    title: 'Id',
                    field: 'id',
                },
                {
                    width: 20,
                    title: 'Tên loại ngân sách',
                    field: 'full_name',
                },
            ],
            dataBudgetType,
        );
        return new ServiceResponse(true, '', wb);
    } catch (error) {
        logger.error(e, { function: 'RequestUsingBudgetService.downloadTemplate' });
        return new ServiceResponse(false, e.message || e);
    }
};

const checkRequestUsingBudgetImport = async (requestUsingBudget) => {
    let errmsg = [];
    try {
        let arrVal = ['co', 'khong', '1', '0'];
        let { full_name = null, budget_type_id = null, is_active = null } = requestUsingBudget || {};
        if (!full_name) errmsg.push('Tên người đề nghị là bắt buộc');
        if (!budget_type_id) errmsg.push('Tính chất là bắt buộc');
        if (!is_active) {
            errmsg.push('Kích hoạt là bắt buộc.');
        } else {
            if (!arrVal.includes(changeToSlug(is_active))) {
                errmsg.push('Kích hoạt vui lòng nhập có/không hoặc 1/0.');
            }
        }
        if (is_active) {
            if (isNaN(is_active)) {
                is_active = changeToSlug(is_active) == 'co' ? 1 : 0;
            } else {
                is_active = is_active == 1 ? 1 : 0;
            }
        }
        let userName = +full_name.split('-')[0];
        let user = await serviceUser.findByUserName(userName);
        let code = await createRequestUsingBudgetCode();
        let item = {
            ...requestUsingBudget,
            request_using_budget_code: code.getData(),
            department_id: user.department_id,
            company_id: user.company_id,
            user_request: userName,
            budget_type_id: +budget_type_id.split('-')[0],
            is_active: is_active,
        };
        return { errmsg, item };
    } catch (error) {
        errmsg.push(error.message, requestUsingBudget);
        return { errmsg, item };
    }
};

const importExcel = async (bodyParams = {}) => {
    try {
        const pathUpload = apiHelper.getValueFromObject(bodyParams, 'path_upload');
        const auth_name = apiHelper.getValueFromObject(bodyParams, 'auth_name', 'administrator');
        const rows = await readXlsxFile(pathUpload);
        let data = excelHelper.getValueExcel(rows, columns);
        let pool = await mssql.pool;
        let import_data = [];
        let import_errors = [];
        let import_total = 0;
        for (let i = 0; i < data.length; i++) {
            import_total += 1;
            let requestUsingBudget = data[i];
            let { errmsg, item } = await checkRequestUsingBudgetImport(requestUsingBudget);
            if (errmsg && errmsg.length > 0) {
                import_errors.push({
                    requestUsingBudget,
                    errmsg,
                    i,
                });
            } else {
                try {
                    let res = await createOrUpdate(null, { ...item, auth_name });
                    if (res.isFailed()) {
                        import_errors.push({
                            requestUsingBudget,
                            errmsg: [res.getMessage()],
                            i,
                        });
                    }
                    import_data.push(res.getData());
                } catch (error) {
                    import_errors.push({
                        requestUsingBudget,
                        errmsg: [error.message],
                        i,
                    });
                }
            }
        }
        return new ServiceResponse(true, '', { import_data, import_total, import_errors });
    } catch (e) {
        logger.error(e, { function: 'AccountingAccountService.importExcel' });
        return new ServiceResponse(false, error);
    }
};

const exportPDF = async (request_using_budget_id) => {
    try {
        const res = await detail(request_using_budget_id);
        const data = res.getData();
        const fileName = `Phieu_de_nghi_su_dung_${moment().format('DDMMYYYY_HHmmss')}`;
        const print_params = {
            template: 'request-using-budget.html',
            data: data,
            filename: fileName,
        };
        await pdfHelper.printPDF(print_params);

        return new ServiceResponse(true, '', { path: `${config.domain_cdn}pdf/${fileName}.pdf` });
    } catch (e) {
        logger.error(e, { function: 'RequestUsingBudgetService.exportPDF' });
        return new ServiceResponse(false, e.message || e);
    }
};

//Get tree item
const getTree = async (params = {}) => {
    try {
        const pool = await mssql.pool;
        const res = await pool
            .request()
            .input('PARENTID', apiHelper.getValueFromObject(params, 'parent_id'))
            .execute(PROCEDURE_NAME.FI_ITEM_GETTREE_ADMINWEB);
        return new ServiceResponse(true, '', requestUsingBudgetClass.tree(res.recordset));
    } catch (error) {
        logger.error(error, { function: 'RequestUsingBudgetService.getTree' });
        return new ServiceResponse(false, error, []);
    }
};
module.exports = {
    getList,
    createOrUpdate,
    detail,
    remove,
    createRequestUsingBudgetCode,
    getTotalRemainingAllocationBudget,
    getListReview,
    getAllRequestPurchase,
    updateReview,
    exportExcel,
    exportPDF,
    downloadTemplate,
    importExcel,
    getTree,
};
