const newsClass = require('../static-content/static-content.class');
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

const getListStatic = async (queryParams = {}) => {
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
            .input('EXCLUDEID', apiHelper.getValueFromObject(queryParams, 'exclude_id'))
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'create_date_from'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'create_date_to'))
            //.input('ISVIDEO', parseInt(apiHelper.getValueFromObject(queryParams, 'news_type')) === 1 ? 1 : null)
            //.input('ISHIGHLIGHT', parseInt(apiHelper.getValueFromObject(queryParams, 'news_type')) === 2 ? 1 : null)
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))

            .execute('MD_STATICCONTENT_GetList_AdminWeb');
            //let static = newsClass.list(data.recordset);
            // news = news.map(item => {
            //     let news_type = item.news_type;
            //     news_type = news_type ? news_type.substring(0, news_type.length - 1) : null;
            //     return {
            //         ...item,
            //         news_type,
            //     };
            // });
            console.log(apiHelper.getTotalData(data.recordset));
    
            return new ServiceResponse(true, '', {
                data: newsClass.list(data.recordset),
                page: currentPage,
                limit: itemsPerPage,
                total: apiHelper.getTotalData(data.recordset),
            });

            
        } catch (e) {
            logger.error(e, {function: 'newsService.getListStatic'});
            return new ServiceResponse(true, '', {});
        }
        
};

const detailStatic = async (static_code, bodyParams={}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().input('STATICCONTENTCODE', static_code).execute('MD_STATICCONTENT_GetById_AdminWeb');
        let static = newsClass.detail(data.recordsets[0][0]);
        
        console.log(static);

        static.is_can_edit = 1
        // Kiểm tra nếu là có trạng thái is_system = 1
        // ==> kiểm tra xem user login có phải administrator hay không
        //==> nếu administrator thì không cho phép chỉnh sửa
        const auth_name =  apiHelper.getValueFromObject(bodyParams, 'auth_name') 
        if(static.is_system == 1 && auth_name !='administrator'){
            static.is_can_edit = 0
        }
        return new ServiceResponse(true, '', static);
    } catch (e) {
        logger.error(e, {function: 'newsService.detailStatic'});
        return new ServiceResponse(false, e.message);
    }
};

const createStaticOrUpdate = async bodyParams => {
    try {
        const params = bodyParams;
        if (params.image_url) {
            const image_url = await saveImage(params.image_url);
            if (image_url) params.image_url = image_url;
            else return new ServiceResponse(false, RESPONSE_MSG.NEWS.UPLOAD_FAILED);
        }

        if (params.image_url_en) {
            const image_url_en = await saveImage(params.image_url_en);
            if (image_url_en) params.image_url_en = image_url_en;
            else return new ServiceResponse(false, RESPONSE_MSG.NEWS.UPLOAD_FAILED);
        }
        // if (params.banner_url) {
        //     const banner_url = await saveImage(params.banner_url);
        //     if (banner_url)
        //         params.banner_url = banner_url;
        //     else
        //         return new ServiceResponse(false, RESPONSE_MSG.NEWS.UPLOAD_FAILED);
        // }
        const pool = await mssql.pool;
        


        // Insert MD_STATICCONTENT VN
        const data = await pool
            .request()
            .input('STATICCONTENTID', apiHelper.getValueFromObject(bodyParams, 'static_id'))
            .input('STATICCONTENTNAME', apiHelper.getValueFromObject(bodyParams, 'static_name'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
            // .input('ISVIDEO', apiHelper.getValueFromObject(bodyParams, 'is_video'))
            .input('IMAGEURL', params.image_url)
            .input('ORDERINDEX', apiHelper.getValueFromObject(bodyParams, 'order_index'))
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('STATICCONTENTCODE', apiHelper.getValueFromObject(bodyParams, 'static_code'))
            .input('INCLUDEINTOPMENU', apiHelper.getValueFromObject(bodyParams, 'includeintopmenu'))
            .input('INCLUDEINFOOTERCOLUMN1', apiHelper.getValueFromObject(bodyParams, 'includeinfootercolumn1'))
            .input('INCLUDEINFOOTERCOLUMN2', apiHelper.getValueFromObject(bodyParams, 'includeinfootercolumn2'))
            .input('INCLUDEINFOOTERCOLUMN3', apiHelper.getValueFromObject(bodyParams, 'includeinfootercolumn3'))
            .input('LANGUAGEID', 1)
            .input('KEYWORD', apiHelper.getValueFromObject(bodyParams, 'keyword'))
            .input('SEONAME', apiHelper.getValueFromObject(bodyParams, 'meta_key_words'))
            .input('METATITLE', apiHelper.getValueFromObject(bodyParams, 'meta_description'))
            .input('METADESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'meta_title'))
            .input('METAKEYWORDS', apiHelper.getValueFromObject(bodyParams, 'seo_name'))
            .input('GROUPSERVICECODE', apiHelper.getValueFromObject(bodyParams, 'group_service_code'))
            .input('STATICLINK', apiHelper.getValueFromObject(bodyParams, 'static_link'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))

            
            
            .execute('MD_STATICCONTENT_CreateOrUpdate_AdminWeb');
        
            // Insert MD_STATICCONTENT EN
            const dataEN = await pool
            .request()
            .input('STATICCONTENTID', apiHelper.getValueFromObject(bodyParams, 'static_id'))
            .input('STATICCONTENTCODE', apiHelper.getValueFromObject(bodyParams, 'static_code'))
            .input('STATICCONTENTNAME', apiHelper.getValueFromObject(bodyParams, 'static_name_en'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description_en'))
            .input('LANGUAGEID', 2)
            .input('SEONAME', apiHelper.getValueFromObject(bodyParams, 'meta_key_words_en'))
            .input('METATITLE', apiHelper.getValueFromObject(bodyParams, 'meta_description_en'))
            .input('METADESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'meta_title_en'))
            .input('METAKEYWORDS', apiHelper.getValueFromObject(bodyParams, 'seo_name_en'))
            .input('STATICLINK', apiHelper.getValueFromObject(bodyParams, 'static_link_en'))
            .input('ORDERINDEX', apiHelper.getValueFromObject(bodyParams, 'order_index_en'))
            .input('KEYWORD', apiHelper.getValueFromObject(bodyParams, 'keyword_en'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .input('IMAGEURL', params.image_url_en)

            .execute('MD_STATICCONTENT_CreateOrUpdate_AdminWeb');
    
        const staticId = data.recordset[0].RESULT;
        const id = apiHelper.getValueFromObject(bodyParams, 'static_id');
        return new ServiceResponse(true, '', staticId);
    } catch (e) {
        // logger.error(e, {'function': 'newsService.createNewsOrUpdate'});
        console.log(e.message);
        return new ServiceResponse(false, e.message);
    }
};

const deleteStatic = async bodyParams => {
    try {
        const pool = await mssql.pool;
        await pool
        
            .request()
            .input('STATICCONTENTID', apiHelper.getValueFromObject(bodyParams, 'ids'))
            .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            
            .execute('MD_STATICCONTENT_Delete_AdminWeb');
            console.log("vafoooooo")
        return new ServiceResponse(true, RESPONSE_MSG.NEWS.DELETE_SUCCESS, true);
    } catch (e) {
        logger.error(e, {function: 'newsService.deleteStatic'});
        return new ServiceResponse(false, e.message);
    }
};

const saveImage = async base64 => {
    let url = null;
    try {
        if (fileHelper.isBase64(base64)) {
            const extentions = ['.jpeg', '.jpg', '.png', '.gif'];
            const extention = fileHelper.getExtensionFromBase64(base64, extentions);
            if (extention) {
                const guid = createGuid();
                url = await fileHelper.saveBase64(folderName, base64, `${guid}.${extention}`);
            }
        } else {
            url = base64.split(config.domain_cdn)[1];
        }
    } catch (e) {
        logger.error(e, {
            function: 'newsService.saveImage',
        });
    }
    return url || '/';
};

const findByStaticCode = async (static_code, static_id) => {
    try {
        const pool = await mssql.pool;
        const res = await pool
            .request()
            .input('STATICCONTENTID', static_id)
            .input('STATICCONTENTCODE', static_code)
            .execute('MD_STATICCONTENT_findCode_AdminWeb');
        let data = res.recordset;
        if (data.length) {
            return true;
        }
        return null;
    } catch (error) {
        logger.error(error, {
            function: 'AccountService.findByCustomerCode',
        });
        return new ServiceResponse(false, error.message);
    }
};


const exportExcel = async (body) => {
    try {
        const params = {
          ...body,
          itemsPerPage: API_CONST.MAX_EXPORT_EXCEL,
        }
        const serviceRes = await getListStatic(params);
        const { data } = serviceRes.getData();

        // Create a new instance of a Workbook class
        const wb = new xl.Workbook();

        // Add Worksheets to the workbook
        const ws = wb.addWorksheet('Danh sách trang tĩnh', {});

        // Set width
        ws.column(1).setWidth(20);
        ws.column(2).setWidth(20);
        ws.column(3).setWidth(20);
        ws.column(4).setWidth(20);

        const header = {
            static_code: 'Mã trang tĩnh',
            static_name: 'Tên trang tĩnh',
            keyword: 'Keywords',
            is_active: 'Trạng thái',
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

        data.forEach((item, index) => {
            let indexRow = index + 1;
            let indexCol = 0;
            ws.cell(indexRow, ++indexCol).string((item.static_code || '').toString());
            ws.cell(indexRow, ++indexCol).string((item.static_name || '').toString());
            ws.cell(indexRow, ++indexCol).string((item.keyword || '').toString());
            ws.cell(indexRow, ++indexCol).string(index === 0 ? item.is_active : item.is_active ? 'Hiển Thị' : 'Ẩn');

        });

        return new ServiceResponse(true, '', wb);
    } catch (e) {
        logger.error(e, { function: 'customerCareService.exportExcel' });
        return new ServiceResponse(true, '', {});
    }
};




const StaticGenCode = async () => {
    try {
        const pool = await mssql.pool;
        
        const data = await pool.request().execute('MD_STATICCONTENT_GenCustomerCode');
        //console.log(data)

        const Static = data.recordset[0];

        if (Static) {
            return new ServiceResponse(true, '', newsClass.StaticGenCode(Static));
        }
        
        
        return new ServiceResponse(false, '', null);
    } catch (e) {
        logger.error(e, {
            function: 'AccountService.StaticGenCode',
        });

        return new ServiceResponse(false, e.message);
    }
};


const createGuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        var r = (Math.random() * 16) | 0,
            v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};

const deleteNewsRelated = async (newsId, bodyParams) => {
    try {
        const pool = await mssql.pool;
        await pool
            .request()
            .input('PARENTID', newsId)
            .input('NEWSID', apiHelper.getValueFromObject(bodyParams, 'news_id'))
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute(PROCEDURE_NAME.NEWS_NEWSRELATED_DELETE_ADMINWEB);
        return new ServiceResponse(true, RESPONSE_MSG.CRUD.DELETE_SUCCESS, true);
    } catch (e) {
        logger.error(e, {function: 'newsService.deleteNewsRelated'});
        return new ServiceResponse(false, e.message);
    }
};

const getListNewsInside = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .execute(PROCEDURE_NAME.NEWS_NEWS_GETLISTINSIDE_ADMINWEB);
        const news = data.recordset;

        return new ServiceResponse(true, '', {
            data: newsClass.listInside(news),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(news),
        });
    } catch (e) {
        logger.error(e, {function: 'newsService.getListNewsInside'});
        return new ServiceResponse(true, '', {});
    }
};

const detailNewsInside = async newsId => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('NEWSID', newsId)
            .execute(PROCEDURE_NAME.NEWS_NEWS_GETBYIDINSIDE_ADMINWEB);
        let news = newsClass.detailInside(data.recordsets[0][0]);
        let related = newsClass.listInside(data.recordsets[1]);
        news.related = related;
        return new ServiceResponse(true, '', news);
    } catch (e) {
        logger.error(e, {function: 'newsService.detailNewsInside'});
        return new ServiceResponse(false, e.message);
    }
};

const createOption = label => ({
    label,
    value: uuidv1(),
});

///generate-group-code

const generateGroupCode = async () => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .execute('MD_STATICCONTENT_Generate_code_admin');

        return new ServiceResponse(true, 'ok', data.recordset);
    } catch (e) {
        logger.error(e, { function: 'groupService.getLastId' });
        return new ServiceResponse(true, '', {});
    }
};

module.exports = {
    generateGroupCode,
    exportExcel,
    findByStaticCode,
    StaticGenCode,
    getListStatic,
    detailStatic,
    createStaticOrUpdate,
    deleteStatic,
    deleteNewsRelated,
    getListNewsInside,
    detailNewsInside,
};
