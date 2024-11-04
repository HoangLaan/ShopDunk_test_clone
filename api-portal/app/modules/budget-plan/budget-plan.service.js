const mssql = require('../../models/mssql');
const sql = require('mssql');
const apiHelper = require('../../common/helpers/api.helper');
const API_CONST = require('../../common/const/api.const');
const logger = require('../../common/classes/logger.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const ServiceResponse = require('../../common/responses/service.response');
const optionService = require('../../common/services/options.service');
const BudgetPlanClass = require('./budget-plan.class');
const xl = require('excel4node');
const readXlsxFile = require('read-excel-file/node');
const excelHelper = require('../../common/helpers/excel.helper');
const { getOptionsCommon } = require('../global/global.service');

const getBudgetPlanList = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getValueFromObject(queryParams, 'keyword');
        const createDateFrom = apiHelper.getValueFromObject(queryParams, 'created_date_from');
        const createDateTo = apiHelper.getValueFromObject(queryParams, 'created_date_to');

        const pool = await mssql.pool;
        const resData = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('KEYWORD', keyword)
            .input('COMPANYID', apiHelper.getValueFromObject(queryParams, 'company_id'))
            .input('DEPARTMENTID', apiHelper.getValueFromObject(queryParams, 'department_id'))
            .execute('FI_BUDGETPLAN_GetList_AdminWeb');

        let departmentList = BudgetPlanClass.departmentList(resData.recordsets[2]);
        const budgetList = BudgetPlanClass.budgetList(resData.recordsets[1]);

        departmentList = departmentList.map((item) => {
            return {
                ...item,
                budget_list: budgetList.filter((budget) => parseInt(budget.department_id) === item.department_id),
            };
        });

        return new ServiceResponse(true, '', {
            data: departmentList,
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(resData.recordset),
        });
    } catch (e) {
        logger.error(e, { function: 'BudgetPlanService.getBudgetPlanList' });

        return new ServiceResponse(true, '', {});
    }
};

const createBudgetPlan = async (bodyParams = {}) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    await transaction.begin();
    try {
        let budget_plan_date_from = '01/' + (apiHelper.getValueFromObject(bodyParams, 'budget_plan_date_from')).toString();
        let budget_plan_date_to = '01/' + (apiHelper.getValueFromObject(bodyParams, 'budget_plan_date_to')).toString();

        const company_id = apiHelper.getValueFromObject(bodyParams, 'company_id', null);
        // const isApplyAllDepartment = apiHelper.getValueFromObject(bodyParams, 'is_apply_all_department', null);
        const auth_name = apiHelper.getValueFromObject(bodyParams, 'updated_user')
        const budget_plan_id = apiHelper.getValueFromObject(bodyParams, 'budget_plan_id')

        const request = new sql.Request(transaction);
        const budgetPlan = await request
            .input('BUDGETPLANID', apiHelper.getValueFromObject(bodyParams, 'budget_plan_id'))
            .input('COMPANYID', company_id)
            .input('BUDGETPLANNAME', apiHelper.getValueFromObject(bodyParams, 'budget_plan_name'))
            .input('BUDGETPLANDATEFROM', budget_plan_date_from)
            .input('BUDGETPLANDATETO', budget_plan_date_to)
            // .input('ISAPPLYALLDEPARTMENT', isApplyAllDepartment)
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active', API_CONST.ISACTIVE.ALL))
            .input('CREATEDUSER', auth_name)
            .input('ISREVIEW', apiHelper.getValueFromObject(bodyParams, 'is_review'))
            .input('NOTE', apiHelper.getValueFromObject(bodyParams, 'note'))
            .execute('FI_BUDGETPLAN_CreateOrUpdate_AdminWeb');
        const budgetPlanID = budgetPlan.recordset[0].RESULT;
        if (!budgetPlanID) {
            await transaction.rollback()
            return new ServiceResponse(false, 'Có lỗi xảy ra !')
        }

        //Delete
        if (budget_plan_id) {
            const requestDelete = new sql.Request(transaction);
            const resDelete = await requestDelete
                .input('BUDGETPLANID', budget_plan_id)
                .input('DELETEDUSER', auth_name)
                .execute('FI_BUDGETPLAN_DISTRIBUTION_DeleteByBudgetPlan_AdminWeb');
            if (!resDelete.recordset[0].RESULT) {
                await transaction.rollback()
                return new ServiceResponse(false, 'Có lỗi xảy ra !')
            }
        }


        const listBudgets = apiHelper.getValueFromObject(bodyParams, 'budgets', []);
        const listDepartments = apiHelper.getValueFromObject(bodyParams, 'departments', []);
        if (listBudgets && listBudgets.length > 0 && listDepartments && listDepartments.length > 0) {
            const request4 = new sql.Request(transaction);
            for (let j = 0; j < listDepartments.length; j++) {
                const department = listDepartments[j];
                for (let i = 0; i < listBudgets.length; i++) {
                    const budget = listBudgets[i];
                    const res4 = await request4
                        .input('BUDGETPLANID', budgetPlanID)
                        .input('BUDGETID', budget)
                        .input('DEPARTMENTID', apiHelper.getValueFromObject(department, 'id'))
                        .input('CREATEDUSER', auth_name)
                        .execute('FI_BUDGETPLAN_DISTRIBUTION_Create_AdminWeb');
                    const budget_plan_distribution_id = res4.recordset[0].RESULT
                    if (!budget_plan_distribution_id) {
                        await transaction.rollback()
                        return new ServiceResponse(false, 'Có lỗi xảy ra !');
                    }
                }
            }
        }

        await transaction.commit();
        return new ServiceResponse(true, 'Thêm kế hoạch ngân sách thành công', {});
    } catch (error) {
        await transaction.rollback();
        logger.error(error, { function: 'BudgetPlanService.create' });
        return new ServiceResponse(false, error.message);
    }
}

const getById = async budgetPlanId => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('BUDGETPLANID', budgetPlanId)
            .execute(PROCEDURE_NAME.FI_BUDGETPLAN_GETBYID_ADMINWEB);

        if (!data.recordsets[0]) {
            return new ServiceResponse(false, 'Không tìm thấy loại công việc');
        }
        const dataRes = BudgetPlanClass.detail(data.recordsets[0][0])
        dataRes['departments'] = []
        data.recordsets[1].forEach(item => {
            dataRes['departments'].push({ id: item.DEPARTMENTID, value: item.DEPARTMENTID });
        });

        return new ServiceResponse(true, '', dataRes);
    } catch (error) {
        logger.error(error, { function: 'BudgetPlanService.getById' });
        return new ServiceResponse(false, error.message);
    }
};

const getTotalBudgetPlan = async (bodyParams) => {
    try {
        const pool = await mssql.pool;
        const budget_plan_id = apiHelper.getValueFromObject(bodyParams, 'budget_plan_id')
        let array_result = []

        const res = await pool.request()
            .input('BUDGETPLANID', budget_plan_id)
            .execute('FI_BUDGETPLAN_GetById_AdminWeb_V2');
        let listDepartments = BudgetPlanClass.departmentAndBudget(res.recordsets[1] || [])
        let listBudgets = BudgetPlanClass.departmentAndBudget(res.recordsets[2] || [])

        if (listDepartments && listDepartments.length > 0) {
            for (let i = 0; i < listDepartments.length; i++) {
                const item = listDepartments[i];
                const data = await pool
                    .request()
                    .input('DEPARTMENTID', apiHelper.getValueFromObject(item, 'department_id'))
                    .execute('FI_BUDGETPLAN_TOTAL_GetList_AdminWeb');
                const dataRes = BudgetPlanClass.listTotal(data.recordsets[0]);
                if (dataRes && dataRes.length > 0) {
                    array_result.push(dataRes[0])
                }
            }
        }

        return new ServiceResponse(true, '', { array_result, listDepartments, listBudgets });
    } catch (error) {
        logger.error(error, { function: 'BudgetPlanService.getTotalBudgetPlan' });
        return new ServiceResponse(false, error.message);
    }
};

const currencyFormat = (num) => {
    if (!Boolean(num)) return '0';
    return num.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });
};

const exportExcelBudgetPlan = async (queryParams = {}) => {
    try {
        queryParams.itemsPerPage = API_CONST.MAX_EXPORT_EXCEL;
        queryParams.parent_id = null;
        queryParams.is_export = true;

        let resService = await getBudgetPlanList(queryParams);
        let { data } = resService.getData();

        data = data
            .map((department) => {
                return department.budget_list?.map((budget) => {
                    return { department_name: department.department_name, ...budget };
                });
            })
            ?.flat();

        let sheet = excelHelper.addWorksheet(
            new xl.Workbook(),
            'DANH SÁCH DÒNG TIỀN',
            'Danh sách dòng tiền',
            [
                {
                    width: 7,
                    title: 'STT',
                    formatter: (_, index) => index + 1,
                },
                {
                    width: 23,
                    title: 'Tên phòng ban',
                    field: 'department_name',
                },
                {
                    width: 16,
                    title: 'Mã ngân sách',
                    field: 'budget_code',
                },
                {
                    width: 23,
                    title: 'Tên ngân sách',
                    field: 'budget_name',
                },
                {
                    width: 40,
                    title: 'Mã khoản mục',
                    field: 'item_codes',
                },
                {
                    width: 40,
                    title: 'Tên công ty',
                    field: 'company_name',
                },
                {
                    width: 12,
                    title: 'Kế hoạch T1',
                    formatter: (item, index) =>
                        item.january_plan === 0
                            ? 0
                            : `${currencyFormat(item.january_used)}/${currencyFormat(item.january_plan)}`,
                },
                {
                    width: 12,
                    title: 'Kế hoạch T2',
                    formatter: (item, index) =>
                        item.february_plan === 0
                            ? 0
                            : `${currencyFormat(item.february_used)}/${currencyFormat(item.february_plan)}`,
                },
                {
                    width: 12,
                    title: 'Kế hoạch T3',
                    formatter: (item, index) =>
                        item.march_plan === 0
                            ? 0
                            : `${currencyFormat(item.march_used)}/${currencyFormat(item.march_plan)}`,
                },
                {
                    width: 12,
                    title: 'Kế hoạch T4',
                    formatter: (item, index) =>
                        item.april_plan === 0
                            ? 0
                            : `${currencyFormat(item.april_used)}/${currencyFormat(item.april_plan)}`,
                },
                {
                    width: 12,
                    title: 'Kế hoạch T5',
                    formatter: (item, index) =>
                        item.may_plan === 0 ? 0 : `${currencyFormat(item.may_used)}/${currencyFormat(item.may_plan)}`,
                },
                {
                    width: 12,
                    title: 'Kế hoạch T6',
                    formatter: (item, index) =>
                        item.june_plan === 0
                            ? 0
                            : `${currencyFormat(item.june_used)}/${currencyFormat(item.june_plan)}`,
                },
                {
                    width: 12,
                    title: 'Kế hoạch T7',
                    formatter: (item, index) =>
                        item.july_plan === 0
                            ? 0
                            : `${currencyFormat(item.july_used)}/${currencyFormat(item.july_plan)}`,
                },
                {
                    width: 12,
                    title: 'Kế hoạch T8',
                    formatter: (item, index) =>
                        item.august_plan === 0
                            ? 0
                            : `${currencyFormat(item.august_used)}/${currencyFormat(item.august_plan)}`,
                },
                {
                    width: 12,
                    title: 'Kế hoạch T9',
                    formatter: (item, index) =>
                        item.september_plan === 0
                            ? 0
                            : `${currencyFormat(item.september_used)}/${currencyFormat(item.september_plan)}`,
                },
                {
                    width: 12,
                    title: 'Kế hoạch T10',
                    formatter: (item, index) =>
                        item.october_plan === 0
                            ? 0
                            : `${currencyFormat(item.october_used)}/${currencyFormat(item.october_plan)}`,
                },
                {
                    width: 12,
                    title: 'Kế hoạch T11',
                    formatter: (item, index) =>
                        item.november_plan === 0
                            ? 0
                            : `${currencyFormat(item.november_used)}/${currencyFormat(item.november_plan)}`,
                },
                {
                    width: 12,
                    title: 'Kế hoạch T12',
                    formatter: (item, index) =>
                        item.december_plan === 0
                            ? 0
                            : `${currencyFormat(item.december_used)}/${currencyFormat(item.december_plan)}`,
                },
            ],
            data,
        );

        return new ServiceResponse(true, '', sheet);
    } catch (error) {
        logger.error(error, { function: 'BudgetPlanService.exportExcel' });
        return new ServiceResponse(false, error);
    }
};

const downloadTemplateBudgetPlan = async () => {
    try {
        // Department
        const departmentOptionsRes = await getOptionsCommon({ type: 'departmentExcel' });
        if (departmentOptionsRes.isFailed()) {
            throw budgetOptionsRes;
        }
        const departmentOptions = departmentOptionsRes.getData();

        // Company
        const budgetOptionsRes = await getOptionsCommon({ type: 'budgetExcel' });
        if (budgetOptionsRes.isFailed()) {
            throw budgetOptionsRes;
        }
        const budgetOptions = budgetOptionsRes.getData();

        let sheet = excelHelper.addWorksheet(
            new xl.Workbook(),
            'DANH SÁCH DÒNG TIỀN',
            'Danh sách dòng tiền',
            [
                {
                    width: 7,
                    title: 'STT',
                    formatter: (_, index) => index + 1,
                },
                {
                    width: 30,
                    title: 'Tên kế hoạch ngân sách*',
                    field: 'budget_plan_name',
                },
                {
                    width: 20,
                    title: 'Tất cả phòng ban*',
                    field: 'is_apply_all_department',
                    validate: {
                        type: 'list',
                        allowBlank: true,
                        prompt: 'Chọn giá trị',
                        error: 'Giá trị không hợp lệ',
                        showDropDown: true,
                        formulas: ['1-Có, 0-Không'],
                    },
                },
                {
                    width: 75,
                    title: 'Phòng ban1*',
                    field: 'department_id1',
                    validate: {
                        type: 'list',
                        allowBlank: true,
                        prompt: 'Chọn giá trị',
                        error: 'Giá trị không hợp lệ',
                        showDropDown: true,
                        formulas: [`='Danh sách phòng ban'!$C$2:$C$${1 + departmentOptions?.length}`],
                    },
                },
                {
                    width: 75,
                    title: 'Phòng ban2',
                    field: 'department_id2',
                    validate: {
                        type: 'list',
                        allowBlank: true,
                        prompt: 'Chọn giá trị',
                        error: 'Giá trị không hợp lệ',
                        showDropDown: true,
                        formulas: [`='Danh sách phòng ban'!$C$2:$C$${1 + departmentOptions?.length}`],
                    },
                },
                {
                    width: 75,
                    title: 'Phòng ban3',
                    field: 'department_id3',
                    validate: {
                        type: 'list',
                        allowBlank: true,
                        prompt: 'Chọn giá trị',
                        error: 'Giá trị không hợp lệ',
                        showDropDown: true,
                        formulas: [`='Danh sách phòng ban'!$C$2:$C$${1 + departmentOptions?.length}`],
                    },
                },
                {
                    width: 75,
                    title: 'Ngân sách1*',
                    field: 'budget_id1',
                    validate: {
                        type: 'list',
                        allowBlank: true,
                        prompt: 'Chọn giá trị',
                        error: 'Giá trị không hợp lệ',
                        showDropDown: true,
                        formulas: [`='Danh sách ngân sách'!$C$2:$C$${1 + budgetOptions?.length}`],
                    },
                },
                {
                    width: 75,
                    title: 'Ngân sách2',
                    field: 'budget_id2',
                    validate: {
                        type: 'list',
                        allowBlank: true,
                        prompt: 'Chọn giá trị',
                        error: 'Giá trị không hợp lệ',
                        showDropDown: true,
                        formulas: [`='Danh sách ngân sách'!$C$2:$C$${1 + budgetOptions?.length}`],
                    },
                },
                {
                    width: 75,
                    title: 'Ngân sách3',
                    field: 'budget_id3',
                    validate: {
                        type: 'list',
                        allowBlank: true,
                        prompt: 'Chọn giá trị',
                        error: 'Giá trị không hợp lệ',
                        showDropDown: true,
                        formulas: [`='Danh sách ngân sách'!$C$2:$C$${1 + budgetOptions?.length}`],
                    },
                },
                {
                    width: 10,
                    title: 'Từ tháng*',
                    field: 'from_month',
                },
                {
                    width: 10,
                    title: 'Từ năm*',
                    field: 'from_year',
                },
                {
                    width: 10,
                    title: 'Đến tháng*',
                    field: 'to_month',
                },
                {
                    width: 10,
                    title: 'Đến năm*',
                    field: 'to_year',
                },
                {
                    width: 13,
                    title: 'Trạng thái',
                    field: 'is_active',
                    validate: {
                        type: 'list',
                        allowBlank: true,
                        prompt: 'Chọn giá trị',
                        error: 'Giá trị không hợp lệ',
                        showDropDown: true,
                        formulas: ['1-Kích hoạt, 0-Ẩn'],
                    },
                },
            ],
            [
                {
                    budget_plan_name: 'Kế hoạch ngân sách 1',
                    is_apply_all_department: '1-Có',
                    department_id1: 'Bắt buộc khi Tất cả phòng ban = 0-Không',
                    department_id2: null,
                    department_id3: null,
                    budget_id1: 'Bắt buộc',
                    budget_id2: null,
                    budget_id3: null,
                    from_month: 'Bắt buộc',
                    from_year: 'Bắt buộc',
                    to_month: 'Bắt buộc',
                    to_year: 'Bắt buộc',
                    is_active: '1-Kích hoạt',
                },
            ],
        );

        sheet = excelHelper.addWorksheet(
            sheet,
            null,
            'Danh sách phòng ban',
            [
                {
                    width: 10,
                    title: 'Id',
                    field: 'id',
                },
                {
                    width: 75,
                    title: 'Tên phòng ban',
                    field: 'name',
                },
                {
                    width: 30,
                    title: 'Option values',
                    formatter: (row, index) => `${row.id}-${row.parent_id}-${row.name}`,
                },
            ],
            departmentOptions,
        );

        sheet = excelHelper.addWorksheet(
            sheet,
            null,
            'Danh sách ngân sách',
            [
                {
                    width: 10,
                    title: 'Id',
                    field: 'id',
                },
                {
                    width: 75,
                    title: 'Loại ngân sách',
                    field: 'name',
                },
                {
                    width: 30,
                    title: 'Option values',
                    formatter: (row, index) => `${row.id}-${row.parent_id}-${row.name}`,
                },
            ],
            budgetOptions,
        );

        return new ServiceResponse(true, '', sheet);
    } catch (error) {
        logger.error(error, { function: 'BudgetPlanService.downloadTemplateBudgetPlan' });
        return new ServiceResponse(false, error);
    }
};

const uniqueValues = (nums) => [...new Set(nums)];

const checkBudgetPlanImport = (budgetPlan, pool = null) => {
    let errmsg = [];
    let {
        budget_plan_name,
        is_apply_all_department,
        department_id1,
        department_id2,
        department_id3,
        budget_id1,
        budget_id2,
        budget_id3,
        from_month,
        from_year,
        to_month,
        to_year,
        is_active,
    } = budgetPlan || {};

    is_apply_all_department = is_apply_all_department ? parseInt(is_apply_all_department.split('-')[0]) === 1 : true;
    const departments = uniqueValues(
        [department_id1, department_id2, department_id3]
            .map((item) => (item ? item.split('-')[0] : null))
            .filter(Number),
    );
    const budgets = uniqueValues(
        [budget_id1, budget_id2, budget_id3].map((item) => (item ? item.split('-')[0] : null)).filter(Number),
    );
    const companies = uniqueValues(
        [department_id1, department_id2, department_id3, budget_id1, budget_id2, budget_id3]
            .map((item) => (item ? item.split('-')[1] : null))
            .filter(Number),
    );
    const company_id = companies[0];
    from_month = from_month ? parseInt(from_month) : 0;
    from_year = from_year ? parseInt(from_year) : 0;
    to_month = to_month ? parseInt(to_month) : 0;
    to_year = to_year ? parseInt(to_year) : 0;
    is_active = is_active ? parseInt(is_active.split('-')[0]) === 1 : true;

    if (!budget_plan_name) errmsg.push('Tên kế hoạch ngân sách là bắt buộc');
    if (!is_apply_all_department && !departments.length) errmsg.push('Phòng ban là bắt buộc');
    if (!budgets.length) errmsg.push('Ngân sách là bắt buộc');
    if (companies.length > 1 && companies.some((item) => item !== company_id)) errmsg.push('Công ty không đồng nhất');
    if (!from_month) errmsg.push('Từ tháng là bắt buộc');
    if (!from_year) errmsg.push('Từ năm là bắt buộc');
    if (!to_month) errmsg.push('Đến tháng là bắt buộc');
    if (!to_year) errmsg.push('Đến năm là bắt buộc');
    if (from_year > to_year || (from_year === to_year && from_month > to_month))
        errmsg.push('Thời gian bắt đầu không lớn hơn thời gian kết thúc');

    let item = {
        budget_plan_name,
        is_apply_all_department,
        company_id,
        departments,
        budgets,
        from_month,
        from_year,
        to_month,
        to_year,
        is_active,
    };

    return { errmsg, item };
};

const importExcelBudgetPlan = async (body, file, auth) => {
    try {
        const auth_name = apiHelper.getValueFromObject(auth, 'user_name');
        const rows = await readXlsxFile(file.buffer);
        const columns = {
            stt: 'STT',
            budget_plan_name: 'Tên kế hoạch ngân sách*',
            is_apply_all_department: 'Tất cả phòng ban*',
            department_id1: 'Phòng ban1*',
            department_id2: 'Phòng ban2',
            department_id3: 'Phòng ban3',
            budget_id1: 'Ngân sách1*',
            budget_id2: 'Ngân sách2',
            budget_id3: 'Ngân sách3',
            from_month: 'Từ tháng*',
            from_year: 'Từ năm*',
            to_month: 'Đến tháng*',
            to_year: 'Đến năm*',
            is_active: 'Trạng thái',
        };
        let data = excelHelper.getValueExcel(rows, columns);
        let pool = await mssql.pool;
        let import_data = [];
        let import_errors = [];
        let import_total = 0;

        for (let i = 0; i < data.length; i++) {
            import_total += 1;
            let budgetPlan = data[i];
            let { errmsg, item } = checkBudgetPlanImport(budgetPlan, pool);

            if (errmsg && errmsg.length > 0) {
                import_errors.push({
                    budgetPlan,
                    errmsg,
                    i,
                });
            } else {
                try {
                    let res = await createBudgetPlan({ ...item, updated_user: auth_name });
                    if (res.isFailed()) {
                        import_errors.push({
                            budgetPlan,
                            errmsg: [res.getMessage()],
                            i,
                        });
                    }
                    import_data.push(res.getData());
                } catch (error) {
                    import_errors.push({
                        budgetPlan,
                        errmsg: [error.message],
                        i,
                    });
                }
            }
        }

        return new ServiceResponse(true, '', { import_data, import_total, import_errors });
    } catch (e) {
        logger.error(e, { function: 'BudgetPlanService.importExcel' });
        return new ServiceResponse(false, error);
    }
};

const getListBudgetPlan = async queryParams => {
    try {

        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const year = apiHelper.getValueFromObject(queryParams, 'year')

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'key_word'))
            .input('COMPANYID', apiHelper.getValueFromObject(queryParams, 'company_id'))
            .input('DEPARTMENTID', apiHelper.getValueFromObject(queryParams, 'department_id'))
            .input('BUDGETPLANID', apiHelper.getValueFromObject(queryParams, 'budget_plan_id'))
            .input('YEAR', year)
            .execute('FI_BUDGETPLAN_GetList_AdminWeb_V2');

        let budget_plan = data && data.recordsets.length > 0 ? BudgetPlanClass.list(data.recordsets[0]) : [];
        let total_department = data && data.recordsets.length > 0 ? (data.recordsets[1]) : [];
        let budget_plan_distribution_detail = data && data.recordsets.length > 0 ? BudgetPlanClass.listDistributionOption(data.recordsets[2]) : [];
        let total_not_yet_review = data && data.recordsets.length > 0 ? data.recordsets[3][0].TOTALNOTYETBUDGET : 0;


        budget_plan = budget_plan.map(x => {
            let row_span_total = (total_department.find(y => y.DEPARTMENTID == x.department_id)).TOTAL
            let list_distribution_detail = budget_plan_distribution_detail.filter(item => item.budget_plan_distribution_id === x.budget_plan_distribution_id)

            return {
                ...x,
                row_span_total,

                january: list_distribution_detail.find(item => new Date(item.budget_plan_distribution_date).getMonth() + 1 === 1 && new Date(item.budget_plan_distribution_date).getFullYear() == year),
                february: list_distribution_detail.find(item => new Date(item.budget_plan_distribution_date).getMonth() + 1 === 2 && new Date(item.budget_plan_distribution_date).getFullYear() == year),
                march: list_distribution_detail.find(item => new Date(item.budget_plan_distribution_date).getMonth() + 1 === 3 && new Date(item.budget_plan_distribution_date).getFullYear() == year),
                april: list_distribution_detail.find(item => new Date(item.budget_plan_distribution_date).getMonth() + 1 === 4 && new Date(item.budget_plan_distribution_date).getFullYear() == year),

                may: list_distribution_detail.find(item => new Date(item.budget_plan_distribution_date).getMonth() + 1 === 5 && new Date(item.budget_plan_distribution_date).getFullYear() == year),
                june: list_distribution_detail.find(item => new Date(item.budget_plan_distribution_date).getMonth() + 1 === 6 && new Date(item.budget_plan_distribution_date).getFullYear() == year),
                july: list_distribution_detail.find(item => new Date(item.budget_plan_distribution_date).getMonth() + 1 === 7 && new Date(item.budget_plan_distribution_date).getFullYear() == year),
                august: list_distribution_detail.find(item => new Date(item.budget_plan_distribution_date).getMonth() + 1 === 8 && new Date(item.budget_plan_distribution_date).getFullYear() == year),

                september: list_distribution_detail.find(item => new Date(item.budget_plan_distribution_date).getMonth() + 1 === 9 && new Date(item.budget_plan_distribution_date).getFullYear() == year),
                october: list_distribution_detail.find(item => new Date(item.budget_plan_distribution_date).getMonth() + 1 === 10 && new Date(item.budget_plan_distribution_date).getFullYear() == year),
                november: list_distribution_detail.find(item => new Date(item.budget_plan_distribution_date).getMonth() + 1 === 11 && new Date(item.budget_plan_distribution_date).getFullYear() == year),
                december: list_distribution_detail.find(item => new Date(item.budget_plan_distribution_date).getMonth() + 1 === 12 && new Date(item.budget_plan_distribution_date).getFullYear() == year),

            }
        })




        return new ServiceResponse(true, '', {
            data: budget_plan,
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordsets[0]),
            total_not_yet_review
        });

    } catch (e) {
        logger.error(e, { function: 'BudgetPlanService.getListBudgetPlan' });
        return new ServiceResponse(false, '', {});
    }
};

const deleteBudgetPlan = async (bodyParams) => {
    try {
        const pool = await mssql.pool;
        await pool
            .request()
            .input('IDS', apiHelper.getValueFromObject(bodyParams, 'ids'))
            .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('FI_BUDGETPLAN_DISTRIBUTION_Delete_AdminWeb');
        return new ServiceResponse(true, 'ok');
    } catch (e) {
        logger.error(e, { function: 'BudgetPlanService.deleteBudgetPlan' });
        return new ServiceResponse(false, e.message);
    }
};

const getOptionTreeView = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request()
            .input('PARENTID', apiHelper.getValueFromObject(queryParams, 'parent_id'))
            .execute('FI_BUDGET_GetOptionsCreate_AdminWeb');
        let list = BudgetPlanClass.options(data.recordset) || []

        const budget_plan_id = apiHelper.getValueFromObject(queryParams, 'budget_plan_id')
        if (budget_plan_id) {
            const res = await pool.request()
                .input('BUDGETPLANID', apiHelper.getValueFromObject(queryParams, 'budget_plan_id'))
                .execute('FI_BUDGETPLAN_GetById_AdminWeb_V2');
            let budget = BudgetPlanClass.departmentAndBudget(res.recordsets[2] || [])
            list = list.filter(x => {
                if (!budget.find(y => y.budget_id === x.value)) {
                    return x
                }
            })
        }

        return new ServiceResponse(true, '', list);
    } catch (e) {
        logger.error(e, { 'function': 'BudgetPlanService.getOptionTreeView' });
        return [];
    }
}

const updateBudgetPlanDetail = async (bodyParams = {}) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    await transaction.begin();
    try {
        let budget_plan_date_from = '01/' + (apiHelper.getValueFromObject(bodyParams, 'budget_plan_date_from')).toString();
        let budget_plan_date_to = '01/' + (apiHelper.getValueFromObject(bodyParams, 'budget_plan_date_to')).toString();

        const budget_plan_id = apiHelper.getValueFromObject(bodyParams, 'budget_plan_id');
        const auth_name = apiHelper.getValueFromObject(bodyParams, 'auth_name')
        const company_id = apiHelper.getValueFromObject(bodyParams, 'company_id', null);

        const departments = apiHelper.getValueFromObject(bodyParams, 'departments');
        const listBudgets = apiHelper.getValueFromObject(bodyParams, 'budgets', []);
        if (listBudgets && listBudgets.length > 0 && departments && departments.length > 0) {
            const requestBudgetPlan = new sql.Request(transaction);
            const request1 = new sql.Request(transaction);
            const request2 = new sql.Request(transaction);
            const request3 = new sql.Request(transaction);
            const request5 = new sql.Request(transaction);
            const request6 = new sql.Request(transaction);
            //Lấy tháng và năm giữa 2 khoảng thời gian
            const res1 = await request1
                .input('BUDGETPLANDATEFROM', budget_plan_date_from)
                .input('BUDGETPLANDATETO', budget_plan_date_to)
                .execute('FI_BUDGETPLAN_GetMonthYearOption_AdminWeb');
            let dataMonthYear = res1 && res1.recordsets.length > 0 ? res1.recordsets[0] : []

            for (let i = 0; i < departments.length; i++) {
                let total_money = 0
                let total_of_month = 0

                for (let j = 0; j < listBudgets.length; j++) {
                    const budget = listBudgets[j]
                    const data = await requestBudgetPlan
                        .input('BUDGETPLANID', budget_plan_id)
                        .input('BUDGETID', budget)
                        .input('DEPARTMENTID', departments[i].value)
                        .input('CREATEDUSER', auth_name)
                        .execute('FI_BUDGETPLAN_DISTRIBUTION_Create_AdminWeb');
                    const budget_plan_distribution_id = data.recordset[0].RESULT

                    if (!budget_plan_distribution_id) {
                        await transaction.rollback();
                        return new ServiceResponse(false, 'Thêm mã ngân sách thất bại');
                    }

                    //Lấy các điều kiện để chia %
                    const res2 = await request2
                        .input('BUDGETID', budget)
                        .execute('FI_BUDGET_BUDGETRULE_GetListOptions_AdminWeb');
                    const dataBudget = res2 && res2.recordsets.length > 0 && res2.recordsets[0];
                    const is_dynamic_budget = dataBudget[0]?.ISDYNAMICBUDGET === true ? 1 : 0

                    if (is_dynamic_budget === 1) {
                        if (dataBudget && dataBudget.length > 0) {
                            for (let j = 0; j < dataBudget.length; j++) {
                                const item = dataBudget[j];
                                const res3 = await request3
                                    .input('BUDGETVALUE', apiHelper.getValueFromObject(item, 'BUDGETVALUE'))
                                    .input('BUDGETVALUETYPE', apiHelper.getValueFromObject(item, 'BUDGETVALUETYPE'))
                                    .input('CRITERIA', apiHelper.getValueFromObject(item, 'CRITERIA'))
                                    .input('DATEFROM', apiHelper.getValueFromObject(item, 'DATEFROM'))
                                    .input('DATETO', apiHelper.getValueFromObject(item, 'DATETO'))
                                    .input('COMPANYID', company_id)
                                    .execute('FI_BUDGETPLAN_DISTRIBUTION_DETAIL_GetTotal_AdminWeb');
                                const money = res3 && res3.recordsets.length > 0 ? res3.recordsets[0][0].TOTALMONEY : 0;
                                total_money = total_money + money
                            }
                        }

                        if (total_money > 0 && dataMonthYear.length > 0) {
                            total_of_month = Math.round((total_money / (dataMonthYear.length) / 1000000)) || 0
                        }
                    }

                    dataMonthYear = dataMonthYear.map(item => ({ ...item, VALUE: total_of_month }))
                    for (let z = 0; z < dataMonthYear.length; z++) {
                        const itemMonthYear = dataMonthYear[z];
                        const res5 = await request5
                            .input('BUDGETPLANDISTRIBUTIONDATE', apiHelper.getValueFromObject(itemMonthYear, 'MONTHYEAR'))
                            .input('BUDGETPLANDISTRIBUTIONUSED', 0)
                            .input('BUDGETPLANDISTRIBUTIONPLAN', apiHelper.getValueFromObject(itemMonthYear, 'VALUE'))
                            .input('BUDGETPLANDISTRIBUTIONID', budget_plan_distribution_id)
                            .input('CREATEDUSER', auth_name)
                            .execute('FI_BUDGETPLAN_DISTRIBUTION_DETAIL_CreateOrUpdate_AdminWeb');
                        const budget_plan_distribution_detail_id = res5.recordset[0].RESULT
                        if (!budget_plan_distribution_detail_id) {
                            await transaction.rollback()
                            return new ServiceResponse(false, 'Có lỗi xảy ra !');
                        }
                    }
                }

                //Cộng thêm tổng tiền cho kế hoạch của phòng ban đó
                const res6 = await request6
                    .input('DEPARTMENTID', departments[i].value)
                    .input('BUDGETPLANID', budget_plan_id)
                    .input('TOTALBUDGETDISTRIBUTION', total_money)
                    .execute('FI_BUDGETPLAN_TOTAL_Update_AdminWeb');
                const result = res6.recordset[0].RESULT
                if (!result) {
                    await transaction.rollback()
                    return new ServiceResponse(false, 'Có lỗi xảy ra !');
                }
            }
        }

        await transaction.commit();
        return new ServiceResponse(true, 'Thêm mã ngân sách thành công', {});
    } catch (error) {
        await transaction.rollback();
        logger.error(error, { function: 'BudgetPlanService.updateBudgetPlanDetail' });
        return new ServiceResponse(false, error.message);
    }
};

const getBudgetPlanDetail = async budgetPlanId => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input("BUDGETPLANID", budgetPlanId)
            .execute(PROCEDURE_NAME.FI_BUDGETPLAN_GETDETAIL_ADMINWEB);
        const dataRes = data.recordsets[0][0]
        dataRes['departments'] = data.recordsets[1]

        return new ServiceResponse(true, '', dataRes);
    } catch (error) {
        logger.error(error, { function: 'BudgetPlanService.getBudgetPlanDetail' });
        return new ServiceResponse(false, error.message);
    }
};

const getBudgetByDepartment = async (id, department) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input("BUDGETPLANID", id)
            .input("DEPARTMENTID", department)
            .execute(PROCEDURE_NAME.FI_BUDGETPLAN_DISTRIBUTION_GETBUDGET_OPTS_ADMINWEB);
        const dataRes = data.recordsets[0]
        return new ServiceResponse(true, '', dataRes);
    } catch (error) {
        logger.error(error, { function: 'BudgetPlanService.getBudgetByDepartment' });
        return new ServiceResponse(false, error.message);
    }
};

const getBudgetDetailPerMonth = async (bodyParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input("BUDGETPLANID", apiHelper.getValueFromObject(bodyParams, 'budget_plan_id', null))
            .input("DEPARTMENTID", apiHelper.getValueFromObject(bodyParams, 'department_id', null))
            .input("BUDGETID", apiHelper.getValueFromObject(bodyParams, 'budget_id', null))
            .execute(PROCEDURE_NAME.FI_BUDGETPLAN_DISTRIBUTION_GETREMAIN_ADMINWEB);
        const dataRes = data.recordsets[0][0]

        return new ServiceResponse(true, '', dataRes);
    } catch (error) {
        logger.error(error, { function: 'BudgetPlanService.getBudgetDetailPerMonth' });
        return new ServiceResponse(false, error.message);
    }
};

const transferBudgetPlan = async (bodyParams = {}) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        await transaction.begin();
        const request = new sql.Request(transaction);
        const transfer = await request
            .input("BUDGETPLANID", apiHelper.getValueFromObject(bodyParams, 'budget_plan_id', null))
            .input("DEPARTMENTIDFROM", apiHelper.getValueFromObject(bodyParams, 'department', null))
            .input("DEPARTMENTIDTO", apiHelper.getValueFromObject(bodyParams, 'department', null))
            .input("CREATEDUSER", apiHelper.getValueFromObject(bodyParams, 'auth_name', null))
            .execute(PROCEDURE_NAME.FI_BUDGETPLAN_TRANSFER_CREATE_ADMINWEB);

        const transferID = transfer.recordset[0]['RESULT']
        if (!transferID)
            throw new Error("Create transfer budget plan failed!")

        let listTransfer = apiHelper.getValueFromObject(bodyParams, 'budget_transfer_list', [])
        if (listTransfer.length) {
            const budget_id_from = apiHelper.getValueFromObject(bodyParams, 'budget_id_from', null)
            const budget_id_to = apiHelper.getValueFromObject(bodyParams, 'budget_id_to', null)

            for (let i = 0; i < listTransfer.length; i++) {
                const request2 = new sql.Request(transaction);
                await request2
                    .input('BUDGETPLANTRANSFERID', transferID)
                    .input('BUDGETIDFROM', budget_id_from)
                    .input('BUDGETIDTO', budget_id_to)
                    .input('MONEYTRANSFER', listTransfer[i].money_transfer)
                    .input('MONTHRECEIVE', listTransfer[i].to_month)
                    .input('MONTHTRANSFER', listTransfer[i].from_month)
                    .execute(PROCEDURE_NAME.FI_BUDGETPLAN_TRANS_DETAIL_CREATE_ADMINWEB);

                const request3 = new sql.Request(transaction);
                await request3
                    .input('BUDGETPLANID', apiHelper.getValueFromObject(bodyParams, 'budget_plan_id', null))
                    .input('DEPARTMENTID', apiHelper.getValueFromObject(bodyParams, 'department', null))
                    .input('BUDGETIDFROM', budget_id_from)
                    .input('BUDGETIDTO', budget_id_to)
                    .input('MONEYTRANSFER', listTransfer[i].money_transfer)
                    .input('MONTHRECEIVE', listTransfer[i].to_month)
                    .input('MONTHTRANSFER', listTransfer[i].from_month)
                    .execute(PROCEDURE_NAME.FI_BUDGETPLAN_DISTRIBUTION_TRANSFER_ADMINWEB);
            }
        }
        await transaction.commit();
        return new ServiceResponse(true, 'Chuyển ngân sách thành công', {});

    } catch (error) {
        await transaction.rollback();
        logger.error(error, { function: 'BudgetPlanService.transferBudgetPlan' });
        return new ServiceResponse(false, error.message);
    }
};


const getListCompanyOptions = async (queryParams) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('USERNAME', (auth_name = apiHelper.getValueFromObject(queryParams, 'auth_name')))
            .execute('AM_COMPANY_GetOptionsForUser_AdminWeb');
        const company = BudgetPlanClass.option(data.recordset) || [];
        return new ServiceResponse(true, '', company);
    } catch (e) {
        logger.error(e, { function: 'BudgetPlanService.getListCompanyOptions' });
        return new ServiceResponse(true, '', {});
    }
};

const getListBudgetPlanOptions = async (queryParams) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .execute('FI_BUDGETPLAN_GetOptions_AdminWeb');
        const budget_plan = BudgetPlanClass.option(data.recordset) || [];
        return new ServiceResponse(true, '', budget_plan);
    } catch (e) {
        logger.error(e, { function: 'BudgetPlanService.getListBudgetPlanOptions' });
        return new ServiceResponse(true, '', {});
    }
};
const getListDepartmentOptions = async (queryParams) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('COMPANYID', (auth_name = apiHelper.getValueFromObject(queryParams, 'company_id')))
            .execute('MD_DEPARTMENT_GetOptions_AdminWeb');
        const department = BudgetPlanClass.option(data.recordset) || [];
        return new ServiceResponse(true, '', department);
    } catch (e) {
        logger.error(e, { function: 'BudgetPlanService.getListDepartmentOptions' });
        return new ServiceResponse(true, '', {});
    }
};

const getListBudgetPlanList = async queryParams => {
    try {

        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'key_word'))

            .input('COMPANYID', apiHelper.getValueFromObject(queryParams, 'company_id'))
            .input('ISREVIEW', apiHelper.getValueFromObject(queryParams, 'is_review'))
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'create_date_from'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'create_date_to'))

            .execute('FI_BUDGETPLAN_GetListOptions_AdminWeb');

        const budget_plan_option = data && data.recordsets.length > 0 ? BudgetPlanClass.listOption(data.recordsets[0]) : [];

        return new ServiceResponse(true, '', {
            data: budget_plan_option,
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordsets[0]),
        });

    } catch (e) {
        logger.error(e, { function: 'BudgetPlanService.getListBudgetPlanList' });
        return new ServiceResponse(false, '', []);
    }
};

const updateReview = async (bodyParams) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    await transaction.begin();

    try {

        const budget_plan_id = apiHelper.getValueFromObject(bodyParams, 'budget_plan_id');
        const is_review = apiHelper.getValueFromObject(bodyParams, 'is_review');
        const note = apiHelper.getValueFromObject(bodyParams, 'note');

        let budget_plan_date_from = apiHelper.getValueFromObject(bodyParams, 'budget_plan_date_from')
        let budget_plan_date_to = apiHelper.getValueFromObject(bodyParams, 'budget_plan_date_to')


        const auth_name = apiHelper.getValueFromObject(bodyParams, 'auth_name')
        const company_id = apiHelper.getValueFromObject(bodyParams, 'company_id')
        const type = apiHelper.getValueFromObject(bodyParams, 'type')
        const listBudgets = apiHelper.getValueFromObject(bodyParams, 'budgets');

        const totalBudgetPlan = apiHelper.getValueFromObject(bodyParams, 'totalBudgetPlan')
        let listDepartments = apiHelper.getValueFromObject(bodyParams, 'departments');

        const reqBudgetPlan = new sql.Request(transaction)
        const data = await reqBudgetPlan
            .input('BUDGETPLANID', budget_plan_id)
            .input('ISREVIEW', is_review)
            .input('NOTE', note)
            .input('CREATEDUSER', auth_name)
            .execute('FI_BUDGETPLAN_UpdateReview_AdminWeb');
        const result = data.recordset[0].RESULT;
        if (!result) {
            await transaction.rollback()
            return new ServiceResponse(false, 'Duyệt kế hoạch thất bại !');
        }

        if (is_review === 1 && listBudgets.length > 0 && listDepartments.length > 0) {

            if (type === 1) {
                listDepartments = listDepartments.map(x => {
                    let result = (totalBudgetPlan.find(y => y.department_id === x.value))?.remain || 0
                    return {
                        ...x,
                        remain: result
                    }
                })
            }

            const request1 = new sql.Request(transaction);
            const request2 = new sql.Request(transaction);
            const request3 = new sql.Request(transaction);
            const request5 = new sql.Request(transaction);
            const request6 = new sql.Request(transaction);

            let total_money = 0
            let total_of_month = 0

            //Lấy tháng và năm giữa 2 khoảng thời gian
            const res1 = await request1
                .input('BUDGETPLANDATEFROM', budget_plan_date_from)
                .input('BUDGETPLANDATETO', budget_plan_date_to)
                .execute('FI_BUDGETPLAN_GetMonthYearOption_AdminWeb');
            let dataMonthYear = res1 && res1.recordsets.length > 0 ? res1.recordsets[0] : []

            for (let i = 0; i < listDepartments.length; i++) {
                for (let j = 0; j < listBudgets.length; j++) {
                    const budget = listBudgets[j]

                    //Lấy các điều kiện để chia %
                    const res2 = await request2
                        .input('BUDGETID', budget * 1)
                        .execute('FI_BUDGET_BUDGETRULE_GetListOptions_AdminWeb');
                    const dataBudget = res2 && res2.recordsets.length > 0 && res2.recordsets[0];
                    const is_dynamic_budget = dataBudget[0]?.ISDYNAMICBUDGET === true ? 1 : 0

                    if (is_dynamic_budget === 1) {
                        if (dataBudget && dataBudget.length > 0) {
                            for (let j = 0; j < dataBudget.length; j++) {
                                const item = dataBudget[j];
                                const res3 = await request3
                                    .input('BUDGETVALUE', apiHelper.getValueFromObject(item, 'BUDGETVALUE'))
                                    .input('BUDGETVALUETYPE', apiHelper.getValueFromObject(item, 'BUDGETVALUETYPE'))
                                    .input('CRITERIA', apiHelper.getValueFromObject(item, 'CRITERIA'))
                                    .input('DATEFROM', apiHelper.getValueFromObject(item, 'DATEFROM'))
                                    .input('DATETO', apiHelper.getValueFromObject(item, 'DATETO'))
                                    .input('COMPANYID', company_id)
                                    .execute('FI_BUDGETPLAN_DISTRIBUTION_DETAIL_GetTotal_AdminWeb');
                                const money = res3 && res3.recordsets.length > 0 ? res3.recordsets[0][0].TOTALMONEY : 0;
                                total_money = total_money + money
                            }
                        }

                        if (total_money > 0 && dataMonthYear.length > 0) {
                            total_of_month = Math.round((total_money / (dataMonthYear.length) / 1000000)) || 0
                        }
                    }

                    dataMonthYear = dataMonthYear.map((item, index) => {
                        let VALUE = total_of_month
                        if (index === 0) {
                            return ({ ...item, VALUE: VALUE + Math.round((listDepartments[0].remain) / 1000000) })
                        } else {
                            return ({ ...item, VALUE })
                        }
                    })

                    for (let z = 0; z < dataMonthYear.length; z++) {
                        const itemMonthYear = dataMonthYear[z];
                        const res5 = await request5
                            .input('BUDGETPLANDISTRIBUTIONDATE', apiHelper.getValueFromObject(itemMonthYear, 'MONTHYEAR'))
                            .input('BUDGETPLANDISTRIBUTIONUSED', 0)
                            .input('BUDGETPLANDISTRIBUTIONPLAN', apiHelper.getValueFromObject(itemMonthYear, 'VALUE'))
                            .input('BUDGETPLANDISTRIBUTIONID', listDepartments[i].budget_plan_distribution_id)
                            .input('CREATEDUSER', auth_name)
                            .execute('FI_BUDGETPLAN_DISTRIBUTION_DETAIL_CreateOrUpdate_AdminWeb');
                        const budget_plan_distribution_detail_id = res5.recordset[0].RESULT

                        if (!budget_plan_distribution_detail_id) {
                            await transaction.rollback()
                            return new ServiceResponse(false, 'Có lỗi xảy ra !');
                        }
                    }

                    //Lưu tổng tiền theo kế hoạch
                    const res6 = await request6
                        .input('DEPARTMENTID', listDepartments[i].value)
                        .input('BUDGETPLANID', budget_plan_id)
                        .input('TOTALBUDGETDISTRIBUTION', total_money)
                        .execute('FI_BUDGETPLAN_TOTAL_Create_AdminWeb');
                    const budget_plan_total_id = res6.recordset[0].RESULT

                    if (!budget_plan_total_id) {
                        await transaction.rollback()
                        return new ServiceResponse(false, 'Có lỗi xảy ra !');
                    }
                }
            }
        }

        await transaction.commit();
        return new ServiceResponse(true, 'Duyệt kế hoạch thành công', result);
    } catch (e) {
        await transaction.rollback()
        logger.error(e, { function: 'BudgetPlanService.updateReview' });
        return new ServiceResponse(false);
    }
};

const deleteBudgetPlanList = async (bodyParams) => {

    try {
        const pool = await mssql.pool;
        await pool
            .request()
            .input('IDS', apiHelper.getValueFromObject(bodyParams, 'ids'))
            .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('FI_BUDGETPLAN_Delete_AdminWeb');
        return new ServiceResponse(true, 'ok');
    } catch (e) {
        logger.error(e, { function: 'BudgetPlanService.deleteBudgetPlanList' });
        return new ServiceResponse(false, e.message);
    }
};

const updateBudgetPlanDistributionDetail = async (bodyParams) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('BUDGETPLANDISTRIBUTIONDETAILID', apiHelper.getValueFromObject(bodyParams, 'budget_plan_distribution_detail_id'))
            .input('BUDGETPLANDISTRIBUTIONPLAN', apiHelper.getValueFromObject(bodyParams, 'budget_plan_distribution_plan'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('FI_BUDGETPLAN_DISTRIBUTION_DETAIL_CreateOrUpdate_AdminWeb');
        const result = data.recordset[0].RESULT;
        if (!result) {
            return new ServiceResponse(false, 'Cập nhật kế hoạch thất bại !');
        }
        return new ServiceResponse(true, 'Cập nhật kế hoạch thành công', result);
    } catch (e) {
        logger.error(e, { function: 'BudgetPlanService.updateBudgetPlanDistributionDetail' });
        return new ServiceResponse(false);
    }
};

const getDetailBudgetPlan = async (budgetPlanId) => {
    try {
        const pool = await mssql.pool;
        const res = await pool.request()
            .input('BUDGETPLANID', budgetPlanId)
            .execute('FI_BUDGETPLAN_GetById_AdminWeb_V2');
        let budgetPlan = BudgetPlanClass.detailBudgetPlan(res.recordset[0]);
        let department = BudgetPlanClass.departmentAndBudget(res.recordsets[1] || [])
        let budget = BudgetPlanClass.departmentAndBudget(res.recordsets[2] || [])

        if (budgetPlan) {
            budgetPlan.budgets = budget.map(item => item.budget_id)
            budgetPlan.departments = department.map(item => ({ id: item.department_id, value: item.department_id }))
            return new ServiceResponse(true, '', budgetPlan);
        }
        return new ServiceResponse(false, 'Có lỗi xảy ra !');
    } catch (e) {
        logger.error(e, { function: 'BudgetPlanService.getDetailBudgetPlan' });
        return new ServiceResponse(false, e.message);
    }
};

module.exports = {
    getBudgetPlanList,
    createBudgetPlan,
    getById,
    getTotalBudgetPlan,
    exportExcelBudgetPlan,
    downloadTemplateBudgetPlan,
    importExcelBudgetPlan,
    getBudgetPlanDetail,
    getBudgetByDepartment,
    getBudgetDetailPerMonth,
    transferBudgetPlan,
    getListBudgetPlan,
    deleteBudgetPlan,
    getOptionTreeView,
    updateBudgetPlanDetail,
    getListCompanyOptions,
    getListBudgetPlanOptions,
    getListDepartmentOptions,
    getListBudgetPlanList,
    updateReview,
    deleteBudgetPlanList,
    updateBudgetPlanDistributionDetail,
    getDetailBudgetPlan
};
