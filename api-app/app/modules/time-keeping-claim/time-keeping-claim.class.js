const config = require('../../../config/config');
const Transform = require('../../common/helpers/transform.helper');

const template = {
    time_keeping_claim_id: '{{#? TIMEKEEPINGCLAIMID}}',
    user_name: '{{#? USERNAME}}',
    full_name: '{{#? FULLNAME}}',
    store_name: '{{#? STORENAME}}',
    time_keeping_claim_type_name: '{{#? TIMEKEEPINGCLAIMTYPENAME}}',
    shift_name: '{{#? SHIFTNAME}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
};

const detail = (data = {}) => {
    const templateDetail = {
        ...template, 
        time_keeping_claim_type_id: '{{#? +TIMEKEEPINGCLAIMTYPEID}}',
        time_keeping_start: '{{#? TIMEKEEPINGSTART}}',
        time_keeping_end: '{{#? TIMEKEEPINGEND}}',
        time_keeping_date: '{{#? TIMEKEEPINGDATE}}',
        claim_reason: '{{#? CLAIMREASON}}',
    }
    return new Transform(templateDetail).transform(data, Object.keys(templateDetail));
};

const list = (data = []) => {
    const templateList = {
        ...template, 
        is_reviewed: '{{ISREVIEWED ? ISREVIEWED : 0}}',
        users_review: '{{#? USERSREVIEW}}',
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
        review_level_id: '{{#? TIMEKEEPINGREVIEWLEVELID}}',
        reviewed_status: '{{#? REVIEWEDSTATUS}}',
        note: '{{#? NOTE}}',
    };
    return new Transform(template).transform(data, Object.keys(template))
};

const detailByScheduleId = (data = {}) => {
    const templateDetail = {
        time_keeping_claim_id: '{{#? TIMEKEEPINGCLAIMID}}',
        time_keeping_claim_type_id: '{{#? +TIMEKEEPINGCLAIMTYPEID}}',
        time_keeping_claim_type_name: '{{#? TIMEKEEPINGCLAIMTYPENAME}}',
        claim_reason: '{{#? CLAIMREASON}}',
        is_late: '{{ ISLATE ? 1 : (ISLATE === 0 ? 0 : NULL)}}',
    }
    return new Transform(templateDetail).transform(data, Object.keys(templateDetail));
};

const imagesExplain = (data = []) => {
    const template = {
        picture_url: [
            {
                '{{#if PICTUREURL}}': `${config.domain_cdn}{{PICTUREURL}}`,
            },
            {
                '{{#else}}': undefined,
            },
        ],
        time_keeping_claim_id: '{{#? TIMEKEEPINGCLAIMID}}',
    };
    return new Transform(template).transform(data, Object.keys(template));
};

module.exports = {
    detail,
    list,
    userList,
    listReviewLevel,
    blockDepartment,
    usersQC,
    reviewLevel,
    detailByScheduleId,
    imagesExplain
};
