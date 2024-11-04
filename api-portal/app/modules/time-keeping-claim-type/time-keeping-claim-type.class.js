const Transform = require('../../common/helpers/transform.helper');

const template = {
    time_keeping_claim_type_id: '{{#? TIMEKEEPINGCLAIMTYPEID}}',
    time_keeping_claim_type_name: '{{#? TIMEKEEPINGCLAIMTYPENAME}}',
    company_name: '{{#? COMPANYNAME}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
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

const list = (data = []) => {
    const templateList = {
        ...template, 
        blocks: '{{#? BLOCKS}}',
    }
    return new Transform(templateList).transform(data, Object.keys(templateList));
};

const userList = (data = []) => {
    const template = {
        user_name: '{{#? USERNAME}}',
        full_name: '{{#? FULLNAME}}',
        department_name: '{{#? DEPARTMENTNAME}}',
        position_name: '{{#? POSITIONNAME}}'
    };
    
    return new Transform(template).transform(data, Object.keys(template))
}

const listReviewLevel = (data = []) => {
    const template = {
        review_level_id: '{{#? TIMEKEEPINGTYPEREVIEWLEVELID}}',
        review_level_name: '{{#? REVIEWLEVELNAME}}',
        company_name: '{{#? COMPANYNAME}}',
        department_id: '{{ DEPARTMENTID ? DEPARTMENTID : 0}}',
        department_name: '{{#? DEPARTMENTNAME}}',
        position_id: '{{ POSITIONID ? POSITIONID : 0}}',
        position_name: '{{#? POSITIONNAME}}'
    };
    return new Transform(template).transform(data, Object.keys(template))
};

const blockDepartment = (data = []) => {
    const template = {
        block_id: '{{ BLOCKID ? BLOCKID : 0}}',
        department_id: '{{ DEPARTMENTID ? DEPARTMENTID : 0}}',
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
        user_department_name: '{{#? USERDEPARTMENTNAME}}',
        department_id: '{{#? DEPARTMENTID}}',
        review_level_id: '{{#? TIMEKEEPINGREVIEWLEVELID}}',
        review_level_name: '{{#? REVIEWLEVELNAME}}',
        departments:  '{{#? DEPARTMENTS}}',
        reviewed_username: '{{#? REVIEWUSERNAME}}',
        time_keeping_claim_id: '{{#? TIMEKEEPINGCLAIMID}}'
    };
    return new Transform(template).transform(data, Object.keys(template))
};

module.exports = {
    detail,
    list,
    userList,
    listReviewLevel,
    blockDepartment,
    usersQC,
    reviewLevel,
};
