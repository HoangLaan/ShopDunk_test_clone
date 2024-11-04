const Transform = require('../../common/helpers/transform.helper');

const template = {
    product_id: '{{#? PRODUCTID}}',
    product_name: '{{#? PRODUCTNAME}}',
    image_url: '{{#? IMAGEURL}}',
    color: '{{#? COLOR}}',
    return_policy_id: '{{#? RETURNPOLICYID}}',
    return_policy_name: '{{#? RETURNPOLICYNAME}}',
    return_condition_id: '{{#? RETURNCONDITIONID}}',
    return_condition_name: '{{#? RETURNCONDITIONNAME}}',
    attribute_values_id: '{{#? ATTRIBUTEVALUESID}}',
    price: '{{#? PRICE}}',
    quantity: '{{#? QUANTITY}}',
};

const transform = new Transform(template);

const listProducts = returnPolicy => {
    return transform.transform(returnPolicy, ['product_id', 'product_name', 'price', 'quantity', 'image_url']);
};

const productDetail = returnPolicy => {
    return transform.transform(returnPolicy, [
        'product_id',
        'product_name',
        'color',
        'return_policy_id',
        'return_policy_name',
        'return_condition_id',
        'return_condition_name',
        'attribute_values_id',
        'price',
        'image_url',
    ]);
};

module.exports = {
    productDetail,
    listProducts,
};
