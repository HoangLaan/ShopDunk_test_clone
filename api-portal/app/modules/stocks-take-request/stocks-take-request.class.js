const config = require('../../../config/config');
const Transform = require('../../common/helpers/transform.helper');

const template = {
    //#region fields common
    created_user: '{{#? CREATEDUSER}}',
    created_date: '{{#? CREATEDDATE}}',
    //#endregion

    //#region stocks_take_request
    stocks_take_request_id: '{{#? STOCKSTAKEREQUESTID}}',
    stocks_take_review_list_id: '{{#? STOCKSTAKEREVIEWLISTID}}',
    stocks_take_type_id: '{{#? STOCKSTAKETYPEID}}',
    stocks_take_request_code: '{{#? STOCKSTAKEREQUESTCODE}}',
    stocks_take_request_name: '{{#? STOCKSTAKEREQUESTNAME}}',

    company_id: '{{#? COMPANYID}}',
    stocks_id: '{{#? STOCKSID}}',
    stocks_name: '{{#? STOCKSNAME}}',
    address: '{{#? ADDRESS}}',
    department_request_id: '{{#? DEPARTMENTREQUESTID}}',
    stocks_take_request_date: '{{#? STOCKSTAKEREQUESTDATE}}',
    stocks_take_request_user: '{{#? STOCKSTAKEREQUESTUSER}}',
    stocks_take_request_username: '{{#? STOCKSTAKEREQUESTUSERNAME}}',
    note: '{{#? NOTE}}',
    conclude_content: '{{#? CONCLUDECONTENT}}',
    stocks_take_out_code: '{{#? STOCSKTAKEOUTCODE}}',
    stocks_take_in_code: '{{#? STOCSKTAKEINCODE}}',

    stocks_take_out_id: '{{#? STOCKSOUTREQUESTID}}',
    stocks_take_in_id: '{{#? STOCKSINREQUESTID}}',

    stocks_take_type_name: '{{#? STOCKSTAKETYPENAME}}',
    created_user: '{{#? CREATEDUSER}}',
    created_date: '{{#? CREATEDDATE}}',
    reviewed_date: '{{#? REVIEWEDDATE}}',
    receiver: '{{#? RECEIVER}}',
    user_name: '{{#? USERNAME}}',
    stocks_review_level_id: '{{#? STOCKSREVIEWLEVELID}}',
    //#endregion

    // #region
    is_active: '{{ISACTIVE ? 1 : 0}}',
    is_processed: '{{ISPROCESSED ? 1 : 0}}',
    is_take_inventory: '{{ISTAKEINVENTORY ? 1 : 0}}',
    is_reviewed: '{{ISREVIEWED ?? 0}}',
    // #endreigon

    is_all_product: '{{ISALLPRODUCT ? 1 : 0}}',
    stocks_take_name_list: '{{#? STOCKSTAKENAMELIST}}',
    is_auto_reviewed: '{{ISAUTOREVIEWED ? 1 : 0}}',
    is_complete_reviewed: '{{ISCOMPLETEDREVIEWED ? 1 : 0}}',
};

let transform = new Transform(template);

const listStocksTakeRequest = (data = []) => {
    return transform.transform(data, [
        'stocks_take_request_id',
        'stocks_take_request_code',
        'stocks_take_request_name',
        'stocks_take_request_date',
        'stocks_name',
        'stocks_take_type_name',
        'is_reviewed',
        'is_processed',
        'created_user',
        'created_date',
        'stocks_take_name_list',
    ]);
};

const detailStocksTakeRequest = (data = []) => {
    return transform.transform(data, [
        'stocks_take_request_id',
        'stocks_take_request_code',
        'stocks_take_request_name',
        'stocks_take_request_user',
        'stocks_take_request_username',
        'department_request_id',
        'stocks_id',
        'address',
        'stocks_take_type_id',
        'stocks_take_type_name',
        'receiver',
        'is_reviewed',
        'is_processed',
        'is_take_inventory',
        'stocks_take_request_date',
        'created_user',
        'note',
        'stocks_take_in_code',
        'stocks_take_out_code',
        'stocks_take_out_id',
        'stocks_take_in_id',
        'conclude_content',

        'is_all_product',
    ]);
};

const listUserReiew = (data = []) => {
    return transform.transform(data, [
        'user_name',
        'stocks_review_level_id',
        'stocks_take_review_list_id',
        'is_reviewed',
        'note',
        'reviewed_date',
        'is_auto_reviewed',
        'is_complete_reviewed',
    ]);
};

const listStocksTakeUser = (data = []) => {
    const template = {
        department_id: '{{#? DEPARTMENTID}}',
        user_name: '{{#? USERNAME}}',
        full_name: '{{#? FULLNAME}}',
        position_name: '{{#? POSITIONNAME}}',
        is_main_responsibility: '{{ISMAINRESPONSIBILITY ? 1 : 0}}',
        stocks_take_user_id: '{{#? STOCKSTAKEUSERID}}',
    };
    let transformStocksTakeUser = new Transform(template);
    return transformStocksTakeUser.transform(data, Object.keys(template));
};

const optionsUsers = (users = []) => {
    const template = {
        value: '{{#? ID}}',
        label: '{{#? NAME}}',
        position_name: '{{#? POSITIONNAME}}',
    };
    let transform = new Transform(template);
    return transform.transform(users, Object.keys(template));
};

const listProduct = (products = []) => {
    const object = {
        stock_take_product_list_id: '{{#? STOCKTAKEPRODUCTLISTID}}',
        product_id: '{{#? PRODUCTID}}',
        product_code: '{{#? PRODUCTCODE}}',
        product_name: '{{#? PRODUCTNAME}}',
        model_name: '{{#? MODELNAME}}',
        category_name: '{{#? CATEGORYNAME}}',
        unit_id: '{{#? UNITID}}',
        unit_name: '{{#? UNITNAME}}',
        total_inventory: '{{TOTALINVENTORY ? TOTALINVENTORY : 0}}',
        actual_inventory: '{{#? ACTUALINVENTORY}}',
        take_inventory_date: '{{#? TAKEINVENTORYDATE}}',
        product_imei_code: '{{#? PRODUCTIMEICODE}}',
        stock_take_product_list_imei_code_id: '{{#? STOCKTAKEPRODUCTLISTIMEICODEID}}',
        available_in_stock: '{{AVAILABLEINSTOCK ? 1 : 0}}', // có trong kho
        stocks_id: '{{#? STOCKSID}}',
        stocks_name: '{{#? STOCKSNAME}}',
    };
    const transform = new Transform(object);
    return transform.transform(products, Object.keys(object));
};

const listProductImeiCode = (data = []) => {
    const template = {
        stock_take_product_list_id: '{{#? STOCKTAKEPRODUCTLISTID}}',
        product_imei_code: '{{#? PRODUCTIMEICODE}}',
        execution_time: '{{#? EXECUTIONTIME}}',
        note: '{{#? NOTE}}',
        url_image: [
            {
                '{{#if URLIMAGE}}': `${config.domain_cdn}{{URLIMAGE}}`,
            },
            {
                '{{#else}}': null,
            },
        ],
        result: '{{#? RESULT}}', // result theo image
        stock_take_product_list_imei_code_id: '{{#? STOCKTAKEPRODUCTLISTIMEICODEID}}',
        available_in_stock: '{{AVAILABLEINSTOCK ? 1 : 0}}', // có trong kho
        stocks_name: '{{#? STOCKSNAME}}',
    };
    let transformStocksTakeUser = new Transform(template);
    return transformStocksTakeUser.transform(data, Object.keys(template));
};

const listImeiStocksDetail = (data = []) => {
    const template = {
        stocks_detail_id: '{{#? STOCKSDETAILID}}',
        stocks_id: '{{#? STOCKSID}}',
        product_id: '{{#? PRODUCTID}}',
        product_imei_code: '{{#? PRODUCTIMEICODE}}',
        note: '{{#? NOTE}}',
    };
    let transformStocksTakeUser = new Transform(template);
    return transformStocksTakeUser.transform(data, Object.keys(template));
};

const listReviewList = (data = []) => {
    const template = {
        stocks_take_id: '{{#? STOCKSTAKEID}}',
        stocks_review_level_id: '{{#? STOCKSREVIEWLEVELID}}',
        user_name: '{{#? USERNAME}}',
        full_name_review: '{{#? FULLNAMEREVIEW}}',
        is_reviewed: '{{ISREVIEWED ? ISREVIEWED : 2}}',
        default_picture_url: [
            {
                '{{#if DEFAULTPICTUREURL}}': `${config.domain_cdn}{{DEFAULTPICTUREURL}}`,
            },
            {
                '{{#else}}': null,
            },
        ],
    };
    let transformStocksTakeUser = new Transform(template);
    return transformStocksTakeUser.transform(data, Object.keys(template));
};

module.exports = {
    listStocksTakeRequest,
    optionsUsers,
    detailStocksTakeRequest,
    listUserReiew,
    listStocksTakeUser,
    listProduct,
    listProductImeiCode,
    listImeiStocksDetail,
    listReviewList,
};
