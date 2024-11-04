const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
    price_id: '{{#? PRICEID}}',
    output_type_id: '{{#? OUTPUTTYPEID}}',
    output_type_name: '{{#? OUTPUTTYPENAME}}',
    company_id: '{{#? COMPANYID}}',
    company_name: '{{#? COMPANYNAME}}',
    business_id: '{{#? BUSINESSID}}',
    business_name: '{{#? BUSINESSNAME}}',
    area_id: '{{#? AREAID}}',
    area_name: '{{#? AREANAME}}',
    product_id: '{{#? PRODUCTID}}',
    product_code: '{{#? PRODUCTCODE}}',
    product_name: '{{#? PRODUCTNAME}}',
    picture_url: `${config.domain_cdn}{{PICTUREURL}}`,
    price: '{{#? PRICE}}',
    price_vat: '{{#? PRICEVAT}}',
    start_date: '{{#? STARTDATE}}',
    end_date: '{{#? ENDDATE}}',
    review_date: '{{#? REVIEWDATE}}',
    review_note: '{{#? REVIEWNOTE}}',
    apply_time: '{{#? APPLYTIME}}',
    notes: '{{#? NOTES}}',
    is_active: '{{#? ISACTIVE}}',
    isReviewData: '{{ISREVIEW ? 1 : 0}}',
    created_user: '{{#? CREATEDUSER}}',
    created_date: '{{#? CREATEDDATE}}',
    updated_user: '{{#? UPDATEDUSER}}',
    updated_date: '{{#? UPDATEDDATE}}',
    is_deleted: '{{ISDELETED ? 1 : 0}}',
    is_output_for_web: '{{ISOUTPUTFORWEB ? 1 : 0}}',
    deleted_user: '{{#? DELETEDUSER}}',
    deleted_date: '{{#? DELETEDDATE}}',
    price_review_level_id: '{{#? PRICEREVIEWLEVELID}}',
    review_level_name: '{{#? REVIEWLEVELNAME}}',
    department_id: '{{#? DEPARTMENTID}}',
    department_name: '{{#? DEPARTMENTNAME}}',
    price_review_level_user_id: '{{#? PRICEREVIEWLEVELUSERID}}',
    user_name: '{{#? USERNAME}}',
    review_user: '{{#? REVIEWUSER}}',
    price_apply_review_level_id: '{{#? PRICEAPPLYREVIEWLEVELID}}',
    model_id: '{{#? MODELID}}',
    model_name: '{{#? MODELNAME}}',
    lot_number: '{{#? LOTNUMBER}}',
    unit_id: '{{#? UNITID}}',
    user_id: '{{#? USERID}}',
    unit_name: '{{#? UNITNAME}}',
    is_auto_reviewed: '{{#? ISAUTOREVIEW}}',
    is_can_review: '{{ISCANREVIEW ? ISCANREVIEW : 0}}',
    is_review: '{{ISREVIEW ? ISREVIEW : 0}}',
    review_user_fullname: '{{#? REVIEWUSERFULLNAME}}',
    category_name: '{{#? CATEGORYNAME}}',
    manufacturer_name: '{{#? MANUFACTURERNAME}}',
    change_price: '{{#? CHANGEPRICE}}',
    change_value: '{{#? CHANGEVALUE}}',
    changes_date: '{{#? CHANGESDATE}}',
    apply_date: '{{#? APPLYDATE}}',
    full_name: '{{#? FULLNAME}}',
    history_price: '{{#? HISTORYPRICE}}',
    price: '{{#? PRICE}}',
    cost_basic_imei_code: '{{#? COSTBASICIMEICODE}}',
    price_basic: '{{#? PRICEBASIC}}',
    product_type_id: '{{#? PRODUCTTYPEID}}',
    product_type_name: '{{#? PRODUCTTYPENAME}}',
    base_price: '{{BASEPRICE ? BASEPRICE : 0}}',
    vat_value: '{{#? VATVALUE}}',
    combo_id: '{{#? COMBOID}}',
    product_type: '{{#? PRODUCTTYPE}}',
    store_name: '{{#? STORENAME}}',
    product_imei: '{{#? PRODUCTIMEICODE}}',
    product_attribute_id: '{{#? PRODUCTATTRIBUTEID}}',
    model_code: '{{#? MODELCODE}}',
    attribute_name: '{{#? ATTRIBUTENAME}}',
    product_attribute: '{{#? PRODUCTATTRIBUTE}}',
    parent_price_id: '{{#? PARENTID}}',
    price_defend: '{{#? PRICEDEFEND}}',
    stocks_name: '{{#? STOCKSNAME}}',
    activation_date: '{{#? ACTIVATIONDATE}}',
    product_type_deff: '{{#? TYPEPRODUCTDEFF}}',
};

let transform = new Transform(template);

const detailPrices = (slPrice) => {
    return transform.transform(slPrice, [
        'price_id',
        'output_type_id',
        'output_type_name',
        'start_date',
        'end_date',
        'area_name',
        'company_name',
        'business_name',
        'price',
        'price_vat',
        'review_date',
        'notes',
        'isReviewData',
        'is_review',
        'is_can_review',
        'is_active',
        'is_output_for_web',
        'lot_number',
        'unit_id',
        'unit_name',
        'base_price',
        'vat_value',
        `change_price`,
        `change_value`,
        `product_imei`,
        'stocks_name',
        'activation_date',
    ]);
};
const detailProduct = (slPrice, isRequest = false) => {
    if (!isRequest)
        return transform.transform(slPrice, [
            'product_id',
            'product_code',
            'is_review',
            'product_name',
            'notes',
            'isReviewData',
            'is_active',
            'is_auto_reviewed',
            'lot_number',
            'product_type',
            'unit_id',
            'unit_name',
            'is_can_review',
            'business_name',
            'output_type_name',
            'area_name',
            'start_date',
            'end_date',
            'price_vat',
            'price_id',
            'product_imei',
            'stocks_name',
            'activation_date',
            'product_type_deff',
        ]);
    return transform.transform(slPrice, [
        'product_id',
        'product_code',
        'model_id',
        'product_name',
        'company_id',
        'company_name',
        'manufacturer_name',
        'model_name',
        'product_type',
        'unit_id',
        'unit_name',
        'product_imei',
        'stocks_name',
        'activation_date',
        'product_type_deff',
    ]);
};

const listOutPutType = (outputType = []) => {
    return transform.transform(outputType, [
        'output_type_id',
        'output_type_name',
        'area_id',
        'area_name',
        'business_id',
        'business_name',
        'company_id',
        'company_name',
        'review_level_name',
        'department_name',
        'user_name',
    ]);
};

const valueOutPutType = (outputType = []) => {
    return transform.transform(outputType, [
        'price_review_level_id',
        'review_level_name',
        'department_id',
        'department_name',
        'price_review_level_user_id',
        'user_id',
        'user_name',
        'is_auto_reviewed',
    ]);
};

const valueAreaOutPutType = (outputType = []) => {
    return transform.transform(outputType, ['area_id', 'area_name', 'business_id', 'business_name']);
};

const valueUnitOutPutType = (outputType = []) => {
    return transform.transform(outputType, ['unit_id', 'unit_name']);
};

const listArea = (area = []) => {
    let transform = new Transform({
        value: '{{#? AREAID}}',
        label: '{{#? AREANAME}}',
        area_id: '{{#? AREAID}}',
        area_name: '{{#? AREANAME}}',
    });

    return transform.transform(area, ['area_id', 'area_name', 'value', 'label']);
};
const listBusiness = (area = []) => {
    let transform = new Transform({
        value: '{{#? BUSINESSID}}',
        label: '{{#? BUSINESSNAME}}',
        business_id: '{{#? BUSINESSID}}',
        business_name: '{{#? BUSINESSNAME}}',
    });

    return transform.transform(area, ['business_id', 'business_name', 'value', 'label']);
};

const listStore = (area = []) => {
    let transform = new Transform({
        value: '{{#? STOREID}}',
        label: '{{#? STORENAME}}',
        store_id: '{{#? STOREID}}',
        store_name: '{{#? STORENAME}}',
    });

    return transform.transform(area, ['store_id', 'store_name', 'value', 'label']);
};

const listReviewlevel = (reviewLevel = []) => {
    return transform.transform(reviewLevel, [
        'price_review_level_id',
        'price_apply_review_level_id',
        'review_level_name',
        'review_user',
        'review_user_fullname',
        'review_note',
        'is_auto_reviewed',
        'isReviewData',
        'department_id',
        'department_name',
        'is_can_review',
        'is_review',
    ]);
};

const list = (data = []) => {
    return transform.transform(data, [
        'price_id',
        'product_code',
        'product_id',
        'product_name',
        'output_type_name',
        'area_id',
        'area_name',
        'company_name',
        'business_name',
        'store_name',
        'price',
        'price_vat',
        'apply_time',
        'isReviewData',
        'is_output_for_web',
        'is_active',
        'model_id',
        'model_name',
        'lot_number',
        'is_review',
        'unit_name',
        'category_name',
        'manufacturer_name',
        'change_price',
        'change_value',
        'unit_id',
        'output_type_id',
        'price_basic',
        'product_type_id',
        'product_type_name',
        'base_price',
        'vat_value',
        'product_type',
        'is_can_review',
        'product_imei',
        'parent_price_id',
        'price_defend',
        'product_type_deff',
    ]);
};
// options
const templateOptions = {
    id: '{{#? ID}}',
    name: '{{#? NAME}}',
};

const options = (data = []) => {
    let transform = new Transform(templateOptions);
    return transform.transform(data, ['id', 'name']);
};

const templateOptionsCategory = {
    id_category: '{{#? PRODUCTCATEGORYID}}',
}

const optionsProductCategory = (data = []) => {
    let transform = new Transform(templateOptionsCategory);
    return transform.transform(data, ['id_category']);
};

const listPriceProductHistory = (slPrice) => {
    return transform.transform(slPrice, [
        'history_id',
        'changes_date',
        'output_type_id',
        'output_type_name',
        'area_name',
        'business_name',
        'apply_date',
        'full_name',
        'history_price',
        'price_vat',
        'cost_basic_imei_code',
        'review_user_fullname',
        'price_id',
    ]);
};

const product = (slPrice) => {
    const templateSlPrice = {
        product_id: '{{#? PRODUCTID}}',
        product_name: '{{#? PRODUCTNAME}}',
        product_imei: '{{#? PRODUCTIMEICODE}}',
        product_code: '{{#? PRODUCTCODE}}',
        category_name: '{{#? CATEGORYNAME}}',
        manufacture_name: '{{#? MANUFACTURERNAME}}',
        model_id: '{{#? MODELID}}',
        model_name: '{{#? MODELNAME}}',
        unit_id: '{{#? UNITID}}',
        unit_name: '{{#? UNITNAME}}',
        product_type: '{{#? PRODUCTTYPE}}',
        picture_url: [
            {
                '{{#if PICTUREURL}}': `${config.domain_cdn}{{PICTUREURL}}`,
            },
            {
                '{{#else}}': null,
            },
        ],
        stocks_name: '{{#? STOCKSNAME}}',
        activation_date: '{{#? ACTIVATIONDATE}}',
        product_type_deff: '{{#? TYPEPRODUCTDEFF}}',
    };

    const transformProduct = new Transform(templateSlPrice);
    const keyProduct = Object.getOwnPropertyNames(templateSlPrice) ?? [];
    return transformProduct.transform(slPrice, keyProduct);
};

const detailModelAttribute = (slPrice, isRequest = false) => {
  return transform.transform(slPrice, [
      'model_id',
      'product_id',
      'model_code',
      'model_name',
      'product_attribute_id',
      'attribute_name',
      'price_vat',
      'price',
      'product_attribute',
  ]);
};

module.exports = {
    detailPrices,
    detailProduct,
    list,
    listArea,
    listBusiness,
    listOutPutType,
    listReviewlevel,
    options,
    valueOutPutType,
    valueAreaOutPutType,
    valueUnitOutPutType,
    listPriceProductHistory,
    product,
    listStore,
    detailModelAttribute,
    optionsProductCategory,
};
