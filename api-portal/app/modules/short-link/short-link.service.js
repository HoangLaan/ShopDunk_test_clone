const logger = require('../../common/classes/logger.class');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const sql = require('mssql');
const shortLinkClass = require('./short-link.class');

const createOrUpdate = async (bodyParams = {}) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        await transaction.begin();
        let short_decode = '';
        const id = apiHelper.getValueFromObject(bodyParams, 'short_link_id');
        if (id) {
            short_decode = apiHelper.getValueFromObject(bodyParams, 'short_decode');
        } else {
            const genCode = new sql.Request(transaction);
            const res = await genCode.execute('SH_SHORTLINK_CreateRandomCode_AdminWeb');
            short_decode = res.recordsets[1][0].RESULT;
        }
        const reqShortLink = new sql.Request(transaction);
        const resShortLink = await reqShortLink
            .input('SHORTLINKID', apiHelper.getValueFromObject(bodyParams, 'short_link_id'))
            .input('URLDIRECT', apiHelper.getValueFromObject(bodyParams, 'short_link_redirect'))
            .input('SHORDECODE', short_decode)
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('ISDELETED', 0)
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .input('SHORTLINKNAME', apiHelper.getValueFromObject(bodyParams, 'short_link_name'))
            .input('SHORTLINKTYPE', apiHelper.getValueFromObject(bodyParams, 'short_link_type'))
            .execute(PROCEDURE_NAME.SH_SHORTLINK_CREATEORUPDATE_ADMINWEB);
        const shortLinkId = resShortLink.recordset[0].RESULT;
        if (!shortLinkId) {
            await transaction.rollback();
            throw new Error('Create or update short link failed!');
        }
        // Delete mapping memeber in short link
        // load member list
        const _member_list = apiHelper.getValueFromObject(bodyParams, 'member_list', []);
        // tách khách hàng với khách hàng tiềm năng
        let member_list = []; // khách hàng
        let member_lead_list = []; // khách hàng tiềm năng
        _member_list?.forEach((member) => {
            if (member.member_id) {
                member_list.push(member);
            } else if (member.data_leads_id) {
                member_lead_list.push(member);
            }
        });

        const member_id_list = member_list.map((x) => x.member_id).join('|');
        const member_lead_id_list = member_lead_list.map((x) => x.data_leads_id).join('|');
        const reqDel = new sql.Request(transaction);
        const resDel = await reqDel
            .input('MEMBERLIST', member_id_list)
            .input('MEMBERLEADLIST', member_lead_id_list)
            .input('SHORTLINKID', shortLinkId)
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute(PROCEDURE_NAME.SH_SHORTLINKDETAIL_DELETEMAPPING_ADMINWEB);
        const delResult = resDel.recordset[0].RESULT;
        //create or update SH_SHORTLINKDETAIL
        for (let i = 0; i < _member_list.length; i++) {
            const reqDetail = new sql.Request(transaction);
            const resDetail = await reqDetail
                .input('SHORTLINKDETAILID', _member_list[i]?.short_link_detail_id)
                .input('SHORTLINKID', shortLinkId)
                .input('MEMBERID', _member_list[i]?.member_id)
                .input('DATALEADSID', _member_list[i]?.data_leads_id)
                .input('ISACTIVE', 1)
                .input('ISDELETED', 0)
                .input('DEPARTMENTID', _member_list[i]?.department_id)
                .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .execute('SH_SHORTLINKDETAIL_CreateOrUpdate_AdminWeb');
        }
        await transaction.commit();
        return new ServiceResponse(true, 'ok', { shortLinkId });
    } catch (e) {
        await transaction.rollback();
        logger.error(e, { function: 'shortLinkService.createOrUpdate' });
        return new ServiceResponse(false, e);
    }
};

const getList = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getSearch(queryParams);
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('ISACTIVE', apiHelper.getValueFromObject(queryParams, 'is_active'))
            .input('KEYWORD', keyword)
            .execute('SH_SHORTLINK_GetList_AdminWeb');

        const resData = shortLinkClass.list(data.recordset);

        return new ServiceResponse(true, '', {
            data: resData,
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordset),
        });
    } catch (e) {
        logger.error(e, { function: 'regimeService.getListRegime' });
        return new ServiceResponse(true, '', {});
    }
};

const getById = async (id) => {
    try {
        const pool = await mssql.pool;
        const res = await pool.request()
        .input('SHORTLINKID', id)
        .execute('SH_SHORTLINK_GetById_AdminWeb');
        let shortLink = shortLinkClass.detail(res.recordset[0] || {});
        if (shortLink) {
        // lấy các member trong short link
        const resMem = await pool.request()
        .input('SHORTLINKID', id)
        .execute('SH_SHORTLINKDETAIL_GetByShortLinkId_AdminWeb');

        const result = shortLinkClass.member(resMem.recordset)
        shortLink.member_list = result;
        }

        return new ServiceResponse(true, '', shortLink);
    } catch (e) {
        logger.error(e, { function: 'shortLink.getById' });
        return new ServiceResponse(false, e.message);
    }
};

const handleDelete = async (bodyParams) => {
    try {
      const pool = await mssql.pool;
      await pool
        .request()
        .input('SHORTLINKID', apiHelper.getValueFromObject(bodyParams, "short_link_id"))
        .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
        .execute('SH_SHORTLINK_DeleteShortLink_AdminWeb');
      return new ServiceResponse(true, 'ok');
    } catch (e) {
      logger.error(e, { function: 'shortLink.handleDelete' });
      return new ServiceResponse(false, e.message);
    }
  };

module.exports = {
    createOrUpdate,
    getList,
    getById,
    handleDelete
};
