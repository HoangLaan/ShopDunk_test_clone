class PromotionnalSchema {
  constructor(code_type, code_value, max_value_reduce, min_total_money, coupon_code, quantity, percent_value) {
    this.code_value = code_value; // gia tri cua code
    this.code_type = code_type; // loai 1 la VND 2 la %
    this.max_value_reduce = max_value_reduce; // gia tri duoc giam toi da
    this.min_total_money = min_total_money; // gia gi tri hang toi thieu duoc ap dung
    this.max_total_money = min_total_money; // gia gi tri hang toi da duoc ap dung
    this.coupon_code = coupon_code; // ma code
    this.quantity = quantity; // so luong
    this.percent_value = percent_value; // ti le tinh theo phan tram
  }
}

export { PromotionnalSchema };
