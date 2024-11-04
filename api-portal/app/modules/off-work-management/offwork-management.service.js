const OffWorkManagementClass = require('./offwork-management.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const _ = require('lodash');
/**
 * Get list AM_COMPANY
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getList = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'keyword'))
            .input('COMPANYID', apiHelper.getValueFromObject(queryParams, 'company_id'))
            .input('BLOCKID', apiHelper.getValueFromObject(queryParams, 'block_id'))
            .input('DEPARTMENTID', apiHelper.getValueFromObject(queryParams, 'department_id'))
            .input('ISACTIVE', apiHelper.getValueFromObject(queryParams, 'is_active'))
            .execute('HR_TIMECANOFF_POLICY_GetList_AdminWeb');

        const offworks = data.recordset;
        let respone = OffWorkManagementClass.list(offworks);
        // lặp qua lấy block && department && store
        for (let i = 0; i < respone.length; i++) {
            const res = await pool
                .request()
                .input('TIMECANOFFPOLICYID', parseInt(respone[i].time_can_off_policy_id))
                .execute('HR_TIMECANOFF_POLICY_GetInfo_AdminWeb');
            const blocks = OffWorkManagementClass.block(res.recordsets[0]);
            const departments = OffWorkManagementClass.department(res.recordsets[1]);
            respone[i].blocks = blocks;
            respone[i].departments = departments;
        }
        return new ServiceResponse(true, '', {
            data: respone,
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(offworks),
        });
    } catch (e) {
        logger.error(e, { function: 'offWorkService.getListOffWork' });
        return new ServiceResponse(true, '', {});
    }
};

const createOrUpdate = async (bodyParams) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        await transaction.begin();
        const id = apiHelper.getValueFromObject(bodyParams, 'time_can_off_policy_id');
        const auth_name = apiHelper.getValueFromObject(bodyParams, 'auth_name');
        const req = new sql.Request(transaction);
        const response = await req
            .input('TIMECANOFFPOLICYID', apiHelper.getValueFromObject(bodyParams, 'time_can_off_policy_id'))
            .input('COMPANYID', apiHelper.getValueFromObject(bodyParams, 'company_id'))
            .input('TIMECANOFFPOLICYNAME', apiHelper.getValueFromObject(bodyParams, 'time_can_off_policy_name'))
            .input('MONTHLYTIMECANOFF', apiHelper.getValueFromObject(bodyParams, 'monthly_time_can_off'))
            .input('MONTHLYTIMECANOFFUNIT', apiHelper.getValueFromObject(bodyParams, 'monthly_time_can_off_unit'))
            .input('MONTHLYTIMECANOFFCYCLE', apiHelper.getValueFromObject(bodyParams, 'monthly_time_can_off_cycle'))
            .input('SENIORITYTIMECANOFF', apiHelper.getValueFromObject(bodyParams, 'seniority_time_can_off'))
            .input('TIMECANOFFUNIT', apiHelper.getValueFromObject(bodyParams, 'time_can_off_unit'))
            .input('TIMECANOFFCYCLE', apiHelper.getValueFromObject(bodyParams, 'time_can_off_cycle'))
            .input('RESETTIMECANOFFDATE', apiHelper.getValueFromObject(bodyParams, 'reset_time_can_off_date'))
            .input('RESETTIMECANOFFCYCLE', apiHelper.getValueFromObject(bodyParams, 'reset_time_can_off_cycle'))
            .input('CREATEDUSER', auth_name)
            .execute('HR_TIMECANOFF_POLICY_CreateOrUpdate_AdminWeb');
        const policyId = response.recordset[0].RESULT;
        if (!policyId) {
            await transaction.rollback();
            throw new Error('Create offwork policy failed!');
        }
        const block_list = apiHelper.getValueFromObject(bodyParams, 'block_list', []);
        const _block_list = block_list.join('|');

        const department_list = apiHelper.getValueFromObject(bodyParams, 'department_list', []);
        const _department_list = department_list.map((x) => x.id).join('|');

        const store_list = apiHelper.getValueFromObject(bodyParams, 'store_list', []);
        const _store_list = store_list.map((x) => x.id).join('|');
        //delete mapping block
        const req1 = new sql.Request(transaction);
        const delBlock = await req1
            .input('TIMECANOFFPOLICYID', policyId)
            .input('BLOCKLIST', _block_list)
            .input('CREATEDUSER', auth_name)
            .execute('HR_TIMECANOFF_POLICY_BLOCK_DeleteMapping_AdminWeb');
        const resDelBlock = delBlock.recordset[0].RESULT;
        if (!resDelBlock) {
            await transaction.rollback();
            throw new Error('Delete mapping block policy failed!');
        }
        //insert or update block

        //delete mapping store
        //  const req3 = new sql.Request(transaction);
        //  const delStore = await req3
        //  .input('TIMECANOFFPOLICYID',policyId)
        //  .input('STORELIST',_store_list)
        //  .input('CREATEDUSER',auth_name)
        //  .execute('HR_TIMECANOFF_POLICY_STORE_DeleteMapping_AdminWeb');
        //  const resDelStore = delStore.recordset[0].RESULT;
        //  if(!resDelStore){
        //      await transaction.rollback();
        //      throw new Error('Delete mapping store policy failed!');
        //  }

        //insert or update store
        // for (let i = 0; i < store_list.length; i++) {
        //     const req4 = new sql.Request(transaction);
        //     const createOrupdateStore = await req4
        //         .input('TIMECANOFFPOLICYID', policyId)
        //         .input('STOREID', store_list[i].id)
        //         .input('CREATEDUSER', auth_name)
        //         .input('ORDERINDEX', '')
        //         .execute('HR_TIMECANOFF_POLICY_STORE_CreateOrUpdate_AdminWeb');
        // }

        //delete mapping department
        const req5 = new sql.Request(transaction);
        const delDepartment = await req5
            .input('TIMECANOFFPOLICYID', policyId)
            .input('DEPARTMENTLIST', _department_list)
            .input('CREATEDUSER', auth_name)
            .execute('HR_TIMECANOFF_POLICY_DEPARTMENT_DeleteMapping_AdminWeb');
        const resDepartmentStore = delDepartment.recordset[0].RESULT;
        if (!resDepartmentStore) {
            await transaction.rollback();
            throw new Error('Delete mapping department policy failed!');
        }
        //insert or update department && block
        for (let i = 0; i < department_list.length; i++) {
            const block_id = await getBlockByDepartment(department_list[i].id);
            const { ID } = block_id.data[0];
            const req6 = new sql.Request(transaction);
            const createOrupdateDepartment = await req6
                .input('TIMECANOFFPOLICYID', policyId)
                .input('DEPARTMENTID', department_list[i].id)
                .input('BLOCKID', ID)
                .input('ORDERINDEX', '')
                .input('CREATEDUSER', auth_name)
                .execute('HR_TIMECANOFF_POLICY_BLOCK_CreateOrUpdate_AdminWeb');
        }

        await transaction.commit();
        return new ServiceResponse(true, 'ok', policyId);
    } catch (e) {
        logger.error(e, { function: 'offWorkManagementService.createUserOrUpdate' });
        await transaction.rollback();
        return new ServiceResponse(false, e);
    }
};

const getDepartmentByBlock = async (query) => {
    try {
        const block_list = query.join('|');
        const pool = await mssql.pool;
        const result = await pool
            .request()
            .input('BLOCKLIST', block_list)
            .execute('HR_TIMECANOFF_POLICY_GetDepartmentOpts_AdminWeb');
        const list = OffWorkManagementClass.opt(result.recordset);
        return new ServiceResponse(true, 'ok', list);
    } catch (e) {
        logger.error(e, { function: 'offWorkManagementService.getDepartmentByBlock' });
        await transaction.rollback();
        return new ServiceResponse(false, e);
    }
};

const getBlockByDepartment = async (id) => {
    try {
        const pool = await mssql.pool;
        const result = await pool
            .request()
            .input('ID', id)
            .execute('HR_TIMECANOFF_POLICY_GetBlockByDepartment_AdminWeb');
        return new ServiceResponse(true, 'ok', result.recordset);
    } catch (e) {
        logger.error(e, { function: 'offWorkManagementService.getBlockByDepartment' });
        await transaction.rollback();
        return new ServiceResponse(false, e);
    }
};

const getDetail = async (bodyParams) => {
    try {
        const pool = await mssql.pool;
        const result = await pool
            .request()
            .input('TIMECANOFFPOLICYID', apiHelper.getValueFromObject(bodyParams, 'id'))
            .execute('HR_TIMECANOFF_POLICY_GetById_AdminWeb');
        let respone = OffWorkManagementClass.detail(result.recordset);
        // lặp qua lấy block && department && store
        for (let i = 0; i < respone.length; i++) {
            const res = await pool
                .request()
                .input('TIMECANOFFPOLICYID', parseInt(respone[i].time_can_off_policy_id))
                .execute('HR_TIMECANOFF_POLICY_GetInfo_AdminWeb');
            const blocks = OffWorkManagementClass.opt(res.recordsets[0]);
            const departments = OffWorkManagementClass.opt(res.recordsets[1]);
            respone[i].block_list = blocks;
            respone[i].department_list = departments;
        }
        return new ServiceResponse(true, 'ok', respone);
    } catch (e) {
        logger.error(e, { function: 'offWorkManagementService.getDetail' });
        await transaction.rollback();
        return new ServiceResponse(false, e);
    }
};

const deletePolicy = async (bodyParams) => {
    try {
        const pool = await mssql.pool;
        const result = await pool
            .request()
            .input('TIMECANOFFPOLICYID', parseInt(apiHelper.getValueFromObject(bodyParams, 'id')))
            .input('USERNAME', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('HR_TIMECANOFF_POLICY_Delete_AdminWeb');
        return new ServiceResponse(true, 'ok', { id: apiHelper.getValueFromObject(bodyParams, 'id') });
    } catch (e) {
        logger.error(e, { function: 'offWorkManagementService.delete' });
        await transaction.rollback();
        return new ServiceResponse(false, e);
    }
};

module.exports = {
    createOrUpdate,
    getList,
    getDepartmentByBlock,
    getDetail,
    deletePolicy,
};
