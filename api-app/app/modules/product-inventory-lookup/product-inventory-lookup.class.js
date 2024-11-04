const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');

const template = {
    product_id: '{{#? parseInt(PRODUCTID)}}',
    product_name: '{{#? PRODUCTNAME}}',
    product_price: '{{PRODUCTPRICE ? parseInt(PRODUCTPRICE) : 0}}',
    product_base_price: '{{PRODUCTBASEPRICE ? parseInt(PRODUCTBASEPRICE) : 0}}',
    total_inventory: '{{TOTALINVENTORY ? parseInt(TOTALINVENTORY) : 0}}',
    total_inventory_can_sell: '{{TOTALINVENTORYCANSELL ? parseInt(TOTALINVENTORYCANSELL) : 0}}',
    image_url: [
        {
            '{{#if IMAGEURL}}': `${config.domain_cdn}{{IMAGEURL}}`,
        },
        {
            '{{#else}}': '',
        },
    ],

    store_id: '{{#? parseInt(STOREID)}}',
    store_name: '{{#? STORENAME}}',
};

let transform = new Transform(template);

const list = (list = []) => {
    return transform.transform(list, [
        'product_id',
        'product_name',
        'image_url',
        'product_price',
        'product_base_price',
        'total_inventory',
        'total_inventory_can_sell',
    ]);
};

const product = (product = {}) => {
    return transform.transform(product, [
        'product_id',
        'product_name',
        'image_url',
        'product_price',
        'product_base_price',
        'total_inventory',
        'total_inventory_can_sell',
    ]);
};

const storeList = (list = []) => {
    return transform.transform(list, ['store_id', 'store_name', 'total_inventory']);
};

module.exports = {
    list,
    product,
    storeList,
};
