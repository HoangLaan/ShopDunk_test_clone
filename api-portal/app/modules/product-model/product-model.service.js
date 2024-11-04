const productModelClass = require('./product-model.class');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const API_CONST = require('../../common/const/api.const');
const fileHelper = require('../../common/helpers/file.helper');
let xl = require('excel4node');
const config = require('../../../config/config');
const { createProduct } = require('./ultils/helper');
const { mode } = require('crypto-js');
const _ = require('lodash');

const getListProductModel = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getSearch(queryParams);
        const createDateFrom = apiHelper.getValueFromObject(queryParams, 'from_date');
        const createDateTo = apiHelper.getValueFromObject(queryParams, 'to_date');
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('KEYWORD', keyword)
            .input('CREATEDDATEFROM', createDateFrom)
            .input('CREATEDDATETO', createDateTo)
            .input('PRODUCTCATEGORYID', apiHelper.getValueFromObject(queryParams, 'product_category_id'))
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .input('ISSHOWWEB', apiHelper.getFilterBoolean(queryParams, 'is_show_web'))
            .execute('MD_PRODUCTMODEL_GetList_AdminWeb');

        const lists = data.recordset;
        return new ServiceResponse(true, '', {
            data: productModelClass.list(lists),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(lists),
        });
    } catch (e) {
        logger.error(e, { function: 'ProductModelService.getListProductModel' });
        return new ServiceResponse(true, '', {});
    }
};

const detail = async (Id) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().input('MODELID', Id).execute('MD_PRODUCTMODEL_GetById_AdminWeb');

        let model = productModelClass.detail(data.recordset[0]);
        let list_product_images = productModelClass.listProductImages(data.recordsets[6]);

        if (model) {
            model.images = productModelClass.listImages(data.recordsets[1]);
            model.attributes = productModelClass.listAttributes(data.recordsets[2]);

            const listDefaultAttributeValue = productModelClass.listDefaultAttributeValue(data.recordsets[4]);
            model.attribute_value_1 = {
                attibute_id: data.recordsets[3][0]?.ID,
                attibute_name: data.recordsets[3][0]?.NAME,
                values: listDefaultAttributeValue.filter(
                    (item) => item.product_attribute_id == data.recordsets[3][0].ID,
                ),
            };
            model.attribute_value_2 = {
                attibute_id:
                    data.recordsets &&
                    data.recordsets.length > 0 &&
                    data.recordsets[3] &&
                    data.recordsets[3].length > 0 &&
                    data.recordsets[3][1] &&
                    data.recordsets[3][1]?.ID
                        ? data.recordsets[3][1]?.ID
                        : 0,

                attibute_name:
                    data.recordsets &&
                    data.recordsets.length > 0 &&
                    data.recordsets[3] &&
                    data.recordsets[3].length > 0 &&
                    data.recordsets[3][1] &&
                    data.recordsets[3][1]?.NAME
                        ? data.recordsets[3][1]?.NAME
                        : 0,
                values: listDefaultAttributeValue.filter(
                    (item) =>
                        item.product_attribute_id ==
                        (data.recordsets &&
                        data.recordsets.length > 0 &&
                        data.recordsets[3] &&
                        data.recordsets[3].length > 0 &&
                        data.recordsets[3][1] &&
                        data.recordsets[3][1]?.ID
                            ? data.recordsets[3][1]?.ID
                            : 0),
                ),
            };

            let product_list = productModelClass.listProduct(data.recordsets[5]);

            product_list = product_list.reduce((acc, item, idx, array) => {
                if (item.product_attribute_id !== model.attribute_value_1.attibute_id) return acc;

                const index = acc.findIndex((x) => x.product_id === item.product_id);

                if (index === -1) {
                    const value_name_2 = array.find(
                        (x) => x.product_id === item.product_id && x.product_attribute_id !== item.product_attribute_id,
                    );

                    acc.push({
                        value_name_1: item.attribute_values,
                        value_id_1: item.attribute_values_id,
                        value_name_2: value_name_2?.attribute_values,
                        product_code: item.product_code,
                        product_name: item.product_name,
                        product_id: item.product_id,
                        unit_id: item.unit_id,
                        is_active: item.is_active,
                        is_default: item.is_default,
                        warranty_period_id: item.warranty_period_id,
                    });
                }

                return acc;
            }, []);

            product_list = product_list.reduce((acc, item, idx, array) => {
                const isFirst =
                    acc.findIndex(
                        (x) => x.product_code !== item.product_code && x.value_id_1 == item.value_id_1 && x.rowSpan,
                    ) === -1;
                let images = (list_product_images || []).filter((img) => img.product_id == item.product_id);

                if (isFirst) {
                    const rowSpan = array.filter((x) => x.value_id_1 == item.value_id_1).length;
                    acc.push({
                        ...item,
                        rowSpan,
                        images,
                    });
                } else {
                    acc.push({ ...item, images });
                }

                return acc;
            }, []);

            model.product_list = _.orderBy(product_list, ['value_id_1']);

            // list default accounts
            const dataDefaultAccounts = await pool
                .request()
                .input('PRODUCTMODELID', model.model_id)
                .execute(`MD_PRODUCTMODEL_DEFAULTACCOUNT_GetByProductModelId_AdminWeb`);
            const defaultAccountList = dataDefaultAccounts.recordset;
            model.default_account_list = productModelClass.listDefaultAccounts(defaultAccountList);

            return new ServiceResponse(true, 'ok', model);
        }
        return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
    } catch (e) {
        logger.error(e, { function: 'ProductModelService.detail' });
        return new ServiceResponse(false, e.message);
    }
};

const createProductModelOrUpdate = async (bodyParams = {}) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        await transaction.begin();
        const model_id = apiHelper.getValueFromObject(bodyParams, 'model_id');
        const created_user = apiHelper.getValueFromObject(bodyParams, 'auth_name');
        // Check model code
        const dataChecCode = await pool
            .request()
            .input('MODELID', model_id)
            .input('MODELCODE', apiHelper.getValueFromObject(bodyParams, 'model_code'))
            .execute('MD_PRODUCTMODE_CheckCode_AdminWeb');

        if (dataChecCode.recordset && dataChecCode.recordset[0].RESULT == 1) {
            throw new Error('Mã model sản phẩm đã tồn tại.');
        }

        const requestProductModelCreate = new sql.Request(transaction);
        const dataProductModelCreate = await requestProductModelCreate
            .input('MODELID', model_id)
            .input('MODELCODE', apiHelper.getValueFromObject(bodyParams, 'model_code'))
            .input('MODELNAME', apiHelper.getValueFromObject(bodyParams, 'model_name'))
            .input('ORDERINDEX', apiHelper.getValueFromObject(bodyParams, 'order_index'))
            .input('PRODUCTCATEGORYID', apiHelper.getValueFromObject(bodyParams, 'product_category_id'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
            .input('MODELDISPLAYNAME', apiHelper.getValueFromObject(bodyParams, 'display_name'))
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('ISSHOWWEB', apiHelper.getValueFromObject(bodyParams, 'is_show_web'))
            .input('CREATEDUSER', created_user)
            .execute('MD_PRODUCTMODEL_CreateOrUpdate_AdminWeb');

        const modelId = dataProductModelCreate.recordset[0].RESULT;
        if (modelId <= 0) {
            throw new Error('Tạo ngành hàng không thành công.');
        }

        if (modelId && modelId !== '') {
            // Delete attributes
            const requestProCateAttributeDelete = new sql.Request(transaction);
            const dataProCateAttributeDelete = await requestProCateAttributeDelete
                .input('MODELID', modelId)
                .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .execute('PRO_PROMODELATTRIBUTEVALUES_Delete_AdminWeb');

            const resultDelete = dataProCateAttributeDelete.recordset[0].RESULT;
            if (resultDelete <= 0) {
                throw new Error('Xóa thuộc tính model sản phẩm thất bại.');
            }

            // Delete images
            const requestProductModelImageDelete = new sql.Request(transaction);
            const dataProuctModelImageDelete = await requestProductModelImageDelete
                .input('MODELID', modelId)
                .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .execute('PRO_PROMODELIMAGES_Delete_AdminWeb');

            const resultImageDelete = dataProuctModelImageDelete.recordset[0].RESULT;
            if (resultImageDelete <= 0) {
                throw new Error('Xóa hình ảnh model sản phẩm thất bại.');
            }
        }

        const images = apiHelper.getValueFromObject(bodyParams, 'images', []);

        for (let i = 0; i < images.length; i++) {
            let picture_url;
            // if (!images[i].picture_url) {
            //     if (fileHelper.isBase64(images[i])) {
            //         picture_url = await fileHelper.saveBase64(null, images[i]);
            //     }
            // }
            // picture_url = picture_url || images[i] && images[i]?.picture_url && images[i]?.picture_url.replace(config.domain_cdn, '');

            const picture = images[i]?.picture_url;
            if (fileHelper.isBase64(picture)) {
                try {
                    picture_url = await fileHelper.saveBase64(null, picture);
                } catch (error) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Cập nhật hình ảnh thất bại !');
                }
            } else {
                picture_url = picture.replace(config.domain_cdn, '');
            }

            const createImageRequest = new sql.Request(transaction);
            const createRes = await createImageRequest
                .input('MODELID', modelId)
                .input('PICTUREURL', picture_url)
                .input('ISDEFAULT', i == 0 ? true : false)
                .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .execute('PRO_PROMODELIMAGES_Create_AdminWeb');

            const result = createRes.recordset[0].RESULT;
            if (result <= 0) {
                throw new Error('Thêm hình ảnh model sản phẩm không thành công.');
            }
        }

        let attributes = apiHelper.getValueFromObject(bodyParams, 'attributes');
        const attribute_value_1 = apiHelper.getValueFromObject(bodyParams, 'attribute_value_1');
        const attribute_value_1_id = apiHelper.getValueFromObject(attribute_value_1, 'attibute_id');
        const attribute_value_2 = apiHelper.getValueFromObject(bodyParams, 'attribute_value_2');
        const attribute_value_2_id = apiHelper.getValueFromObject(attribute_value_2, 'attibute_id');

        if (attributes && attributes.length > 0) {
            for (let i = 0; i < attributes.length; i++) {
                const item = attributes[i];
                const requestProModelAttributeCreate = new sql.Request(transaction);
                const dataProModelAttributeCreate = await requestProModelAttributeCreate // eslint-disable-line no-await-in-loop
                    .input('MODELID', modelId)
                    .input('PRODUCTATTRIBUTEID', apiHelper.getValueFromObject(item, 'value'))
                    .input('ISNEW', apiHelper.getValueFromObject(item, 'is_new', 0))
                    .input(
                        'ISDEFAULT',
                        apiHelper.getValueFromObject(item, 'value') === attribute_value_1_id ||
                            apiHelper.getValueFromObject(item, 'value') === attribute_value_2_id,
                    )
                    .input('PRODUCTCATEGORYID', apiHelper.getValueFromObject(bodyParams, 'product_category_id'))
                    .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                    .execute('PRO_PROMODELATTRIBUTEVALUES_Create_AdminWeb');

                const resultProCateAttributeId = dataProModelAttributeCreate.recordset[0].RESULT;
                if (resultProCateAttributeId <= 0) {
                    throw new Error('Thêm thuộc tính cho model sản phẩm không thành công.');
                }
            }
        }

        const product_list = apiHelper.getValueFromObject(bodyParams, 'product_list', []);
        if (!model_id && product_list && product_list.length > 0) {
            for (let i = 0; i < product_list.length; i++) {
                const createProductRes = await createProduct(
                    {
                        ...product_list[i],
                        product_display_name: apiHelper.getValueFromObject(product_list[i], 'product_name'),
                        model_id: { value: modelId },
                        product_category_id: apiHelper.getValueFromObject(bodyParams, 'product_category_id'),
                        auth_name: apiHelper.getValueFromObject(bodyParams, 'auth_name'),
                    },
                    transaction,
                );

                if (createProductRes.isFailed()) {
                    throw new Error('Thêm sản phẩm cho model sản phẩm không thành công.');
                }
            }
        }

        // insert or update default account list
        const authName = apiHelper.getValueFromObject(bodyParams, 'auth_name');
        const defaultAccounts = apiHelper.getValueFromObject(bodyParams, 'default_account_list', []);
        if (defaultAccounts && defaultAccounts.length > 0) {
            const result = await createOrUpdateDefaultAccount(
                defaultAccounts,
                model_id ?? modelId,
                authName,
                transaction,
            );
            if (!result) {
                // await transaction.rollback();
                // return new ServiceResponse(false, 'Thêm tài khoản ngầm định thất bại !');
                throw new Error('Thêm tài khoản ngầm định không thành công.');
            }
        }

        await transaction.commit();
        return new ServiceResponse(true, '', modelId);
    } catch (e) {
        logger.error(e, { function: 'ProductModelService.createModelCategoryOrUpdate' });
        await transaction.rollback();
        return new ServiceResponse(false, e.message || 'Lỗi thêm mới/cập nhật model sản phẩm.');
    }
};

const createOrUpdateDefaultAccount = async (accountingList, productModelId, authName, transaction) => {
    const defaultAccountIds = accountingList
        .filter((accounting) => accounting.product_model_default_account_id)
        ?.map((accounting) => accounting.product_model_default_account_id);

    try {
        // delete unnessary default accounts
        if (defaultAccountIds.length > 0) {
            const deleteRequest = new sql.Request(transaction);
            const deleteResult = await deleteRequest
                .input('LISTID', defaultAccountIds)
                .input('PRODUCTMODELID', productModelId)
                .input('DELETEDUSER', authName)
                .execute('MD_PRODUCTMODEL_DEFAULTACCOUNT_DeleteAllExcept_AdminWeb');
            if (!deleteResult.recordset[0]?.RESULT) {
                return false;
            }
        }

        // insert or update default account list
        for (let accountingAccount of accountingList) {
            const accountingRequest = new sql.Request(transaction);
            const resultChild = await accountingRequest
                .input(
                    'PRODUCTMODELDEFAULTACCOUNTID',
                    apiHelper.getValueFromObject(accountingAccount, 'product_model_default_account_id'),
                )
                .input('PRODUCTMODELID', productModelId)
                .input('ACCOUNTINGACCOUNTID', apiHelper.getValueFromObject(accountingAccount, 'accounting_account_id'))
                .input('TYPE', apiHelper.getValueFromObject(accountingAccount, 'type'))
                .input('CREATEDUSER', authName)
                .execute('MD_PRODUCTMODEL_DEFAULTACCOUNT_CreateOrUpdate_AdminWeb');

            const childId = resultChild.recordset[0].RESULT;
            if (childId <= 0) {
                return false;
            }
        }

        return true;
    } catch (error) {
        logger.error(error, { function: 'productModelService.createOrUpdateDefaultAccount' });
        return false;
    }
};

const deleteProductModel = async (bodyParams) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    await transaction.begin();
    try {
        // REMOVE ATTRIBUTES OF CATEGORY
        const requestProductAttrModelDelete = new sql.Request(transaction);
        const dataProductAttrModelDelete = await requestProductAttrModelDelete
            .input('IDS', apiHelper.getValueFromObject(bodyParams, 'ids'))
            .execute('PRO_PROMODELATTRIBUTEVALUES_DeleteMany_AdminWeb');
        const resultProductAttrModelDelete = dataProductAttrModelDelete.recordset[0].RESULT;
        if (resultProductAttrModelDelete <= 0) {
            return new ServiceResponse(false, 'Xóa thuộc tính model không thành công.');
        }
        // REMOVE PRODUCT MODEL
        const requestProductModelDelete = new sql.Request(transaction);
        const datatProductModelDelete = await requestProductModelDelete
            .input('IDS', apiHelper.getValueFromObject(bodyParams, 'ids'))
            .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('MD_PRODUCTMODEL_DeleteMany_AdminWeb');
        const resultProductModelDelete = datatProductModelDelete.recordset[0].RESULT;
        if (resultProductModelDelete <= 0) {
            return new ServiceResponse(false, 'Xóa model không thành công.');
        }

        await transaction.commit();
        return new ServiceResponse(true, 'ok');
    } catch (e) {
        logger.error(e, { function: 'ProductModelService.deleteProductModel' });
        await transaction.rollback();
        return new ServiceResponse(false, e.message);
    }
};

const getOptionForCreate = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PARENTID', apiHelper.getValueFromObject(queryParams, 'parent_id'))
            .execute('MD_PRODUCTCATEGORY_GetOptionsCreate_AdminWeb');
        return new ServiceResponse(true, '', productModelClass.options(data.recordset));
    } catch (e) {
        logger.error(e, { function: 'ProductModelService.getOptionForCreate' });
        return [];
    }
};

const exportExcel = async (queryParams = {}) => {
    queryParams.itemsPerPage = API_CONST.MAX_EXPORT_EXCEL;
    const serviceRes = await getListProductModel(queryParams);
    const { data } = serviceRes.getData();

    if (!data || data.length === 0) {
        return new ServiceResponse(false, 'Không có dữ liệu để xuất file excel.');
    }

    let wb = new xl.Workbook({
        defaultFont: {
            name: 'Times New Roman',
        },
    });
    const ws = wb.addWorksheet('MODEL SAN PHAM', {});

    const styles = {
        header: {
            alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
            font: { bold: true },
            border: {
                top: {
                    style: 'thin',
                },
                left: {
                    style: 'thin',
                },
                bottom: {
                    style: 'thin',
                },
            },
        },
        row: {
            border: {
                bottom: { style: 'dashed' },
                left: { style: 'thin' },
            },
        },
        last_row: {
            border: {
                bottom: { style: 'thin' },
                left: { style: 'thin' },
            },
        },
    };

    // Set width
    ws.column(1).setWidth(15);
    ws.column(2).setWidth(40);
    ws.column(3).setWidth(40);
    ws.column(4).setWidth(50);
    ws.column(5).setWidth(40);
    ws.column(5).setWidth(40);

    const header = {
        model_code: 'Mã model sản phẩm',
        model_name: 'Tên model sản phẩm',
        display_name: 'Tên model hiển thị',
        category_name: 'Ngành hàng',
        created_date: 'Ngày tạo',
        is_active: 'Trạng thái',
    };
    const rowHeader = 1;
    data.unshift(header);
    const maxRow = rowHeader + data.length - 1;
    data.forEach((item, index) => {
        let indexRow = index + 1;
        let indexCol = 0;
        let stt = 'STT';

        if (indexRow > 1) {
            stt = indexRow - 1;
        }

        ws.cell(indexRow, ++indexCol)
            .string((stt || '').toString())
            .style(indexRow == rowHeader ? { ...styles.header } : indexRow < maxRow ? styles.row : styles.last_row);
        ws.cell(indexRow, ++indexCol)
            .string((item.model_code || '').toString())
            .style(indexRow == rowHeader ? { ...styles.header } : indexRow < maxRow ? styles.row : styles.last_row);
        ws.cell(indexRow, ++indexCol)
            .string((item.model_name || '').toString())
            .style(indexRow == rowHeader ? { ...styles.header } : indexRow < maxRow ? styles.row : styles.last_row);
        ws.cell(indexRow, ++indexCol)
            .string((item.display_name || '').toString())
            .style(indexRow == rowHeader ? { ...styles.header } : indexRow < maxRow ? styles.row : styles.last_row);
        ws.cell(indexRow, ++indexCol)
            .string((item.category_name || '').toString())
            .style(indexRow == rowHeader ? { ...styles.header } : indexRow < maxRow ? styles.row : styles.last_row);
        ws.cell(indexRow, ++indexCol)
            .string((item.created_date || '').toString())
            .style(indexRow == rowHeader ? { ...styles.header } : indexRow < maxRow ? styles.row : styles.last_row);
        ws.cell(indexRow, ++indexCol)
            .string(index === 0 ? item.is_active : item.is_active ? 'Kích hoạt' : 'ẩn')
            .style(indexRow == rowHeader ? { ...styles.header } : indexRow < maxRow ? styles.row : styles.last_row);
    });

    return new ServiceResponse(true, '', wb);
};

const getOptionsFunction = async (queryParams = {}) => {
    try {
        if (!queryParams.search) return new ServiceResponse(true, 'ok', []);
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'search'))
            .execute('MD_PRODUCTCATEGORY_GetOptionsFunc_AdminWeb');
        return new ServiceResponse(true, '', productModelClass.optionsFunc(data.recordset));
    } catch (e) {
        logger.error(e, { function: 'ProductModelService.getOptionsFunction' });
        return new ServiceResponse(false, e.message);
    }
};

const getListAttributes = async (queryParams = {}) => {
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
            .execute('MD_PRODUCTCATEGORY_GetListAttribute_AdminWeb');

        const lists = data.recordset;
        return new ServiceResponse(true, '', {
            data: productModelClass.listAttributes(lists),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(lists),
        });
    } catch (e) {
        logger.error(e, { function: 'ProductModelService.getListAttributes' });
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
            .execute('MD_PRODUCTMODEL_CheckAttributeName_AdminWeb');

        if (checkAttributeName.recordset[0].RESULT) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Tên thuộc tính sản phẩm đã tồn tại.');
        }

        // Save Attribute
        const requestProductAttribute = new sql.Request(transaction);
        const resultProductAttribute = await requestProductAttribute
            .input('UNITID', apiHelper.getValueFromObject(body, 'unit_id'))
            .input('PRODUCTCATEGORYID', apiHelper.getValueFromObject(body, 'product_category_id'))
            .input('ATTRIBUTENAME', attributeName)
            .input('ATTRIBUTEDESCRIPTION', apiHelper.getValueFromObject(body, 'attribute_description'))
            .input('ISCOLOR', apiHelper.getValueFromObject(body, 'is_color'))
            .input('ISFORMSIZE', apiHelper.getValueFromObject(body, 'is_form_size'))
            .input('ISOTHER', apiHelper.getValueFromObject(body, 'is_other'))
            .input('ISACTIVE', 1)
            .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
            .execute('MD_PRODUCTMODEL_CreateAttribute_AdminWeb');
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
                    .execute('MD_PRODUCTMODEL_CreateAttributeValue_AdminWeb');
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

const getAttributeDetail = async (product_attribute_id) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PRODUCTATTRIBUTEID', product_attribute_id)
            .execute('MD_PRODUCTMODEL_GetAttributeDetail_AdminWeb');

        return new ServiceResponse(true, '', productModelClass.attributeDetail(data.recordset[0]));
    } catch (e) {
        logger.error(e, { function: 'ProductModelService.getAttributeDetail' });
        return new ServiceResponse(true, '', {});
    }
};

const getAccountingAccountOptions = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().execute('AC_ACCOUNTINGACCOUNT_GetOptions_AdminWeb');

        return new ServiceResponse(true, '', productModelClass.accountingOptions(data.recordset));
    } catch (e) {
        logger.error(e, { function: 'ProductModelService.getListProductModel' });
        return new ServiceResponse(true, '', {});
    }
};

module.exports = {
    getListProductModel,
    detail,
    createProductModelOrUpdate,
    deleteProductModel,
    exportExcel,
    getOptionForCreate,
    getOptionsFunction,
    getListAttributes,
    createAttribute,
    getAttributeDetail,
    getAccountingAccountOptions,
};
