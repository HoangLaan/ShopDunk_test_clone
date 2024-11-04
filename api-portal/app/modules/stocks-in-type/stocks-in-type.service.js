const stocksInTypeClass = require('../stocks-in-type/stocks-in-type.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');

const getListStocksInType = async (queryParams = {}) => {
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
            .input('STOCKSINTYPE', apiHelper.getValueFromObject(queryParams, 'stocks_in_type'))
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'create_date_from'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'create_date_to'))
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .execute(PROCEDURE_NAME.ST_STOCKSINTYPE_GETLIST_ADMINWEB);
        const StocksInTypes = data.recordsets[0];
        const totalItem = data.recordsets[1][0].TOTAL;
        let dataParseInt = stocksInTypeClass.list(StocksInTypes);

        return new ServiceResponse(true, '', {
            data: dataParseInt,
            page: currentPage,
            limit: itemsPerPage,
            total: totalItem,
        });
    } catch (e) {
        logger.error(e, { function: 'StocksInTypeService.getListStocksInType' });
        return new ServiceResponse(true, '', {});
    }
};

// detail StocksInType
const detailStocksInType = async (stocksInTypeId) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('STOCKSINTYPEID', stocksInTypeId)
            .execute('ST_STOCKSINTYPE_GetById_AdminWeb');

        let stocks_in_type = stocksInTypeClass.detail(data.recordsets[0][0]) || {};

        let reviews = stocksInTypeClass.listReviewLevel(data.recordsets[1]) || [];
        let listUser = stocksInTypeClass.listReviewUser(data.recordsets[2]) || [];

        reviews = (reviews || []).map((p) => {
            let users = listUser.filter((x) => x.stocks_in_review_level_id == p.stocks_in_review_level_id) || [];
            return {
                ...p,
                users,
            };
        });
        stocks_in_type.stocks_in_review_level_list = reviews;

        let _ids = (reviews || []).map((p) => p.stocks_review_level_id).join(',');
        if (_ids) {
            const resUser = await pool
                .request()
                .input('IDS', _ids)
                .execute('ST_STOCKSINTYPE_GetUserBYReviewLevelId_AdminWeb');

            let _dataUsers = stocksInTypeClass.listReviewUser(resUser.recordset);

            let obj = {};
            for (let i = 0; i < _dataUsers.length; i++) {
                let user = _dataUsers[i];
                obj[user.stocks_review_level_id] = [...(obj[user.stocks_review_level_id] || []), user];
            }
            stocks_in_type.review_users = obj;
        }

        return new ServiceResponse(true, '', stocks_in_type);
    } catch (e) {
        logger.error(e, { function: 'stocksInTypeService.getListStocksInType' });
        return new ServiceResponse(false, e.message);
    }
};

const deleteStocksInType = async (bodyParams) => {
    try {
        const pool = await mssql.pool;
        await pool
            .request()
            .input('STOCKSINTYPEIDS', apiHelper.getValueFromObject(bodyParams, 'ids'))
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute(PROCEDURE_NAME.ST_STOCKSINTYPE_DELETE_ADMINWEB);
        return new ServiceResponse(true, RESPONSE_MSG.STOCKSINTYPE.DELETE_SUCCESS, '');
    } catch (e) {
        logger.error(e, { function: 'stocksInTypeService.deleteStocksInType' });
        return new ServiceResponse(false, e.message);
    }
};

// create or update StocksInType
const createOrUpdateStocksInType = async (bodyParams) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        await transaction.begin();
        //check name
        const dataCheck = await pool
            .request()
            .input('STOCKSINTYPEID', apiHelper.getValueFromObject(bodyParams, 'stocks_in_type_id'))
            .input('STOCKSINTYPENAME', apiHelper.getValueFromObject(bodyParams, 'stocks_in_type_name'))
            .execute('ST_STOCKSINTYPE_CheckName_AdminWeb');
        if (dataCheck.recordset && dataCheck.recordset[0].RESULT == 1) {
            return new ServiceResponse(false, RESPONSE_MSG.STOCKSINTYPE.EXISTS_NAME, null);
        }

        const data = await pool
            .request()
            .input('STOCKSINTYPEID', apiHelper.getValueFromObject(bodyParams, 'stocks_in_type_id'))
            .input('STOCKSINTYPENAME', apiHelper.getValueFromObject(bodyParams, 'stocks_in_type_name'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
            .input('ISAUTOREVIEW', apiHelper.getValueFromObject(bodyParams, 'is_auto_review'))

            .input('ISTRANSFER', apiHelper.getValueFromObject(bodyParams, 'is_transfer'))
            .input('ISPURCHASE', apiHelper.getValueFromObject(bodyParams, 'is_purchase'))
            .input('ISINVENTORYCONTROL', apiHelper.getValueFromObject(bodyParams, 'is_inventory_control'))
            .input('ISEXCHANGEGOODS', apiHelper.getValueFromObject(bodyParams, 'is_exchange_goods'))
            .input('ISWARRANTY', apiHelper.getValueFromObject(bodyParams, 'is_warranty'))
            .input(
                'ISDISASSEMBLEELECTRONICSCOMPONENT',
                apiHelper.getValueFromObject(bodyParams, 'is_electronics_component'),
            )
            .input('ISINTERNAL', apiHelper.getValueFromObject(bodyParams, 'is_internal'))
            .input('ISDIFFERENT', apiHelper.getValueFromObject(bodyParams, 'is_different'))
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system', 0))
            .input('ISRETURNEDGOODS', apiHelper.getValueFromObject(bodyParams, 'is_returned_goods'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('ST_STOCKSINTYPE_CreateOrUpdate_AdminWeb');
        const stocksInTypeId = data.recordset[0].RESULT;

        // remove table ST_STOCKSINTYPE_REVIEWLEVEL
        const requestDeleteReviewLevel = new sql.Request(transaction);
        const dataReviewLevelDelete = await requestDeleteReviewLevel
            .input('STOCKSINTYPEID', stocksInTypeId)
            .execute('ST_STOCKSINTYPE_REVIEWLEVEL_Delete_AdminWeb');
        const resultDeleteReviewLevel = dataReviewLevelDelete.recordset[0].RESULT;
        if (resultDeleteReviewLevel <= 0) {
            return new ServiceResponse(false, RESPONSE_MSG.STOCKSINTYPE.UPDATE_FAILED);
        }

        // remove table ST_STOCKSINTYPE_REVIEWLEVEL
        const requestDeleteReviewUser = new sql.Request(transaction);
        const dataReviewUserDelete = await requestDeleteReviewUser
            .input('STOCKSINTYPEID', stocksInTypeId)
            .execute('ST_STOCKSINTYPE_RL_USER_Delete_AdminWeb');
        const resultDeleteReviewUser = dataReviewUserDelete.recordset[0].RESULT;
        if (resultDeleteReviewUser <= 0) {
            return new ServiceResponse(false, RESPONSE_MSG.STOCKSINTYPE.UPDATE_FAILED);
        }

        const stocks_in_review_level_list = apiHelper.getValueFromObject(bodyParams, 'stocks_in_review_level_list');
        if (stocks_in_review_level_list && stocks_in_review_level_list.length > 0) {
            for (let i = 0; i < stocks_in_review_level_list.length; i++) {
                let item = stocks_in_review_level_list[i];
                const requestStocksInTypeListCreate = new sql.Request(transaction);
                const dataStocksInTypeListCreate = await requestStocksInTypeListCreate // eslint-disable-line no-await-in-loop
                    .input('STOCKSINTYPEID', stocksInTypeId) // hình thức phiếu nhập
                    .input(
                        'STOCKSINTYPEREVIEWLEVELID',
                        apiHelper.getValueFromObject(item, 'stocks_in_type_review_level_id'),
                    ) // tự sinh
                    .input('STOCKSREVIEWLEVELID', apiHelper.getValueFromObject(item, 'stocks_review_level_id')) // mức duyệt
                    .input('ISAUTOREVIEWED', apiHelper.getValueFromObject(item, 'is_auto_reviewed', 0))
                    .input('ISCOMPLETEDREVIEWED', apiHelper.getValueFromObject(item, 'is_completed_reviewed', 0))
                    .execute('ST_STOCKSINTYPE_REVIEWLEVEL_Create_AdminWeb');
                const stocksInTypeReviewLVId = dataStocksInTypeListCreate.recordset[0].RESULT;
                if (stocksInTypeReviewLVId <= 0) {
                    return new ServiceResponse(false, e.message);
                }
                let usersLength = item.users.length;

                if (usersLength > 0) {
                    for (let m = 0; m < usersLength; m++) {
                        let itemUser = item.users[m];
                        const requestStocksInTypeListUserCreate = new sql.Request(transaction);
                        const dataStocksInTypeListUserCreate = await requestStocksInTypeListUserCreate // eslint-disable-line no-await-in-loop
                            .input('STOCKSINTYPEREVIEWLEVELID', stocksInTypeReviewLVId)
                            .input('STOCKSINTYPEID', stocksInTypeId)
                            .input('DEPARTMENTID', apiHelper.getValueFromObject(itemUser, 'department_id'))
                            .input('USERNAME', apiHelper.getValueFromObject(itemUser, 'value'))
                            .execute('ST_STOCKSINTYPE_RL_USER_Create_AdminWeb');
                        const itemStocksInTypeListUserId = dataStocksInTypeListUserCreate.recordset[0].RESULT;
                        if (itemStocksInTypeListUserId <= 0) {
                            return new ServiceResponse(false, e.message);
                        }
                    }
                }
            }
        }

        if (stocksInTypeId <= 0) {
            return new ServiceResponse(false, RESPONSE_MSG.STOCKSINTYPE.CREATE_FAILED);
        }

        removeCacheOptions();
        await transaction.commit();
        return new ServiceResponse(true, 'update success', stocksInTypeId);
    } catch (e) {
        await transaction.rollback();
        logger.error(e, { function: 'stocksInType.createOrUpdateStocksInType' });
        return new ServiceResponse(false, RESPONSE_MSG.STOCKSINTYPE.CREATE_FAILED);
    }
};

const removeCacheOptions = () => {
    return cacheHelper.removeByKey(CACHE_CONST.CRM_TASKTYPE_OPTIONS);
};

const getOptionsReviewLevelIn = async (queryParams) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().execute('ST_STOCKSREVIEWLEVEL_GetOptionIn_AdminWeb');
        let stocksIn = stocksInTypeClass.options(data.recordset);
        return new ServiceResponse(true, '', stocksIn);
    } catch (e) {
        logger.error(e, { function: 'stocksInType.getOptionsReviewLevelIn' });
        return new ServiceResponse(false, e.message);
    }
};

const getListUserReview = async (queryParams) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('STOCKSREVIEWLEVELID', apiHelper.getValueFromObject(queryParams, 'stocks_review_level_id'))
            .execute('ST_STOCKSREVIEWLEVEL_GetUserReview_AdminWeb');
        let userReview = stocksInTypeClass.options(data.recordset);
        return new ServiceResponse(true, '', userReview);
    } catch (e) {
        logger.error(e, { function: 'stocksInType.getListUserReview' });
        return new ServiceResponse(false, e.message);
    }
};

module.exports = {
    getListStocksInType,
    detailStocksInType,
    deleteStocksInType,
    createOrUpdateStocksInType,
    getListUserReview,
    getOptionsReviewLevelIn,
};
