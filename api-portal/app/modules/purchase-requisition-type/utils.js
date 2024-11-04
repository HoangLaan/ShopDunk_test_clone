const checkReview = (reviewList) => {
    // check mức duyệt cuối đã duyệt => phiếu được duyệt
    const isCompleteAndReview = reviewList.find(
        (userReview) => userReview.is_complete === 1 && userReview.is_review === 1,
    );
    if (isCompleteAndReview) {
        return true;
    } else {
        // check tất cả đã duyệt phiếu => phiếu được duyệt
        const isAllReview = reviewList.every((userReview) => userReview.is_review === 1);
        if (isAllReview) {
            return true;
        }
    }

    return false;
};

module.exports = {
    checkReview,
};
