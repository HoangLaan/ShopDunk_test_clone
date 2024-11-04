/* eslint-disable no-await-in-loop */
const groupCareServiceClass = require('./group-care-service.class');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const API_CONST = require('../../common/const/api.const');
const fileHelper = require('../../common/helpers/file.helper');
let xl = require('excel4node');
const readXlsxFile = require('read-excel-file/node');
const { changeToSlug } = require('../../common/helpers/string.helper');
const optionsService = require('../../common/services/options.service');
const config = require('../../../config/config');

const getListGroupCareService = async (queryParams = {}) => {
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
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'created_date_from'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'created_date_to'))
            .input('ISSHOWWEB', apiHelper.getValueFromObject(queryParams, 'is_show_web'))
            .input('ISACTIVE', apiHelper.getValueFromObject(queryParams, 'is_active'))
            .execute('MD_GROUPCARESERVICE_GetList_AdminWeb');
        return new ServiceResponse(true, '', {
            data: groupCareServiceClass.list(data.recordset),
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

const deleteGroupCareService = async (bodyParams) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    await transaction.begin();
    try {
        // Delete product attribute values
        const requestDelete = new sql.Request(transaction);
        var data = apiHelper.getValueFromObject(bodyParams, 'data');
        const dataDelete = await requestDelete
            .input('IDS', data.list_id)
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('MD_GROUPCARESERVICE_DeleteById_AdminWeb');
        const resultDelete = dataDelete.recordset[0].RESULT;
        if (resultDelete <= 0) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Xóa nhóm dịch vụ không thành công.');
        }

        await transaction.commit();
        return new ServiceResponse(true, 'ok');
    } catch (e) {
        logger.error(e, { function: 'ProductService.deleteProduct' });
        await transaction.rollback();
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
            .execute('MD_GROUPSERVICE_GetOptions_AdminWeb');

        return new ServiceResponse(true, 'ok', groupCareServiceClass.options(data.recordset));
    } catch (e) {
        logger.error(e, { function: 'GroupService.getOptions' });
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

const createOrUpdateGroupCareService = async (bodyParams) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        console.log(bodyParams, '=======>')
        await transaction.begin();
        const id = apiHelper.getValueFromObject(bodyParams, 'group_service_id');

        let large_images_url = apiHelper.getValueFromObject(bodyParams, 'large_images');
        let medium_images_url = apiHelper.getValueFromObject(bodyParams, 'medium_images');
        let small_images_url = apiHelper.getValueFromObject(bodyParams, 'small_images');
        let strLargUrl = large_images_url?.length > 0 ? large_images_url[0] : '';
        let strMediumUrl = medium_images_url?.length > 0 ? medium_images_url[0] : '';
        let strSmallUrl = small_images_url?.length > 0 ? small_images_url[0] : '';
        large_images_url = await saveImage(strLargUrl.replace(config.domain_cdn, ""));
        medium_images_url = await saveImage(strMediumUrl.replace(config.domain_cdn, ""));
        small_images_url = await saveImage(strSmallUrl.replace(config.domain_cdn, ""));

        console.log('small_images_url:', small_images_url);
        console.log('medium_images_url:', medium_images_url);
        console.log('medium_images_url:', medium_images_url);


        // Check group service code
        const dataCheck = await pool
            .request()
            .input('GROUPSERVICECODE', apiHelper.getValueFromObject(bodyParams, 'group_service_code'))
            .input('GROUPSERVICENAME', apiHelper.getValueFromObject(bodyParams, 'group_service_name'))
            .execute('MD_GROUPCARESERVICE_CheckName_AdminWeb');
        if (dataCheck.recordset && dataCheck.recordset[0].RESULT == 1) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Tên hoặc mã dịch vụ đã tồn tại.', null);
        }
        // Insert MD_GROUPSERVICE VN
        const data = new sql.Request(transaction);
        const dataResult = await data
            .input('GROUPSERVICEID', apiHelper.getValueFromObject(bodyParams, 'group_service_id'))
            .input('GROUPSERVICECODE', apiHelper.getValueFromObject(bodyParams, 'group_service_code'))
            .input('GROUPSERVICENAME', apiHelper.getValueFromObject(bodyParams, 'group_service_name'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('ORDERINDEX', apiHelper.getValueFromObject(bodyParams, 'order_index'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .input('SMALLIMAGEURL', small_images_url)
            .input('MEDIUMIMAGEURL', medium_images_url)
            .input('LARGEIMAGEURL', large_images_url)
            .input('LANGUAGEID', 1)
            .input('ISSHOWWEB', apiHelper.getValueFromObject(bodyParams, 'is_show_web'))
            .input('PARENTID', apiHelper.getValueFromObject(bodyParams, 'parent_id'))
            // .input('STEP', apiHelper.getValueFromObject(bodyParams, 'steps'))
            .input('SEONAME', apiHelper.getValueFromObject(bodyParams, 'seo_name'))
            .input('METATITLE', apiHelper.getValueFromObject(bodyParams, 'meta_title'))
            .input('METADESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'meta_description'))
            .input('METAKEYWORDS', apiHelper.getValueFromObject(bodyParams, 'meta_key_words'))
            .execute('MD_GROUPCARESERVICE_CreateOrUpdate_AdminWeb');
        // Insert MD_GROUPSERVICE En

        const dataResultEN = await data
            .input('GROUPSERVICEID', apiHelper.getValueFromObject(bodyParams, 'group_service_id'))
            .input('GROUPSERVICECODE', apiHelper.getValueFromObject(bodyParams, 'group_service_code'))
            .input('GROUPSERVICENAME', apiHelper.getValueFromObject(bodyParams, 'group_service_name_en'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('ORDERINDEX', apiHelper.getValueFromObject(bodyParams, 'order_index'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .input('SMALLIMAGEURL', small_images_url)
            .input('MEDIUMIMAGEURL', medium_images_url)
            .input('LARGEIMAGEURL', large_images_url)
            .input('LANGUAGEID', 2)
            .input('ISSHOWWEB', apiHelper.getValueFromObject(bodyParams, 'is_show_web'))
            .input('PARENTID', apiHelper.getValueFromObject(bodyParams, 'parent_id'))
            // .input('STEP', apiHelper.getValueFromObject(bodyParams, 'steps'))
            .input('SEONAME', apiHelper.getValueFromObject(bodyParams, 'seo_name_en'))
            .input('METATITLE', apiHelper.getValueFromObject(bodyParams, 'meta_title_en'))
            .input('METADESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'meta_description_en'))
            .input('METAKEYWORDS', apiHelper.getValueFromObject(bodyParams, 'meta_key_words_en'))
            .execute('MD_GROUPCARESERVICE_CreateOrUpdate_AdminWeb');
        const careServiceId = dataResult.recordset[0].RESULT;

        if (careServiceId <= 0) {
            await transaction.rollback();
            return new ServiceResponse(false, `${id ? 'Cập nhật' : 'Thêm mới'} nhóm dịch vụ không thành công.`);
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

const detailGroupCareService = async (groupCareServiceCode) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().input('GROUPSERVICECODE', groupCareServiceCode).execute('GROUP_CARE_SERVICE_GetById_AdminWeb');
        let groupService = groupCareServiceClass.detail(data?.recordsets[0][0]);
        if (!groupService) return new ServiceResponse(false, 'Không tìm thấy dữ liệu');
        return new ServiceResponse(true, 'ok', groupService);
    } catch (e) {
        logger.error(e, {
            function: 'GroupService.detailGroupService',
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

const saveImage = async (image) => {
    let imageUrl = '';
    if (fileHelper.isBase64(image)) {
        imageUrl = await fileHelper.saveBase64(null, image);
        console.log('imageUrl++++++++',imageUrl)
    } else if (image) {
        imageUrl = image;
    } else {
        imageUrl = null;
    }
    return imageUrl;
}

///generate-group-code

const generateGroupCode = async () => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .execute('MD_GROUPSERVICE_Generate_code_admin');

        return new ServiceResponse(true, 'ok', data.recordset);
    } catch (e) {
        logger.error(e, { function: 'groupService.getLastId' });
        return new ServiceResponse(true, '', {});
    }
};

module.exports = {
    getListGroupCareService,
    deleteGroupCareService,
    createOrUpdateGroupCareService,
    detailGroupCareService,
    optionGroupService,
    getOptionsProduct,
    getOptionsStockType,
    exportExcel,
    downloadExcel,
    importExcel,
    generateGroupCode
};
