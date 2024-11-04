const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
    request_id: '{{#? REQUESTID}}',
    request_type_id: '{{#? REQUESTTYPEID * 1}}',
    request_type_name: '{{#? REQUESTTYPENAME}}',
    request_code: '{{#? REQUESTCODE}}',
    day_reception: '{{#? DAYRECEPTION}}',
    delivery_date: '{{#? DELIVERYDATE}}',
    date_returned: '{{#? DATERETURNED}}',
    get_note: '{{#? GETNOTE}}',
    process_step_id: '{{#? PROCESSSTEPID * 1}}',
    process_step_name: '{{#? PROCESSSTEPNAME}}',

    customer_name: '{{#? CUSTOMERFULLNAME}}',
    customer_type_id: '{{#? CUSTOMERTYPEID}}',
    member_id: '{{#? MEMBERID * 1}}',
    user_name: '{{#? USERNAME}}',
    full_name: '{{#? FULLNAME}}',
    last_name: '{{#? LASTNAME}}',
    first_name: '{{#? FIRSTNAME}}',
    department_id: '{{#? DEPARTMENTID}}',

    phone_number: '{{#? PHONENUMBER}}',
    email: '{{#? EMAIL}}',
    image_avatar: [
        {
            '{{#if IMAGEAVATAR}}': `${config.domain_cdn}{{IMAGEAVATAR}}`,
        },
        {
            '{{#else}}': null,
        },
    ],
    picture_url: [
        {
            '{{#if PICTUREURL}}': `${config.domain_cdn}{{PICTUREURL}}`,
        },
        {
            '{{#else}}': null,
        },
    ],

    image_url: [
        {
            '{{#if IMAGEURL}}': `${config.domain_cdn}{{IMAGEURL}}`,
        },
        {
            '{{#else}}': null,
        },
    ],
    product_id: '{{#? PRODUCTID * 1}}',
    product_name: '{{#? PRODUCTNAME}}',
    shell_color: '{{#? SHELLCOLOR}}',
    product_imei_code: '{{#? PRODUCTIMEICODE}}',
    product_category_id: '{{#? PRODUCTCATEGORYID * 1}}',
    product_category_name: '{{#? CATEGORYNAME}}',
    model_id: '{{#? MODELID * 1}}',
    model_name: '{{#? MODELNAME}}',
    coordinator: '{{#? COORDINATORCODE * 1}}',
    coordinator_full_name: '{{#? COORDINATORFULLNAME}}',
    coordinator_url: [
        {
            '{{#if COORDINATORURL}}': `${config.domain_cdn}{{COORDINATORURL}}`,
        },
        {
            '{{#else}}': null,
        },
    ],

    repair_note: '{{#? REPAIRNOTE}}',
    repair_user_code: '{{#? REPAIRUSERCODE}}',
    repair_user_full_name: '{{#? REPAIRUSERFULLNAME}}',
    repair_user_url: [
        {
            '{{#if REPAIRUSERURL}}': `${config.domain_cdn}{{REPAIRUSERURL}}`,
        },
        {
            '{{#else}}': null,
        },
    ],

    checker_user: '{{#? CHECKERUSERCODE * 1}}',
    checker_user_full_name: '{{#? CHECKERUSERFULLNAME}}',
    checker_user_url: [
        {
            '{{#if CHECKERUSERURL}}': `${config.domain_cdn}{{CHECKERUSERURL}}`,
        },
        {
            '{{#else}}': null,
        },
    ],

    pro_status_id: '{{#? PROSTATUSID}}',
    pro_status_name: '{{#? PROSTATUSNAME}}',
    pro_status_code: '{{#? PROSTATUSCODE}}',

    accessory_id: '{{#? ACCESSORYID}}',
    accessory_name: '{{#? ACESSORYNAME}}',
    accessory_code: '{{#? ACESSORYCODE}}',

    updated_user: '{{#? UPDATEDUSER}}',
    updated_date: '{{#? UPDATEDDATE}}',
    deleted_user: '{{#? DELETEDUSER}}',
    deleted_date: '{{#? DELETEDDATE}}',

    error_id: '{{#? ERRORID}}',
    error_name: '{{#? ERRORNAME}}',
    error_code: '{{#? ERRORCODE}}',
    level_name: '{{#? LEVELNAME}}',
    quantity: '{{#? QUANTITY}}',
    error_group_name: '{{#? ERRORGROUPNAME}}',

    solution_name: '{{#? SOLUTIONNAME}}',
    solution_id: '{{#? SOLUTIONID}}',
    reference_price: '{{#? REFERENCEPRICE}}',
    highest_price: '{{#? HIGHESTPRICE}}',
    lowest_price: '{{#? LOWESTPRICE}}',

    component_id: '{{#? COMPONENTID}}',
    component_name: '{{#? COMPONENTNAME}}',
    reference_price: '{{#? REFERENCEPRICE}}',
    total_inventory: '{{TOTALINVENTORY ? TOTALINVENTORY : 0}}',

    stocks_out_request_code: '{{#? STOCKSOUTREQUESTCODE}}',
    component_code: '{{#? COMPONENTCODE}}',
    quantity: '{{#? QUANTITY}}',
    lot_number: '{{#? LOTNUMBER}}',
    supplier_name: '{{#? SUPPLIERNAME}}',
    unit_name: '{{#? UNITNAME}}',
    price: '{{PRICE ? PRICE : 0}}',
    change_price: '{{CHANGEPRICE ? CHANGEPRICE : 0}}',
    stocks_detail_id: '{{#? STOCKSDETAILID}}',
    unit_id: '{{#? UNITID}}',
    component_imei_code: '{{#? COMPONENTIMEICODE}}',
    created_date: '{{#? CREATEDDATE}}',

    list_id: '{{#? LISTID}}',

    rq_war_repair_error_id: '{{#? RQWAREPAIRERRORID}}',
    repair_status_id: '{{REPAIRSTATUSID ? REPAIRSTATUSID : 0}}',
    progress: '{{PROGRESS ? PROGRESS : 0}}',
    note: '{{#? NOTE}}',
    description: '{{#? DESCRIPTION}}',
    est_start_time: '{{#? ESTSTARTTIME}}',
    est_end_time: '{{#? ESTLENDTIME}}',
    est_total_time: '{{#? ESTTOTALTIME}}',

    actual_start_time: '{{#? ACTUALSTARTTIME}}',
    actual_end_time: '{{#? ACTUALENDTIME}}',
    actual_total_time: '{{#? ACTUALTOTALTIME}}',

    user_assigned: '{{#? USERASSIGNED *1}}',
    user_assigned_full_name: '{{#? USERASSIGNFULLNAME}}',

    assignee: '{{#? ASSIGNEE}}',
    assignee_full_name: '{{#? ASSIGNEEFULLNAME}}',

    task_quaility: '{{#? TASKQUAILITY}}',
    piority_id: '{{#? PIORITYID}}',

    support_type_id: '{{#? SUPPORTTYPEID}}',
    support_type_name: '{{#? SUPPORTTYPENAME}}',
    support_type: '{{#? SUPPORTTYPE}}',
    review_user: '{{#? REVIEWUSER}}',

    address: '{{#? ADDRESS}}',
    province_id: '{{#? PROVINCEID}}',
    district_id: '{{#? DISTRICTID}}',
    ward_id: '{{#? WARDID}}',
    request_quantity: '{{#? REQUESTQUANTITY}}',

    reason: '{{#? REASON}}',
    is_reviewed: '{{ISREVIEWED ? 1 : 0}}',
    end_time: '{{#? ENDTIME}}',

    address_full: '{{#? ADDRESSFULL}}',
    tax_id: '{{#? TAXID}}',
    phone_number_account: '{{#? PHONENUMBERACCOUNT}}',
    address_full_account: '{{#? ADDRESSFULLACCOUNT}}',
    buy_date: '{{#? BUYDATE}}',
    accessory: '{{#? ACCESSORY}}',

    total_files: '{{TOTALFILES ? TOTALFILES : 0}}',
    total_note_warranty: '{{TOTALNOTEWARRANTY ? TOTALNOTEWARRANTY : 0}}',
    total_note_error: '{{TOTALNOTEERROR ? TOTALNOTEERROR : 0}}',
    total_note_history: '{{TOTALNOTEHISTORY ? TOTALNOTEHISTORY : 0}}',

    request_type_step_id: '{{#? REQUESTTYPEPSTEPID}}',
    history_time: '{{#? HISTORYTIME}}',
    company_name: '{{#? COMPANYNAME}}',

    stocks_out_type_id: '{{#? STOCKSOUTTYPEID}}',
    stocks_out_type_name: '{{#? STOCKSOUTTYPENAME}}',
    is_internal: '{{ISINTERNAL ? 1 : 0}}',
    is_auto_review: '{{ISAUTOREVIEW ? 1 : 0}}',
    is_returned: '{{ISRETURNED ? 1 : 0}}',

    stocks_in_request_code: '{{#? STOCKSINREQUESTCODE}}',
    rq_war_repair_component_id: '{{#? RQWAREPAIRCOMPONENTID}}',

    total_price: '{{#? TOTALPRICE}}',
    cost_price: '{{#? COSTPRICE}}',
    total_price_cost: '{{#? TOTALPRICECOST}}',
    total_cost_basic_imei: '{{#? TOTALCOSTBASICIMEI}}',

    store_id: '{{#? STOREID}}',
    store_name: '{{#? STORENAME}}',

    attachment_name: '{{#? ATTACHMENTNAME}}',
    attachment_path: '{{#? ATTACHMENTPATH}}',
    note: '{{#? NOTE}}',
    stocks_out_id: '{{#? STOCKSOUTID}}',
    rq_war_repair_accessory_id: '{{#? RQWAREPAIRACCESSORYID}}',

    created_user_name: '{{#? CREATEDUSERNAME}}',
    created_user: '{{#? CREATEDUSER}}',
    store_receive_id: '{{#? STORERECEIVEID}}',
    store_receive_name: '{{#? STORERECEIVENAME}}',
    store_return_id: '{{#? STORERETURNID}}',
    store_return_name: '{{#? STORERETURNNAME}}',

    id: '{{#? ID}}',
    name: '{{#? NAME}}',
    code: '{{#? CODE}}',
    is_user: '{{ISUSER ? 1 : 0}}',
    is_agree_no_security: '{{ISAGREENOSECURITY ? 1 : 0}}',

    warranty_transfer_id: '{{#? WARRANTYTRANSFERID}}', // nếu là id này tức được chuyển bảo hành
    is_cancel: '{{ISCANCEL ? 1 : 0}}',
    is_can_cancel: '{{ISCANCANCEL ? 1 : 0}}',
    reason_cancel: '{{#? REASONCANCEL}}',

    add_function_alias: '{{#? ADDFUNCTIONALIAS}}',
    edit_function_alias: '{{#? EDITFUNCTIONALIAS}}',
    view_function_alias: '{{#? VIEWFUNCTIONALIAS}}',
    delete_function_alias: '{{#? DELETEFUNCTIONALIAS}}',

    is_no_error: '{{ISNOERROR ? 1 : 0}}',
    repair_price: '{{#? REPAIRPRICE}}',

    coupon_id: '{{#? COUPONID * 1}}',
    coupon_name: '{{#? COUPONNAME}}',
    coupon_code: '{{#? COUPONCODE}}',
    coupon_value: '{{#? COUPONVALUE}}',
    promotion_money: '{{#? PROMOTIONMONEY}}',
    temporary_money: '{{#? TEMPORARYMONEY}}',
    total_money: '{{#? TOTALMONEY}}',
    money_cash: '{{#? MONEYCASH}}',
    money_transfer: '{{#? MONEYTRANSFER}}',
    bank_account_id: '{{#? BANKACCOUNTID * 1}}',

    is_outputted: '{{ISOUTPUTTED ? 1 : 0}}',
    value: '{{#? ID}}',
    label: '{{#? NAME}}',
    is_complete: '{{ISCOMPLETE ? 1 : 0}}',
    stocks_id: '{{#? STOCKSID}}',
    stocks_name: '{{#? STOCKSNAME}}',
    stocks_in_type_id: '{{#? STOCKSINTYPEID}}',
    stocks_manager: '{{#? STOCKSMANAGERUSER}}',

    list_error_id: '{{#? LISTERRORID}}',
    is_all_error: '{{ISALLERROR ? 1 : 0}}',
    is_any_error: '{{ISANYERROR ? 1 : 0}}',
    is_appoint_error: '{{ISAPPOINTERROR ? 1 : 0}}',

    receive_slip_id: '{{#? RECEIVESLIPID}}',
    stocks_in_request_id: '{{#? STOCKSINREQUESTID}}',
    stocks_out_request_id: '{{#? STOCKSOUTREQUESTID}}',

    is_component_test: '{{ISCOMPONENTTEST ? 1 : 0}}',
    is_component_replace: '{{ISCOMPONENTREPLACE ? 1 : 0}}',
    stocks_out_type_test_id: '{{#? STOCKSOUTTYPETESTID}}',
    stocks_out_type_replace_id: '{{#? STOCKSOUTTYPEREPLACEID}}',
    order_index_process: '{{#? ORDERINDEXPROCESS}}',
    warranty_period_id: '{{#? WARRANTYPERIODID}}',
    period: '{{#? PERIOD}}',
    date_start_warranty: '{{#? DATESTARTWARRANTY}}',
    date_end_warranty: '{{#? DATEENDWARRANTY}}',

    stocks_in_type_internal: '{{#? STOCKSINTYPEINTERNALID}}',
    stocks_in_type_exchange: '{{#? STOCKSINTYPEEXCHANGEID}}',
    total_import: '{{#? TOTALIMPORT}}',
    total_export: '{{#? TOTALEXPORT}}',
    is_imported: '{{ISIMPORTED ? 1 : 0}}',

    deposit_money: '{{#? DEPOSITMONEY}}',
    process_time: '{{#? PROCESSTIME}}',
    is_warranty: '{{ ISWARRANTY ? 1 : 0}}',
    is_internal: '{{ISINTERNAL ? 1 : 0}}',
    content: '{{#? CONTENT}}',

    is_return: '{{ISRETURN ? ISRETURN : 0}}',
    rq_wa_repair_component_id: '{{#? RQWAREPAIRCOMPONENTID}}',
    output_type_id: '{{#? OUTPUTTYPEID}}',
    output_type_name: '{{#? OUTPUTTYPENAME}}',
    price_id: '{{#? PRICEID}}',
    change_price: '{{#? CHANGEPRICE}}',
    change_value: '{{#? CHANGEVALUE}}',
    is_sell: '{{ISSELL ? 1 : 0}}',
    province_name: '{{#? PROVINCENAME}}',
    pro_status: '{{#? PROSTATUS}}',
    is_output_type_id: '{{ISOUTPUTTYPEID ? 1 : 0}}'

};

let transform = new Transform(template);

const list = data => {
    return transform.transform(data, [
        'request_id',
        'request_type_id',
        'request_type_name',
        'request_code',
        'day_reception',
        'delivery_date',
        'date_returned',
        'process_step_id',
        'process_step_name',
        'coordinator_code',
        'coordinator_full_name',
        'coordinator_url',
        'repair_user_code',
        'repair_user_full_name',
        'repair_user_url',
        'checker_user_code',
        'checker_user_full_name',
        'checker_user_url',
        'total_note_warranty',
        'total_note_error',
        'total_note_history',
        'total_files',
        'product_name',
        'customer_name',
        'warranty_transfer_id',
        'is_cancel',
        'add_function_alias',
        'edit_function_alias',
        'view_function_alias',
        'delete_function_alias',
        'is_no_error',
        'product_imei_code'
    ]);
};

const detail = data => {
    return transform.transform(data, [
        'request_id',
        'request_type_id',
        'request_type_name',
        'request_code',
        'day_reception',
        'delivery_date',
        'date_returned',
        'get_note',
        'process_step_id',
        'process_step_name',
        'member_id',
        'full_name',
        'phone_number',
        'email',
        'address_full',
        'image_avatar',
        'product_category_id',
        'product_category_name',
        'model_id',
        'model_name',
        'product_id',
        'product_name',
        'product_imei_code',
        'coordinator',
        'coordinator_full_name',
        'coordinator_url',
        'repair_user_code',
        'repair_note',
        'repair_user_full_name',
        'repair_user_url',
        'checker_user',
        'checker_user_full_name',
        'checker_user_url',
        'created_user',
        'created_user_name',
        'shell_color',
        'store_receive_id',
        'store_receive_name',
        'store_return_id',
        'store_return_name',
        'is_agree_no_security',
        'is_cancel',
        'is_can_cancel',
        'reason_cancel',
        'total_money',
        'money_cash',
        'money_transfer',
        'bank_account_id',
        'temporary_money',
        'promotion_money',
        'coupon_id',
        'is_complete',
        'is_returned',
        'order_index_process',
        'date_start_warranty',
        'date_end_warranty',
        'deposit_money'
    ]);
};

const proStatus = (data = []) => {
    return transform.transform(data, ['pro_status_id', 'pro_status_name', 'pro_status_code']);
};

const accessory = (data = []) => {
    return transform.transform(data, [
        'accessory_id',
        'accessory_name',
        'accessory_code',
        'request_quantity',
        'stocks_out_id',
        'rq_war_repair_accessory_id',
        'is_returned',
        'note',
    ]);
};

const component = (data = []) => {
    return transform.transform(data, [
        'component_id',
        'component_name',
        'price',
        'total_inventory',
        'quantity',
        'list_id',
        'image_url',
        'unit_id',
        'unit_name',
        'change_price',
        'component_imei_code',
        'component_code',
        'period',
        'is_outputted',
        'is_internal',
        'stocks_id',
        'stocks_in_type_internal',
        'stocks_in_type_exchange',
        'total_import',
        'total_export',
        'rq_war_repair_component_id'
    ]);
};

const stocks = (data = []) => {
    return transform.transform(data, ['stocks_id', 'stocks_name', 'stocks_in_type_id', 'stocks_manager']);
};

const optionError = (data = []) => {
    return transform.transform(data, ['error_id', 'error_name', 'error_code', 'error_group_name']);
};

const optionProcessStep = (data = []) => {
    return transform.transform(data, ['process_step_id', 'process_step_name', 'request_type_step_id']);
};

const optionSolutionError = (data = []) => {
    return transform.transform(data, [
        'error_id',
        'reference_price',
        'solution_name',
        'solution_id',
        'highest_price',
        'lowest_price',
        'is_component_test',
        'is_component_replace',
        'stocks_out_type_test_id',
        'stocks_out_type_replace_id',
    ]);
};

const optionUser = data => {
    return transform.transform(data, ['user_name', 'full_name', 'level_name', 'process_time']);
};

const genStocksOutRequestCode = data => {
    return transform.transform(data, ['stocks_out_request_code']);
};

const genStocksInRequestCode = data => {
    return transform.transform(data, ['stocks_in_request_code']);
};

const unit = (data = []) => {
    return transform.transform(data, ['id', 'name']);
};

const listComponentInStock = (data = []) => {
    return transform.transform(data, [
        'component_id',
        'component_name',
        'quantity',
        'lot_number',
        'supplier_name',
        'unit_name',
        'price',
        'stocks_detail_id',
        'unit_id',
        'component_imei_code',
        'create_date',
    ]);
};

const history = (data = []) => {
    return transform.transform(data, [
        'request_id',
        'process_step_id',
        'process_step_name',
        'user_name',
        'full_name',
        'created_user',
        'created_date',
        'image_avatar',
    ]);
};

const error = (data = []) => {
    return transform.transform(data, [
        'rq_war_repair_error_id',
        'repair_status_id',
        'progress',
        'note',
        'description',
        'est_start_time',
        'est_end_time',
        'est_total_time',
        'actual_start_time',
        'actual_end_time',
        'actual_total_time',
        'full_name',
        'user_name',
        'request_code',
        'image_avatar',
        'solution_id',
        'solution_name',
        'request_type_id',
        'request_type_name',
        'request_id',
        'task_quaility',
        'piority_id',
        'error_id',
        'error_name',
        'error_code',
        'assignee_full_name',
        'user_assigned',
        'user_assigned_full_name',
        'error_group_name',
        'repair_price',
        'is_component_test',
        'is_component_replace',
        'stocks_out_type_test_id',
        'stocks_out_type_replace_id',
        'warranty_period_id',
        'period',
    ]);
};

const list_image = (data = []) => {
    return transform.transform(data, ['picture_url']);
};

const optionSupportType = (data = []) => {
    return transform.transform(data, ['support_type_id', 'support_type_name', 'support_type']);
};
const detailSupport = (data = []) => {
    return transform.transform(data, [
        'support_id',
        'support_type_id',
        'support_type_name',
        'support_type',
        'review_user',
        'full_name',
        'reason',
        'is_reviewed',
        'end_time',
    ]);
};

const requestPrint = (data) => {
    return transform.transform(data, [
        'created_user',
        'address_full',
        'tax_id',
        'phone_number',
        'email',
        'request_code',
        'full_name',
        'phone_number_account',
        'address_full_account',
        'product_name',
        'product_imei_code',
        'request_type_id',
        'request_type_name',
        'day_reception',
        'get_note',
        'repair_user_full_name',
        'accessory',
        'company_name',
        'pro_status',
        'shell_color',
        'province_name'
    ]);
}

const history_error = data => {
    return transform.transform(data, ['progress', 'note', 'history_time']);
};

const optionStocksOutType = data => {
    return transform.transform(data, ['stocks_out_type_id', 'stocks_out_type_name', 'is_internal', 'is_auto_review']);
};

const optionStocksInType = data => {
    return transform.transform(data, ['stocks_in_type_id', 'stocks_in_type_name', 'is_internal', 'is_auto_review']);
};

const list_return = data => {
    return transform.transform(data, [
        'request_id',
        'component_id',
        'company_name',
        'is_returned',
        'stocks_out_request_id',
        'component_imei_code',
        'lot_number',
        'cost_price',
        'total_price_cost',
        'total_cost_basic_imei',
        'unit_id',
        'unit_name',
        'total_price',
        'rq_war_repair_component_id',
    ]);
};

const optionUserRequest = data => {
    return transform.transform(data, [
        'user_id',
        'user_name',
        'full_name',
        'first_name',
        'last_name',
        'department_id',
        'store_id',
        'store_name',
    ]);
};
const customerListDeboune = order => {
    const transform = new Transform({
        member_id: '{{#? MEMBERID}}',
        user_name: '{{#? USERNAME}}',
        full_name: '{{#? FULLNAME}}',
        address_full: '{{#? ADDRESSFULL}}',
        phone_number: '{{#? PHONENUMBER}}',
        account_code: '{{#? CUSTOMERCODE}}',
        email: '{{#? EMAIL}}',
        customer_type_id: '{{#? CUSTOMERTYPEID}}',
    });
    return transform.transform(order, [
        'member_id',
        'user_name',
        'full_name',
        'address_full',
        'phone_number',
        'account_code',
        'email',
        'customer_type_id',
    ]);
};

const file = data => {
    return transform.transform(data, [
        'attachment_path',
        'attachment_name',
        'note',
        'created_user',
        'image_avatar',
        'created_date',
    ]);
};

const options = data => {
    return transform.transform(data, ['id', 'name', 'code', 'is_user', 'full_name']);
};

const list_image_error = (data = []) => {
    return transform.transform(data, ['picture_url', 'rq_war_repair_error_id']);
};

const coupons = (data = []) => {
    return transform.transform(data, [
        'coupon_id',
        'coupon_name',
        'coupon_code',
        'coupon_value',
        'id',
        'name',
        'value',
        'label',
        'list_error_id',
        'is_all_error',
        'is_any_error',
        'is_appoint_error',
    ]);
};
const receiveSlip = (data = []) => {
    return transform.transform(data, ['request_id', 'receive_slip_id']);
};
const stocksInRequest = (data = []) => {
    return transform.transform(data, ['request_id', 'stocks_in_request_id', 'is_imported', 'is_warranty', 'is_internal']);
};
const stocksOutRequest = (data = []) => {
    return transform.transform(data, ['request_id', 'stocks_out_request_id', 'is_outputted', 'is_warranty', 'is_internal']);
};

const detailDashboard = order => {
    return transform.transform(order, [
        'request_id',
        'coordinator',
        'coordinator_url',
        'coordinator_full_name',
        'checker_user',
        'checker_user_full_name',
        'checker_user_url'
    ]);
};
const dataNote = (data = []) => {
    return transform.transform(data, [
        'content',
        'user_name',
        'full_name',
        'created_user',
        'created_date',
        'image_avatar',
    ]);
};

const list_component_return = (data) => {
    return transform.transform(data, [
        'request_id',
        'rq_wa_repair_component_id',
        'component_id',
        'component_name',
        'is_component_replace',
        'is_component_test',
        'image_url',
        'is_internal',
        'is_sell',
        'component_imei_code',
        'stocks_out_request_id',
        'stocks_out_request_detail_id',
        'stocks_in_request_id',
        'is_return',
        'from_stocks_id',
        'price',
        'price_id',
        'output_type_id',
        'output_type_name',
        'stocks_id',
        'stocks_in_type_internal',
        'stocks_in_type_exchange',
        'unit_name',
        'period',
        'is_output_type_id'

    ]);
}

const list_output_type = (data = []) => {
    return transform.transform(data, [
        'output_type_id',
        'output_type_name',
        'price_id',
        'price',
        'change_price',
        'change_value',
        'component_id'
    ]);
};

module.exports = {
    list,
    detail,
    proStatus,
    accessory,
    optionError,
    optionUser,
    optionSolutionError,
    component,
    genStocksOutRequestCode,
    stocks,
    unit,
    listComponentInStock,
    history,
    error,
    list_image,
    optionSupportType,
    detailSupport,
    requestPrint,
    list,
    optionProcessStep,
    history_error,
    optionStocksOutType,
    genStocksInRequestCode,
    list_return,
    optionUserRequest,
    optionStocksInType,
    customerListDeboune,
    file,
    options,
    list_image_error,
    coupons,
    stocksInRequest,
    stocksOutRequest,
    receiveSlip,
    detailDashboard,
    dataNote,
    list_component_return,
    list_output_type
};
