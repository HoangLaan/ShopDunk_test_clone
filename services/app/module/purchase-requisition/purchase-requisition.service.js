const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const mssql = require('../../models/mssql');
const moduleClass = require('./purchase-requisition.class');

const REVIEW_STATUS = {
  PENDING: 2,
  ACCEPT: 1,
  REJECT: 0,
};

const checkReview = (reviewList) => {
  // check mức duyệt cuối đã duyệt => phiếu được duyệt
  const isCompleteAndReview = reviewList.find(
    (userReview) =>
      userReview.is_complete === 1 &&
      (userReview.is_review === REVIEW_STATUS.ACCEPT || userReview.is_review === REVIEW_STATUS.REJECT),
  );

  if (isCompleteAndReview) return isCompleteAndReview.is_review;
  // check tất cả đã duyệt phiếu => phiếu được duyệt
  const isAllReview = reviewList.every(
    (userReview) => userReview.is_review === REVIEW_STATUS.ACCEPT || userReview.is_review === REVIEW_STATUS.REJECT,
  );
  if (!isAllReview) return REVIEW_STATUS.PENDING;

  const isRejected = reviewList.some((userReview) => userReview.is_review === REVIEW_STATUS.REJECT);
  if (isRejected) return reject;
  return REVIEW_STATUS.ACCEPT;
};

const getListCancel = async (queryParams) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request().execute('PO_PURCHASEREQUISITION_GetListCancel_Service');

    const dataList = moduleClass.list(data.recordsets[0]);
    const userReviewData = moduleClass.reviewList(data.recordsets[1]);

    dataList.forEach((item) => {
      item.review_level_user_list = userReviewData.filter(
        (userReview) => +userReview.purchase_requisition_id === +item.purchase_requisition_id,
      );
      item.is_reviewed = checkReview(item.review_level_user_list);
    });

    const result = dataList.filter((item) => item.is_reviewed === REVIEW_STATUS.ACCEPT);

    return new ServiceResponse(true, '', result);
  } catch (e) {
    logger.error(e, { function: 'purchaseRequisitionService.getList' });
    return new ServiceResponse(true, '', {});
  }
};

const cancelTask = async () => {
  try {
    const listPRRes = await getListCancel();
    const listPR = listPRRes.getData();
    for (let i = 0; i < listPR.length; i++) {
      const prItem = listPR[i];
      console.log('~ cancelTask prItem.purchase_requisition_id >>>', prItem.purchase_requisition_id)
      const pool = await mssql.pool;
      await pool
        .request()
        .query(
          `UPDATE PO_PURCHASEREQUISITION SET PRSTATUSID = 4 WHERE PURCHASEREQUISITIONID = ${prItem.purchase_requisition_id}`,
        );
    }
    return;
  } catch (error) {
    console.log('purchaseRequisitionService.cancel', error?.message);
  }
};

const purchaseRequisitionService = {
  cancelTask,
};

module.exports = purchaseRequisitionService;
