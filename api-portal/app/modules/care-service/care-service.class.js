const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');

const template = {
    care_service_id: '{{#? CARESERVICEID}}',
    care_service_image_id: '{{#? CARESERVICEIMAGEID}}',
    care_service_name: '{{#? CARESERVICENAME}}',
    care_service_code: '{{#? CARESERVICECODE}}',
    group_service_code: '{{#? GROUPSERVICECODE}}',
    created_user: '{{#? CREATEDUSER}}',
    created_date: '{{#? CREATEDDATE}}',
    type_time_repair_from: '{{#? TIMEREPAIREFROM}}',
    type_time_repair_to: '{{#? TIMEREPAIRETO}}',
    cost_service: '{{#? COSTSERVICE}}',
    cost_promotion: '{{#? COSTPROMOTION}}',
    cost_engineer: '{{#? COSTENGINEER}}',
    total_cost_product: '{{#? TOTALCOSTPRODUCT}}',
    category_name: '{{#? CATEGORYNAME}}',
    group_service_name: '{{#? PARENTGROUPSERVICENAME}}',
    parent_group_service_name: '{{PARENTGROUPSERVICENAME}}',
    description: '{{#? DESCRIPTION}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    picture_url: [
        {
            '{{#if PICTUREURL}}': `${config.domain_cdn}{{PICTUREURL}}`,
        },
        {
            '{{#else}}': null,
        },
    ],
    
    care_service_image_id: '{{CARESERVICEIMAGEID}}',
    warranty_perio_id: '{{WARRANTYPERIODID}}',
    seo_name: '{{SEONAME}}',
    is_show_web: '{{ISSHOWWEB ? 1 : 0}}',
    model_name: '{{#? MODELNAME}}',
    type_time_repair: '{{#? TYPETIMEREPAIR}}',
    care_service_name_en: '{{#? CARESERVICENAMEEN}}',
    description_en: '{{#? DESCRIPTIONSEN}}',
    content_en: '{{CONTENTEN}}',

    seo_name_en: '{{#? SEONAMEEN}}',
    meta_title_en: '{{METATITLEEN}}',
    meta_discription_en: '{{#? METADESCRIPTIONEN}}',
    meta_keywords_en: '{{METAKEYWORDSEN}}',

    care_service_repair_id: '{{CARESERVICEREPAIRID}}',
    product_name: '{{#? PRODUCTNAME}}',
    product_id: '{{PRODUCTID}}',
    quantity: '{{#? QUANTITY}}',
    orderindex: '{{#? ORDERINDEX}}',
    
};

const list = (careServices = []) => {
    let transform = new Transform(template);

    return transform.transform(careServices, [
        'care_service_id',
        'care_service_name',
        'care_service_code',
        'created_user',
        'created_date',
        'type_time_repair_from',
        'type_time_repair_to',
        'cost_service',
        'cost_promotion',
        'issues_device',
        'cost_engineer',
        'total_cost_product',
        'category_name',
        'group_service_name',
        'is_active',
        'picture_url',
        'care_service_image_id',
        'is_show_web',
        'model_name',
        'type_time_repair',
        'description'
    ]);
};

const options = (data = []) => {
    let transform = new Transform({
        id: '{{#? ID}}',
        name: '{{#? NAME}}',
        value: '{{#? ID}}',
        label: '{{#? NAME}}',
        code: '{{#? CODE}}',
    });
    return transform.transform(data, ['id', 'name', 'value', 'label', 'code']);
};

const optionsStock = (data = []) => {
    let transform = new Transform({
        id: '{{#? ID}}',
        name: '{{#? NAME}}',
        value: '{{#? ID}}',
        label: '{{#? NAME}}',
        code: '{{#? STOCKSCODE}}',
        type_id: '{{#? STOCKTYPEID}}',
    });
    return transform.transform(data, ['id', 'name', 'value', 'label', 'code', 'type_id']);
};

const optionsProduct = (data = []) => {
    let transform = new Transform({
        id: '{{#? ID}}',
        name: '{{#? NAME}}',
    });
    return transform.transform(data, ['id', 'name']);
}

const detail = (data = []) => {
    const transform = new Transform({
        ...template,
        ...{
            care_service_name: '{{#? CARESERVICENAME}}',
            care_service_id: '{{#? CARESERVICEID}}',
            care_service_category_id: {
                value: '{{#? CATEGORYID}}',
                label: '{{#? CATEGORYNAME}}',
            },
            // group_service_id: {
            //     value: '{{#? GROUPSERVICEID}}',
            //     label: '{{#? GROUPSERVICENAME}}',
            // },
            group_service_name: '{{#? GROUPSERVICENAME}}',
            group_service_code: '{{#? GROUPSERVICECODE}}',
            // language_id: {
            //     value: '{{#? LANGUAGEID}}',
            //     label: '{{#? LANGUAGENAME}}',
            // },

            language_id: '{{#? LANGUAGEID}}',

            warranty_period_id: [
                {
                    '{{#if WARRANTYPERIODID}}': {
                        value: '{{#? WARRANTYPERIODID}}',
                        label: '{{#? WARRANTYPERIODNAME}}',
                    },
                },
                {
                    '{{#else}}': null,
                },
            ],
            description: '{{#? DESCRIPTION}}',
            is_stop_selling: '{{ISSTOPSELLING ? 1 : 0}}',
            stop_selling_from: '{{#? STOPSELLINGFROM}}',
            type_time_repair: '{{TYPETIMEREPAIR}}',
            type_time_repair_from: '{{TIMEREPAIREFROM}}',
            type_time_repair_to: '{{TIMEREPAIRETO}}',
            cost_service: '{{COSTSERVICE}}',
            cost_promotion: '{{COSTPROMOTION}}',
            cost_engineer: '{{COSTENGINEER}}',
            total_cost_product: '{{TOTALCOSTPRODUCT}}',
            promotion_name: '{{PROMOTIONNAME}}',
            issues_device: '{{#? ISSUESDEVICE}}',
            content: '{{CONTENT}}',
            is_hot: '{{ISHOT ? 1 : 0}}',
            order_index: '{{ORDERINDEX}}',
            orderindex: '{{#? ORDERINDEX}}',
            is_active: '{{ISACTIVE}}',
            seo_name: '{{SEONAME}}',
            care_service_code: '{{CARESERVICECODE}}',
            meta_title: '{{METATITLE}}',
            meta_discription: '{{METADESCRIPTION}}',
            meta_keywords: '{{METAKEYWORDS}}',
            care_service_name_en: '{{#? CARESERVICENAMEEN}}',
            description_en: '{{#? DESCRIPTIONEN}}',
            content_en: '{{CONTENTEN}}',
            seo_name_en: '{{#? SEONAMEEN}}',
            meta_title_en: '{{METATITLEEN}}',
            meta_discription_en: '{{#? METADESCRIPTIONEN}}',
            meta_keywords_en: '{{METAKEYWORDSEN}}',
            
        },
    });

    return transform.transform(data, [
        'care_service_name',
        'care_service_id',
        'group_service_code',
        'group_service_name',
        'group_service_id',
        'language_name',
        'language_id',
        'warranty_perio_id',
        'description',
        'is_stop_selling',
        'stop_selling_from',
        'type_time_repair',
        'type_time_repair_from',
        'type_time_repair_to',
        'cost_service',
        'cost_promotion',
        'cost_engineer',
        'total_cost_product',
        'promotion_name',
        'issues_device',
        'content',
        'is_hot',
        'order_index',
        'orderindex',
        'is_active',
        'seo_name',
        'care_service_code',
        'meta_title',
        'meta_discription',
        'meta_keywords',
        'care_service_name_en',
        'description_en',
        'content_en',
        'seo_name_en',
        'meta_title_en',
        'meta_discription_en',
        'meta_keywords_en',
        'careservice_repair_id',
    ]);
};


const proAttribute = (data = []) => {
    const transform = new Transform({
        attribute_id: '{{#? PRODUCTATTRIBUTEID}}',
        attribute_name: '{{#? ATTRIBUTENAME}}',
        unit_name: '{{#? UNITNAME}}',
        value: {
            value: '{{#? ATTRIBUTEVALUESID*1}}',
            label: '{{#? ATTRIBUTEVALUES}}',
        },
    });

    return transform.transform(data, ['attribute_id', 'attribute_name', 'unit_name', 'value']);
};

const subUnitList = (data = []) => {
    const transform = new Transform({
        product_sub_unit_id: '{{#? PRODUCTSUBUNITID}}',
        sub_unit_id: '{{#? SUBUNITID}}',
        main_unit_id: '{{#? MAINUNITID}}',
        density_value: '{{#? DENSITYVALUE}}',
        note: '{{#? NOTE}}',
    });

    return transform.transform(data, ['product_sub_unit_id', 'sub_unit_id', 'main_unit_id', 'density_value', 'note']);
};

const proStockInventory = (data = []) => {
    const transform = new Transform({
        pro_inventory_id: '{{#? PROINVENTORYID}}',
        date_from: '{{#? DATEFROM}}',
        date_to: '{{#? DATETO}}',
        quantity_in_stock_min: '{{QUANTITYINSTOCKMIN ? QUANTITYINSTOCKMIN : 0}}',
        quantity_in_stock_max: '{{QUANTITYINSTOCKMAX ? QUANTITYINSTOCKMAX : 0}}',
        unit_id: '{{#? parseInt(UNITID)}}',
        is_force_out: '{{ISFORCEOUT ? 1 : 0}}',
        max_storage_time: '{{MAXSTORAGETIME ? MAXSTORAGETIME : 0}}',
        store_id: '{{#? parseInt(STOREID)}}',
        stock_type_id: '{{#? parseInt(STOCKTYPEID)}}',
        pro_inventory_type: '{{#? PROINVENTORYTYPE}}',
    });

    return transform.transform(data, [
        'pro_inventory_id',
        'date_from',
        'date_to',
        'quantity_in_stock_min',
        'quantity_in_stock_max',
        'unit_id',
        'is_force_out',
        'max_storage_time',
        'store_id',
        'stock_type_id',
        'pro_inventory_type',
    ]);
};

const product = (data) => {
    const transform = new Transform({
        care_service_repair_id: '{{#? CARESERVICEREPAIRID}}',
        product_name: '{{#? PRODUCTNAME}}',
        product_id: '{{#? PRODUCTID}}',
        price: '{{#? PRICE}}',
        total_money: '{{#? TOTALMONEY}}',
        quantity: '{{#? QUANTITY}}',
        
    });
    return transform.transform(data, [
        'care_service_repair_id',
        'product_name',
        'product_id',
        'price',
        'total_money',
        'quantity',
    ]);
};

const productRelate = (data) => {
    const transform = new Transform({
        care_service_repair_id: '{{#? CARESERVICEPRODUCTID}}',
        product_name: '{{#? PRODUCTNAME}}',
        product_id: '{{#? PRODUCTID}}',
        orderindex: '{{#? ORDERINDEX}}',
        
    });
    return transform.transform(data, [
        'care_service_repair_id',
        'product_name',
        'product_id',
        'orderindex',
    ]);
};

const promotion = (data) => {
    const transform = new Transform({
        promotion_id: '{{#? PROMOTIONID}}',
        orderindex: '{{#? ORDERINDEX}}',
        promotion_name: '{{#? PROMOTIONNAME}}',
        begin_date: '{{#? BEGINDATE}}',
        end_date: '{{#? ENDDATE}}',
        
    });
    return transform.transform(data, [
        'promotion_id',
        'orderindex',
        'promotion_name',
        'begin_date',
        'end_date',
    ]);
};

const listProduct = (products = []) => {
    const transform = new Transform({
        product_id: '{{#? PRODUCTID}}',
        product_name: '{{#? PRODUCTNAME}}',
        product_code: '{{#? PRODUCTCODE}}',
        category_name: '{{#? CATEGORYNAME}}',
        model_name: '{{#? MODELNAME}}',
        vat_value: '{{ VATVALUE ? VATVALUE: 0 }}',
        created_date: '{{#? CREATEDDATE}}',
        manufacture_name: '{{#? MANUFACTURERNAME}}',
        price: '{{#? PRICE}}',
    });
    return transform.transform(products, [
        'product_id',
        'category_name',
        'model_name',
        'vat_value',
        'manufacture_name',
        'picture_url',
        'created_date',
        'is_active',
        'product_code',
        'product_name',
        'unit_name',
        'is_show_web',
        'price',
    ]);
};



const careServiceImages = (data = []) => {
    let transform = new Transform({
        ...template,
        ...{
            is_default: '{{ ISDEFAULT ? 1 : 0}}',
        },
    });
    return transform.transform(data, [
        'picture_url', 'is_default',
        'care_service_image_id'

    ]);
};

const productsBarcode = (products = []) => {
    let transform = new Transform({
        product_id: '{{#? PRODUCTID}}',
        product_name: '{{#? PRODUCTNAME}}',
        product_code: '{{#? PRODUCTCODE}}',
        price: '{{#? PRICE}}',
        category_name: '{{#? CATEGORYNAME}}',
        unit_name: '{{#? UNITNAME}}',
        manufacture_name: '{{#? MANUFACTURERNAME}}',
        picture_url: [
            {
                '{{#if PICTUREURL}}': `${config.domain_cdn}{{PICTUREURL}}`,
            },
            {
                '{{#else}}': null,
            },
        ],
        imeis: '{{#? IMEIS}}',
    });

    return transform.transform(products, [
        'listProduct',
        'product_id',
        'product_name',
        'product_code',
        'price',
        'picture_url',
        'category_name',
        'unit_name',
        'manufacture_name',
        'imeis',
    ]);
};

module.exports = {
    promotion,
    productRelate,
    listProduct,
    product,
    list,
    options,
    optionsStock,
    optionsProduct,
    detail,
    proAttribute,
    subUnitList,
    proStockInventory,
    careServiceImages,
    productsBarcode,
};
