const apiHelper = require('../../../common/helpers/api.helper');
const sql = require('mssql');
const ServiceResponse = require('../../../common/responses/service.response');
const logger = require('../../../common/classes/logger.class');
const fileHelper = require('../../../common/helpers/file.helper');
const config = require('../../../../config/config');

const createProduct = async (bodyParams, transaction) => {
    try {
        const id = apiHelper.getValueFromObject(bodyParams, 'product_id');
        // Check product code
        const checkNameRequest = new sql.Request(transaction);
        const dataCheck = await checkNameRequest
            .input('PRODUCTID', apiHelper.getValueFromObject(bodyParams, 'product_id'))
            .input('PRODUCTNAME', apiHelper.getValueFromObject(bodyParams, 'product_name'))
            .input('PRODUCTCODE', apiHelper.getValueFromObject(bodyParams, 'product_code'))
            .execute('MD_PRODUCT_CheckNameAndCode_AdminWeb');

        if (dataCheck.recordset && dataCheck.recordset[0].RESULT == 1) {
            throw new Error("Tên hoặc mã sản phẩm đã tồn tại.");
        }

        // Insert MD_PRODUCT
        const data = new sql.Request(transaction);
        const dataResult = await data
            .input('PRODUCTID', apiHelper.getValueFromObject(bodyParams, 'product_id'))
            .input('PRODUCTCATEGORYID', apiHelper.getValueFromObject(bodyParams, 'product_category_id'))
            .input('PRODUCTCODE', apiHelper.getValueFromObject(bodyParams, 'product_code'))
            .input('PRODUCTNAME', apiHelper.getValueFromObject(bodyParams, 'product_name'))
            .input('PRODUCTDISPLAYNAME', apiHelper.getValueFromObject(bodyParams, 'product_display_name'))
            .input('ORIGINID', apiHelper.getValueFromObject(bodyParams.origin_id || {}, 'value'))
            .input('MANUFACTURERID', apiHelper.getValueFromObject(bodyParams.manufacture_id || {}, 'value'))
            .input('UNITID', apiHelper.getValueFromObject(bodyParams, 'unit_id'))
            .input('MODELID', apiHelper.getValueFromObject(bodyParams.model_id || {}, 'value'))
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('DESCRIPTIONS', apiHelper.getValueFromObject(bodyParams, 'description'))
            .input('KEYPOINTS', apiHelper.getValueFromObject(bodyParams, 'keypoints'))
            .input('WARRANTYPERIODID', apiHelper.getValueFromObject(bodyParams, 'warranty_period_id'))
            .input('ISHALFLINK', apiHelper.getValueFromObject(bodyParams, 'is_half_link'))
            .input('ISSTOPSELLING', apiHelper.getValueFromObject(bodyParams, 'is_stop_selling'))
            .input('STOPSELLINGFROM', apiHelper.getValueFromObject(bodyParams, 'stop_selling_from'))
            .input('ISSTOCKTRACKING', apiHelper.getValueFromObject(bodyParams, 'is_stock_tracking'))
            .input('ISDEFAULT', apiHelper.getValueFromObject(bodyParams, 'is_default'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('MD_PRODUCT_CreateOrUpdate_AdminWeb');
        const productId = dataResult.recordset[0].RESULT;

        if (productId <= 0) {
            throw new Error(`${id ? 'Cập nhật' : 'Thêm mới'} sản phẩm không thành công.`);
        }

        // Insert PRO_PRODUCTIMAGES
        const images = apiHelper.getValueFromObject(bodyParams, 'images');
        if (images && images.length) {
            for (let i = 0; i < images.length; i++) {
                let picture_url;

                if (!images[i].picture_url) {
                    if (fileHelper.isBase64(images[i])) {
                        picture_url = await fileHelper.saveBase64(null, images[i]);
                    }
                }
                picture_url = picture_url || images[i] && images[i].picture_url && images[i].picture_url.replace(config.domain_cdn, '');

                const requestCreateImage = new sql.Request(transaction);
                const resultCreateOmage = await requestCreateImage
                    .input('PRODUCTID', productId)
                    .input('PICTUREURL', picture_url)
                    .input('ISDEFAULT', i == 0 ? true : false)
                    .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                    .execute('PRO_PRODUCTIMAGES_Create_AdminWeb');

                const result = resultCreateOmage.recordset[0].RESULT;
                if (result <= 0) {
                    throw new Error(`Thêm hình ảnh không thành công.`);
                }
            }
        }

        // Insert PRO_PRODUCTATTRIBUTEVALUES
        const attributes = apiHelper.getValueFromObject(bodyParams, 'attributes');
        if (attributes && attributes.length) {
            for (let i = 0; i < attributes.length; i++) {
                const attribute = attributes[i];
                if (!attribute.values || !attribute.values.length) attribute.values = [{}];
                for (let j = 0; j < attribute.values.length; j++) {
                    const values = attribute.values[j];
                    const requestCreateAttribute = new sql.Request(transaction);
                    const resultCreateAttribute = await requestCreateAttribute
                        .input('PRODUCTID', productId)
                        .input('PRODUCTATTRIBUTEID', apiHelper.getValueFromObject(attributes[i], 'attribute_id'))
                        .input('ATTRIBUTEVALUESID', apiHelper.getValueFromObject(values, 'value'))
                        .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                        .execute('PRO_PRODUCTATTRIBUTEVALUES_Create_AdminWeb');

                    const result = resultCreateAttribute.recordset[0].RESULT;
                    if (result <= 0) {
                        throw new Error(`Thêm thuộc tính sản phẩm không thành công.`);
                    }
                }
            }
        }

        return new ServiceResponse(true, 'ok', productId);
    } catch (e) {
        logger.error(e, { function: 'productModelHelper.createProduct' });
        return new ServiceResponse(false, e.message);
    }
};

module.exports = {
    createProduct,
};
