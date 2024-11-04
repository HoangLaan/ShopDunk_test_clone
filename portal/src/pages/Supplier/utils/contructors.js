class SupplierApiSchema {
  constructor(supplier_api_id, api_url, account, password, is_default = 0, is_show_password = false) {
    this.supplier_api_id = supplier_api_id;
    this.api_url = api_url;
    this.account = account;
    this.password = password;
    this.is_default = is_default;
    this.is_show_password = is_show_password;
  }
}

export { SupplierApiSchema };
