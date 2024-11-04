module.exports.spName = {
    createOrUpdate: 'SL_INTERNALTRANSFERTYPE_CreateOrUpdate_AdminWeb',
    deleteMapping: 'SL_INTERNALTRANSFERTYPE_DeleteMapping_AdminWeb',
    getList: 'SL_INTERNALTRANSFERTYPE_GetList_AdminWeb',
    getById: 'SL_INTERNALTRANSFERTYPE_GetById_AdminWeb',

    getUserOptions: 'SL_INTERNALTRANSFERTYPE_GetUserOptions_AdminWeb',
    getReviewLevelList: 'SL_INTERNALTRANSFERTYPE_REVIEWLEVEL_GetList_AdminWeb',
    createReviewLevel: 'SL_INTERNALTRANSFERTYPE_REVIEWLEVEL_Create_AdminWeb',
    createApplyDepartmentReviewLevel: 'SL_INTERNALTRANSFERTYPE_REVIEWLEVEL_APPLYDEPARTMENT_Create_AdminWeb',
    createReviewLevelUser: 'SL_INTERNALTRANSFERTYPE_CreateReviewLevelUser_AdminWeb',
    getReviewInformation: 'SL_INTERNALTRANSFERTYPE_GetReviewInformation_AdminWeb',
    updateReview: 'SL_INTERNALTRANSFERTYPE_UpdateReview_AdminWeb',
};

module.exports.checkReview = (reviewList) => {
    const pending = 2,
        accept = 1,
        reject = 0;
    // check mức duyệt cuối đã duyệt => phiếu được duyệt
    const isCompleteAndReview = reviewList.find(
        (userReview) =>
            userReview.is_complete === 1 && (userReview.is_review === accept || userReview.is_review === reject),
    );

    if (isCompleteAndReview) return isCompleteAndReview.is_review;
    // check tất cả đã duyệt phiếu => phiếu được duyệt
    const isAllReview = reviewList.every(
        (userReview) => userReview.is_review === accept || userReview.is_review === reject,
    );
    if (!isAllReview) return pending;

    const isRejected = reviewList.some((userReview) => userReview.is_review === reject);
    if (isRejected) return reject;
    return accept;
};
