const Transform = require('../../common/helpers/transform.helper');

const template = {
    time_keeping_claim_type_id: '{{#? TIMEKEEPINGCLAIMTYPEID}}',
    time_keeping_claim_type_name: '{{#? TIMEKEEPINGCLAIMTYPENAME}}',
    company_name: '{{#? COMPANYNAME}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
};

const options = (data = []) => {
    const templateList = {
        id: '{{#? ID}}',
        name: '{{#? NAME}}',
        limit_times_explain: '{{#? LIMITTIMESEXPLAIN}}',
        claim_deadline: '{{#? CLAIMDEADLINE}}',
    }
    return new Transform(templateList).transform(data, Object.keys(templateList));
};

const blockDepartment = (data = []) => {
    const template = {
        block_id: '{{#? BLOCKID}}',
        department_id: '{{#? DEPARTMENTID}}',
    };
    return new Transform(template).transform(data, Object.keys(template))
};

const usersQC = (data = []) => {
    const template = {
        user_name: '{{#? USERNAME}}',
        full_name: '{{#? FULLNAME}}',
        position_name: '{{#? POSITIONNAME}}',
    };
    return new Transform(template).transform(data, Object.keys(template))
};

const reviewLevel = (data = []) => {
    const template = {
        user_name: '{{#? USERNAME}}',
        full_name: '{{#? FULLNAME}}',
        user_department_name: '{{#? USERDEPARTMENTNAME}}',
        department_id: '{{#? DEPARTMENTID}}',
        review_level_id: '{{#? TIMEKEEPINGREVIEWLEVELID}}',
        review_level_name: '{{#? REVIEWLEVELNAME}}',
        departments:  '{{#? DEPARTMENTS}}'
    };
    return new Transform(template).transform(data, Object.keys(template))
};

const detail = (data = {}) => {
    const templateDetail = {
        ...template, 
        company_id: '{{#? +COMPANYID}}',
        description: '{{#? DESCRIPTION}}',
        is_system: '{{ISSYSTEM ? 1 : 0}}',
        claim_deadline: '{{#? CLAIMDEADLINE}}',
        claim_limits: '{{#? CLAIMLIMITS}}',
        limits_cycle: '{{#? LIMITSCYLE}}',
        is_inform_qc: '{{ISINFORMQC ? 1 : 0}}',
    }
    return new Transform(templateDetail).transform(data, Object.keys(templateDetail));
};

module.exports = {
    options,
    blockDepartment,
    usersQC,
    reviewLevel,
    detail
};
