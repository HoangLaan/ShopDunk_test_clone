const producCategoryClass = require('../product-category/product-category.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const API_CONST = require('../../common/const/api.const');
const fileHelper = require('../../common/helpers/file.helper');
let xl = require('excel4node');
const config = require('../../../config/config');

const getListProductCategory = async (queryParams = {}) => {
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
            .input('COMPANYID', apiHelper.getValueFromObject(queryParams, 'company_id'))
            .input('PARENTID', apiHelper.getValueFromObject(queryParams, 'parent_id'))
            .input('TYPE', apiHelper.getValueFromObject(queryParams, 'type'))
            .input('ISSHOWWEB', apiHelper.getValueFromObject(queryParams, 'is_show_web'))
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .execute('MD_PRODUCTCATEGORY_GetList_AdminWeb');

        const lists = data.recordset;
        return new ServiceResponse(true, '', {
            data: producCategoryClass.list(lists),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(lists),
        });
    } catch (e) {
        logger.error(e, { function: 'ProductCategoryService.getListProductCategory' });
        return new ServiceResponse(true, '', {});
    }
};

const detail = async (Id) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().input('PRODUCTCATEGORYID', Id).execute('MD_PRODUCTCATEGORY_GetById_AdminWeb');

        let category = producCategoryClass.detail(data.recordset[0]);

        if (category) {
            category.parent_id = category.parent_id
                ? { value: category.parent_id, label: category.parent_name }
                : undefined;
            category.pictures = producCategoryClass.pictureUrls(data.recordsets[1]).map((item) => item.picture_url);
            category.attributes = producCategoryClass.listAttributes(data.recordsets[2]);
            category.material_list = producCategoryClass.listMaterial(data.recordsets[3]);
            return new ServiceResponse(true, 'ok', category);
        }

        return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
    } catch (e) {
        logger.error(e, { function: 'ProductCategoryService.detail' });
        return new ServiceResponse(false, e.message);
    }
};

const createProductCategoryOrUpdate = async (bodyParams) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    await transaction.begin();
    try {
        // Check product category name
        const dataCheckName = await pool
            .request()
            .input('PRODUCTCATEGORYID', apiHelper.getValueFromObject(bodyParams, 'product_category_id'))
            .input('CATEGORYNAME', apiHelper.getValueFromObject(bodyParams, 'category_name'))
            .execute('MD_PRODUCTCATEGORY_CheckName_AdminWeb');

        if (dataCheckName.recordset && dataCheckName.recordset[0].RESULT == 1) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Tên ngành hàng đã tồn tại.', null);
        }

        const category_name = apiHelper.getValueFromObject(bodyParams, 'category_name', '');

        const requestProductCategotyCreate = new sql.Request(transaction);
        const dataProductCategotyCreate = await requestProductCategotyCreate
            .input('PRODUCTCATEGORYID', apiHelper.getValueFromObject(bodyParams, 'product_category_id'))
            .input('COMPANYID', apiHelper.getValueFromObject(bodyParams, 'company_id'))
            .input('CATEGORYNAME', category_name)
            .input('ADDFUNCTIONID', apiHelper.getValueFromObject(bodyParams, 'add_function_id'))
            .input('EDITFUNCTIONID', apiHelper.getValueFromObject(bodyParams, 'view_function_id'))
            .input('DELETEFUNCTIONID', apiHelper.getValueFromObject(bodyParams, 'edit_function_id'))
            .input('VIEWFUNCTIONID', apiHelper.getValueFromObject(bodyParams, 'delete_function_id'))
            .input('PARENTID', apiHelper.getValueFromObject(bodyParams, 'parent_id'))
            .input('VATID', apiHelper.getValueFromObject(bodyParams, 'vat_id'))
            .input('CATEGORYTYPE', apiHelper.getValueFromObject(bodyParams, 'category_type'))
            .input('DESCRIPTIONS', apiHelper.getValueFromObject(bodyParams, 'description'))
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system'))
            .input('ISSHOWWEB', apiHelper.getValueFromObject(bodyParams, 'is_show_web'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('MD_PRODUCTCATEGORY_CreateOrUpdate_AdminWeb');

        const productCategoryId = dataProductCategotyCreate.recordset[0].RESULT;
        if (productCategoryId <= 0) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Tạo ngành hàng không thành công.');
        }

        // pictures
        const deletePictures = new sql.Request(transaction);
        await deletePictures
            .input('LISTID', [productCategoryId])
            .input('NAMEID', 'PRODUCTCATEGORYID')
            .input('TABLENAME', 'PRO_PROCATEGORYIMAGES')
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('CBO_COMMON_SOFTDELETE');

        const pictures = apiHelper.getValueFromObject(bodyParams, 'pictures');
        let picture_url = '';

        for (let i = 0; i < pictures.length; i++) {
            const picture = pictures[i];
            if (fileHelper.isBase64(picture)) {
                try {
                    picture_url = await fileHelper.saveBase64(null, picture);
                } catch (error) {
                    return new ServiceResponse(false, 'Xóa thuộc tính ngành hàng thất bại.');
                }
            } else {
                picture_url = picture.replace(config.domain_cdn, '');
            }

            const requestProductCategotyPictureCreate = new sql.Request(transaction);
            const dataProductCategotyPictureCreate = await requestProductCategotyPictureCreate
                .input('PRODUCTCATEGORYID', productCategoryId)
                .input('PICTUREURL', picture_url)
                .input('ISDEFAULT', i === 0)
                .input('CATEGORYNAME', category_name)
                .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .execute('PRO_PROCATEGORYIMAGES_Create_AdminWeb');

            const resultPictureCreate = dataProductCategotyPictureCreate.recordset[0].RESULT;
            console.log(dataProductCategotyPictureCreate.recordsets);
            if (resultPictureCreate <= 0) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Tạo hình ảnh ngành hàng thất bại.');
            }
        }

        const id = apiHelper.getValueFromObject(bodyParams, 'product_category_id');
        if (id && id !== '') {
            const requestProCateAttributeDelete = new sql.Request(transaction);
            const dataProCateAttributeDelete = await requestProCateAttributeDelete
                .input('PRODUCTCATEGORYID', id)
                .execute('PRO_CATE_ATTRIBUTE_Delete_AdminWeb');

            const resultDelete = dataProCateAttributeDelete.recordset[0].RESULT;
            if (resultDelete <= 0) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Xóa thuộc tính ngành hàng thất bại.');
            }
        }

        const attributes = apiHelper.getValueFromObject(bodyParams, 'attributes');
        if (attributes && attributes.length > 0) {
            for (let i = 0; i < attributes.length; i++) {
                const item = attributes[i];
                const requestProCateAttributeCreate = new sql.Request(transaction);
                const dataProCateAttributeCreate = await requestProCateAttributeCreate // eslint-disable-line no-await-in-loop
                    .input('PRODUCTCATEGORYID', productCategoryId)
                    .input('PRODUCTATTRIBUTEID', apiHelper.getValueFromObject(item, 'attribute_id'))
                    .execute('PRO_CATE_ATTRIBUTE_Create_AdminWeb');

                const resultProCateAttributeId = dataProCateAttributeCreate.recordset[0].RESULT;
                if (resultProCateAttributeId <= 0) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Thêm thuộc tính cho ngành hàng không thành công.');
                }
            }
        }

        // material list
        const material_list = apiHelper.getValueFromObject(bodyParams, 'material_list', []);
        const deleteMaterial = new sql.Request(transaction);
        await deleteMaterial
            .input(
                'PRODUCTCATMATERIALIDS',
                material_list?.map((item) => item.product_material_id),
            )
            .execute('PRO_PRODUCTCAT_MATERIAL_Delete_AdminWeb');

        if (material_list && material_list.length > 0) {
            for (let i = 0; i < material_list.length; i++) {
                const material = material_list[i];
                const requestProCateMaterialCreate = new sql.Request(transaction);
                const dataProCateMaterialCreate = await requestProCateMaterialCreate // eslint-disable-line no-await-in-loop
                    .input('PRODUCTCATEGORYID', productCategoryId)
                    .input('PRODUCTCATMATERIALID', apiHelper.getValueFromObject(material, 'product_material_id'))
                    .input('MATERIALID', apiHelper.getValueFromObject(material, 'material_id'))
                    .input('NUMBER', apiHelper.getValueFromObject(material, 'number'))
                    .input('NOTE', apiHelper.getValueFromObject(material, 'note'))
                    .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                    .execute('PRO_PRODUCTCAT_MATERIAL_CreateOrUpdate_AdminWeb');

                const resultProCateMaterialId = dataProCateMaterialCreate.recordset[0].RESULT;
                if (resultProCateMaterialId <= 0) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Thêm vật liệu cho ngành hàng không thành công.');
                }
            }
        }

        await transaction.commit();
        return new ServiceResponse(true, '', productCategoryId);
    } catch (e) {
        logger.error(e, { function: 'ProductCategoryService.createProductCategoryOrUpdate' });
        await transaction.rollback();
        return new ServiceResponse(false);
    }
};

const deleteProductCategory = async (bodyParams) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    await transaction.begin();
    try {
        // REMOVE ATTRIBUTES OF CATEGORY
        const requestProductAttrCategoryDelete = new sql.Request(transaction);
        const dataProductAttrCategoryDelete = await requestProductAttrCategoryDelete
            .input('IDS', apiHelper.getValueFromObject(bodyParams, 'ids'))
            .execute('PRO_CATE_ATTRIBUTE_DeleteMany_AdminWeb');
        const resultProductAttrCategoryDelete = dataProductAttrCategoryDelete.recordset[0].RESULT;
        if (resultProductAttrCategoryDelete <= 0) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Xóa thuộc tính ngành hàng không thành công.');
        }
        // REMOVE PRODUCT CATEGORY
        const requestProductCategoryDelete = new sql.Request(transaction);
        const datatProductCategoryDelete = await requestProductCategoryDelete
            .input('IDS', apiHelper.getValueFromObject(bodyParams, 'ids'))
            .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('MD_PRODUCTCATEGORY_DeleteMany_AdminWeb');
        const resultProductCategoryDelete = datatProductCategoryDelete.recordset[0].RESULT;
        if (resultProductCategoryDelete <= 0) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Xóa ngành hàng không thành công');
        }
        removeCacheOptions();
        await transaction.commit();
        return new ServiceResponse(true, RESPONSE_MSG.PRODUCTCATEGORY.DELETE_SUCCESS);
    } catch (e) {
        logger.error(e, { function: 'ProductCategoryService.deleteProductCategory' });
        await transaction.rollback();
        return new ServiceResponse(false, e.message);
    }
};

const getOptionTreeview = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PARENTID', apiHelper.getValueFromObject(queryParams, 'parent_id'))
            .execute('MD_PRODUCTCATEGORY_GetOptionsCreate_AdminWeb');
        return new ServiceResponse(true, '', producCategoryClass.options(data.recordset));
    } catch (e) {
        logger.error(e, { function: 'ProductCategoryService.getOptionTreeview' });
        return [];
    }
};

const removeCacheOptions = () => {
    return cacheHelper.removeByKey(CACHE_CONST.MD_PRODUCTCATEGORY_OPTIONS);
};

const exportExcel = async (queryParams = {}) => {
    queryParams.itemsPerPage = API_CONST.MAX_EXPORT_EXCEL;
    // queryParams.is_active = 2;
    const serviceRes = await getListProductCategory(queryParams);
    const { data } = serviceRes.getData();

    if (!data || data.length === 0) {
        return new ServiceResponse(false, 'Không có dữ liệu để xuất file excel.');
    }

    let wb = new xl.Workbook({
        defaultFont: {
            name: 'Times New Roman',
        },
    });
    const ws = wb.addWorksheet('DANH MỤC NGÀNH HÀNG', {});

    // Set width

    ws.column(1).setWidth(15);
    ws.column(2).setWidth(40);
    ws.column(3).setWidth(40);
    ws.column(4).setWidth(70);
    ws.column(5).setWidth(40);
    ws.column(6).setWidth(50);
    ws.column(7).setWidth(50);

    const header = {
        stt: 'STT',
        category_name: 'Tên ngành hàng',
        parent_name: 'Thuộc ngành hàng',
        company_name: 'Công ty áp dụng',
        created_user: 'Người tạo',
        created_date: 'Ngày tạo',
        is_active: 'Trạng thái',
    };

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
    const rowHeader = 1;
    data.unshift(header);
    const maxRow = rowHeader + data.length - 1;
    data.forEach((item, index) => {
        let indexRow = index + rowHeader;
        let indexCol = 0;
        let stt = 'STT';
        let parent_name = 'Thuộc ngành hàng';
        if (indexRow > 1) {
            const parentList = `${item.parent_name}`.split('|');
            if (!parentList.length || parentList.length == 1) parent_name = '--';
            else {
                parentList.pop();
                parent_name = `|-- ` + parentList.map((x, i) => (i < parentList.length - 1 ? ' -- ' : x)).join(' ');
            }
            stt = indexRow - 1;
        }

        ws.cell(indexRow, ++indexCol)
            .string((stt || '').toString())
            .style(indexRow == rowHeader ? { ...styles.header } : indexRow < maxRow ? styles.row : styles.last_row);
        ws.cell(indexRow, ++indexCol)
            .string((item.category_name || '').toString())
            .style(indexRow == rowHeader ? { ...styles.header } : indexRow < maxRow ? styles.row : styles.last_row);
        ws.cell(indexRow, ++indexCol)
            .string((parent_name || '').toString())
            .style(indexRow == rowHeader ? { ...styles.header } : indexRow < maxRow ? styles.row : styles.last_row);
        ws.cell(indexRow, ++indexCol)
            .string((item.company_name || '').toString())
            .style(indexRow == rowHeader ? { ...styles.header } : indexRow < maxRow ? styles.row : styles.last_row);
        ws.cell(indexRow, ++indexCol)
            .string((item.created_user || '').toString())
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
            .input('TYPE', apiHelper.getValueFromObject(queryParams, 'type'))
            .execute('MD_PRODUCTCATEGORY_GetListAttribute_AdminWeb');

        const lists = data.recordset;
        return new ServiceResponse(true, '', {
            data: producCategoryClass.listAttributes(lists),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(lists),
        });
    } catch (e) {
        logger.error(e, { function: 'ProductCategoryService.getListAttributes' });
        return new ServiceResponse(true, '', {});
    }
};

const createAttribute = async (body = {}) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        // Begin transaction
        await transaction.begin();

        const checkAttributeName = await pool
            .request()
            .input('ATTRIBUTENAME', apiHelper.getValueFromObject(body, 'attribute_name'))
            .execute('MD_PRODUCTCATEGORY_CheckAttributeName_AdminWeb');

        if (checkAttributeName.recordset[0].RESULT) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Tên thuộc tính sản phẩm đã tồn tại.');
        }

        // Save Attribute
        const requestProductAttribute = new sql.Request(transaction);
        const resultProductAttribute = await requestProductAttribute
            .input('UNITID', apiHelper.getValueFromObject(body, 'unit_id'))
            .input('ATTRIBUTENAME', apiHelper.getValueFromObject(body, 'attribute_name'))
            .input('ATTRIBUTEDESCRIPTION', apiHelper.getValueFromObject(body, 'attribute_description'))
            .input('ISCOLOR', apiHelper.getValueFromObject(body, 'is_color'))
            .input('ISFORMSIZE', apiHelper.getValueFromObject(body, 'is_form_size'))
            .input('ISOTHER', apiHelper.getValueFromObject(body, 'is_other'))
            .input('ISMATERIAL', apiHelper.getValueFromObject(body, 'is_material'))
            .input('ISACTIVE', 1)
            .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
            .execute('MD_PRODUCTCATEGORY_CreateAttribute_AdminWeb');
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
                        logger.error(error, { function: 'ProductCategoryService.SaveAttributeImage' });
                    }
                }
                const requestChild = new sql.Request(transaction);
                const resultChild = await requestChild // eslint-disable-line no-await-in-loop
                    .input('PRODUCTATTRIBUTEID', product_attribute_id)
                    .input('ATTRIBUTEVALUES', apiHelper.getValueFromObject(item, 'attribute_value'))
                    .input('ATTRIBUTEDESCRIPTION', apiHelper.getValueFromObject(item, 'attribute_description'))
                    .input('ATTRIBUTEIMAGE', attribute_image)
                    .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
                    .execute('MD_PRODUCTCATEGORY_CreateAttributeValue_AdminWeb');
                const child_id = resultChild.recordset[0].RESULT;
                if (child_id <= 0) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Thêm giá trị thuộc tính không thành công');
                }
            }
        }
        await transaction.commit();
        return new ServiceResponse(true, '', product_attribute_id);
    } catch (error) {
        await transaction.rollback();
        logger.error(error, {
            function: 'ProductCategoryService.createAttribute',
        });
        return new ServiceResponse(false, error.message);
    }
};

const getOptionsAttribute = async (productCategoryId) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PRODUCTCATEGORYID', productCategoryId)
            .execute('MD_PRODUCTCATEGORY_GetOptionsAttributeById_AdminWeb');

        return new ServiceResponse(true, 'ok', producCategoryClass.optionsAttribute(data.recordset));
    } catch (e) {
        logger.error(e, { function: 'ProductCategoryService.getOptionsAttribute' });
        return new ServiceResponse(true, '', []);
    }
};

const getOptionsProductModel = async (productCategoryId, queryParams = {}) => {
    try {
        let idCategory = productCategoryId;
        if(!productCategoryId || productCategoryId == 0) {
            idCategory = null
        }
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PRODUCTCATEGORYID', idCategory)
            .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'search'))
            .execute('MD_PRODUCTCATEGORY_GetOptionsModelById_AdminWeb');

        return new ServiceResponse(true, 'ok', producCategoryClass.optionsModel(data.recordset));
    } catch (e) {
        logger.error(e, { function: 'ProductCategoryService.getOptionsAttribute' });
        return new ServiceResponse(true, '', []);
    }
};

const getMaterialById = async (material_id) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('MATERIALID', material_id)
            .execute('MD_PRODUCTCATEGORY_GetMaterialById_AdminWeb');

        return new ServiceResponse(true, 'ok', producCategoryClass.material(data.recordset[0]));
    } catch (e) {
        logger.error(e, { function: 'ProductCategoryService.getMaterialById' });
        return new ServiceResponse(true, '', []);
    }
};

module.exports = {
    getListProductCategory,
    detail,
    createProductCategoryOrUpdate,
    deleteProductCategory,
    exportExcel,
    getOptionTreeview,
    getListAttributes,
    createAttribute,
    getOptionsAttribute,
    getOptionsProductModel,
    getMaterialById,
};
