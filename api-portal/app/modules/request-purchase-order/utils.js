const checkReview = (reviewList) => {
  const pending = 2, accept = 1, reject = 0;
  // check mức duyệt cuối đã duyệt => phiếu được duyệt
  const isCompleteAndReview = reviewList.find(
      (userReview) => userReview.is_complete === 1 && (userReview.is_reviewed === accept || userReview.is_reviewed === reject),
  );

  if (isCompleteAndReview) return isCompleteAndReview.is_reviewed;
  // check tất cả đã duyệt phiếu => phiếu được duyệt
  const isAllReview = reviewList.every((userReview) => userReview.is_reviewed === accept || userReview.is_reviewed === reject);
  if(!isAllReview) return pending;

  const isRejected = reviewList.some((userReview) => userReview.is_reviewed === reject);
  if(isRejected) return reject;
  return accept;

};

module.exports = {
  checkReview,
}
