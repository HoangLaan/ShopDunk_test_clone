const Transform = require('../../common/helpers/transform.helper');
const template = {
    order_type_id: '{{#? ORDERTYPEID}}',
    order_type_name: '{{#? ORDERTYPENAME}}',
    description: '{{#? DESCRIPTION}}',
    created_user: '{{#? CREATEDUSER}}',
    created_date: '{{#? CREATEDDATE}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    is_system: '{{ISSYSTEM ? 1 : 0}}',
    is_online: '{{ISONLINE ? 1 : 0}}',
    is_offline: '{{ISOFFLINE ? 1 : 0}}',
    is_warranty: '{{ISWARRANTY ? 1 : 0}}',
    is_exchange: '{{ISEXCHANGE ? 1 : 0}}',
    is_produce: '{{ISPRODUCE ? 1 : 0}}',
    is_return: '{{ISRETURN ? 1 : 0}}',
    is_offer: '{{ISOFFER ? 1 : 0}}',
    order_status_id: '{{#? ORDERSTATUSID}}',
    order_status_name: '{{#? STATUSNAME}}',
    is_completed: '{{ISCOMPLETED ? 1 : 0}}',
    add_function_id: '{{#? ADDFUNCTIONID}}',
    view_function_id: '{{#? VIEWFUNCTIONID}}',
    edit_function_id: '{{#? EDITFUNCTIONID}}',
    business_list: '{{#? BUSINESSLIST}}',
    out_put_type_id: '{{#? OUTPUTTYPEID}}',
    delete_function_id: '{{#? DELETEFUNCTIONID}}',
    type: '{{#? TYPE}}',

    status_type: '{{#? STATUSTYPE}}',
    company_id: '{{#? COMPANYID}}',
    company_name: '{{#? COMPANYNAME}}',
    type_name: '{{#? TYPENAME}}',

    order_index: '{{#? ORDERINDEX}}',
    content_sms: '{{#? CONTENTSMS}}',
    order_type_status_id: '{{#? ORDERTYPESTATUSID}}',
    is_send_zalo_oa: '{{ISSENDZALOOA ? 1 : 0}}',
    is_send_sms: '{{ISSENDSMS ? 1 : 0}}',
    is_all_business: '{{ISALLBUSINESS ? 1 : 0}}',
    is_send_email: '{{ISSENDEMAIL ? 1 : 0}}',
};

let transform = new Transform(template);

const detail = (data) => {
    return transform.transform(data, [
        'order_type_id',
        'order_type_name',
        'description',
        'is_active',
        'is_online',
        'is_offline',
        'is_warranty',
        'is_exchange',
        'is_produce',
        'is_return',
        'is_offer',
        'view_function_id',
        'add_function_id',
        'edit_function_id',
        'delete_function_id',
        'company_id',
        'order_index',
        'business_list',
        'out_put_type_id',
        'type',
        'is_system',
        'is_all_business',
    ]);
};

const list = (data = []) => {
    return transform.transform(data, [
        'order_type_id',
        'order_type_name',
        'description',
        'created_user',
        'created_date',
        'is_active',
        'company_name',
        'type_name',
        'business_list',
        'is_all_business',
    ]);
};

const statusListApply = (data = []) => {
    return transform.transform(data, [
        'order_type_status_id',
        'order_status_id',
        'order_status_name',
        'order_index',
        'is_completed',
        'description',
        'content_sms',
        'is_send_zalo_oa',
        'is_send_sms',
        'is_send_email',
    ]);
};

const stocksType = (data = []) => {
    const template = {
        order_type_id: '{{#? ORDERTYPEID }}',
        stocks_type_id: '{{#? STOCKSTYPEID }}',
        stocks_type_name: '{{#? STOCKSTYPENAME }}',
        stocks_type_code: '{{#? STOCKSTYPECODE }}',
    };

    return new Transform(template).transform(data, Object.keys(template));
};

module.exports = {
    list,
    detail,
    statusListApply,
    stocksType,
};
