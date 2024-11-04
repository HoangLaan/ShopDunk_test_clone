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
            .input('KEYWORD', keyword)
            .execute(PROCEDURE_NAME.NEWS_NEWS_GETLIST_APP);
        const news = data.recordset;

        return new ServiceResponse(true, '', {
            data: newsClass.list(news),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(news),
        });
    } catch (e) {
        logger.error(e, {function: 'newsService.getListNews'});
        return new ServiceResponse(true, '', {});
    }
};

const detailNews = async (newsId, user_name) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('NEWSID', newsId)
            .input('COMMENTUSER', user_name)
            .execute(PROCEDURE_NAME.NEWS_NEWS_GETBYID_APP);

        let news = newsClass.detail(data.recordset)[0];
        news.related = newsClass.list(data.recordsets[1]);
        return new ServiceResponse(true, '', news);
    } catch (e) {
        logger.error(e, {function: 'newsService.detailNews'});
        return new ServiceResponse(false, e.message);
    }
};

const getTopNews = async () => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().execute(PROCEDURE_NAME.NEWS_NEWS_GETTOP_APP);
        let news = data.recordset && data.recordset.length ? newsClass.list(data.recordset) : [];
        return new ServiceResponse(true, '', news);
    } catch (e) {
        logger.error(e, {function: 'newsService.getTopNews'});
        return new ServiceResponse(false, e.message);
    }
};

const getListUserView = async newsId => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('NEWSID', newsId)
            .execute(PROCEDURE_NAME.NEWS_NEWS_USERVIEW_GETLISTUSERVIEW_APP);

        const userView = newsClass.listUserView(data.recordset);

        return new ServiceResponse(true, 'success', userView);
    } catch (e) {
        logger.error(e, {function: 'newsService.getListUserView'});
        return new ServiceResponse(false, e.message);
    }
};

const createUserView = async (user_name, news_id) => {
    try {
        const pool = await mssql.pool;
        const res = await pool
            .request()
            .input('USERNAME', user_name)
            .input('NEWSID', news_id)
            .execute('NEWS_NEWS_USERVIEW_Create_APP');
        return new ServiceResponse(true, res.recordset[0].RESULT, {}, '');
    } catch (e) {
        logger.error(e, {function: 'newsService.createUserView'});
        return new ServiceResponse(false, e.message);
    }
};

const getTotalUnreadByUsername = async user_name => {
    try {
        const pool = await mssql.pool;
        const res = await pool
            .request()
            .input('USERNAME', user_name)
            .execute('NEWS_NEWS_USERVIEW_GetTotalUnreadByUsername_App');
        return new ServiceResponse(true, '', {
            total_unread: res.recordset.length ? res.recordset[0].TOTALUNREAD : 0,
        });
    } catch (e) {
        logger.error(e, {function: 'newsService.getTotalUnreadByUsername'});
        return new ServiceResponse(false, e.message);
    }
};

module.exports = {
    getListNews,
    detailNews,
    getTopNews,
    getListUserView,
    createUserView,
    getTotalUnreadByUsername,
};
