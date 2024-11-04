const convertIsApprove = (data) => {
    if (data === 1) {
        return 'Đã duyệt';
    } else if (data === 0) {
        return 'Không duyệt';
    } else {
        return 'Chưa duyệt';
    }
};

module.exports = {
    convertIsApprove,
};
