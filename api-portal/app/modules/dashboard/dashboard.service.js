const dashboardClass = require('../dashboard/dashboard.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const _ = require('lodash');

const getSummary = async (queryParams = {}) => {
    try {
        function percentage(now, before) {
            return Math.round((parseInt(now > before ? now : before) / parseInt(now + before)) * 100);
        }
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('USERNAME', apiHelper.getValueFromObject(queryParams, 'auth_name'))
            .execute(PROCEDURE_NAME.DASHBOARD_GETSUMMARY_ADMINWEB);
        let summary = dashboardClass.summary(data.recordset[0]);
        const {
            total_revenue_quarter_before = 0,
            total_revenue_quarter_now = 0,
            total_commission_quarter_now = 0,
            total_commission_quarter_before = 0,
            total_order_quarter_now = 0,
            total_order_quarter_before = 0,
            total_goods_quarter_now = 0,
            total_goods_quarter_before = 0,
        } = summary;
        summary.order_quarter_percent = percentage(total_order_quarter_now, total_order_quarter_before);
        summary.revenue_quarter_percent = percentage(total_revenue_quarter_now, total_revenue_quarter_before);
        summary.comission_quarter_percent = percentage(total_commission_quarter_now, total_commission_quarter_before);
        summary.goods_quarter_percent = percentage(total_goods_quarter_now, total_goods_quarter_before);
        return new ServiceResponse(true, '', summary);
    } catch (e) {
        logger.error(e, { function: 'dashboardService.getInformation' });
        return new ServiceResponse(true, '', {});
    }
};

/**
 * Get receive slip chart
 * @param {Object} params
 * @returns {Promise<ServiceResponse>}
 */

const getReceiveslipChart = async (body = {}) => {
    try {
        const pool = await mssql.pool;

        const data = await pool
            .request()
            .input('DATEFROM', apiHelper.getValueFromObject(body, 'start_date'))
            .input('DATETO', apiHelper.getValueFromObject(body, 'end_date'))
            .execute(PROCEDURE_NAME.SL_RECEIVESLIP_SUMARYDATEDASHBOARD_ADMINWEB);
        return new ServiceResponse(true, '', data.recordset);
    } catch (e) {
        logger.error(e, { function: 'dashboardService.getReceiveslipChart' });
        return new ServiceResponse(false, '', []);
    }
};

/**
 * Get list announce, get top 5
 * @param {Object} params
 * @returns {Promise<ServiceResponse>}
 */

const getListAnnounce = async (body = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('USERNAME', apiHelper.getValueFromObject(body, 'auth_name'))
            .execute('SYS_ANNOUCE_GetTop5_AdminWeb');
        const announces = dashboardClass.listAnnounce(data.recordsets[0]);
        for (let index = 0; index < announces.length; index++) {
            const element = announces[index];
            const reqAttachment = await pool
                .request()
                .input('ANNOUNCEID', apiHelper.getValueFromObject(element, 'announce_id'))
                .execute('SYS_ANNOUCE_GetAttachmentById_AdminWeb');
            const dataAttachment = dashboardClass.listAttachment(reqAttachment.recordset);
            if (dataAttachment.length > 0) {
                announces[index].listAttachment = dataAttachment;
            }
        }
        const count_announce = data.recordsets[1][0].TOTALUNREAD;

        return new ServiceResponse(true, '', {
            data: announces,
            count_announce: count_announce,
        });
    } catch (e) {
        logger.error(e, { function: 'dashboardService.getListMail' });
        return new ServiceResponse(false, '', {});
    }
};

/**
 * Get list news
 * @param {Object} params
 * @returns {Promise<ServiceResponse>}
 */
const getListNews = async () => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().execute('NEWS_NEWS_GetTop_AdminWeb');
        const news = dashboardClass.listNews(data.recordset);
        return new ServiceResponse(true, '', {
            data: news,
        });
    } catch (e) {
        logger.error(e, { function: 'dashboardService.getListNews' });
        return new ServiceResponse(false, '', {});
    }
};

/**
 * Get list mail
 * @param {Object} params
 * @returns {Promise<ServiceResponse>}
 */

const getListMail = async (body = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PAGESIZE', 10)
            .input('PAGEINDEX', 1)
            .input('USERNAME', apiHelper.getValueFromObject(body, 'auth_name'))
            .execute('SYS_MAILBOX_GetListMailInbox_AdminWeb');
        const result = dashboardClass.listMail(data.recordsets[0]);
        const totalMailUnRead =
            data.recordsets[1] && data.recordsets[1].length ? data.recordsets[1][0].TOTALMAILUNREAD : 0;

        return new ServiceResponse(true, '', {
            data: result,
            total: totalMailUnRead,
        });
    } catch (e) {
        logger.error(e, { function: 'dashboardService.getListMail' });
        return new ServiceResponse(true, '', {});
    }
};

const getListStocks = async () => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().execute('ST_STOCKSDETAIL_SumaryDashboard_AdminWeb');
        return new ServiceResponse(true, '', {
            list_product: dashboardClass.listStock(data.recordsets[0]),
            list_category: dashboardClass.listStock(data.recordsets[1]),
        });
    } catch (error) {
        logger.error(e, { function: 'dashboardService.getListStocks' });
        return new ServiceResponse(true, error, {});
    }
};

const getDebit = async () => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().execute('SL_DEBIT_SumaryDashboard_AdminWeb');
        let debit = dashboardClass.detailDebit(data.recordset[0]);
        return new ServiceResponse(true, '', debit);
    } catch (error) {
        logger.error(e, { function: 'dashboardService.getDebit' });
        return new ServiceResponse(true, error, {});
    }
};

module.exports = {
    getSummary,
    getReceiveslipChart,
    getListNews,
    getListAnnounce,
    getListMail,
    getListStocks,
    getDebit,
};
