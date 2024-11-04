const reviewStatus = {
    PENDING: 2,
    ACCEPT: 1,
    REJECT: 0,
    NOT_REVIEW: 3,
};

// 0: chưa xuất
// 1: đã xuất
// 2: đã trả 1 phần
// 3: đã trả hết
const borrowStatus = {
    NOT_EXPORT: 0,
    EXPORTED: 1,
    RETURNED_PART: 2,
    RETURNED_ALL: 3,
};

module.exports = {
    reviewStatus,
    borrowStatus,
};
