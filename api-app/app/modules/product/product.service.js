'use-strict';
const moduleClass = require('./product.class');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');

/**
 * Get list stocks can product
 *
 * @param queryParams
 * StocksId
 * ProductId
 * @returns ServiceResponse
 */
const getInformationProduct = async queryParams => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PRODUCTID', apiHelper.getValueFromObject(queryParams, 'product_id'))
            .input('STOCKSID', apiHelper.getValueFromObject(queryParams, 'stocks_id'))
            .execute('MD_PRODUCT_GetInformation_App');

        const dataRecord = data.recordset[0];
        return new ServiceResponse(true, '', moduleClass.getInformationProduct(dataRecord));
    } catch (e) {
        logger.error(e, {function: 'productService.getInformationProduct'});
        return new ServiceResponse(false, e.message);
    }
};

/**
 * Get list stocks can product
 *
 * @param queryParams
 * StocksId
 * ProductId
 * @returns ServiceResponse
 */

const getListProduct = async (queryParams = {}, bodyParams) => {
    console.log(queryParams)
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getSearch(queryParams);
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('KEYWORD', keyword)
            .input('STOREID', apiHelper.getValueFromObject(queryParams, 'store_id'))
            .execute('MD_PRODUCT_GetListProduct_App');

        const listProduct = data.recordsets[0];
        return new ServiceResponse(true, '', {
            data: moduleClass.getListProduct(listProduct),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordset),
        });
    } catch (e) {
        logger.error(e, {function: 'productService.getListProduct'});
        return new ServiceResponse(true, '', {});
    }
};

const getAttributesProduct = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('MODELID', apiHelper.getValueFromObject(queryParams, 'model_id'))
            .execute('MD_PRODUCT_GetAttributesProduct_App');

        let listProductAttribute = moduleClass.listAttribute(data.recordset);
        const listProductAttributeValue = moduleClass.listAttributeValue(data.recordsets[1]);

        listProductAttribute = listProductAttribute.map(item => {
            item.product_attribute_values = listProductAttributeValue.filter(
                value => value.product_attribute_id === item.product_attribute_id,
            );
            return item;
        });

        return new ServiceResponse(true, '', listProductAttribute);
    } catch (e) {
        logger.error(e, {function: 'productService.getAttributesProduct'});
        return new ServiceResponse(true, '', {});
    }
};

const getProductByModelId = async (model_id, queryParams = {}, bodyParams) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('MODELID', model_id)
            .input('STOREID', apiHelper.getValueFromObject(queryParams, 'store_id'))
            .execute('MD_PRODUCT_GetProductByModelId_App');

        let listProduct = moduleClass.getListProduct(data.recordset);
        const listProductAttribute = moduleClass.listProductAttribute(data.recordsets[1]);

        listProduct = listProduct.map(item => {
            item.product_attributes = listProductAttribute.filter(value => value.product_id === item.product_id);
            return item;
        });

        return new ServiceResponse(true, '', listProduct);
    } catch (e) {
        logger.error(e, {function: 'productService.getProductByModelId'});
        return new ServiceResponse(true, '', {});
    }
};

const getPromotionProduct = async bodyParams => {
    try {
        const pool = await mssql.pool;
        // Lay danh sach khuyen mai con han su dung
        const dataPromotion = await pool
            .request()
            .input('USERNAME', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('MD_PRODUCT_GetPromotionProduct_App');
        // console.log(dataPromotion.recordset);
        const promotions = moduleClass.promotions(dataPromotion.recordset);
        const productApply = moduleClass.productApplyPromotion(dataPromotion.recordsets[1]);
        const offers = moduleClass.offers(dataPromotion.recordsets[2]);
        const gifts = moduleClass.gift(dataPromotion.recordsets[3]);
        const productCategoryApply = moduleClass.productCategoryApplyPromotion(dataPromotion.recordsets[4]);

        // Filter cap nhat lai danh sach san pham ap dung tren tung ct khuyen mai neu co
        for (let i = 0; i < promotions.length; i++) {
            let promotion = promotions[i];
            let product_apply = (productApply || []).filter(p => p.promotion_id == promotion.promotion_id);
            let product_category_apply = (productCategoryApply || []).filter(
                p => p.promotion_id == promotion.promotion_id,
            );
            promotions[i].product_apply = product_apply || [];
            promotions[i].product_category_apply = product_category_apply || [];
        }

        // Filter cap nhat lai danh sach uu dai tren khuyen mai
        for (let i = 0; i < promotions.length; i++) {
            let promotion = promotions[i];
            let _offers = (offers || []).filter(p => p.promotion_id == promotion.promotion_id);
            for (let j = 0; j < _offers.length; j++) {
                const {is_fixed_gift, promotion_offer_id} = _offers[j];
                // Neu co qua tang thi lay danh sach qua tang
                if (is_fixed_gift) {
                    _offers[j].gifts = (gifts || []).filter(v => v.promotion_offer_id == promotion_offer_id);
                }
            }
            promotions[i].offers = _offers || [];
        }

        const product = apiHelper.getValueFromObject(bodyParams, 'product');

        //Duyêt danh sách khuyến mãi để check điều kiện
        let promotionApply = [];
        for (let k = 0; k < promotions.length; k++) {
            let promotion = promotions[k];
            let {
                is_apply_all_product,
                is_all_product_category,
                is_promotion_by_price,
                from_price,
                to_price,
                is_promotion_by_total_money,
                min_promotion_total_money,
                max_promotion_total_money,
                is_promotion_by_total_quantity,
                min_promotion_total_quantity,
                max_promotion_total_quantity,
                product_apply = [],
                product_category_apply = [],
            } = promotion || {};
            // console.log({is_apply_product_category, promotion_id: promotion.promotion_id})
            // Danh sach nganh hang ap dung va co check combo hay khong
            if (!is_all_product_category) {
                // console.log({product_category_apply})
                if (!product_category_apply.length) continue;

                // Check xem co san pham nao thuoc nganh hang ap dung khong
                const checkProductCategory = product_category_apply.findIndex(
                    y => product.product_category_id == y.product_category_id,
                );

                if (checkProductCategory < 0) {
                    continue;
                }
            } else if (!is_apply_all_product) {
                const checkProduct = product_apply.findIndex(y => product.product_id == y.product_id);
                if (checkProduct < 0) {
                    continue;
                }
            }

            // Kiem tra số tiền Khuyến mại theo mức giá
            if (is_promotion_by_price) {
                const checkProduct = product.price < from_price || product.price > to_price;
                if (checkProduct) {
                    continue;
                }
            }

            promotionApply.push(promotion);
        }

        // Tính giá trị được uu đãi trên từng promotion
        const promotionApplyOffer = calcPromotionDiscount(product, promotionApply);
        return new ServiceResponse(true, '', promotionApplyOffer);
    } catch (e) {
        logger.error(e, {function: 'productService.getPromotionProduct'});
        return new ServiceResponse(true, '', {});
    }
};

// Tính số tiền được giảm trên từng ưu đãi trong các chương trình khuyến mãi
const calcPromotionDiscount = (product, promotionApply) => {
    // Duyệt các chương trình thỏa điều kiện
    for (let i = 0; i < promotionApply.length; i++) {
        const {offers, is_apply_order} = promotionApply[i];
        for (let j = 0; j < offers.length; j++) {
            const offer = offers[j];

            // Tính giá được khuyên mãi trên tổng đơn hàng hay tren từng sản phẩm
            // Nếu km áp dụng trên đơn hàng thì tính giá trị discount
            // Ngược lại nếu không tính trên đơn hàng thì tính offer discoung trên từng sản phẩm xem giá tri được bao nhiêu
            promotionApply[i]['offers'][j].discount = is_apply_order
                ? calcPromotionApplyOrder(offer, product.current_base_price)
                : 0;
            if (!is_apply_order) {
                promotionApply[i]['offers'][j].offer_product = calcPromotionApplyProduct(
                    offer,
                    product,
                    promotionApply[i],
                );
            }
        }
    }
    return promotionApply;
};

// Tính giảm giá trên đơn hàng
const calcPromotionApplyOrder = (offer, totalMoney) => {
    let discount = 0;
    const {is_fix_price = 0, is_percent_discount = 0, is_discount_by_set_price = 0, discount_value = 0} = offer;
    // Nếu là giảm giá trực tiếp là giá được km
    if (is_discount_by_set_price) {
        discount += discount_value;
    }
    // Nếu giảm giá % thì sẽ tính giá trị giảm trên % tổng đơn hàng
    else if (is_percent_discount) {
        discount += ((totalMoney * discount_value * 1) / 100).toFixed(2);
    }
    // Giảm giá cứng: KM = tổng giá trị đơn hàng - giảm giá cứng
    else if (is_fix_price) {
        const fixDiscountPrice = totalMoney - discount_value;
        if (fixDiscountPrice <= 0) discount = 0;
        else discount = fixDiscountPrice;
    }
    return discount * 1;
};

// Tính giảm giá trên từng sản phẩm trong đơn hàng
const calcPromotionApplyProduct = (offer, product, promotion = {}) => {
    const {
        is_apply_all_product,
        // is_apply_any_product,
        // is_apply_appoint_product,
        is_all_product_category,
        product_apply = [],
        product_category_apply = [],
    } = promotion;
    // Sẽ trả về offer theo từng sản phẩm hình thức xuất trong đơn hàng
    let offer_product = [];
    // for (let i = 0; i < products.length; i++) {
    const {quantity = 0, price = 0, product_output_type_id, product_unit_id, product_id, product_category_id} = product;
    const {is_fix_price = 0, is_percent_discount = 0, is_discount_by_set_price = 0, discount_value = 0} = offer;
    if (is_fix_price || is_percent_discount || is_discount_by_set_price) {
        let discount = 0;
        // Kiểm tra xem sản phẩm nào thỏa điều kiện thì sẽ tính giảm giá cho sp đó
        if (
            is_apply_all_product ||
            is_all_product_category ||
            product_category_apply.findIndex(x => x.product_category_id == product_category_id) >= 0 ||
            product_apply.findIndex(k => k.product_id == product_id) >= 0
        ) {
            // Nếu là giảm giá trực tiếp là giá được km
            if (is_discount_by_set_price) {
                discount = discount_value * quantity * 1;
            }
            // Nếu giảm giá % thì sẽ tính giá trị giảm trên % tổng đơn hàng
            else if (is_percent_discount) {
                discount = parseFloat(`${(((price * discount_value * 1) / 100) * quantity).toFixed(2)}`);
            }
            // Giảm giá cứng: KM = tổng giá trị đơn hàng - giảm giá cứng
            else if (is_fix_price) {
                const fixDiscountPrice = price - discount_value;
                if (fixDiscountPrice <= 0) discount += 0;
                else discount = parseFloat(`${(fixDiscountPrice * quantity * 1).toFixed(2)}`);
            }
            discount = discount * 1;
            // Set gia tri khuyen mai cho san pham do
            offer_product.push({
                discount,
                product_id,
                product_category_id,
                product_output_type_id,
                product_unit_id,
            });
        }
    }
    // }
    return offer_product;
  }
const getProductByIMEI = async (params) => {
    try {
      const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('IMEI', apiHelper.getValueFromObject(params, 'imei'))
            .input('USERNAME', apiHelper.getValueFromObject(params, 'auth_name'))
            .input('OUTPUTORDERTYPEID', apiHelper.getValueFromObject(params, 'out_put_order_type_id'))
            .execute(PROCEDURE_NAME.MD_PRODUCT_GETBYIMEI_APP)
      return new ServiceResponse(true ,'', data.recordset[0] ? {
        ...moduleClass.detail(data.recordset[0]),
        list_attribute: moduleClass.getAttribute(data.recordsets[1])
      } : {})
    } catch (error) {
        logger.error(error, {function: 'productService.getProductByIMEI'});
        return new ServiceResponse(false, '', {});
    }
};

const getPreOrderModels = async queryParams => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('KEYCONFIG', 'LDP_PREORDER')
            .execute('SYS_APPCONFIG_GetByKeyConfig');

        return new ServiceResponse(true, '', data.recordset[0].VALUECONFIG);
    } catch (e) {
        logger.error(e, {function: 'productService.getPreOrderModels'});
        return new ServiceResponse(false, e.message);
    }
};

const getPreOrderMoneyDeposit = async queryParams => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('KEYCONFIG', 'PREOD_DEPOSIT')
            .execute('SYS_APPCONFIG_GetByKeyConfig');

        return new ServiceResponse(true, '', data.recordset[0].VALUECONFIG);
    } catch (e) {
        logger.error(e, {function: 'productService.getPreOrderMoneyDeposit'});
        return new ServiceResponse(false, e.message);
    }
};

module.exports = {
    getInformationProduct,
    getListProduct,
    getAttributesProduct,
    getProductByModelId,
    getPromotionProduct,
    getProductByIMEI,
    getPreOrderModels,
    getPreOrderMoneyDeposit
};
