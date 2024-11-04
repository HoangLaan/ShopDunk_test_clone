class ReviewLevelUserSchema {
  constructor(review_level_id, review_level_name, order_index, is_complete_review) {
    this.review_level_user_id = undefined;
    this.review_level_name = review_level_name;
    this.user_review_list = [];
    this.is_complete_review = is_complete_review;
    this.is_auto_review = false;
    this.order_index = order_index;
    this.review_level_id = review_level_id;
  }
}

export { ReviewLevelUserSchema };
