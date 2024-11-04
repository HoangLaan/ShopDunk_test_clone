const classTrans = require('./menu-website.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const folderName = 'news';
const fileHelper = require('../../common/helpers/file.helper');
const config = require('../../../config/config');
const uuidv1 = require('uuid/v1');
const API_CONST = require('../../common/const/api.const');
const xl = require('excel4node');

const getListAsync = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getSearch(queryParams);

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('KEYWORD', `${keyword}`.trim())
            .input('WEBSITEID', apiHelper.getValueFromObject(queryParams, 'website_id'))
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'create_date_from'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'create_date_to'))
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .execute('CMS_WEBSITECATEGORY_GetList_SDCare_AdminWeb');
        let result = classTrans.list(data.recordset);

        return new ServiceResponse(true, '', {
            data: result,
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordset),
        });
    } catch (e) {
        logger.error(e, { function: 'this.getList' });
        return new ServiceResponse(true, '', {});
    }
};

const getDetailAsync = async (id = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('MENUWEBSITEID', id)
            .execute('CMS_WEBSITECATEGORY_GetById_SDCare_AdminWeb');
        let result = classTrans.detail(data.recordsets[0][0]);

        return new ServiceResponse(true, '', result);
    } catch (e) {
        logger.error(e, { function: 'this.detail' });
        return new ServiceResponse(false, e.message);
    }
};

const deleteAsync = async (bodyParams) => {
    try {
        const pool = await mssql.pool;
        await pool
            .request()
            .input('MENUWEBSITEID', apiHelper.getValueFromObject(bodyParams, 'id'))
            .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))

            .execute('CMS_WEBSITECATEGORY_Delete_SDCare_AdminWeb');
        return new ServiceResponse(true, RESPONSE_MSG.NEWS.DELETE_SUCCESS, true);
    } catch (e) {
        logger.error(e, { function: 'this.delete' });
        return new ServiceResponse(false, e.message);
    }
};

const exportExcelAsync = async (body) => {
    try {
        const params = {
            ...body,
            itemsPerPage: API_CONST.MAX_EXPORT_EXCEL,
        };
        const serviceRes = await getListAsync(params);
        const { data } = serviceRes.getData();

        // Create a new instance of a Workbook class
        const wb = new xl.Workbook();

        // Add Worksheets to the workbook
        const ws = wb.addWorksheet('Danh sách danh mục website', {});

        // Set width
        ws.column(1).setWidth(20);
        ws.column(2).setWidth(20);
        ws.column(3).setWidth(20);
        ws.column(4).setWidth(20);
        ws.column(5).setWidth(20);
        ws.column(6).setWidth(20);
        ws.column(7).setWidth(20);
        ws.column(8).setWidth(20);
        ws.column(9).setWidth(20);
        ws.column(10).setWidth(20);

        const header = {
            website_category_code: 'Mã danh mục',
            website_category_name: 'Tên danh mục',
            website_name: 'Website',
            static_content_name: 'Trang tĩnh',
            product_category_name: 'Ngành hàng',
            is_active: 'Trạng thái',
            order_index: 'Thứ tự hiển thị',
            is_top_menu: 'Hiển thị top menu',
            is_footer: 'Hiển thị footer menu',
            created_date: 'Ngày tạo',
        };

        data.unshift(header);

        // Define header style
        const headerStyle = wb.createStyle({
            font: {
                bold: true,
                color: '#FFFFFF',
            },
            fill: {
                type: 'pattern',
                patternType: 'solid',
                fgColor: '#1A3C40',
            },
        });

        // Set header row values and apply header style
        ws.cell(1, 1).style(headerStyle);
        ws.cell(1, 2).style(headerStyle);
        ws.cell(1, 3).style(headerStyle);
        ws.cell(1, 4).style(headerStyle);
        ws.cell(1, 5).style(headerStyle);
        ws.cell(1, 6).style(headerStyle);
        ws.cell(1, 7).style(headerStyle);
        ws.cell(1, 8).style(headerStyle);
        ws.cell(1, 9).style(headerStyle);
        ws.cell(1, 10).style(headerStyle);

        data.forEach((item, index) => {
            let indexRow = index + 1;
            let indexCol = 0;
            ws.cell(indexRow, ++indexCol).string((item.website_category_code || '').toString());
            ws.cell(indexRow, ++indexCol).string((item.website_category_name || '').toString());
            ws.cell(indexRow, ++indexCol).string((item.website_name || '').toString());
            ws.cell(indexRow, ++indexCol).string((item.static_content_name || '').toString());
            ws.cell(indexRow, ++indexCol).string((item.product_category_name || '').toString());
            ws.cell(indexRow, ++indexCol).string((item.is_active === 1 ? 'Hiển thị' : 'Ẩn' || '').toString());
            ws.cell(indexRow, ++indexCol).string((item.order_index || '').toString());
            ws.cell(indexRow, ++indexCol).string((item.is_top_menu ? 'Có' : 'Không' || '').toString());
            ws.cell(indexRow, ++indexCol).string((item.is_footer ? 'Có' : 'Không' || '').toString());
            ws.cell(indexRow, ++indexCol).string((item.created_date || '').toString());
        });

        return new ServiceResponse(true, '', wb);
    } catch (e) {
        logger.error(e, { function: 'this.exportExcelAsync' });
        return new ServiceResponse(true, '', {});
    }
};

const createOrUpdateAsync = async (bodyParams) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('WEBSITECATEGORYCODE', apiHelper.getValueFromObject(bodyParams, 'website_category_code'))
            .input('LANGUAGEID', apiHelper.getValueFromObject(bodyParams, 'language_id'))
            .input('WEBSITEID', apiHelper.getValueFromObject(bodyParams, 'website_id'))
            .input('WEBSITECATEGORYNAME', apiHelper.getValueFromObject(bodyParams, 'website_category_name'))
            .input('PRODUCTCATEGORYID', apiHelper.getValueFromObject(bodyParams, 'product_category_id'))
            .input('URL', apiHelper.getValueFromObject(bodyParams, 'url'))
            .input('STATICCONTENTID', apiHelper.getValueFromObject(bodyParams, 'static_content_id'))
            .input('ORDERINDEX', apiHelper.getValueFromObject(bodyParams, 'order_index'))
            .input('PARENTID', apiHelper.getValueFromObject(bodyParams, 'parent_id'))
            .input('METATITLE', apiHelper.getValueFromObject(bodyParams, 'meta_title'))
            .input('METAKEYWORDS', apiHelper.getValueFromObject(bodyParams, 'meta_keywords'))
            .input('METADESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'meta_description'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('ISTOPMENU', apiHelper.getValueFromObject(bodyParams, 'is_top_menu'))
            .input('ISFOOTER', apiHelper.getValueFromObject(bodyParams, 'is_footer'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('CMS_WEBSITECATEGORY_CreateOrUpdate_SDCare_AdminWeb');

        const staticId = data.recordset[0].RESULT;
        return new ServiceResponse(true, '', staticId);
    } catch (e) {
        // eslint-disable-next-line no-undef
        console.log(e.message);
        return new ServiceResponse(false, e.message);
    }
};

const generateNextCode = async () => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().execute('CMS_WEBSITECATEGORY_GenerateNextCode_SDCare_AdminWeb');
        const result = data.recordset[0];
        if (result) {
            return new ServiceResponse(true, '', classTrans.nextCode(result));
        }

        return new ServiceResponse(false, '', null);
    } catch (e) {
        logger.error(e, {
            function: 'this.generateNextCode',
        });

        return new ServiceResponse(false, e.message);
    }
};

const findByCodeAndId = async (object_id, object_code) => {
    try {
        const pool = await mssql.pool;
        const res = await pool
            .request()
            .input('OBJECTID', object_id)
            .input('OBJECTCODE', object_code)
            .execute('CMS_WEBSITECATEGORY_FindByCodeAndId_SDCare_AdminWeb');
        let data = res.recordset;
        if (data.length) {
            return true;
        }
        return null;
    } catch (error) {
        logger.error(error, {
            function: 'this.findByCodeAndId',
        });
        return new ServiceResponse(false, error.message);
    }
};

// eslint-disable-next-line no-undef
module.exports = {
    getListAsync,
    getDetailAsync,
    deleteAsync,
    exportExcelAsync,
    generateNextCode,
    createOrUpdateAsync,
    findByCodeAndId,
};
