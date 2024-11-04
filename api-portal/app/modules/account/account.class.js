const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
    member_id: '{{#? MEMBERID}}',
    user_name: '{{#? USERNAME}}',
    password: '{{#? PASSWORD}}',
    customer_code: '{{#? CUSTOMERCODE}}',
    type_register: '{{#? TYPEREGISTER}}',
    register_date: '{{#? REGISTERDATE}}',
    image_avatar: [
        {
            '{{#if IMAGEAVATAR}}': `${config.domain_cdn}{{IMAGEAVATAR}}`,
        },
        {
            '{{#else}}': null,
        },
    ],
    full_name: '{{#? FULLNAME}}',
    user_assigned: '{{#? USERASSIGNED}}',
    user_id: '{{#? USERID}}',
    birth_day: '{{#? BIRTHDAY}}',
    gender: '{{GENDER ? 1 : 0}}',
    marital_status: '{{#? MARITALSTATUS}}',
    phone_number: '{{#? PHONENUMBER}}',
    phone_number_secondary: '{{#? PHONENUMBERSECONDARY}}',
    email: '{{#? EMAIL}}',
    id_card: '{{#? IDCARD}}',
    id_card_date: '{{#? IDCARDDATE}}',
    id_card_place: '{{#? IDCARDPLACE}}',
    address: '{{#? ADDRESS}}',
    address_full: '{{#? ADDRESSFULL}}',
    province_id: '{{#? PROVINCEID}}',
    province_name: '{{#? PROVINCENAME}}',
    district_id: '{{#? DISTRICTID}}',
    district_name: '{{#? DISTRICTNAME}}',
    country_id: '{{#? COUNTRYID}}',
    country_name: '{{#? COUNTRYNAME}}',
    ward_id: '{{#? WARDID}}',
    ward_name: '{{#? WARDNAME}}',
    postal_code: '{{#? POSTALCODE}}',
    is_confirm: '{{ISCONFIRM ? 1 : 0}}',
    is_notification: '{{ISNOTIFICATION ? 1 : 0}}',
    is_can_email: '{{ISCANEMAIL ? 1 : 0}}',
    is_can_sms_or_phone: '{{ISCANSMSORPHONE ? 1 : 0}}',
    is_system: '{{ISSYSTEM ? 1 : 0}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    created_user: '{{#? CREATEDUSER}}',
    created_date: '{{#? CREATEDDATE}}',
    updated_user: '{{#? UPDATEDUSER}}',
    updated_date: '{{#? UPDATEDDATE}}',
    is_deleted: '{{#? ISDELETED}}',
    deleted_user: '{{#? DELETEDUSER}}',
    deleted_date: '{{#? DELETEDDATE}}',
    customer_type_id: '{{#? CUSTOMERTYPEID}}',
    presenter_id: '{{#? PRESENTERID}}',
    value: '{{#? CUSTOMERTYPEID}}',

    customer_type_name: '{{#? CUSTOMERTYPENAME}}',
    customer_type_name_: '{{#? CUSTOMERTYPENAME_}}',
    customer_type_name_from: '{{#? CUSTOMERTYPENAMEFROM}}',
    customer_type_name_to: '{{#? CUSTOMERTYPENAMETO}}',

    customer_type_name_from_id: '{{#? CUSTOMERTYPEFROMID}}',
    customer_type_name_to_id: '{{#? CUSTOMERTYPETOID}}',

    customer_type_name_from_color: '{{#? CUSTOMERTYPECOLORFROM}}',
    customer_type_name_to_color: '{{#? CUSTOMERTYPECOLORTO}}',

    status_customer_type: '{{#? STATUSCUSTOMERTYPEHISTORY}}',

    label: '{{#? CUSTOMERTYPENAME}}',

    status_data_leads_key: '{{#? STATUSDATALEADSKEY}}',
    status_data_leads_id: '{{#? STATUSDATALEADSID}}',
    status_data_leads_name: '{{#? STATUSDATALEADSNAME}}',
    task_id: '{{#? TASKID}}',
    task_status_id: '{{#? TASKSTATUSID}}',
    task_status_name: '{{#? TASKSTATUSNAME}}',
    attribute_values_id: '{{#? ATTRIBUTEVALUESID}}',
    attribute_values: '{{#? ATTRIBUTEVALUES}}',
    product_attribute_id: '{{#? PRODUCTATTRIBUTEID}}',
    attribute_description: '{{#? ATTRIBUTEDESCRIPTION}}',
    tailor_attribute_history_id: '{{#? TAILORATTRIBUTEHISTORYID}}',
    description: '{{#? DESCRIPTION}}',
    customer_company_name: '{{#? COMPANYNAME}}',
    customer_type_id: '{{#? CUSTOMERTYPEID}}',
    caring_user: '{{#? CARINGUSER}}',
    caring_user_name: '{{#? CARINGUSERNAME}}',
    gen_customer_code: '{{#? GEN_CUSTOMER_CODE}}',
    id: '{{#? ID}}',
    name: '{{#? NAME}}',

    anniversary_date: '{{#? ANNIVERSARYDATE}}',
    husband_wife_date: '{{#? HUSBANDWIFEDATE}}',
    source_id: '{{#? SOURCEID}}',
    career_id: '{{#? CAREERID}}',
    is_complete: '{{ISCOMPLETE ? 1 : 0}}',
    total_money: '{{TOTALMONEY ? TOTALMONEY : 0}}',
    order_id: '{{#? ORDERID}}',
    order_no: '{{#? ORDERNO}}',
    order_type_name: '{{#? ORDERTYPENAME}}',
    store_name: '{{#? STORENAME}}',
    payment_status: '{{PAYMENTSTATUS ? PAYMENTSTATUS : 0}}',
    delivery_status: '{{DELIVERYSTATUS ? DELIVERYSTATUS : 0}}',
    order_status: '{{#? ORDERSTATUS}}',
    created_date: '{{#? CREATEDDATE}}',
    updated_date: '{{#? UPDATEDDATE}}',
    address_id: '{{#? ADDRESSID}}',
    is_default: '{{ISDEFAULT ? 1 : 0}}',
    start_date: '{{#? STARTDATE}}',
    zalo_id: '{{#? ZALOID}}',
    facebook_id: '{{#? FACEBOOKID}}',
    task_data_leads_id: '{{#? TASKDATALEADSID}}',
    task_name: '{{#? TASKNAME}}',
    start_date: '{{#? STARTDATE}}',
    end_date: '{{#? ENDDATE}}',
    user_name: '{{#? USERNAME}}',
    super_visor_name: '{{#? SUPERVISORNAME}}',
    super_visor_id: '{{#? SUPERVISORID}}',
    status_data_leads_id: '{{#? STATUSDATALEADSID}}',
    status: '{{#? STATUS}}',
    status_name: '{{#? STATUSNAME}}',
    note: '{{#? NOTE}}',
    career_name: '{{#? CAREERNAME}}',
    number_order: '{{NUMBERORDER ? NUMBERORDER : 0}}',
    number_product_order: '{{NUMBERPODUCTORDER ? NUMBERPODUCTORDER : 0}}',
    source_name: '{{#? SOURCENAME}}',
    address_id: '{{#? ADDRESSID}}',

    request_id: '{{#? REQUESTID}}',
    day_reception: '{{#? DAYRECEPTION}}',
    cool_dinator_name: '{{#? COORDINATORNAME}}',
    repair_user_name: '{{#? REPAIRUSERNAME}}',
    request_type_id: '{{#? REQUESTTYPEID}}',
    request_type_name: '{{#? REQUESTTYPENAME}}',
    date_returned: '{{#? DATERETURNED}}',
    process_step_id: '{{#? PROCESSSTEPID}}',
    process_step_name: '{{#? PROCESSSTEPNAME}}',
    over_due: '{{#? OVERDUE}}',

    process_step_id: '{{#? PROCESSSTEPID}}',
    process_step_name: '{{#? PROCESSSTEPNAME}}',

    order_count: '{{#? ORDERCOUNT}}',
    days_since_last_order: '{{#? DAYSSINCELASTORDER}}',
    last_order_date: '{{#? LASTORDERDATE}}',
    product_order_count: '{{#? PRODUCTORDERCOUNT}}',
    count_task: '{{#? COUNTTASK}}',

    total_point: '{{#? TOTALPOINT}}',
    current_wflow_name: '{{#? WORKFLOWNAME}}',
    product_name: '{{#? PRODUCTNAME}}',
    sale_sasistant: '{{#? SALESASSISTANT}}',
};

let transform = new Transform(template);
const customerTypeHistory = (user) => {
    return transform.transform(user, [
        'start_date',
        'description',
        'customer_type_name_from',
        'customer_type_name_to',
        'customer_type_name_from_id',
        'customer_type_name_to_id',
        'customer_type_name_from_color',
        'customer_type_name_to_color',
        'status_customer_type',
    ]);
};

const customerRepairHistory = (user) => {
    return transform.transform(user, [
        'request_id',
        'day_reception',
        'cool_dinator_name',
        'repair_user_name',
        'request_type_id',
        'request_type_name',
        'date_returned',
        'total_money',
        'process_step_id',
        'process_step_name',
        'over_due',
    ]);
};

const purchaseHistoryList = (list) => {
    return transform.transform(list, [
        'order_id',
        'order_no',
        'order_status',
        'total_money',
        'delivery_status',
        'payment_status',
        'store_name',
        'created_date',
        'updated_date',
        'order_type_name',
        'is_complete',
        'product_name',
        'sale_sasistant'
    ]);
};

const purchaseHistoryStatistics = (obj) => {
    const transform = new Transform({
        total_money: '{{TOTALMONEY ? TOTALMONEY : 0}}',
        total_orders: '{{TOTALORDERS ? TOTALORDERS : 0}}',
        total_products: '{{TOTALPRODUCTS ? TOTALPRODUCTS : 0}}',
    });

    return transform.transform(obj, ['total_money', 'total_orders', 'total_products']);
};

const detail = (user) => {
    return transform.transform(user, [
        'source_id',
        'career_id',
        'anniversary_date',
        'husband_wife_date',
        'member_id',
        'user_name',
        'password',
        'customer_code',
        'type_register',
        'register_date',
        'image_avatar',
        'full_name',
        'birth_day',
        'gender',
        'marital_status',
        'phone_number',
        'phone_number_secondary',
        'email',
        'id_card',
        'id_card_date',
        'id_card_place',
        'address',
        'province_id',
        'province_name',
        'district_id',
        'district_name',
        'country_id',
        'country_name',
        'ward_id',
        'ward_name',
        'postal_code',
        'is_confirm',
        'is_notification',
        'is_can_email',
        'is_system',
        'is_active',
        'is_can_sms_or_phone',
        'caring_user',
        'customer_type_id',
        'presenter_id',
        'zalo_id',
        'facebook_id',
        'address_id',
        'customer_type_name',
    ]);
};

const genCustomerCode = (user) => {
    return transform.transform(user, ['gen_customer_code']);
};

const listCustomerType = (list = []) => {
    return transform.transform(list, ['customer_type_id', 'customer_type_name']);
};

const listProcess = (list = []) => {
    return transform.transform(list, ['process_step_id', 'process_step_name']);
};

const listCustomerTypeValueLabel = (list = []) => {
    return transform.transform(list, ['value', 'label']);
};

const list = (users = []) => {
    return transform.transform(users, [
        'member_id',
        'customer_code',
        'full_name',
        'gender',
        'birth_day',
        'phone_number',
        'customer_type_name',
        'customer_type_name_',
        'customer_type_id',
        'total_point',
        'address_full',
        'type_register',
        'is_active',
        'email',
        'status_data_leads_key',
        'status_data_leads_name',
        'status_data_leads_id',
        'customer_company_name',
        'caring_user',
        'caring_user_name',
        'zalo_id',
        'number_order',
        'number_product_order',
        'source_name',
        'order_count',
        'days_since_last_order',
        'last_order_date',
        'product_order_count',
        'count_task',
        'current_wflow_name'
    ]);
};
// options
const templateOptions = {
    id: '{{#? ID}}',
    name: '{{#? NAME}}',
};

const options = (userGroups = []) => {
    let transform = new Transform(templateOptions);
    return transform.transform(userGroups, ['id', 'name']);
};

const listHistory = (areas = []) => {
    return transform.transform(areas, [
        'tailor_attribute_history_id',
        'member_id',
        'description',
        'created_user',
        'created_date',
    ]);
};
const listSource = (list = []) => {
    return transform.transform(list, ['id', 'name']);
};
const listAddress = (data = []) => {
    return transform.transform(data, [
        'address_id',
        'gender',
        'full_name',
        'phone_number',
        'career_id',
        'province_id',
        'province_name',
        'district_id',
        'district_name',
        'ward_id',
        'ward_name',
        'address',
        'is_default',
        'note',
        'career_name',
        'address_full',
        'email'
    ]);
};

const templateProductWatchlist = {
    product_code: '{{#? PRODUCTCODE}}',
    product_id: '{{#? PRODUCTID}}',
    product_name: '{{#? PRODUCTNAME}}',
    model_id: '{{#? MODELID}}',
    model_name: '{{#? MODELNAME}}',
    created_date: '{{#? CREATEDDATE}}',
    product_quantity: '{{#? QUANTITY}}',
};

const productWatchlist = (products = []) => {
    let transform = new Transform(templateProductWatchlist);
    return transform.transform(products, [
        'product_id',
        'product_code',
        'product_name',
        'model_id',
        'model_name',
        'created_date',
        'product_quantity',
    ]);
};

const dataleadshistory = (list) => {
    return transform.transform(list, [
        'task_id',
        'task_data_leads_id',
        'task_name',
        'start_date',
        'end_date',
        'user_name',
        'super_visor_name',
        'status_data_leads_id',
        'status',
        'status_name',
        'member_id',
        'user_id',
        'super_visor_id',
    ]);
};

const listAccountTask = (users = []) => {
    return transform.transform(users, [
        'member_id',
        'customer_code',
        'full_name',
        'gender',
        'birth_day',
        'phone_number',
        'address_full',
        'is_active',
        'email',
        'status_data_leads_key',
        'status_data_leads_name',
    ]);
};

const template_member_point = {
    member_point_id: '{{#? MEMBERPOINTID}}',
    member_id: '{{#? MEMBERID}}',
    created_date: '{{#? CREATEDDATE}}',
    current_point: '{{#? CURRENTPOINT}}',
    plus_point: '{{#? PLUSPOINT}}',
    total_point: '{{#? TOTALPOINT}}',
    order_id: '{{#? ORDERID}}',
    created_user: '{{#? CREATEDUSER}}',
    is_exchange: '{{#? ISEXCHANGE}}',
    product_comment_id: '{{#? PRODUCTCOMMENTID}}',
    is_platfrom: '{{#? ISPLATFORM}}',
    sub_point: '{{#? SUBPOINT}}',
    order_no: '{{#? ORDERNO}}',
    sum_total_all: '{{#? SUMTOTALPOINT}}',
    sum_curent_point: '{{#? SUMCURRENTPOINT}}',
};

let transform_member_point = new Transform(template_member_point);
const list_member_point = (data = []) => {
    return transform_member_point.transform(data, [
        'member_point_id',
        'member_id',
        'created_date',
        'current_point',
        'plus_point',
        'total_point',
        'order_id',
        'created_user',
        'is_exchange',
        'product_comment_id',
        'is_platfrom',
        'sub_point',
        'order_no',
        'sum_total_all',
        'sum_curent_point',
    ]);
};

const list_user_repair = (data = []) => {
    return transform.transform(data, ['user_assigned', 'full_name']);
};

const optionsProductAttribute = (data = []) => {
    const _template = {
        id: '{{#? ID}}',
        name: '{{#? NAME}}',
        values: '{{#? ATTRIBUTEVALUES? ATTRIBUTEVALUES.split("|"): []}}',
    };
    return new Transform(_template).transform(data, Object.keys(_template));
};

const customerHobbies = (data = []) => {
    const _template = {
        account_hobbies_id: '{{#? ACCOUNTHOBBIESID}}',
        member_id: '{{#? MEMBERID}}',
        hobbies_id: '{{#? HOBBIESVALUEID}}',
        hobbies_name: '{{#? HOBBIESNAME}}',
        hobbies_value_list: '{{#? HOBBIESVALUELIST}}',
    };
    return new Transform(_template).transform(data, Object.keys(_template));
};

const customerRelatives = (data = []) => {
    const _template = {
        member_ref_id: '{{#? MEMBERREFID}}',
        customer_code: '{{#? CUSTOMERCODE}}',
        gender: '{{ GENDER ? 1 : 0 }}',
        full_name: '{{#? FULLNAME}}',
        birth_day: '{{#? BIRTHDAY}}',
        phone_number: '{{#? PHONENUMBER}}',
        email: '{{#? EMAIL}}',
        relationship_member_id: '{{#? RELATIONSHIPMEMBERID}}',
        relationship_name: '{{#? RELATIONSHIPNAME}}',
    };
    return new Transform(_template).transform(data, Object.keys(_template));
};

const customerCompany = (data = {}) => {
    const _template = {
        customer_company_id: '{{#? CUSTOMERCOMPANYID}}',
        customer_company_name: '{{#? CUSTOMERCOMPANYNAME}}',
        representative_name: '{{#? REPRESENTATIVENAME}}',
        phone_number: '{{#? PHONENUMBER}}',
        email: '{{#? EMAIL}}',
        tax_code: '{{#? TAXCODE}}',
    };
    return new Transform(_template).transform(data, Object.keys(_template));
};

const customerListUser = (data = []) => {
    const _template = {
        customer_id: '{{#? CUSTOMERID}}',
        full_name: '{{#? FULLNAME}}',
        phone_number: '{{#? PHONENUMBER}}',
    };
    return new Transform(_template).transform(data, Object.keys(_template));
};

module.exports = {
    customerRepairHistory,
    listCustomerType,
    detail,
    genCustomerCode,
    list,
    listProcess,
    options,
    listHistory,
    listSource,
    purchaseHistoryList,
    purchaseHistoryStatistics,
    listAddress,
    customerTypeHistory,
    dataleadshistory,
    productWatchlist,
    listCustomerTypeValueLabel,
    listAccountTask,
    list_member_point,
    list_user_repair,
    optionsProductAttribute,
    customerHobbies,
    customerRelatives,
    customerCompany,
    customerListUser,
};
