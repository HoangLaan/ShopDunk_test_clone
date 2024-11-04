class UnitConversionSchema {
  constructor(sub_unit_id, main_unit_id, note, density_value_1 = 1, density_value_2 = 1) {
    this.sub_unit_id = sub_unit_id;
    this.main_unit_id = main_unit_id;
    this.note = note;
    this.density_value_1 = density_value_1;
    this.density_value_2 = density_value_2;
  }
}

class BaseInventorySchema {
  constructor(
    pro_inventory_id,
    date_from,
    date_to,
    quantity_in_stock_min = 0,
    quantity_in_stock_max = 0,
    unit,
    is_force_out = 0,
    max_storage_time = 0,
  ) {
    this.pro_inventory_id = pro_inventory_id;
    this.date_from = date_from;
    this.date_to = date_to;
    this.quantity_in_stock_min = quantity_in_stock_min;
    this.quantity_in_stock_max = quantity_in_stock_max;
    this.unit = unit;
    this.is_force_out = is_force_out;
    this.max_storage_time = max_storage_time;
    this.pro_inventory_type = 1;
  }
}

class MinInventorySchema {
  constructor(
    pro_inventory_id,
    date_from,
    date_to,
    quantity_in_stock_min = 0,
    quantity_in_stock_max = 0,
    unit_id,
    is_force_out = 0,
    max_storage_time = 0,
    store_id,
    stock_type_id,
  ) {
    this.pro_inventory_id = pro_inventory_id;
    this.date_from = date_from;
    this.date_to = date_to;
    this.quantity_in_stock_min = quantity_in_stock_min;
    this.quantity_in_stock_max = quantity_in_stock_max;
    this.unit_id = unit_id;
    this.is_force_out = is_force_out;
    this.max_storage_time = max_storage_time;
    this.store_id = store_id;
    this.stock_type_id = stock_type_id;
    this.pro_inventory_type = 2;
  }
}

export { UnitConversionSchema, BaseInventorySchema, MinInventorySchema };
