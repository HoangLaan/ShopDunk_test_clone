class ProductSchema {
  constructor(
    product_id,
    product_code,
    product_name,
    category_name,
    unit_name,
    is_active,
    purchase_order_id,
    quantity = 1,
    cost_price,
    total_price,
    purchase_order_detail_id,
  ) {
    this.product_id = product_id;
    this.product_code = product_code;
    this.product_name = product_name;
    this.category_name = category_name;
    this.unit_name = unit_name;
    this.is_active = is_active;
    this.purchase_order_detail_id = purchase_order_detail_id;
    this.purchase_order_id = purchase_order_id;
    this.quantity = quantity;
    this.cost_price = cost_price;
    this.total_price = total_price;
  }
}

export { ProductSchema };
