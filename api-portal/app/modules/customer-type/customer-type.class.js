const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
    customer_type_id: '{{#? CUSTOMERTYPEID}}',
    business_id: '{{#? BUSINESSID}}',
    business_name: '{{#? BUSINESSNAME}}',
    customer_type_name: '{{#? CUSTOMERTYPENAME}}',
    color: '{{#? COLOR}}',
    note_color: '{{#? NOTECOLOR}}',
    description: '{{#? DESCRIPTION}}',
    order_index: '{{#? ORDERINDEX}}',
    is_member_type: '{{ISMEMBERTYPE ? 1 : 0}}',
    is_business: '{{ISBUSSINESS ? 1 : 0}}',
    is_customer_lead: '{{ISCUSTOMERLEAD ? 1 : 0}}',

    is_system: '{{ISSYSTEM ? 1 : 0}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    created_user: '{{#? CREATEDUSER}}',
    created_date: '{{#? CREATEDDATE}}',
    updated_user: '{{#? UPDATEDUSER}}',
    updated_date: '{{#? UPDATEDDATE}}',
    deleted_user: '{{#? DELETEDUSER}}',
    deleted_date: '{{#? DELETEDDATE}}',
    company_id: '{{#? COMPANYID}}',
    company_name: '{{#? COMPANYNAME}}',
    debt_time: '{{#? DEBTTIMEFROM}}',

    time_limit: '{{#? TIMELIMIT}}',
    time_type: '{{#? TIMETYPE}}',
    icon_url: [
        {
            '{{#if ICONURL}}': `${config.domain_cdn}{{ICONURL}}`,
        },
        {
            '{{#else}}': null,
        },
    ],

    total_paid_from: '{{#? TOTALPAIDFROM}}',
    total_paid_to: '{{#? TOTALPAIDTO}}',
    time_total_paid_from: '{{#? TIMETOTALPAIDFROM}}',
    time_total_paid_to: '{{#? TIMETOTALPAIDTO}}',
    time_type_total_paid: '{{#? TIMETYPETOTALPAID}}',

    total_point_from: '{{#? TOTALPOINTFROM}}',
    total_point_to: '{{#? TOTALPOINTTO}}',
    time_total_point_from: '{{#? TIMETOTALPOINTFROM}}',
    time_total_point_to: '{{#? TIMETOTALPOINTTO}}',
    time_type_total_point: '{{#? TIMETYPETOTALPOINT}}',

    total_buy_from: '{{#? TOTALBUYFROM}}',
    total_buy_to: '{{#? TOTALBUYTO}}',
    time_total_buy_from: '{{#? TIMETOTALBUYFROM}}',
    time_total_buy_to: '{{#? TIMETOTALBUYTO}}',
    time_type_total_buy: '{{#? TIMETYPETOTALBUY}}',

    condition_1: '{{#? CONDITION1}}',
    condition_2: '{{#? CONDITION2}}',
    type_customer: '{{#? TYPECUSTOMER}}',

    condition_1: '{{#? CONDITION1}}',
    condition_2: '{{#? CONDITION2}}',
};

let transform = new Transform(template);

const detail = (user) => {
    return transform.transform(user, [
        'customer_type_id',
        'business_id',
        'business_name',
        'customer_type_name',
        'color',
        'note_color',
        'order_index',
        'is_member_type',
        'is_business',
        'is_customer_lead',
        'is_system',
        'description',
        'is_active',
        'created_user',
        'created_date',
        'company_id',
        'company_name',
        'debt_time',
        'total_paid',
        'time_limit',
        'time_type',
        'icon_url',
        'total_paid_from',
        'total_paid_to',
        'time_total_paid_from',
        'time_total_paid_to',
        'time_type_total_paid',
        'total_point_from',
        'total_point_to',
        'time_total_point_from',
        'time_total_point_to',
        'time_type_total_point',
        'total_buy_from',
        'total_buy_to',
        'time_total_buy_from',
        'time_total_buy_to',
        'time_type_total_buy',
        'condition_1',
        'condition_2',
    ]);
};

const list = (users = []) => {
    return transform.transform(users, [
        'customer_type_id',
        'business_id',
        'business_name',
        'customer_type_name',
        'is_system',
        'created_user',
        'created_date',
        'is_active',
        'company_name',
        'business_name',
        'company_id',
        'company_name',
        'debt_time',
        'color',
        'note_color',
        'order_index',
        'type_customer',
    ]);
};

module.exports = {
    detail,
    list,
};
