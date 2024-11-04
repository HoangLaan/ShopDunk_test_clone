import { showToast } from 'utils/helpers';

const mappingData = (data, mapping) => {
  return data.map((product) => {
    return mapping.reduce((acc, item) => {
      acc[item[1] ?? item[0]] = product[item[0]];
      return acc;
    }, {});
  });
};

const convertFromPurchaseOrder = (purchaseOrder) => {
  let productList = mappingData(purchaseOrder?.product_list, [
    ['purchase_order_detail_id'],
    ['purchase_order_code'],
    ['purchase_order_id'],
    ['product_name'],
    ['product_code'],
    ['product_id'],
    ['unit_name', 'product_unit'],
    ['cost_price', 'product_price'],
    ['vat_value'],
    ['quantity', 'product_quantity'],
    ['quantity', 'total_quantity'],
    ['total_price', 'into_money'],
    ['stocks_account_id', ''],
    ['discount_percent'],
    ['invoice_product_quantity'],
  ]);

  // update remaining product quantity
  productList.forEach((product) => {
    product.product_quantity = product.total_quantity - product.invoice_product_quantity || 0;
    product.max_quantity = product.total_quantity - product.invoice_product_quantity || 0;
  });

  // remove product have quantity = 0
  productList = productList?.filter((product) => product.product_quantity);

  if (!productList || productList?.length === 0) {
    showToast.warning('Bạn đã tạo đủ sản phẩm trong hóa đơn cho đơn mua hàng !');
  }

  // attach stocks in product data
  productList = productList?.map((product) => {
    const stocksInProduct = purchaseOrder?.stocks_in_request_list?.filter((_) =>
      _?.product_list?.find((_product) => _product.product_id == product?.product_id),
    );

    return {
      ...product,
      stocks_in_request_list: stocksInProduct,
      purchase_cost_total: stocksInProduct?.reduce((acc, stocksIn) => {
        return acc + stocksIn?.product_list?.find((_) => _.product_id == product?.product_id)?.total_cost_price || 0;
      }, 0),
      purchase_cost: stocksInProduct?.reduce((acc, stocksIn) => {
        return acc + stocksIn?.product_list?.find((_) => _.product_id == product?.product_id)?.total_cost_price || 0;
      }, 0),
    };
  });

  return productList;
};

export { mappingData, convertFromPurchaseOrder };
