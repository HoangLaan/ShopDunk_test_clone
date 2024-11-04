const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');

const template = {
    'off_work_type_id': '{{#? OFFWORKTYPEID}}',
    'off_work_name': '{{#? OFFWORKNAME}}',
    'is_active': '{{ISACTIVE ? 1 : 0}}',
    'values_off': '{{#? VALUESOFF }}',
    'description': '{{#? DESCRIPTION}}',
    'is_day': '{{ISDAY ? 1 : 0}}',
    'is_hour': '{{ ISHOURS ? 1 : 0 }}',
    'is_sub_time_off': '{{ISSUBTIMEOFF ? 1 : 0}}',
    'updated_user': '{{#? UPDATEDUSER }}',
    'deleted_user': '{{#? DELETEUSER }}',
    'created_date': '{{#? CREATEDDATE}}',
    'value': '{{#? OFFWORKTYPEID}}',
    'offwork_types': '{{#? OFFWORKTYPES}}',
    'offwork_rl_id': '{{#? OFFWORKREVIEWLEVELID}}',
    'offwork_rl_name': '{{#? REVIEWLEVELNAME}}',
    'offwork_level_user_id': '{{#? OFFWORKLEVELUSERID}}',
    'user_name': '{{#? USERREVIEW}}',
    'full_name': '{{#? FULLNAME}}',
    'user_id': '{{#? USERID}}',
    'default_picture_url': `${config.domain_cdn}{{DEFAULTPICTUREURL}}`,
    'campaign_type_relevels': '{{#? CAMPAIGNTYPERELEVELS}}',
    'is_review': '{{ISREVIEW ?  : 0}}',
    'review_note': '{{#? REVIEWNOTE}}',
    'username_review': '{{#? USERNAMEREVIEW}}',
    'review_date': '{{#? REVIEWDATE}}',
    'offwork_review_list_id': '{{#? OFFWORKREVIEWLISTID}}',
    'is_complete_review': '{{#? ISCOMPLETEREVIEW}}',
    'is_auto_review': '{{ISAUTOREVIEW ? 1 : 0}}',

    'before_day': '{{BEFOREDAY ? BEFOREDAY : 0}}',
    'max_day_off': '{{MAXDAYOFF ? MAXDAYOFF : 0}}',
    'company_id': '{{#? COMPANYID}}',
    'company_name': '{{#? COMPANYNAME}}',

    'id': '{{#? OFFWORKTYPEID}}',
    'name': '{{#? OFFWORKNAME}}',
    'value': '{{#? OFFWORKTYPEID}}',
    'label': '{{#? OFFWORKNAME}}',
};

let transform = new Transform(template);

const detail = (offWorkType) => {
    return transform.transform(offWorkType, [
        'off_work_type_id', 'off_work_name', 'is_active', 'values_off', 'description', 'is_day',
        'is_hour', 'is_sub_time_off', 'created_date',  'is_auto_review', 'before_day', 'max_day_off', 'company_id'
    ]);
};

const list = (data = []) => {
    return transform.transform(data, [
        'off_work_type_id', 'off_work_name', 'is_active', 'values_off', 
        'description', 'is_day', 'is_hour', 'is_sub_time_off', 'created_date', 'value', 'is_auto_review',
        'max_day_off', 'before_day', 'company_name'
    ]);
};

const listRlUser = (dataList = [], useDetail = true) => {
    const template = {
        'offwork_review_level_id': '{{#? OFFWORKREVIEWLEVELID}}',
        'department_id': '{{#? DEPARTMENTID}}',
        'value': '{{#? USERREVIEW}}',
        'id': '{{#? USERREVIEW}}',
        'order_index': '{{#? ORDERINDEX}}',
        'off_work_type_id': '{{#? OFFWORKTYPEID}}',
        'name': '{{#? FULLNAME}}',
        'label': '{{#? FULLNAME}}',
        'is_complete_review': '{{ISCOMPLETEREVIEW ? 1 : 0}}',
        'is_auto_review': '{{ISAUTOREVIEW ? 1 : 0}}',


        'offwork_review_level_name': '{{#? OFFWORKREVIEWLEVELNAME}}',
        'username': '{{#? USERNAME}}',
        'full_name': '{{#? FULLNAME}}',
        'user_id': '{{#? USERID}}',
        'default_picture_url': `${config.domain_cdn}{{DEFAULTPICTUREURL}}`,
        'company_id': '{{#? COMPANYID}}',
    }
    let transform = new Transform(template);
    if(!useDetail)
        return transform.transform(dataList, [
            'offwork_review_level_id','offwork_review_level_name', 'username', 'full_name','user_id','default_picture_url',
            'department_id', 'company_id',  'is_auto_review'
        ]);
    return transform.transform(dataList, [
        'offwork_review_level_id', 'department_id', 'value', 'id', 'order_index', 
        'off_work_type_id', 'name', 'label', 'is_complete_review', 'is_auto_review'
    ]);
};

const userOptions = (users = []) => {
    const template = {
        'name': '{{#? NAME}}',
        'id': '{{#? ID}}',
        'review_level_id': '{{#? REVIEWLEVELID}}',
    }
    let transform = new Transform(template);
    return transform.transform(users, [
        'id', 'name', 'review_level_id'
    ]);
};

const optionsCreate = (data = []) => {
    return transform.transform(data, [
        'off_work_type_id', 'off_work_name', 'values_off', 
        'is_day', 'is_hour', 'is_sub_time_off', 
        'max_day_off', 'before_day', 'company_id',
        'name', 'id', 'value', 'label'
    ]);
};

const optionsByUser = (data = []) => {
    return transform.transform(data, [
        'name', 'id', 'value', 'label'
    ]);
};

module.exports = {
    list,
    detail,
    listRlUser,
    userOptions,
    optionsCreate,
    optionsByUser
};
