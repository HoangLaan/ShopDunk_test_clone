class ReviewLevelUserSchema {
  constructor(
    review_level_id,
    review_level_name,
    order_index,
    review_level_user_id,
    department_id,
    user_review_list = [],
    is_complete_review = false,
    is_auto_review = false,
  ) {
    this.review_level_name = review_level_name;
    this.order_index = order_index;
    this.review_level_id = review_level_id;
    this.review_level_user_id = review_level_user_id;
    this.department_id = department_id;
    this.user_review_list = user_review_list;
    this.is_complete_review = is_complete_review;
    this.is_auto_review = is_auto_review;
  }
}

export { ReviewLevelUserSchema };
