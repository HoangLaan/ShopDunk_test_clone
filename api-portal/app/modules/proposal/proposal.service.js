const proposalClass = require('./proposal.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const API_CONST = require('../../common/const/api.const');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const apiHelper = require('../../common/helpers/api.helper');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const pdfHelper = require('../../common/helpers/pdf.helper');
const moment = require('moment');
const getList = async (params = {}) => {
    try {
        const page = apiHelper.getCurrentPage(params);
        const itemsPerPage = apiHelper.getItemsPerPage(params);
        const pool = await mssql.pool;
        const res = await pool
            .request()
            .input('KEYWORD', apiHelper.getValueFromObject(params, 'keyword'))
            .input('DEPARTMENTID', apiHelper.getValueFromObject(params, 'department_id'))
            .input('PROPOSALTYPEID', apiHelper.getValueFromObject(params, 'proposal_type_id'))
            .input('ISREVIEW', apiHelper.getValueFromObject(params, 'is_review'))
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', page)
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(params, 'created_date_from', null))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(params, 'created_date_to', null))
            .input('EFFECTIVEDATEFROM', apiHelper.getValueFromObject(params, 'effective_date_from', null))
            .input('EFFECTIVEDATETO', apiHelper.getValueFromObject(params, 'effective_date_to', null))
            .input('USERNAME', apiHelper.getValueFromObject(params, 'auth_name'))
            .execute(PROCEDURE_NAME.HR_PROPOSAL_GETLIST_ADMINWEB);

        let list = proposalClass.list(res.recordsets[0]);
        let list_user = proposalClass.listUser(res.recordsets[1]);
        let total_review = proposalClass.total(res.recordsets[2]?.[0]);
        return new ServiceResponse(true, '', {
            list: (list || []).map((x) => ({
                ...x,
                list_review: (list_user || []).filter((user) => user.proposal_id === x.proposal_id),
            })),
            total: apiHelper.getTotalData(res.recordset),
            page: page,
            itemsPerPage: itemsPerPage,
            total_review: total_review,
        });
    } catch (error) {
        logger.error(error, { function: 'ProposalService.getList' });
        return new ServiceResponse(false, error, []);
    }
};

const createOrUpdate = async (id = null, body = {}) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        await transaction.begin();
        const requestProposal = new sql.Request(transaction);
        const res = await requestProposal
            .input('PROPOSALID', id)
            .input('PROPOSALTYPEID', apiHelper.getValueFromObject(body, 'proposal_type_id'))
            .input('DEPARTMENTID', apiHelper.getValueFromObject(body, 'department_id'))
            .input('POSITIONID', apiHelper.getValueFromObject(body, 'position_id'))
            .input('USERNAME', apiHelper.getValueFromObject(body, 'user_name'))
            .input('USERLEVELID', apiHelper.getValueFromObject(body, 'user_level_id'))
            .input('CONTRACTTYPEID', apiHelper.getValueFromObject(body, 'contract_type_id', null))
            .input('CHANGETYPE', apiHelper.getValueFromObject(body, 'change_type'))
            .input('EFFECTIVEDATE', apiHelper.getValueFromObject(body, 'effective_date'))
            .input('REASON', apiHelper.getValueFromObject(body, 'reason'))
            .input('PROPOSEDSALARY', apiHelper.getValueFromObject(body, 'proposed_salary'))
            .input('WORKINGTIME', apiHelper.getValueFromObject(body, 'working_time'))
            .input('USERNAMEMANAGER', apiHelper.getValueFromObject(body, 'user_name_manager'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name', null))
            .input('ISACTIVE', apiHelper.getValueFromObject(body, 'is_active', API_CONST.ISACTIVE.ALL))
            .input('ISSYSTEM', apiHelper.getValueFromObject(body, 'is_system', API_CONST.ISSYSTEM.ALL))
            .execute(PROCEDURE_NAME.HR_PROPOSAL_CREATEORUPDATE_ADMINWEB);
        let result = apiHelper.getResult(res.recordset);
        if (!result) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Lỗi tạo hoặc cập nhật đề xuất');
        }
        const requestAutoReview = new sql.Request(transaction);
        const resAutoReview = await requestAutoReview
            .input('PROPOSALID', result)
            .input('PROPOSALTYPEID', apiHelper.getValueFromObject(body, 'proposal_type_id'))
            .execute(PROCEDURE_NAME.HR_PROPOSAL_UPDATEAUTOREVIEW_ADMINWEB);
        if (!apiHelper.getResult(resAutoReview.recordset)) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Lỗi tạo hoặc cập nhật đề xuất');
        }
        //
        if (id) {
            const requestDeleteReview = new sql.Request(transaction);
            const resDelete = await requestDeleteReview
                .input('PROPOSALID', id)
                .input('DELETEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
                .execute(PROCEDURE_NAME.HR_PROPOSALREVIEWLIST_DELETEMANY_ADMINWEB);
            if (!apiHelper.getResult(resDelete.recordset)) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Lỗi tạo hoặc cập nhật đề xuất');
            }
        }
        const list_review = apiHelper.getValueFromObject(body, 'list_review', []);
        if (list_review?.length > 0) {
            for (let element of list_review) {
                const requestCreateReview = new sql.Request(transaction);
                const resCreate = await requestCreateReview
                    .input('PROPOSALID', result)
                    .input('PROPOSALREVIEWLEVELID', apiHelper.getValueFromObject(element, 'proposal_review_level_id'))
                    .input('REVIEWUSER', apiHelper.getValueFromObject(element, 'review_user'))
                    .input('CREATEDUSER', apiHelper.getValueFromObject(element, 'auth_name'))
                    .execute(PROCEDURE_NAME.HR_PROPOSALREVIEWLIST_CREATE_ADMINWEB);
                if (!apiHelper.getResult(resCreate.recordset)) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Lỗi tạo hoặc cập nhật đề xuất');
                }
            }
        }
        await transaction.commit();
        removeCacheOptions();
        return new ServiceResponse(true, '', result);
    } catch (error) {
        await transaction.rollback();
        logger.error(error, { function: 'ProposalService.createOrUpdate' });
        return new ServiceResponse(false, error);
    }
};

const detail = async (params) => {
    try {
        const pool = await mssql.pool;
        const res = await pool
            .request()
            .input('PROPOSALID', apiHelper.getValueFromObject(params, 'id'))
            .input('USERNAME', apiHelper.getValueFromObject(params, 'auth_name'))
            .execute(PROCEDURE_NAME.HR_PROPOSAL_GETBYID_ADMINWEB);
        let list_review = proposalClass.listReview(res.recordsets[1]);
        let list_review_user = proposalClass.listUser(res.recordsets[2]);
        list_review = (list_review || []).map((x) => ({
            ...x,
            review_user: +x.review_user,
            list_user: (list_review_user || []).filter(
                (user) => user.proposal_review_level_id === x.proposal_review_level_id,
            ),
        }));
        return new ServiceResponse(true, '', {
            ...proposalClass.detail(res.recordsets[0]?.[0]),
            list_review: list_review,
        });
    } catch (error) {
        logger.error(error, { function: 'ProposalService.detail' });
        return new ServiceResponse(false, error);
    }
};
const remove = async (bodyParams) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        await transaction.begin();
        let list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []);
        for (let element of list_id) {
            const requestDelete = new sql.Request(transaction);
            const resDelete = await requestDelete
                .input('PROPOSALID', element)
                .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .execute(PROCEDURE_NAME.HR_PROPOSAL_DELETE_ADMINWEB);
            if (!apiHelper.getResult(resDelete.recordset)) {
                await transaction.rollback();
                return new ServiceResponse(false);
            }
        }
        removeCacheOptions();
        await transaction.commit();
        return new ServiceResponse(true);
    } catch (e) {
        await transaction.rollback();
        logger.error(e, { function: 'ManufacturerService.deleteManufacturer' });
        return new ServiceResponse(false, e.message);
    }
};

const getListReview = async (params) => {
    try {
        const pool = await mssql.pool;
        const res = await pool
            .request()
            .input('PROPOSALTYPEID', apiHelper.getValueFromObject(params, 'proposal_type_id'))
            .execute(PROCEDURE_NAME.HR_PROPOSAL_GETLISTREVIEW_ADMINWEB);
        let data = proposalClass.listReview(res.recordsets[0]);
        const list_user = proposalClass.listUser(res.recordsets[1]);
        data = (data || []).map((x) => ({
            ...x,
            list_user: (list_user || []).filter((user) => user.proposal_review_level_id === x.proposal_review_level_id),
        }));
        return new ServiceResponse(true, '', data);
    } catch (error) {
        logger.error(error, { function: 'ProposalService.getListReview' });
        return new ServiceResponse(false, error);
    }
};

const getUserInformation = async (params) => {
    try {
        const pool = await mssql.pool;
        const res = await pool
            .request()
            .input('USERNAME', apiHelper.getValueFromObject(params, 'user_name'))
            .execute(PROCEDURE_NAME.HR_PROPOSAL_GETUSERINFORMATION_ADMINWEB);
        return new ServiceResponse(true, '', proposalClass.detailUser(res.recordset[0]));
    } catch (error) {
        logger.error(error, { function: 'ProposalService.getUserInformation' });
        return new ServiceResponse(false, error);
    }
};

const updateReview = async (body) => {
    try {
        const pool = await mssql.pool;
        const res = await pool
            .request()
            .input('PROPOSALREVIEWLISTID', apiHelper.getValueFromObject(body, 'proposal_review_list_id'))
            .input('ISREVIEW', apiHelper.getValueFromObject(body, 'is_review'))
            .input('REVIEWNOTE', apiHelper.getValueFromObject(body, 'review_note'))
            .input('UPDATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
            .execute(PROCEDURE_NAME.HR_PROPOSALREVIEWLIST_UPDATE_ADMINWEB);
        if (!apiHelper.getResult(res.recordset)) {
            return new ServiceResponse(false);
        }
        return new ServiceResponse(true);
    } catch (error) {
        logger.error(error, { function: 'ProposalService.updateReview' });
        return new ServiceResponse(false, error);
    }
};

const exportPDF = async (queryParams = {}) => {
    try {
        const id = apiHelper.getValueFromObject(queryParams, 'id');
        const type = apiHelper.getValueFromObject(queryParams, 'pdf_type');
        const result = await detail({ id: id });
        let proposal = result.getData();
        let data = null;
        if (result.isFailed()) {
            return new ServiceResponse(false, 'Lỗi không thể in hoá đơn.', []);
        }
        const user = await getUserInformation({ user_name: proposal.user_name });
        if (user.isFailed()) {
            return new ServiceResponse(false, 'Lỗi không thể in hoá đơn.', []);
        }
        const usermanager = await getUserInformation({ user_name: proposal.user_name_manager });
        if (usermanager.isFailed()) {
            return new ServiceResponse(false, 'Lỗi không thể in hoá đơn.', []);
        }
        let template = null;
        //Type = 1 là in phiếu đề
        data = {
            ...proposal,
            user: user.getData(),
            usermanager: usermanager.getData(),
        };
        if (+type === 1) {
            template = 'proposal.html';
        } else {
            template = 'decision-appoint.html';
        }

        if (result.getData()) {
            const fileName = `Phieu_${moment().format('DDMMYYYY_HHmmss')}_${id}`;
            const print_params = {
                template: template,
                data: data,
                filename: fileName,
                isOnlyFirstPage: true,
            };
            await pdfHelper.printPDF(print_params);

            return new ServiceResponse(true, '', { path: `pdf/${fileName}.pdf` });
        }

        return new ServiceResponse(false, 'Không tìm thấy đề xuất.');
    } catch (e) {
        logger.error(e, { function: 'ProposalService.exportPDF' });
        return new ServiceResponse(false, 'Lỗi không thể in phiếu đề xuất.', []);
    }
};

const removeCacheOptions = () => {
    return cacheHelper.removeByKey(CACHE_CONST.HR_PROPOSAL_OPTIONS);
};

module.exports = {
    getList,
    createOrUpdate,
    detail,
    remove,
    getListReview,
    getUserInformation,
    updateReview,
    exportPDF,
};
