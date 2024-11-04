const convertDataToBorrowTypeList = dataSql => {
    return dataSql.reduce((data, item) => {
        const indexBorrowType = data.findIndex(dataItem => dataItem.borrow_type_id === item.borrow_type_id);
        if (indexBorrowType === -1) {
            if(item.is_auto_review){
                data.push({
                    borrow_type_id: item.borrow_type_id || '',
                    borrow_type_name: item.borrow_type_name || '',
                    is_auto_review: item.is_auto_review || false,
                    review_level_list: [],
                });
                return data;
            }
            data.push({
                borrow_type_id: item.borrow_type_id || '',
                borrow_type_name: item.borrow_type_name || '',
                is_auto_review: item.is_auto_review || false,
                review_level_list: [
                    {
                        borrow_review_level_id: item.borrow_review_level_id || -1,
                        borrow_review_level_name: item.borrow_review_level_name || '',
                        user_review_list: [
                            {
                                user_name: item.user_review || '',
                                full_name: item.full_name || '',
                            },
                        ],
                    },
                ],
            });
            return data;
        }
        const reviewLevelList = data[indexBorrowType].review_level_list || [];
        const indexReviewLevel = reviewLevelList.findIndex(
            reviewLevelItem => reviewLevelItem.borrow_review_level_id === item.borrow_review_level_id,
        );
        if (indexReviewLevel === -1) {
            reviewLevelList.push({
                borrow_review_level_id: item.borrow_review_level_id || -1,
                borrow_review_level_name: item.borrow_review_level_name || '',
                user_review_list: [
                    {
                        user_name: item.user_review || '',
                        full_name: item.full_name || '',
                    },
                ],
            });
            return data;
        }
        const userReviewList = reviewLevelList[indexReviewLevel].user_review_list;
        const indexUserReview = userReviewList.findIndex(
            userReviewItem => userReviewItem.user_name === item.user_review,
        );
        if (indexUserReview === -1) {
            userReviewList.push({
                user_name: item.user_review || '',
                full_name: item.full_name || '',
            });
            return data;
        }

        return data;
    }, []);
};

module.exports = {
    convertDataToBorrowTypeList,
};
