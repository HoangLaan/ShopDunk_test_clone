const newsClass = require('../news/news.class');
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

const getListNews = async (queryParams = {}) => {
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

            .input('ISVIDEO', parseInt(apiHelper.getValueFromObject(queryParams, 'news_type')) === 1 ? 1 : null)
            .input('ISHIGHLIGHT', parseInt(apiHelper.getValueFromObject(queryParams, 'news_type')) === 2 ? 1 : null)
            .input(
                'ISSHOWPRODUCTGIFT',
                parseInt(apiHelper.getValueFromObject(queryParams, 'news_type')) === 3 ? 1 : null,
            )

            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .execute(PROCEDURE_NAME.NEWS_NEWS_GETLIST_ADMINWEB);
        let news = newsClass.list(data.recordset);
        news = news.map(item => {
            let news_type = item.news_type;
            news_type = news_type ? news_type.substring(0, news_type.length - 1) : null;
            return {
                ...item,
                news_type,
            };
        });
        console.log(apiHelper.getTotalData(data.recordset));
        return new ServiceResponse(true, '', {
            data: news,
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordset),
        });
    } catch (e) {
        logger.error(e, {function: 'newsService.getListNews'});
        return new ServiceResponse(true, '', {});
    }
};

const detailNews = async (newsId, bodyParams={}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().input('NEWSID', newsId).execute(PROCEDURE_NAME.NEWS_NEWS_GETBYID_ADMINWEB);
        let news = newsClass.detail(data.recordsets[0][0]);
        let news_related_list = newsClass.related(data.recordsets[1]);
        news_related_list = news_related_list.map(item => {
            let news_type = item.news_type;
            news_type = news_type ? news_type.substring(0, news_type.length - 1) : null;
            return {
                ...item,
                news_type,
            };
        });
        news.news_related_list = news_related_list;
        // news.products = newsClass.products(data.recordsets[2]);

        // if (news) {
        //     if (news.meta_key_words) {
        //         news.meta_key_words = news.meta_key_words.split(',').map(p => (createOption(p)))
        //     }
        //     else {
        //         news.meta_key_words = []
        //     }
        // }
        news.is_can_edit = 1
        // Kiểm tra nếu là có trạng thái is_system = 1
        // ==> kiểm tra xem user login có phải administrator hay không
        //==> nếu administrator thì không cho phép chỉnh sửa
        const auth_name =  apiHelper.getValueFromObject(bodyParams, 'auth_name') 
        if(news.is_system == 1 && auth_name !='administrator'){
            news.is_can_edit = 0
        }
        return new ServiceResponse(true, '', news);
    } catch (e) {
        logger.error(e, {function: 'newsService.detailNews'});
        return new ServiceResponse(false, e.message);
    }
};

const createNewsOrUpdate = async bodyParams => {
    try {
        const params = bodyParams;
        if (params.image_url) {
            const image_url = await saveImage(params.image_url);
            if (image_url) params.image_url = image_url;
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

        //check name
        const dataCheck = await pool
            .request()
            .input('NEWSID', apiHelper.getValueFromObject(bodyParams, 'news_id'))
            .input('NEWSTITLE', apiHelper.getValueFromObject(bodyParams, 'news_title'))
            .execute(PROCEDURE_NAME.NEWS_NEWS_CHECKNAME_ADMINWEB);
        if (!dataCheck.recordset || !dataCheck.recordset[0].RESULT) {
            return new ServiceResponse(false, RESPONSE_MSG.NEWS.EXISTS_NAME, null);
        }

        // let keywords = apiHelper.getValueFromObject(bodyParams, 'meta_key_words', []);
        // if (keywords && keywords.length > 0) {
        //     keywords = keywords.map(p => p.label).join(",")
        // }

        const data = await pool
            .request()
            .input('NEWSID', apiHelper.getValueFromObject(bodyParams, 'news_id'))
            .input('NEWSTITLE', apiHelper.getValueFromObject(bodyParams, 'news_title'))
            .input('CONTENT', apiHelper.getValueFromObject(bodyParams, 'content'))
            .input('ISVIDEO', apiHelper.getValueFromObject(bodyParams, 'is_video'))
            .input('IMAGEURL', params.image_url)
            .input('ISHIGHLIGHT', apiHelper.getValueFromObject(bodyParams, 'is_high_light'))
            .input('ISSHOWPRODUCTGIFT', apiHelper.getValueFromObject(bodyParams, 'is_show_product_gift'))
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system'))
            .input('USER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
            // .input('NEWSDATE', apiHelper.getValueFromObject(bodyParams, 'news_date'))
            // .input('SHORTDESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'short_description'))
            // .input('NEWSCATEGORYID', apiHelper.getValueFromObject(bodyParams, 'news_category_id'))
            // .input('METAKEYWORDS', keywords)
            // .input('METADESCRIPTIONS', apiHelper.getValueFromObject(bodyParams, 'meta_description'))
            // .input('METATITLE', apiHelper.getValueFromObject(bodyParams, 'meta_title'))
            // .input('SEONAME', apiHelper.getValueFromObject(bodyParams, 'seo_name'))
            // .input('METAKEYWORDSCN', apiHelper.getValueFromObject(bodyParams, 'meta_key_words_cn'))
            // .input('METADESCRIPTIONSCN', apiHelper.getValueFromObject(bodyParams, 'meta_description_cn'))
            // .input('METATITLECN', apiHelper.getValueFromObject(bodyParams, 'meta_title_cn'))
            // .input('SEONAMECN', apiHelper.getValueFromObject(bodyParams, 'seo_name_cn'))
            // .input('BANNERURL', params.banner_url)
            // .input('ORDERINDEX', apiHelper.getValueFromObject(bodyParams, 'order_index'))
            // .input('ISINSIDE', apiHelper.getValueFromObject(bodyParams, 'is_inside'))
            // .input('NEWSTITLECN', apiHelper.getValueFromObject(bodyParams, 'news_title_cn'))
            // .input('SHORTDESCRIPTIONCN', apiHelper.getValueFromObject(bodyParams, 'short_description_cn'))
            // .input('CONTENTCN', apiHelper.getValueFromObject(bodyParams, 'content_cn'))
            // .input('VIDEOLINK', apiHelper.getValueFromObject(bodyParams, 'video_link'))
            // .input('ISSHOWHOME', apiHelper.getValueFromObject(bodyParams, 'is_show_home'))
            // .input('ISGRATEFUL', apiHelper.getValueFromObject(bodyParams, 'is_grateful'))
            // .input('ISSLIDE', apiHelper.getValueFromObject(bodyParams, 'is_slide'))
            // .input('SLUGURL', apiHelper.getValueFromObject(bodyParams, 'url_news'))
            .execute(PROCEDURE_NAME.NEWS_NEWS_CREATEORUPDATE_ADMINWEB);
        const newsId = data.recordset[0].RESULT;
        const id = apiHelper.getValueFromObject(bodyParams, 'news_id');
        // Xoa bai viet lien quan
        if (id && id != '') {
            await pool
                .request()
                .input('NEWSID', id)
                .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .execute(PROCEDURE_NAME.NEWS_NEWSRELATED_DELETEBYNEWSID_ADMINWEB);
        }
        // Them cac bai viet lien quan
        const newsRelated = apiHelper.getValueFromObject(bodyParams, 'news_related_list');
        if (newsRelated && newsRelated.length > 0) {
            for (let i = 0; i < newsRelated.length; i++) {
                const {news_id: related_id} = newsRelated[i];
                await pool
                    .request()
                    .input('PARENTID', newsId)
                    .input('NEWSID', related_id)
                    .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                    .execute(PROCEDURE_NAME.NEWS_NEWSRELATED_CREATE_ADMINWEB);
            }
        }
        return new ServiceResponse(true, '', newsId);
    } catch (e) {
        // logger.error(e, {'function': 'newsService.createNewsOrUpdate'});
        console.log(e.message);
        return new ServiceResponse(false, e.message);
    }
};

const deleteNews = async bodyParams => {
    try {
        const pool = await mssql.pool;
        await pool
            .request()
            .input('NEWSIDS', apiHelper.getValueFromObject(bodyParams, 'ids'))
            .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute(PROCEDURE_NAME.NEWS_NEWS_DELETE_ADMINWEB);
        return new ServiceResponse(true, RESPONSE_MSG.NEWS.DELETE_SUCCESS, true);
    } catch (e) {
        logger.error(e, {function: 'newsService.deleteNews'});
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

module.exports = {
    getListNews,
    detailNews,
    createNewsOrUpdate,
    deleteNews,
    deleteNewsRelated,
    getListNewsInside,
    detailNewsInside,
};
