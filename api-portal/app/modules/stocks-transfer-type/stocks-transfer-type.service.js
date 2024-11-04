const stocksTransferTypeClass = require('./stocks-transfer-type.class');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const sql = require('mssql');

const getListStocksTransferType = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getSearch(queryParams);
        const pool = await mssql.pool;
        const resStocksTransferType = await pool
            .request()
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('KEYWORD', keyword)
            .input('FROMDATE', apiHelper.getValueFromObject(queryParams, 'from_date', null))
            .input('TODATE', apiHelper.getValueFromObject(queryParams, 'to_date', null))
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active', 1))
            .execute('ST_STOCKSTRANSFERTYPE_GetList_AdminWeb');

        let data = resStocksTransferType.recordset;
        return new ServiceResponse(true, '', {
            data: stocksTransferTypeClass.list(data),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data),
        });
    } catch (error) {
        logger.error(error, {function: 'stocks-transfer-type.service.getListStocksTransferType'});
        return new ServiceResponse(false, 'Lỗi lấy danh sách hình thức luân chuyển kho.', {});
    }
};

const delStocksTransferType = async bodyParams => {
    try {
        let ids = apiHelper.getValueFromObject(bodyParams, 'ids', []);
        const pool = await mssql.pool;
        await pool
            .request()
            .input('STOCKSTRANSFERTYPEIDS', (ids || []).join(','))
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('ST_STOCKSTRANSFERTYPE_Delete_AdminWeb');
        return new ServiceResponse(true, '', true);
    } catch (error) {
        logger.error(error, {function: 'stocks-transfer-type.service.delStocksTransferType'});
        return new ServiceResponse(false, 'Lỗi xoá hình thức luân chuyển kho.');
    }
};

const getSocksTransferTypeById = async id => {
    try {
        const pool = await mssql.pool;
        const resData = await pool
            .request()
            .input('STOCKSTRANSFERTYPEID', id)
            .execute('ST_STOCKSTRANSFERTYPE_GetById_AdminWeb');

        let stocks_transfer_type = stocksTransferTypeClass.detail(resData.recordsets[0][0]) || {};
        let reviews = stocksTransferTypeClass.listStocksTransReview(resData.recordsets[1]) || [];
        let listUser = stocksTransferTypeClass.listStocksTransReviewUser(resData.recordsets[2]) || [];
        reviews = (reviews || []).map(p => {
            let users = listUser.filter(x => x.stocks_review_level_id == p.stocks_review_level_id) || [];
            return {
                ...p,
                users,
            };
        });
        stocks_transfer_type.reviews = reviews;

        let _ids = (reviews || []).map(p => p.stocks_review_level_id).join(',');
        if (_ids) {
            const resUser = await pool
                .request()
                .input('STOCKSREVIEWLEVELIDS', _ids)
                .execute('ST_STOCKSTRANSFERTYPE_GetUserOfReviewLevel_AdminWeb');

            let _dataUsers = stocksTransferTypeClass.listReviewUser(resUser.recordset);
            let obj = {};
            for (let i = 0; i < _dataUsers.length; i++) {
                let user = _dataUsers[i];
                obj[user.stocks_review_level_id] = [...(obj[user.stocks_review_level_id] || []), user];
            }
            stocks_transfer_type.review_users = obj;
        }

        return new ServiceResponse(true, '', stocks_transfer_type);
    } catch (error) {
        logger.error(error, {function: 'stocks-transfer-type.service.getSocksTransferTypeById'});
        return new ServiceResponse(false, 'Lỗi lấy chi tiết hình thức luân chuyển kho.');
    }
};

const createOrUpdateStocksTransferType = async (bodyParams = {}) => {
    let stocksTransferTypeId = apiHelper.getValueFromObject(bodyParams, 'stocks_transfer_type_id', null);
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        await transaction.begin();
        const reqInsStocksTransferType = new sql.Request(transaction);
        let resCreate = await reqInsStocksTransferType
            .input('STOCKSTRANSFERTYPEID', stocksTransferTypeId)
            .input('TRANSFERTYPE', apiHelper.getValueFromObject(bodyParams, 'transfer_type'))
            .input(
                'STOCKSTRANSFERTYPENAME',
                apiHelper.getValueFromObject(bodyParams, 'stocks_transfer_type_name', null),
            )
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description', null))
            .input('ISSTOCKSINREVIEW', apiHelper.getValueFromObject(bodyParams, 'is_stocks_in_review', true))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name', 'administrator'))
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active', 1))
            .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system', 0))
            .execute('ST_STOCKSTRANSFERTYPE_CreateOrUpdate_AdminWeb');

        const {RESULT = 0} = resCreate.recordset[0];
        if (!RESULT) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Lỗi thêm mới hình thức luân chuyển kho.');
        }

        //DELETE WHEN UPDATE
        if (stocksTransferTypeId) {
            const reqDelReviewLevel = new sql.Request(transaction);
            await reqDelReviewLevel
                .input('STOCKSTRANSFERTYPEID', stocksTransferTypeId)
                .execute('ST_STOCKSTRANSTYPE_REVIEWLEVEL_Delete_AdminWeb');
        }

        //INSERT REVIEW LEVEL
        let reviews = apiHelper.getValueFromObject(bodyParams, 'reviews', []);
        if (reviews && reviews.length > 0) {
            const reqCreateReviewLevel = new sql.Request(transaction);
            const reqCreateUser = new sql.Request(transaction);

            for (let i = 0; i < reviews.length; i++) {
                let _review = reviews[i];
                await reqCreateReviewLevel
                    .input('STOCKSTRANSFERTYPEID', RESULT)
                    .input('STOCKSREVIEWLEVELID', _review.stocks_review_level_id)
                    .input('REVIEWORDERINDEX', i)
                    .input('ISAUTOREVIEW', _review.is_auto_reviewed)
                    .input('ISCOMPLETEDREVIEWED', _review.is_completed_reviewed)
                    .execute('ST_STOCKSTRANSTYPE_REVIEWLEVEL_Create_AdminWeb');

                //INSERT USER
                if (_review.users && _review.users.length > 0) {
                    for (let j = 0; j < _review.users.length; j++) {
                        const _user = _review.users[j];
                        await reqCreateUser
                            .input('STOCKSTRANSFERTYPEID', RESULT)
                            .input('STOCKSREVIEWLEVELID', _review.stocks_review_level_id)
                            .input('DEPARTMENTID', _user.department_id)
                            .input('USERNAME', _user.id)
                            .execute('ST_STOCKSTRANSTYPE_RL_USER_Create_AdminWeb');
                    }
                }
            }
        }

        await transaction.commit();
        return new ServiceResponse(
            true,
            `${stocksTransferTypeId ? 'Cập nhật' : 'Thêm mới'} hình thức luân chuyển kho thành công.`,
            true,
        );
    } catch (error) {
        await transaction.rollback();
        logger.error(error, {function: 'stocks-transfer-type.service.createOrUpdateStocksTransferType'});
        return new ServiceResponse(
            false,
            `Lỗi ${stocksTransferTypeId ? 'cập nhật' : 'thêm mới'} hình thức luân chuyển kho.`,
        );
    }
};

const getOptionsReviewLevel = async () => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().execute('ST_STOCKSTRANSFERTYPE_GetReviewLevel_AdminWeb');
        return new ServiceResponse(true, '', stocksTransferTypeClass.options(data.recordset));
    } catch (e) {
        logger.error(error, {function: 'stocks-transfer-type.service.getOptionsReviewLevel'});
        return new ServiceResponse(true, '', []);
    }
};

const getOptions = async () => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().execute('ST_STOCKSTRANSFERTYPE_GetOptions_AdminWeb');
        return new ServiceResponse(true, '', stocksTransferTypeClass.getOptions(data.recordset));
    } catch (e) {
        logger.error(error, {function: 'stocks-transfer-type.service.getOptions'});
        return new ServiceResponse(true, '', []);
    }
};

module.exports = {
    getListStocksTransferType,
    delStocksTransferType,
    getSocksTransferTypeById,
    createOrUpdateStocksTransferType,
    getOptionsReviewLevel,
    getOptions
};
