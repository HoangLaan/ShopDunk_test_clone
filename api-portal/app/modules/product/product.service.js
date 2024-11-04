/* eslint-disable no-await-in-loop */
const productClass = require('../product/product.class');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const API_CONST = require('../../common/const/api.const');
const fileHelper = require('../../common/helpers/file.helper');
const config = require('../../../config/config');
let xl = require('excel4node');
const barcodeHelper = require('../../common/helpers/barcode.helper');
const moment = require('moment');
const pdfHelper = require('../../common/helpers/pdf.helper');
const numberFormat = require('../../common/helpers/numberFormat');
const readXlsxFile = require('read-excel-file/node');
const { changeToSlug } = require('../../common/helpers/string.helper');
const optionsService = require('../../common/services/options.service');
const { getOptionsCommon } = require('../global/global.service');
const { createQR } = require('../../common/helpers/qr.helper');
const excelHelper = require('../../common/helpers/excel.helper');

const getListProduct = async (queryParams = {}) => {
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
            .input('PRODUCTCATEGORYID', apiHelper.getValueFromObject(queryParams, 'product_category_id'))
            .input('PRODUCTMODELID', Number(apiHelper.getValueFromObject(queryParams, 'model_id')))
            .input('MANUFACTUREID', apiHelper.getValueFromObject(queryParams, 'manufacture_id'))
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'created_date_from'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'created_date_to'))
            .input('ISSHOWWEB', apiHelper.getValueFromObject(queryParams, 'is_show_web', 2))
            .input('UNITID', apiHelper.getValueFromObject(queryParams, 'unit_id'))
            .input('ORIGINID', apiHelper.getValueFromObject(queryParams, 'origin_id'))
            .input('ISACTIVE', apiHelper.getValueFromObject(queryParams, 'is_active', 2))
            .input('ISSTOCKTRACKING', apiHelper.getValueFromObject(queryParams, 'is_stock_tracking', 2))
            .input('ISSTOPSELLING', apiHelper.getValueFromObject(queryParams, 'is_stop_selling', 2))
            .execute('MD_PRODUCT_GetList_AdminWeb');

        return new ServiceResponse(true, '', {
            data: productClass.list(data.recordset),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordset),
        });
    } catch (e) {
        logger.error(e, {
            function: 'ProductService.getListProduct',
        });
        return new ServiceResponse(false, e.message);
    }
};

const deleteProduct = async (bodyParams) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    await transaction.begin();
    try {
        // Delete product attribute values
        const requestProductAttrDelete = new sql.Request(transaction);
        const dataProductAttrDelete = await requestProductAttrDelete
            .input('IDS', apiHelper.getValueFromObject(bodyParams, 'ids'))
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('PRO_PRODUCTATTRIBUTEVALUES_DeleteById_AdminWeb');
        const resultProductAttrDelete = dataProductAttrDelete.recordset[0].RESULT;
        if (resultProductAttrDelete <= 0) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Xóa thuộc tính sản phẩm không thành công.');
        }
        // Delete product
        const requestProductDelete = new sql.Request(transaction);
        const datatProductDelete = await requestProductDelete
            .input('IDS', apiHelper.getValueFromObject(bodyParams, 'ids'))
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('MD_PRODUCT_DeleteMany_AdminWeb');
        const resultProductDelete = datatProductDelete.recordset[0].RESULT;
        if (resultProductDelete <= 0) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Xóa sản phẩm không thành công');
        }
        await transaction.commit();
        return new ServiceResponse(true, 'ok');
    } catch (e) {
        logger.error(e, { function: 'ProductService.deleteProduct' });
        await transaction.rollback();
        return new ServiceResponse(false, e.message);
    }
};

const getListAttributes = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getSearch(queryParams);
        const modelId = apiHelper.getValueFromObject(queryParams, 'model_id');

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('KEYWORD', keyword)
            .input('MODELID', modelId)
            .execute('MD_PRODUCT_GetListAttribute_AdminWeb');

        let attributes = productClass.listAttributes(data.recordset);
        const attributeValues = productClass.listAttributeValues(data.recordsets[1]);
        attributes = attributes.map((attr, i) => {
            return {
                ...attr,
                attribute_values: (attributeValues || []).filter((x) => x.attribute_id == attr.attribute_id),
            };
        });

        return new ServiceResponse(true, '', {
            data: attributes,
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordset),
        });
    } catch (e) {
        logger.error(e, { function: 'ProductService.getListAttributes' });
        return new ServiceResponse(true, '', {});
    }
};

const createAttribute = async (body = {}) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        // Begin transaction
        await transaction.begin();

        const attributeName = apiHelper.getValueFromObject(body, 'attribute_name');

        const checkAttributeName = await pool
            .request()
            .input('ATTRIBUTENAME', attributeName)
            .execute('MD_PRODUCT_CheckAttributeName_AdminWeb');

        if (checkAttributeName.recordset[0].RESULT) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Tên thuộc tính sản phẩm đã tồn tại.');
        }

        // Save Attribute
        const requestProductAttribute = new sql.Request(transaction);
        const resultProductAttribute = await requestProductAttribute
            .input('UNITID', apiHelper.getValueFromObject(body, 'unit_id'))
            .input('ATTRIBUTENAME', attributeName)
            .input('ATTRIBUTEDESCRIPTION', apiHelper.getValueFromObject(body, 'attribute_description'))
            .input('ISCOLOR', apiHelper.getValueFromObject(body, 'is_color'))
            .input('ISFORMSIZE', apiHelper.getValueFromObject(body, 'is_form_size'))
            .input('ISOTHER', apiHelper.getValueFromObject(body, 'is_other'))
            .input('ISMATERIAL', apiHelper.getValueFromObject(body, 'is_material'))
            .input('ISACTIVE', 1)
            .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
            .input('MODELID', apiHelper.getValueFromObject(body, 'model_id'))
            .execute('MD_PRODUCT_CreateAttribute_AdminWeb');
        const product_attribute_id = resultProductAttribute.recordset[0].RESULT;
        if (product_attribute_id <= 0) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Thêm thuộc tính sản phẩm không thành công');
        }

        const attribute_values = apiHelper.getValueFromObject(body, 'attribute_values', []);

        if (attribute_values.length > 0) {
            for (let i = 0; i < attribute_values.length; i++) {
                let item = attribute_values[i];
                let attribute_image = item.attribute_image;
                if (attribute_image) {
                    try {
                        item.attribute_image = await fileHelper.saveImage(attribute_image);
                    } catch (error) {
                        logger.error(error, { function: 'ProductModelService.SaveAttributeImage' });
                    }
                }
                const requestChild = new sql.Request(transaction);
                const resultChild = await requestChild // eslint-disable-line no-await-in-loop
                    .input('PRODUCTATTRIBUTEID', product_attribute_id)
                    .input('ATTRIBUTEVALUES', apiHelper.getValueFromObject(item, 'attribute_value'))
                    .input('ATTRIBUTEDESCRIPTION', apiHelper.getValueFromObject(item, 'attribute_description'))
                    .input('ATTRIBUTEIMAGE', attribute_image)
                    .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
                    .input('COLORHEX', apiHelper.getValueFromObject(item, 'color_hex'))
                    .execute('MD_PRODUCT_CreateAttributeValue_AdminWeb');
                const child_id = resultChild.recordset[0].RESULT;
                if (child_id <= 0) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Thêm giá trị thuộc tính không thành công');
                }
            }
        }
        await transaction.commit();
        return new ServiceResponse(true, '', {
            id: product_attribute_id,
            value: product_attribute_id,
            label: attributeName,
        });
    } catch (error) {
        await transaction.rollback();
        logger.error(error, {
            function: 'ProductModelService.createAttribute',
        });
        return new ServiceResponse(false, error.message);
    }
};

const getOptionsStock = async (queryParams = {}) => {
    try {
        const keyword = apiHelper.getSearch(queryParams);
        const excludeTypes = apiHelper.getValueFromObject(queryParams, 'exclude_types');
        const storeId = apiHelper.getValueFromObject(queryParams, 'store_id');
        const limit = apiHelper.getValueFromObject(queryParams, 'limit', 100);

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('KEYWORD', keyword)
            .input('STOREID', storeId)
            .input('EXCLUDETYPES', excludeTypes)
            .input('LIMIT', limit)
            .execute('MD_PRODUCT_GetOptionsStock_AdminWeb');

        return new ServiceResponse(true, 'ok', productClass.optionsStock(data.recordset));
    } catch (e) {
        logger.error(e, { function: 'ProductService.getOptionsStock' });
        return new ServiceResponse(true, '', {});
    }
};

const getOptionsStockType = async (queryParams = {}) => {
    try {
        const serviceRes = await optionsService('ST_STOCKSTYPE', queryParams);

        let result = serviceRes.data || [];
        const excludeIds = apiHelper.getValueFromObject(queryParams, 'exclude_ids');
        if (excludeIds) {
            const excludeIdsArray = excludeIds ? excludeIds.split('|') : [];
            result = result.filter((item) => excludeIdsArray.indexOf(item.id) === -1);
        }

        return new ServiceResponse(true, 'ok', result);
    } catch (e) {
        logger.error(e, { function: 'ProductService.getOptionsStockType' });
        return new ServiceResponse(true, '', {});
    }
};

const getOptionsProduct = async () => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .execute('MD_PRODUCT_GetOptions_AdminWeb');

        return new ServiceResponse(true, 'ok', productClass.optionsProduct(data.recordset));
    } catch (e) {
        logger.error(e, { function: 'ProductService.getOptionsStock' });
        return new ServiceResponse(true, '', {});
    }
}

const PRO_INVENTORY_TYPE = {
    BASE: 1,
    MIN: 2,
};

const createProductOrUpdate = async (bodyParams) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        await transaction.begin();
        const id = apiHelper.getValueFromObject(bodyParams, 'product_id');
        // Check product code
        const dataCheck = await pool
            .request()
            .input('PRODUCTID', apiHelper.getValueFromObject(bodyParams, 'product_id'))
            .input('PRODUCTNAME', apiHelper.getValueFromObject(bodyParams, 'product_name'))
            .input('PRODUCTCODE', apiHelper.getValueFromObject(bodyParams, 'product_code'))
            .execute('MD_PRODUCT_CheckNameAndCode_AdminWeb');
        if (dataCheck.recordset && dataCheck.recordset[0].RESULT == 1) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Tên hoặc mã sản phẩm đã tồn tại.', null);
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
            .input('UNITID', apiHelper.getValueFromObject(bodyParams.unit_id || {}, 'value'))
            .input('MODELID', apiHelper.getValueFromObject(bodyParams.model_id || {}, 'value'))
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('DESCRIPTIONS', apiHelper.getValueFromObject(bodyParams, 'description'))
            .input('KEYPOINTS', apiHelper.getValueFromObject(bodyParams, 'keypoints'))
            .input('WARRANTYPERIODID', apiHelper.getValueFromObject(bodyParams, 'warranty_period_id'))
            .input('ISHALFLINK', apiHelper.getValueFromObject(bodyParams, 'is_half_link'))
            .input('ISSTOPSELLING', apiHelper.getValueFromObject(bodyParams, 'is_stop_selling'))
            .input('STOPSELLINGFROM', apiHelper.getValueFromObject(bodyParams, 'stop_selling_from'))
            .input('ISSTOCKTRACKING', apiHelper.getValueFromObject(bodyParams, 'is_stock_tracking'))
            .input('ISSHOWWEB', apiHelper.getValueFromObject(bodyParams, 'is_show_web'))
            .input('ISHOT', apiHelper.getValueFromObject(bodyParams, 'is_hot'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .input('PRODUCTLINK', apiHelper.getValueFromObject(bodyParams, 'product_link'))
            
            .execute('MD_PRODUCT_CreateOrUpdate_AdminWeb');
        const productId = dataResult.recordset[0].RESULT;

        if (productId <= 0) {
            await transaction.rollback();
            return new ServiceResponse(false, `${id ? 'Cập nhật' : 'Thêm mới'} sản phẩm không thành công.`);
        }

        if (id) {
            // Delete images
            const requestImagesDel = new sql.Request(transaction);
            const resultImagesDel = await requestImagesDel
                .input('PRODUCTID', productId)
                .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .execute('PRO_PRODUCTIMAGES_Delete_AdminWeb');
            if (resultImagesDel.recordset.RESULT <= 0) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Xóa hình ảnh không thành công.');
            }

            // Delete attribute
            const requestAttributesDel = new sql.Request(transaction);
            const resultAttributesDel = await requestAttributesDel
                .input('PRODUCTID', productId)
                .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .execute('PRO_PRODUCTATTRIBUTEVALUES_Delete_AdminWeb');
            if (resultAttributesDel.recordset.RESULT <= 0) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Xóa thuộc tính không thành công.');
            }

            // Delete inventory
            const requestProStockDel = new sql.Request(transaction);
            const resultProStockDel = await requestProStockDel
                .input('PRODUCTID', productId)
                .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .execute('PRO_PROSTOCKSINVENTORY_Delete_AdminWeb');
            if (resultProStockDel.recordset.RESULT <= 0) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Xóa hạn mức tồn kho không thành công.');
            }

            // Delete sub unit
            const deleteSubUnit = new sql.Request(transaction);
            await deleteSubUnit
                .input('LISTID', [productId])
                .input('NAMEID', 'PRODUCTID')
                .input('TABLENAME', 'PRO_PRODUCTSUBUNITS')
                .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .execute('CBO_COMMON_SOFTDELETE');
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
                picture_url = picture_url || images[i].picture_url?.replace(config.domain_cdn, '');

                const requestCreateImage = new sql.Request(transaction);
                const resultCreateOmage = await requestCreateImage
                    .input('PRODUCTID', productId)
                    .input('PICTUREURL', picture_url)
                    .input('ISDEFAULT', i == 0 ? true : false)
                    .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                    .execute('PRO_PRODUCTIMAGES_Create_AdminWeb');

                const result = resultCreateOmage.recordset[0].RESULT;
                if (result <= 0) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Thêm hình ảnh không thành công.');
                }
            }
        }

        // Insert PRO_PRODUCTATTRIBUTEVALUES
        const attributes = apiHelper.getValueFromObject(bodyParams, 'attributes');
        if (attributes && attributes.length) {
            for (let i = 0; i < attributes.length; i++) {
                const attribute = attributes[i];
                let valueAttrProduct = apiHelper.getValueFromObject(attribute, 'values');
                if (valueAttrProduct instanceof Array) {
                    valueAttrProduct = valueAttrProduct[0].value;
                }

                const requestCreateAttribute = new sql.Request(transaction);
                const resultCreateAttribute = await requestCreateAttribute
                    .input('PRODUCTID', productId)
                    .input('PRODUCTATTRIBUTEID', apiHelper.getValueFromObject(attributes[i], 'attribute_id'))
                    .input('ATTRIBUTEVALUESID', valueAttrProduct)
                    .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                    .execute('PRO_PRODUCTATTRIBUTEVALUES_Create_AdminWeb');

                const result = resultCreateAttribute.recordset[0].RESULT;
                if (result <= 0) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Thêm thuộc tính sản phẩm không thành công.');
                }
            }
        }

        // Insert PRO_PROSTOCKSINVENTORY
        const base_inventory_list = apiHelper.getValueFromObject(bodyParams, 'base_inventory_list');
        if (base_inventory_list && base_inventory_list.length) {
            for (let i = 0; i < base_inventory_list.length; i++) {
                const requestCreateBaseInventory = new sql.Request(transaction);
                const resultCreateBaseInventory = await requestCreateBaseInventory
                    .input('PRODUCTID', productId)
                    .input('PROINVENTORYID', apiHelper.getValueFromObject(base_inventory_list[i], 'pro_inventory_id'))
                    .input('UNITID', apiHelper.getValueFromObject(base_inventory_list[i], 'unit_id'))
                    .input('DATEFROM', apiHelper.getValueFromObject(base_inventory_list[i], 'date_from'))
                    .input('DATETO', apiHelper.getValueFromObject(base_inventory_list[i], 'date_to'))
                    .input(
                        'QUANTITYINSTOCKMAX',
                        apiHelper.getValueFromObject(base_inventory_list[i], 'quantity_in_stock_max'),
                    )
                    .input(
                        'QUANTITYINSTOCKMIN',
                        apiHelper.getValueFromObject(base_inventory_list[i], 'quantity_in_stock_min'),
                    )
                    .input('MAXSTORAGETIME', apiHelper.getValueFromObject(base_inventory_list[i], 'max_storage_time'))
                    .input('ISFORCEOUT', apiHelper.getValueFromObject(base_inventory_list[i], 'is_force_out'))
                    .input('PROINVENTORYTYPE', PRO_INVENTORY_TYPE.BASE)
                    .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                    .execute('PRO_PROSTOCKSINVENTORY_CreateOrUpdate_AdminWeb');

                const result = resultCreateBaseInventory.recordset[0].RESULT;
                if (result <= 0) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Thêm hạn mức tồn kho cơ bản không thành công.');
                }
            }
        }

        const min_inventory_list = apiHelper.getValueFromObject(bodyParams, 'min_inventory_list');
        if (min_inventory_list && min_inventory_list.length) {
            for (let i = 0; i < min_inventory_list.length; i++) {
                const requestCreateMinInventory = new sql.Request(transaction);
                const resultCreateMinInventory = await requestCreateMinInventory
                    .input('PRODUCTID', productId)
                    .input('PROINVENTORYID', apiHelper.getValueFromObject(min_inventory_list[i], 'pro_inventory_id'))
                    .input('UNITID', apiHelper.getValueFromObject(min_inventory_list[i], 'unit_id'))
                    .input('STOREID', apiHelper.getValueFromObject(min_inventory_list[i], 'store_id'))
                    .input('STOCKTYPEID', apiHelper.getValueFromObject(min_inventory_list[i], 'stock_type_id'))
                    .input('DATEFROM', apiHelper.getValueFromObject(min_inventory_list[i], 'date_from'))
                    .input('DATETO', apiHelper.getValueFromObject(min_inventory_list[i], 'date_to'))
                    .input(
                        'QUANTITYINSTOCKMAX',
                        apiHelper.getValueFromObject(min_inventory_list[i], 'quantity_in_stock_max'),
                    )
                    .input(
                        'QUANTITYINSTOCKMIN',
                        apiHelper.getValueFromObject(min_inventory_list[i], 'quantity_in_stock_min'),
                    )
                    .input('MAXSTORAGETIME', apiHelper.getValueFromObject(min_inventory_list[i], 'max_storage_time'))
                    .input('ISFORCEOUT', apiHelper.getValueFromObject(min_inventory_list[i], 'is_force_out'))
                    .input('PROINVENTORYTYPE', PRO_INVENTORY_TYPE.MIN)
                    .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                    .execute('PRO_PROSTOCKSINVENTORY_CreateOrUpdate_AdminWeb');

                const result = resultCreateMinInventory.recordset[0].RESULT;
                if (result <= 0) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Thêm hạn mức tồn tối thiểu không thành công.');
                }
            }
        }

        // sub unit list
        const sub_unit_list = apiHelper.getValueFromObject(bodyParams, 'sub_unit_list');
        if (sub_unit_list && sub_unit_list.length > 0) {
            for (let i = 0; i < sub_unit_list.length; i++) {
                const material = sub_unit_list[i];
                const requestProductSubUnitCreate = new sql.Request(transaction);
                const dataProductSubUnitCreate = await requestProductSubUnitCreate // eslint-disable-line no-await-in-loop
                    .input('PRODUCTID', productId)
                    .input('PRODUCTSUBUNITID', apiHelper.getValueFromObject(material, 'product_sub_unit_id'))
                    .input('SUBUNITID', apiHelper.getValueFromObject(material, 'sub_unit_id'))
                    .input('MAINUNITID', apiHelper.getValueFromObject(material, 'main_unit_id'))
                    .input(
                        'DENSITYVALUE',
                        apiHelper.getValueFromObject(material, 'density_value_1') /
                        apiHelper.getValueFromObject(material, 'density_value_2'),
                    )
                    .input('NOTE', apiHelper.getValueFromObject(material, 'note'))
                    .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                    .execute('PRO_PRODUCTSUBUNITS_CreateOrUpdate_AdminWeb');

                const resultProductSubUnit = dataProductSubUnitCreate.recordset[0].RESULT;
                if (resultProductSubUnit <= 0) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Thêm đơn vị quy đổi không thành công.');
                }
            }
        }

        await transaction.commit();
        return new ServiceResponse(true, 'ok', productId);
    } catch (e) {
        await transaction.rollback();
        logger.error(e, { function: 'productService.createProductOrUpdate' });
        return new ServiceResponse(false, e.message);
    }
};

const gcd = (a, b) => {
    return b ? gcd(b, a % b) : a;
};
var decimalToFraction = function (_decimal) {
    if (_decimal == 1) {
        return {
            top: 1,
            bottom: 1,
            display: 1 + ':' + 1,
        };
    } else {
        var top = _decimal.toString().replace(/\d+[.]/, '');
        var bottom = Math.pow(10, top.length);
        if (_decimal > 1) {
            top = +top + Math.floor(_decimal) * bottom;
        }
        var x = gcd(top, bottom);
        return {
            top: top / x,
            bottom: bottom / x,
        };
    }
};

const detailProduct = async (productId) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().input('PRODUCTID', productId).execute('MD_PRODUCT_GetById_AdminWeb');
        let product = productClass.detail(data.recordset[0]);

        if (!product) return new ServiceResponse(false, 'Không tìm thấy sản phẩm');

        product.images = productClass.proImages(data.recordsets[1]);

        const inventories = productClass.proStockInventory(data.recordsets[2]);
        // Get stock inventory (shared and stock)
        product.base_inventory_list = (inventories || []).filter(
            (x) => x.pro_inventory_type === PRO_INVENTORY_TYPE.BASE,
        );
        product.min_inventory_list = (inventories || []).filter((x) => x.pro_inventory_type === PRO_INVENTORY_TYPE.MIN);
        product.min_inventory_list = await Promise.all(
            product.min_inventory_list.map(async (item) => {
                const stockTypeOptionsRes = await getOptionsCommon({
                    type: 'stockTypeByStore',
                    parent_id: item.store_id,
                });
                if (stockTypeOptionsRes.isFailed()) {
                    throw stockTypeOptionsRes;
                }
                const stockTypeOptions = stockTypeOptionsRes.getData();

                return { ...item, stock_type_options: stockTypeOptions };
            }),
        );

        let attributes = productClass.proAttribute(data.recordsets[3]);
        // Group attributes
        attributes = (attributes || []).reduce((attributesGr, attribute) => {
            const idx = attributesGr.findIndex((x) => x.attribute_id == attribute.attribute_id);
            if (idx >= 0) {
                // Update attributes
                attributesGr[idx].values.push(attribute.value);
            } else attributesGr.push({ ...attribute, values: [attribute.value] });
            return attributesGr;
        }, []);

        // Get sub unit list
        const subUnitList = productClass.subUnitList(data.recordsets[4]);
        product.sub_unit_list = subUnitList.map((item) => {
            const density_value = decimalToFraction(item.density_value);
            return { ...item, density_value_1: density_value.top, density_value_2: density_value.bottom };
        });

        // Get attributes values options on row
        for (let i = 0; i < attributes.length; i++) {
            const data = await pool
                .request()
                .input('PRODUCTATTRIBUTEID', attributes[i].attribute_id)
                .execute('MD_PRODUCT_GetListAttributeValues_AdminWeb');
            attributes[i].attribute_values = productClass.listAttributeValues(data.recordset);
        }
        product.attributes = attributes;

        return new ServiceResponse(true, 'ok', product);
    } catch (e) {
        logger.error(e, {
            function: 'productService.detailProduct',
        });
        return new ServiceResponse(false, e.message);
    }
};

const getProductsPrintBarcode = async (queryParams = {}) => {
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
            .input('PRODUCTCATEGORYID', Number(apiHelper.getValueFromObject(queryParams, 'product_category_id')))
            .input('PRODUCTMODELID', Number(apiHelper.getValueFromObject(queryParams, 'product_model_id')))
            .input('MANUFACTURERID', Number(apiHelper.getValueFromObject(queryParams, 'manufacturer_id')))
            .input('FROMDATE', apiHelper.getValueFromObject(queryParams, 'from_date'))
            .input('TODATE', apiHelper.getValueFromObject(queryParams, 'to_date'))
            .input('STOCKSID', apiHelper.getValueFromObject(queryParams, 'stocks_id'))
            .input('OUTPUTTYPEID', apiHelper.getValueFromObject(queryParams, 'output_type_id'))
            .input('AREAID', apiHelper.getValueFromObject(queryParams, 'area_id'))
            .input('BUSINESSID', apiHelper.getValueFromObject(queryParams, 'business_id'))
            .input('STOCKSINREQUESTID', apiHelper.getValueFromObject(queryParams, 'stock_in_request_id'))
            .execute('MD_PRODUCT_GetListBarcode_AdminWeb');

        const dataRecord = data.recordset;
        const products = productClass.productsBarcode(dataRecord);
        // Lấy imeis product
        const result = products.map(({ imeis, ...item }) => ({
            ...item,
            imeis: imeis?.split('-')?.map((im) => ({ product_id: item.product_id, imei: im })) ?? [],
        }));

        return new ServiceResponse(true, '', {
            data: result,
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(dataRecord),
        });
    } catch (e) {
        logger.error(e, {
            function: 'productService.getProductsPrintBarcode',
        });
        return new ServiceResponse(false, e.message);
    }
};

const printBarcode = async (bodyParams = {}) => {
    try {
        let products = apiHelper.getValueFromObject(bodyParams, 'products');
        if (!products || !products.length) {
            return new ServiceResponse(false, 'Vui lòng chọn sản phẩm để in mã vạch.');
        }
        // Khổ in tem có 2 loai :
        // 1: 40x30mm
        // 2: 2 tem 35x22mm
        const size = apiHelper.getValueFromObject(bodyParams, 'size');
        const is_show_product_name = apiHelper.getValueFromObject(bodyParams, 'is_show_name');
        const is_show_product_code = apiHelper.getValueFromObject(bodyParams, 'is_show_code');
        const is_show_price = apiHelper.getValueFromObject(bodyParams, 'is_show_price');
        const is_print_imei = apiHelper.getValueFromObject(bodyParams, 'is_print_sku');

        let barcodes = [];
        for (let i = 0; i < products.length; i++) {
            const { product_code, price = 0, total_barcode = 1, product_name, imeis = [] } = products[i];
            // In mã sản phẩm
            let items = [];
            if (!is_print_imei) {
                const barcode = await barcodeHelper.create(product_code, is_show_product_code);
                items = [...Array(total_barcode)].map((x) => {
                    return {
                        barcode,
                        price: `${numberFormat.CurrencyTotalPrice(price)} VND`,
                        product_name: `${product_name}`.substring(0, 40),
                        is_show_price,
                        is_show_product_name,
                    };
                });
            } else {
                // In product imei code
                for (let j = 0; j < imeis.length; j++) {
                    const { imei } = imeis[j];
                    const barcode = await barcodeHelper.create(imei, is_show_product_code);
                    const imeiItems = [...Array(total_barcode)].map((x) => {
                        return {
                            barcode,
                            price: `${numberFormat.CurrencyTotalPrice(price)} VND`,
                            product_name: `${product_name}`.substring(0, 40),
                            is_show_price,
                            is_show_product_name,
                        };
                    });
                    items = [...items, ...imeiItems];
                }
            }
            barcodes = [...barcodes, ...items];
        }
        // neu size = 2 thi xu ly lai mang
        if (size == 2) {
            const length = parseInt(Math.round(barcodes.length / 2));
            let barcodesClone = barcodes;
            let barcodesGroup = [...new Array(length)].map((x) => [
                { product_name: '', barcode: '', price: '' },
                { product_name: '', barcode: '', price: '' },
            ]);
            for (let i = 0; i < length; i++) {
                let x = barcodesGroup[i];
                let current = i * 2;
                let next = i * 2 + 1;
                if (current < barcodesClone.length) {
                    x[0] = barcodesClone[current];
                }
                if (next < barcodesClone.length) {
                    x[1] = barcodesClone[next];
                }
            }
            barcodes = barcodesGroup;
        }
        const fileName = `Barcode_${moment().format('DDMMYYYYHHmmss')}`;
        await pdfHelper.createBarcode(
            size == 1 ? '40x30mm' : '35x22mm',
            {
                barcodes,
                is_show_product_name,
                is_show_price,
                size,
            },
            `${fileName}`,
            {
                width: size == 1 ? '40mm' : '70mm',
                height: size == 1 ? '30mm' : '22mm',
            },
        );

        return new ServiceResponse(true, '', { path: config.api_print + `/barcode/${fileName}.pdf` });
    } catch (e) {
        logger.error(e, { function: 'orderService.printBarcode' });
        return new ServiceResponse(false, e.message || e);
    }
};

const exportExcel = async (queryParams = {}) => {
    queryParams.itemsPerPage = API_CONST.MAX_EXPORT_EXCEL;
    queryParams.is_active = 2;
    const serviceRes = await getListProduct(queryParams);
    const { data } = serviceRes.getData();

    if (!data || data.length === 0) {
        return new ServiceResponse(false, 'Không có dữ liệu để xuất file excel.');
    }

    // Create a new instance of a Workbook class
    const wb = new xl.Workbook();
    // Add Worksheets to the workbook
    const ws = wb.addWorksheet('List Product', {});
    // Set width
    ws.column(1).setWidth(15);
    ws.column(2).setWidth(40);
    ws.column(3).setWidth(40);
    // ws.column(4).setWidth(50);
    ws.column(4).setWidth(40);
    ws.column(5).setWidth(50);
    // ws.column(7).setWidth(50);
    ws.column(6).setWidth(50);

    const header = {
        product_code: 'Mã sản phẩm',
        product_name: 'Tên sản phẩm',
        category_name: 'Ngành hàng',
        manufacture_name: 'Hãng sản xuất',
        created_date: 'Ngày tạo',
        is_active: 'Kích hoạt',
    };
    data.unshift(header);

    data.forEach((item, index) => {
        let indexRow = index + 1;
        let indexCol = 0;
        ws.cell(indexRow, ++indexCol).string((item.product_code || '').toString());
        ws.cell(indexRow, ++indexCol).string((item.product_name || '').toString());
        ws.cell(indexRow, ++indexCol).string((item.category_name || '').toString());
        ws.cell(indexRow, ++indexCol).string((item.manufacture_name || '').toString());
        ws.cell(indexRow, ++indexCol).string((item.created_date || '').toString());
        ws.cell(indexRow, ++indexCol).string(index === 0 ? item.is_active : item.is_active ? 'Có' : 'Không');
    });

    return new ServiceResponse(true, '', wb);
};

const downloadExcel = async () => {
    try {
        //Lay all Data khai bao
        const pool = await mssql.pool;
        const res = await pool.request().execute('MD_PRODUCT_GetDataImportExcel_AdminWeb');
        let listProductCategory = res.recordsets[0] || [];
        let listProductModel = res.recordsets[1] || [];
        let listUnit = res.recordsets[2] || [];
        let listManufacturer = res.recordsets[3] || [];
        let listStock = res.recordsets[4] || [];
        let listOrigin = res.recordsets[5] || [];
        let listAttribute = res.recordsets[6] || [];
        let listStore = res.recordsets[7] || [];

        const wb = new xl.Workbook();
        const headerStyle = wb.createStyle({
            font: {
                bold: true,
                color: '262626',
            },
            alignment: {
                horizontal: 'center',
                vertical: 'center',
            },
            border: {
                left: {
                    style: 'thin',
                    color: 'black',
                },
                right: {
                    style: 'thin',
                    color: 'black',
                },
                top: {
                    style: 'thin',
                    color: 'black',
                },
                bottom: {
                    style: 'thin',
                    color: 'black',
                },
            },
            fill: {
                type: 'pattern',
                patternType: 'solid',
                bgColor: '#e4e5e6',
                fgColor: '#e4e5e6',
            },
        });

        let styleBorder = {
            border: {
                left: {
                    style: 'thin',
                    color: 'black',
                },
                right: {
                    style: 'thin',
                    color: 'black',
                },
                top: {
                    style: 'thin',
                    color: 'black',
                },
                bottom: {
                    style: 'thin',
                    color: 'black',
                },
            },
        };

        //Sheet San pham
        const ws_product = wb.addWorksheet('Danh sách sản phẩm');
        for (let i = 1; i <= 38; i++) {
            ws_product.column(i).setWidth(i == 1 ? 10 : 20);
            ws_product.cell(2, i).string('').style(styleBorder);
        }
        ws_product.cell(1, 1).string('STT').style(headerStyle);
        ws_product.cell(1, 2).string('Mã sản phẩm *').style(headerStyle);
        ws_product.cell(1, 3).string('Tên sản phẩm *').style(headerStyle);
        ws_product.cell(1, 4).string('Tên hiển thị *').style(headerStyle);
        ws_product.cell(1, 5).string('Mã ngành hàng *').style(headerStyle);
        ws_product.cell(1, 6).string('Mã model sản phẩm *').style(headerStyle);
        ws_product.cell(1, 7).string('Mô tả').style(headerStyle);
        ws_product.cell(1, 8).string('Hãng *').style(headerStyle);
        ws_product.cell(1, 9).string('Xuất xứ *').style(headerStyle);
        ws_product.cell(1, 10).string('Đơn vị tính *').style(headerStyle);
        ws_product.cell(1, 11).string('Thuộc tính 1 *').style(headerStyle);
        ws_product.cell(1, 12).string('Giá trị thuộc tính 1 *').style(headerStyle);
        ws_product.cell(1, 13).string('Đơn vị tính thuộc tính 1').style(headerStyle);
        ws_product.cell(1, 14).string('Thuộc tính 2').style(headerStyle);
        ws_product.cell(1, 15).string('Giá trị thuộc tính 2').style(headerStyle);
        ws_product.cell(1, 16).string('Đơn vị tính thuộc tính 2').style(headerStyle);
        ws_product.cell(1, 17).string('Thuộc tính 3').style(headerStyle);
        ws_product.cell(1, 18).string('Giá trị thuộc tính 3').style(headerStyle);
        ws_product.cell(1, 19).string('Đơn vị tính thuộc tính 3').style(headerStyle);
        ws_product.cell(1, 20).string('Thuộc tính 4').style(headerStyle);
        ws_product.cell(1, 21).string('Giá trị thuộc tính 4').style(headerStyle);
        ws_product.cell(1, 22).string('Đơn vị tính thuộc tính 4').style(headerStyle);
        ws_product.cell(1, 23).string('Thuộc tính 5').style(headerStyle);
        ws_product.cell(1, 24).string('Giá trị thuộc tính 5').style(headerStyle);
        ws_product.cell(1, 25).string('Đơn vị tính thuộc tính 5').style(headerStyle);
        ws_product.cell(1, 26).string('Thuộc tính 6').style(headerStyle);
        ws_product.cell(1, 27).string('Giá trị thuộc tính 6').style(headerStyle);
        ws_product.cell(1, 28).string('Đơn vị tính thuộc tính 6').style(headerStyle);
        ws_product.cell(1, 29).string('Kích hoạt *').style(headerStyle);
        ws_product.cell(1, 30).string('Cửa hàng').style(headerStyle);
        ws_product.cell(1, 31).string('Mã kho sản phẩm').style(headerStyle);
        ws_product.cell(1, 32).string('Tên kho sản phẩm').style(headerStyle);
        ws_product.cell(1, 33).string('Số lượng tồn dưới').style(headerStyle);
        ws_product.cell(1, 34).string('Số lượng tồn trên').style(headerStyle);
        ws_product.cell(1, 35).string('Thời gian lưu kho').style(headerStyle);
        ws_product.cell(1, 36).string('Đơn vị tính').style(headerStyle);

        //San pham Vi du
        ws_product.cell(2, 1).string('1').style(styleBorder);
        ws_product.cell(2, 2).string('SP0001').style(styleBorder);
        ws_product.cell(2, 3).string('Sản phẩm A').style(styleBorder);
        ws_product.cell(2, 4).string('Sản phẩm A hiển thị').style(styleBorder);
        ws_product.cell(2, 5).string('1').style(styleBorder);
        ws_product.cell(2, 6).string('MD0001').style(styleBorder);
        ws_product.cell(2, 7).string('Mô tả sản phẩm').style(styleBorder);
        ws_product.cell(2, 8).string('Hãng A').style(styleBorder);
        ws_product.cell(2, 9).string('Xuất xứ A').style(styleBorder);
        ws_product.cell(2, 10).string('chiếc').style(styleBorder);
        ws_product.cell(2, 11).string('Kích thước').style(styleBorder);
        ws_product.cell(2, 12).string('7m').style(styleBorder);
        ws_product.cell(2, 13).string('m').style(styleBorder);
        ws_product.cell(2, 14).string('').style(styleBorder);
        ws_product.cell(2, 15).string('').style(styleBorder);
        ws_product.cell(2, 16).string('').style(styleBorder);
        ws_product.cell(2, 17).string('').style(styleBorder);
        ws_product.cell(2, 18).string('').style(styleBorder);
        ws_product.cell(2, 19).string('').style(styleBorder);
        ws_product.cell(2, 20).string('').style(styleBorder);
        ws_product.cell(2, 21).string('').style(styleBorder);
        ws_product.cell(2, 22).string('').style(styleBorder);
        ws_product.cell(2, 23).string('').style(styleBorder);
        ws_product.cell(2, 24).string('').style(styleBorder);
        ws_product.cell(2, 25).string('').style(styleBorder);
        ws_product.cell(2, 26).string('').style(styleBorder);
        ws_product.cell(2, 27).string('').style(styleBorder);
        ws_product.cell(2, 28).string('').style(styleBorder);
        ws_product.cell(2, 29).string('Có').style(styleBorder);
        ws_product.cell(2, 30).string('Cửa hàng A').style(styleBorder);
        ws_product.cell(2, 31).string('MaKho0001').style(styleBorder);
        ws_product.cell(2, 32).string('Kho A').style(styleBorder);
        ws_product.cell(2, 33).string('10').style(styleBorder);
        ws_product.cell(2, 34).string('50').style(styleBorder);
        ws_product.cell(2, 35).string('20').style(styleBorder);
        ws_product.cell(2, 36).string('m').style(styleBorder);

        //Sheet Luu y
        let style1 = {
            alignment: {
                wrapText: true,
                horizontal: 'left',
                vertical: 'center',
            },
            border: {
                // §18.8.4 border (Border)
                left: {
                    style: 'thin',
                    color: 'black',
                },
                right: {
                    style: 'thin',
                    color: 'black',
                },
                top: {
                    style: 'thin',
                    color: 'black',
                },
                bottom: {
                    style: 'thin',
                    color: 'black',
                },
            },
        };

        const ws_n = wb.addWorksheet('Lưu ý');
        ws_n.column(1).setWidth(30);
        ws_n.column(2).setWidth(80);

        ws_n.cell(1, 1).string('Cột').style(headerStyle);
        ws_n.cell(1, 2).string('Lưu ý').style(headerStyle);

        ws_n.cell(2, 1).string('Mã sản phẩm').style(styleBorder);
        ws_n.cell(2, 2).string('Mã SP do KH tự định dạng.').style(styleBorder);

        ws_n.cell(3, 1).string('Ảnh đại diện').style(styleBorder);
        ws_n.cell(3, 2)
            .string(
                `Có 2 lựa chọn import:\n1. KH gửi drive ảnh => BW hỗ trợ KH thêm ảnh vào SP.\n2. KH tự chỉnh sửa SP sau khi đã import vào hệ thống.\n`,
            )
            .style(style1);

        ws_n.cell(4, 1).string('Kích hoạt').style(style1);
        ws_n.cell(4, 2).string('Nhập có/không hoặc 1/0').style(styleBorder);

        //Sheet Nganh hang
        const ws_category = wb.addWorksheet('Danh sách Ngành hàng', {});
        ws_category.column(1).setWidth(10);
        ws_category.column(2).setWidth(20);
        ws_category.column(3).setWidth(30);

        listProductCategory.unshift({
            no: 'STT',
            product_category_id: 'Mã Ngành hàng',
            product_category_name: 'Tên Ngành hàng',
        });
        listProductCategory.forEach((item, index) => {
            let indexRow = index + 1;
            ws_category
                .cell(indexRow, 1)
                .string((item.no || index).toString())
                .style(index == 0 ? headerStyle : styleBorder)
                .style({
                    alignment: {
                        horizontal: 'center',
                        vertical: 'center',
                    },
                });
            ws_category
                .cell(indexRow, 2)
                .string((item.product_category_id || '').toString())
                .style(index == 0 ? headerStyle : styleBorder);
            ws_category
                .cell(indexRow, 3)
                .string((item.product_category_name || '').toString())
                .style(index == 0 ? headerStyle : styleBorder);
        });

        //Sheet Model
        const ws_model = wb.addWorksheet('Danh sách Model', {});
        ws_model.column(1).setWidth(10);
        ws_model.column(2).setWidth(20);
        ws_model.column(3).setWidth(30);

        listProductModel.unshift({
            no: 'STT',
            model_code: 'Mã Model',
            model_name: 'Tên Model',
        });
        listProductModel.forEach((item, index) => {
            let indexRow = index + 1;
            ws_model
                .cell(indexRow, 1)
                .string((item.no || index).toString())
                .style(index == 0 ? headerStyle : styleBorder)
                .style({
                    alignment: {
                        horizontal: 'center',
                        vertical: 'center',
                    },
                });
            ws_model
                .cell(indexRow, 2)
                .string((item.model_code || '').toString())
                .style(index == 0 ? headerStyle : styleBorder);
            ws_model
                .cell(indexRow, 3)
                .string((item.model_name || '').toString())
                .style(index == 0 ? headerStyle : styleBorder);
        });

        //Sheet Don vi Tinh
        const ws_unit = wb.addWorksheet('Danh sách Đơn vị tính', {});
        ws_unit.column(1).setWidth(10);
        ws_unit.column(2).setWidth(30);

        listUnit.unshift({
            no: 'STT',
            unit_name: 'Tên Đơn vị tính',
        });
        listUnit.forEach((item, index) => {
            let indexRow = index + 1;
            ws_unit
                .cell(indexRow, 1)
                .string((item.no || index).toString())
                .style(index == 0 ? headerStyle : styleBorder)
                .style({
                    alignment: {
                        horizontal: 'center',
                        vertical: 'center',
                    },
                });
            ws_unit
                .cell(indexRow, 2)
                .string((item.unit_name || '').toString())
                .style(index == 0 ? headerStyle : styleBorder);
        });

        //Sheet Thuong Hieu
        const ws_manufacturer = wb.addWorksheet('Danh sách hãng', {});
        ws_manufacturer.column(1).setWidth(10);
        ws_manufacturer.column(2).setWidth(30);

        listManufacturer.unshift({
            no: 'STT',
            manufacturer_name: 'Tên hãng',
        });
        listManufacturer.forEach((item, index) => {
            let indexRow = index + 1;
            ws_manufacturer
                .cell(indexRow, 1)
                .string((item.no || index).toString())
                .style(index == 0 ? headerStyle : styleBorder)
                .style({
                    alignment: {
                        horizontal: 'center',
                        vertical: 'center',
                    },
                });
            ws_manufacturer
                .cell(indexRow, 2)
                .string((item.manufacturer_name || '').toString())
                .style(index == 0 ? headerStyle : styleBorder);
        });

        //Sheet Kho san pham
        const ws_stock = wb.addWorksheet('Danh sách Kho', {});
        ws_stock.column(1).setWidth(10);
        ws_stock.column(2).setWidth(20);
        ws_stock.column(3).setWidth(30);

        listStock.unshift({
            no: 'STT',
            stock_code: 'Mã Kho',
            stock_name: 'Tên Kho',
        });
        listStock.forEach((item, index) => {
            let indexRow = index + 1;
            ws_stock
                .cell(indexRow, 1)
                .string((item.no || index).toString())
                .style(index == 0 ? headerStyle : styleBorder)
                .style({
                    alignment: {
                        horizontal: 'center',
                        vertical: 'center',
                    },
                });
            ws_stock
                .cell(indexRow, 2)
                .string((item.stock_code || '').toString())
                .style(index == 0 ? headerStyle : styleBorder);
            ws_stock
                .cell(indexRow, 3)
                .string((item.stock_name || '').toString())
                .style(index == 0 ? headerStyle : styleBorder);
        });

        //Sheet Xuat xu san pham
        const ws_status = wb.addWorksheet('Danh sách xuất xứ', {});
        ws_status.column(1).setWidth(10);
        ws_status.column(2).setWidth(30);

        listOrigin.unshift({
            no: 'STT',
            origin_name: 'Tên',
        });
        listOrigin.forEach((item, index) => {
            let indexRow = index + 1;
            ws_status
                .cell(indexRow, 1)
                .string((item.no || index).toString())
                .style(index == 0 ? headerStyle : styleBorder)
                .style({
                    alignment: {
                        horizontal: 'center',
                        vertical: 'center',
                    },
                });
            ws_status
                .cell(indexRow, 2)
                .string((item.origin_name || '').toString())
                .style(index == 0 ? headerStyle : styleBorder);
        });

        //Sheet Thuoc tinh
        const ws_attribute = wb.addWorksheet('Danh sách Thuộc tính', {});
        ws_attribute.column(1).setWidth(10);
        ws_attribute.column(2).setWidth(30);
        ws_attribute.column(3).setWidth(20);

        listAttribute.unshift({
            no: 'STT',
            product_attribute_name: 'Tên Thuộc tính',
            attribute_values: 'Giá trị Thuộc tính',
        });
        listAttribute.forEach((item, index) => {
            let indexRow = index + 1;
            ws_attribute
                .cell(indexRow, 1)
                .string((item.no || index).toString())
                .style(index == 0 ? headerStyle : styleBorder)
                .style({
                    alignment: {
                        horizontal: 'center',
                        vertical: 'center',
                    },
                });
            ws_attribute
                .cell(indexRow, 2)
                .string((item.product_attribute_name || '').toString())
                .style(index == 0 ? headerStyle : styleBorder);
            ws_attribute
                .cell(indexRow, 3)
                .string((item.attribute_values || '').toString())
                .style(index == 0 ? headerStyle : styleBorder);
        });

        //Sheet Cua hang
        const ws_store = wb.addWorksheet('Danh sách cửa hàng', {});
        ws_store.column(1).setWidth(10);
        ws_store.column(2).setWidth(30);

        listStore.unshift({
            no: 'STT',
            store_name: 'Cửa hàng',
        });
        listStore.forEach((item, index) => {
            let indexRow = index + 1;
            ws_store
                .cell(indexRow, 1)
                .string((item.no || index).toString())
                .style(index == 0 ? headerStyle : styleBorder)
                .style({
                    alignment: {
                        horizontal: 'center',
                        vertical: 'center',
                    },
                });
            ws_store
                .cell(indexRow, 2)
                .string((item.store_name || '').toString())
                .style(index == 0 ? headerStyle : styleBorder);
        });

        return new ServiceResponse(true, '', wb);
    } catch (error) {
        logger.error(e, {
            function: 'productService.downloadExcel',
        });
        return new ServiceResponse(false, e.message);
    }
};

const importExcel = async (body, file, auth) => {
    try {
        const pool = await mssql.pool;
        const res = await pool.request().execute('MD_PRODUCT_GetDataImportExcel_AdminWeb');
        let listProductCategory = res.recordsets[0] || [];
        let listProductModel = res.recordsets[1] || [];
        let listUnit = res.recordsets[2] || [];
        let listManufacturer = res.recordsets[3] || [];
        let listStock = res.recordsets[4] || [];
        let listOrigin = res.recordsets[5] || [];
        let listAttribute = res.recordsets[6] || [];
        let listStore = res.recordsets[7] || [];
        const rows = await readXlsxFile(file.buffer);

        // const columns = {
        //     stt: 'STT',
        //     product_code: 'Mã sản phẩm *',
        //     product_name: 'Tên sản phẩm *',
        //     product_display_name: 'Tên hiển thị *',
        //     category_code: 'Mã ngành hàng *',
        //     model_code: 'Mã model sản phẩm *',
        //     description: 'Mô tả',
        //     manufacturer: 'Hãng *',
        //     origin_name: 'Xuất xứ *',
        //     unit_name: 'Đơn vị tính *',
        //     attribute_name_1: 'Thuộc tính 1 *',
        //     attribute_value_1: 'Giá trị thuộc tính 1 *',
        //     attribute_unit_1: 'Đơn vị tính thuộc tính 1',
        //     attribute_name_2: 'Thuộc tính 2',
        //     attribute_value_2: 'Giá trị thuộc tính 2',
        //     attribute_unit_2: 'Đơn vị tính thuộc tính 2',
        //     attribute_name_3: 'Thuộc tính 3',
        //     attribute_value_3: 'Giá trị thuộc tính 3',
        //     attribute_unit_3: 'Đơn vị tính thuộc tính 3',
        //     attribute_name_4: 'Thuộc tính 4',
        //     attribute_value_4: 'Giá trị thuộc tính 4',
        //     attribute_unit_4: 'Đơn vị tính thuộc tính 4',
        //     attribute_name_5: 'Thuộc tính 5',
        //     attribute_value_5: 'Giá trị thuộc tính 5',
        //     attribute_unit_5: 'Đơn vị tính thuộc tính 5',
        //     attribute_name_6: 'Thuộc tính 6',
        //     attribute_value_6: 'Giá trị thuộc tính 6',
        //     attribute_unit_6: 'Đơn vị tính thuộc tính 6',
        //     is_active: 'Kích hoạt *',
        //     store: 'Cửa hàng',
        //     stock_code: 'Mã kho sản phẩm',
        //     stock_name: 'Tên kho sản phẩm',
        //     min_inventory: 'Số lượng tồn dưới',
        //     max_inventory: 'Số lượng tồn trên',
        //     stock_duration: 'Thời gian lưu kho',
        //     stock_unit: 'Đơn vị tính',
        // };

        // let data = excelHelper.getValueExcel(rows, columns);
        const auth_name = apiHelper.getValueFromObject(auth, 'user_name', 'administrator');
        let import_data = [];
        let import_errors = [];
        let import_total = 0;

        for (let i in rows) {
            // Bỏ qua dòng tiêu đề đầu
            if (i > 0 && rows[i]) {
                import_total += 1;

                //STT
                let stt = rows[i][0] || '';
                let product_code = `${rows[i][1] || ''}`.trim();
                let product_name = `${rows[i][2] || ''}`.trim();
                let product_display_name = `${rows[i][3] || ''}`.trim();
                let category_code = `${rows[i][4] || ''}`.trim();
                let model_code = `${rows[i][5] || ''}`.trim();
                let description = `${rows[i][6] || ''}`.trim();
                let manufacturer = `${rows[i][7] || ''}`.trim();
                let origin_name = `${rows[i][8] || ''}`.trim();
                let unit_name = `${rows[i][9] || ''}`.trim();

                let attribute_name_1 = `${rows[i][10] || ''}`.trim();
                let attribute_value_1 = `${rows[i][11] || ''}`.trim();
                let attribute_unit_1 = `${rows[i][12] || ''}`.trim();

                let attribute_name_2 = `${rows[i][13] || ''}`.trim();
                let attribute_value_2 = `${rows[i][14] || ''}`.trim();
                let attribute_unit_2 = `${rows[i][15] || ''}`.trim();

                let attribute_name_3 = `${rows[i][16] || ''}`.trim();
                let attribute_value_3 = `${rows[i][17] || ''}`.trim();
                let attribute_unit_3 = `${rows[i][18] || ''}`.trim();

                let attribute_name_4 = `${rows[i][19] || ''}`.trim();
                let attribute_value_4 = `${rows[i][20] || ''}`.trim();
                let attribute_unit_4 = `${rows[i][21] || ''}`.trim();

                let attribute_name_5 = `${rows[i][22] || ''}`.trim();
                let attribute_value_5 = `${rows[i][23] || ''}`.trim();
                let attribute_unit_5 = `${rows[i][24] || ''}`.trim();

                let attribute_name_6 = `${rows[i][25] || ''}`.trim();
                let attribute_value_6 = `${rows[i][26] || ''}`.trim();
                let attribute_unit_6 = `${rows[i][27] || ''}`.trim();

                let is_active = '';
                if (rows[i][28] === null || rows[i][28] === '') {
                } else is_active = `${rows[i][28]}`.trim();

                let store = `${rows[i][29] || ''}`.trim();
                let stock_code = `${rows[i][30] || ''}`.trim();
                let stock_name = `${rows[i][31] || ''}`.trim();
                let min_inventory = `${rows[i][32] || ''}`.trim();
                let max_inventory = `${rows[i][33] || ''}`.trim();
                let stock_duration = `${rows[i][34] || ''}`.trim();
                let stock_unit = `${rows[i][35] || ''}`.trim();

                let product_import = {
                    stt,
                    product_code,
                    product_name,
                    product_display_name,
                    category_code,
                    model_code,
                    description,
                    manufacturer,
                    origin_name,
                    unit_name,
                    attribute_name_1,
                    attribute_value_1,
                    attribute_unit_1,
                    attribute_name_2,
                    attribute_value_2,
                    attribute_unit_2,
                    attribute_name_3,
                    attribute_value_3,
                    attribute_unit_3,
                    attribute_name_4,
                    attribute_value_4,
                    attribute_unit_4,
                    attribute_name_5,
                    attribute_value_5,
                    attribute_unit_5,
                    attribute_name_6,
                    attribute_value_6,
                    attribute_unit_6,
                    is_active,
                    store,
                    stock_code,
                    stock_name,
                    min_inventory,
                    max_inventory,
                    stock_duration,
                    stock_unit,
                };

                let { errmsg = [], product = {} } = await checkProductImport(
                    product_import,
                    listProductCategory,
                    listProductModel,
                    listUnit,
                    listManufacturer,
                    listStock,
                    listOrigin,
                    listAttribute,
                    listStore,
                    pool,
                );

                if (errmsg && errmsg.length > 0) {
                    import_errors.push({
                        product,
                        errmsg,
                        i,
                    });
                } else {
                    //Inser Product
                    try {
                        let productId = await importProduct({ ...product, auth_name }, pool);
                        import_data.push(productId);
                    } catch (error) {
                        import_errors.push({
                            product,
                            errmsg: [error.message],
                            i,
                        });
                    }
                }
            }

            if (rows.length < 2) {
                return new ServiceResponse(false, 'Tập tin chưa có dữ liệu!', null);
            }
        }

        return new ServiceResponse(true, '', {
            import_data,
            import_total,
            import_errors,
        });
    } catch (error) {
        logger.error(error, {
            function: 'ProductService.importExcel',
        });
        return new ServiceResponse(false, e.message);
    }
};

const checkProductImport = async (
    product,
    listProductCategory = [],
    listProductModel = [],
    listUnit = [],
    listManufacturer = [],
    listStock = [],
    listOrigin = [],
    listAttribute = [],
    listStore = [],
    pool = null,
) => {
    let errmsg = [];
    try {
        if (!pool) {
            pool = await mssql.pool;
        }

        let arrVal = ['co', 'khong', '1', '0'];

        let {
            stt = null,
            product_code = null,
            product_name = null,
            product_display_name = null,
            category_code = null,
            model_code = null,
            description = null,
            manufacturer = null,
            origin_name = null,
            unit_name = null,

            attribute_name_1 = null,
            attribute_value_1 = null,
            attribute_unit_1 = null,

            attribute_name_2 = null,
            attribute_value_2 = null,
            attribute_unit_2 = null,

            attribute_name_3 = null,
            attribute_value_3 = null,
            attribute_unit_3 = null,

            attribute_name_4 = null,
            attribute_value_4 = null,
            attribute_unit_4 = null,

            attribute_name_5 = null,
            attribute_value_5 = null,
            attribute_unit_5 = null,

            attribute_name_6 = null,
            attribute_value_6 = null,
            attribute_unit_6 = null,

            is_active = null,

            store = null,
            stock_code = null,
            stock_name = null,
            min_inventory = null,
            max_inventory = null,
            stock_duration = null,
            stock_unit = null,
        } = product || {};

        //Validate bat buoc nhap
        if (!product_code) {
            errmsg.push('Mã sản phẩm là bắt buộc.');
        }
        if (!product_name) {
            errmsg.push('Tên sản phẩm là bắt buộc.');
        }
        if (!product_display_name) {
            errmsg.push('Tên hiển thị là bắt buộc.');
        }
        if (!category_code) {
            errmsg.push('Mã ngành hành là bắt buộc.');
        }
        if (!model_code) {
            errmsg.push('Mã model sản phẩm là bắt buộc.');
        }
        if (!manufacturer) {
            errmsg.push('Hãng là bắt buộc.');
        }
        if (!origin_name) {
            errmsg.push('Xuất xứ là bắt buộc.');
        }
        if (!unit_name) {
            errmsg.push('Đơn vị tính là bắt buộc.');
        }

        if (
            !attribute_name_1 &&
            !attribute_name_2 &&
            !attribute_name_3 &&
            !attribute_name_4 &&
            !attribute_name_5 &&
            !attribute_name_6 &&
            !attribute_value_1 &&
            !attribute_value_2 &&
            !attribute_value_3 &&
            !attribute_value_4 &&
            !attribute_value_5 &&
            !attribute_value_6
        ) {
            errmsg.push('Thuộc tính sản phẩm phải có ít nhất 1 thuộc tính và 1 giá trị thuộc tính.');
        } else {
            if ((attribute_name_1 && !attribute_value_1) || (!attribute_name_1 && attribute_value_1)) {
                errmsg.push('Thuộc tính 1 và giá trị thuộc tính 1 là bắt buộc.');
            }
            if ((attribute_name_2 && !attribute_value_2) || (!attribute_name_2 && attribute_value_2)) {
                errmsg.push('Thuộc tính 2 và giá trị thuộc tính 2 là bắt buộc.');
            }
            if ((attribute_name_3 && !attribute_value_3) || (!attribute_name_3 && attribute_value_3)) {
                errmsg.push('Thuộc tính 3 và giá trị thuộc tính 3 là bắt buộc.');
            }
            if ((attribute_name_4 && !attribute_value_4) || (!attribute_name_4 && attribute_value_4)) {
                errmsg.push('Thuộc tính 4 và giá trị thuộc tính 4 là bắt buộc.');
            }
            if ((attribute_name_5 && !attribute_value_5) || (!attribute_name_5 && attribute_value_5)) {
                errmsg.push('Thuộc tính 5 và giá trị thuộc tính 5 là bắt buộc.');
            }
            if ((attribute_name_6 && !attribute_value_6) || (!attribute_name_6 && attribute_value_6)) {
                errmsg.push('Thuộc tính 6 và giá trị thuộc tính 6 là bắt buộc.');
            }
        }

        if (!is_active) {
            errmsg.push('Kích hoạt là bắt buộc.');
        } else {
            if (!arrVal.includes(changeToSlug(is_active))) {
                errmsg.push('Kích hoạt vui lòng nhập có/không hoặc 1/0.');
            }
        }

        //Validate dữ liệu
        //Check trùng sản phẩm
        if (product_code) {
            const res = await pool
                .request()
                .input('PRODUCTCODE', product_code)
                .execute('MD_PRODUCT_CheckProductCode_AdminWeb');
            let { check_code = 0 } = res.recordset[0] || {};
            if (check_code > 0) {
                errmsg.push('Mã Sản phẩm đã tồn tại.');
            }
        }

        //Check mã ngành hàng
        if (category_code) {
            let findCategory = listProductCategory.find((p) => p.product_category_id == category_code) || null;
            if (!findCategory) {
                errmsg.push('Mã ngành hàng không tồn tại.');
            } else {
                product.product_category_id = findCategory.product_category_id;
            }
        }

        //Check Model sản phẩm
        if (model_code) {
            let findModel = listProductModel.find((p) => p.model_code == model_code) || null;
            if (!findModel) {
                errmsg.push('Mã Model sản phẩm không tồn tại.');
            } else {
                product.model_id = findModel.model_id;
            }
        }

        //Check hãng
        if (manufacturer) {
            let findManufacturer =
                listManufacturer.find((p) => p.manufacturer_name_slug == changeToSlug(manufacturer)) || null;
            if (!findManufacturer) {
                errmsg.push('Hãng không tồn tại.');
            } else {
                product.manufacturer_id = findManufacturer.manufacturer_id;
            }
        }

        //Check đơn vị tính
        if (unit_name) {
            let findUnit = listUnit.find((p) => p.unit_name_slug == changeToSlug(unit_name)) || null;
            if (!findUnit) {
                errmsg.push('Đơn vị tính không tồn tại.');
            } else {
                product.unit_id = findUnit.unit_id;
            }
        }

        //Find Origin Product
        if (origin_name) {
            let _findOrigin = listOrigin.find((p) => p.origin_name_slug == changeToSlug(origin_name));

            if (_findOrigin) {
                product.origin_id = _findOrigin.origin_id;
            } else {
                errmsg.push('Xuất xứ không tồn tại.');
            }
        }

        //Find Store
        if (store) {
            let _findStore = listStore.find((p) => p.store_name == changeToSlug(store));
            if (_findStore) {
                product.store_id = _findStore.store_id;
            } else {
                errmsg.push('Cửa hàng không tồn tại.');
            }
        }

        if (attribute_name_1 && attribute_value_1) {
            let findAttr1 =
                listAttribute.find(
                    (p) =>
                        p.product_attribute_name_slug == changeToSlug(attribute_name_1) &&
                        p.attribute_values_slug == changeToSlug(attribute_value_1),
                ) || null;
            if (!findAttr1) {
                errmsg.push('Thuộc tính 1 không tồn tại.');
            } else {
                product.product_attribute_id_1 = findAttr1.product_attribute_id;
                product.attribute_value_id_1 = findAttr1.attribute_values_id;
            }
        }

        if (attribute_name_2 && attribute_value_2) {
            let findAttr2 =
                listAttribute.find(
                    (p) =>
                        p.product_attribute_name_slug == changeToSlug(attribute_name_2) &&
                        p.attribute_values_slug == changeToSlug(attribute_value_2),
                ) || null;
            if (!findAttr2) {
                errmsg.push('Thuộc tính 2 không tồn tại.');
            } else {
                product.product_attribute_id_2 = findAttr2.product_attribute_id;
                product.attribute_value_id_2 = findAttr2.attribute_values_id;
            }
        }

        if (attribute_name_3 && attribute_value_3) {
            let findAttr3 =
                listAttribute.find(
                    (p) =>
                        p.product_attribute_name_slug == changeToSlug(attribute_name_3) &&
                        p.attribute_values_slug == changeToSlug(attribute_value_3),
                ) || null;
            if (!findAttr3) {
                errmsg.push('Thuộc tính 3 không tồn tại.');
            } else {
                product.product_attribute_id_3 = findAttr3.product_attribute_id;
                product.attribute_value_id_3 = findAttr3.attribute_values_id;
            }
        }

        if (attribute_name_4 && attribute_value_4) {
            let findAttr4 =
                listAttribute.find(
                    (p) =>
                        p.product_attribute_name_slug == changeToSlug(attribute_name_4) &&
                        p.attribute_values_slug == changeToSlug(attribute_value_4),
                ) || null;
            if (!findAttr4) {
                errmsg.push('Thuộc tính 4 không tồn tại.');
            } else {
                product.product_attribute_id_4 = findAttr4.product_attribute_id;
                product.attribute_value_id_4 = findAttr4.attribute_values_id;
            }
        }

        if (attribute_name_5 && attribute_value_5) {
            let findAttr5 =
                listAttribute.find(
                    (p) =>
                        p.product_attribute_name_slug == changeToSlug(attribute_name_5) &&
                        p.attribute_values_slug == changeToSlug(attribute_value_5),
                ) || null;
            if (!findAttr5) {
                errmsg.push('Thuộc tính 5 không tồn tại.');
            } else {
                product.product_attribute_id_5 = findAttr5.product_attribute_id;
                product.attribute_value_id_5 = findAttr5.attribute_values_id;
            }
        }

        if (attribute_name_6 && attribute_value_6) {
            let findAttr6 =
                listAttribute.find(
                    (p) =>
                        p.product_attribute_name_slug == changeToSlug(attribute_name_6) &&
                        p.attribute_values_slug == changeToSlug(attribute_value_6),
                ) || null;
            if (!findAttr6) {
                errmsg.push('Thuộc tính 6 không tồn tại.');
            } else {
                product.product_attribute_id_6 = findAttr6.product_attribute_id;
                product.attribute_value_id_6 = findAttr6.attribute_values_id;
            }
        }

        if (is_active) {
            if (isNaN(is_active)) {
                product.is_active_value = changeToSlug(is_active) == 'co' ? 1 : 0;
            } else {
                product.is_active_value = is_active == 1 ? 1 : 0;
            }
        }

        //Check Kho
        if (stock_code) {
            let findStock = listStock.find((p) => p.stock_code == stock_code) || null;
            if (!findStock) {
                errmsg.push('Mã kho không tồn tại.');
            } else {
                product.stock_id = findStock.stock_id;
            }
        }

        if (stock_unit) {
            let findUnitStock = listUnit.find((p) => p.unit_name_slug == changeToSlug(stock_unit)) || null;
            if (!findUnitStock) {
                errmsg.push('Đơn vị tính (kho) không tồn tại.');
            } else {
                product.stock_unit_id = findUnitStock.unit_id;
            }
        }
    } catch (error) {
        logger.error(error, {
            function: 'product.service.checkProductImport',
        });
        errmsg.push(error.message);
    }
    return { errmsg, product };
};

const importProduct = async (bodyParams = {}, pool) => {
    const transaction = await new sql.Transaction(pool);
    try {
        await transaction.begin();

        let auth_name = apiHelper.getValueFromObject(bodyParams, 'auth_name', 'administrator');

        //Insert Product
        const reqProduct = new sql.Request(transaction);
        const resProduct = await reqProduct
            .input('PRODUCTID', null)
            .input('PRODUCTCATEGORYID', apiHelper.getValueFromObject(bodyParams, 'product_category_id'))
            .input('PRODUCTCODE', apiHelper.getValueFromObject(bodyParams, 'product_code'))
            .input('PRODUCTNAME', apiHelper.getValueFromObject(bodyParams, 'product_name'))
            .input('PRODUCTDISPLAYNAME', apiHelper.getValueFromObject(bodyParams, 'product_display_name'))
            .input('ORIGINID', apiHelper.getValueFromObject(bodyParams, 'origin_id'))
            .input('MANUFACTURERID', apiHelper.getValueFromObject(bodyParams, 'manufacturer_id'))
            .input('UNITID', apiHelper.getValueFromObject(bodyParams, 'unit_id'))
            .input('MODELID', apiHelper.getValueFromObject(bodyParams, 'model_id'))
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active_value'))
            .input('DESCRIPTIONS', apiHelper.getValueFromObject(bodyParams, 'description'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('MD_PRODUCT_CreateOrUpdate_AdminWeb');

        const { RESULT: productId = 0 } = resProduct.recordset[0] || {};

        if (productId <= 0) {
            await transaction.rollback();
            throw new Error('Thêm mới sản phẩm thất bại ');
        }

        //Thuoc tinh san pham
        const reqProductAttribute = new sql.Request(transaction);
        let attribute_value_id_1 = apiHelper.getValueFromObject(bodyParams, 'attribute_value_id_1', null);
        let product_attribute_id_1 = apiHelper.getValueFromObject(bodyParams, 'product_attribute_id_1', null);
        let attribute_value_1 = apiHelper.getValueFromObject(bodyParams, 'attribute_value_1', null);
        if (attribute_value_id_1 && product_attribute_id_1 && attribute_value_1) {
            await reqProductAttribute
                .input('PRODUCTID', productId)
                .input('ATTRIBUTEVALUESID', attribute_value_id_1)
                .input('PRODUCTATTRIBUTEID', product_attribute_id_1)
                .input('CREATEDUSER', auth_name)
                .execute('PRO_PRODUCTATTRIBUTEVALUES_Create_AdminWeb');
        }
        let attribute_value_id_2 = apiHelper.getValueFromObject(bodyParams, 'attribute_value_id_2', null);
        let product_attribute_id_2 = apiHelper.getValueFromObject(bodyParams, 'product_attribute_id_2', null);
        let attribute_value_2 = apiHelper.getValueFromObject(bodyParams, 'attribute_value_2', null);
        if (attribute_value_id_2 && product_attribute_id_2 && attribute_value_2) {
            await reqProductAttribute
                .input('PRODUCTID', productId)
                .input('ATTRIBUTEVALUESID', attribute_value_id_2)
                .input('PRODUCTATTRIBUTEID', product_attribute_id_2)
                .input('CREATEDUSER', auth_name)
                .execute('PRO_PRODUCTATTRIBUTEVALUES_Create_AdminWeb');
        }

        let attribute_value_id_3 = apiHelper.getValueFromObject(bodyParams, 'attribute_value_id_3', null);
        let product_attribute_id_3 = apiHelper.getValueFromObject(bodyParams, 'product_attribute_id_3', null);
        let attribute_value_3 = apiHelper.getValueFromObject(bodyParams, 'attribute_value_3', null);
        if (attribute_value_id_3 && product_attribute_id_3 && attribute_value_3) {
            await reqProductAttribute
                .input('PRODUCTID', productId)
                .input('ATTRIBUTEVALUESID', attribute_value_id_3)
                .input('PRODUCTATTRIBUTEID', product_attribute_id_3)
                .input('CREATEDUSER', auth_name)
                .execute('PRO_PRODUCTATTRIBUTEVALUES_Create_AdminWeb');
        }

        let attribute_value_id_4 = apiHelper.getValueFromObject(bodyParams, 'attribute_value_id_4', null);
        let product_attribute_id_4 = apiHelper.getValueFromObject(bodyParams, 'product_attribute_id_4', null);
        let attribute_value_4 = apiHelper.getValueFromObject(bodyParams, 'attribute_value_4', null);
        if (attribute_value_id_4 && product_attribute_id_4 && attribute_value_4) {
            await reqProductAttribute
                .input('PRODUCTID', productId)
                .input('ATTRIBUTEVALUESID', attribute_value_id_4)
                .input('PRODUCTATTRIBUTEID', product_attribute_id_4)
                .input('CREATEDUSER', auth_name)
                .execute('PRO_PRODUCTATTRIBUTEVALUES_Create_AdminWeb');
        }

        let attribute_value_id_5 = apiHelper.getValueFromObject(bodyParams, 'attribute_value_id_5', null);
        let product_attribute_id_5 = apiHelper.getValueFromObject(bodyParams, 'product_attribute_id_5', null);
        let attribute_value_5 = apiHelper.getValueFromObject(bodyParams, 'attribute_value_5', null);
        if (attribute_value_id_5 && product_attribute_id_5 && attribute_value_5) {
            await reqProductAttribute
                .input('PRODUCTID', productId)
                .input('ATTRIBUTEVALUESID', attribute_value_id_5)
                .input('PRODUCTATTRIBUTEID', product_attribute_id_5)
                .input('CREATEDUSER', auth_name)
                .execute('PRO_PRODUCTATTRIBUTEVALUES_Create_AdminWeb');
        }

        let attribute_value_id_6 = apiHelper.getValueFromObject(bodyParams, 'attribute_value_id_6', null);
        let product_attribute_id_6 = apiHelper.getValueFromObject(bodyParams, 'product_attribute_id_6', null);
        let attribute_value_6 = apiHelper.getValueFromObject(bodyParams, 'attribute_value_6', null);
        if (attribute_value_id_6 && product_attribute_id_6 && attribute_value_6) {
            await reqProductAttribute
                .input('PRODUCTID', productId)
                .input('ATTRIBUTEVALUESID', attribute_value_id_6)
                .input('PRODUCTATTRIBUTEID', product_attribute_id_6)
                .input('CREATEDUSER', auth_name)
                .execute('PRO_PRODUCTATTRIBUTEVALUES_Create_AdminWeb');
        }

        //Han muc ton kho
        const reqProductInventory = new sql.Request(transaction);
        let min_inventory = 0;
        let max_inventory = 0;
        min_inventory = parseFloat(apiHelper.getValueFromObject(bodyParams, 'min_inventory', 0));
        max_inventory = parseFloat(apiHelper.getValueFromObject(bodyParams, 'min_inventory', 0));
        let stock_id = apiHelper.getValueFromObject(bodyParams, 'stock_id', 0);
        let stock_unit_id = apiHelper.getValueFromObject(bodyParams, 'stock_unit_id');
        if (stock_id && min_inventory > 0 && max_inventory > 0) {
            await reqProductInventory
                .input('PRODUCTID', productId)
                .input('STOREID', apiHelper.getValueFromObject(bodyParams, 'store_id'))
                .input('MAXINVENTORYVALUE', apiHelper.getValueFromObject(bodyParams, 'max_inventory'))
                .input('MININVENTORYVALUE', apiHelper.getValueFromObject(bodyParams, 'min_inventory'))
                .input('STOCKSDURATION', apiHelper.getValueFromObject(bodyParams, 'stock_duration'))
                .input('UNITID', stock_unit_id)
                .input('STOCKSID', stock_id)
                .input('CREATEDUSER', auth_name)
                .execute('PRO_PROSTOCKSINVENTORY_Create_AdminWeb');
        }
        await transaction.commit();
        return new ServiceResponse(true, '', productId);
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

const createProductPrintCode = async (bodyParams = {}, product) => {
    const is_qr_code = apiHelper.getValueFromObject(bodyParams, 'is_qr_code', 1);
    const is_show_imei = apiHelper.getValueFromObject(bodyParams, 'is_show_imei');
    const imei = apiHelper.getValueFromObject(bodyParams, 'imei');
    let src;
    if (is_qr_code === 1) {
        const data = is_show_imei ? imei : product.product_code;
        src = await createQR({
            data: [{ data, mode: 'Kanji' }],
            center_image_name: 'logo.png',
            qr_width: 95,
            img_width: 25,
        });
    } else {
        src = await barcodeHelper.create(is_show_imei ? imei : product.product_code);
        delete product.product_code;
    }

    return {
        ...product,
        src,
        price: numberFormat.CurrencyTotalPrice(product.price),
        fields: apiHelper.getValueFromObject(bodyParams, 'fields'),
        is_qr_code,
        is_show_name: apiHelper.getValueFromObject(bodyParams, 'is_show_name'),
        is_show_price: apiHelper.getValueFromObject(bodyParams, 'is_show_price'),
        is_show_code: apiHelper.getValueFromObject(bodyParams, 'is_show_code'),
    };
};

const printQROrBarcode = async (bodyParams = {}) => {
    try {
        const products = apiHelper.getValueFromObject(bodyParams, 'products');
        if (!products || !products.length) {
            return new ServiceResponse(false, 'Vui lòng chọn sản phẩm để in mã qr.');
        }

        const size = apiHelper.getValueFromObject(bodyParams, 'size', 3);
        const sizeObj = {
            1: { width: 40, height: 30, isShowLogo: true },
            2: { width: 35, height: 22, isShowLogo: true },
            3: { width: 35, height: 15 },
            4: { width: 35, height: 15 },
        };

        // Cuộn 3 nhãn
        const isThreeInOneRow = size === 4;

        const is_show_imei = apiHelper.getValueFromObject(bodyParams, 'is_show_imei');
        const is_qr_code = apiHelper.getValueFromObject(bodyParams, 'is_qr_code', 1);

        const dataProducts = [];
        for (const product of products) {
            if (is_show_imei) {
                bodyParams.is_show_imei = is_show_imei;
                for (const { imei } of product?.imeis) {
                    bodyParams.imei = imei;
                    dataProducts.push({ ...(await createProductPrintCode(bodyParams, product)), ...sizeObj[size] });
                }
            } else {
                dataProducts.push({ ...(await createProductPrintCode(bodyParams, product)), ...sizeObj[size] });
            }
        }

        const fileName = `${is_qr_code ? 'QR_Code' : 'Barcode'}_${moment().format('DDMMYYYYHHmmss')}`;
        await pdfHelper.printPDF({
            template: `${is_qr_code ? 'viewQRcode.html' : 'viewBarcode.html'}`,
            filename: fileName,
            data: {
                [`${is_qr_code ? 'products' : 'barcodes'}`]: dataProducts,
                ...sizeObj[size],
            },
            width: `${sizeObj[size].width * (isThreeInOneRow ? 3 : 1)}mm`, // Tính theo mm
        });

        return new ServiceResponse(true, '', { path: `pdf/${fileName}.pdf` });
    } catch (e) {
        logger.error(e, { function: 'productService.printQRCode' });
        return new ServiceResponse(false, e.message || e);
    }
};


const getStockInRequest = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('STOCKSID', apiHelper.getValueFromObject(queryParams, 'stockId'))
            .execute('MD_PRODUCT_GetOptionsStockInRequest_AdminWeb');

        return new ServiceResponse(true, 'ok', productClass.optionsStockInRequest(data.recordset));
    } catch (e) {
        logger.error(e, { function: 'ProductService.getOptionsStock' });
        return new ServiceResponse(true, '', {});
    }
};


module.exports = {
    getListProduct,
    deleteProduct,
    getListAttributes,
    createAttribute,
    createProductOrUpdate,
    detailProduct,
    getOptionsStock,
    getOptionsProduct,
    getOptionsStockType,
    getProductsPrintBarcode,
    printBarcode,
    exportExcel,
    downloadExcel,
    importExcel,
    printQROrBarcode,
    getStockInRequest,
};
