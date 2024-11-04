const OffWorkTypeClass = require('./offwork-type.class');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');

const getListOffWorkType = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'keyword'))
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .input('COMPANYID', apiHelper.getValueFromObject(queryParams, 'company_id'))
            .input('USERNAME', apiHelper.getValueFromObject(queryParams, 'auth_name'))
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'date_from'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'date_to'))
            .execute('HR_OFFWORKTYPE_GetList_AdminWeb');

        const OffWorkType = data.recordset;

        return new ServiceResponse(true, '', {
            data: OffWorkTypeClass.list(OffWorkType),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(OffWorkType),
        });
    } catch (e) {
        logger.error(e, { function: 'offworkTypeService.getListOffWorkType' });
        return new ServiceResponse(true, '', {});
    }
};

const createOffWorkType = async (bodyParams = {}) => {
    return await createUserOrUpdate(bodyParams);
};

const updateOffWorkType = async (bodyParams) => {
    return await createUserOrUpdate(bodyParams);
};

const createUserOrUpdate = async (bodyParams) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        const is_auto_review = apiHelper.getValueFromObject(bodyParams, 'is_auto_review');

        await transaction.begin();

        const requestOffWorkTypeCreate = new sql.Request(transaction);
        const resultOffWorkTypeCreate = await requestOffWorkTypeCreate
            .input('OFFWORKTYPEID', apiHelper.getValueFromObject(bodyParams, 'off_work_type_id'))
            .input('OFFWORKNAME', apiHelper.getValueFromObject(bodyParams, 'off_work_name'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
            .input('VALUESOFF', apiHelper.getValueFromObject(bodyParams, 'values_off'))
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('ISDAY', apiHelper.getValueFromObject(bodyParams, 'is_day'))
            .input('ISHOURS', apiHelper.getValueFromObject(bodyParams, 'is_hour'))
            .input('ISSUBTIMEOFF', apiHelper.getValueFromObject(bodyParams, 'is_sub_time_off'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .input('ISAUTOREVIEW', is_auto_review)
            .input('BEFOREDAY', apiHelper.getValueFromObject(bodyParams, 'before_day'))
            .input('MAXDAYOFF', apiHelper.getValueFromObject(bodyParams, 'max_day_off'))
            .input('COMPANYID', apiHelper.getValueFromObject(bodyParams, 'company_id'))
            .execute('HR_OFFWORKTYPE_CreateOrUpdate_AdminWeb');

        const offWorkTypeId = resultOffWorkTypeCreate.recordset[0].RESULT;
        const id = apiHelper.getValueFromObject(bodyParams, 'off_work_type_id');
        if (!offWorkTypeId) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Thêm mới loại nghỉ phép thất bại.');
        }

        if (is_auto_review !== 1) {
            const offwork_type_review_list = apiHelper.getValueFromObject(bodyParams, 'offwork_type_review_list');
            if (id && offwork_type_review_list && offwork_type_review_list.length) {
                // Xoa tat ca review user truoc do
                const requestOffWorkTypeRlUDelete = new sql.Request(transaction);
                const resultOffWorkTypeRLUDelete = await requestOffWorkTypeRlUDelete
                    .input('OFFWORKTYPEID', id)
                    .execute('HR_OFFWORK_LEVEL_USER_DeleteByOffWorkTypeId_AdminWeb');
                if (!resultOffWorkTypeRLUDelete.recordset[0].RESULT) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Thêm mới loại nghỉ phép thất bại.');
                }
            }
            for (let i = 0; i < offwork_type_review_list.length; i++) {
                const item = offwork_type_review_list[i];
                let { users = [] } = item;
                users = users.map((u) => u.value).join('|');
                const is_auto_review_level = apiHelper.getValueFromObject(item, 'is_auto_review');
                const requestOffWorkTypeRlUCreate = new sql.Request(transaction);
                const resultOffWorkTypeRLUCreate = await requestOffWorkTypeRlUCreate
                    .input('OFFWORKREVIEWLEVELID', apiHelper.getValueFromObject(item, 'offwork_review_level_id'))
                    .input('OFFWORKTYPEID', offWorkTypeId)
                    .input('ISAUTOREVIEW', is_auto_review_level)
                    .input('ISCOMPLETEREVIEW', apiHelper.getValueFromObject(item, 'is_complete_review'))
                    .input('DEPARTMENTID', apiHelper.getValueFromObject(item, 'department_id'))
                    .input('ORDERINDEX', i)
                    .input('USERREVIEW', is_auto_review_level ? null : users)
                    .execute('HR_OFFWORK_LEVEL_USER_Create_AdminWeb');
                if (resultOffWorkTypeRLUCreate.recordset[0].RESULT <= 0) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Thêm mới loại nghỉ phép thất bại.');
                }
            }
        }

        await transaction.commit();
        return new ServiceResponse(true, 'Create offwork type success.', {
            offwork: offWorkTypeId,
        });
    } catch (e) {
        await transaction.rollback();
        logger.error(e, { function: 'offworkTypeService.createUserOrUpdate' });
        return new ServiceResponse(false, e);
    }
};

const detailOffWorkType = async (offWorkId) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().input('OFFWORKTYPEID', offWorkId).execute('HR_OFFWORKTYPE_GetById_AdminWeb');
        let offWorkType = OffWorkTypeClass.detail(data.recordset[0]);

        const dataList = await pool
            .request()
            .input('OFFWORKTYPEID', offWorkId)
            .execute('HR_OFFWORK_LEVEL_USER_GetByOffWorkTypeId_AdminWeb');
        const rlUsers = OffWorkTypeClass.listRlUser(dataList.recordset);
        const users = OffWorkTypeClass.userOptions(dataList.recordsets[1]);

        let offwork_type_review_list = [];

        offwork_type_review_list = rlUsers.reduce((rl, v) => {
            const { offwork_review_level_id } = v;
            const idx = rl.findIndex((x) => x.offwork_review_level_id === offwork_review_level_id);
            if (idx < 0) {
                // Lay danh sach nguoi duyet va danh sach nhan vien thuoc phong ban
                const userRL = (rlUsers || [])
                    .filter((k) => k.offwork_review_level_id == offwork_review_level_id)
                    .map(({ id, value, name, label }) => ({ id, value, name, label }));

                rl.push({
                    ...v,
                    ...{
                        users: userRL,
                    },
                });
            }
            return rl;
        }, []);

        let review_users = {};

        const userReview = (users || []).map(({ id, name, ...user }) => ({
            id,
            name,
            value: id,
            label: name,
            ...user,
        }));

        userReview.map((_user) => {
            if (review_users[_user.review_level_id]) {
                review_users[_user.review_level_id].push(_user);
            } else {
                review_users[_user.review_level_id] = [{ ..._user }];
            }
        });

        offWorkType.review_users = review_users || {};

        if (offWorkType && offWorkType.off_work_type_id) {
            offWorkType.offwork_type_review_list = offwork_type_review_list;
            return new ServiceResponse(true, '', offWorkType);
        }
        return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
    } catch (e) {
        logger.error(e, { function: 'offworkTypeService.detailOffWorkType' });

        return new ServiceResponse(false, e.message);
    }
};

const deleteOffWorkType = async (queryParams = {}, auth) => {
    try {
        const pool = await mssql.pool;
        await pool
            .request()
            .input('LISTID', apiHelper.getValueFromObject(queryParams, 'list_id', []))
            .input('UPDATEDUSER', apiHelper.getValueFromObject(auth, 'auth_name'))
            .execute('HR_OFFWORKTYPE_Delete_AdminWeb');
        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, { function: 'offworkTypeService.deleteOffWorkType' });

        // Return failed
        return new ServiceResponse(false, e.message);
    }
};

const getListOffWorkRlUser = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('OFFWORKTYPEID', apiHelper.getValueFromObject(queryParams, 'off_work_type_id'))
            .input('USERNAME', apiHelper.getValueFromObject(queryParams, 'auth_name'))
            .execute('HR_OFFWORK_LEVEL_USER_GetByOffWorkType_AdminWeb');

        const rlUsers = OffWorkTypeClass.listRlUser(data.recordset, false);

        const res = rlUsers.reduce((acc, curr) => {
            if (!acc[(curr.offwork_review_level_id, curr.offwork_review_level_name)])
                acc[(curr.offwork_review_level_id, curr.offwork_review_level_name)] = []; //If this type wasn't previously stored
            acc[(curr.offwork_review_level_id, curr.offwork_review_level_name)].push({
                offwork_review_level_id: curr.offwork_review_level_id,
                full_name: curr.full_name,
                username: curr.username,
                user_id: curr.user_id,
                default_picture_url: curr.default_picture_url,
                company_id: curr.company_id,
                is_auto_review: curr.is_auto_review,
                department_id: curr.department_id,
            });
            return acc;
        }, {});
        const result = Object.keys(res).map((key) => {
            let objUsers = res[key];
            let users = Object.keys(objUsers).map((key1) => {
                return {
                    full_name: objUsers[key1].full_name,
                    username: objUsers[key1].username,
                    user_id: objUsers[key1].user_id,
                    default_picture_url: objUsers[key1].default_picture_url,
                    company_id: objUsers[key1].company_id,
                    department_id: objUsers[key1].department_id,
                };
            });
            return {
                offwork_review_level_name: key,
                offwork_review_level_id: res[key][0].offwork_review_level_id,
                company_id: res[key][0].company_id,
                users: users,
                is_auto_review: res[key][0].is_auto_review,
            };
        });

        return new ServiceResponse(true, '', {
            items: result,
        });
    } catch (e) {
        logger.error(e, { function: 'offworkTypeService.getListOffWorkRlUser' });
        return new ServiceResponse(true, '', {});
    }
};

const getOptionsForCreate = async (params = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('USERNAME', apiHelper.getValueFromObject(params, 'auth_name'))
            .execute('HR_OFFWORKTYPE_GetOptionsCreate_AdminWeb');
        return new ServiceResponse(true, '', OffWorkTypeClass.optionsCreate(data.recordset));
    } catch (e) {
        logger.error(e, { function: 'offworkTypeService.getOptionsForCreate' });
        return new ServiceResponse(false, e.message);
    }
};

const getOptionsForUser = async (params = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('USERNAME', apiHelper.getValueFromObject(params, 'auth_name'))
            .execute('HR_OFFWORKTYPE_GetOptionsByUser_AdminWeb');
        return new ServiceResponse(true, '', OffWorkTypeClass.optionsByUser(data.recordset));
    } catch (e) {
        logger.error(e, { function: 'offworkTypeService.getOptionsForUser' });
        return new ServiceResponse(false, e.message);
    }
};

module.exports = {
    getListOffWorkType,
    createOffWorkType,
    detailOffWorkType,
    updateOffWorkType,
    deleteOffWorkType,
    getListOffWorkRlUser,
    getOptionsForCreate,
    getOptionsForUser,
};
