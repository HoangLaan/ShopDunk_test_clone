'use strict';
const Transform = require('../../common/helpers/transform.helper');
//const config = require('../../../config/config');

const getStocksBorrow = department => {
    const template = {
        stocks_id: '{{#? STOCKSID}}',
        stocks_name: '{{#? STOCKSNAME}}',
        product_id: '{{#? PRODUCTID}}',
        product_inventory: '{{#? PRODUCTINVENTORY}}',
        product_can_sell: '{{#? PRODUCTCANSELL}}',
    };
    let transform = new Transform(template);
    return transform.transform(department, Object.keys(template));
};

const getBorrowType = data => {
    const template = {
        borrow_type_id: '{{#? BORROWTYPEID}}',
        borrow_review_level_id: '{{#? BORROWREVIEWLEVELID}}',
        is_auto_review: '{{#? ISAUTOREVIEW}}',
        borrow_type_name: '{{#? BORROWTYPENAME}}',
        borrow_review_level_name: '{{#? BORROWREVIEWLEVELNAME}}',
        user_review: '{{#? USERREVIEW}}',
        full_name: '{{#? FULLNAME}}',
        position_name: '{{#? POSITIONNAME}}',
    };
    let transform = new Transform(template);
    return transform.transform(data, Object.keys(template));
};

module.exports = {
    getStocksBorrow,
    getBorrowType,
};
