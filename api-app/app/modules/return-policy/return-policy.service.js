const returnPolicyClass = require('../return-policy/return-policy.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');

const getProductDetails = async product_imei_code => {
    try {
        const pool = await mssql.pool;

        const productData = await pool
            .request()
            .input('PRODUCTIMEICODE', product_imei_code)
            .execute(PROCEDURE_NAME.PRO_RETURNPOLICY_GETPRODUCTDETAIL);
        const productRecord = productData.recordsets[0];

        if (productRecord?.length > 0) {
            const products = returnPolicyClass.productDetail(productRecord);
            const data = [];
            for (let item of products) {
                item = {
                    ...item,
                    color_list: [{id: +item.attribute_values_id, name: item.color}],
                    return_policy_list: [
                        {
                            id: item.return_policy_id,
                            name: item.return_policy_name,
                            return_condition_list: [
                                {
                                    id: item.return_condition_id,
                                    name: item.return_condition_name,
                                },
                            ],
                        },
                    ],
                };

                let match = data.find(r => r.product_id === item.product_id);
                if (match) {
                    const rp_exist_index = match.return_policy_list.findIndex(
                        rp => rp.id === item.return_policy_list[0].id,
                    );
                    if (rp_exist_index > -1) {
                        match.return_policy_list[rp_exist_index].return_condition_list = match.return_policy_list[
                            rp_exist_index
                        ].return_condition_list.concat(item.return_policy_list[0].return_condition_list);
                    } else {
                        match.return_policy_list = match.return_policy_list.concat(item.return_policy_list);
                    }
                } else {
                    data.push(item);
                }
            }

            const result = {
                product_id: data[0].product_id,
                product_id: data[0].product_id,
                image_url: data[0].image_url,
                price: data[0].price,
                color_list: data[0].color_list,
                return_policy_list: data[0].return_policy_list,
            };

            return new ServiceResponse(true, 'Lấy sản phẩm thành công', result);
        }

        removeCacheOptions();
        return new ServiceResponse(false, 'Không tìm thấy sản phẩm này');
    } catch (e) {
        logger.error(e, {function: 'returnPolicyService.getProductDetails'});
        return new ServiceResponse(false, e.message);
    }
};

const getProductsByOrderNo = async (bodyParams = {}) => {
    try {
        const pool = await mssql.pool;
        const listProductData = await pool
            .request()
            .input('ORDERNO', apiHelper.getValueFromObject(bodyParams, 'no'))
            .input('TYPEPOLICY', apiHelper.getValueFromObject(bodyParams, 't', 0))
            .execute(PROCEDURE_NAME.PRO_RETURNPOLICY_GETPRODUCTSBYORDERNO);

        const listProductRecord = listProductData.recordsets[0];
        const listProduct = returnPolicyClass.listProducts(listProductRecord);
        removeCacheOptions();
        return new ServiceResponse(true, 'Lấy sản phẩm hóa đơn thành công', listProduct);
    } catch (e) {
        logger.error(e, {function: 'returnPolicyService.getProductDetails'});
        return new ServiceResponse(false, e.message);
    }
};

const removeCacheOptions = () => {
    return cacheHelper.removeByKey(CACHE_CONST.MD_DEPARTMENT_OPTIONS);
};
module.exports = {
    getProductDetails,
    getProductsByOrderNo,
};
