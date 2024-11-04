const lockShiftClass = require('./lockshift-open.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const {convertTime} = require('../../common/helpers/datetime.helper');

/**
 * Get list
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListLockShiftOpen = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);

    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('PAGESIZE', itemsPerPage)
      .input('PAGEINDEX', currentPage)
      .input('STOREID', apiHelper.getValueFromObject(queryParams, 'store_id'))
      .input('SHIFTID', apiHelper.getValueFromObject(queryParams, 'shift_id'))
      .input('SHIFTRECIPIENT', apiHelper.getValueFromObject(queryParams, 'shift_recipient'))
      .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'created_date_from'))
      .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'created_date_to'))
      .execute(PROCEDURE_NAME.MD_LOCKSHIFT_OPEN_GETLIST_ADMINWEB);
    const dataRecord = data.recordset;
    const totalItem = dataRecord[0]?.TOTALITEMS

    return new ServiceResponse(true, '', {
      data: lockShiftClass.list(dataRecord),
      page: currentPage,
      limit: itemsPerPage,
      total: totalItem,
    });
  } catch (e) {
    logger.error(e, {function: 'lockShiftOpenService.getListLockShiftOpen'});
    return new ServiceResponse(false, e.message);
  }
};

const checkIsAllowOpenShift = async (userName) => {
  try {
    const pool = await mssql.pool;
    const responseData = await pool.request()
      .input('USERNAME', userName)
      .execute(PROCEDURE_NAME.MD_LOCKSHIFT_CHECK_ALLOWOPENLOCKSHIFT_ADMINWEB);
    const hasPermission = await pool.request()
      .input('USERNAME', userName)
      .execute(PROCEDURE_NAME.MD_LOCKSHIFT_CHECK_HASPERMISSION);
    const isTrue = Boolean(hasPermission.recordset[0]?.RESULT) || false;
    const isAllow = Boolean(responseData.recordset[0]?.RESULT) || false;
    return new ServiceResponse(true, '', {hasPermission: isTrue,
    isAllowOpenShift: isAllow
    });
  } catch (e) {
    logger.error(e, {function: 'LockShiftOpenService.getDetailLockShift'});
    return new ServiceResponse(false, e.message);
  }
};


const getDetailLockShift = async (username,bodyQuery={}) => {
  try {
    const pool = await mssql.pool;
    const responseData = await pool.request()
      .input("LOCKSHIFTID",bodyQuery?.lockShiftId || null)
      .input('USERNAME', username)
      .execute(PROCEDURE_NAME.MD_LOCKSHIFT_OPEN_GETBYID_ADMINWEB);

    let lockshift = responseData.recordset[0];

    if (lockshift) {
      lockshift = lockShiftClass.detail(lockshift);
      // convert work time
      lockshift.work_time = convertTime(lockshift?.shift_hourstart, lockshift?.shift_minutestart, lockshift?.shift_hourend, lockshift.shift_minutend);
      return new ServiceResponse(true, '', lockshift);
    }
    return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, {function: 'LockShiftOpenService.getDetailLockShift'});

    return new ServiceResponse(false, e.message);
  }
};


const statisticsLockShift = async (username,bodyQuery={}) => {
  try {
    const pool = await mssql.pool;
    const responseData = await pool
      .request()
      .input('LOCKSHIFTID', bodyQuery?.lockShiftId || null)
      .input('USERNAME', username)
      .execute(PROCEDURE_NAME.MD_LOCKSHIFT_OPEN_GETSTATISTICSBYID_ADMINWEB);

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
        order_count
      });
    }
    return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
  } catch (e) {
    logger.error(e, {function: 'LockShiftOpenService.statisticsLockShift'});
    return new ServiceResponse(false, e.message);
  }
};

const getListLockShiftCash = async (username,bodyQuery={}) => {
  try {
    console.log(bodyQuery?.lockShiftId)
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input("LOCKSHIFTID",bodyQuery?.lockShiftId || null)
      .input('USERNAME', username)
      .execute(PROCEDURE_NAME.MD_LOCKSHIFT_OPEN_CASH_GETLIST_ADMINWEB);
    const dataRecord = data.recordset;
    return new ServiceResponse(true, '', {
      data: lockShiftClass.listCash(dataRecord),
    });
  } catch (e) {
    logger.error(e, {function: 'lockShiftOpenService.getListCashShiftOpen'});
    return new ServiceResponse(false, e.message);
  }
};

const getListLockShiftEquipment = async (username,bodyQuery={}) => {
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input("LOCKSHIFTID",bodyQuery?.lockShiftId || null)
      .input('USERNAME', username)
      .execute(PROCEDURE_NAME.MD_LOCKSHIFT_OPEN_EQUIPMENT_GETLIST_ADMINWEB);
    const dataRecord = data.recordset;
    return new ServiceResponse(true, '', {
      data: lockShiftClass.listEquipment(dataRecord),
    });
  } catch (e) {
    logger.error(e, {function: 'lockShiftOpenService.getListLockShiftOpen'});
    return new ServiceResponse(false, e.message);
  }
};

const getListLockShiftProduct = async (username,bodyQuery={}) => {
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input("LOCKSHIFTID",bodyQuery?.lockShiftId || null)
      .input('USERNAME', username)
      .execute(PROCEDURE_NAME.MD_LOCKSHIFT_OPEN_PRODUCT_GETLIST_ADMINWEB);
    const dataRecord = data.recordset;
    return new ServiceResponse(true, '', {
      data: lockShiftClass.listProduct(dataRecord),
    });
  } catch (e) {
    logger.error(e, {function: 'lockShiftOpenService.getListLockShiftProduct'});
    return new ServiceResponse(false, e.message);
  }
};

const getListLockShiftCustomer = async (username,bodyQuery={}) => {
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input("LOCKSHIFTID",bodyQuery?.lockShiftId || null)
      .input('USERNAME', username)
      .execute(PROCEDURE_NAME.MD_LOCKSHIFT_OPEN_CUSTOMER_GETLIST_ADMINWEB);
    const dataRecord = data.recordset;
    return new ServiceResponse(true, '', {
      data: lockShiftClass.listCustomer(dataRecord),
    });
  } catch (e) {
    logger.error(e, {function: 'lockShiftOpenService.getListLockShiftCustomer'});
    return new ServiceResponse(false, e.message);
  }
};


const checkIsLockedShift = async (lockShiftId) => {
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('LOCKSHIFTID', lockShiftId)
      .execute(PROCEDURE_NAME.MD_LOCKSHIFT_CHECK_ISLOCKEDSHIFT_ADMINWEB);
    return data.recordset[0]['RESULT']
  } catch (e) {
    logger.error(e, {function: 'lockShiftOpenService.checkIsLockedShift'});
    return new ServiceResponse(false, e.message);
  }
}


const createOrUpdateLockShiftOpen = async (body = {}) => {
  let lockShiftId = apiHelper.getValueFromObject(body, 'lockshift_id')
  const listCashItems = apiHelper.getValueFromObject(body, 'cash_list', [])
  const listProductItems = apiHelper.getValueFromObject(body, 'product_list', [])
  const listEquipmentItems = apiHelper.getValueFromObject(body, 'equipment_list', [])
  const listCustomerItems = apiHelper.getValueFromObject(body, 'customer_list', [])
  const storeId = apiHelper.getValueFromObject(body, 'store_id',5)
  const shiftNote = apiHelper.getValueFromObject(body, 'shift_note')
  const isLockedShift = await checkIsLockedShift(lockShiftId);
  if (isLockedShift === 1)
    return new ServiceResponse(false, "Ca đã khóa bởi quản lý, không thể sửa");
  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);
  try {
    await transaction.begin();
    if (!lockShiftId || lockShiftId == -1) {
      const requestShift = new sql.Request(transaction);
      const shiftOpen = await requestShift
        .input('NOTE', shiftNote)
        .input('SHIFTLEADER', apiHelper.getValueFromObject(body, 'shift_leader',''))
        .input('USERNAME', apiHelper.getValueFromObject(body, 'created_user'))
        .execute(PROCEDURE_NAME.MD_LOCKSHIFT_OPENSHIFT_ADMINWEB);
      lockShiftId = shiftOpen.recordset[0]['RESULT']
      if (!lockShiftId)
        throw new Error("Lỗi tạo nhận ca");
    }
    let totalMoney = 0;
    for (let i = 0; i < listCashItems.length; i++) {
      if ((listCashItems[i].actual_quantity === null
        || listCashItems[i].actual_quantity === undefined)
        && listCashItems[i].actual_quantity_parent === null)
        continue;
      const request = new sql.Request(transaction);
      await request
        .input('LOCKSHIFTID', lockShiftId)
        .input('DENOMINATIONSID', listCashItems[i].denomination_id)
        .input('ACTUALQUANTITY', listCashItems[i].actual_quantity)
        .input('NOTE', listCashItems[i].note)
        .input('TOTALMONEY', listCashItems[i].actual_quantity * listCashItems[i].denomination_value)
        .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'created_user'))
        .execute(PROCEDURE_NAME.MD_LOCKSHIFT_OPEN_CASH_CREATEORUPDATE_ADMINWEB);
      totalMoney += listCashItems[i].denomination_value * listCashItems[i].actual_quantity;
    }
    for (let i = 0; i < listProductItems.length; i++) {
      if ((listProductItems[i].actual_inventory === null
        || listProductItems[i].actual_inventory === undefined)
        && listProductItems[i].parent_inventory === null)
        continue;
      const request2 = new sql.Request(transaction);
      const res = await request2
        .input('LOCKSHIFTID', lockShiftId)
        .input('PRODUCTID', listProductItems[i].product_id)
        .input('ACTUALINVENTORY', listProductItems[i].actual_inventory)
        .input('NOTE', listProductItems[i].note)
        .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'created_user'))
        .execute(PROCEDURE_NAME.MD_LOCKSHIFT_OPEN_PRODUCTLIST_CREATEORUPDATE_ADMINWEB);
    }
    for (let i = 0; i < listEquipmentItems.length; i++) {
      if ((listEquipmentItems[i].actual_inventory === null
        || listEquipmentItems[i].actual_inventory === undefined)
        && listEquipmentItems[i].parent_inventory === null)
        continue;
      const request3 = new sql.Request(transaction);
      await request3
        .input('LOCKSHIFTID', lockShiftId)
        .input('EQUIPMENTID', listEquipmentItems[i].equipment_id)
        .input('ACTUALINVENTORY', listEquipmentItems[i].actual_inventory)
        .input('NOTE', listEquipmentItems[i].note)
        .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'created_user'))
        .execute(PROCEDURE_NAME.MD_LOCKSHIFT_OPEN_EQUIPMENTLIST_CREATEORUPDATE_ADMINWEB);
    }
    for (let i = 0; i < listCustomerItems.length; i++) {
      const request4 = new sql.Request(transaction);
      await request4
        .input('LOCKSHIFTID', lockShiftId)
        .input('MEMBERID', listCustomerItems[i].member_id)
        .input('NOTE', listCustomerItems[i].note)
        .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'created_user'))
        .execute(PROCEDURE_NAME.MD_LOCKSHIFT_OPEN_CUSTOMERLIST_CREATEORUPDATE_ADMINWEB);
    }

    const requestUpdateShift = new sql.Request(transaction);
    const res = await requestUpdateShift
      .input('LOCKSHIFTID', lockShiftId)
      .input('TOTALCASH', totalMoney)
      .input('NOTE', shiftNote)
      .input('STOREID',storeId)
      .input('SHIFTLEADER',apiHelper.getValueFromObject(body, 'shift_leader'))
      .input('SHIFTID',apiHelper.getValueFromObject(body, 'shift_id'))
      .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'created_user'))
      .execute(PROCEDURE_NAME.MD_LOCKSHIFT_CREATEORUPDATE_ADMINWEB);
     lockShiftId = res.recordset[0].RESULT;
    await transaction.commit();
    return new ServiceResponse(true, 'Cập nhật tiền ca thành công', {lockShiftId});
  } catch (error) {
    await transaction.rollback();
    logger.error(error, {function: 'lockShiftOpenService.updateLockShiftCash'});
    return new ServiceResponse(false, error.message);
  }
};



module.exports = {
  getListLockShiftOpen,
  getListLockShiftCash,
  createOrUpdateLockShiftOpen,
  getListLockShiftEquipment,
  checkIsAllowOpenShift,
  getDetailLockShift,
  statisticsLockShift,
  getListLockShiftCustomer,
  getListLockShiftProduct,

};
