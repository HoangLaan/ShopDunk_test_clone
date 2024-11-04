const Transform = require('../../common/helpers/transform.helper');

const template = {
    stocks_transfer_type_id: '{{#? STOCKSTRANSFERTYPEID}}',
    stocks_transfer_type_name: '{{#? STOCKSTRANSFERTYPENAME}}',
    is_other_business: '{{#? ISOTHERBUSINESS}}',
    business_id: '{{#? BUSINESSID * 1}}',
    store_request_id: '{{#? STOREREQUESTID }}',
    department_id: '{{#? DEPARTMENTID}}',
    request_user: '{{#? REQUESTUSER}}',
    estimate_delivery_day_count: '{{#? ESTIMATEDELIVERYDAYCOUNT}}',
    estimate_delivery_time: '{{#? ESTIMATEDELIVERYTIME}}',
    actual_delivery_time: '{{#? ACTUALDELIVERYTIME}}',
    request_user_name: '{{#? REQUESTUSERFULLNAME}}',
    export_business_id: '{{#? EXPORTBUSINESSID}}',
    store_export_id: '{{#? STOREEXPORTID}}',
    contract_number: '{{#? CONTRACTNUMBER}}',
    transport_partner: '{{#? TRANSPORTPARTNER}}',
    transport_vehicle: '{{#? TRANSPORTVEHICLE}}',
    transport_user: '{{#? TRANSPORTUSER}}',
    store_export_name: '{{#? STOREEXPORTNAME}}',
    stocks_export_id: '{{#? STOCKSEXPORTID}}',
    stocks_export_name: '{{#? STOCKSEXPORTNAME}}',
    stocks_export_address: '{{#? ADDRESSEXPORT}}',
    import_business_id: '{{#? IMPORTBUSINESSID}}',
    export_user_id: '{{#? EXPORTUSER}}',
    export_user_name: '{{#? EXPORTUSERNAME}}',
    store_import_id: '{{#? STOREIMPORTID}}',
    store_import_name: '{{#? STOREIMPORTNAME}}',
    stocks_import_id: '{{#? STOCKSIMPORTID}}',
    stocks_import_name: '{{#? STOCKSIMPORTNAME}}',
    stocks_import_address: '{{#? ADDRESSIMPORT}}',
    import_user_id: '{{#? IMPORTUSER}}',
    hidden_price: '{{HIDDENPRICE ? 1 : 0}}',
    import_user_name: '{{#? IMPORTUSERNAME}}',
    created_user: '{{#? CREATEDUSER}}',
    created_date: '{{#? CREATEDDATE}}',
    is_active: '{{#? ISACTIVE}}',
    is_stocks_in_review: '{{#? ISSTOCKSTRANSFERREVIEW}}',
    stocks_review_level_name: '{{#? STOCKSREVIEWLEVELNAME}}',
    description: '{{#? DESCRIPTION}}',
    is_auto_review: '{{ISAUTOREVIEW  ? 1 : 0}}',
    fullname: '{{#? FULLNAME}}',
    user_name: '{{#? USERNAME}}',
    users: '{{#? USERS}}',
    department_name: '{{#? DEPARTMENTNAME}}',
    is_completed_reviewed: '{{ISCOMPLETEDREVIEWED  ? 1 : 0}}',
    stocks_review_level_id: '{{#? STOCKSREVIEWLEVELID}}',

    //
    stocks_transfer_code: '{{#? STOCKSTRANSFERCODE}}',
    stocks_transfer_id: '{{#? STOCKSTRANSFERID}}',
    status_transfer: '{{#? STATUSTRANSFERID}}',
    reviewed_status: '{{REVIEWEDSTATUS ? REVIEWEDSTATUS : 0}}',
    is_reviewed: '{{ISREVIEWED}}',
    status_reviewed: '{{#? STATUSREVIEWED}}',
    trans_status: '{{#? TRANSSTATUS}}',
    transfer_review: '{{#? TRANSFERREVIEW}}',
    unit_id: '{{#? UNITID}}',
    quantity: '{{#? QUANTITY}}',
    lot_number: '{{#? LOTNUMBER}}',
    product_id: '{{#? PRODUCTID}}',
    product_name: '{{#? PRODUCTNAME}}',
    product_imei_code: '{{#? PRODUCTIMEICODE}}',
    review_user_fullname: '{{#? REVIEWUSERFULLNAME}}',
    review_user: '{{#? REVIEWUSER}}',
    review_note: '{{#? REVIEWNOTE}}',
    created_user: '{{#? CREATEDUSER}}',
    stocks_trans_review_list_id: '{{#? STOCKSTRANSREVIEWLISTID}}',
    print_date: '{{#? PRINTDATE}}',
    unit_name: '{{#? UNITNAME}}',

    note: '{{#? NOTE}}',
    stocks_detail_id: '{{#? STOCKSDETAILID}}',
    price: '{{PRICE  ? PRICE : 0}}',
    total_price: '{{TOTALPRICE  ? TOTALPRICE : 0}}',
    product_code: '{{#? PRODUCTCODE}}',
    transfer_type: '{{#? TRANSFERTYPE}}',

    row_index: '{{#? ROWINDEX}}',
    is_can_review: '{{ISCANREVIEW  ? 1 : 0}}',
    review_date: '{{#? REVIEWDATE}}',
    is_auto_review_stock_transfer: '{{ISREVIEWSTOCKTRANSER  ? 1 : 0}}',
    is_can_transfer: '{{#? ISCANTRANSFER}}',
    business_import_id: '{{#? BUSINESSIMPORTID}}',
    business_export_id: '{{#? BUSINESSEXPORTID}}',
    business_import_name: '{{#? BUSINESSIMPORTNAME}}',
    business_import_email: '{{#? BUSINESSIMPORTEMAIL}}',
    business_import_taxcode: '{{#? BUSINESSIMPORTTAXCODE}}',
    business_import_address: '{{#? BUSINESSIMPORTADDRESS}}',
    stocks_id: '{{#? STOCKSID}}',
};

let transform = new Transform(template);

const list = (areas = []) => {
    return transform.transform(areas, [
        'stocks_transfer_id',
        'stocks_transfer_code',
        'stocks_export_name',
        'stocks_import_name',
        'status_transfer',
        'estimate_delivery_time',
        'actual_delivery_time',
        'reviewed_status',
        'status_reviewed',
        'stocks_transfer_type_id',
        'stocks_transfer_type_name',
        'created_user',
        'created_date',
        'is_deleted',
        'is_active',
        'trans_status',
        'is_reviewed',
        'is_can_review',
        'stocks_trans_review_list_id',
        'stocks_review_level_id',
        'is_completed_reviewed',
        'transfer_review',
    ]);
};

const detail = (user) => {
    return transform.transform(user, [
        'stocks_transfer_id',
        'stocks_transfer_code',
        'estimate_delivery_day_count',
        'estimate_delivery_time',
        'actual_delivery_time',
        'hidden_price',
        'business_import_id',
        'contract_number',
        'transport_partner',
        'transport_vehicle',
        'transport_user',
        'business_export_id',
        'transfer_type',
        'stocks_transfer_type_id',
        'is_orther_business',
        'business_id',
        'store_request_id',
        'department_id',
        'request_user',
        'request_user_name',
        'store_export_id',
        'store_export_name',
        'stocks_export_id',
        'stocks_export_name',
        'stocks_export_address',
        'export_user_id',
        'export_user_name',
        'store_import_id',
        'store_import_name',
        'stocks_import_id',
        'stocks_import_name',
        'stocks_import_address',
        'import_user_id',
        'import_user_name',
        'description',
        'created_date',
        'created_user',
        'status_transfer',
        'reviewed_status',
        'export_business_id',
        'import_business_id',
        'is_can_transfer',
        'business_import_name',
        'business_import_email',
        'business_import_taxcode',
        'business_import_address',
        'stocks_id',
        'is_reviewed',
    ]);
};

const options = (data) => {
    const transform = new Transform({
        id: '{{#? ID}}',
        name: '{{#? NAME}}',
        value: '{{#? ID}}',
        label: '{{#? NAME}}',
    });
    return transform.transform(data, ['id', 'name', 'value', 'label']);
};
const stocksTransferCode = (data) => {
    return transform.transform(data, ['stocks_transfer_code']);
};

const listProduct = (data) => {
    const transform_product = {
        stocks_detail_id: '{{#? STOCKSDETAILID}}',
        product_id: '{{#? PRODUCTID}}',
        material_id: '{{#? MATERIALID}}',
        product_imei: '{{#? PRODUCTIMEICODE}}',
        material_imei: '{{#? MATERIALIMEICODE}}',
        product_name: '{{#? PRODUCTNAME}}',
        product_code: '{{#? PRODUCTCODE}}',
        imei: '{{#? IMEI}}',
        total_price: '{{#? TOTALPRICE}}',
        price: '{{#? PRICE}}',
        lot_number: '{{#? LOTNUMBER}}',
        unit_id: '{{#? UNITID}}',
        unit_name: '{{#? UNITNAME}}',
        quantity: '{{#? QUANTITY}}',
        create_date: '{{#? CREATEDDATE}}',
        model_id: '{{#? MODELID}}',
    };
    return new Transform(transform_product).transform(data, Object.keys(transform_product));
};

const listReviewLevel = (areas = []) => {
    return transform.transform(areas, [
        'stocks_review_level_id',
        'stocks_review_level_name',
        'is_auto_review',
        'is_completed_reviewed',
        'department_id',
        'department_name',
        'user_name',
        'fullname',
        'users',
        'is_reviewed',
        'userna',
        'valuena',
    ]);
};

const listRLDetail = (areas = []) => {
    return transform.transform(areas, [
        'stocks_trans_review_list_id',
        'stocks_review_level_id',
        'stocks_review_level_name',
        'is_auto_review',
        'is_completed_reviewed',
        'department_id',
        'department_name',
        'review_user',
        'review_user_fullname',
        'review_note',
        'review_date',
        'users',
        'is_reviewed',
    ]);
};

const generalStocks = (data) => {
    const transform = new Transform({
        id: '{{#? STOCKSID}}',
        code: '{{#? STOCKSCODE}}',
        name: '{{#? STOCKSNAME}}',
        managers: '{{#? STOCKSMANAGERS}}',
    });

    return transform.transform(data, ['id', 'name', 'code', 'managers']);
};

const infoStock = (data) => {
    const transform = new Transform({
        business_id: '{{#? BUSINESSID}}',
        business_name: '{{#? BUSINESSNAME}}',
        department_id: '{{#? DEPARTMENTID}}',
        store_id: '{{#? STOREID}}',
        store_name: '{{#? STORENAME}}',
        user_name: '{{#? USERNAME}}',
    });

    return transform.transform(data, [
        'business_id',
        'business_name',
        'department_id',
        'store_id',
        'store_name',
        'user_name'
    ]);
};

module.exports = {
    list,
    options,
    stocksTransferCode,
    listProduct,
    listReviewLevel,
    detail,
    listRLDetail,
    generalStocks,
    infoStock
};
