const stockInRequestDataKey = {
    stockInType: 0,
    stocks: 1,
    department: 2,
    business: 3,
    product: 4,
    unit: 5,
    productModel: 6,
    productCategory: 7,
    store: 8,
};

const orderDataKey = {
    orderType: 0,
    orderStatus: 1,
    store: 2,
    product: 3,
    productCategory: 4,
    productModel: 5,
    stocks: 6,
    unit: 7,
    outputType: 8,
};

const receiveSlipDataKey = {
    order: 0,
    store: 1,
    paymentForm: 2,
    receiveType: 3,
};

module.exports = {
    stockInRequestDataKey,
    orderDataKey,
    receiveSlipDataKey,
};
