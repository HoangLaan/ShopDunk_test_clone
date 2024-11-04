const Transform = require('../../common/helpers/transform.helper');

const template = {
    commission_id: '{{#? COMMISSIONID}}',
    commission_name: '{{#? COMMISSIONNAME}}',
    commission_code: '{{#? COMMISSIONCODE}}',
    commission_value: '{{#? COMMISSIONVALUE}}',
    commission_status: '{{#? COMMISSIONSTATUS}}',
    date_active: '{{#? DATEACTIVE}}',
    is_stopped: '{{#? ISSTOPPED ? 1 : 0}}',
    stopped_date: '{{#? STOPPEDDATE}}',
    stopped_user: '{{#? STOPPEDUSER}}',
    stopped_reason: '{{#? STOPPEDREASON}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    company_id: '{{#? COMPANYID}}',
    company_name: '{{#? COMPANYNAME}}',
    created_user: '{{#? CREATEDUSER}}',
    status_name: '{{#? STATUSNAME}}',
    created_date: '{{#? CREATEDDATE}}',
    st: '{{#? ST}}',
    start_date: '{{#? STARTDATE}}',
    end_date: '{{#? ENDDATE}}',
    is_apply_all_product: '{{ISAPPLYALLPRODUCT ? 1 : 0}}',
    is_apply_product_category: '{{ISAPPLYPRODUCTCATEGORY ? 1 : 0}}',
    description: '{{#? DESCRIPTION}}',
    com_company_id: '{{#? COMCOMPANYID}}',
    business_id: '{{#? BUSINESSID}}',
    business_name: '{{#? BUSINESSNAME}}',
    business_address_full: '{{#? BUSINESSADDRESSFULL}}',
};

const list = (commissions = []) => {
    let transform = new Transform(template);

    return transform.transform(commissions, [
        'commission_id',
        'commission_name',
        'date_active',
        'is_stopped',
        'stopped_date',
        'stopped_user',
        'stopped_reason',
        'is_active',
        'company_name',
        'created_user',
        'commission_status',
        'status_name',
        'created_date',
        'st',
        'commission_code'
    ]);
};

const detail = (data = {}) => {
    const _template = {
        commission_id: '{{#? COMMISSIONID}}',
        commission_name: '{{#? COMMISSIONNAME}}',
        commission_value: '{{#? COMMISSIONVALUE}}',
        type_value: '{{#? TYPEVALUE ? TYPEVALUE: 2}}',
        start_date: '{{#? STARTDATE}}',
        end_date: '{{#? ENDDATE}}',
        is_stopped: '{{ ISSTOPPED ? 1: 0}}',
        stopped_date: '{{#? STOPPEDDATE}}',
        stopped_user: '{{#? STOPPEDUSER}}',
        stopped_reason: '{{#? STOPPEDREASON}}',
        modal_stopped_reason: '{{#? MODALSTOPPEDREASON}}',
        is_active: '{{ ISACTIVE ? 1: 0}}',
        company_id: '{{#? COMPANYID}}',
        company_name: '{{#? COMPANYNAME}}',
        description: '{{#? DESCRIPTION}}',
        is_apply_other_commission: '{{ ISAPPLYOTHERCOMMISSION ? 1 : 0}}',
        is_reviewed: '{{ ISREVIEWED ? 1: 0}}',
        reviewed_user: '{{#? REVIEWEDUSER}}',
        reviewed_user_department: '{{#? REVIEWEDUSERDEPARTMENT}}',
        reviewed_date: '{{#? REVIEWEDDATE}}',
        reviewed_note: '{{#? REVIEWEDNOTE}}',
        modal_reviewed_note: '{{#? MODALREVIEWEDNOTE}}',
        is_auto_renew: '{{ ISAUTORENEW ? 1 : 0}}',
        renew_day_in_month: '{{#? RENEWDAYINMONTH}}',
        reviewed_status: '{{#? REVIEWEDUSER ? 1 : 0}}',
    };
    return new Transform(_template).transform(data, Object.keys(_template));
};

const businessApply = (data = []) => {
    const _template = {
        commission_id: '{{#? COMMISSIONID}}',
        id: '{{#? BUSINESSID}}',
        business_id: '{{#? BUSINESSID}}',
        business_name: '{{#? BUSINESSNAME}}',
        value: '{{#? BUSINESSID}}',
        label: '{{#? BUSINESSNAME}}',
    };
    return new Transform(_template).transform(data, Object.keys(_template));
};

const businessStoreApply = (data = []) => {
    const _template = {
        commission_id: '{{#? COMMISSIONID}}',
        id: '{{#? BUSINESSID}}',
        business_id: '{{#? BUSINESSID}}',
        store_id: '{{#? STOREID}}',
        store_name: '{{#? STORENAME}}',
        area_id: '{{#? AREAID}}',
    };
    return new Transform(_template).transform(data, Object.keys(_template));
};

const companyApply = (data = []) => {
    const _template = {
        com_company_id: '{{#? COMCOMPANYID}}',
        company_id: '{{#? COMPANYID}}',
        commission_id: '{{#? COMMISSIONID}}',
        business_id: '{{#? BUSINESSID}}',
        business_name: '{{#? BUSINESSNAME}}',
        business_address_full: '{{#? BUSINESSADDRESSFULL}}',
        company_name: '{{#? COMPANYNAME}}',
    };
    return new Transform(_template).transform(data, Object.keys(_template));
};

const orderTypeApply = (data = []) => {
    const _template = {
        com_order_type_id: '{{#? COMORDERTYPEID}}',
        commission_id: '{{#? COMMISSIONID}}',
        order_type_id: '{{#? ORDERTYPEID}}',
        value: '{{#? ORDERTYPEID}}',
        id: '{{#? ORDERTYPEID}}',
    };
    return new Transform(_template).transform(data, Object.keys(_template));
};

const storeApply = (data = []) => {
    const _template = {
        com_store_id: '{{#? COMSTOREID}}',
        commission_id: '{{#? COMMISSIONID}}',
        store_id: '{{#? STOREID}}',
    };
    return new Transform(_template).transform(data, Object.keys(_template));
};

const departmentApply = (data = []) => {
    const _template = {
        com_department_id: '{{#? COMDEPARTMENTID}}',
        commission_id: '{{#? COMMISSIONID}}',
        department_id: '{{#? DEPARTMENTID}}',
        commission_value: '{{#? COMMISSIONVALUE}}',
        type_value: '{{#? TYPEVALUE}}',
        is_divide_to_position: '{{ ISDIVIDETOPOSITION? 1: 0}}',
        is_divide_by_department: '{{ ISDIVIDEBYDEPARTMENT? 1: 0}}',
        is_divide_by_shift: '{{ ISDIVIDEBYSHIFT? 1: 0}}',
        is_divide_to_sale_employee: '{{ ISDIVIDETOSALEEMPLOYEE? 1: 0}}',
        department_name: '{{#? DEPARTMENTNAME}}',
        company_name: '{{#? COMPANYNAME}}',
        parent_name: '{{#? PARENTNAME}}',
    };
    return new Transform(_template).transform(data, Object.keys(_template));
};

const departmentPositionApply = (data = []) => {
    const _template = {
        com_deposition_id: '{{#? COMDEPOSITIONID}}',
        com_department_id: '{{#? COMDEPARTMENTID}}',
        department_id: '{{#? DEPARTMENTID}}',
        position_id: '{{#? POSITIONID}}',
        commission_value: '{{#? COMMISSIONVALUE}}',
        type_value: '{{#? TYPEVALUE}}',
    };
    return new Transform(_template).transform(data, Object.keys(_template));
};

const businessList = (data = []) => {
    let transform = new Transform(template);
    return transform.transform(data, [
        'com_company_id',
        'company_id',
        'commission_id',
        'business_id',
        'business_name',
        'business_address_full',
        'company_name',
    ]);
};

const companyList = (companies = []) => {
    let transform = new Transform(template);

    return transform.transform(companies, ['company_id', 'company_name']);
};

const department = (data = []) => {
    const departmentTemplate = {
        com_department_id: '{{#? COMDEPARTMENTID}}',
        commission_id: '{{#? COMMISSIONID}}',
        commission_value: '{{#? COMMISSIONVALUE}}',
        department_id: '{{#? DEPARTMENTID}}',
        department_name: '{{#? DEPARTMENTNAME}}',
        company_name: '{{#? COMPANYNAME}}',
        parent_name: '{{#? PARENTNAME}}',
    };
    let transform = new Transform(departmentTemplate);
    return transform.transform(data, Object.keys(departmentTemplate));
};

const getDepartmentPosition = (data = []) => {
    const _template = {
        position_id: '{{#? POSITIONID}}',
        department_id: '{{#? DEPARTMENTID}}',
        position_name: '{{#? POSITIONNAME}}',
        department_name: '{{#? DEPARTMENTNAME}}',
        parent_department_name: '{{#? PARENTDEPARTMENTNAME}}',
    };
    return new Transform(_template).transform(data, Object.keys(_template));
};

const getDepartmentPositionV2 = (data = []) => {
    const _template = {
        com_de_position_id: '{{#? COMDEPOSITIONID}}',
        position_id: '{{#? POSITIONID}}',
        department_id: '{{#? DEPARTMENTID}}',
        position_name: '{{#? POSITIONNAME}}',
        department_name: '{{#? DEPARTMENTNAME}}',
        parent_department_name: '{{#? PARENTDEPARTMENTNAME}}',
        commission_value: '{{#? COMMISSIONVALUE}}',
        type_value: '{{#? TYPEVALUE}}',
    };
    return new Transform(_template).transform(data, Object.keys(_template));
};

const getUserDepartmentOptions = (data = []) => {
    const _template = {
        id: '{{#? ID}}',
        name: '{{#? NAME}}',
    };
    return new Transform(_template).transform(data, Object.keys(_template));
};

module.exports = {
    list,
    detail,
    businessApply,
    businessStoreApply,
    storeApply,
    companyApply,
    orderTypeApply,
    storeApply,
    departmentApply,
    departmentPositionApply,
    businessList,
    companyList,
    department,
    getDepartmentPosition,
    getDepartmentPositionV2,
    getUserDepartmentOptions,
};
