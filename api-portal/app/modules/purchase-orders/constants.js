const spName = {
    genPurchaseOrderNo: 'SL_PURCHASEORDER_GenPurchaseOrderNo_AdminWeb',
    getList: 'SL_PURCHASEORDER_GetList_AdminWeb',
    getById: 'SL_PURCHASEORDER_GetById_AdminWeb',
    createOrUpdate: 'SL_PURCHASEORDER_CreateOrUpdate_AdminWeb',
    createOrUpdateDetail: 'SL_PURCHASEORDER_DETAIL_CreateOrUpdate_AdminWeb',
    countOrderStatus: 'SL_PURCHASEORDER_CountOrderStatus_AdminWeb',
    getByListId: 'SL_PURCHASEORDER_GetByListId_AdminWeb',
    getByIdMulti: 'SL_PURCHASEORDER_GetByIdMulti_AdminWeb',
    getListReturned: 'SL_PURCHASEORDER_GetListReturned_AdminWeb',
};

const INVOCIE_STATUS = {
    NOT_HAVE: 0,
    ENOUGH: 1,
    NOT_ENOUGH: 2,
};

const PAYMENT_DUE_STATUS = {
    DONE: 1,
    NOT_EXPIRED: 2,
    EXPIRED: 3,
};

module.exports = {
    spName,
    INVOCIE_STATUS,
    PAYMENT_DUE_STATUS,
};
