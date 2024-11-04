const orderTypeClass = require('../order-type/order-type.class');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');

const getListOrderType = async (queryParams = {}) => {
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
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .input('BUSINESSID', apiHelper.getValueFromObject(queryParams, 'business_id'))
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'created_date_from'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'created_date_to'))

            .execute('SL_ORDERTYPE_GetList_AdminWeb');
        const orderTypeList = data.recordset;
        const dataOrderType = orderTypeClass.list(orderTypeList);
        const result = dataOrderType.map(({ business_list, ...item }) => ({
            ...item,
            business_names: business_list?.split(','),
        }));

        return new ServiceResponse(true, '', {
            data: result,
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(orderTypeList),
        });
    } catch (e) {
        logger.error(e, { function: 'orderTypeService.getListOrderType' });
        return new ServiceResponse(false, RESPONSE_MSG.REQUEST_FAILED);
    }
};

const detailOrderType = async (orderTypeId) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().input('ORDERTYPEID', +orderTypeId).execute('SL_ORDERTYPE_GetById_AdminWeb');

        if (!data.recordset) {
            return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
        }

        let orderType = orderTypeClass.detail(data.recordsets[0][0]);
        orderType.business_ids = orderType.business_list?.split(',')?.map((item) => +item) ?? [];
        orderType.order_status_list = [];
        if (data.recordsets[1].length) {
            orderType.order_status_list = orderTypeClass.statusListApply(data.recordsets[1]);
        }

        orderType.stocks_type_list = orderTypeClass.stocksType(data.recordsets?.[2] || []);

        return new ServiceResponse(true, '', orderType);
    } catch (e) {
        logger.error(e, { function: 'orderTypeService.detailOrderType' });
        return new ServiceResponse(false, e.message);
    }
};

const createOrderTypeOrUpdate = async (bodyParams) => {
    const order_type_id = apiHelper.getValueFromObject(bodyParams, 'order_type_id');
    const order_status_list = apiHelper.getValueFromObject(bodyParams, 'order_status_list') || [];
    const pool = await mssql.pool;
    const transaction = new sql.Transaction(pool);
    try {
        await transaction.begin();

        // Kiem tra co trung loai don hang khong
        const dataCheck = await pool
            .request()
            .input('ORDERTYPEID', order_type_id)
            .input('ISONLINE', apiHelper.getValueFromObject(bodyParams, 'is_online'))
            .input('ISOFFLINE', apiHelper.getValueFromObject(bodyParams, 'is_offline'))
            .input('ISWARRANTY', apiHelper.getValueFromObject(bodyParams, 'is_warranty'))
            .input('ISEXCHANGE', apiHelper.getValueFromObject(bodyParams, 'is_exchange'))
            .input('ISRETURN', apiHelper.getValueFromObject(bodyParams, 'is_return'))
            .input('ISOFFER', apiHelper.getValueFromObject(bodyParams, 'is_offer'))
            .input('COMPANYID', apiHelper.getValueFromObject(bodyParams, 'company_id'))
            .execute('SL_ORDERTYPE_CheckExist_AdminWeb');

        if (dataCheck.recordset[0].RESULT) {
            await transaction.rollback();
            return new ServiceResponse(
                false,
                'Đã tồn tại loại đơn hàng `<b>' + dataCheck.recordset[0].ORDERTYPE + '</b>.`',
            );
        }

        const createOrUpdateOrderTypeRequest = new sql.Request(transaction);
        const auth_name = apiHelper.getValueFromObject(bodyParams, 'auth_name');
        const data = await createOrUpdateOrderTypeRequest
            .input('ORDERTYPEID', order_type_id)
            .input('ORDERTYPENAME', apiHelper.getValueFromObject(bodyParams, 'order_type_name'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
            .input('ISONLINE', apiHelper.getValueFromObject(bodyParams, 'is_online'))
            .input('ISOFFLINE', apiHelper.getValueFromObject(bodyParams, 'is_offline'))
            .input('ISWARRANTY', apiHelper.getValueFromObject(bodyParams, 'is_warranty'))
            .input('ISEXCHANGE', apiHelper.getValueFromObject(bodyParams, 'is_exchange'))
            .input('ISRETURN', apiHelper.getValueFromObject(bodyParams, 'is_return'))
            .input('ISOFFER', apiHelper.getValueFromObject(bodyParams, 'is_offer'))
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system'))
            .input('ISALLBUSINESS', apiHelper.getValueFromObject(bodyParams, 'is_all_business'))

            .input('ADDFUNCTIONID', apiHelper.getValueFromObject(bodyParams, 'add_function_id'))
            .input('DELETEFUNCTIONID', apiHelper.getValueFromObject(bodyParams, 'delete_function_id'))
            .input('EDITFUNCTIONID', apiHelper.getValueFromObject(bodyParams, 'edit_function_id'))
            .input('VIEWFUNCTIONID', apiHelper.getValueFromObject(bodyParams, 'view_function_id'))

            .input('CREATEDUSER', auth_name)

            .input('COMPANYID', apiHelper.getValueFromObject(bodyParams, 'company_id'))
            .input('ORDERINDEX', apiHelper.getValueFromObject(bodyParams, 'order_index'))
            .input('OUTPUTTYPEID', apiHelper.getValueFromObject(bodyParams, 'out_put_type_id'))
            .input('TYPE', apiHelper.getValueFromObject(bodyParams, 'type'))
            .execute('SL_ORDERTYPE_CreateOrUpdate_AdminWeb');
        const orderTypeId = data.recordset[0].RESULT;
        if (!orderTypeId) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Thêm và cập nhật loại đơn hàng thất bại');
        }

        if (order_status_list.length) {
            if (order_type_id) {
                // Delete before update
                const dataDeleted = await deleteOrderTypeBusiness({ order_type_id, auth_name }, transaction);
                if (dataDeleted.isFailed()) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Xóa miền thất bại');
                }

                const deleteOrderStatusTypeRequest = new sql.Request(transaction);
                await deleteOrderStatusTypeRequest
                    .input('ORDERTYPEID', order_type_id)
                    .input('UPDATEDUSER', auth_name)
                    .execute('SL_ORDERTYPE_STATUS_Delete_AdminWeb');
            }

            const business_ids = apiHelper.getValueFromObject(bodyParams, 'business_ids');
            if (!apiHelper.getValueFromObject(bodyParams, 'is_all_business')) {
                for (const item of business_ids) {
                    const data = await createOrderTypeBusiness(
                        { business_id: item, auth_name, order_type_id: order_type_id ?? orderTypeId },
                        transaction,
                    );
                    if (data.isFailed()) {
                        await transaction.rollback();
                        return new ServiceResponse(false, 'Tạo miền thất bại');
                    }
                }
            }

            const createOrderStatusTypeRequest = new sql.Request(transaction);
            for (let i = 0; i < order_status_list.length; i++) {
                let brand_name = null,
                    sms_template_id = null,
                    content_sms = null;
                if (order_status_list[i].is_send_sms) {
                    brand_name = apiHelper.getValueFromObject(order_status_list[i].sms, 'brandname');
                    sms_template_id = apiHelper.getValueFromObject(order_status_list[i].sms, 'sms_template_id');
                    content_sms = apiHelper.getValueFromObject(order_status_list[i].sms, 'content_sms');
                }
                await createOrderStatusTypeRequest
                    .input('ORDERTYPEID', orderTypeId)
                    .input('ORDERTYPESTATUSID', order_status_list[i].order_type_status_id)
                    .input('ORDERSTATUSID', order_status_list[i].order_status_id)
                    .input('ORDERINDEX', i)
                    .input('ISCOMPLETED', order_status_list[i].is_completed || 0)
                    .input('BRANDNAME', brand_name)
                    .input('SMSTEMPLATEID', sms_template_id)
                    .input('CONTENTSMS', content_sms)
                    .input('ISSENDSMS', order_status_list[i].is_send_sms)
                    .input('ISSENDZALOOA', apiHelper.getValueFromObject(order_status_list[i], 'is_send_zalo_oa'))
                    .input('OATEMPLATEID', apiHelper.getValueFromObject(order_status_list[i], 'oa_template_id'))
                    .input('ISSENDEMAIL', apiHelper.getValueFromObject(order_status_list[i], 'is_send_email'))
                    .input('MAILFROM', apiHelper.getValueFromObject(order_status_list[i], 'mail_from'))
                    .input('MAILSUBJECT', apiHelper.getValueFromObject(order_status_list[i], 'mail_subject'))
                    .input('MAILFROMNAME', apiHelper.getValueFromObject(order_status_list[i], 'mail_from_name'))
                    .input('MAILREPLY', apiHelper.getValueFromObject(order_status_list[i], 'mail_reply'))
                    .input('EMAILTEMPLATEID', apiHelper.getValueFromObject(order_status_list[i], 'email_template_id'))
                    .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                    .execute('SL_ORDERTYPE_STATUS_Create_AdminWeb');
            }
        }
        const stocksTypeList = apiHelper.getValueFromObject(bodyParams, 'stocks_type_list', []);
        const createStocksTypeResult = await _createOrUpdateStocksTypeList(
            orderTypeId,
            stocksTypeList,
            auth_name,
            transaction,
        );
        if (!createStocksTypeResult) {
            return ServiceResponse(false, 'Tạo hoặc chỉnh sửa loại kho thất bại !');
        }

        await transaction.commit();
        return new ServiceResponse(true, '', orderTypeId);
    } catch (e) {
        await transaction.rollback();
        logger.error(e, { function: 'orderTypeService.createOrderTypeOrUpdate' });
        return new ServiceResponse(false, e.message, '');
    }
};

const _createOrUpdateStocksTypeList = async (orderTypeId, data, authName, transaction) => {
    try {
        // delete
        const request = new sql.Request(transaction);
        await request.input('ORDERTYPEID', orderTypeId).execute('SL_ORDERTYPE_STOCKSTYPE_DeleteByOrderType_AdminWeb');
        // insert
        const request_ = new sql.Request(transaction);
        for (const stockType of data) {
            await request_
                .input('ORDERTYPEID', orderTypeId)
                .input('STOCKSTYPEID', stockType.stocks_type_id)
                .input('CREATEDUSER', authName)
                .execute('SL_ORDERTYPE_STOCKSTYPE_Create_AdminWeb');
        }

        return true;
    } catch (error) {
        logger.error(error, { function: 'orderTypeService._createOrUpdateStocksTypeList' });
        throw error;
    }
};

const createOrderTypeBusiness = async (bodyParams = {}, transaction) => {
    try {
        const createOrderTypeBusiness = new sql.Request(transaction);
        const data = await createOrderTypeBusiness
            .input('ORDERTYPEID', apiHelper.getValueFromObject(bodyParams, 'order_type_id'))
            .input('BUSINESSID', apiHelper.getValueFromObject(bodyParams, 'business_id'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('SL_ORDERTYPE_BUSINESS_Create_AdminWeb');
        const orderTypeBusinessId = data.recordset[0].id;

        return new ServiceResponse(true, '', orderTypeBusinessId);
    } catch (e) {
        await transaction.rollback();
        logger.error(e, { function: 'orderTypeService.createOrderTypeBusiness' });
        return new ServiceResponse(false, e.message, '');
    }
};

const deleteOrderTypeBusiness = async (bodyParams = {}, transaction) => {
    try {
        const deleteOrderTypeBusiness = new sql.Request(transaction);
        const data = await deleteOrderTypeBusiness
            .input('ORDERTYPEID', apiHelper.getValueFromObject(bodyParams, 'order_type_id'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('SL_ORDERTYPE_BUSINESS_Delete_AdminWeb');
        const orderTypeId = data.recordset[0].id;

        return new ServiceResponse(true, 'Xóa thành công', orderTypeId);
    } catch (e) {
        await transaction.rollback();
        logger.error(e, { function: 'orderTypeService.deleteOrderTypeBusiness' });
        return new ServiceResponse(false, e.message);
    }
};

const deleteOrderType = async (bodyParams) => {
    try {
        const pool = await mssql.pool;
        await pool
            .request()
            .input('ORDERTYPEIDS', apiHelper.getValueFromObject(bodyParams, 'ids'))
            .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('SL_ORDERTYPE_Delete_AdminWeb');
        return new ServiceResponse(true, RESPONSE_MSG.CRUD.DELETE_SUCCESS, true);
    } catch (e) {
        logger.error(e, { function: 'orderTypeService.deleteOrderType' });
        return new ServiceResponse(false, e.message);
    }
};

module.exports = {
    getListOrderType,
    detailOrderType,
    createOrderTypeOrUpdate,
    deleteOrderType,
};
