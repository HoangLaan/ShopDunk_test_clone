const lodash = require('lodash');
const sql = require('mssql');
const mssql = require('../../models/mssql');

const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const {convertTime} = require('../../common/helpers/datetime.helper');
const {CHECK_LOCKED_RESPONSE, LOCKSHIFT_TYPE, LOCKED_SHIFT} = require('./constants');
const {checkValidId} = require('../../common/helpers/string.helper');
const moment = require('moment');

const moduleClass = require('./lockshift-close.class');

const getListLockshift = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const createDateFrom = apiHelper.getValueFromObject(queryParams, 'created_date_from');
        const createDateTo = apiHelper.getValueFromObject(queryParams, 'created_date_to');
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('CREATEDDATEFROM', createDateFrom)
            .input('CREATEDDATETO', createDateTo)
            .input('STOREID', apiHelper.getValueFromObject(queryParams, 'store_id'))
            .input('SHIFTID', apiHelper.getValueFromObject(queryParams, 'shift_id'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(queryParams, 'created_user'))
            .execute(PROCEDURE_NAME.MD_LOCKSHIFT_CLOSE_GETLIST_ADMINWEB);

        return new ServiceResponse(true, '', {
            data: moduleClass.list(data.recordset),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordset),
        });
    } catch (e) {
        logger.error(e, {function: 'LockshiftCloseService.getListLockshift'});
        return new ServiceResponse(true, '', []);
    }
};

const createOrUpdateLockshift = async bodyParams => {
    const pool = await mssql.pool;
    const transaction = new sql.Transaction(pool);

    let lockshiftId = apiHelper.getValueFromObject(bodyParams, 'lockshift_id');
    let cashList = apiHelper.getValueFromObject(bodyParams, 'cash_list', []);
    let productList = apiHelper.getValueFromObject(bodyParams, 'product_list', []);
    let equipmentList = apiHelper.getValueFromObject(bodyParams, 'equipment_list', []);
    const auth_name = apiHelper.getValueFromObject(bodyParams, 'auth_name');

    // calculate total cash list
    const totalCash = _calculateTotalCash(cashList);
    // calculate update data
    _calculateUpdateData(cashList);

    try {
        // get current lock shift
        if (!checkValidId(lockshiftId)) {
            const currentLockshift = await _getCurrentLockShiftClose(auth_name);
            if (currentLockshift) {
                bodyParams.parent_id = currentLockshift.parent_id;
                bodyParams.store_id = currentLockshift.store_id;
                bodyParams.shift_id = currentLockshift.shift_id;
                bodyParams.shift_leader = currentLockshift.shift_leader;
                bodyParams.shift_time = currentLockshift.shift_time;
            } else {
                return new ServiceResponse(false, 'Bạn không có ca ngày hôm nay !');
            }
        }

        await transaction.begin();
        const requestUpdateLockshift = new sql.Request(transaction);
        const lockshiftRes = await requestUpdateLockshift
            .input('LOCKSHIFTID', lockshiftId)
            .input('PARENTID', apiHelper.getValueFromObject(bodyParams, 'parent_id'))
            .input('STOREID', apiHelper.getValueFromObject(bodyParams, 'store_id'))
            .input('SHIFTID', apiHelper.getValueFromObject(bodyParams, 'shift_id'))
            .input('SHIFTLEADER', apiHelper.getValueFromObject(bodyParams, 'shift_leader'))
            .input('ORDERNUMBER', apiHelper.getValueFromObject(bodyParams, 'order_number'))
            .input('ISLOCKEDSHIFT', apiHelper.getValueFromObject(bodyParams, 'is_locked_shift') || 0)
            .input('TOTALCASH', totalCash)
            .input('NOTE', apiHelper.getValueFromObject(bodyParams, 'note'))
            .input('CREATEDUSER', auth_name)
            .execute(PROCEDURE_NAME.MD_LOCKSHIFT_CLOSE_CREATEORUPDATE_ADMINWEB);

        lockshiftId = lockshiftRes.recordset[0].RESULT;

        if (!lockshiftId) {
            throw new Error('Create or update lock shift failed !');
        } else {
            bodyParams.lockshift_id = lockshiftId;
        }

        // const deleteResult = await _deleteAllProductAndEquipment(lockshiftId, auth_name, transaction);
        // if (!deleteResult) {
        //     await transaction.rollback();
        //     throw new Error('Delete lock shift products and equipments failed !');
        // }

        // update cash list
        if (cashList && cashList.length > 0) {
            const updateResult = await updateLockshiftCashs(bodyParams, transaction);
            if (updateResult.isFailed()) {
                await transaction.rollback();
                throw new Error('Create or update lock shift cash failed !');
            }
        }

        // update product list
        if (productList && productList.length > 0) {
            const updateResult = await updateLockshiftProducts(bodyParams, transaction);
            if (updateResult.isFailed()) {
                await transaction.rollback();
                throw new Error('Create or update lock shift product list failed !');
            }
        }

        // update equipment list
        if (equipmentList && equipmentList.length > 0) {
            const updateResult = await updateLockshiftEquipments(bodyParams, transaction);
            if (updateResult.isFailed()) {
                await transaction.rollback();
                throw new Error('Create or update lock shift equipment list failed !');
            }
        }

        await transaction.commit();

        return new ServiceResponse(true, '', lockshiftId);
    } catch (e) {
        await transaction.rollback();
        logger.error(e, {function: 'LockshiftCloseService.createOrUpdateLockshift'});
        return new ServiceResponse(false, e.message);
    }
};

const _calculateUpdateData = cashList => {
    cashList.forEach(cash => {
        const total_money = cash.denominations_value * cash.actual_quantity;
        cash.total_money = !isNaN(total_money) ? total_money : 0;
    });
};

const _calculateTotalCash = cashList => {
    const totalCash = cashList.reduce((total, cash) => {
        const total_money = cash.denominations_value * cash.actual_quantity;
        return !isNaN(total_money) ? total + total_money : total;
    }, 0);
    return totalCash;
};

const getDetailLockshift = async queryParams => {
    try {
        const lockshiftId = apiHelper.getValueFromObject(queryParams, 'lockshift_id');
        const auth_name = apiHelper.getValueFromObject(queryParams, 'auth_name');

        let lockshiftDetail = {};

        if (!checkValidId(lockshiftId)) {
            const currentLockshift = await _getDetailCurrentLockshiftClose(auth_name);
            if (!currentLockshift) {
                return new ServiceResponse(false, 'Ca hiên tại không hợp lệ !');
            } else {
                lockshiftDetail = currentLockshift;
            }
        } else {
            const pool = await mssql.pool;
            const responseData = await pool
                .request()
                .input('LOCKSHIFTID', lockshiftId)
                .execute(PROCEDURE_NAME.MD_LOCKSHIFT_CLOSE_GETBYID_ADMINWEB);

            if (responseData.recordset[0]) {
                lockshiftDetail = moduleClass.detail(responseData.recordset[0]);
            } else {
                return new ServiceResponse(false, 'RECORD NOT FOUND');
            }
        }

        const lockshiftCashs = await getListLockshiftCash(lockshiftId);
        if (lockshiftDetail && lockshiftCashs.isSuccess()) {
            // convert work time
            lockshiftDetail.work_time = convertTime(
                lockshiftDetail?.shift_hourstart,
                lockshiftDetail?.shift_minutestart,
                lockshiftDetail?.shift_hourend,
                lockshiftDetail.shift_minutend,
            );
            lockshiftDetail.cash_list = lockshiftCashs.getData();
            return new ServiceResponse(true, '', lockshiftDetail);
        }

        return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
    } catch (e) {
        logger.error(e, {function: 'LockshiftCloseService.getDetailLockshift'});

        return new ServiceResponse(false, e.message);
    }
};

const getListLockshiftCash = async id => {
    try {
        const pool = await mssql.pool;
        const responseData = await pool
            .request()
            .input('LOCKSHIFTID', id)
            .execute(PROCEDURE_NAME.MD_LOCKSHIFT_CLOSE_GETCASHLIST_ADMINWEB);

        let lockshiftCash = responseData.recordset;

        if (lockshiftCash) {
            const CDN_PREFIX = process.env.DOMAIN_CDN;

            return new ServiceResponse(
                true,
                '',
                moduleClass.cashList(lockshiftCash).map(cash => ({
                    ...cash,
                    image_url: CDN_PREFIX + cash.image_url,
                    actual_quantity: cash.actual_quantity ?? 0,
                })),
            );
        }

        return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
    } catch (e) {
        logger.error(e, {function: 'LockshiftCloseService.getDetailLockshift'});

        return new ServiceResponse(false, e.message);
    }
};

const updateLockshiftCashs = async (bodyParams, transaction) => {
    const lockshiftId = apiHelper.getValueFromObject(bodyParams, 'lockshift_id');
    const cashList = apiHelper.getValueFromObject(bodyParams, 'cash_list', []);

    try {
        for (let cash of cashList) {
            const transactionRequest = new sql.Request(transaction);

            await transactionRequest
                .input('LOCKSHIFTID', lockshiftId)
                .input('DENOMINATIONSID', cash.denominations_id)
                .input('ACTUALQUANTITY', cash.actual_quantity)
                .input('NOTE', cash.note)
                .input('TOTALMONEY', cash.total_money)
                .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'created_user'))
                .execute('MD_LOCKSHIFT_CLOSE_CASH_CreateOrUpdate_AdminWeb');
        }

        return new ServiceResponse(true, '');
    } catch (error) {
        logger.error(error, {function: 'LockShiftClostService.updateLockshiftCashs'});
        return new ServiceResponse(false, error.message);
    }
};

const _deleteAllProductAndEquipment = async (lockshiftId, authUser, transaction) => {
    try {
        if (lockshiftId) {
            const transactionRequest = new sql.Request(transaction);
            const deleteReuslt = await transactionRequest
                .input('LOCKSHIFTID', lockshiftId)
                .input('UPDATEDUSER', authUser)
                .execute('MD_LOCKSHIFT_OPEN_DeleteProductAndEquipment_AdminWeb');
            return deleteReuslt;
        }
    } catch (error) {
        logger.error(error, {function: 'LockShiftClostService._deleteAllProductAndEquipment'});
        return false;
    }
};

const updateLockshiftProducts = async (bodyParams, transaction) => {
    const lockshiftId = apiHelper.getValueFromObject(bodyParams, 'lockshift_id');
    const productList = apiHelper.getValueFromObject(bodyParams, 'product_list', []);

    try {
        for (let product of productList) {
            const transactionRequest = new sql.Request(transaction);

            await transactionRequest
                .input('LOCKSHIFTID', lockshiftId)
                .input('PRODUCTID', product.product_id)
                .input('STOCKSID', product.stocks_id)
                .input('ACTUALINVENTORY', product.actual_inventory)
                .input('TOTALINVENTORY', product.total_inventory)
                .input('NOTE', product.note)
                .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'created_user'))
                .execute(PROCEDURE_NAME.MD_LOCKSHIFT_CLOSE_PRODUCTLIST_CREATEORUPDATE_ADMINWEB);
        }

        return new ServiceResponse(true, '');
    } catch (error) {
        logger.error(error, {function: 'LockShiftClostService.updateLockshiftProducts'});
        return new ServiceResponse(false, error.message);
    }
};

const updateLockshiftEquipments = async (bodyParams, transaction) => {
    const lockshiftId = apiHelper.getValueFromObject(bodyParams, 'lockshift_id');
    const equipmentList = apiHelper.getValueFromObject(bodyParams, 'equipment_list', []);

    try {
        for (let equipment of equipmentList) {
            const transactionRequest = new sql.Request(transaction);

            await transactionRequest
                .input('LOCKSHIFTID', lockshiftId)
                .input('EQUIPMENTID', equipment.product_id)
                .input('STOCKSID', equipment.stocks_id)
                .input('ACTUALINVENTORY', equipment.actual_inventory)
                .input('TOTALINVENTORY', equipment.total_inventory)
                .input('NOTE', equipment.note)
                .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'created_user'))
                .execute(PROCEDURE_NAME.MD_LOCKSHIFT_CLOSE_EQUIPMENTLIST_CREATEORUPDATE_ADMINWEB);
        }

        return new ServiceResponse(true, '');
    } catch (error) {
        logger.error(error, {function: 'LockShiftClostService.updateLockshiftEquipments'});
        return new ServiceResponse(false, error.message);
    }
};

const checkIsLockedShift = async lockshiftId => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('LOCKSHIFTID', lockshiftId)
            .execute('MD_LOCKSHIFT_Check_IsLockedShift_AdminWeb');

        return data.recordset[0]['RESULT'];
    } catch (e) {
        logger.error(e, {function: 'LockshiftCloseService.checkIsLockedShift'});
        return new ServiceResponse(false, e.message);
    }
};

const statisticsLockshift = async queryParams => {
    try {
        const lockshiftId = apiHelper.getValueFromObject(queryParams, 'lockshift_id');
        const auth_name = apiHelper.getValueFromObject(queryParams, 'auth_name');

        if (!checkValidId(lockshiftId)) {
            const currentLockshift = await _getDetailCurrentLockshiftClose(auth_name);

            return new ServiceResponse(true, '', {
                current_total_money: 0,
                previous_total_money: currentLockshift?.previous_total_money,
                product_count: 0,
                equipment_count: 0,
                customer_count: currentLockshift?.previous_customer_count,
                order_count: 0,
            });
        }

        const pool = await mssql.pool;
        const responseData = await pool
            .request()
            .input('LOCKSHIFTID', lockshiftId)
            .execute(PROCEDURE_NAME.MD_LOCKSHIFT_CLOSE_GETSTATISTICS_ADMINWEB);

        const data = responseData.recordsets;
        if (data && data.length > 0) {
            const current_total_money = data[0][0]?.CURRENTTOTALMONEY ?? 0;
            const order_count = data[0][0]?.ORDERCOUNT ?? 0;
            const previous_total_money = data[1][0]?.PREVIOUSTOTALMONEY ?? 0;
            const product_count = data[2][0]?.PRODUCTCOUNT ?? 0;
            const equipment_count = data[3][0]?.EQUIPMENTCOUNT ?? 0;
            const customer_count = data[4][0]?.CUSTOMERCOUNT ?? 0;

            return new ServiceResponse(true, '', {
                current_total_money,
                previous_total_money,
                product_count,
                equipment_count,
                customer_count,
                order_count,
            });
        }

        return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
    } catch (e) {
        logger.error(e, {function: 'LockshiftCloseService.getDetailLockshift'});

        return new ServiceResponse(false, e.message);
    }
};

const getListLockshiftProduct = async queryParams => {
    try {
        const pool = await mssql.pool;
        const lockshift_id = apiHelper.getValueFromObject(queryParams, 'lockshift_id');
        if (!checkValidId(lockshift_id)) {
            const auth_name = apiHelper.getValueFromObject(queryParams, 'auth_name');
            const currentLockshift = await _getCurrentLockShiftClose(auth_name);
            const store_id = currentLockshift?.store_id;
            const data = await pool
            .request()
            .input('STOREID', store_id)
            .execute('ST_STOCKSDETAIL_GetList_AdminWeb');
            const StocksDetails = data.recordsets[0];
            let result = moduleClass.listProductByStore(StocksDetails);
            return new ServiceResponse(true, '',result);
        }

        const data = await pool
            .request()
            .input('LOCKSHIFTID', lockshift_id)
            .execute(PROCEDURE_NAME.MD_LOCKSHIFT_CLOSE_GETLISTPRODUCTBYID_ADMINWEB);

        return new ServiceResponse(true, '', moduleClass.lockshiftProductList(data.recordset));
    } catch (e) {
        logger.error(e, {function: 'LockshiftCloseService.getListLockshiftProduct'});

        return new ServiceResponse(false, e.message);
    }
};

const getListLockshiftEquipment = async queryParams => {
    try {
        const pool = await mssql.pool;
        const lockshift_id = apiHelper.getValueFromObject(queryParams, 'lockshift_id');

        if (!checkValidId(lockshift_id)) {
            return new ServiceResponse(true, '', []);
        }

        const data = await pool
            .request()
            .input('LOCKSHIFTID', lockshift_id)
            .execute(PROCEDURE_NAME.MD_LOCKSHIFT_CLOSE_GETLISTEQUIPMENTBYID_ADMINWEB);

        return new ServiceResponse(true, '', moduleClass.lockshiftProductList(data.recordset));
    } catch (e) {
        logger.error(e, {function: 'LockshiftCloseService.getListLockshiftEquipment'});

        return new ServiceResponse(false, e.message);
    }
};

const getListLockshiftCustomer = async queryParams => {
    try {
        const pool = await mssql.pool;
        const lockshift_id = apiHelper.getValueFromObject(queryParams, 'lockshift_id');
        const auth_name = apiHelper.getValueFromObject(queryParams, 'auth_name');
        let parent_id = null;

        if (!checkValidId(lockshift_id)) {
            const currentLockshiftClose = await _getCurrentLockShiftClose(auth_name);

            if (!checkValidId(currentLockshiftClose?.parent_id)) {
                return new ServiceResponse(false, 'Bạn không có ca ngày hôm nay !');
            }

            parent_id = currentLockshiftClose?.parent_id;
        }

        const data = await pool
            .request()
            .input('LOCKSHIFTID', lockshift_id)
            .input('PARENTID', parent_id)
            .execute(PROCEDURE_NAME.MD_LOCKSHIFT_CLOSE_GETLISTCUSTOMER_ADMINWEB);

        return new ServiceResponse(true, '', moduleClass.customerList(data.recordset));
    } catch (e) {
        logger.error(e, {function: 'LockshiftCloseService.getListCustomer'});

        return new ServiceResponse(false, e.message);
    }
};

const getListProduct = async (queryParams = {}) => {
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
            .input('PRODUCTCATEGORYID', apiHelper.getValueFromObject(queryParams, 'product_category_id'))
            .input('PRODUCTMODELID', Number(apiHelper.getValueFromObject(queryParams, 'product_model_id')))
            .input('MANUFACTUREID', apiHelper.getValueFromObject(queryParams, 'manufacture_id'))
            .input('STOREID', apiHelper.getValueFromObject(queryParams, 'store_id'))
            .input('STOCKSID', apiHelper.getValueFromObject(queryParams, 'stocks_id'))
            .input('CATEGORYTYPE', apiHelper.getValueFromObject(queryParams, 'category_type'))
            .input('ISACTIVE', 1)
            .execute(PROCEDURE_NAME.MD_LOCKSHIFT_CLOSE_GETLISTPRODUCT_ADMINWEB);

        return new ServiceResponse(true, '', {
            data: moduleClass.productList(data.recordset),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordset),
        });
    } catch (e) {
        logger.error(e, {
            function: 'LockshiftCloseService.getListProduct',
        });
        return new ServiceResponse(false, e.message);
    }
};

const _getCurrentLockShiftClose = async username => {
    const shiftDate = moment().format('YYYY-MM-DD');

    try {
        const pool = await mssql.pool;

        const currentUserSchedule = await pool
            .request()
            .input('USERNAME', username)
            .input('SHIFTDATE', shiftDate)
            .execute(PROCEDURE_NAME.MD_LOCKSHIFT_CLOSE_GETCURRENTSCHEDULE_ADMINWEB);

        if (!currentUserSchedule.recordset[0]) return null;

        const {SHIFTID, STOREID, SHIFTLEADER} = currentUserSchedule.recordset[0];
        const parentLockshift = await pool
            .request()
            .input('SHIFTID', SHIFTID)
            .input('STOREID', STOREID)
            .input('SHIFTDATE', shiftDate)
            .execute(PROCEDURE_NAME.MD_LOCKSHIFT_CLOSE_GETPARENTLOCKSHIFT_ADMINWEB);

        if (!parentLockshift.recordset[0]?.RESULT) return null;

        const lockshiftData = {
            shift_date: shiftDate,
            parent_id: parentLockshift.recordset[0].RESULT,
            shift_id: SHIFTID,
            shift_leader: SHIFTLEADER,
            store_id: STOREID,
            lockshift_type: LOCKSHIFT_TYPE.CLOSE,
            is_locked_shift: LOCKED_SHIFT.NOT_LOCKED,
        };

        return lockshiftData;
    } catch (e) {
        logger.error(e, {
            function: 'LockshiftCloseService.getCurrentLockshiftClose',
        });
        return null;
    }
};

const _getDetailCurrentLockshiftClose = async username => {
    try {
        const currentLockshiftClose = await _getCurrentLockShiftClose(username);
        if (!currentLockshiftClose) return null;
        const {shift_id, store_id, parent_id} = currentLockshiftClose;

        const pool = await mssql.pool;
        const detailLockshiftRes = await pool
            .request()
            .input('SHIFTID', shift_id)
            .input('STOREID', store_id)
            .input('PARENTID', parent_id)
            .execute(PROCEDURE_NAME.MD_LOCKSHIFT_CLOSE_GETDETAILCURRENTLOCKSHIFT_ADMINWEB);

        if (detailLockshiftRes.recordsets) {
            const data = detailLockshiftRes.recordsets;

            const shiftDetail = data[0][0];
            const storeDetail = data[1][0];
            const parentShiftDetail = data[2][0];

            if (shiftDetail && storeDetail && parentShiftDetail) {
                const data = Object.assign(shiftDetail, storeDetail, parentShiftDetail);
                // field default data
                data.LOCKSHIFTTYPE = LOCKSHIFT_TYPE.CLOSE;
                data.ISLOCKEDSHIFT = LOCKED_SHIFT.NOT_LOCKED;
                data.SHIFTDATE = moment().format('YYYY-MM-DD');
                data.CREATEDUSER = username;

                return moduleClass.detail(data);
            }
        }
        return null;
    } catch (error) {
        logger.error(error, {
            function: 'LockshiftCloseService.getCurrentLockshiftClose',
        });
        return null;
    }
};

// kiểm tra xem có được phép kết ca hợp lệ hay không
const checkValidShift = async bodyParams => {
    try {
        const auth_name = apiHelper.getValueFromObject(bodyParams, 'auth_name');

        const currentLockshift = await _getCurrentLockShiftClose(auth_name);
        if (!currentLockshift) return new ServiceResponse(true, 'Bạn không có ca ngày hôm nay !',{});

        // checking is close lockshift
        const pool = await mssql.pool;

        const res = await pool
            .request()
            .input('SHIFTID', currentLockshift.shift_id)
            .input('STOREID', currentLockshift.store_id)
            .input('SHIFTDATE', currentLockshift.shift_date)
            .execute(PROCEDURE_NAME.MD_LOCKSHIFT_CLOSE_CHECKCLOSEDSHIFT_ADMINWEB);
        const hasPermission = await pool.request()
            .input('USERNAME', auth_name)
            .execute(PROCEDURE_NAME.MD_LOCKSHIFT_CHECK_HASPERMISSION);
          const isTrue = Boolean(hasPermission.recordset[0]?.RESULT) || false;
            

        if (res.recordset[0]?.RESULT === 1) {
            return new ServiceResponse(true, 'Ca đã được kết.',{ hasPermission: isTrue ,isValidShift: false});
        } else {
            return new ServiceResponse(true, 'Kiểm tra kết ca',{ hasPermission: isTrue ,isValidShift: true});
        }
    } catch (e) {
        logger.error(e, {
            function: 'LockshiftCloseService.checkValidShift',
        });
        return new ServiceResponse(false, e.message);
    }
};

// đối chiếu tồn phần mềm
const getProductInventory = async bodyParams => {
    try {
        const products = apiHelper.getValueFromObject(bodyParams, 'products');

        const pool = await mssql.pool;

        const promiseAll = products.map(async product => {
            const res = await pool
                .request()
                .input('PRODUCTID', product.product_id)
                .input('STOCKSID', product.stock_id)
                .execute(PROCEDURE_NAME.MD_LOCKSHIFT_CLOSE_GETPRODUCTINVENTORY_ADMINWEB);

            const inventory = res.recordset[0]?.INVENTORY || 0;

            return {
                ...product,
                inventory,
            };
        });

        const result = await Promise.all(promiseAll);

        return new ServiceResponse(true, '', result);
    } catch (e) {
        logger.error(e, {
            function: 'LockshiftCloseService.getProductInventory',
        });
        return new ServiceResponse(false, e.message);
    }
};

async function getCurrentShift(bodyParams) {
    try {
        const auth_name = apiHelper.getValueFromObject(bodyParams, 'auth_name');
        const detailLockshift = await _getDetailCurrentLockshiftClose(auth_name);

        if (!detailLockshift) {
            return new ServiceResponse(false, 'Bạn không có ca hôm nay !');
        }

        const response = {
            shift_name: detailLockshift.shift_name,
            shift_date: moment().format('DD/MM/YYYY'),
            shift_hourstart: detailLockshift.shift_hourstart,
            shift_minutestart: detailLockshift.shift_minutestart,
            shift_hourend: detailLockshift.shift_hourend,
            shift_minutend: detailLockshift.shift_minutend,
        };

        return new ServiceResponse(true, '', response);
    } catch (error) {
        logger.error(e, {
            function: 'LockshiftCloseService.getProductInventory',
        });
        return new ServiceResponse(false, e.message);
    }
}

module.exports = {
    getListLockshift,
    createOrUpdateLockshift,
    getDetailLockshift,
    statisticsLockshift,
    getListLockshiftCash,
    getListLockshiftProduct,
    getListLockshiftEquipment,
    getListLockshiftCustomer,
    getListProduct,
    checkValidShift,
    getProductInventory,
    getCurrentShift,
};
