/* eslint-disable no-await-in-loop */
const careServiceClass = require('./care-service.class');
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
const { Console } = require('winston/lib/winston/transports');

const getListCareService = async (queryParams = {}) => {
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
            .input('GROUPSERVICECODE', apiHelper.getValueFromObject(queryParams, 'group_service_code'))
            .input('ISSHOWWEB', apiHelper.getValueFromObject(queryParams, 'is_show_web', 2))
            .input('ISACTIVE', apiHelper.getValueFromObject(queryParams, 'is_active', 2))
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'create_date_from'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'create_date_to'))
            .execute('MD_CARESERVICE_GetList_AdminWeb');

        return new ServiceResponse(true, '', {
            data: careServiceClass.list(data.recordset),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordset),
        });
    } catch (e) {
        logger.error(e, {
            function: 'Care-ServiceService.getListCareService',
        });
        return new ServiceResponse(false, e.message);
    }
};

const generateCareCode = async () => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .execute('MD_CARESERVICE_Generate_code_admin');

        return new ServiceResponse(true, 'ok', data.recordset);
    } catch (e) {
        logger.error(e, { function: 'groupService.getLastId' });
        return new ServiceResponse(true, '', {});
    }
};

const deleteCareService = async (bodyParams) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    await transaction.begin();
    try {
        const requestDelete = new sql.Request(transaction);
        const dataDelete = await requestDelete
            .input('IDS', apiHelper.getValueFromObject(bodyParams.data, 'list_id'))
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('Care_Service_DeleteById_AdminWeb');
        const resultDelete = dataDelete.recordset[0].RESULT;
        if (resultDelete <= 0) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Xóa dịch vụ không thành công.');
        }
        await transaction.commit();
        return new ServiceResponse(true, 'ok');
    } catch (e) {
        logger.error(e, { function: 'CareService.deleteCareservice' });
        await transaction.rollback();
        return new ServiceResponse(false, e.message);
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

const createOrUpdateCareService = async (bodyParams) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        await transaction.begin();
        const id = apiHelper.getValueFromObject(bodyParams, 'care_service_code');
        const CARESERVICEID = apiHelper.getValueFromObject(bodyParams, 'care_service_id');
        const CARESERVICECODE = apiHelper.getValueFromObject(bodyParams, 'care_service_code');

        // Check product code
        const dataCheck = await pool
            .request()
            .input('CARESERVICECODE', apiHelper.getValueFromObject(bodyParams, 'care_service_code'))
            .input('CARESERVICENAME', apiHelper.getValueFromObject(bodyParams, 'care_service_name'))

        const data = new sql.Request(transaction);
        const dataResult = await data
            .input('CARESERVICECODE', apiHelper.getValueFromObject(bodyParams, 'care_service_code'))
            .input('GROUPSERVICECODE', apiHelper.getValueFromObject(bodyParams, 'group_service_code'))
            .input('CARESERVICEID', apiHelper.getValueFromObject(bodyParams, 'care_service_id'))
            .input('GROUPSERVICEID', apiHelper.getValueFromObject(bodyParams, 'group_care_service_id'))
            .input('CARESERVICENAME', apiHelper.getValueFromObject(bodyParams, 'care_service_name'))
            .input('TYPETIMEREPAIR', apiHelper.getValueFromObject(bodyParams, 'type_time_repair'))
            .input('TIMEREPAIREFROM', apiHelper.getValueFromObject(bodyParams, 'type_time_repair_from'))
            .input('TIMEREPAIRETO', apiHelper.getValueFromObject(bodyParams, 'type_time_repair_to'))
            .input('COSTSERVICE', apiHelper.getValueFromObject(bodyParams, 'cost_service'))
            .input('COSTPROMOTION', apiHelper.getValueFromObject(bodyParams, 'cost_promotion'))
            .input('COSTENGINEER', apiHelper.getValueFromObject(bodyParams, 'cost_engineer'))
            .input('TOTALCOSTPRODUCT', apiHelper.getValueFromObject(bodyParams, 'total_cost_product'))
            .input('WARRANTYPERIODID', apiHelper.getValueFromObject(bodyParams, 'warranty_perio_id'))
            .input('PROMOTIONID', apiHelper.getValueFromObject(bodyParams, 'promotion_id'))
            .input('ISSUESDEVICE', apiHelper.getValueFromObject(bodyParams, 'issues_device'))
            .input('LANGUAGEID', 1)
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
            .input('CONTENT', apiHelper.getValueFromObject(bodyParams, 'content'))
            .input('ISHOT', apiHelper.getValueFromObject(bodyParams, 'is_hot'))
            .input('ORDERINDEX', apiHelper.getValueFromObject(bodyParams, 'order_index'))
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('ISSTOPSELLING', apiHelper.getValueFromObject(bodyParams, 'is_stop_selling'))
            .input('STOPSELLINGFROM', apiHelper.getValueFromObject(bodyParams, new Date().getTime()))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .input('ISSHOWWEB', apiHelper.getValueFromObject(bodyParams, 'is_showweb'))
            .input('SEONAME', apiHelper.getValueFromObject(bodyParams, 'seo_name'))
            .input('METATITLE', apiHelper.getValueFromObject(bodyParams, 'meta_title'))
            .input('METADESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'meta_discription'))
            .input('METAKEYWORDS', apiHelper.getValueFromObject(bodyParams, 'meta_keywords'))

            .execute('MD_CARESERVICE_CreateOrupdate_AdminWeb');

        // Insert MD_PRODUCT ENG

        const dataResultEN = await data
            .input('CARESERVICEID', apiHelper.getValueFromObject(bodyParams, 'care_service_id'))
            .input('CARESERVICECODE', apiHelper.getValueFromObject(bodyParams, 'care_service_code'))
            .input('CARESERVICENAME', apiHelper.getValueFromObject(bodyParams, 'care_service_name_en'))
            .input('LANGUAGEID', 2)
            .input('ISHOT', apiHelper.getValueFromObject(bodyParams, 'is_hot'))
            .input('ORDERINDEX', apiHelper.getValueFromObject(bodyParams, 'order_index'))
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('ISSTOPSELLING', apiHelper.getValueFromObject(bodyParams, 'is_stop_selling'))
            .input('STOPSELLINGFROM', apiHelper.getValueFromObject(bodyParams, new Date().getTime()))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .input('ISSHOWWEB', apiHelper.getValueFromObject(bodyParams, 'is_showweb'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description_en'))
            .input('CONTENT', apiHelper.getValueFromObject(bodyParams, 'content_en'))
            .input('SEONAME', apiHelper.getValueFromObject(bodyParams, 'seo_name_en'))
            .input('METATITLE', apiHelper.getValueFromObject(bodyParams, 'meta_title_en'))
            .input('METADESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'meta_discription_en'))
            .input('METAKEYWORDS', apiHelper.getValueFromObject(bodyParams, 'meta_keywords_en'))
            .execute('MD_CARESERVICE_CreateOrupdate_AdminWeb');

        const careServiceId = dataResult?.recordset[0].RESULT;

        if (careServiceId <= 0) {
            await transaction.rollback();
            return new ServiceResponse(false, `${id ? 'Cập nhật' : 'Thêm mới'} sản phẩm không thành công.`);
        }


        //const productId = bodyParams.product_list[0].product_id;
        // Insert MD_CARESERVICE_Product_Repair_CreateOrUpdate_AdminWeb
        if (bodyParams.product_list && bodyParams.product_list.length > 0) {
            console.log(bodyParams.product_list, 'product_list');
            ///Delete produc
            const requestProductDel = new sql.Request(transaction);
            const resultProductDel = await requestProductDel
                .input('CARESERVICECODE', CARESERVICECODE)
                .execute('MD_CARESERVICE_Product_Repair_Delete_AdminWeb');
            if (resultProductDel.recordset[0].RESULT <= 0) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Xóa sản phẩm không thành công.');
            }

            for (var i = 0; i < bodyParams.product_list.length; i++) {
                const productId = bodyParams.product_list[i]?.product_id;
                if (productId) {
                    const inserPrePairCareSVProduct = new sql.Request(transaction);
                    const prepairProductSV = await inserPrePairCareSVProduct
                        .input('CARESERVICEID', CARESERVICEID)
                        .input('CARESERVICECODE', id)
                        .input('PRODUCTID', productId)
                        .input('MODELID', apiHelper.getValueFromObject(bodyParams, 'model_id'))
                        .input('PRODUCTCATEGORYID', apiHelper.getValueFromObject(bodyParams, 'product_category_id'))
                        .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                        .input('QUANTITY', bodyParams.product_list[i]?.quantity)
                        .input('TOTALMONEY', bodyParams.product_list[i]?.total_money)
                        .execute('MD_CARESERVICE_Product_Repair_CreateOrUpdate_AdminWeb');

                    const prepairResult = prepairProductSV?.recordset[0].RESULT;
                    if (prepairResult <= 0) {
                        await transaction.rollback();
                        return new ServiceResponse(false, 'Thêm sản phẩm vào dịch vụ không thành công.');
                    }
                }
            }
        }

        //Insert MD_CARESERVICE_Product_relate_CreateOrUpdate_AdminWeb
        if (bodyParams.product_relate && bodyParams.product_relate.length > 0) {
            ///Delete produc
            const requestProductDel = new sql.Request(transaction);
            const resultProductDel = await requestProductDel
                .input('CARESERVICECODE', CARESERVICECODE)
                //.input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .execute('MD_CARESERVICE_Product_relate_Delete_AdminWeb');
            if (resultProductDel.recordset[0].RESULT <= 0) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Xóa sản phẩm không thành công.');
            }
            for (var i = 0; i < bodyParams.product_relate.length; i++) {
                const productRelate = bodyParams.product_relate[i].product_id;
                if (productRelate) {
                    const insertRelateProduct = new sql.Request(transaction);
                    const relateProductSV = await insertRelateProduct
                        .input('CARESERVICECODE', CARESERVICECODE)
                        .input('PRODUCTID', productRelate)
                        .input('ORDERINDEX', bodyParams.product_relate[i].orderindex)
                        .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                        .execute('MD_CARESERVICE_Product_relate_CreateOrUpdate_AdminWeb');

                    const relateResult = relateProductSV?.recordset[0].RESULT;
                    if (relateResult <= 0) {
                        await transaction.rollback();
                        return new ServiceResponse(false, 'Thêm sản phẩm vào dịch vụ không thành công.');
                    }
                }
            }
        }

        if (bodyParams.promotion_list && bodyParams.promotion_list.length > 0) {
            ///Delete produc
            const requestProductDel = new sql.Request(transaction);
            const resultProductDel = await requestProductDel
                .input('CARESERVICECODE', CARESERVICECODE)
                .execute('MD_CARESERVICE_Promotion_Delete_AdminWeb');
            if (resultProductDel.recordset[0].RESULT <= 0) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Xóa Promotion không thành công.');
            }
            for (var i = 0; i < bodyParams.promotion_list.length; i++) {
                const promtionId = bodyParams.promotion_list[i].promotion_id;
                const inserPrePairCareSVProduct = new sql.Request(transaction);
                const prepairProductSV = await inserPrePairCareSVProduct
                    .input('CARESERVICECODE', CARESERVICECODE)
                    .input('PROMOTIONID', promtionId)
                    .input('ORDERINDEX', apiHelper.getValueFromObject(bodyParams, 'orderindex'))
                    .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                    .execute('MD_CARESERVICE_Promotion_CreateOrUpdate_AdminWeb');

                const prepairResult = prepairProductSV?.recordset[0].RESULT;
                if (prepairResult <= 0) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Thêm sản phẩm vào dịch vụ không thành công.');
                }
            }
        }

        // Insert MD_CARESERVICEIMAGE
        const images = apiHelper.getValueFromObject(bodyParams, 'careServiceImages');
        if (images && images.length) {

            // Delete images
            const requestImagesDel = new sql.Request(transaction);
            const resultImagesDel = await requestImagesDel
                .input('CARESERVICECODE', CARESERVICECODE)
                .execute('MD_CARESERVICEIMAGES_Delete_AdminWeb');
            if (resultImagesDel.recordset.RESULT <= 0) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Xóa hình ảnh không thành công.');
            }

            for (let i = 0; i < images.length; i++) {
                const CARESERVICEIMAGEID = images.care_service_image_id;
                let picture_url;
                if (!images[i].picture_url) {
                    if (fileHelper.isBase64(images[i])) {
                        picture_url = await fileHelper.saveBase64(null, images[i]);
                    }
                }
                picture_url = picture_url || images[i].picture_url?.replace(config.domain_cdn, '');
                const requestCreateImage = new sql.Request(transaction);
                const resultCreateOmage = await requestCreateImage
                    .input('CARESERVICEIMAGEID', CARESERVICEIMAGEID)
                    .input('CARESERVICECODE', CARESERVICECODE)
                    .input('PICTUREURL', picture_url)
                    .input('PICTUREALIAS', images[i].picture_alias)
                    .input('ORDERINDEX', images[i].order_index)
                    .input('ISVIDEO', images[i].is_video)
                    .input('ISDEFAULT', 1)
                    .execute('MD_CARESERVICEIMAGES_Create_AdminWeb');

                const result = resultCreateOmage?.recordset[0].RESULT;
                if (result <= 0) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Thêm hình ảnh không thành công.');
                }
            }
        }

        await transaction.commit();
        return new ServiceResponse(true, 'ok', careServiceId);
    } catch (e) {
        await transaction.rollback();
        logger.error(e, { function: 'careService.createProductOrUpdate' });
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

const detailCareService = async (careServiceCode) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request()
            .input('CARESERVICECODE', careServiceCode)
            .execute('CARE_SERVICE_GetById_AdminWeb');

        let careService = careServiceClass.detail(data?.recordsets[0][0]);
        if (!careService) return new ServiceResponse(false, 'Không tìm thấy dịch vụ');

        const productReq = await pool.request()
            .input('CARESERVICECODE', careServiceCode)
            .execute('CARE_SERVICE_GetById_AdminWeb');
        let product_list = careServiceClass.product(productReq.recordsets[3]);
        careService.product_list = product_list;

        let product_relate = careServiceClass.productRelate(productReq.recordsets[2]);
        careService.product_relate = product_relate;

        let promotion_list = careServiceClass.promotion(productReq.recordsets[4]);
        careService.promotion_list = promotion_list;

        let careServiceImages = careServiceClass.careServiceImages(productReq.recordsets[1]);
        careService.careServiceImages = careServiceImages;

        return new ServiceResponse(true, 'ok', careService);
    } catch (e) {
        logger.error(e, {
            function: 'careService.detailCareService',
        });
        return new ServiceResponse(false, e.message);
    }
};


const optionGroupService = async (queryParams = {}) => {
    try {
        const keyword = apiHelper.getSearch(queryParams);
        const limit = apiHelper.getValueFromObject(queryParams, 'limit', 100);

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('KEYWORD', keyword)
            .input('LIMIT', limit)
            .execute('MD_CARESERVICE_GetOptions_AdminWeb');

        return new ServiceResponse(true, 'ok', careServiceClass.options(data.recordset));
    } catch (e) {
        logger.error(e, { function: 'GroupService.getOptions' });
        return new ServiceResponse(true, '', {});
    }
};


const optionGroupPeriod = async (queryParams = {}) => {
    try {
        const keyword = apiHelper.getSearch(queryParams);
        const limit = apiHelper.getValueFromObject(queryParams, 'limit', 100);

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('KEYWORD', keyword)
            .input('LIMIT', limit)
            .execute('MD_CARESERVICE_GetPeriod_AdminWeb');

        return new ServiceResponse(true, 'ok', careServiceClass.options(data.recordset));
    } catch (e) {
        logger.error(e, { function: 'GroupService.getOptions' });
        return new ServiceResponse(true, '', {});
    }
};

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
            //.input('PRICE', apiHelper.getValueFromObject(queryParams, 'price'))
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
            .execute('MD_PRODUCT_REPAIR_GetList_AdminWeb');
        console.log(careServiceClass.listProduct(data.recordset), 'data.recordset')
        return new ServiceResponse(true, '', {
            data: careServiceClass.listProduct(data.recordset),
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



const exportExcel = async (queryParams = {}) => {
    queryParams.itemsPerPage = API_CONST.MAX_EXPORT_EXCEL;
    queryParams.is_active = 2;
    const serviceRes = await getListCareService(queryParams);
    const { data } = serviceRes.getData();

    if (!data || data.length === 0) {
        return new ServiceResponse(false, 'Không có dữ liệu để xuất file excel.');
    }

    // Create a new instance of a Workbook class
    const wb = new xl.Workbook();
    // Add Worksheets to the workbook
    const ws = wb.addWorksheet('List CareService', {});
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

module.exports = {
    getListProduct,
    generateCareCode,
    optionGroupService,
    optionGroupPeriod,
    getListCareService,
    deleteCareService,
    createOrUpdateCareService,
    detailCareService,
    getOptionsStock,
    getOptionsProduct,
    getOptionsStockType,
    exportExcel,
    importExcel
};
